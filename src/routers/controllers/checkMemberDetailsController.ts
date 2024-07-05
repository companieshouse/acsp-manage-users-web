import { Request, RequestHandler, Response } from "express";
import * as constants from "../../lib/constants";
import { AnyRecord } from "../../types/utilTypes";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { UserRoleTag } from "../../types/userRole";

export const checkMemberDetailsControllerGet: RequestHandler = async (req: Request, res: Response) => {
    const viewData = getViewData(req);
    res.render(constants.CHECK_MEMBER_DETAILS_PAGE, { ...viewData });
};

const getViewData = (req: Request): AnyRecord => {
    const translations = getTranslationsForView(req.t, constants.CHECK_MEMBER_DETAILS_PAGE);
    const userEmailAddress = getExtraData(req.session, constants.EMAIL_OF_USER_TO_ADD) || "a.brown@test.com";
    // Hardcoded data will be replaced once relevant API calls available
    const companyName = "MORRIS ACCOUNTING LTD";
    const userRole = getUserRole(userEmailAddress).toString();

    return {
        lang: translations,
        companyName,
        userEmailAddress,
        userRole,
        backLinkUrl: constants.ADD_USER_FULL_URL,
        tryAddingUserUrl: constants.TRY_ADDING_USER_FULL_URL
    };
};

// Temporary function to be used until relevant API calls available
const getUserRole = (userEmailAddress: string): UserRoleTag => {
    switch (userEmailAddress) {
    case "k.williams@example.com":
        return UserRoleTag.ADMIN;
    case "j.smith@example.com":
        return UserRoleTag.OWNER;
    default:
        return UserRoleTag.STANDARD;
    }
};
