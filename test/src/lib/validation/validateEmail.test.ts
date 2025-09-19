import { validateEmailString } from "../../../../src/lib/validation/email.validation";

describe("Should validate emails", () => {
    it.each([
        { email: "", expected: false },
        { email: "a@a.", expected: true },
        { email: "a@b", expected: false },
        { email: "undefined", expected: false },
        { email: "12345", expected: false },
        { email: "234567890@example.com", expected: true },
        { email: "email@example-one.com", expected: true },
        { email: "_______@example.com", expected: true },
        { email: "hu.lk!mar#vel+@example.com", expected: true },
        { email: "hu$lkm%ar&vel@example.com", expected: true },
        { email: "+hul'kmar*vel@example.com", expected: true },
        { email: "hu=lkm?ar^vel@example.com", expected: true },
        { email: "hu_lkmar`ve{l@example.com", expected: true },
        { email: "h|ulkm}arv~el@example.com", expected: true },
        { email: "h.u!l#k$m%a&r'v*e+l/2=1?m^c_u`n{i|v}e~rs-e@example.com", expected: true },
        { email: "h.u!l#k$m%a&r'v*e+l/2=1?m^c_u`n{i|v}e~rs-eexample.com", expected: false }
    ])("should return $expected for $email", ({ email, expected }) => {
        expect(validateEmailString(email)).toEqual(expected);
    });
});
