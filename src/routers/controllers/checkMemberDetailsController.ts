import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { AnyRecord } from "../../types/utilTypes";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { getUserRoleTag } from "../../lib/utils/viewUtils";

export const checkMemberDetailsControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.CHECK_MEMBER_DETAILS_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.CHECK_MEMBER_DETAILS_PAGE);
    const userEmailAddress = getExtraData(req.session, constants.EMAIL_OF_USER_TO_ADD);
    // Hardcoded data will be replaced once relevant API calls available
    const companyName = "MORRIS ACCOUNTING LTD";
    const userRole = getUserRoleTag(userEmailAddress);

    return {
        lang: translations,
        companyName,
        userEmailAddress,
        userRole,
        backLinkUrl: constants.ADD_USER_FULL_URL,
        tryAddingUserUrl: constants.TRY_ADDING_USER_FULL_URL
    };
};
