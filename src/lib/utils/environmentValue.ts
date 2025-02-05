export const getEnvironmentValue = (key: string, defaultValue = ""): string => {
    return process.env[key] ?? defaultValue;
};

export const isFeatureEnabled = (featureFlagKey: string): boolean => {
    return getEnvironmentValue(featureFlagKey) === "true";
};
