import { Application, Request } from "express";
import i18next, { InitOptions, Resource } from "i18next";
import Middleware from "i18next-http-middleware";
import path from "path";
import fs from "fs";
import { setExtraData, getExtraData } from "../lib/utils/sessionUtils";
import { AnyRecord } from "../types/utilTypes";
const locales = path.join(__dirname, "/../locales");
const chNodeUtilsLocales = path.join(__dirname, "/../../node_modules/@companieshouse/ch-node-utils/locales");

const LANG = "lang";
const supportedLanguages: string[] = ["en", "cy"];

const loadJsonFiles = (dir: string): AnyRecord => {
    return fs.readdirSync(dir)
        .filter(file => file.endsWith(".json"))
        .reduce((acc: AnyRecord, file) => {
            const fileName = path.parse(file).name;
            acc[fileName] = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
            return acc;
        }, {});
};

export const enableI18next = (app: Application): void => {
    /*
     * Construct the resources object by merging translations from different sources:
     * 1. Local translations specific to this application
     * 2. Navbar translations from the @companieshouse/ch-node-utils package
     *
     * We merge these into the 'common' namespace to ensure that navbar translations
     * are available on all templates, alongside our local common translations.
     *
     * This approach allows us to:
     * - Reuse shared components (like the navbar)
     * - Maintain the ability to override or extend translations as needed
     */
    const resources = ["en", "cy"].reduce((acc: AnyRecord, lang) => {
        const chNodeUtilsTranslations: AnyRecord = loadJsonFiles(path.join(chNodeUtilsLocales, lang));
        const localTranslations: AnyRecord = loadJsonFiles(path.join(locales, lang, "translation"));

        acc[lang] = {
            translation: {
                ...localTranslations,
                common: {
                    ...chNodeUtilsTranslations.navbar as AnyRecord,
                    ...localTranslations.common as AnyRecord
                }
            }
        };

        return acc;
    }, {}) as Resource;

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
