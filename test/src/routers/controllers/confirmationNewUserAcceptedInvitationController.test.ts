import mocks from "../../../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../../../src/app";
import * as en from "../../../../locales/en/confirmation-new-user-accepted-invitation.json";
import * as cy from "../../../../locales/cy/confirmation-new-user-accepted-invitation.json";
import * as enCommon from "../../../../locales/en/common.json";
import * as cyCommon from "../../../../locales/cy/common.json";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { confirmationNewUserAcceptedInvitationControllerGet } from "../../../../src/routers/controllers/confirmationNewUserAcceptedInvitationController";
import * as constants from "../../../../src/lib/constants";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

jest.mock("../../../../src/lib/helpers/acspLogger");
jest.mock("../../../../src/lib/Logger");

const router = supertest(app);

const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

describe("GET /authorised-agent/confirmation-new-user-accepted-invitation", () => {
    const url = "/authorised-agent/confirmation-new-user-accepted-invitation";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should check session, user auth and ACSP membership before returning the page", async () => {
        // Given
        getLoggedUserAcspMembershipSpy.mockReturnValue({ acspName: "Test", userRole: UserRole.ADMIN });
        // When
        await router.get(url);
        // Then
        expect(mocks.mockSessionMiddleware).toHaveBeenCalled();
        expect(mocks.mockAuthenticationMiddleware).toHaveBeenCalled();
        expect(mocks.mockLoggedUserAcspMembershipMiddleware).toHaveBeenCalled();
        expect(mocks.mockEnsureSessionCookiePresentMiddleware).toHaveBeenCalled();
    });

    test.each([
        {
            langVersion: "en",
            langInfo: "English",
            userRole: UserRole.OWNER,
            userRoleText: en.an_account_owner,
            lang: en,
            langCommon: enCommon
        },
        {
            langVersion: "cy",
            langInfo: "Welsh",
            userRole: UserRole.OWNER,
            userRoleText: cy.an_account_owner,
            lang: cy,
            langCommon: cyCommon
        },
        {
            langVersion: "en",
            langInfo: "English",
            userRole: UserRole.ADMIN,
            userRoleText: en.an_administrator,
            lang: en,
            langCommon: enCommon
        },
        {
            langVersion: "cy",
            langInfo: "Welsh",
            userRole: UserRole.ADMIN,
            userRoleText: cy.an_administrator,
            lang: cy,
            langCommon: cyCommon
        },
        {
            langVersion: "en",
            langInfo: "English",
            userRole: UserRole.STANDARD,
            userRoleText: en.a_standard_user,
            lang: en,
            langCommon: enCommon
        },
        {
            langVersion: "cy",
            langInfo: "Welsh",
            userRole: UserRole.STANDARD,
            userRoleText: cy.a_standard_user,
            lang: cy,
            langCommon: cyCommon
        }
    ])("should return status 200 and the expected $langInfo content for $userRole",
        async ({ langVersion, userRole, userRoleText, lang, langCommon }) => {
            // Given
            const acspName = "Test Company";
            getLoggedUserAcspMembershipSpy.mockReturnValue({ acspName, userRole });
            // When
            const response = await router.get(`${url}?lang=${langVersion}`);
            // Then
            expect(response.status).toEqual(200);
            expect(response.text).toContain(lang.page_header);
            expect(response.text).toContain(lang.you_can_now_access);
            expect(response.text).toContain(lang.go_to_the_account);
            expect(response.text).toContain(langCommon.success);
            expect(response.text).toContain(`${lang.you_have_been_added_as} ${userRoleText} ${langCommon.for} ${acspName}.`);
        });
});

describe("confirmationNewUserAcceptedInvitationControllerGet", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call render with expected view data", async () => {
        // Given
        const request = mockRequest();
        const response = mockResponse();
        const loggedInUserMembership = {
            userRole: "admin",
            acspName: "companyName"
        };
        const translations = { key: "value" };
        const mockGetTranslationsForView = jest.spyOn(getTranslationsForView, "getTranslationsForView");
        mockGetTranslationsForView.mockReturnValue(translations);
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedInUserMembership);
        // When
        await confirmationNewUserAcceptedInvitationControllerGet(request, response);
        // Then
        expect(response.render).toHaveBeenCalledWith(constants.CONFIRMATION_NEW_USER_ACCEPTED_INVITATION_PAGE, {
            companyName: loggedInUserMembership.acspName,
            userRole: loggedInUserMembership.userRole,
            buttonHref: constants.LANDING_URL,
            templateName: constants.CONFIRMATION_NEW_USER_ACCEPTED_INVITATION_PAGE,
            lang: translations
        });
    });
});
