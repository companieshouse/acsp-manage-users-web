import { getEnvironmentValue } from "./utils/environmentValue";

// APP Config
export const SERVICE_NAME = "ACSP Manage Users Web";
export const ACCOUNTS_USER_INTERNAL_API_KEY = getEnvironmentValue("ACCOUNTS_USER_INTERNAL_API_KEY");
export const ACCOUNT_URL = getEnvironmentValue("ACCOUNT_URL");
export const CACHE_SERVER = getEnvironmentValue("CACHE_SERVER");
export const CHS_URL = getEnvironmentValue("CHS_URL");
export const COOKIE_DOMAIN = getEnvironmentValue("COOKIE_DOMAIN");
export const COOKIE_NAME = getEnvironmentValue("COOKIE_NAME");
export const COOKIE_SECRET = getEnvironmentValue("COOKIE_SECRET");
export const COOKIE_SECURE_ONLY = getEnvironmentValue("COOKIE_SECURE_ONLY");
export const DEFAULT_SESSION_EXPIRATION = getEnvironmentValue("DEFAULT_SESSION_EXPIRATION", "3600");
export const ENV_NAME = getEnvironmentValue("ENV_NAME");
export const INTERNAL_API_URL = getEnvironmentValue("INTERNAL_API_URL");
export const MATOMO_ADD_USER_GOAL_ID = getEnvironmentValue("MATOMO_ADD_USER_GOAL_ID");
export const MATOMO_REMOVE_USER_GOAL_ID = getEnvironmentValue("MATOMO_REMOVE_USER_GOAL_ID");

// Error Constants
export const ERRORS_EMAIL_INVALID = "errors_email_invalid";
export const ERRORS_EMAIL_REQUIRED = "errors_email_required";
export const ERRORS_ENTER_AN_EMAIL_ADDRESS_IN_THE_CORRECT_FORMAT = "errors_enter_an_email_address_in_the_correct_format";
export const ERRORS_SELECT_USER_ROLE = "errors_select_user_role";
export const ERRORS_SELECT_USER_ROLE_TO_CHANGE_FOR_THE_USER = "errors_select_user_role_to_change_for_the_user";
export const VALIDATION_ERRORS = "VALIDATION_ERRORS";

// External URLs
export const CHS_SEARCH_REGISTER_PAGE = "https://find-and-update.company-information.service.gov.uk/";
export const UPDATE_AUTHORISED_AGENTS_DETAILS_URL = "/placeholder-url-to-service-build-by-other-team";
export const YOU_HAVE_VERIFIED_SOMEONES_IDENTITY_URL = "/placeholder-url-to-service-build-by-other-team";
export const SIGN_OUT_URL = `${CHS_URL}/signout`;

// Translation and Template Keys
export const COMMON = "common";
export const SERVICE_UNAVAILABLE = "service-unavailable";
export const SERVICE_UNAVAILABLE_TEMPLATE = "partials/service_unavailable";

// User Types and Related UI Elements
export const ACCOUNT_OWNERS_ID = "account-owners";
export const ADMINISTRATORS_ID = "administrators";
export const STANDARD_USERS_ID = "standard-users";
export const ACCOUNT_OWNERS_TAB_ID = `tab_${ACCOUNT_OWNERS_ID}`;
export const ADMINISTRATORS_TAB_ID = `tab_${ADMINISTRATORS_ID}`;
export const STANDARD_USERS_TAB_ID = `tab_${STANDARD_USERS_ID}`;

// Page Names (used for both translation keys and URL construction)
export const ADD_USER_PAGE = "add-user";
export const CANNOT_ADD_USER = "cannot-add-user";
export const CHECK_EDIT_MEMBER_ROLE_DETAILS_PAGE = "check-edit-member-role-details";
export const CHECK_MEMBER_DETAILS_PAGE = "check-member-details";
export const CONFIRMATION_MEMBER_ADDED_PAGE = "confirmation-member-added";
export const CONFIRMATION_MEMBER_ROLE_EDITED_PAGE = "confirmation-member-role-edited";
export const CONFIRMATION_YOU_ARE_REMOVED_PAGE = "confirmation-you-are-removed";
export const DASHBOARD_PAGE = "dashboard";
export const EDIT_MEMBER_ROLE_PAGE = "edit-member-role";
export const MANAGE_USERS_PAGE = "manage-users";
export const REMOVE_MEMBER_PAGE = "remove-member";
export const SOMETHING_WENT_WRONG_PAGE = "something-went-wrong";
export const STOP_PAGE_ADD_ACCOUNT_OWNER_PAGE = "stop-page-add-account-owner";
export const TRY_ADDING_USER = "try-adding-user";
export const TRY_EDIT_MEMBER_ROLE_PAGE = "try-edit-member-role";
export const TRY_REMOVING_USER = "try-removing-user";
export const USER_REMOVE_CONFIRMATION_PAGE = "confirmation-member-removed";
export const VIEW_USERS_PAGE = "view-users";

// Query Parameters
export const ADMIN_PAGE_QUERY_PARAM = "adminPage";
export const CLEAR_FORM_TRUE = "?cf=true";
export const OWNER_PAGE_QUERY_PARAM = "ownerPage";
export const STANDARD_PAGE_QUERY_PARAM = "standardPage";

// Session Data Keys
export const DETAILS_OF_USER_TO_ADD = "detailsOfUserToAdd";
export const DETAILS_OF_USER_TO_REMOVE = "detailsOfUserToRemove";
export const IS_SELECT_USER_ROLE_ERROR = "isSelectUserRoleError";
export const LOGGED_USER_ACSP_MEMBERSHIP = "loggedUserAcspMembership";
export const MANAGE_USERS_MEMBERSHIP = "manageUsersMembership";
export const USER_ROLE_CHANGE_DATA = "userRoleChangeData";

// Miscellaneous Constants
export const ITEMS_PER_PAGE_DEFAULT = 15;
export const UNCAUGHT_EXCEPTION = "uncaughtException";
export const UNHANDLED_REJECTION = "unhandledRejection";
export const NOT_PROVIDED = "Not Provided";
export const NOT_PROVIDED_CY = "[CY] Not Provided";
export const FEATURE_FLAG_SHOW_FILE_AS_AUTHORISED_AGENT = "FEATURE_FLAG_SHOW_FILE_AS_AUTHORISED_AGENT";
export const FEATURE_FLAG_SHOW_UPDATE_AUTHORISED_AGENT_DETAILS = "FEATURE_FLAG_SHOW_UPDATE_AUTHORISED_AGENT_DETAILS";
export const FEATURE_FLAG_SHOW_CLOSE_AUTHORISED_AGENT = "FEATURE_FLAG_SHOW_CLOSE_AUTHORISED_AGENT";

// URL Base Paths and Helpers
export const HEALTHCHECK = "/healthcheck";
export const LANDING_URL = `/authorised-agent`;

// URL Paths (constructed from page names)
export const ADD_USER_URL = `/${ADD_USER_PAGE}`;
export const CANNOT_ADD_USER_URL = `/${CANNOT_ADD_USER}`;
export const CHECK_EDIT_MEMBER_ROLE_DETAILS_URL = `/${CHECK_EDIT_MEMBER_ROLE_DETAILS_PAGE}`;
export const CHECK_MEMBER_DETAILS_URL = `/${CHECK_MEMBER_DETAILS_PAGE}`;
export const CONFIRMATION_MEMBER_ADDED_URL = `/${CONFIRMATION_MEMBER_ADDED_PAGE}`;
export const CONFIRMATION_MEMBER_REMOVED_URL = `/${USER_REMOVE_CONFIRMATION_PAGE}`;
export const CONFIRMATION_MEMBER_ROLE_EDITED_URL = `/${CONFIRMATION_MEMBER_ROLE_EDITED_PAGE}`;
export const CONFIRMATION_YOU_ARE_REMOVED_URL = `/${CONFIRMATION_YOU_ARE_REMOVED_PAGE}`;
export const DASHBOARD_URL = "/";
export const EDIT_MEMBER_ROLE_URL_BASE = `/${EDIT_MEMBER_ROLE_PAGE}`;
export const EDIT_MEMBER_ROLE_URL = `${EDIT_MEMBER_ROLE_URL_BASE}/:id`;
export const MANAGE_USERS_URL = `/${MANAGE_USERS_PAGE}`;
export const REMOVE_MEMBER_CHECK_DETAILS_URL_BASE = `/${REMOVE_MEMBER_PAGE}`;
export const REMOVE_MEMBER_CHECK_DETAILS_URL = `${REMOVE_MEMBER_CHECK_DETAILS_URL_BASE}/:id`;
export const SOMETHING_WENT_WRONG_URL = `/${SOMETHING_WENT_WRONG_PAGE}`;
export const STOP_PAGE_ADD_ACCOUNT_OWNER_URL = `/${STOP_PAGE_ADD_ACCOUNT_OWNER_PAGE}`;
export const TRY_ADDING_USER_URL = `/${TRY_ADDING_USER}`;
export const TRY_EDIT_MEMBER_ROLE_URL = `/${TRY_EDIT_MEMBER_ROLE_PAGE}`;
export const TRY_REMOVING_USER_URL = `/${TRY_REMOVING_USER}`;
export const VIEW_USERS_URL = `/${VIEW_USERS_PAGE}`;

// Full URLs
export const getFullUrl = (url: string): string => `${LANDING_URL}${url}`;
export const ADD_USER_FULL_URL = getFullUrl(ADD_USER_URL);
export const CANNOT_ADD_USER_FULL_URL = getFullUrl(CANNOT_ADD_USER_URL);
export const CHECK_EDIT_MEMBER_ROLE_DETAILS_FULL_URL = getFullUrl(CHECK_EDIT_MEMBER_ROLE_DETAILS_URL);
export const CHECK_MEMBER_DETAILS_FULL_URL = getFullUrl(CHECK_MEMBER_DETAILS_URL);
export const CONFIRMATION_MEMBER_ADDED_FULL_URL = getFullUrl(CONFIRMATION_MEMBER_ADDED_URL);
export const CONFIRMATION_MEMBER_REMOVED_FULL_URL = getFullUrl(CONFIRMATION_MEMBER_REMOVED_URL);
export const CONFIRMATION_MEMBER_ROLE_EDITED_FULL_URL = getFullUrl(CONFIRMATION_MEMBER_ROLE_EDITED_URL);
export const CONFIRMATION_YOU_ARE_REMOVED_FULL_URL = getFullUrl(CONFIRMATION_YOU_ARE_REMOVED_URL);
export const DASHBOARD_FULL_URL = getFullUrl(DASHBOARD_URL);
export const EDIT_MEMBER_ROLE_FULL_URL = getFullUrl(EDIT_MEMBER_ROLE_URL_BASE);
export const HEALTHCHECK_FULL_URL = getFullUrl(HEALTHCHECK);
export const MANAGE_USERS_FULL_URL = getFullUrl(MANAGE_USERS_URL);
export const REMOVE_MEMBER_CHECK_DETAILS_FULL_URL = getFullUrl(REMOVE_MEMBER_CHECK_DETAILS_URL_BASE);
export const SOMETHING_WENT_WRONG_FULL_URL = getFullUrl(SOMETHING_WENT_WRONG_URL);
export const STOP_PAGE_ADD_ACCOUNT_OWNER_FULL_URL = getFullUrl(STOP_PAGE_ADD_ACCOUNT_OWNER_URL);
export const TRY_ADDING_USER_FULL_URL = getFullUrl(TRY_ADDING_USER_URL);
export const TRY_EDIT_MEMBER_ROLE_FULL_URL = getFullUrl(TRY_EDIT_MEMBER_ROLE_URL);
export const TRY_REMOVING_USER_FULL_URL = getFullUrl(TRY_REMOVING_USER_URL);
export const VIEW_USERS_FULL_URL = getFullUrl(VIEW_USERS_URL);
