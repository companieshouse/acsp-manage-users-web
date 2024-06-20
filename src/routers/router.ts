import { RequestHandler, Router } from "express";
import * as constants from "../lib/constants";
import { manageUsersControllerGet } from "./controllers/manageUsersController";

const router: Router = Router();

router.get(constants.MANAGE_USERS_URL, manageUsersControllerGet as RequestHandler);

export default router;
