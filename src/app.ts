import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import nunjucks from "nunjucks";
import path from "path";
import logger from "./lib/Logger";
import routerDispatch from "./routerDispatch";
import cookieParser from "cookie-parser";
import * as constants from "./lib/constants";
import { authenticationMiddleware } from "./middleware/authentication.middleware";
import { ensureSessionCookiePresentMiddleware, sessionMiddleware } from "./middleware/session.middleware";
import { getTranslationsForView, translateEnum } from "./lib/utils/translationUtils";
import errorHandler from "./routers/controllers/errorController";
import { AcspStatus, UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { loggedUserAcspMembershipMiddleware } from "./middleware/loggedUserAcspMembership.middleware";
import * as url from "node:url";
import { Lang, LANGUAGE_CONFIG } from "./types/language";
import { convertUserRole } from "./lib/utils/userRoleUtils";
import { getLoggedInUserEmail } from "./lib/utils/sessionUtils";
import { navigationMiddleware } from "./middleware/navigationMiddleware";
import { LocalesMiddleware, LocalesService } from "@companieshouse/ch-node-utils";
import helmet from "helmet";
import { v4 as uuidv4 } from "uuid";
import { prepareCSPConfig } from "./middleware/content.security.policy.middleware.config";
import nocache from "nocache";
import { acspAuthMiddleware } from "./middleware/acsp.authentication.middleware";
import { csrfProtectionMiddleware } from "./middleware/csrf.protection.middleware";
import { isFeatureEnabled } from "./lib/utils/environmentValue";

const app = express();

app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "/../node_modules/govuk-frontend/dist"),
    path.join(__dirname, "node_modules/govuk-frontend/dist"),
    path.join(__dirname, "/../node_modules/@companieshouse/ch-node-utils/templates"),
    path.join(__dirname, "node_modules/@companieshouse/ch-node-utils/templates"),
    path.join(__dirname, "/../node_modules/@companieshouse"),
    path.join(__dirname, "node_modules/@companieshouse")
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
njk.addGlobal("accountUrl", process.env.ACCOUNT_URL);
njk.addGlobal("UserRole", UserRole);
njk.addGlobal("AcspStatus", AcspStatus);
njk.addGlobal("Lang", Lang);
njk.addGlobal("PIWIK_URL", process.env.PIWIK_URL);
njk.addGlobal("PIWIK_SITE_ID", process.env.PIWIK_SITE_ID);
njk.addGlobal("SERVICE_NAME", constants.SERVICE_NAME);
njk.addGlobal("showFileAsAuthorisedAgent", isFeatureEnabled(constants.FEATURE_FLAG_SHOW_FILE_AS_AUTHORISED_AGENT));
njk.addGlobal("showUpdateAuthorisedAgentDetails", isFeatureEnabled(constants.FEATURE_FLAG_SHOW_UPDATE_AUTHORISED_AGENT_DETAILS));
njk.addGlobal("showCloseAuthorisedAgent", isFeatureEnabled(constants.FEATURE_FLAG_SHOW_CLOSE_AUTHORISED_AGENT));
njk.addGlobal("showTellUsYouveVerifiedAPersonsIdentity", isFeatureEnabled(constants.FEATURE_FLAG_SHOW_TELL_US_YOUVE_VERIFIED_A_PERSONS_IDENTITY));

// If app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client
app.enable("trust proxy");

// parse body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

const nonce: string = uuidv4();

app.use(nocache());
app.use(helmet(prepareCSPConfig(nonce)));

app.use(`${constants.LANDING_URL}*`, sessionMiddleware);
app.use(`${constants.LANDING_URL}*`, ensureSessionCookiePresentMiddleware);

app.use(`${constants.LANDING_URL}*`, csrfProtectionMiddleware);

app.use(`${constants.LANDING_URL}*`, authenticationMiddleware);
app.use(`${constants.LANDING_URL}*`, acspAuthMiddleware);

LocalesService.getInstance("locales", true);
app.use(LocalesMiddleware());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.userEmailAddress = getLoggedInUserEmail(req.session);
    res.locals.locale = req.lang || LANGUAGE_CONFIG.defaultLanguage;
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
    res.locals.nonce = nonce;
    next();
});

app.use(`${constants.LANDING_URL}*`, loggedUserAcspMembershipMiddleware);
app.use(navigationMiddleware);

// Channel all requests through router dispatch
routerDispatch(app);

// error handler
app.use(...errorHandler);

// Unhandled errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`${err.name} - appError: ${err.message} - ${err.stack}`);
    const translations = getTranslationsForView(req.lang || Lang.EN, constants.SOMETHING_WENT_WRONG_PAGE);
    res.status(500).render(constants.SOMETHING_WENT_WRONG_PAGE, { lang: translations });
});

// Unhandled exceptions
process.on(constants.UNCAUGHT_EXCEPTION, (err: Error) => {
    logger.error(`${err.name} - ${constants.UNCAUGHT_EXCEPTION}: ${err.message} - ${err.stack}`);
    process.exit(1);
});

// Unhandled promise rejections
process.on(constants.UNHANDLED_REJECTION, (err: Error) => {
    logger.error(`${err.name} - ${constants.UNHANDLED_REJECTION}: ${err.message} - ${err.stack}`);
    process.exit(1);
});

export default app;
