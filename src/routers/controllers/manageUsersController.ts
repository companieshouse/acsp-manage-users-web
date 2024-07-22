import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";
import { TableEntry } from "../../types/viewTypes";
import { getHiddenText, getLink } from "../../lib/utils/viewUtils";
import { Membership } from "../../types/membership";
import { setExtraData } from "../../lib/utils/sessionUtils";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

// Hardcoded data will be replaced once relevant API calls available\

export const membershipMap = new Map<string, Membership>([
    ["111111", {
        id: "111111",
        userId: "12345",
        userEmail: "james.morris@gmail.com",
        displayUserName: "James Morris",
        acspNumber: "B149YU",
        userRole: UserRole.OWNER
    } as Membership],
    ["999999", {
        id: "999999",
        userId: "54321",
        userEmail: "jeremy.lloris@gmail.com",
        acspNumber: "P1399I",
        userRole: UserRole.OWNER
    } as Membership]
]);

// export const membership = [{
//     id: "111111",
//     userId: "12345",
//     userEmail: "james.morris@gmail.com",
//     displayUserName: "James Morris",
//     acspNumber: "B149YU",
//     userRole: UserRole.OWNER
// } as Membership, {
//     id: "999999",
//     userId: "54321",
//     userEmail: "jeremy.lloris@gmail.com",
//     acspNumber: "P1399I",
//     userRole: UserRole.OWNER
// } as Membership];

export const manageUsersControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.MANAGE_USERS_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.MANAGE_USERS_PAGE);

    setExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP, membershipMap);

    const companyName = "MORRIS ACCOUNTING LTD";
    const companyNumber = "0122239";

    const accountOwnersTableData: TableEntry[][] = [];
    const administratorsTableData: TableEntry[][] = [];
    const standardUsersTableData: TableEntry[][] = [];

    membershipMap.forEach(member => {
        const memberElement = [
            { text: member.userEmail },
            { text: member.displayUserName },
            { html: getLink(constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL.replace(":id", member.id), `${translations.remove as string} ${getHiddenText(member.userEmail)}`) }
        ];

        switch (member.userRole) {
        case UserRole.OWNER:
            accountOwnersTableData.push(memberElement);
            break;
        case UserRole.ADMIN:
            administratorsTableData.push(memberElement);
            break;
        case UserRole.STANDARD:
            standardUsersTableData.push(memberElement);
            break;
        default:
            console.log(`member did not have role`);
        }
    });

    return {
        lang: translations,
        backLinkUrl: constants.DASHBOARD_FULL_URL,
        addUserUrl: constants.ADD_USER_FULL_URL + constants.CLEAR_FORM_TRUE,
        removeUserLinkUrl: constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL,
        companyName,
        companyNumber,
        //     membership,
        accountOwnersTableData,
        administratorsTableData,
        standardUsersTableData
    };
};
