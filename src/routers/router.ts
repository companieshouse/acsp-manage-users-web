import { RequestHandler, Router } from "express";
import * as constants from "../lib/constants";
import { manageUsersControllerGet } from "./controllers/manageUsersController";
import { dashboardControllerGet } from "./controllers/dashboardController";
import { healthCheckController } from "./controllers/healthCheckController";
import { confirmationMemberAddedControllerGet } from "./controllers/confirmationMemberAddedController";

const router: Router = Router();

router.get(constants.MANAGE_USERS_URL, manageUsersControllerGet as RequestHandler);

router.get(constants.CONFIRMATION_MEMBER_ADDED_URL, confirmationMemberAddedControllerGet as RequestHandler);

router.get(constants.DASHBOARD_URL, dashboardControllerGet);

router.get(constants.HEALTHCHECK, healthCheckController);

export default router;
