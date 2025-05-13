import { NextFunction, Request, Response } from "express";
import { getLoggedUserAcspMembership, setExtraData } from "../lib/utils/sessionUtils";
import { getMembershipForLoggedInUser } from "../services/acspMemberService";
import { AcspMembership, MembershipStatus } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as constants from "../lib/constants";
import { isWhitelistedUrl } from "../lib/utils/urlUtils";
import { acspLogger } from "../lib/helpers/acspLogger";

const excludePaths = [
    constants.ACCESS_DENIED_FULL_URL,
    constants.ACCEPT_MEMBERSHIP_FULL_URL,
    constants.SOMETHING_WENT_WRONG_FULL_URL
];

export const loggedUserAcspMembershipMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    const originalUrl = req.originalUrl;

    const isExcludedUrl = (url: string): boolean =>
        isWhitelistedUrl(url) || excludePaths.some((path) => url.startsWith(path));

    if (isExcludedUrl(originalUrl)) {
        return next();
    }

    let acspMembership: AcspMembership = getLoggedUserAcspMembership(req.session);
    if (!acspMembership || acspMembership.membershipStatus !== MembershipStatus.ACTIVE) {
        const membershipResponse = await getMembershipForLoggedInUser(req);
        if (membershipResponse?.items?.length > 0) {
            acspMembership = membershipResponse.items[0];
            setExtraData(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, acspMembership);
        } else {
            acspLogger(req.session, loggedUserAcspMembershipMiddleware.name, "Failed to fetch ACSP membership for the logged-in user.");
            throw new Error("Failed to fetch ACSP membership for the logged-in user.");
        }
    }

    const { membershipStatus } = acspMembership;

    switch (membershipStatus) {
    case MembershipStatus.PENDING:
        acspLogger(req.session, loggedUserAcspMembershipMiddleware.name, "User has a pending membership, redirecting to accept invite page");
        return res.redirect(constants.ACCEPT_MEMBERSHIP_FULL_URL);
    case MembershipStatus.ACTIVE:
        return next();
    default:
        acspLogger(req.session, loggedUserAcspMembershipMiddleware.name, `Error: status not allowed: ${membershipStatus}`, true);
        throw new Error(`Error: status not allowed: ${membershipStatus}`);
    }

};
