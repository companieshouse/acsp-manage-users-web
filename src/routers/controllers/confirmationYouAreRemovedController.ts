import { Request, Response } from "express";
import * as constants from "../../lib/constants";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import { ISignInInfo } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";
import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import logger from "../../lib/Logger";

export const removeYourselfControllerGet = async (req: Request, res: Response): Promise<void> => {

    const signInInfo: ISignInInfo = req?.session?.get<ISignInInfo>(SessionKey.SignInInfo) || {};
    const signedIn: boolean = signInInfo?.[SignInInfoKeys.SignedIn] === 1;
    logger.info("removeYourselfControllerGet: checking if signed in");

    if (signedIn) {
        logger.info("redirecting to sign out");
        res.set("Referrer-Policy", "strict-origin-when-cross-origin");
        return res.redirect(constants.SIGN_OUT_URL);
    }
    logger.info("removeYourselfControllerGet: user is signed out, displaying confirmation");

    const viewData = {
        lang: getTranslationsForView(req.lang, constants.CONFIRMATION_YOU_ARE_REMOVED),
        buttonHref: constants.CHS_SEARCH_REGISTER_PAGE,
        templateName: constants.CONFIRMATION_YOU_ARE_REMOVED
    };
    res.render(constants.CONFIRMATION_YOU_ARE_REMOVED, viewData);
};
