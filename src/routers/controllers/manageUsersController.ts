import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";
import { TableEntry } from "../../types/viewTypes";
import { getHiddenText, getLink } from "../../lib/utils/viewUtils";

export const manageUsersControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.MANAGE_USERS_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.MANAGE_USERS_PAGE);

    // Hardcoded data will be replaced once relevant API calls available
    const companyName = "MORRIS ACCOUNTING LTD";
    const companyNumber = "0122239";
    const userEmailAddress = "james.morris@gmail.com";
    const userName = "James Morris";
    const accountOwnersTableData: TableEntry[][] = [
        [
            { text: userEmailAddress },
            { text: userName },
            { html: getLink(constants.REMOVE_USER_FULL_URL, `${translations.remove as string} ${getHiddenText(userEmailAddress)}`) }
        ]
    ];

    return {
        lang: translations,
        backLinkUrl: constants.DASHBOARD_FULL_URL,
        removeUserLinkUrl: constants.REMOVE_USER_FULL_URL,
        addUserUrl: constants.ADD_USER_FULL_URL + constants.CLEAR_FORM_TRUE,
        companyName,
        companyNumber,
        accountOwnersTableData
    };
};
