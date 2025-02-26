// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response } from "express";
import router from "./routers/router";
import * as constants from "./lib/constants";
import { getTranslationsForView } from "./lib/utils/translationUtils";

const routerDispatch = (app: Application): void => {
    app.use(constants.LANDING_URL, router);
    app.use("*", (req: Request, res: Response) => {
        const translations = getTranslationsForView(req.lang, constants.SOMETHING_WENT_WRONG_PAGE);
        res.status(404).render(constants.SOMETHING_WENT_WRONG_PAGE, { lang: translations });
    });
};

export default routerDispatch;
