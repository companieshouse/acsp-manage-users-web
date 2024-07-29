import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";
import { getExtraData, getLoggedInUserEmail, setExtraData } from "../../lib/utils/sessionUtils";

export const removeUserCheckDetailsControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData = getViewData(req);

    res.render(constants.REMOVE_MEMBER_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.REMOVE_MEMBER_PAGE);

    // Hardcoded data will be replaced once relevant API calls available
    const existingUsers = getExtraData(req.session, constants.MANAGE_USERS_MEMBERSHIP);
    const companyName = "MORRIS ACCOUNTING LTD";
    let userToRemove;

    const id = req.params.id;

    for (const i in existingUsers) {
        if (existingUsers[i].id === id) {
            userToRemove = existingUsers[i];
            break;
        }
    }
    const removingThemselves = getLoggedInUserEmail(req.session) === userToRemove.userEmail;
    setExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE, userToRemove);

    return {
        removingThemselves,
        lang: translations,
        userToRemove,
        companyName,
        cancelLinkHref: constants.MANAGE_USER_FULL_URL,
        backLinkUrl: constants.MANAGE_USER_FULL_URL,
        removeButtonHref: constants.CONFIRMATION_MEMBER_REMOVED_FULL_URL,
        tryRemovingUserUrl: constants.TRY_REMOVING_USER_FULL_URL
    };
};
