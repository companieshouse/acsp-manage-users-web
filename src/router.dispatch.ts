// Do Router dispatch here, i.e. map incoming routes to appropriate router
import { Application, Request, Response } from "express";
import router from "./routers/router";
import * as constants from "./lib/constants";

const routerDispatch = (app: Application) => {
    app.use(constants.LANDING_URL, router);
    app.use("*", (req: Request, res: Response) => {
        res.status(404).render("partials/error");
    });
};

export default routerDispatch;
