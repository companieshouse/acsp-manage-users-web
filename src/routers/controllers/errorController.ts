import logger from "../../lib/Logger";
import type { ErrorRequestHandler } from "express";
import { HttpError } from "http-errors";
import { getTranslationsForView } from "../../lib/utils/translationUtils";
import * as constants from "../../lib/constants";
import { CsrfError, InvalidAcspNumberError } from "@companieshouse/web-security-node";

/*  This controller catches and logs HTTP errors from the http-errors module.
    It returns an error template back to the user.

    We can update the logic and the content of the template returned based on, for example:
    -  http error status codes:
            if (err.statusCode === 401) ...
    -  content of the message
            if (err.message?.includes(...
    -  type of HttpError thrown
            if (err instanceof Unauthorized)...
    - Any custom properties on the error
            if (!err.expose)...
*/
export const httpErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof HttpError) {
        logger.errorRequest(
            req,
            `A ${err.statusCode} ${err.name} error occurred when a ${req.method} request was made to ${req.originalUrl}. Re-routing to the error template page. Error name: ${err.name}, Error status: ${err.status}, Error message:  + ${err.message}, Stack: " + ${err.stack}`
        );
        const statusCode: number = err.statusCode || 500;

        res.status(statusCode).redirect(constants.SOMETHING_WENT_WRONG_FULL_URL);
    } else {
        next(err);
    }
};

/*
    If an user does not have a valid ACSP in their session after login
    an invalidAcspNumber error can occur from web secuirty node.
*/
export const invalidAcspNumberErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof InvalidAcspNumberError) {
        logger.error(
            `Access denied - the user does not have a valid ACSP number in session. Message: ${err.message}, Stack: ${err.stack}`
        );
        const lang = req.query?.lang;
        const queryString = lang ? `?lang=${lang as string}` : "";
        res.status(403).redirect(`${constants.ACCESS_DENIED_FULL_URL}${queryString}`);
    } else {
        next(err);
    }
};

export const csrfErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof CsrfError) {
        logger.error(
            `CSRF Error occured, redirecting to ${constants.SOMETHING_WENT_WRONG_FULL_URL} ${err.message}, Stack: ${err.stack}`
        );
        res.status(403).redirect(`${constants.SOMETHING_WENT_WRONG_FULL_URL}?${constants.CSRF_ERRORS}`);
    } else {
        next(err);
    }
};

export default [httpErrorHandler, invalidAcspNumberErrorHandler, csrfErrorHandler];
