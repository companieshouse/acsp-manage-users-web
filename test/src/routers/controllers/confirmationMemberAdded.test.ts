import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/confirmation-member-added.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cy from "../../../../locales/cy/confirmation-member-added.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import * as constants from "../../../../src/lib/constants";
import { setExtraData } from "../../../../src/lib/utils/sessionUtils";
import { NewUserDetails } from "../../../../src/types/user";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { loggedAccountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";
import { getUserRoleTag } from "../../../../src/lib/utils/viewUtils";
import { session } from "../../../mocks/session.middleware.mock";

const router = supertest(app);

const url = "/authorised-agent/confirmation-member-added";
const companyName = loggedAccountOwnerAcspMembership.acspName;

const userRole: UserRole = UserRole.STANDARD;
const userDetails: NewUserDetails = { userRole: userRole, userId: "12345", isValid: true, email: "test@example.com" };
setExtraData(session, constants.DETAILS_OF_USER_TO_ADD, userDetails);

const getNewUserDetails = (userRole: UserRole, email: string, userName?: string): NewUserDetails => {
    return {
        userRole, userId: "12345", isValid: true, email, userName
    };
};

describe("GET /authorised-agent/confirmation-member-added", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, loggedAccountOwnerAcspMembership);
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
    });

    it("should return status 200", async () => {
        await router.get(url).expect(200);
    });

    test.each([
        ["English", "userName is provided", UserRole.STANDARD, getNewUserDetails(UserRole.STANDARD, "d.jones@example.com", "Davy Jones"), "en", en, enCommon],
        ["Welsh", "userName is provided", UserRole.STANDARD, getNewUserDetails(UserRole.STANDARD, "d.jones@example.com", "Davy Jones"), "cy", cy, cyCommon],
        ["English", "userName is not provided", UserRole.STANDARD, getNewUserDetails(UserRole.STANDARD, "d.jones@example.com"), "en", en, enCommon],
        ["Welsh", "userName is not provided", UserRole.STANDARD, getNewUserDetails(UserRole.STANDARD, "d.jones@example.com"), "cy", cy, cyCommon],
        ["English", "userName is provided", UserRole.ADMIN, getNewUserDetails(UserRole.ADMIN, "k.williams@example.com", "Katy Williams"), "en", en, enCommon],
        ["Welsh", "userName is provided", UserRole.ADMIN, getNewUserDetails(UserRole.ADMIN, "k.williams@example.com", "Katy Williams"), "cy", cy, cyCommon],
        ["English", "userName is not provided", UserRole.ADMIN, getNewUserDetails(UserRole.ADMIN, "k.williams@example.com"), "en", en, enCommon],
        ["Welsh", "userName is not provided", UserRole.ADMIN, getNewUserDetails(UserRole.ADMIN, "k.williams@example.com"), "cy", cy, cyCommon],
        ["English", "userName is provided", UserRole.OWNER, getNewUserDetails(UserRole.OWNER, "j.smith@example.com", "John Smith"), "en", en, enCommon],
        ["Welsh", "userName is provided", UserRole.OWNER, getNewUserDetails(UserRole.OWNER, "j.smith@example.com", "John Smith"), "cy", cy, cyCommon],
        ["English", "userName is not provided", UserRole.OWNER, getNewUserDetails(UserRole.OWNER, "j.smith@example.com"), "en", en, enCommon],
        ["Welsh", "userName is not provided", UserRole.OWNER, getNewUserDetails(UserRole.OWNER, "j.smith@example.com"), "cy", cy, cyCommon]
    ])("should return expected %s content if person has been added and if %s and userRole is %s",
        async (_langInfo, condition, userRole, userDetails, langVersion, lang, langCommon) => {
            // Given
            setExtraData(session, constants.DETAILS_OF_USER_TO_ADD, userDetails);
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.text).toContain(lang.user_added);
            expect(response.text).toContain(lang.you_have_added);
            if (condition === "userName is provided") {
                expect(response.text).toContain(userDetails.userName);
            } else {
                expect(response.text).toContain(userDetails.email);
            }
            if (userRole === UserRole.STANDARD) {
                expect(response.text).toContain(`${lang.as_a}${getUserRoleTag(userDetails.userRole as UserRole, langVersion, true)}${lang.for}${companyName}`);
            } else {
                expect(response.text).toContain(`${lang.as_an}${getUserRoleTag(userDetails.userRole as UserRole, langVersion, true)}${lang.for}${companyName}`);
            }
            expect(response.text).toContain(lang.what_happens_now);
            expect(response.text).toContain(`${lang.theyll_be_able_to_use_services}`);
            expect(response.text).toContain(`${langCommon.go_to_manage_users}`);
        });

});
