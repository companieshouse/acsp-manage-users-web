import { isRemovingThemselvesAsOnlyAccHolder } from "../../../../../src/routers/controllers/helpers/removingThemselvesHelper";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { Membership } from "../../../../../src/types/membership";
import { Session } from "@companieshouse/node-session-handler";
import * as sessionUtils from "../../../../../src/lib/utils/sessionUtils";

const session: Session = new Session();

const mockMemberToBeRemoved: Membership = {
    id: "333333",
    userId: "1122334455",
    userEmail: "loggedInMail@test.com",
    userDisplayName: "John Smith",
    acspNumber: "LL0RPG",
    userRole: UserRole.OWNER
};

const mockMembers: Membership[] = [{
    id: "444444",
    userId: "444444333",
    userEmail: "j.smith@test.com",
    userDisplayName: "John Smith",
    acspNumber: "LL0RPG",
    userRole: UserRole.STANDARD
}, {
    id: "333333",
    userId: "1122334455",
    userEmail: "loggedInMail@test.com",
    userDisplayName: "John Smith",
    acspNumber: "LL0RPG",
    userRole: UserRole.OWNER
}];

const getLoggedInUserEmailSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInUserEmail");

describe("isRemovingThemselvesAsOnlyAccHolder", () => {
    test("should return false when not removing themselves", () => {
        getLoggedInUserEmailSpy.mockReturnValue("email@test.com");
        expect(isRemovingThemselvesAsOnlyAccHolder(mockMembers, mockMemberToBeRemoved, session)).toBe(false);
    });

    test("should return true when removing themselves when they are the single owner", () => {
        getLoggedInUserEmailSpy.mockReturnValue("loggedInMail@test.com");
        expect(isRemovingThemselvesAsOnlyAccHolder(mockMembers, mockMemberToBeRemoved, session)).toBe(true);
    });

    test("should return false when there are multiple owners", () => {
        mockMembers[0].userRole = UserRole.OWNER;
        getLoggedInUserEmailSpy.mockReturnValue("loggedInMail@test.com");
        expect(isRemovingThemselvesAsOnlyAccHolder(mockMembers, mockMemberToBeRemoved, session)).toBe(false);
    });
});
