import express, { Request, Response, NextFunction } from "express";
import nunjucks from "nunjucks";
import path from "path";
import logger from "./lib/Logger";
import routerDispatch from "./router.dispatch";
import { enableI18next } from "./middleware/i18next.language";
import cookieParser from "cookie-parser";
import * as constants from "./lib/constants";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { sessionMiddleware } from "./middleware/session.middleware";
import { getTranslationsForView } from "./lib/utils/translationUtils";

const app = express();

app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "/../node_modules/govuk-frontend/dist"),
    path.join(__dirname, "node_modules/govuk-frontend/dist")
]);

const nunjucksLoaderOpts = {
    watch: process.env.NUNJUCKS_LOADER_WATCH !== "false",
    noCache: process.env.NUNJUCKS_LOADER_NO_CACHE !== "true"
};

const njk = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(app.get("views"),
        nunjucksLoaderOpts)
);

njk.express(app);
app.set("view engine", "njk");

// Serve static files
app.use(express.static(path.join(__dirname, "/../assets/public")));

njk.addGlobal("cdnUrlCss", process.env.CDN_URL_CSS);
njk.addGlobal("cdnUrlJs", process.env.CDN_URL_JS);
njk.addGlobal("cdnHost", process.env.CDN_HOST);
njk.addGlobal("chsUrl", process.env.CHS_URL);

// If app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client
app.enable("trust proxy");

// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(`${constants.LANDING_URL}*`, sessionMiddleware);
app.use(`${constants.LANDING_URL}*`, authenticationMiddleware);

// Add i18next middleware
enableI18next(app);

app.use((req: Request, res: Response, next: NextFunction) => {
    njk.addGlobal("feedbackSource", req.originalUrl);
    next();
});

// Channel all requests through router dispatch
routerDispatch(app);

// Unhandled errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
    const translations = getTranslationsForView(req.t, constants.SERVICE_UNAVAILABLE);
    res.render(constants.SERVICE_UNAVAILABLE_TEMPLATE, { lang: translations });
});

// Unhandled exceptions
process.on("uncaughtException", (err: Error) => {
    logger.error(`${err.name} - uncaughtException: ${err.message} - ${err.stack}`);
    process.exit(1);
});

// Unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
    logger.error(`${err.name} - unhandledRejection: ${err.message} - ${err.stack}`);
    process.exit(1);
});

export default app;
