import { RequestHandler, Router } from "express";
import * as constants from "../lib/constants";
import { manageUsersControllerGet } from "./controllers/manageUsersController";
import { dashboardControllerGet } from "./controllers/dashboardController";
import { healthCheckController } from "./controllers/healthCheckController";
import { addUserControllerGet, addUserControllerPost } from "./controllers/addUserController";
import { checkMemberDetailsControllerGet } from "./controllers/checkMemberDetailsController";
import { tryAddingUserControllerGet } from "./controllers/tryAddingUserController";
import { confirmationMemberAddedControllerGet } from "./controllers/confirmationMemberAddedController";
import { removeUserCheckDetailsControllerGet } from "./controllers/removeUserCheckDetailsController";
import { tryRemovingUserControllerGet } from "./controllers/tryRemovingUserController";
import { removeUserSuccessControllerGet } from "./controllers/removeUserSuccessController";

const router: Router = Router();

router.get(constants.MANAGE_USERS_URL, manageUsersControllerGet as RequestHandler);

router.get(constants.CONFIRMATION_MEMBER_ADDED_URL, confirmationMemberAddedControllerGet as RequestHandler);
router.get(constants.REMOVE_MEMBER_CHECK_DETAILS_URL, removeUserCheckDetailsControllerGet as RequestHandler);
router.get(constants.CONFIRMATION_MEMBER_REMOVED_URL, removeUserSuccessControllerGet as RequestHandler);

router.get(constants.DASHBOARD_URL, dashboardControllerGet);

router.get(constants.ADD_USER_URL, addUserControllerGet);
router.post(constants.ADD_USER_URL, addUserControllerPost);

router.get(constants.CHECK_MEMBER_DETAILS_URL, checkMemberDetailsControllerGet);

router.get(constants.TRY_ADDING_USER_URL, tryAddingUserControllerGet);
router.get(constants.TRY_REMOVING_USER_URL, tryRemovingUserControllerGet);

router.get(constants.HEALTHCHECK, healthCheckController);

export default router;
