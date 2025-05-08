import { NextFunction, Request, Response } from "express";
import { getLoggedUserAcspMembership, setExtraData } from "../lib/utils/sessionUtils";
import { getMembershipForLoggedInUser } from "../services/acspMemberService";
import { AcspMembership, MembershipStatus } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as constants from "../lib/constants";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";
import logger from "../lib/Logger";

const excludePaths = [
    constants.ACCESS_DENIED_FULL_URL,
    constants.ACCEPT_MEMBERSHIP_FULL_URL,
    constants.SOMETHING_WENT_WRONG_FULL_URL
];

export const loggedUserAcspMembershipMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log("method");
    console.log(req.method);
    console.log("path");
    console.log(req.path);
    if (isWhitelistedUrl(req.originalUrl) || excludePaths.some((path) => req.originalUrl.startsWith(path))) {
        return next();
    }
    console.log("loggedUserAcspMembershipMiddleware");
    let acspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);
    if (!acspMembership || acspMembership?.membershipStatus === MembershipStatus.PENDING) {
        console.log("fetching membership... ");
        acspMembership = (await getMembershipForLoggedInUser(req)).items[0];
        console.log(acspMembership);
        setExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, acspMembership);
    }
    const { membershipStatus, id } = acspMembership;

    if (membershipStatus === MembershipStatus.PENDING) {
        logger.info("User has a pending membership, redirecting to accept invite page");
        setExtraData(req.session, "pendingMembershipId", id);
        return res.redirect("/authorised-agent/accept-membership");
    } else if (membershipStatus === MembershipStatus.ACTIVE) {
        return next();
    } else {
        console.log("Error: status not allowed: ", membershipStatus);
        throw new Error("Error: status not allowed: " + membershipStatus);
    }

};
