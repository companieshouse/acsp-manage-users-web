import { mockRequest } from "../../mocks/request.mock";
import { mockResponse } from "../../mocks/response.mock";
import { navigationMiddleware } from "../../../src/middleware/navigationMiddleware";
import * as sessionUtils from "../../../src/lib/utils/sessionUtils";

describe("navigiationMiddleware", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const getExtraDataSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getExtraData");
    const mockedNext = jest.fn();
    const request = mockRequest();
    const response = mockResponse();
    const adminUser = {
        id: "123;",
        userId: "123",
        userRole: "admin",
        acspNumber: "123",
        acspName: "companyName"
    };
    const standardUser = {
        id: "123;",
        userId: "123",
        userRole: "standard",
        acspNumber: "123",
        acspName: "companyName"
    };

    const redirectedNavigationCases = [
        {
            description: "should redirect when referer is not in the allowed list for the check member details",
            url: "/authorised-agent/check-member-details",
            referer: "/authorised-agent/confirmation-you-are-removed",
            user: ""
        },
        {
            description: "should redirect when referer is not in the allowed list for the confirmation member added",
            url: "/authorised-agent/confirmation-member-added",
            referer: "/authorised-agent/confirmation-you-are-removed",
            user: ""
        },
        {
            description: "should redirect when referer is not in the allowed list for the remove member added",
            url: "/authorised-agent/remove-member/123",
            referer: "/authorised-agent/confirmation-member-removed",
            user: ""
        },
        {
            description: "should redirect when referer is not in the allowed list for the confirmation member removed",
            url: "/authorised-agent/confirmation-member-removed",
            referer: "/authorised-agent/cannot",
            user: ""
        },
        {
            description: "should redirect when referer is not in the allowed list for the add a user page",
            url: "/authorised-agent/add-user",
            referer: "/authorised-agent/cannot",
            user: ""
        },
        {
            description: "should redirect when referer is not in the allowed list for the cannot add a user page",
            url: "/authorised-agent/cannot-add-user",
            referer: "/authorised-agent/cannot",
            user: ""
        },
        {
            description: "should redirect when referer is not in the allowed list for the stop page add account owner",
            url: "/authorised-agent/stop-page-add-account-owner",
            referer: "/authorised-agent/cannot",
            user: ""
        },
        {
            description: "should redirect and not allow a standard user to access the remove member page",
            url: "/authorised-agent/remove-member/123",
            referer: "/authorised-agent/any-referer",
            user: standardUser
        },
        {
            description: "should redirect to manage-users when referer is not in the allowed list for the edit member role page",
            url: "/authorised-agent/edit-member-role/123",
            referer: "/authorised-agent/any-referer",
            user: ""
        },
        {
            description: "should redirect to manage-users when referer is not in the allowed list for check-edit-member-role-details page",
            url: "/authorised-agent/check-edit-member-role-details",
            referer: "/authorised-agent/any-referer",
            user: ""
        },
        {
            description: "should redirect to manage-users when referer is not in the allowed list for confirmation-member-role-edited page",
            url: "/authorised-agent/confirmation-member-role-edited",
            referer: "/authorised-agent/any-referer",
            user: ""
        },
        {
            description: "should redirect admin user to manage users from view users",
            url: "/authorised-agent/view-users",
            referer: "/authorised-agent/any-referer",
            user: adminUser
        }
    ];

    test.each(redirectedNavigationCases)(
        "$description",
        ({ url, referer, user }) => {

            // Given
            const mockedNext = jest.fn();
            const request = mockRequest();
            const response = mockResponse();

            request.originalUrl = url;
            request.headers.referer = referer;
            getExtraDataSpy.mockReturnValue(user);

            // When
            navigationMiddleware(request, response, mockedNext);

            // Then
            expect(mockedNext).not.toHaveBeenCalled();
            expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/manage-users");

        }
    );

    const allowedNavigationCases = [
        {
            description: "should call next when the navigation does not exist",
            url: "/authorised-agent/add-account-owner",
            referer: "/authorised-agent/add-user",
            user: ""
        },
        {
            description: "should allow admin user to add a user page when before you add a user is the referer",
            url: "/authorised-agent/before-you-add-user",
            referer: "/authorised-agent/add-user",
            user: adminUser
        },
        {
            description: "should allow admin user to check member details page when add a user is the referer",
            url: "/authorised-agent/check-member-details",
            referer: "/authorised-agent/add-user",
            user: adminUser
        },
        {
            description: "should allow request to user added success page when check member details is the referer",
            url: "/authorised-agent/confirmation-member-added",
            referer: "/authorised-agent/check-member-details",
            user: adminUser
        },
        {
            description: "should allow request to remove member page when the remove member is the referer",
            url: "/authorised-agent/remove-member/123",
            referer: "/authorised-agent/remove-member/123",
            user: adminUser
        },
        {
            description: "should allow request to remove success page when remove member is the referer",
            url: "/authorised-agent/confirmation-member-removed",
            referer: "/authorised-agent/remove-member/123",
            user: adminUser
        },
        {
            description: "should allow request to remove yourself success page when remove member is the referer",
            url: "/authorised-agent/confirmation-you-are-removed",
            referer: "/authorised-agent/remove-member/123",
            user: adminUser
        },
        {
            description: "should allow request to cannot add user page when check member details is the referer",
            url: "/authorised-agent/cannot-add-user",
            referer: "/authorised-agent/check-member-details",
            user: adminUser
        },
        {
            description: "should allow request to cannot add user page is when the check member details is the referer",
            url: "/authorised-agent/cannot-add-user",
            referer: "/authorised-agent/check-member-details",
            user: adminUser
        },
        {
            description: "should allow request to stop page account owner when the remove member is the referer",
            url: "/authorised-agent/stop-page-add-account-owner",
            referer: "/authorised-agent/remove-member/123",
            user: adminUser
        },
        {
            description: "should load edit member role page when manage users is the referer",
            url: "/authorised-agent/edit-member-role/123",
            referer: "/authorised-agent/manage-users",
            user: adminUser
        },
        {
            description: "should load edit member role page when edit member role is the referer (switched language)",
            url: "/authorised-agent/edit-member-role/123",
            referer: "/authorised-agent/edit-member-role/123",
            user: adminUser
        },
        {
            description: "should load edit member role page when check edit member role details page is the referer",
            url: "/authorised-agent/edit-member-role/123",
            referer: "/authorised-agent/check-edit-member-role-details",
            user: adminUser
        },
        {
            description: "should load check-edit-member-role-details page when edit-member-role page is the referer",
            url: "/authorised-agent/check-edit-member-role-details",
            referer: "/authorised-agent/edit-member-role/123",
            user: adminUser
        },
        {
            description: "should load check-edit-member-role-details page when check-edit-member-role-details is the referer (switched language)",
            url: "/authorised-agent/check-edit-member-role-details",
            referer: "/authorised-agent/check-edit-member-role-details",
            user: adminUser
        },
        {
            description: "should load confirmation-member-role-edited page when check-edit-member-role-details is the referer",
            url: "/authorised-agent/confirmation-member-role-edited",
            referer: "/authorised-agent/check-edit-member-role-details",
            user: adminUser
        },
        {
            description: "should load confirmation-member-role-edited page when confirmation-member-role-edited is the referer (switched languages)",
            url: "/authorised-agent/confirmation-member-role-edited",
            referer: "/authorised-agent/confirmation-member-role-edited",
            user: adminUser
        },
        {
            description: "should allow standard user to access view users",
            url: "/authorised-agent/view-users",
            referer: "/authorised-agent/any-referer",
            user: standardUser
        },
        {
            description: "should allow admin user to access manage users",
            url: "/authorised-agent/manage-users",
            referer: "/authorised-agent/any-referer",
            user: adminUser
        }
    ];

    test.each(allowedNavigationCases)(
        "$description",
        ({ url, referer, user }) => {
            // Given
            request.originalUrl = url;
            request.headers.referer = referer;
            getExtraDataSpy.mockReturnValue(user);

            // When
            navigationMiddleware(request, response, mockedNext);

            // Then
            expect(mockedNext).toHaveBeenCalled();

        }
    );

    it("should redirect to view-users and not allow a standard user to access the add user page", () => {
        // Given
        request.originalUrl = "/authorised-agent/add-user";
        request.headers.referer = "/authorised-agent/any-referer";
        getExtraDataSpy.mockReturnValue(standardUser);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/view-users");
    });

    it("should redirect to view-users and not allow a standard user to access manage user page", () => {
        // Given
        request.originalUrl = "/authorised-agent/manage-users";
        request.headers.referer = "/authorised-agent/any-referer";
        getExtraDataSpy.mockReturnValue(standardUser);

        // When
        navigationMiddleware(request, response, mockedNext);

        // Then
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/view-users");
    });

    it("should redirect to the dashboard if user has a role and URL is /authorised-agent/access-denied", () => {
        // Given
        request.originalUrl = "/authorised-agent/access-denied";
        request.headers.referer = "/authorised-agent/any-referer";
        getExtraDataSpy.mockReturnValue(standardUser);
        // When
        navigationMiddleware(request, response, mockedNext);
        // Then
        expect(mockedNext).not.toHaveBeenCalled();
        expect(response.redirect).toHaveBeenCalledWith("/authorised-agent/");
    });
});
