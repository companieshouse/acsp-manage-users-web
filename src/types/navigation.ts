export interface Navigation {
    [x: string]: {
        allowedReferers: string[];
        redirectTo: string;
    };
}
