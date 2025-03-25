import { Request, RequestHandler, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { MemberForRemoval } from "../../types/membership";
import { ViewDataWithBackLink } from "../../types/utilTypes";
import { acspLogger } from "../../lib/helpers/acspLogger";
import { UserRoleChangeData } from "types/utilTypes";

interface StopPageAddOwnerGetViewData extends ViewDataWithBackLink {
    buttonHref: string,
    companyName: string,
    linkHref: string,
    isRemoval: boolean
}

export const stopPageAddOwnerControllerGet: RequestHandler = async (req: Request, res: Response) => {
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);
    const userToRemove: MemberForRemoval | undefined = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
    const userToChangeRole: UserRoleChangeData | undefined = getExtraData(req.session, constants.USER_ROLE_CHANGE_DATA);

    if (!userToRemove && !userToChangeRole) {
        acspLogger(req.session, stopPageAddOwnerControllerGet.name, `neither DETAILS_OF_USER_TO_REMOVE nor USER_ROLE_CHANGE_DATA found in session`, true);
        throw new Error("Neither DETAILS_OF_USER_TO_REMOVE nor USER_ROLE_CHANGE_DATA found in session");
    }

    const viewData: StopPageAddOwnerGetViewData = {
        buttonHref: constants.ADD_USER_FULL_URL,
        lang: getTranslationsForView(req.lang, constants.STOP_PAGE_ADD_ACCOUNT_OWNER_PAGE),
        companyName: loggedUserAcspMembership.acspName,
        linkHref: constants.MANAGE_USERS_FULL_URL,
        backLinkUrl: constants.MANAGE_USERS_FULL_URL,
        templateName: constants.STOP_PAGE_ADD_ACCOUNT_OWNER_PAGE,
        isRemoval: !!userToRemove
    };
    acspLogger(req.session, stopPageAddOwnerControllerGet.name, `rendering stop page add account owner`);
    res.render(constants.STOP_PAGE_ADD_ACCOUNT_OWNER_PAGE, viewData);
};
