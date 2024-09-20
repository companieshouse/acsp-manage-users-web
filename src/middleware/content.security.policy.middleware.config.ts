import { HelmetOptions } from "helmet";

const CDN = process.env.ANY_PROTOCOL_CDN_HOST as string;
const PIWIK_URL = process.env.PIWIK_URL as string;

export const prepareCSPConfig = (nonce: string) : HelmetOptions => ({
    crossOriginResourcePolicy: false,
    originAgentCluster: false,
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
