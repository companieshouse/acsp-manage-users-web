export interface Membership {
    id: string;
    userId: string;
    userEmail: string;
    displayUserName: string;
    acspNumber: string;
}

export interface MemberForRemoval extends Membership {
    removingThemselves?: boolean;
}
