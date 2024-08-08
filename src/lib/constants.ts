import { getEnvironmentValue } from "./utils/environmentValue";

// English and Welsh translation files AND Nunjucks template files for pages
export const DASHBOARD_PAGE = "dashboard";
export const MANAGE_USERS_PAGE = "manage-users";
export const REMOVE_USER_PAGE = "remove-user";
export const ADD_USER_PAGE = "add-user";
export const CHECK_MEMBER_DETAILS_PAGE = "check-member-details";
export const CONFIRMATION_MEMBER_ADDED_PAGE = "confirmation-member-added";
export const MEMBER_ALREADY_ADDED_PAGE = "member-already-added";
export const PLACEHOLDER_CREATE_CH_ACC = "placeholder-create-ch-account";
export const VIEW_USERS_PAGE = "view-users";
export const REMOVE_MEMBER_PAGE = "remove-member";
export const USER_REMOVE_CONFIRMATION_PAGE = "confirmation-member-removed";
export const MEMBER_ALREADY_REMOVED_PAGE = "member-already-removed";
export const CONFIRMATION_YOU_ARE_REMOVED = "confirmation-you-are-removed";
export const STOP_PAGE_ADD_ACCOUNT_OWNER = "stop-page-add-account-owner";

// Other Nunjucks template files
export const SERVICE_UNAVAILABLE_TEMPLATE = "partials/service_unavailable";

// Other English and Welsh translation files
export const COMMON = "common";
export const SERVICE_UNAVAILABLE = "service-unavailable";

// Routing paths
export const LANDING_URL = `/authorised-agent`;
export const DASHBOARD_URL = "/";
export const DASHBOARD_FULL_URL = `${LANDING_URL}${DASHBOARD_URL}`;
export const MANAGE_USERS_URL = `/${MANAGE_USERS_PAGE}`;
export const MANAGE_USER_FULL_URL = `${LANDING_URL}${MANAGE_USERS_URL}`;
export const REMOVE_USER_URL = `/${REMOVE_USER_PAGE}`;
export const REMOVE_USER_FULL_URL = `${LANDING_URL}${REMOVE_USER_URL}`;
export const ADD_USER_URL = `/${ADD_USER_PAGE}`;
export const ADD_USER_FULL_URL = `${LANDING_URL}${ADD_USER_URL}`;
export const CHECK_MEMBER_DETAILS_URL = `/${CHECK_MEMBER_DETAILS_PAGE}`;
export const CHECK_MEMBER_DETAILS_FULL_URL = `${LANDING_URL}${CHECK_MEMBER_DETAILS_URL}`;
export const TRY_ADDING_USER_URL = "/try-adding-user";
export const TRY_ADDING_USER_FULL_URL = `${LANDING_URL}${TRY_ADDING_USER_URL}`;
export const CONFIRMATION_MEMBER_ADDED_URL = `/${CONFIRMATION_MEMBER_ADDED_PAGE}`;
export const CONFIRMATION_MEMBER_ADDED_FULL_URL = `${LANDING_URL}${CONFIRMATION_MEMBER_ADDED_URL}`;
export const MEMBER_ALREADY_ADDED_URL = `/${MEMBER_ALREADY_ADDED_PAGE}`;
export const MEMBER_ALREADY_ADDED_FULL_URL = `${LANDING_URL}${MEMBER_ALREADY_ADDED_URL}`;
export const PLACEHOLDER_CREATE_CH_ACC_URL = `/${PLACEHOLDER_CREATE_CH_ACC}`;
export const PLACEHOLDER_CREATE_CH_ACC_FULL_URL = `${LANDING_URL}${PLACEHOLDER_CREATE_CH_ACC_URL}`;
export const VIEW_USERS_URL = `/${VIEW_USERS_PAGE}`;
export const VIEW_USERS_FULL_URL = `${LANDING_URL}${VIEW_USERS_URL}`;
export const REMOVE_MEMBER_CHECK_DETAILS_URL = `/${REMOVE_MEMBER_PAGE}/:id`;
export const REMOVE_MEMBER_CHECK_DETAILS_FULL_URL = `${LANDING_URL}${REMOVE_MEMBER_CHECK_DETAILS_URL}`;
export const CONFIRMATION_MEMBER_REMOVED_URL = `/${USER_REMOVE_CONFIRMATION_PAGE}`;
export const CONFIRMATION_MEMBER_REMOVED_FULL_URL = `${LANDING_URL}${CONFIRMATION_MEMBER_REMOVED_URL}`;
export const MEMBER_ALREADY_REMOVED_URL = `/${MEMBER_ALREADY_REMOVED_PAGE}`;
export const MEMBER_ALREADY_REMOVED_FULL_URL = `${LANDING_URL}${MEMBER_ALREADY_REMOVED_URL}`;
export const TRY_REMOVING_USER_URL = "/try-removing-user";
export const TRY_REMOVING_USER_FULL_URL = `${LANDING_URL}${TRY_REMOVING_USER_URL}`;
export const CONFIRMATION_YOU_ARE_REMOVED_URL = `/${CONFIRMATION_YOU_ARE_REMOVED}`;
export const CONFIRMATION_YOU_ARE_REMOVED_FULL_URL = `${LANDING_URL}${CONFIRMATION_YOU_ARE_REMOVED_URL}`;
export const STOP_PAGE_ADD_ACCOUNT_OWNER_URL = `/${STOP_PAGE_ADD_ACCOUNT_OWNER}`;
export const STOP_PAGE_ADD_ACCOUNT_OWNER_URL_FULL_URL = `${LANDING_URL}${STOP_PAGE_ADD_ACCOUNT_OWNER_URL}`;
export const HEALTHCHECK = "/healthcheck";

// External URLs
export const YOU_HAVE_VERIFIED_SOMEONES_IDENTITY_URL = "/placeholder-url-to-service-build-by-other-team";
export const UPDATE_AUTHORISED_AGENTS_DETAILS_URL = "/placeholder-url-to-service-build-by-other-team";
export const CHS_SEARCH_REGISTER_PAGE = "https://find-and-update.company-information.service.gov.uk/";

// APP config
export const DEFAULT_SESSION_EXPIRATION = getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600");

export const CACHE_SERVER = getEnvironmentValue("CACHE_SERVER");
export const CHS_URL = getEnvironmentValue("CHS_URL");
export const COOKIE_DOMAIN = getEnvironmentValue("COOKIE_DOMAIN");
export const COOKIE_NAME = getEnvironmentValue("COOKIE_NAME");
export const COOKIE_SECRET = getEnvironmentValue("COOKIE_SECRET");
export const INTERNAL_API_URL = getEnvironmentValue("INTERNAL_API_URL");
export const ACCOUNTS_USER_INTERNAL_API_KEY = getEnvironmentValue("ACCOUNTS_USER_INTERNAL_API_KEY");
export const ACCOUNT_URL = getEnvironmentValue("ACCOUNT_URL");

// errors
export const VALIDATION_ERRORS = "VALIDATION_ERRORS";
export const MEMBER_ALREADY_ADDED_ERROR = "Member already added";
export const ERRORS_EMAIL_REQUIRED = "errors_email_required";
export const ERRORS_EMAIL_INVALID = "errors_email_invalid";
export const ERRORS_SELECT_USER_ROLE = "errors_select_user_role";
export const MEMBER_ALREADY_REMOVED_ERROR = "Member already removed";
export const ERRORS_ENTER_AN_EMAIL_ADDRESS_IN_THE_CORRECT_FORMAT = "errors_enter_an_email_address_in_the_correct_format";

// query params
export const CLEAR_FORM = "cf";
export const CLEAR_FORM_TRUE = "?cf=true";

// session.extra_data
export const DETAILS_OF_USER_TO_ADD = "detailsOfUserToAdd";
export const DETAILS_OF_USER_TO_REMOVE = "detailsOfUserToRemove";
export const MANAGE_USERS_MEMBERSHIP = "manageUsersMembership";
export const LOGGED_USER_ACSP_MEMBERSHIP = "loggedUserAcspMembership";

// Various
export const ACCOUNT_OWNERS_ID = "account-owners";
export const ADMINISTRATORS_ID = "administrators";
export const STANDARD_USERS_ID = "standard-users";
export const ACCOUNT_OWNERS_TAB_ID = `tab_${ACCOUNT_OWNERS_ID}`;
export const ADMINISTRATORS_TAB_ID = `tab_${ADMINISTRATORS_ID}`;
export const STANDARD_USERS_TAB_ID = `tab_${STANDARD_USERS_ID}`;
