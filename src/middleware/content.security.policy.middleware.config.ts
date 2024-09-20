import { HelmetOptions } from "helmet";

const CDN = process.env.ANY_PROTOCOL_CDN_HOST as string;
const PIWIK_URL = process.env.PIWIK_URL as string;
// const ONE_YEAR_SECONDS = 31536000;

export const prepareCSPConfig = (nonce: string) : HelmetOptions => ({
    // originAgentCluster: false,
    // hsts: {
    //     maxAge: ONE_YEAR_SECONDS,
    //     includeSubDomains: true
    // },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: [`'self'`],
            fontSrc: [CDN],
            upgradeInsecureRequests: null,
            imgSrc: [CDN],
            styleSrc: [`'nonce-${nonce}'`, CDN],
            connectSrc: [`'self'`, PIWIK_URL],
            scriptSrc: [
                `'nonce-${nonce}'`,
                CDN,
                PIWIK_URL
            ],
            objectSrc: [`'none'`]
        }
    }
});
