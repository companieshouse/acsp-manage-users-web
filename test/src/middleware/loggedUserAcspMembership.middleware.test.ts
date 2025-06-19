import * as sessionUtils from "../../../src/lib/utils/sessionUtils";
import * as acspMemberService from "../../../src/services/acspMemberService";
import * as constants from "../../../src/lib/constants";
import { Request, Response } from "express";
import { loggedUserAcspMembershipMiddleware } from "../../../src/middleware/loggedUserAcspMembership.middleware";
import { Session } from "@companieshouse/node-session-handler";
import { getMockAcspMembersResource, loggedAccountOwnerAcspMembership } from "../../mocks/acsp.members.mock";
import { AcspStatus } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { SignOutError } from "../../../src/lib/utils/errors/sign-out-error";

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
        res.redirect = jest.fn();
        res.set = jest.fn();
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

    it("should throw a SignOutError when user membership status is CEASED", async () => {
        const ceasedMembership = {
            ...loggedAccountOwnerAcspMembership,
            acspStatus: AcspStatus.CEASED
        };
        getLoggedUserAcspMembershipSpy.mockReturnValue(undefined);
        getMembershipForLoggedInUserSpy.mockReturnValue(getMockAcspMembersResource([ceasedMembership]));

        // When
        await expect(loggedUserAcspMembershipMiddleware(req, res, next))
            .rejects
            .toThrow(SignOutError);

        // Then
        expect(next).not.toHaveBeenCalled();
    });

    it("should throw error when no membership is found", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(undefined);
        getMembershipForLoggedInUserSpy.mockReturnValue({ items: [] });

        // When/Then
        await expect(loggedUserAcspMembershipMiddleware(req, res, next))
            .rejects
            .toThrow("No membership found for logged in user");
    });

    it("should refresh membership when on dashboard page", async () => {
        // Given
        req.originalUrl = constants.DASHBOARD_FULL_URL;
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        getMembershipForLoggedInUserSpy.mockReturnValue(getMockAcspMembersResource([loggedAccountOwnerAcspMembership]));

        // When
        await loggedUserAcspMembershipMiddleware(req, res, next);

        // Then
        expect(getMembershipForLoggedInUserSpy).toHaveBeenCalled();
        expect(setExtraDataSpy).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it("should skip middleware for access denied page", async () => {
        // Given
        req.originalUrl = constants.ACCESS_DENIED_FULL_URL;

        // When
        await loggedUserAcspMembershipMiddleware(req, res, next);

        // Then
        expect(getLoggedUserAcspMembershipSpy).not.toHaveBeenCalled();
        expect(getMembershipForLoggedInUserSpy).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });
});
