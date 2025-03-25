import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData, setExtraData } from "../../lib/utils/sessionUtils";
import { ViewDataWithBackLink } from "../../types/utilTypes";
import { clearFormSessionValues } from "../../lib/validation/clear.form.validation";
import { validateAndSetErrors } from "../../lib/validation/add.user.validation";
import { NewUserDetails } from "../../types/user";
import { AcspMembership, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { acspLogger } from "../../lib/helpers/acspLogger";

interface AddUserGetViewData extends ViewDataWithBackLink {
    companyName: string
}

interface AddUserGetViewDataSavedNewUserDetails extends AddUserGetViewData {
    email: string
    userRole: UserRole;
}

export const addUserControllerGet = async (req: Request, res: Response): Promise<void> => {
    const loggedInUserMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const loggedInUserRole = loggedInUserMembership.userRole;
    const referrer: string | undefined = req.get("Referrer");
    const hrefA = constants.MANAGE_USERS_FULL_URL;

    let viewData: AddUserGetViewData = {
        lang: getTranslationsForView(req.lang, constants.ADD_USER_PAGE),
        backLinkUrl: constants.MANAGE_USERS_FULL_URL,
        loggedInUserRole,
        templateName: constants.ADD_USER_PAGE,
        companyName: loggedInUserMembership.acspName
    };

    clearFormSessionValues(req, constants.DETAILS_OF_USER_TO_ADD, referrer, hrefA);
    const savedNewUserDetails: NewUserDetails = getExtraData(
        req.session,
        constants.DETAILS_OF_USER_TO_ADD
    );

    if (savedNewUserDetails) {
        validateAndSetErrors(
            savedNewUserDetails.email as string,
            savedNewUserDetails.userRole as UserRole,
            viewData
        );
        viewData = {
            ...viewData,
            email: savedNewUserDetails.email,
            userRole: savedNewUserDetails.userRole
        } as AddUserGetViewDataSavedNewUserDetails;
    }
    acspLogger(req.session, addUserControllerGet.name, `Rendering add user page`);
    res.render(constants.ADD_USER_PAGE, viewData);
};

interface AddUserPostViewData extends ViewDataWithBackLink {
    email: string,
    userRole: UserRole,
    loggedInUserRole: UserRole,
    companyName: string,
}

export const addUserControllerPost = async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email.trim();
    const userRole = req.body.userRole;
    const acspMembership: AcspMembership = getExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
    const loggedInUserRole = acspMembership.userRole;

    const viewData: AddUserPostViewData = {
        lang: getTranslationsForView(req.lang, constants.ADD_USER_PAGE),
        templateName: constants.ADD_USER_PAGE,
        backLinkUrl: constants.MANAGE_USERS_FULL_URL,
        email,
        userRole,
        loggedInUserRole,
        companyName: acspMembership.acspName
    };

    validateAndSetErrors(email, userRole, viewData);

    if (viewData.errors) {
        setExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD, { email, userRole, isValid: false } as unknown as NewUserDetails);

        acspLogger(req.session, addUserControllerPost.name, `Invalid add user details: Re-rendering add user page`);
        return res.render(constants.ADD_USER_PAGE, viewData);
    } else {
        const newUserDetails: NewUserDetails = {
            email,
            userRole
        };
        acspLogger(req.session, addUserControllerPost.name, ` Saving new user email and role ${userRole} to session`);
        setExtraData(req.session, constants.DETAILS_OF_USER_TO_ADD, newUserDetails);
        return res.redirect(constants.CHECK_MEMBER_DETAILS_FULL_URL);
    }
};
