import logger from "../../lib/Logger";

export const getEnvironmentValue = (key: string, defaultValue = ""): string => {
    if (!process.env[key]) {
        logger.info(`Environment Value ${key} not found, returning default value`);
    } else {
        logger.info(`Environment Value ${key} was found - value ${process.env[key]}`);
    }
    return process.env[key] ?? defaultValue;
};
