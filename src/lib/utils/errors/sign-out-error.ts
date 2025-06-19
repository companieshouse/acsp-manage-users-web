
export class SignOutError extends Error {
    constructor (message: string | undefined) {
        super(message);
        this.name = "SignOutError";
        Object.setPrototypeOf(this, SignOutError.prototype);
    }
}
