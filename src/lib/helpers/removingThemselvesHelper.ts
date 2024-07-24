import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getLoggedInUserEmail } from "../../lib/utils/sessionUtils";
import { Membership } from "../../types/membership";
import { Session } from "@companieshouse/node-session-handler";

/*
    Checks if the user is removing themselves and they are the only account holder.
   This should be updated once the APIs are in place but is needed for testing
   purposes.
   The comparison is being done with email, this should be updated to use ids when
   the APIs are connected.
*/

export const isRemovingThemselvesAsOnlyAccHolder = (membership: Membership[], memberDetails: Membership, session: Session): boolean => {
    const owners = membership.filter(mem => mem.userRole === UserRole.OWNER);
    const onlyAccHolder = memberDetails.userRole === UserRole.OWNER && owners.length === 1;
    const removingThemselves = getLoggedInUserEmail(session) === memberDetails.userEmail;

    return onlyAccHolder && removingThemselves;
};
