import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { Membership } from "../../types/membership";

export const removeUserCheckDetailsControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.REMOVE_MEMBER_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.REMOVE_MEMBER_PAGE);

    // Hardcoded data will be replaced once relevant API calls available
    const membership = {
        id: "111111",
        userId: "12345",
        userEmail: "james.morris@gmail.com",
        displayUserName: "James Morris",
        AcspNumber: "B149YU"
    } as Membership;

    const removeUserDetails: Membership = getExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP);
    const companyName = "MORRIS ACCOUNTING LTD";

    return {
        lang: translations,
        companyName,
        removeUserDetails,
        cancelLinkHref: constants.MANAGE_USER_FULL_URL,
        backLinkUrl: constants.MANAGE_USER_FULL_URL,
        removeButtonHref: constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL
    };
};
