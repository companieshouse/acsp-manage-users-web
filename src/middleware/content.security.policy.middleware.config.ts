import { HelmetOptions } from "helmet";

export const prepareCSPConfig = (nonce: string): HelmetOptions => {
    const CDN = process.env.CDN_HOST as string;
    const PIWIK_URL = process.env.PIWIK_URL as string;
    const PIWIK_CHS_DOMAIN = process.env.PIWIK_CHS_DOMAIN as string;
    const SELF = `'self'`;
    const NONCE = `'nonce-${nonce}'`;
    const ONE_YEAR_SECONDS = 31536000;
    const CHS_URL = process.env.CHS_URL as string;
    const HTTP_CHS_URL: string = CHS_URL.replace(/^https:\/\//, "http://");

    return {
        contentSecurityPolicy: {
            directives: {
                upgradeInsecureRequests: null,
                defaultSrc: [SELF],
                fontSrc: [CDN],
                imgSrc: [CDN],
                styleSrc: [NONCE, CDN],
                connectSrc: [SELF, PIWIK_URL, CDN],
                formAction: [
                    SELF,
                    PIWIK_CHS_DOMAIN,
                    "https://*.gov.uk",
                    CHS_URL,
                    HTTP_CHS_URL
                ],
                scriptSrc: [
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
