import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { NewUserDetails } from "../../src/types/user";

export const userAdamBrownDetails: NewUserDetails = {
    userRole: UserRole.ADMIN,
    userId: "1234567890",
    isValid: true,
    email: "adam.brown@test.com",
    userName: "Adam Brown"
};

export const userJohnSmithDetails: NewUserDetails = {
    userRole: UserRole.STANDARD,
    userId: "1122334455",
    isValid: false,
    email: "j.smith@test.com",
    userName: "John Smith"
};
