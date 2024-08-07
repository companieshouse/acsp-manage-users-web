/* eslint-disable import/first */

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

    describe("toReadableFormat tests", () => {
        it("Should return a human readable date from hyphanated-date string", () => {
            // Given
            const dateString = "2019-03-01";
            // When
            const date = toReadableFormat(dateString);
            // Then
            expect(date).toEqual("1 March 2019");
        });

        it("Should return a human readable date from local string", () => {
            // Given
            const dateString = "March 18, 2019";
            // When
            const date = toReadableFormat(dateString);
            // Then
            expect(date).toEqual("18 March 2019");
        });

        it("Should return empty string if date is undefined", () => {
            // Given
            const input = undefined as unknown as string;
            // When
            const date = toReadableFormat(input);
            // Then
            expect(date).toEqual("");
        });

        it("Should return empty string if date is null", () => {
            // Given
            const input = null as unknown as string;
            // When
            const date = toReadableFormat(input);
            // Then
            expect(date).toEqual("");
        });

        it("Should return empty string if date is empty string", () => {
            // Given
            const input = "";
            // When
            const date = toReadableFormat(input);
            // Then
            expect(date).toEqual("");
        });

        it("Should log and throw an error", () => {
            // Given
            const badDate = "12345/44/44";

            try {
                // When
                toReadableFormat(badDate);
            } catch (e) {
                // Then
                expect(mockCreateAndLogError).toHaveBeenCalledWith(
                    expect.stringContaining(badDate)
                );
            }
        });
    });
});
