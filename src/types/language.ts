interface LanguageConfig {
    defaultLanguage: string;
    supportedLanguages: {
        [key: string]: {
            code: string;
            name: string;
            nativeName: string;
            visuallyHiddenText: string;
        };
    };
}

export const LANGUAGE_CONFIG: LanguageConfig = {
    defaultLanguage: "en",
    supportedLanguages: {
        en: {
            code: "en",
            name: "English",
            nativeName: "English",
            visuallyHiddenText: "Change the language to English"
        },
        cy: {
            code: "cy",
            name: "Welsh",
            nativeName: "Cymraeg",
            visuallyHiddenText: "Newid iaith i’r Gymraeg"
        }
    }
};
