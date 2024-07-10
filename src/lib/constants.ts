import { getEnvironmentValue } from "./utils/environmentValue";

// English and Welsh translation files AND Nunjucks template files for pages
export const DASHBOARD_PAGE = "dashboard";
export const MANAGE_USERS_PAGE = "manage-users";
export const REMOVE_USER_PAGE = "remove-user";
export const ADD_USER_PAGE = "add-user";
export const CHECK_MEMBER_DETAILS_PAGE = "check-member-details";
export const CONFIRMATION_MEMBER_ADDED_PAGE = "confirmation-member-added";
export const MEMBER_ALREADY_ADDED_PAGE = "member-already-added";
export const REMOVE_MEMBER_PAGE = "remove-member";
export const USER_REMOVE_CONFIRMATION_PAGE = "confirmation-member-removed";

// Other Nunjucks template files
export const SERVICE_UNAVAILABLE_TEMPLATE = "partials/service_unavailable";

// Other English and Welsh translation files
export const COMMON = "common";
export const SERVICE_UNAVAILABLE = "service-unavailable";

// Routing paths
export const LANDING_URL = `/authorised-agent`;
export const DASHBOARD_URL = `/${DASHBOARD_PAGE}`;
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
export const REMOVE_MEMBER_CHECK_DETAILS_URL = `/${REMOVE_MEMBER_PAGE}`;
export const REMOVE_MEMBER_CHECK_DETAILS_FULL_URL = `${LANDING_URL}${REMOVE_MEMBER_CHECK_DETAILS_URL}`;
export const CONFIRMATION_MEMBER_REMOVED_URL = `/${USER_REMOVE_CONFIRMATION_PAGE}`;
export const CONFIRMATION_MEMBER_REMOVED_FULL_URL = `${LANDING_URL}${CONFIRMATION_MEMBER_REMOVED_URL}`;

export const HEALTHCHECK = "/healthcheck";

// APP config
export const DEFAULT_SESSION_EXPIRATION = getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600");

export const CACHE_SERVER = getEnvironmentValue("CACHE_SERVER");
export const CHS_URL = getEnvironmentValue("CHS_URL");
export const COOKIE_DOMAIN = getEnvironmentValue("COOKIE_DOMAIN");
export const COOKIE_NAME = getEnvironmentValue("COOKIE_NAME");
export const COOKIE_SECRET = getEnvironmentValue("COOKIE_SECRET");

// errors
export const VALIDATION_ERRORS = "VALIDATION_ERRORS";
export const MEMBER_ALREADY_ADDED_ERROR = "Member already added";
export const ERRORS_EMAIL_REQUIRED = "errors_email_required";
export const ERRORS_EMAIL_INVALID = "errors_email_invalid";
export const ERRORS_SELECT_USER_ROLE = "errors_select_user_role";

// query params
export const CLEAR_FORM = "cf";
export const CLEAR_FORM_TRUE = "?cf=true";

// session.extra_data
export const DETAILS_OF_USER_TO_ADD = "detailsOfUserToAdd";
export const DETAILS_OF_USER_TO_REMOVE = "detailsOfUserToRemove";
