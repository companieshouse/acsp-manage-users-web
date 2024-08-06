import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";
import { TableEntry } from "../../types/viewTypes";
import { getHiddenText, getLink } from "../../lib/utils/viewUtils";
import { Membership } from "../../types/membership";
import { getLoggedUserAcspMembership, setExtraData } from "../../lib/utils/sessionUtils";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getAcspMemberships } from "../../services/acspMemberService";

export const manageUsersControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = await getViewData(req);
    res.render(constants.MANAGE_USERS_PAGE, { ...viewData });
};

export const getTitle = (translations: AnyRecord, loggedInUserRole: UserRole): string => {
    let baseTitle: string;
    if (loggedInUserRole === UserRole.OWNER || loggedInUserRole === UserRole.ADMIN) {
        baseTitle = translations.page_header?.toString() ?? "Manage Users";
    } else {
        baseTitle = translations.page_header_standard?.toString() ?? "View Users";
    }

    const titleEnd = translations.title_end?.toString() ?? "";
    return `${baseTitle}${titleEnd}`;
};

export const getViewData = async (req: Request): Promise<AnyRecord> => {
    const translations = getTranslationsForView(req.t, constants.MANAGE_USERS_PAGE);
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);

    const {
        userRole,
        acspNumber,
        acspName
    } = loggedUserAcspMembership;

    const [ownerMembers, adminMembers, standardMembers] = await Promise.all([
        getAcspMemberships(req, acspNumber, false, 0, 10000, [UserRole.OWNER]),
        getAcspMemberships(req, acspNumber, false, 0, 10000, [UserRole.ADMIN]),
        getAcspMemberships(req, acspNumber, false, 0, 10000, [UserRole.STANDARD])
    ]);

    const accountOwnersTableData: TableEntry[][] = getUserTableData(ownerMembers.items, translations, userRole === UserRole.OWNER);
    const administratorsTableData: TableEntry[][] = getUserTableData(adminMembers.items, translations, userRole !== UserRole.STANDARD);
    const standardUsersTableData: TableEntry[][] = getUserTableData(standardMembers.items, translations, userRole !== UserRole.STANDARD);
    const title = getTitle(translations, userRole);

    const allMembersForThisAcsp: Membership[] = [...ownerMembers.items, ...adminMembers.items, ...standardMembers.items].map<Membership>(member => ({
        id: member.id,
        userId: member.userId,
        userEmail: member.userEmail,
        acspNumber: member.acspNumber,
        userRole: member.userRole,
        userDisplayName: member.userDisplayName,
        displayNameOrEmail: !member.userDisplayName || member.userDisplayName === "Not Provided" ? member.userEmail : member.userDisplayName
    }));
    setExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP, allMembersForThisAcsp);

    return {
        title: title,
        lang: translations,
        backLinkUrl: constants.DASHBOARD_FULL_URL,
        addUserUrl: constants.ADD_USER_FULL_URL + constants.CLEAR_FORM_TRUE,
        removeUserLinkUrl: constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL,
        companyName: acspName,
        companyNumber: acspNumber,
        accountOwnersTableData,
        administratorsTableData,
        standardUsersTableData,
        loggedInUserRole: userRole
    };
};

const getUserTableData = (membership: AcspMembership[], translations: AnyRecord, hasRemoveLink: boolean): TableEntry[][] => {
    const userTableDate: TableEntry[][] = [];
    for (const member of membership) {
        const tableEntry: TableEntry[] = [
            { text: member.userEmail },
            { text: member.userDisplayName }
        ];
        if (hasRemoveLink) {
            tableEntry[2] = { html: getLink(constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL.replace(":id", member.id), `${translations.remove as string} ${getHiddenText(member.userEmail)}`) };
        }
        userTableDate.push(tableEntry);
    }
    return userTableDate;
};
