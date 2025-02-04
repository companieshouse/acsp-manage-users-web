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

    test.each([
        [true, "true", "TEST_ENV_VARIABLE_1"],
        [false, "false", "TEST_ENV_VARIABLE_2"],
        [false, undefined, "TEST_ENV_VARIABLE_3"]
    ])("should return boolean %s if featureFlagKey is %s", async (expectedValue, keyValue, key) => {

        // Given
        process.env[key] = keyValue;

        // When
        const result = isFeatureEnabled(key);

        // Then
        expect(result).toEqual(expectedValue);
    });
});
