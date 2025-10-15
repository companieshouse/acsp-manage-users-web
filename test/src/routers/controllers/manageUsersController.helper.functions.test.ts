import * as en from "../../../../locales/en/manage-users.json";
import * as enCommon from "../../../../locales/en/common.json";
import { AnyRecord } from "../../../../src/types/utilTypes";
import { AcspStatus, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { getTitle, handleAcspDetailUpdates } from "../../../../src/routers/controllers/manageUsersController";
import { Session } from "@companieshouse/node-session-handler";
import { Request, Response } from "express";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import { getMockAcspMembersResource, loggedAccountOwnerAcspMembership } from "../../../mocks/acsp.members.mock";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";
import { SignOutError } from "../../../../src/lib/utils/errors/sign-out-error";

describe("getTitle", () => {
    const allTranslations = {
        ...en,
        ...enCommon
    } as AnyRecord;

    it.each([
        // Given
        [`${enCommon.title_error}${en.page_header}${enCommon.title_end}`, UserRole.OWNER, true, allTranslations],
        [`${enCommon.title_error}${en.page_header}${enCommon.title_end}`, UserRole.ADMIN, true, allTranslations],
        [`${enCommon.title_error}${en.page_header_standard}${enCommon.title_end}`, UserRole.STANDARD, true, allTranslations],
        [`${en.page_header}${enCommon.title_end}`, UserRole.OWNER, false, allTranslations],
        [`${en.page_header}${enCommon.title_end}`, UserRole.ADMIN, false, allTranslations],
        [`${en.page_header_standard}${enCommon.title_end}`, UserRole.STANDARD, false, allTranslations]
    ])("should return text '%s' when user role is '%s' and isError is %s", (expectedText, userRole, isError, translations) => {
        // When
        const result = getTitle(translations, userRole, isError);
        // Then
        expect(result).toEqual(expectedText);
    });
});

describe("handleAcspDetailUpdates", () => {
    const getMembershipForLoggedInUserSpy: jest.SpyInstance = jest.spyOn(acspMemberService, "getMembershipForLoggedInUser");
    const setExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "setExtraData");

    let session: Session;
    let req: Request;
    const res: Response = {} as Response;

    beforeEach(() => {
        jest.clearAllMocks();
        session = new Session();
        req = {
            session
        } as Request;
        res.redirect = jest.fn();
        res.set = jest.fn();
    });

    it("should call getMembershipForLoggedInUser when names mismatch and save to session", async () => {
        const companyNameInSession = "Test Company";
        const firstMemberAcspName = "Different Company Name";

        getMembershipForLoggedInUserSpy.mockReturnValue(getMockAcspMembersResource([loggedAccountOwnerAcspMembership]));

        // When
        await handleAcspDetailUpdates(req, companyNameInSession, firstMemberAcspName, AcspStatus.ACTIVE);

        // Then
        expect(getMembershipForLoggedInUserSpy).toHaveBeenCalledWith(req);
        expect(setExtraDataSpy).toHaveBeenCalled();

    });

    it("should sign out the user when acsp staus is ceased", async () => {
        const companyNameInSession = "Test Company";
        const firstMemberAcspName = "Test Company";

        // When
        await expect(handleAcspDetailUpdates(req, companyNameInSession, firstMemberAcspName, AcspStatus.CEASED))
            .rejects.toThrow(SignOutError);
        // Then

        expect(setExtraDataSpy).not.toHaveBeenCalled();
        expect(getMembershipForLoggedInUserSpy).not.toHaveBeenCalled();
    });

    it("should not update session when names match and acsp status is active", async () => {
        const companyNameInSession = "Test Company";
        const firstMemberAcspName = "Test Company";

        getMembershipForLoggedInUserSpy.mockReturnValue(getMockAcspMembersResource([loggedAccountOwnerAcspMembership]));

        // When
        await handleAcspDetailUpdates(req, companyNameInSession, firstMemberAcspName, AcspStatus.ACTIVE);

        // Then
        expect(getMembershipForLoggedInUserSpy).not.toHaveBeenCalled();
        expect(setExtraDataSpy).not.toHaveBeenCalled();
        expect(res.redirect).not.toHaveBeenCalled();
    });

    it("should not update session when no membership is found", async () => {
        const companyNameInSession = "Test Company";
        const firstMemberAcspName = "Different Company Name";

        getMembershipForLoggedInUserSpy.mockReturnValue({ items: [] });

        // When
        await expect(handleAcspDetailUpdates(req, companyNameInSession, firstMemberAcspName, AcspStatus.ACTIVE))
            .rejects.toThrow("No membership found for logged in user");
        // Then
        expect(getMembershipForLoggedInUserSpy).toHaveBeenCalledWith(req);
        expect(res.redirect).not.toHaveBeenCalled();
    });

});
