/* eslint-disable import/first */
process.env.FEATURE_FLAG_SHOW_TELL_US_YOUVE_VERIFIED_A_PERSONS_IDENTITY = "false";
import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

import {
    accountOwnerAcspMembership
} from "../../../mocks/acsp.members.mock";

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);
const url = "/authorised-agent/";

describe(`GET ${url}`, () => {
    const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        await router.get(url);
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
    });

    it("should not display the link to tell companies house you have verified someones identity when feature not enabled", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue(accountOwnerAcspMembership);
        // when(isFeatureEnabledSpy).calledWith(constants.FEATURE_FLAG_SHOW_TELL_US_YOUVE_VERIFIED_A_PERSONS_IDENTITY).mockReturnValue(false);
        // When
        const encodedResponse = await router.get(url);
        const decodedResponse = encodedResponse.text.replace(/&#39;/g, "'");

        // Then
        expect(decodedResponse).not.toContain(
            `href="/tell-companies-house-you-have-verified-someones-identity"`
        );
    });

});
