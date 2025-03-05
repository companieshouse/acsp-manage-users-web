import { Session } from "@companieshouse/node-session-handler";
import { CachedAcspMembershipData, Membership } from "../../types/membership";
import { getExtraData } from "../../lib/utils/sessionUtils";
import { formatMember } from "./formatMember";

export const findMemberInSessionById = (session: Session | undefined, id: string, lang = "en"): Membership | undefined => {

    const json = getExtraData(session, "cachedAcspMembershipData");
    if (json) {
        const cachedAcspMembershipData: CachedAcspMembershipData = JSON.parse(json);
        const member = Object.values(cachedAcspMembershipData)
            .map(acspMembers => acspMembers.data.items)
            .flat()
            .find(acspMember => acspMember.id === id);
        if (member) {
            console.log("we found a cached member, returning ", member);
            return formatMember(member, lang);
        }
    }
};
