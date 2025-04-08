import { getLoggedInUserId, getLoggedUserAcspMembership } from "../../lib/utils/sessionUtils";
import { Session } from "@companieshouse/node-session-handler";
import logger from "../../lib/Logger";

export const acspLogger = (session: Session | undefined, functionName: string, message: string, isError = false): void => {

    const { userRole, acspNumber, userId } = getLoggedUserAcspMembership(session) || {};
    const loggedInUserId = getLoggedInUserId(session);
    if (isError) {
        logger.error(`${userId || loggedInUserId}: ${acspNumber}: ${userRole}: ${functionName}: ${message}`);
    } else {
        logger.info(`${userId || loggedInUserId}: ${acspNumber}: ${userRole}: ${functionName}: ${message}`);
    }
};
