import * as constants from "../../lib/constants";

const WHITELISTED_URLS: string[] = [
    constants.LANDING_URL + constants.HEALTHCHECK
];

export const isWhitelistedUrl = (url: string): boolean => WHITELISTED_URLS.includes(url);
