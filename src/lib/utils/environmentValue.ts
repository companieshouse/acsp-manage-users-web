export const getEnvironmentValue = (key: string, defaultValue = ""): string => {
    return process.env[key] ?? defaultValue;
};

export const isFeatureEnabled = (featureFlagKey: string): boolean => {
    const result = getEnvironmentValue(featureFlagKey) === "true";
    console.log("key", featureFlagKey, "value", result);
    return getEnvironmentValue(featureFlagKey) === "true";
};
