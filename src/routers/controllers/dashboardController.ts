import { Request, Response, RequestHandler } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";

export const dashboardControllerGet:RequestHandler = async (req: Request, res: Response) => {
    res.render(constants.DASHBOARD_PAGE,
        {
            lang: getTranslationsForView(req.t, constants.DASHBOARD_PAGE),
            agentStatus: "active",
            agentNumber: "06254821",
            companyName: "MORRIS ACCOUNTING LTD",
            managePeopleLink: constants.MANAGE_USER_FULL_URL
        });
};
