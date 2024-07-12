import { Request, Response, RequestHandler } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { toReadableFormat } from "../../lib/utils/date";

export const dashboardControllerGet: RequestHandler = async (req: Request, res: Response) => {
    res.render(constants.DASHBOARD_PAGE,
        {
            lang: getTranslationsForView(req.t, constants.DASHBOARD_PAGE),
            date1: toReadableFormat(new Date().toISOString(), req.language),
            date2: toReadableFormat(new Date().toISOString(), req.language),
            agentNumber: "06254821",
            companyName: "MORRIS ACCOUNTING LTD",
            managePeopleLink: constants.MANAGE_USER_FULL_URL
        });
};
