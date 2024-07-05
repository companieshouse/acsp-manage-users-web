import { RequestHandler, Router } from "express";
import * as constants from "../lib/constants";
import { manageUsersControllerGet } from "./controllers/manageUsersController";
import { dashboardControllerGet } from "./controllers/dashboardController";
import { healthCheckController } from "./controllers/healthCheckController";
import { addUserControllerGet } from "./controllers/addUserController";

const router: Router = Router();

router.get(constants.MANAGE_USERS_URL, manageUsersControllerGet as RequestHandler);

router.get(constants.DASHBOARD_URL, dashboardControllerGet);

router.get(constants.ADD_USER_URL, addUserControllerGet);

router.get(constants.HEALTHCHECK, healthCheckController);

export default router;
