import { Request, RequestHandler, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { AnyRecord } from "types/utilTypes";
import { getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const stopPageAddOwnerControllerGet: RequestHandler = async (req: Request, res: Response) => {
    res.render(constants.STOP_PAGE_ADD_ACCOUNT_OWNER, getViewData(req));
};

const getViewData = (req: Request): AnyRecord => {

    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);
    return {
        lang: getTranslationsForView(req.t, constants.STOP_PAGE_ADD_ACCOUNT_OWNER),
        companyName: loggedUserAcspMembership.acspName,
        linkHref: constants.MANAGE_USER_FULL_URL
    };
};
