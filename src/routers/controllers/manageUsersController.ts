import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";
import { TableEntry } from "../../types/viewTypes";
import { getHiddenText, getLink } from "../../lib/utils/viewUtils";
import { Membership } from "../../types/membership";
import { setExtraData } from "../../lib/utils/sessionUtils";

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
        AcspNumber: "B149YU"
    } as Membership, {
        id: "999999",
        userId: "54321",
        userEmail: "jim.lloris@gmail.com",
        displayUserName: "Jimothy Lloris",
        AcspNumber: "P1399I"
    } as Membership];

    setExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP, membership);

    const companyName = "MORRIS ACCOUNTING LTD";
    const companyNumber = "0122239";

    // To be debugged later
    const newUrl = constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL.replace(":id", membership[0].id);

    const accountOwnersTableData: TableEntry[][] = [];

    for (const member of membership) {
        accountOwnersTableData.push([
            { text: member.userEmail },
            { text: member.displayUserName },
            { html: getLink(constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL, `${translations.remove as string} ${getHiddenText(member.userEmail)}`) }
        ]);
    }

    return {
        lang: translations,
        backLinkUrl: constants.DASHBOARD_FULL_URL,
        removeUserLinkUrl: constants.REMOVE_MEMBER_CHECK_DETAILS_FULL_URL,
        addUserUrl: constants.ADD_USER_FULL_URL,
        companyName,
        companyNumber,
        membership,
        accountOwnersTableData
    };
};
