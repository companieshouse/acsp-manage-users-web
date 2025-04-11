import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord, MemberRawViewData, PageNumbers, PageQueryParams } from "../../types/utilTypes";
import { TableEntry } from "../../types/viewTypes";
import { getHiddenText, getLink } from "../../lib/utils/viewUtils";
import { setExtraData, getLoggedUserAcspMembership, deleteExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getAcspMemberships, membershipLookup } from "../../services/acspMemberService";
import { validateEmailString } from "../../lib/validation/email.validation";
import { getChangeMemberRoleFullUrl, getRemoveMemberCheckDetailsFullUrl } from "../../lib/utils/urlUtils";
import { buildPaginationElement, getCurrentPageNumber, setLangForPagination, stringToPositiveInteger } from "../../lib/helpers/buildPaginationHelper";
import { validatePageNumber } from "../../lib/validation/page.number.validation";
import { validateActiveTabId } from "../../lib/validation/string.validation";
import { acspLogger } from "../../lib/helpers/acspLogger";
import { getDisplayNameOrEmail, getDisplayNameOrLangKeyForNotProvided } from "../../lib/utils/userDisplayUtils";

export const manageUsersControllerGet = async (req: Request, res: Response): Promise<void> => {

    if (isCancelSearch(req)) {
        deleteExtraData(req.session, constants.SEARCH_STRING_EMAIL);
    }
    const searchStringEmail: string | undefined = getExtraData(req.session, constants.SEARCH_STRING_EMAIL);

    const viewData = await getViewData(req, searchStringEmail);

    acspLogger(req.session, manageUsersControllerGet.name, `Rendering manage users page`);
    res.render(constants.MANAGE_USERS_PAGE, { ...viewData });
};

export const manageUsersControllerPost = async (req: Request, res: Response): Promise<void> => {

    const trimmedSearch = req.body.search.trim().toLowerCase();

    setExtraData(req.session, constants.SEARCH_STRING_EMAIL, trimmedSearch);

    const { userRole } = getLoggedUserAcspMembership(req.session);

    const url = userRole === UserRole.STANDARD
        ? `${constants.VIEW_USERS_FULL_URL}`
        : `${constants.MANAGE_USERS_FULL_URL}`;

    res.redirect(url);
};

export const getTitle = (translations: AnyRecord, loggedInUserRole: UserRole, isError: boolean): string => {
    const baseTitle = loggedInUserRole === UserRole.STANDARD ? translations.page_header_standard : translations.page_header;
    const titleEnd = translations.title_end;
    return isError ? `${translations.title_error}${baseTitle}${titleEnd}` : `${baseTitle}${titleEnd}`;
};

export const getViewData = async (req: Request, search: string | undefined = undefined): Promise<AnyRecord> => {
    deleteExtraData(req.session, constants.USER_ROLE_CHANGE_DATA);
    deleteExtraData(req.session, constants.IS_SELECT_USER_ROLE_ERROR);
    deleteExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);

    const { ownerPage, adminPage, standardPage } = getPageQueryParams(req);
    const activeTabId = getActiveTabId(req);

    const pageNumbers: PageNumbers = {
        ownerPage: stringToPositiveInteger(ownerPage),
        adminPage: stringToPositiveInteger(adminPage),
        standardPage: stringToPositiveInteger(standardPage)
    };

    const translations = getTranslationsForView(req.lang, constants.MANAGE_USERS_PAGE);
    const { userRole, acspNumber, acspName } = getLoggedUserAcspMembership(req.session);

    const viewData: AnyRecord = {
        lang: translations,
        backLinkUrl: constants.DASHBOARD_FULL_URL,
        addUserUrl: constants.ADD_USER_FULL_URL,
        companyName: acspName,
        companyNumber: acspNumber,
        loggedInUserRole: userRole,
        cancelSearchHref: `${getCancelSearchHref(userRole)}?${constants.CANCEL_SEARCH}`,
        accountOwnersTabId: constants.ACCOUNT_OWNERS_ID,
        administratorsTabId: constants.ADMINISTRATORS_ID,
        standardUsersTabId: constants.STANDARD_USERS_ID,
        templateName: constants.MANAGE_USERS_PAGE,
        manageUsersTabId: activeTabId,
        MATOMO_ADD_USER_GOAL_ID: constants.MATOMO_ADD_USER_GOAL_ID,
        MATOMO_REMOVE_USER_GOAL_ID: constants.MATOMO_REMOVE_USER_GOAL_ID
    };

    let errorMessage;
    const isSearchAString = typeof search === "string";
    const isSearchValid = !isSearchAString || validateEmailString(search);

    if (isSearchAString && !isSearchValid) {
        errorMessage = constants.ERRORS_ENTER_AN_EMAIL_ADDRESS_IN_THE_CORRECT_FORMAT;
        viewData.errors = {
            search: {
                text: errorMessage
            }
        };
        viewData.search = search;
    }

    const formatMember = (member: AcspMembership) => ({
        id: member.id,
        userId: member.userId,
        userEmail: member.userEmail,
        acspNumber: member.acspNumber,
        userRole: member.userRole,
        userDisplayName: getDisplayNameOrLangKeyForNotProvided(member),
        displayNameOrEmail: getDisplayNameOrEmail(member)
    });

    if (isSearchValid && isSearchAString) {
        try {
            const foundMembership = await membershipLookup(req, acspNumber, search);
            if (foundMembership.items.length > 0) {
                const foundMember = foundMembership.items[0];
                setTabIds(viewData, foundMember.userRole);

                const formattedFoundMember = [
                    foundMember
                ].map(formatMember);

                setExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP, formattedFoundMember);

                const hasChangeRoleLink: boolean = foundMember.userRole === UserRole.OWNER ? userRole !== UserRole.ADMIN && userRole !== UserRole.STANDARD : userRole !== UserRole.STANDARD;
                const hasRemoveLink: boolean = foundMember.userRole === UserRole.OWNER ? userRole !== UserRole.ADMIN && userRole !== UserRole.STANDARD : userRole !== UserRole.STANDARD;
                const memberData = getUserTableData(foundMembership.items, translations, hasChangeRoleLink, hasRemoveLink);
                switch (foundMember.userRole) {
                case UserRole.OWNER:
                    viewData.accountOwnersTableData = memberData;
                    break;
                case UserRole.ADMIN:
                    viewData.administratorsTableData = memberData;
                    break;
                case UserRole.STANDARD:
                    viewData.standardUsersTableData = memberData;
                    break;
                }
            } else {
                viewData.manageUsersTabId = constants.ACCOUNT_OWNERS_TAB_ID;
            }
        } catch (error) {
            acspLogger(req.session, getViewData.name, `/acsps/${acspNumber}/memberships/lookup Membership for email entered not found.`, true);
            viewData.manageUsersTabId = constants.ACCOUNT_OWNERS_TAB_ID;
        }
        viewData.search = search;
    } else {
        const [ownerMemberRawViewData, adminMemberRawViewData, standardMemberRawViewData] = await Promise.all([
            getMemberRawViewData(req, acspNumber, pageNumbers, UserRole.OWNER, constants.ACCOUNT_OWNERS_TAB_ID, translations, userRole),
            getMemberRawViewData(req, acspNumber, pageNumbers, UserRole.ADMIN, constants.ADMINISTRATORS_TAB_ID, translations, userRole),
            getMemberRawViewData(req, acspNumber, pageNumbers, UserRole.STANDARD, constants.STANDARD_USERS_TAB_ID, translations, userRole)
        ]);

        viewData.accountOwnersTableData = getUserTableData(ownerMemberRawViewData.memberships, translations, userRole === UserRole.OWNER, userRole === UserRole.OWNER);
        viewData.administratorsTableData = getUserTableData(adminMemberRawViewData.memberships, translations, userRole !== UserRole.STANDARD, userRole !== UserRole.STANDARD);
        viewData.standardUsersTableData = getUserTableData(standardMemberRawViewData.memberships, translations, userRole !== UserRole.STANDARD, userRole !== UserRole.STANDARD);

        viewData.accoutOwnerPadinationData = ownerMemberRawViewData.pagination;
        viewData.adminPadinationData = adminMemberRawViewData.pagination;
        viewData.standardUserPadinationData = standardMemberRawViewData.pagination;

        const allMembersForThisAcsp = [
            ...ownerMemberRawViewData.memberships,
            ...adminMemberRawViewData.memberships,
            ...standardMemberRawViewData.memberships
        ].map(formatMember);

        setExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP, allMembersForThisAcsp);
    }

    const title = getTitle(translations, userRole, !!errorMessage);
    viewData.title = title;

    return viewData;
};

const getActiveTabId = (req: Request): string => validateActiveTabId(req.query?.activeTabId as string) ? req.query.activeTabId as string : constants.ACCOUNT_OWNERS_TAB_ID;

const getCancelSearchHref = (userRole: UserRole): string => userRole === UserRole.STANDARD ? constants.VIEW_USERS_FULL_URL : constants.MANAGE_USERS_FULL_URL;

const getUserTableData = (membership: AcspMembership[], translations: AnyRecord, hasChangeRoleLink: boolean, hasRemoveLink: boolean): TableEntry[][] => {
    const userTableDate: TableEntry[][] = [];
    for (const member of membership) {
        const displayName = getDisplayNameOrLangKeyForNotProvided(member);
        const tableEntry: TableEntry[] = [
            { text: member.userEmail },
            { text: displayName === constants.LANG_KEY_FOR_NOT_PROVIDED ? String(translations.not_provided) : displayName }
        ];

        const usernameOrEmail = member.userDisplayName === constants.NOT_PROVIDED ? member.userEmail : member.userDisplayName;

        if (hasChangeRoleLink) {
            const fullUrl = getChangeMemberRoleFullUrl(member.id);
            const hiddenText = getHiddenText(`${translations.for} ${usernameOrEmail}`);
            tableEntry[2] = { html: getLink(fullUrl, `${translations.change_role as string} ${hiddenText}`, "change-role") };
        }

        if (hasRemoveLink) {
            tableEntry[hasChangeRoleLink ? 3 : 2] = { html: getLink(getRemoveMemberCheckDetailsFullUrl(member.id), `${translations.remove as string} ${getHiddenText(usernameOrEmail)}`, "remove") };
        }
        userTableDate.push(tableEntry);
    }
    return userTableDate;
};

const getPageQueryParams = (req: Request): PageQueryParams => {
    return {
        ownerPage: req.query?.ownerPage as string,
        adminPage: req.query?.adminPage as string,
        standardPage: req.query?.standardPage as string
    };
};

const setTabIds = (viewData: AnyRecord, userRole: UserRole) => {
    switch (userRole) {
    case UserRole.OWNER:
        viewData.manageUsersTabId = constants.ACCOUNT_OWNERS_TAB_ID;
        break;
    case UserRole.ADMIN:
        viewData.manageUsersTabId = constants.ADMINISTRATORS_TAB_ID;
        break;
    case UserRole.STANDARD:
        viewData.manageUsersTabId = constants.STANDARD_USERS_TAB_ID;
        break;
    }
};

const getMemberRawViewData = async (req: Request, acspNumber: string, pageNumbers: PageNumbers, userRole: UserRole, activeTabId: string, lang: AnyRecord, loggedInUserRole: UserRole): Promise<MemberRawViewData> => {
    let pageNumber = getCurrentPageNumber(pageNumbers, userRole);
    let memberships = await getAcspMemberships(req, acspNumber, false, pageNumber - 1, constants.ITEMS_PER_PAGE_DEFAULT, [userRole]);
    if (!validatePageNumber(pageNumber, memberships.totalPages)) {
        pageNumber = 1;
        updatePageNumber(pageNumber, pageNumbers, userRole);
        memberships = await getAcspMemberships(req, acspNumber, false, pageNumber - 1, constants.ITEMS_PER_PAGE_DEFAULT, [userRole]);
    }

    const memberViewData: MemberRawViewData = { memberships: memberships.items, pageNumber };

    if (memberships.totalPages > 1) {
        const pagination = buildPaginationElement(pageNumbers, userRole, memberships.totalPages, getCancelSearchHref(loggedInUserRole), activeTabId, lang);
        setLangForPagination(pagination, lang);
        memberViewData.pagination = pagination;
    }

    return memberViewData;
};

const updatePageNumber = (pageNumber: number, pageNumbers: PageNumbers, userRole: UserRole): void => {
    switch (userRole) {
    case UserRole.OWNER:
        pageNumbers.ownerPage = pageNumber;
        break;
    case UserRole.ADMIN:
        pageNumbers.adminPage = pageNumber;
        break;
    case UserRole.STANDARD:
        pageNumbers.standardPage = pageNumber;
        break;
    }
};

export const isCancelSearch = (req: Request): boolean => Object.hasOwn(req.query, constants.CANCEL_SEARCH);
