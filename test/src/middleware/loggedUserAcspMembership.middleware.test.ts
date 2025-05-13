import * as sessionUtils from "../../../src/lib/utils/sessionUtils";
import * as acspMemberService from "../../../src/services/acspMemberService";
import * as constants from "../../../src/lib/constants";
import { Request, Response } from "express";
import { loggedUserAcspMembershipMiddleware } from "../../../src/middleware/loggedUserAcspMembership.middleware";
import { Session } from "@companieshouse/node-session-handler";
import { getMockAcspMembersResource, loggedAccountOwnerAcspMembership, pendingAcspMembership } from "../../mocks/acsp.members.mock";
import { MembershipStatus } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
const getMembershipForLoggedInUserSpy: jest.SpyInstance = jest.spyOn(acspMemberService, "getMembershipForLoggedInUser");

let session: Session;
let req: Request;
const res: Response = {} as Response;
const next = jest.fn();

describe("loggedUserAcspMembershipMiddleware", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        session = new Session();
        req = {
            session,
            originalUrl: ""
        } as Request;
    });

    it("should call getMembershipForLoggedInUser function and set extra data if logged user ACSP membership not in the session", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(undefined);
        getMembershipForLoggedInUserSpy.mockReturnValue(getMockAcspMembersResource([loggedAccountOwnerAcspMembership]));
        expect(session.getExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP)).toBeUndefined();
        // When
        await loggedUserAcspMembershipMiddleware(req, res, next);
        // Then
        expect(getLoggedUserAcspMembershipSpy).toHaveBeenCalledWith(req.session);
        expect(getMembershipForLoggedInUserSpy).toHaveBeenCalledWith(req);
        expect(setExtraDataSpy).toHaveBeenCalledWith(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, loggedAccountOwnerAcspMembership);
        expect(session.getExtraData(constants.LOGGED_USER_ACSP_MEMBERSHIP)).toEqual(loggedAccountOwnerAcspMembership);
        expect(next).toHaveBeenCalled();
    });

    it("should not call getMembershipForLoggedInUser function and set extra data if logged user ACSP membership is already in the session", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        // When
        await loggedUserAcspMembershipMiddleware(req, res, next);
        // Then
        expect(getLoggedUserAcspMembershipSpy).toHaveBeenCalledWith(req.session);
        expect(getMembershipForLoggedInUserSpy).not.toHaveBeenCalled();
        expect(setExtraDataSpy).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it("should call next when request is for /authorised-agent/healthcheck", async () => {
        // Given
        req.originalUrl = "/authorised-agent/healthcheck";
        // When
        await loggedUserAcspMembershipMiddleware(req, res, next);
        // Then
        expect(getLoggedUserAcspMembershipSpy).not.toHaveBeenCalled();
        expect(getMembershipForLoggedInUserSpy).not.toHaveBeenCalled();
        expect(setExtraDataSpy).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it("should redirect to accept membership page if membership status is PENDING", async () => {
        // Given
        const mockMembership = { ...pendingAcspMembership };
        getLoggedUserAcspMembershipSpy.mockReturnValue(undefined);
        getMembershipForLoggedInUserSpy.mockReturnValue(getMockAcspMembersResource([mockMembership]));
        res.redirect = jest.fn();
        // When
        await loggedUserAcspMembershipMiddleware(req, res, next);
        // Then
        expect(getLoggedUserAcspMembershipSpy).toHaveBeenCalledWith(req.session);
        expect(getMembershipForLoggedInUserSpy).toHaveBeenCalledWith(req);
        expect(setExtraDataSpy).toHaveBeenCalledWith(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, mockMembership);
        expect(res.redirect).toHaveBeenCalledWith("/authorised-agent/accept-membership");
        expect(next).not.toHaveBeenCalled();
    });

    it("should throw an error if membership status is REMOVED", async () => {
        // Given
        const mockMembership = { ...pendingAcspMembership, membershipStatus: MembershipStatus.REMOVED };
        getLoggedUserAcspMembershipSpy.mockReturnValue(undefined);
        getMembershipForLoggedInUserSpy.mockReturnValue(getMockAcspMembersResource([mockMembership]));
        // When
        await expect(loggedUserAcspMembershipMiddleware(req, res, next)).rejects.toThrow("Error: status not allowed: removed");
        // Then
        expect(getLoggedUserAcspMembershipSpy).toHaveBeenCalledWith(req.session);
        expect(getMembershipForLoggedInUserSpy).toHaveBeenCalledWith(req);
        expect(setExtraDataSpy).toHaveBeenCalledWith(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, mockMembership);
        expect(next).not.toHaveBeenCalled();
    });

    it("should call next if membership status is ACTIVE", async () => {
        // Given
        const mockMembership = { ...loggedAccountOwnerAcspMembership };
        getLoggedUserAcspMembershipSpy.mockReturnValue(undefined);
        getMembershipForLoggedInUserSpy.mockReturnValue(getMockAcspMembersResource([mockMembership]));
        // When
        await loggedUserAcspMembershipMiddleware(req, res, next);
        // Then
        expect(getLoggedUserAcspMembershipSpy).toHaveBeenCalledWith(req.session);
        expect(getMembershipForLoggedInUserSpy).toHaveBeenCalledWith(req);
        expect(setExtraDataSpy).toHaveBeenCalledWith(req.session, constants.LOGGED_USER_ACSP_MEMBERSHIP, mockMembership);
        expect(next).toHaveBeenCalled();
    });

    it("should call next if the URL matches an excluded path", async () => {
        // Given
        req.originalUrl = constants.ACCESS_DENIED_FULL_URL;
        // When
        await loggedUserAcspMembershipMiddleware(req, res, next);
        // Then
        expect(getLoggedUserAcspMembershipSpy).not.toHaveBeenCalled();
        expect(getMembershipForLoggedInUserSpy).not.toHaveBeenCalled();
        expect(setExtraDataSpy).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
