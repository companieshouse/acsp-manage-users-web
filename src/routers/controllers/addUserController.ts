import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { setExtraData, getExtraData, getLoggedInUserEmail } from "../../lib/utils/sessionUtils";
import { ViewData } from "../../types/utilTypes";
import { clearFormSessionValues } from "../../lib/validation/clear.form.validation";
import { validateAndSetErrors } from "../../lib/validation/add.user.validation";
import { NewUserDetails } from "../../types/user";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const addUserControllerGet = async (req: Request, res: Response): Promise<void> => {
    const loggedInUserRole = getUserRole(getLoggedInUserEmail(req.session));
    const viewData: ViewData = {
        lang: getTranslationsForView(req.t, constants.ADD_USER_PAGE),
        companyName: "MORRIS ACCOUNTING LTD",
        backLinkUrl: constants.MANAGE_USER_FULL_URL,
        loggedInUserRole
    };
    clearFormSessionValues(req, constants.DETAILS_OF_USER_TO_ADD);
    const savedNewUserDetails = getExtraData(
        req.session,
        constants.DETAILS_OF_USER_TO_ADD
    );

    if (savedNewUserDetails) {
        validateAndSetErrors(
            savedNewUserDetails?.email,
            savedNewUserDetails?.userRole,
            viewData
        );
        viewData.email = savedNewUserDetails?.email;
        viewData.userRole = savedNewUserDetails?.userRole;
    }
    res.render(constants.ADD_USER_PAGE, viewData);
};

export const addUserControllerPost = async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email.trim();
    const userRole = req.body.userRole;
    const loggedInUserRole = getUserRole(getLoggedInUserEmail(req.session));

    const viewData: ViewData = {
        lang: getTranslationsForView(req.t, constants.ADD_USER_PAGE),
        companyName: "MORRIS ACCOUNTING LTD",
        backLinkUrl: constants.MANAGE_USER_FULL_URL,
        email,
        userRole,
        loggedInUserRole
    };

    validateAndSetErrors(email, userRole, viewData);

    if (viewData.errors) {
        setExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD, { email, userRole, isValid: false } as unknown as NewUserDetails);
        return res.render(constants.ADD_USER_PAGE, viewData);
    } else {
        setExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD, { email, userRole, isValid: true } as unknown as NewUserDetails);
        return res.redirect(constants.CHECK_MEMBER_DETAILS_FULL_URL);
    }
};

// Temporary function until relevant API available
const getUserRole = (userEmailAddress: string): UserRole => {
    switch (userEmailAddress) {
    case "demo@ch.gov.uk":
        return UserRole.OWNER;
    case "demo2@ch.gov.uk":
        return UserRole.ADMIN;
    default:
        return UserRole.STANDARD;
    }
};
