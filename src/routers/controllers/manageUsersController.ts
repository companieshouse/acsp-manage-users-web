import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord, MemberRawViewData, PageNumbers, PageQueryParams } from "../../types/utilTypes";
import { TableEntry } from "../../types/viewTypes";
import { getHiddenText, getLink } from "../../lib/utils/viewUtils";
import { Membership } from "../../types/membership";
import { setExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getAcspMemberships, membershipLookup } from "../../services/acspMemberService";
import { sanitizeUrl } from "@braintree/sanitize-url";
import { validateEmailString } from "../../lib/validation/email.validation";
import logger from "../../lib/Logger";
import { buildPaginationElement, getCurrentPageNumber, setLangForPagination, stringToPositiveInteger } from "../../lib/helpers/buildPaginationHelper";
import { validatePageNumber } from "../../lib/validation/page.number.validation";
import { validateActiveTabId } from "../../lib/validation/string.validation";

export const manageUsersControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = await getViewData(req);
    res.render(constants.MANAGE_USERS_PAGE, { ...viewData });
};

export const manageUsersControllerPost = async (req: Request, res: Response): Promise<void> => {
    const search = req.body.search.replace(/ /g, "");
    const url = `${constants.MANAGE_USERS_FULL_URL}?search=${search}`;
    const sanitizedUrl = sanitizeUrl(url);
    res.redirect(sanitizedUrl);
};

export const getTitle = (translations: AnyRecord, loggedInUserRole: UserRole, isError: boolean): string => {
    const baseTitle = loggedInUserRole === UserRole.STANDARD ? translations.page_header_standard : translations.page_header;
    const titleEnd = translations.title_end;
    return isError ? `${translations.title_error}${baseTitle}${titleEnd}` : `${baseTitle}${titleEnd}`;
};

export const getViewData = async (req: Request): Promise<AnyRecord> => {
    const search = req.query?.search as string;
    const {
        ownerPage,
        adminPage,
        standardPage
    } = getPageQueryParams(req);

    const activeTabId = getActiveTabId(req);

    const pageNumbers: PageNumbers = {
        ownerPage: stringToPositiveInteger(ownerPage),
        adminPage: stringToPositiveInteger(adminPage),
        standardPage: stringToPositiveInteger(standardPage)
    };

    const translations = getTranslationsForView(req.t, constants.MANAGE_USERS_PAGE);
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);

    const {
        userRole,
        acspNumber,
        acspName
    } = loggedUserAcspMembership;

    const viewData: AnyRecord = {
        lang: translations,
        backLinkUrl: constants.DASHBOARD_FULL_URL,
        addUserUrl: constants.ADD_USER_FULL_URL + constants.CLEAR_FORM_TRUE,
        companyName: acspName,
        companyNumber: acspNumber,
        loggedInUserRole: userRole,
        cancelSearchHref: getHancelSearchHref(userRole),
        accountOwnersTabId: constants.ACCOUNT_OWNERS_ID,
        administratorsTabId: constants.ADMINISTRATORS_ID,
        standardUsersTabId: constants.STANDARD_USERS_ID,
        templateName: constants.MANAGE_USERS_PAGE
    };

    let foundUser: AcspMembership[] = [];
    let ownerMembers: AcspMembership[] = [];
    let adminMembers: AcspMembership[] = [];
    let standardMembers: AcspMembership[] = [];
    let errorMessage;

    if (search) {
        if (validateEmailString(search)) {
            try {
                foundUser = (await membershipLookup(req, acspNumber, search)).items;
                setTabIds(viewData, foundUser[0]?.userRole);
            } catch (error) {
                logger.error(`ACSP membership for email ${search} not found.`);
                viewData.manageUsersTabId = constants.ACCOUNT_OWNERS_TAB_ID;
            }
        } else {
            errorMessage = constants.ERRORS_ENTER_AN_EMAIL_ADDRESS_IN_THE_CORRECT_FORMAT;
            viewData.errors = {
                search: {
                    text: errorMessage
                }
            };
            ownerMembers = (await getAcspMemberships(req, acspNumber, false, 0, 10000, [UserRole.OWNER])).items;
            adminMembers = (await getAcspMemberships(req, acspNumber, false, 0, 10000, [UserRole.ADMIN])).items;
            standardMembers = (await getAcspMemberships(req, acspNumber, false, 0, 10000, [UserRole.STANDARD])).items;
        }
        viewData.search = search;
    } else {
        const ownerMemberRawViewData = await getMemberRawViewData(req, acspNumber, pageNumbers, UserRole.OWNER, constants.ACCOUNT_OWNERS_TAB_ID, translations);
        ownerMembers = ownerMemberRawViewData.memberships;
        viewData.accoutOwnerPadinationData = ownerMemberRawViewData.pagination;

        const adminMemberRawViewData = await getMemberRawViewData(req, acspNumber, pageNumbers, UserRole.ADMIN, constants.ADMINISTRATORS_TAB_ID, translations);
        adminMembers = adminMemberRawViewData.memberships;
        viewData.adminPadinationData = adminMemberRawViewData.pagination;

        const standardMemberRawViewData = await getMemberRawViewData(req, acspNumber, pageNumbers, UserRole.STANDARD, constants.STANDARD_USERS_TAB_ID, translations);
        standardMembers = standardMemberRawViewData.memberships;
        viewData.standardUserPadinationData = standardMemberRawViewData.pagination;

        viewData.manageUsersTabId = activeTabId;
    }

    const title = getTitle(translations, userRole, !!errorMessage);
    viewData.title = title;

    const accountOwnersTableData: TableEntry[][] = getUserTableData(foundUser[0]?.userRole === UserRole.OWNER ? foundUser : ownerMembers, translations, userRole === UserRole.OWNER);
    viewData.accountOwnersTableData = accountOwnersTableData;

    const administratorsTableData: TableEntry[][] = getUserTableData(foundUser[0]?.userRole === UserRole.ADMIN ? foundUser : adminMembers, translations, userRole !== UserRole.STANDARD);
    viewData.administratorsTableData = administratorsTableData;

    const standardUsersTableData: TableEntry[][] = getUserTableData(foundUser[0]?.userRole === UserRole.STANDARD ? foundUser : standardMembers, translations, userRole !== UserRole.STANDARD);
    viewData.standardUsersTableData = standardUsersTableData;

    const allMembersForThisAcsp = [...ownerMembers, ...adminMembers, ...standardMembers, ...foundUser].map<Membership>(member => ({
        id: member.id,
        userId: member.userId,
        userEmail: member.userEmail,
        acspNumber: member.acspNumber,
        userRole: member.userRole,
        userDisplayName: member.userDisplayName,
        displayNameOrEmail: getDisplayNameOrEmail(member)
    }));

    setExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP, allMembersForThisAcsp);

    return viewData;
};

const getActiveTabId = (req: Request): string => validateActiveTabId(req.query?.activeTabId as string) ? req.query.activeTabId as string : constants.ACCOUNT_OWNERS_TAB_ID;

const getHancelSearchHref = (userRole: UserRole): string => userRole === UserRole.STANDARD ? constants.VIEW_USERS_FULL_URL : constants.MANAGE_USERS_FULL_URL;

const getDisplayNameOrEmail = (member: AcspMembership): string => !member.userDisplayName || member.userDisplayName === constants.NOT_PROVIDED ? member.userEmail : member.userDisplayName;

const getUserTableData = (membership: AcspMembership[], translations: AnyRecord, hasRemoveLink: boolean): TableEntry[][] => {
    const userTableDate: TableEntry[][] = [];
    for (const member of membership) {
        const tableEntry: TableEntry[] = [
            { text: member.userEmail },
            { text: member.userDisplayName }
        ];
        if (hasRemoveLink) {
            tableEntry[2] = { html: getLink(constants.getRemoveMemberCheckDetailsFullUrl(member.id), `${translations.remove as string} ${getHiddenText(member.userEmail)}`) };
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

const getMemberRawViewData = async (req: Request, acspNumber: string, pageNumbers: PageNumbers, userRole: UserRole, activeTabId: string, lang: AnyRecord): Promise<MemberRawViewData> => {
    let pageNumber = getCurrentPageNumber(pageNumbers, userRole);
    let memberships = await getAcspMemberships(req, acspNumber, false, pageNumber - 1, constants.ITEMS_PER_PAGE_DEFAULT, [userRole]);
    if (!validatePageNumber(pageNumber, memberships.totalPages)) {
        pageNumber = 1;
        memberships = await getAcspMemberships(req, acspNumber, false, pageNumber - 1, constants.ITEMS_PER_PAGE_DEFAULT, [userRole]);
    }

    const memberViewData: MemberRawViewData = { memberships: memberships.items, pageNumber };

    if (memberships.totalPages > 1) {
        const pagination = buildPaginationElement(pageNumbers, userRole, memberships.totalPages, constants.MANAGE_USERS_FULL_URL, activeTabId);
        setLangForPagination(pagination, lang);
        memberViewData.pagination = pagination;
    }

    return memberViewData;
};
