import { getViewData } from "../../../../src/routers/controllers/manageUsersController";
import { mockRequest } from "../../../mocks/request.mock";
import { mockResponse } from "../../../mocks/response.mock";
import * as getTranslationsForView from "../../../../src/lib/utils/translationUtils";
import * as acspMemberService from "../../../../src/services/acspMemberService";
import {
    accountOwnerAcspMembership,
    administratorAcspMembership,
    getMockAcspMembersResource,
    loggedAccountOwnerAcspMembership,
    standardUserAcspMembership
} from "../../../mocks/acsp.members.mock";
import { when } from "jest-when";
import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

const getTranslationsForViewSpy = jest.spyOn(getTranslationsForView, "getTranslationsForView");
const getMembershipForLoggedInUserSpy = jest.spyOn(acspMemberService, "getMembershipForLoggedInUser");
const getAcspMembershipsSpy: jest.SpyInstance = jest.spyOn(acspMemberService, "getAcspMemberships");
const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

describe("manageUsersController - getViewData", () => {
    it("should return the correct view data object", async () => {
        // Given
        const request = mockRequest();
        const response = mockResponse();
        getTranslationsForViewSpy.mockReturnValueOnce({
            remove: "Remove",
            change_role: "Change role",
            for: "for",
            not_provided: "Not Provided"
        });
        getLoggedUserAcspMembershipSpy.mockReturnValue(loggedAccountOwnerAcspMembership);
        when(getMembershipForLoggedInUserSpy)
            .calledWith(expect.anything())
            .mockResolvedValue(getMockAcspMembersResource([loggedAccountOwnerAcspMembership]));
        when(getAcspMembershipsSpy)
            .calledWith(expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), [UserRole.OWNER])
            .mockResolvedValue(getMockAcspMembersResource([accountOwnerAcspMembership, loggedAccountOwnerAcspMembership]));
        when(getAcspMembershipsSpy)
            .calledWith(expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), [UserRole.ADMIN])
            .mockResolvedValue(getMockAcspMembersResource([administratorAcspMembership]));
        when(getAcspMembershipsSpy)
            .calledWith(expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), [UserRole.STANDARD])
            .mockResolvedValue(getMockAcspMembersResource([standardUserAcspMembership]));
        // When
        const result = await getViewData(request, response);
        // Then
        expect(result).toMatchObject({
            accountOwnersTableData: [[

                { text: "james.morris@gmail.com" },
                { text: "Not Provided" },
                {
                    html: "<a data-event-id=\"change-role\" href=\"/authorised-agent/edit-member-role/JGyB\">Change role <span class=\"govuk-visually-hidden\">for james.morris@gmail.com</span></a>"
                },
                {
                    html: "<a data-event-id=\"remove\" href=\"/authorised-agent/remove-member/JGyB\">Remove <span class=\"govuk-visually-hidden\">james.morris@gmail.com</span></a>"
                }

            ],
            [

                { text: "j.smith@domain.com" },
                { text: "Not Provided" },
                {
                    html: "<a data-event-id=\"change-role\" href=\"/authorised-agent/edit-member-role/JGyBds2w\">Change role <span class=\"govuk-visually-hidden\">for j.smith@domain.com</span></a>"
                },
                {
                    html: "<a data-event-id=\"remove\" href=\"/authorised-agent/remove-member/JGyBds2w\">Remove <span class=\"govuk-visually-hidden\">j.smith@domain.com</span></a>"
                }

            ]],
            standardUsersTableData: [[

                { text: "jane.doe@gmail.com" },
                { text: "Not Provided" },
                {
                    html: "<a data-event-id=\"change-role\" href=\"/authorised-agent/edit-member-role/WSC838\">Change role <span class=\"govuk-visually-hidden\">for jane.doe@gmail.com</span></a>"
                },
                {
                    html: "<a data-event-id=\"remove\" href=\"/authorised-agent/remove-member/WSC838\">Remove <span class=\"govuk-visually-hidden\">jane.doe@gmail.com</span></a>"
                }

            ]],
            administratorsTableData: [[

                { text: "jeremy.lloris@gmail.com" },
                { text: "Not Provided" },
                {
                    html: "<a data-event-id=\"change-role\" href=\"/authorised-agent/edit-member-role/ABC123\">Change role <span class=\"govuk-visually-hidden\">for jeremy.lloris@gmail.com</span></a>"
                },
                {
                    html: "<a data-event-id=\"remove\" href=\"/authorised-agent/remove-member/ABC123\">Remove <span class=\"govuk-visually-hidden\">jeremy.lloris@gmail.com</span></a>"
                }

            ]],
            addUserUrl: "/authorised-agent/before-you-add-user",
            backLinkUrl: "/authorised-agent/",
            companyName: "Acme ltd",
            companyNumber: "123456",
            lang: expect.anything(),
            loggedInUserRole: "owner",
            templateName: "manage-users"
        });
    });

    it("should thow an error when acsp details not fetched", async () => {
        const request = mockRequest();
        const response = mockResponse();
        getTranslationsForViewSpy.mockReturnValueOnce({
            remove: "Remove"
        });
        getLoggedUserAcspMembershipSpy.mockReturnValue(undefined);
        await expect(getViewData(request, response))
            .rejects.toThrow();
    });
});
