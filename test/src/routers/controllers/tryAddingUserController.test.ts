import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import * as userAccountService from "../../../../src/services/userAccountService";
import * as constants from "../../../../src/lib/constants";
import {
    MembershipStatus,
    UserRole
} from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import {
    createAcspMembershipMock,
    ToyStoryBuzzAcspMembership,
    ToyStoryWoodyAcspMembership
} from "../../../mocks/acsp.members.mock";
import { buzzUser, woodyUser } from "../../../mocks/user.mock";
import logger from "../../../../src/lib/Logger";
import { session } from "../../../mocks/session.middleware.mock";

jest.mock("../../../../src/services/acspMemberService");
jest.mock("../../../../src/services/userAccountService");

const router = supertest(app);
const url = "/authorised-agent/try-adding-user";

describe("POST /authorised-agent/try-adding-user", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (userAccountService.getUserDetails as jest.Mock).mockResolvedValue([buzzUser]);
        (acspMemberService.createAcspMembership as jest.Mock).mockResolvedValue(
            createAcspMembershipMock(
                "NEW001",
                ToyStoryBuzzAcspMembership.userId,
                UserRole.STANDARD,
                ToyStoryBuzzAcspMembership.acspNumber,
                new Date(),
                MembershipStatus.ACTIVE
            )
        );
        session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, ToyStoryBuzzAcspMembership);
    });

    it("should check session and user auth before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
    });

    it("should redirect to cannot add user page when ACSP number is not found", async () => {
        session.setExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP, undefined);

        const response = await router.post(url);

        expect(response.status).toBe(302);
        expect(response.header.location).toBe(constants.CANNOT_ADD_USER_FULL_URL);
    });

    it("should redirect to cannot add user page when new user details are not found in session", async () => {
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, undefined);

        const loggerSpy = jest.spyOn(logger, "error");
        const response = await router.post(url);

        expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining("New user details or email not found in session"));
        expect(response.status).toBe(302);
        expect(response.header.location).toBe(constants.CANNOT_ADD_USER_FULL_URL);
    });

    it("should redirect to cannot add user page when user being added is not found", async () => {
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, {
            email: "nonexistent@email.com",
            userRole: UserRole.STANDARD
        });
        (userAccountService.getUserDetails as jest.Mock).mockResolvedValue([]);

        const response = await router.post(url);

        expect(response.status).toBe(302);
        expect(response.header.location).toBe(constants.CANNOT_ADD_USER_FULL_URL);
    });

    it("should redirect to cannot add user page when createAcspMembership throws an error", async () => {
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, {
            email: buzzUser.email,
            userRole: UserRole.STANDARD
        });
        (acspMemberService.createAcspMembership as jest.Mock).mockRejectedValue(new Error("Membership creation failed"));

        const response = await router.post(url);

        expect(response.status).toBe(302);
        expect(response.header.location).toBe(constants.CANNOT_ADD_USER_FULL_URL);
    });

    it("should handle adding Woody as a new user", async () => {
        session.setExtraData(constants.DETAILS_OF_USER_TO_ADD, {
            email: woodyUser.email,
            userRole: UserRole.STANDARD
        });
        (userAccountService.getUserDetails as jest.Mock).mockResolvedValue([woodyUser]);
        (acspMemberService.createAcspMembership as jest.Mock).mockResolvedValue(
            createAcspMembershipMock(
                "NEW002",
                ToyStoryWoodyAcspMembership.userId,
                UserRole.STANDARD,
                ToyStoryWoodyAcspMembership.acspNumber,
                new Date(),
                MembershipStatus.ACTIVE
            )
        );

        const response = await router.post(url);

        expect(response.status).toBe(302);
        expect(response.header.location).toBe(constants.CONFIRMATION_MEMBER_ADDED_FULL_URL);
        expect(acspMemberService.createAcspMembership).toHaveBeenCalledWith(
            expect.anything(),
            ToyStoryWoodyAcspMembership.acspNumber,
            ToyStoryWoodyAcspMembership.userId,
            UserRole.STANDARD
        );
    });
});
