import i18next from "i18next";
import { AnyRecord } from "../../types/utilTypes";
import * as constants from "../constants";

export const getTranslationsForView = (t: typeof i18next.t, viewName: string): AnyRecord => ({
    ...t(constants.COMMON, { returnObjects: true }),
    ...t(viewName, { returnObjects: true })
});
