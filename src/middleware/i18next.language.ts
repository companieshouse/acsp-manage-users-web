import { Application, Request } from "express";
import i18next, { InitOptions, Resource } from "i18next";
import Middleware from "i18next-http-middleware";
import requireDir from "require-directory";
import path from "path";
import { setExtraData, getExtraData } from "../lib/utils/sessionUtils";
const locales = path.join(__dirname, "/../locales");

const LANG = "lang";
const supportedLanguages: string[] = ["en", "cy"];

export const enableI18next = (app: Application): void => {
    const resources = requireDir(module, locales) as Resource;

    const options: InitOptions = {
        preload: supportedLanguages,
        resources,
        fallbackLng: "en",
        supportedLngs: supportedLanguages,
        detection: {
            order: ["querystring", "detectLangInSession"],
            caches: ["detectLangInSession"],
            lookupQuerystring: LANG
        }
    };

    const customDetector = {
        name: "detectLangInSession",

        lookup: function (req: Request) {
            const langInSession: string | undefined = getExtraData(req.session, LANG);
            if (langInSession && supportedLanguages.includes(langInSession)) {
                return langInSession;
            }
        },

        cacheUserLanguage: function (req: Request) {
            setExtraData(req.session, LANG, req.language);
        }
    };

    const lngDetector = new Middleware.LanguageDetector();
    lngDetector.addDetector(customDetector);

    i18next.use(lngDetector).init(options);

    app.use(Middleware.handle(i18next));
};
