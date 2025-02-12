import { getAcspMembershipForMemberId } from "../../services/acspMemberService";
import { getDisplayNameOrEmail, getDisplayNameOrNotProvided } from "../../routers/controllers/manageUsersController";
import { Membership } from "../../types/membership";
import { Request } from "express";

export const getFormattedMembershipForMemberId = async (req: Request, acspMembershipId: string):Promise<Membership> => {
    const member = await getAcspMembershipForMemberId(req, acspMembershipId);
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
