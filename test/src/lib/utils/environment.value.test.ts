import { describe, expect, test } from "@jest/globals";
import { getEnvironmentValue } from "../../../../src/lib/utils/environmentValue";

describe("Config test suite", () => {
    test("should check if CDN_HOST env is returned correctly and fetched from user environment", () => {
        process.env.ACCOUNT_URL = "abc";
        const testAccUrl = getEnvironmentValue("ACCOUNT_URL");
        expect(testAccUrl).toEqual("abc");
    });

    test("should throw an error when passing anyNonExistingEnv to getEnvironmentValue()", () => {
        const fakeEnv = "anyNonExistingEnv";
        expect(() => getEnvironmentValue(fakeEnv)).toThrow(`Please set the environment variable "${fakeEnv}"`);
    });

    test("should return the optional value when process.env[key] is blank", () => {
        const optionalPort = "3000";
        const testPort = getEnvironmentValue("", optionalPort);
        expect(testPort).toEqual(optionalPort);
    });
});
