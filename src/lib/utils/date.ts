import { DateTime } from "luxon";
import { createAndLogError } from "../Logger";
import { Lang } from "../../types/language";

export const toReadableFormat = (dateToConvert: string, lang: string = Lang.EN): string => {
    if (!dateToConvert) {
        return "";
    }
    const jsDate = new Date(dateToConvert);
    const dateTime = DateTime.fromJSDate(jsDate);
    let convertedDate;
    switch (lang) {
    case Lang.CY:
        convertedDate = dateTime.setLocale(Lang.CY).toFormat("d MMMM yyyy");
        break;
    case Lang.EN:
    default:
        convertedDate = dateTime.setLocale(Lang.EN).toFormat("d MMMM yyyy");
        break;
    }
    if (convertedDate === "Invalid DateTime") {
        throw createAndLogError(
            `Unable to convert provided date ${dateToConvert}`
        );
    }
    return convertedDate;
};
