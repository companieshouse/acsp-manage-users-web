import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import {
    setExtraData,
    getExtraData
} from "../../lib/utils/sessionUtils";
import { ViewData } from "../../types/utilTypes";
import { clearFormSessionValues } from "../../lib/validation/clear.form.validation";
import { validateAndSetErrors } from "../../lib/validation/add.user.validation";
import { NewUserDetails } from "../../types/user";
import logger from "../../lib/Logger";
import { getUserDetails } from "../../services/userAccountService";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const addUserControllerGet = async (req: Request, res: Response): Promise<void> => {
    const loggedInUserMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const loggedInUserRole = loggedInUserMembership.userRole;

    const viewData: ViewData = {
        lang: getTranslationsForView(req.t, constants.ADD_USER_PAGE),
        companyName: loggedInUserMembership.acspName,
        backLinkUrl: constants.MANAGE_USERS_FULL_URL,
        loggedInUserRole,
        templateName: constants.ADD_USER_PAGE
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
    const acspMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const loggedInUserRole = acspMembership.userRole;

    const viewData: ViewData = {
        lang: getTranslationsForView(req.t, constants.ADD_USER_PAGE),
        companyName: acspMembership.acspName,
        backLinkUrl: constants.MANAGE_USERS_FULL_URL,
        email,
        userRole,
        loggedInUserRole,
        templateName: constants.ADD_USER_PAGE
    };

    validateAndSetErrors(email, userRole, viewData);

    if (viewData.errors) {
        setExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD, { email, userRole, isValid: false } as unknown as NewUserDetails);
        return res.render(constants.ADD_USER_PAGE, viewData);
    } else {
        const newUserDetails: NewUserDetails = {
            email,
            userRole
        };
        logger.info("saving user details: " + JSON.stringify(newUserDetails));
        setExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD, newUserDetails);
        return res.redirect(constants.CHECK_MEMBER_DETAILS_FULL_URL);
    }
};
