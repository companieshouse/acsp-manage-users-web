import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { setExtraData, getExtraData } from "../../lib/utils/sessionUtils";
import { ViewData } from "../../types/utilTypes";
import { clearFormSessionValues } from "../../lib/validation/clear.form.validation";
import { validateAndSetErrors } from "../../lib/validation/add.user.validation";
import { AddUser } from "../../types/userRole";

export const addUserControllerGet = async (req: Request, res: Response): Promise<void> => {
    const viewData: ViewData = {
        lang: getTranslationsForView(req.t, constants.ADD_USER_PAGE),
        companyName: "MORRIS ACCOUNTING LTD",
        backLinkUrl: constants.MANAGE_USER_FULL_URL
    };
    clearFormSessionValues(req, "userAndRole");
    const savedUserAndRole: AddUser = getExtraData(
        req.session,
        "userAndRole"
    );

    if (savedUserAndRole) {
        validateAndSetErrors(
            savedUserAndRole.email,
            savedUserAndRole.userRole,
            viewData
        );
        viewData.email = savedUserAndRole.email;
        viewData.role = savedUserAndRole.userRole;
    }
    res.render(constants.ADD_USER_PAGE, viewData);
};

export const addUserControllerPost = async (req: Request, res: Response): Promise<void> => {
    const email = req.body.email.trim();
    const role = req.body.role;

    const viewData: ViewData = {
        lang: getTranslationsForView(req.t, constants.ADD_USER_PAGE),
        companyName: "MORRIS ACCOUNTING LTD",
        backLinkUrl: constants.MANAGE_USER_FULL_URL,
        email,
        role
    };

    validateAndSetErrors(email, role, viewData);

    if (viewData.errors) {
        setExtraData(req.session, "userAndRole", { email, role, isValid: false } as unknown as AddUser);
        return res.render(constants.ADD_USER_PAGE, viewData);
    } else {
        setExtraData(req.session, "userAndRole", { email, role, isValid: true } as unknown as AddUser);
        return res.redirect(constants.DASHBOARD_FULL_URL);
    }
};
