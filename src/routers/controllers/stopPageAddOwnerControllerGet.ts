import { Request, RequestHandler, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { MemberForRemoval } from "types/membership";
import logger from "../../lib/Logger";
import { getRemoveMemberCheckDetailsFullUrl } from "../../lib/utils/urlUtils";
import { ViewDataWithBackLink } from "../../types/utilTypes";

interface StopPageAddOwnerGetViewData extends ViewDataWithBackLink {
    buttonHref: string,
    companyName: string,
    linkHref: string,
}

export const stopPageAddOwnerControllerGet: RequestHandler = async (req: Request, res: Response) => {
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);
    const userToRemove: MemberForRemoval | undefined = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
    if (!userToRemove) {
        logger.error(`${stopPageAddOwnerControllerGet.name}: DETAILS_OF_USER_TO_REMOVE not found in session`);
        throw Error("DETAILS_OF_USER_TO_REMOVE not found in session");
    }

    const viewData: StopPageAddOwnerGetViewData = {
        buttonHref: constants.ADD_USER_FULL_URL,
        lang: getTranslationsForView(req.lang, constants.STOP_PAGE_ADD_ACCOUNT_OWNER),
        companyName: loggedUserAcspMembership.acspName,
        linkHref: constants.MANAGE_USERS_FULL_URL,
        backLinkUrl: getRemoveMemberCheckDetailsFullUrl(userToRemove.id),
        templateName: constants.STOP_PAGE_ADD_ACCOUNT_OWNER
    };

    res.render(constants.STOP_PAGE_ADD_ACCOUNT_OWNER, viewData);
};
