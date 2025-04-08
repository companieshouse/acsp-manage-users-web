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

export const manageUsersControllerGet = async (req: Request, res: Response): Promise<void> => {
    const searchStringEmail: string | undefined = getExtraData(req.session, constants.SEARCH_STRING_EMAIL);

    const viewData = await getViewData(req, searchStringEmail);

    acspLogger(req.session, manageUsersControllerGet.name, `Rendering manage users page`);
    res.render(constants.MANAGE_USERS_PAGE, { ...viewData });
};

export const manageUsersControllerPost = async (req: Request, res: Response): Promise<void> => {

    const trimmedSearch = req.body.search.trim().toLowerCase();

    setExtraData(req.session, constants.SEARCH_STRING_EMAIL, trimmedSearch);

    const viewData = await getViewData(req, trimmedSearch);
    acspLogger(req.session, manageUsersControllerPost.name, `Rendering post manage users page`);
    res.render(constants.MANAGE_USERS_PAGE, viewData);
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
        cancelSearchHref: constants.getFullUrl(constants.CANCEL_SEARCH_URL),
        accountOwnersTabId: constants.ACCOUNT_OWNERS_ID,
        administratorsTabId: constants.ADMINISTRATORS_ID,
        standardUsersTabId: constants.STANDARD_USERS_ID,
        templateName: constants.MANAGE_USERS_PAGE,
        manageUsersTabId: activeTabId,
        MATOMO_ADD_USER_GOAL_ID: constants.MATOMO_ADD_USER_GOAL_ID,
        MATOMO_REMOVE_USER_GOAL_ID: constants.MATOMO_REMOVE_USER_GOAL_ID
    };

    let errorMessage;
    const isSearchValid = search === undefined || validateEmailString(search);

    if (typeof search === "string" && !isSearchValid) {
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
        userDisplayName: getDisplayNameOrNotProvided(req.lang, member),
        displayNameOrEmail: getDisplayNameOrEmail(member)
    });

    if (isSearchValid && search) {
        try {
            const foundUser = await membershipLookup(req, acspNumber, search);
            if (foundUser.items.length > 0) {
                setTabIds(viewData, foundUser.items[0].userRole);

                const foundMember = [
                    foundUser.items[0]
                ].map(formatMember);

                setExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP, foundMember);

                const memberData = getUserTableData(foundUser.items, translations, userRole !== UserRole.STANDARD, userRole !== UserRole.STANDARD, req.lang);
                switch (foundUser.items[0].userRole) {
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

        viewData.accountOwnersTableData = getUserTableData(ownerMemberRawViewData.memberships, translations, userRole === UserRole.OWNER, userRole === UserRole.OWNER, req.lang);
        viewData.administratorsTableData = getUserTableData(adminMemberRawViewData.memberships, translations, userRole !== UserRole.STANDARD, userRole !== UserRole.STANDARD, req.lang);
        viewData.standardUsersTableData = getUserTableData(standardMemberRawViewData.memberships, translations, userRole !== UserRole.STANDARD, userRole !== UserRole.STANDARD, req.lang);

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

export const getDisplayNameOrEmail = (member: AcspMembership): string => !member.userDisplayName || member.userDisplayName === constants.NOT_PROVIDED ? member.userEmail : member.userDisplayName;

export const getDisplayNameOrNotProvided = (locale: string, member: AcspMembership): string => member.userDisplayName === constants.NOT_PROVIDED && locale === "cy" ? constants.NOT_PROVIDED_CY : member.userDisplayName;

const getUserTableData = (membership: AcspMembership[], translations: AnyRecord, hasChangeRoleLink: boolean, hasRemoveLink: boolean, locale: string): TableEntry[][] => {
    const userTableDate: TableEntry[][] = [];
    for (const member of membership) {
        const tableEntry: TableEntry[] = [
            { text: member.userEmail },
            { text: getDisplayNameOrNotProvided(locale, member) }
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
