import { Request, RequestHandler, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { getExtraData, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { MemberForRemoval } from "types/membership";
import logger from "../../lib/Logger";
import { getChangeMemberRoleFullUrl, getRemoveMemberCheckDetailsFullUrl } from "../../lib/utils/urlUtils";
import { UserRoleChangeData } from "types/utilTypes";

export const stopPageAddOwnerControllerGet: RequestHandler = async (req: Request, res: Response) => {
    const loggedUserAcspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);
    const userToRemove: MemberForRemoval | undefined = getExtraData(req.session, constants.DETAILS_OF_USER_TO_REMOVE);
    const userToChangeRole: UserRoleChangeData | undefined = getExtraData(req.session, constants.USER_ROLE_CHANGE_DATA);

    if (!userToRemove && !userToChangeRole) {
        logger.error(`${stopPageAddOwnerControllerGet.name}: neither DETAILS_OF_USER_TO_REMOVE nor DETAILS_OF_USER_TO_REMOVE found in session`);
        throw Error("Neither DETAILS_OF_USER_TO_REMOVE nor DETAILS_OF_USER_TO_REMOVE found in session");
    }

    res.render(constants.STOP_PAGE_ADD_ACCOUNT_OWNER, {
        buttonHref: constants.ADD_USER_FULL_URL,
        lang: getTranslationsForView(req.lang, constants.STOP_PAGE_ADD_ACCOUNT_OWNER),
        companyName: loggedUserAcspMembership.acspName,
        linkHref: constants.MANAGE_USERS_FULL_URL,
        backLinkUrl: userToRemove ? getRemoveMemberCheckDetailsFullUrl(userToRemove.id) : getChangeMemberRoleFullUrl(userToChangeRole?.acspMembershipId as string),
        templateName: constants.STOP_PAGE_ADD_ACCOUNT_OWNER,
        isRemoval: !!userToRemove
    });
};
