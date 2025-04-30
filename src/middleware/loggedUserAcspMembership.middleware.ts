import { NextFunction, Request, Response } from "express";
import { getLoggedUserAcspMembership, setExtraData } from "../lib/utils/sessionUtils";
import { getMembershipForLoggedInUser } from "../services/acspMemberService";
import { AcspMembership, MembershipStatus } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as constants from "../lib/constants";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";
import logger from "../lib/Logger";

export const loggedUserAcspMembershipMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (isWhitelistedUrl(req.originalUrl) || req.originalUrl.startsWith(constants.ACCESS_DENIED_FULL_URL)) {
        return next();
    }
    let acspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);
    let fetched = false;
    if (!acspMembership) {
        acspMembership = (await getMembershipForLoggedInUser(req)).items[0];
        fetched = true;
    }
    const { membershipStatus, id } = acspMembership;
    if (membershipStatus === MembershipStatus.PENDING) {
        logger.info("User has a pending membership, redirecting to accept invite page");
        setExtraData(req.session, "pendingMembershipId", id);
        return res.redirect("/authorised-agent/accept-membership");
    } else if (membershipStatus === MembershipStatus.ACTIVE) {
        if (fetched) {
            setExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, acspMembership);
        }
        return next();
    } else {
        console.log("Error: status not allowed: ", membershipStatus);
        throw new Error("Error: status not allowed: " + membershipStatus);
    }

};
