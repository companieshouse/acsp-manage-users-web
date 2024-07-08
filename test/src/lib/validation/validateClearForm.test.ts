import { validateClearForm } from "../../../../src/lib/validation/clear.form.validation";

describe("Should validate clear form query param", () => {
    it.each([
        { string: "true", expected: true },
        { string: "false", expected: false },
        { string: "truex", expected: false },
        { string: "undefined", expected: false }
    ])("should return $expected for $email", ({ string, expected }) => {
        expect(validateClearForm(string)).toEqual(expected);
    });
});
