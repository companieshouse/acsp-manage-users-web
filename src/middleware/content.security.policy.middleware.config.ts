import { HelmetOptions } from "helmet";

export const prepareCSPConfig = (nonce: string) : HelmetOptions => {
    const CDN = process.env.ANY_PROTOCOL_CDN_HOST as string;
    const PIWIK_URL = process.env.PIWIK_URL as string;
    const SELF = `'self'`;
    const NONCE = `'nonce-${nonce}'`;
    return {
        contentSecurityPolicy: {
            directives: {
                upgradeInsecureRequests: null,
                defaultSrc: [SELF],
                fontSrc: [CDN],
                imgSrc: [CDN],
                styleSrc: [NONCE, CDN],
                connectSrc: [SELF, PIWIK_URL],
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
        }
    };
};
