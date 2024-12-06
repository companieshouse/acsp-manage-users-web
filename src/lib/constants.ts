import { getEnvironmentValue } from "./utils/environmentValue";

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
export const COOKIE_SECURE_ONLY = getEnvironmentValue("COOKIE_SECURE_ONLY");
export const MATOMO_ADD_USER_GOAL_ID = getEnvironmentValue("MATOMO_ADD_USER_GOAL_ID");
export const MATOMO_REMOVE_USER_GOAL_ID = getEnvironmentValue("MATOMO_REMOVE_USER_GOAL_ID");
export const FEATURE_FLAG_IDENTITY_VERIFICATION_REPORTING = getEnvironmentValue("FEATURE_FLAG_IDENTITY_VERIFICATION_REPORTING", "false");
export const FEATURE_FLAG_AUTHORISED_AGENTS_DETAILS_UPDATING = getEnvironmentValue("FEATURE_FLAG_AUTHORISED_AGENTS_DETAILS_UPDATING", "false");

export const SERVICE_NAME = "ACSP Manage Users Web";

// English and Welsh translation files AND Nunjucks template files for pages
export const DASHBOARD_PAGE = "dashboard";
export const MANAGE_USERS_PAGE = "manage-users";
export const TRY_ADDING_USER = "try-adding-user";
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
export const STOP_PAGE_ADD_ACCOUNT_OWNER = "stop-page-add-account-owner";
export const CANNOT_ADD_USER = "cannot-add-user";
export const SOMETHING_WENT_WRONG = "something-went-wrong";
export const EDIT_MEMBER_ROLE_PAGE = "edit-member-role";
export const CHECK_EDIT_MEMBER_ROLE_DETAILS_PAGE = "check-edit-member-role-details";
export const CONFIRMATION_MEMBER_ROLE_EDITED_PAGE = "confirmation-member-role-edited";

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
export const MANAGE_USERS_FULL_URL = `${LANDING_URL}${MANAGE_USERS_URL}`;
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
export const STOP_PAGE_ADD_ACCOUNT_OWNER_URL = `/${STOP_PAGE_ADD_ACCOUNT_OWNER}`;
export const STOP_PAGE_ADD_ACCOUNT_OWNER_FULL_URL = `${LANDING_URL}${STOP_PAGE_ADD_ACCOUNT_OWNER_URL}`;
export const CANNOT_ADD_USER_URL = `/${CANNOT_ADD_USER}`;
export const CANNOT_ADD_USER_FULL_URL = `${LANDING_URL}${CANNOT_ADD_USER_URL}`;
export const SOMETHING_WENT_WRONG_URL = `/${SOMETHING_WENT_WRONG}`;
export const SOMETHING_WENT_WRONG_FULL_URL = `${LANDING_URL}${SOMETHING_WENT_WRONG_URL}`;
export const SIGN_OUT_URL = `${CHS_URL}/signout`;
export const EDIT_MEMBER_ROLE_URL = `/${EDIT_MEMBER_ROLE_PAGE}/:id`;
export const EDIT_MEMBER_ROLE_FULL_URL = `${LANDING_URL}${EDIT_MEMBER_ROLE_URL}`;
export const CHECK_EDIT_MEMBER_ROLE_DETAILS_URL = `/${CHECK_EDIT_MEMBER_ROLE_DETAILS_PAGE}`;
export const CHECK_EDIT_MEMBER_ROLE_DETAILS_FULL_URL = `${LANDING_URL}${CHECK_EDIT_MEMBER_ROLE_DETAILS_URL}`;
export const TRY_EDIT_MEMBER_ROLE_URL = "/try-edit-member-role";
export const TRY_EDIT_MEMBER_ROLE_FULL_URL = `${LANDING_URL}${TRY_EDIT_MEMBER_ROLE_URL}`;
export const CONFIRMATION_MEMBER_ROLE_EDITED_URL = `/${CONFIRMATION_MEMBER_ROLE_EDITED_PAGE}`;
export const CONFIRMATION_MEMBER_ROLE_EDITED_FULL_URL = `${LANDING_URL}${CONFIRMATION_MEMBER_ROLE_EDITED_URL}`;
export const CHANGE_MEMBER_ROLE_BASE = `${LANDING_URL}/${EDIT_MEMBER_ROLE_PAGE}`;
export const REMOVE_MEMBER_BASE = `${LANDING_URL}/${REMOVE_MEMBER_PAGE}`;

export const HEALTHCHECK = "/healthcheck";

// External URLs
export const YOU_HAVE_VERIFIED_SOMEONES_IDENTITY_URL = "/tell-companies-house-you-have-verified-someones-identity";
export const UPDATE_AUTHORISED_AGENTS_DETAILS_URL = "/view-and-update-the-authorised-agents-details";
export const CHS_SEARCH_REGISTER_PAGE = "https://find-and-update.company-information.service.gov.uk/";

// errors
export const VALIDATION_ERRORS = "VALIDATION_ERRORS";
export const MEMBER_ALREADY_ADDED_ERROR = "Member already added";
export const ERRORS_EMAIL_REQUIRED = "errors_email_required";
export const ERRORS_EMAIL_INVALID = "errors_email_invalid";
export const ERRORS_SELECT_USER_ROLE = "errors_select_user_role";
export const MEMBER_ALREADY_REMOVED_ERROR = "Member already removed";
export const ERRORS_ENTER_AN_EMAIL_ADDRESS_IN_THE_CORRECT_FORMAT = "errors_enter_an_email_address_in_the_correct_format";
export const ERRORS_SELECT_USER_ROLE_TO_CHANGE_FOR_THE_USER = "errors_select_user_role_to_change_for_the_user";

// query params
export const OWNER_PAGE_QUERY_PARAM = "ownerPage";
export const ADMIN_PAGE_QUERY_PARAM = "adminPage";
export const STANDARD_PAGE_QUERY_PARAM = "standardPage";

// session.extra_data
export const DETAILS_OF_USER_TO_ADD = "detailsOfUserToAdd";
export const DETAILS_OF_USER_TO_REMOVE = "detailsOfUserToRemove";
export const MANAGE_USERS_MEMBERSHIP = "manageUsersMembership";
export const LOGGED_USER_ACSP_MEMBERSHIP = "loggedUserAcspMembership";
export const ACSP_MEMBERSHIP_REMOVED = "AcspMembershipRemoved";
export const USER_ROLE_CHANGE_DATA = "userRoleChangeData";
export const IS_SELECT_USER_ROLE_ERROR = "isSelectUserRoleError";

// Various
export const ACCOUNT_OWNERS_ID = "account-owners";
export const ADMINISTRATORS_ID = "administrators";
export const STANDARD_USERS_ID = "standard-users";
export const ACCOUNT_OWNERS_TAB_ID = `tab_${ACCOUNT_OWNERS_ID}`;
export const ADMINISTRATORS_TAB_ID = `tab_${ADMINISTRATORS_ID}`;
export const STANDARD_USERS_TAB_ID = `tab_${STANDARD_USERS_ID}`;
export const NOT_PROVIDED = "Not Provided";
export const NOT_PROVIDED_CY = "[CY] Not Provided";
export const ITEMS_PER_PAGE_DEFAULT = 15;
export const UNCAUGHT_EXCEPTION = "uncaughtException";
export const UNHANDLED_REJECTION = "unhandledRejection";
