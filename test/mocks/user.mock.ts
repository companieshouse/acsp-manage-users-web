import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { NewUserDetails } from "../../src/types/user";
import { Membership } from "../../src/types/membership";

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

export const userAdamBrownRemoveDetails: Membership = {
    id: "222222",
    userId: "1234567890",
    userEmail: "adam.brown@test.com",
    displayUserName: "Adam Brown",
    acspNumber: "FP233R"
};

export const userJohnSmithRemoveDetails: Membership = {
    id: "333333",
    userId: "1122334455",
    userEmail: "j.smith@test.com",
    displayUserName: "John Smith",
    acspNumber: "LL0RPG"
};
