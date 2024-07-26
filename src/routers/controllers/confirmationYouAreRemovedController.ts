import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "../../types/utilTypes";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { MemberForRemoval } from "../../types/membership";

export const removeYourselfControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.CONFIRMATION_YOU_ARE_REMOVED, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.CONFIRMATION_YOU_ARE_REMOVED);
    const newUserDetails: MemberForRemoval = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
    const companyName = "MORRIS ACCOUNTING LTD";

    return {
        lang: translations,
        companyName,
        newUserDetails,
        buttonHref: "https://find-and-update.company-information.service.gov.uk/"
    };
};
