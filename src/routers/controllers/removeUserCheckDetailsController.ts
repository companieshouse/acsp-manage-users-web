import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";
import { NewUserDetails } from "../../types/user";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const removeUserCheckDetailsControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);
    res.render(constants.REMOVE_MEMBER_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.REMOVE_MEMBER_PAGE);

    // Hardcoded data will be replaced once relevant API calls available
    // const userRole: UserRole = UserRole.STANDARD;
    // const userDetails: NewUserDetails = { userRole: userRole, userId: "12345", isValid: true, email: "d.jones@example.com", userName: "Davy Jones" };
    // setExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE, userDetails);

    const newUserDetails: NewUserDetails = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
    const companyName = "MORRIS ACCOUNTING LTD";

    return {
        lang: translations,
        companyName,
        newUserDetails,
        cancelLinkHref: constants.MANAGE_USER_FULL_URL,
        backLinkUrl: constants.MANAGE_USER_FULL_URL,
        removeButtonHref: constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL
    };
};
