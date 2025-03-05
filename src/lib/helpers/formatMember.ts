
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { Membership } from "../../types/membership";
import * as constants from "../../lib/constants";

export const getDisplayNameOrEmail = (member: AcspMembership): string => !member.userDisplayName || member.userDisplayName === constants.NOT_PROVIDED ? member.userEmail : member.userDisplayName;

export const getDisplayNameOrNotProvided = (locale: string, member: AcspMembership): string => member.userDisplayName === constants.NOT_PROVIDED && locale === "cy" ? constants.NOT_PROVIDED_CY : member.userDisplayName;

export const formatMember = (member: AcspMembership, lang = "en"): Membership => ({
    id: member.id,
    userId: member.userId,
    userEmail: member.userEmail,
    acspNumber: member.acspNumber,
    userRole: member.userRole,
    userDisplayName: getDisplayNameOrNotProvided(lang, member),
    displayNameOrEmail: getDisplayNameOrEmail(member)
});
