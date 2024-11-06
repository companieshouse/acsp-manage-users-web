import { HelmetOptions } from "helmet";
import { CHS_URL } from "../lib/constants";

export const prepareCSPConfig = (nonce: string) : HelmetOptions => {
    const CDN = process.env.CDN_HOST as string;
    const PIWIK_URL = process.env.PIWIK_URL as string;
    const SELF = `'self'`;
    const NONCE = `'nonce-${nonce}'`;
    const ONE_YEAR_SECONDS = 31536000;

    return {
        contentSecurityPolicy: {
            directives: {
                upgradeInsecureRequests: null,
                defaultSrc: [SELF],
                fontSrc: [CDN],
                formAction: [
                    "http://*.chs.local",
                    "http://chs.local",
                    "http://api.chs.local",
                    CHS_URL + "/signout",
                    CHS_URL + "/authorised-agent/try-removing-user",
                    CHS_URL + "/authorised-agent/confirmation-you-are-removed",
                    CHS_URL,
                    SELF,
                    PIWIK_URL,
                    "www.example.com"
                ],
                imgSrc: [CDN],
                styleSrc: [NONCE, CDN],
                connectSrc: [SELF, PIWIK_URL],
                scriptSrc: [
                    CHS_URL,
                    NONCE,
                    CDN,
                    PIWIK_URL
                ],
                objectSrc: [`'none'`]
            }
        },
        referrerPolicy: {
            policy: ["same-origin"]
        },
        hsts: {
            maxAge: ONE_YEAR_SECONDS,
            includeSubDomains: true
        }
    };
};
