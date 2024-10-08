import { Session } from "@companieshouse/node-session-handler";
import { getSessionRequestWithPermission, userMail } from "../../../mocks/session.mock";
import {
    deleteExtraData,
    getAccessToken,
    getExtraData,
    getLoggedInUserEmail,
    getLoggedUserAcspMembership,
    setExtraData,
    getLoggedInAcspNumber,
    isAuthorisedAgent
} from "../../../../src/lib/utils/sessionUtils";
import * as constants from "../../../../src/lib/constants";
import { accountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

describe("Session Utils", () => {
    describe("getLoggedInUserEmail", () => {
        const testSessionWithPermission: Session = getSessionRequestWithPermission();
        it("should return user email address if user is logged in", () => {
            expect(getLoggedInUserEmail(testSessionWithPermission)).toEqual(userMail);
        });

        it("should return undefined instead of user email address if user is not logged in", () => {
            expect(getLoggedInUserEmail(undefined)).toBeUndefined;
        });

        it("should return undefined instead of user email address if session data is missing", () => {
            expect(getLoggedInUserEmail(new Session())).toBeUndefined;
        });
    });

    describe("getLoggedInAcspNumber", () => {
        const testSessionWithPermission: Session = getSessionRequestWithPermission();
        it("should return ACSP number if user is logged in", () => {
            expect(getLoggedInAcspNumber(testSessionWithPermission)).toEqual("ABC123");
        });

        it("should return undefined if user is not logged in", () => {
            expect(getLoggedInAcspNumber(undefined)).toBeUndefined;
        });

        it("should return undefined if session data is missing", () => {
            expect(getLoggedInAcspNumber(new Session())).toBeUndefined;
        });
    });

    describe("setExtraData", () => {
        it("should set extra data to session if provided", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            // When
            setExtraData(session, key, value);
            // Then
            expect(session.data.extra_data[key]).toEqual(value);
        });
    });

    describe("getExtraData", () => {
        it("should return extra data from session if exists", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            session.data.extra_data[key] = value;
            // When
            const result = getExtraData(session, key);
            // Then
            expect(result).toEqual(value);
        });

        it("should return undefined if session is not provided", () => {
            // Given
            const session = undefined;
            const key = "testKey";
            // When
            const result = getExtraData(session, key);
            // Then
            expect(result).toEqual(undefined);
        });

        it("should return undefined if there is no data with the provided key", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            session.data.extra_data[key] = value;
            // When
            const result = getExtraData(session, "test");
            // Then
            expect(result).toEqual(undefined);
        });
    });

    describe("deleteExtraData", () => {
        it("should delete extra data from session if exist", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            setExtraData(session, key, value);
            expect(session.data.extra_data[key]).toEqual(value);
            // When
            const result = deleteExtraData(session, key);
            // Then
            expect(session.data.extra_data[key]).toEqual(undefined);
            expect(result).toBeTruthy();
        });

        it("should not delete extra data from session if exist and wrong key provided", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            setExtraData(session, key, value);
            expect(session.data.extra_data[key]).toEqual(value);
            // When
            const result = deleteExtraData(session, "wrongKey");
            // Then
            expect(session.data.extra_data[key]).toEqual(value);
            expect(result).toBeTruthy();
        });

        it("should not delete extra data from session if session not provided", () => {
            // Given
            const session: Session = new Session();
            const key = "testKey";
            const value = "testValue";
            setExtraData(session, key, value);
            expect(session.data.extra_data[key]).toEqual(value);
            // When
            const result = deleteExtraData(undefined, key);
            // Then
            expect(session.data.extra_data[key]).toEqual(value);
            expect(result).toBeFalsy();
        });
    });

    describe("getAccessToken", () => {
        it("should return access token from session if exist", () => {
            // Given
            const accessToken = "access token";
            const session: Session = new Session();
            (session.data.signin_info as unknown) = { access_token: { access_token: accessToken } };
            // When
            const result = getAccessToken(session);
            // Then
            expect(result).toEqual(accessToken);
        });
    });

    describe("getLoggedUserAcspMembership", () => {
        it("should return ACSP membership if exists", () => {
            // Given
            const session: Session = new Session();
            const key = constants.LOGGED_USER_ACSP_MEMBERSHIP;
            const value = accountOwnerAcspMembership;
            setExtraData(session, key, value);
            expect(session.data.extra_data[key]).toEqual(value);
            // When
            const result = getLoggedUserAcspMembership(session);
            // Then
            expect(result).toEqual(accountOwnerAcspMembership);
        });

        it("should return undefined if ACSP membership does not exist", () => {
            // Given
            const session: Session = new Session();
            const key = constants.LOGGED_USER_ACSP_MEMBERSHIP;
            expect(session.data.extra_data[key]).toBeUndefined();
            // When
            const result = getLoggedUserAcspMembership(session);
            // Then
            expect(result).toBeUndefined();
        });
    });

    describe("isAuthorisedAgent", () => {
        const getLoggedInAcspNumberSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedInAcspNumber");
        const session: Session = new Session();

        test.each([
            [true, "ABC123"],
            [true, "_Is_A_String_With_32_Characters_"],
            [true, "VPGVIfopFzULZ00p9BH9GUVLei1k4DKH"],
            [false, ""],
            [false, undefined],
            [false, null],
            [false, "IsStringWith%Special$Characters"],
            [false, "Is_String_With_Over_32_Characters"],
            [false, "AA/01"]
        ])("should return %s if logged in ACSP number is %s",
            (expectedResult, acspNumber) => {
                // Given
                getLoggedInAcspNumberSpy.mockReturnValue(acspNumber);
                // When
                const result = isAuthorisedAgent(session);
                // Then
                expect(result).toEqual(expectedResult);
            });
    });
});
