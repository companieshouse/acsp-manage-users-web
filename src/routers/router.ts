import { RequestHandler, Router } from "express";
import * as constants from "../lib/constants";
import { manageUsersControllerGet } from "./controllers/manageUsersController";
import { dashboardGet } from "./controllers/dashboardController";

const router: Router = Router();

router.get(constants.MANAGE_USERS_URL, manageUsersControllerGet as RequestHandler);
router.get(constants.DASHBOARD_URL, dashboardGet);

export default router;
