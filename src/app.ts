import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import nunjucks from "nunjucks";
import path from "path";
import logger from "./lib/Logger";
import routerDispatch from "./router.dispatch";
import cookieParser from "cookie-parser";
import * as constants from "./lib/constants";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { sessionMiddleware } from "./middleware/session.middleware";
import { getTranslationsForView, translateEnum } from "./lib/utils/translationUtils";
import { httpErrorHandler } from "./routers/controllers/httpErrorController";
import { UserRole, AcspStatus } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { loggedUserAcspMembershipMiddleware } from "./middleware/loggedUserAcspMembership.middleware";
import * as url from "node:url";
import { LANGUAGE_CONFIG } from "./types/language";
import { convertUserRole } from "./lib/utils/userRoleUtils";
import { getLoggedInUserEmail, getLoggedUserAcspMembership } from "./lib/utils/sessionUtils";
import { navigationMiddleware } from "./middleware/navigationMiddleware";
import { LocalesMiddleware, LocalesService } from "@companieshouse/ch-node-utils";
import { acspAuthMiddleware } from "./middleware/acsp.authentication.middleware";

const app = express();

app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "/../node_modules/govuk-frontend/dist"),
    path.join(__dirname, "node_modules/govuk-frontend/dist"),
    path.join(__dirname, "/../node_modules/@companieshouse/ch-node-utils/templates"),
    path.join(__dirname, "node_modules/@companieshouse/ch-node-utils/templates")
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
njk.addGlobal("cdnHost", process.env.ANY_PROTOCOL_CDN_HOST);
njk.addGlobal("chsUrl", process.env.CHS_URL);
njk.addGlobal("chsMonitorGuiUrl", process.env.CHS_MONITOR_GUI_URL);
njk.addGlobal("UserRole", UserRole);
njk.addGlobal("AcspStatus", AcspStatus);
njk.addGlobal("PIWIK_URL", process.env.PIWIK_URL);
njk.addGlobal("PIWIK_SITE_ID", process.env.PIWIK_SITE_ID);
njk.addGlobal("SERVICE_NAME", constants.SERVICE_NAME);

// If app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client
app.enable("trust proxy");

// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(`${constants.LANDING_URL}*`, sessionMiddleware);
app.use(`${constants.LANDING_URL}*`, authenticationMiddleware);
// app.use(`${constants.LANDING_URL}*`, acspAuthMiddleware);

LocalesService.getInstance("locales", true);
app.use(LocalesMiddleware());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.userEmailAddress = getLoggedInUserEmail(req.session);
    res.locals.locale = (req as any).lang as string || LANGUAGE_CONFIG.defaultLanguage;
    res.locals.languageConfig = LANGUAGE_CONFIG;
    res.locals.feedbackSource = req.originalUrl;
    res.locals.addLangToUrl = (lang: string): string => {
        const parsedUrl = url.parse(req.originalUrl, true);
        parsedUrl.query.lang = lang;
        return url.format({
            pathname: parsedUrl.pathname,
            query: parsedUrl.query
        });
    };
    res.locals.convertUserRole = convertUserRole;
    res.locals.translateEnum = translateEnum(res.locals.locale);
    if (getLoggedUserAcspMembership(req.session)) {
        res.locals.displayAuthorisedAgent = "yes";
    }
    next();
});

app.use(`${constants.LANDING_URL}*`, loggedUserAcspMembershipMiddleware);
app.use(navigationMiddleware);

// Channel all requests through router dispatch
routerDispatch(app);

// http-error error handler
app.use(httpErrorHandler);

// Unhandled errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
    const translations = getTranslationsForView((req as any).lang, constants.SERVICE_UNAVAILABLE);
    res.status(500).render(constants.SERVICE_UNAVAILABLE_TEMPLATE, { lang: translations });
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
