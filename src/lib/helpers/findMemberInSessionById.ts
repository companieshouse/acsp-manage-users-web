import { Session } from "@companieshouse/node-session-handler";
import { CachedAcspMembershipData, Membership } from "../../types/membership";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { formatMember } from "./formatMember";
import logger from "../../lib/Logger";

export const findMemberInSessionById = (session: Session | undefined, id: string, lang = "en"): Membership | undefined => {

    const cachedJsonData = getExtraData(session, "cachedAcspMembershipData");
    if (!cachedJsonData) return undefined;

    let cachedAcspMembershipData: CachedAcspMembershipData;
    try {
        cachedAcspMembershipData = JSON.parse(cachedJsonData);
    } catch (error) {
        logger.error("Error parsing JSON: " + JSON.stringify(error));
        return undefined;
    }

    const member = Object.values(cachedAcspMembershipData)
        .flatMap(acspMembers => acspMembers.data.items)
        .find(acspMember => acspMember.id === id);

    return member ? formatMember(member, lang) : undefined;
};
