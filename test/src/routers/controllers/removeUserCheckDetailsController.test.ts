import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/remove-member.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cy from "../../../../locales/cy/remove-member.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import * as constants from "../../../../src/lib/constants";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { loggedAccountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";
import {
    loggedOwnerUserMembership,
    loggedOwnerUserMembershipWithDisplayName,
    otherOwnerUserMembership,
    userAdamBrownRemoveDetails,
    userAdamBrownRemoveDetailsWithDisplayName
} from "../../../mocks/user.mock";
import { when } from "jest-when";

jest.mock("../../../../src/lib/Logger");

const router = supertest(app);

const url = "/authorised-agent/remove-member/";
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");
const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");

describe("GET /authorised-agent/remove-member", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each([
        ["English", "themself", "provided", "en", loggedOwnerUserMembershipWithDisplayName, en, enCommon],
        ["Welsh", "themself", "provided", "cy", loggedOwnerUserMembershipWithDisplayName, cy, cyCommon],
        ["English", "themself", "not provided", "en", loggedOwnerUserMembership, en, enCommon],
        ["Welsh", "themself", "not provided", "cy", loggedOwnerUserMembership, cy, cyCommon],
        ["English", "other user", "provided", "en", userAdamBrownRemoveDetailsWithDisplayName, en, enCommon],
        ["Welsh", "other user", "provided", "cy", userAdamBrownRemoveDetailsWithDisplayName, cy, cyCommon],
        ["English", "other user", "not provided", "en", userAdamBrownRemoveDetails, en, enCommon],
        ["Welsh", "other user", "not provided", "cy", userAdamBrownRemoveDetails, cy, cyCommon]
    ])("should check session, user auth and ACSP membership and then return %s content when user intends removing %s, the display name is %s and lang set to %s",
        async (_expectedLanguage, _whoToRemove, isDisplayNameProvided, langVersion, userData, lang, langCommon) => {
            // Given
            getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
            when(getExtraDataSpy).calledWith(expect.anything(), constants.MANAGE_USERS_MEMBERSHIP).mockReturnValue([userData, otherOwnerUserMembership]);
            // When
            const response = await router.get(`${url}${userData.id}?lang=${langVersion}`);
            // Then
            expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
            expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
            expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
            expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
            expect(response.statusCode).toEqual(200);
            if (_whoToRemove === "themself") {
                expect(response.text).toContain(lang.are_you_sure);
                expect(response.text).toContain(lang.if_remove_yourself);
                expect(response.text).toContain(lang.youll_be_immediately_signed_out);
                expect(response.text).toContain(lang.remove_and_sign_out);
            } else {
                expect(response.text).toContain(`${lang.remove}${userData.displayNameOrEmail}`);
                if (isDisplayNameProvided === "provided") {
                    expect(response.text).toContain(`${lang.if_you_remove}${`${userData.userDisplayName} (${userData.userEmail})`}${lang.they_will_not_be_able_to_use}${loggedAccountOwnerAcspMembership.acspName}.`);
                } else {
                    expect(response.text).toContain(`${lang.if_you_remove}${userData.userEmail}${lang.they_will_not_be_able_to_use}${loggedAccountOwnerAcspMembership.acspName}.`);
                }

            }
            expect(response.text).toContain(`${langCommon.cancel}`);

        });
});
