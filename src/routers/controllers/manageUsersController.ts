import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";
import { TableEntry } from "../../types/viewTypes";
import { getHiddenText, getLink } from "../../lib/utils/viewUtils";
import { Membership } from "../../types/membership";
import { setExtraData, getLoggedInUserEmail } from "../../lib/utils/sessionUtils";

import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const manageUsersControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.MANAGE_USERS_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.MANAGE_USERS_PAGE);

    // Hardcoded data will be replaced once relevant API calls available\
    const membership = [{
        id: "111111",
        userId: "12345",
        userEmail: "james.morris@gmail.com",
        displayUserName: "James Morris",
        acspNumber: "B149YU"
    } as Membership, {
        id: "999999",
        userId: "54321",
        userEmail: "jeremy.lloris@gmail.com",
        acspNumber: "P1399I"
    } as Membership];

    setExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP, membership);

    const loggedInUserRole = getUserRole(getLoggedInUserEmail(req.session));
    // Hardcoded data will be replaced once relevant API calls available
    const companyName = "MORRIS ACCOUNTING LTD";
    const companyNumber = "0122239";

    const accountOwnersTableData: TableEntry[][] = getUserTableData(membership, translations, loggedInUserRole === UserRole.OWNER);
    const administratorsTableData: TableEntry[][] = getUserTableData(membership, translations, loggedInUserRole !== UserRole.STANDARD);

    return {
        lang: translations,
        backLinkUrl: constants.DASHBOARD_FULL_URL,
        addUserUrl: constants.ADD_USER_FULL_URL + constants.CLEAR_FORM_TRUE,
        removeUserLinkUrl: constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL,
        companyName,
        companyNumber,
        membership,
        accountOwnersTableData,
        administratorsTableData,
        loggedInUserRole
    };
};

// Temporary functions until relevant API available
const getUserRole = (userEmailAddress: string): UserRole => {
    switch (userEmailAddress) {
    case "demo@ch.gov.uk":
        return UserRole.OWNER;
    case "demo2@ch.gov.uk":
        return UserRole.ADMIN;
    default:
        return UserRole.STANDARD;
    }
};

const getUserTableData = (membership: Membership[], translations: AnyRecord, hasRemoveLink: boolean): TableEntry[][] => {
    const userTableDate: TableEntry[][] = [];
    for (const member of membership) {
        const tableEntry: TableEntry[] = [
            { text: member.userEmail },
            { text: member.displayUserName }
        ];
        if (hasRemoveLink) {
            tableEntry[2] = { html: getLink(constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL.replace(":id", member.id), `${translations.remove as string} ${getHiddenText(member.userEmail)}`) };
        }
        userTableDate.push(tableEntry);
    }
    return userTableDate;
};
