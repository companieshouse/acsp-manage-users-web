import { getEnvironmentValue, isFeatureEnabled } from "../../../../src/lib/utils/environmentValue";

describe("getEnvironmentValue", () => {
    const oldEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...oldEnv };
    });

    afterAll(() => {
        process.env = oldEnv;
    });

    it("should return an environment value if set for the provided key", () => {
        // Given
        const expectedValue = "expected value";
        const key = "TEST_ENV_VARIABLE";
        process.env[key] = expectedValue;
        // When
        const result = getEnvironmentValue(key);
        // Then
        expect(result).toEqual(expectedValue);
    });

    it("should return an empty string if the environment value not set for the provided key", () => {
        // Given
        const expectedValue = "";
        const key = "TEST_ENV_VARIABLE";
        // When
        const result = getEnvironmentValue(key);
        // Then
        expect(result).toEqual(expectedValue);
    });

    it("should return an empty string if the key not provided", () => {
        // Given
        const expectedValue = "";
        const key = undefined!;
        // When
        const result = getEnvironmentValue(key);
        // Then
        expect(result).toEqual(expectedValue);
    });
});

describe("isFeatureEnabled", () => {
    it("should return boolean true if featureFlagKey is string equal to true", () => {
        // Given
        const key = "TEST_ENV_VARIABLE";
        process.env[key] = "true";
        const expectedValue = true;
        // When
        const result = isFeatureEnabled(key);
        // Then
        expect(result).toEqual(expectedValue);
    });

    it("should return boolean false if featureFlagKey is NOT a string equal to true", () => {
        // Given
        const key1 = "TEST_ENV_VARIABLE";
        const key2 = "TEST_ENV_VARIABLE_2";

        process.env[key1] = "false";
        process.env[key2] = undefined;

        const expectedValue = true;
        // When
        const result1 = isFeatureEnabled(key1);
        const result2 = isFeatureEnabled(key2);
        // Then
        expect(result1).not.toEqual(expectedValue);
        expect(result2).not.toEqual(expectedValue);
    });
});
