import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "../../types/utilTypes";
// import { NewUserDetails } from "../../types/user";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { MemberForRemoval } from "../../types/membership";

export const removeYourselfControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.CONFIRMATION_YOU_ARE_REMOVED, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.USER_REMOVE_CONFIRMATION_PAGE);
    const newUserDetails: MemberForRemoval = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
    const companyName = "MORRIS ACCOUNTING LTD";

    return {
        lang: translations,
        companyName,
        newUserDetails,
        buttonHref: constants.MANAGE_USER_FULL_URL
    };
};
