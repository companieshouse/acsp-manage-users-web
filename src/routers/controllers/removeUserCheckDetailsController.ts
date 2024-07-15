import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";

export const removeUserCheckDetailsControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);

    res.render(constants.REMOVE_MEMBER_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.REMOVE_MEMBER_PAGE);

    // Hardcoded data will be replaced once relevant API calls available
    const removeUserArray = getExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP);
    const companyName = "MORRIS ACCOUNTING LTD";
    let userArray;

    const id = req.params.id;

    for (const i in removeUserArray) {
        if (removeUserArray[i].id === id) {
            userArray = removeUserArray[i];
        }
    }

    setExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE, userArray);

    return {
        lang: translations,
        userArray,
        companyName,
        cancelLinkHref: constants.MANAGE_USER_FULL_URL,
        backLinkUrl: constants.MANAGE_USER_FULL_URL,
        removeButtonHref: constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL
    };
};
