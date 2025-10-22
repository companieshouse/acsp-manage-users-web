jest.mock("../../../../src/lib/Logger");

import {
    toReadableFormat
} from "../../../../src/lib/utils/date";
import { createAndLogError } from "../../../../src/lib/Logger";
import { Settings as luxonSettings } from "luxon";

const mockCreateAndLogError = createAndLogError as jest.Mock;
mockCreateAndLogError.mockReturnValue(new Error());

const today = "2020-04-25";

describe("Date tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        luxonSettings.now = () => new Date(today).valueOf();
    });

    describe("toReadableFormat", () => {
        it.each([
            // Given
            ["a human readable date from hyphanated-date string and locales set to English", "2019-03-01", "en", "1 March 2019"],
            ["a human readable date from local string and locales set to English", "March 18, 2019", "en", "18 March 2019"],
            ["an empty string if date is undefined and locales set to English", undefined as unknown as string, "en", ""],
            ["an empty string if date is null and locales set to English", undefined as unknown as string, "en", ""],
            ["a human readable date from hyphanated-date string and locales set to Welsh", "2019-03-01", "cy", "1 Mawrth 2019"],
            ["a human readable date from local string and locales set to Welsh", "March 18, 2019", "cy", "18 Mawrth 2019"],
            ["an empty string if date is undefined and locales set to Welsh", undefined as unknown as string, "cy", ""],
            ["an empty string if date is null and locales set to Welsh", undefined as unknown as string, "cy", ""]
        ])("Should return %s", (_info, dateString, lang, expectValue) => {
            // When
            const date = toReadableFormat(dateString, lang);
            // Then
            expect(date).toEqual(expectValue);
        });

        it("Should log and throw an error", () => {
            // Given
            const badDate = "12345/44/44";

            try {
                // When
                toReadableFormat(badDate);
            } catch {
                // Then
                expect(mockCreateAndLogError).toHaveBeenCalledWith(
                    expect.stringContaining(badDate)
                );
            }
        });
    });
});
