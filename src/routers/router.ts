import { RequestHandler, Router } from "express";
import * as constants from "../lib/constants";
import { manageUsersControllerGet, manageUsersControllerPost } from "./controllers/manageUsersController";
import { dashboardControllerGet } from "./controllers/dashboardController";
import { healthCheckController } from "./controllers/healthCheckController";
import { addUserControllerGet, addUserControllerPost } from "./controllers/addUserController";
import { checkMemberDetailsControllerGet } from "./controllers/checkMemberDetailsController";
import { tryAddingUserControllerPost } from "./controllers/tryAddingUserController";
import { confirmationMemberAddedControllerGet } from "./controllers/confirmationMemberAddedController";
import { removeUserCheckDetailsControllerGet } from "./controllers/removeUserCheckDetailsController";
import { tryRemovingUserControllerPost } from "./controllers/tryRemovingUserController";
import { removeUserSuccessControllerGet } from "./controllers/removeUserSuccessController";
import { removeYourselfControllerGet } from "./controllers/confirmationYouAreRemovedController";
import { stopPageAddOwnerControllerGet } from "./controllers/stopPageAddOwnerControllerGet";
import { cannotAddUserController } from "./controllers/cannotAddUserController";
import { stopPageController } from "./controllers/stopPageController";

const router: Router = Router();

router.get(constants.MANAGE_USERS_URL, manageUsersControllerGet as RequestHandler);
router.post(constants.MANAGE_USERS_URL, manageUsersControllerPost as RequestHandler);

router.get(constants.VIEW_USERS_URL, manageUsersControllerGet as RequestHandler);
router.post(constants.VIEW_USERS_URL, manageUsersControllerPost as RequestHandler);

router.get(constants.CONFIRMATION_MEMBER_ADDED_URL, confirmationMemberAddedControllerGet as RequestHandler);
router.get(constants.REMOVE_MEMBER_CHECK_DETAILS_URL, removeUserCheckDetailsControllerGet as RequestHandler);

router.get(constants.CONFIRMATION_MEMBER_REMOVED_URL, removeUserSuccessControllerGet as RequestHandler);
router.get(constants.CONFIRMATION_YOU_ARE_REMOVED_URL, removeYourselfControllerGet as RequestHandler);

router.get(constants.DASHBOARD_URL, dashboardControllerGet);

router.get(constants.ADD_USER_URL, addUserControllerGet);
router.post(constants.ADD_USER_URL, addUserControllerPost);

router.get(constants.CHECK_MEMBER_DETAILS_URL, checkMemberDetailsControllerGet);
router.post(constants.TRY_ADDING_USER_URL, tryAddingUserControllerPost);

router.get(constants.CANNOT_ADD_USER_URL, cannotAddUserController);

router.post(constants.TRY_REMOVING_USER_URL, tryRemovingUserControllerPost);
router.get(constants.STOP_PAGE_ADD_ACCOUNT_OWNER_URL, stopPageAddOwnerControllerGet);

router.get(constants.HEALTHCHECK, healthCheckController);

router.get(constants.SOMETHING_WENT_WRONG_URL, stopPageController);

export default router;
