import { Request, Response } from "express";
import * as constants from "../../lib/constants";

export const manageUsersControllerGet = async (req: Request, res: Response): Promise<void> => {
    res.render(constants.MANAGE_USERS_PAGE, {});
};
