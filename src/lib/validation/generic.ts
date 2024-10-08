// Only include methods that validate common entities and fields i.e. fields that are common to multiple forms across the service
// These methods are then called by individual form validators that extend this class
// Examples of fields common to multiple forms (to include in this class) are: email, username, phone number, postcode, gender, etc...

import errorManifest from "../utils/error_manifests/errorManifest";
import { ErrorSignature } from "../../types/errorSignature";
import * as constants from "../constants";

export class GenericValidator {

    errors: unknown;
    payload: unknown;
    errorManifest: unknown;

    constructor () {
        this.errors = this.getErrorSignature();
        this.errorManifest = errorManifest;
    }

    protected getErrorSignature (): ErrorSignature {
        return {
            status: 400,
            name: constants.VALIDATION_ERRORS,
            message: errorManifest.validation.default.summary,
            stack: {}
        };
    }
}
