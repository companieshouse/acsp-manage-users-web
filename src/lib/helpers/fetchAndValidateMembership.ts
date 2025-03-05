import { getAcspMembershipForMemberId } from "../../services/acspMemberService";
import { getDisplayNameOrEmail, getDisplayNameOrNotProvided } from "./formatMember";
import { Membership } from "../../types/membership";
import { Request } from "express";
import { getLoggedInAcspNumber } from "../utils/sessionUtils";

export const fetchAndValidateMembership = async (req: Request, acspMembershipId: string):Promise<Membership> => {
    const member = await getAcspMembershipForMemberId(req, acspMembershipId);

    const loggedInAcspNumber = getLoggedInAcspNumber(req.session);
    if (loggedInAcspNumber !== member.acspNumber) {
        throw new Error(`ACSP Number mismatch: User's logged in ACSP number ${loggedInAcspNumber} does not match the fetched member's ACSP number ${member.acspNumber}`);
    }
    return {
        id: member.id,
        userId: member.userId,
        userEmail: member.userEmail,
        acspNumber: member.acspNumber,
        userRole: member.userRole,
        userDisplayName: getDisplayNameOrNotProvided(req.lang, member),
        displayNameOrEmail: getDisplayNameOrEmail(member)
    };
};
