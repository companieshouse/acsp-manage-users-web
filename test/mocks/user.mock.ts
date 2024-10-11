import { UserRole } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import { NewUserDetails } from "../../src/types/user";
import { Membership } from "../../src/types/membership";
import { User } from "private-api-sdk-node/dist/services/user-account/types";
import { UserRoleChangeData } from "../../src/types/utilTypes";

export const createUserMock = (
    userId: string,
    email: string,
    displayName?: string,
    forename = "",
    surname = ""
): User => ({
    userId,
    email,
    displayName,
    forename,
    surname
});

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
    userDisplayName: "Adam Brown",
    acspNumber: "FP233R",
    userRole: UserRole.STANDARD,
    displayNameOrEmail: "Adam Brown"
};

export const userJohnSmithRemoveDetails: Membership = {
    id: "333333",
    userId: "1122334455",
    userEmail: "j.smith@test.com",
    userDisplayName: "John Smith",
    acspNumber: "LL0RPG",
    userRole: UserRole.STANDARD,
    displayNameOrEmail: "John Smith"
};

export const standardUserMembership: Membership = {
    id: "111111",
    userId: "123456",
    userEmail: "a.brown@test.com",
    userDisplayName: "Adam Brown",
    acspNumber: "LL0RPG",
    userRole: UserRole.STANDARD,
    displayNameOrEmail: "Adam Brown"
};

export const adminUserMembership: Membership = {
    id: "222222",
    userId: "543210",
    userEmail: "e.wood@test.com",
    userDisplayName: "Eva Wood",
    acspNumber: "LL0RPG",
    userRole: UserRole.ADMIN,
    displayNameOrEmail: "Eva Wood"
};

export const ownerUserMembership: Membership = {
    id: "333333",
    userId: "515151",
    userEmail: "a.black@test.com",
    userDisplayName: "Anna Black",
    acspNumber: "LL0RPG",
    userRole: UserRole.OWNER,
    displayNameOrEmail: "Anna Black"
};

// NOTE: All the below is based upon the TestDataManager on the acsp-manage-users-api
// https://github.com/companieshouse/acsp-manage-users-api/blob/main/src/test/java/uk/gov/companieshouse/acsp/manage/users/common/TestDataManager.java
export const buzzUser: User = createUserMock(
    "TSU001",
    "buzz.lightyear@toystory.com",
    undefined,
    "Buzz",
    "Lightyear"
);

export const woodyUser: User = createUserMock(
    "TSU002",
    "woody@toystory.com",
    "Woody",
    "Woody",
    ""
);

export const jimmyUser: User = createUserMock(
    "COMU001",
    "jimmy.carr@comedy.com",
    "Jimmy Carr",
    "Jimmy",
    "Carr"
);

export const shaunUser: User = createUserMock(
    "COMU002",
    "shaun.lock@comedy.com",
    "Shaun Lock",
    "Shaun",
    "Lock"
);

export const davidUser: User = createUserMock(
    "COMU003",
    "david.mitchell@comedy.com",
    "David Mitchell",
    "David",
    "Mitchell"
);

export const charlieUser: User = createUserMock(
    "COMU004",
    "charlie.brooker@comedy.com",
    "Charlie Brooker",
    "Charlie",
    "Brooker"
);

export const katherineUser: User = createUserMock(
    "COMU005",
    "kartherine.ryan@comedy.com",
    "Katherine Ryan",
    "Katherine",
    "Ryan"
);

export const russellUser: User = createUserMock(
    "COMU006",
    "russell.brand@comedy.com",
    "Russell Brand",
    "Russell",
    "Brand"
);

export const frankieUser: User = createUserMock(
    "COMU007",
    "frankie.boyle@comedy.com",
    "Frankie Boyle",
    "Frankie",
    "Boyle"
);

export const mickyUser: User = createUserMock(
    "COMU008",
    "micky.flanagan@comedy.com",
    "Micky Flanagan",
    "Micky",
    "Flanagan"
);

export const stephenUser: User = createUserMock(
    "COMU009",
    "stephen.fry@comedy.com",
    undefined,
    "Stephen",
    "Fry"
);

export const alanUser: User = createUserMock(
    "COMU010",
    "alan.davies@comedy.com",
    undefined,
    "Alan",
    "Davies"
);

export const daraUser: User = createUserMock(
    "COMU011",
    "dara.obrien@comedy.com",
    undefined,
    "Dara",
    "O'Brien"
);

export const jackUser: User = createUserMock(
    "COMU012",
    "jack.whitehall@comedy.com",
    undefined,
    "Jack",
    "Whitehall"
);

export const jonUser: User = createUserMock(
    "COMU013",
    "jon.richardson@comedy.com",
    undefined,
    "Jon",
    "Richardson"
);

export const michaelUser: User = createUserMock(
    "COMU014",
    "michael.mcintyre@comedy.com",
    undefined,
    "Michael",
    "McIntyre"
);

export const joUser: User = createUserMock(
    "COMU015",
    "jo.brand@comedy.com",
    undefined,
    "Jo",
    "Brand"
);

export const henningUser: User = createUserMock(
    "COMU016",
    "henning.wehn@comedy.com",
    undefined,
    "Henning",
    "Wehn"
);

export const geraltUser: User = createUserMock(
    "WITU001",
    "geralt@witcher.com",
    "Geralt of Rivia",
    "Geralt",
    "of Rivia"
);

export const yenneferUser: User = createUserMock(
    "WITU002",
    "yennefer@witcher.com",
    "Yennefer of Vengerberg",
    "Yennefer",
    "of Vengerberg"
);

export const dandelionUser: User = createUserMock(
    "WITU003",
    "dandelion@witcher.com",
    undefined,
    "Dandelion",
    ""
);

export const karlUser: User = createUserMock(
    "NEIU001",
    "karl.kennedy@neighbours.com",
    undefined,
    "Karl",
    "Kennedy"
);

export const haroldUser: User = createUserMock(
    "NEIU002",
    "harold.bishop@neighbours.com",
    "Harold Bishop",
    "Harold",
    "Bishop"
);

export const toadieUser: User = createUserMock(
    "NEIU003",
    "toadie@neighbours.com",
    "Toadie",
    "Toadie",
    ""
);

export const wolverineUser: User = createUserMock(
    "XMEU001",
    "wolverine@xmen.com",
    "Wolverine",
    "Logan",
    ""
);

export const cyclopsUser: User = createUserMock(
    "XMEU002",
    "cyclops@xmen.com",
    undefined,
    "Scott",
    "Summers"
);

export const gambitUser: User = createUserMock(
    "XMEU003",
    "gambit@xmen.com",
    "Gambit",
    "Remy",
    "LeBeau"
);

export const demoUser: User = createUserMock(
    "67ZeMsvAEgkBWs7tNKacdrPvOmQ",
    "demo@ch.gov.uk",
    undefined,
    "Demo",
    "User"
);

export const allUsers: User[] = [
    buzzUser,
    woodyUser,
    jimmyUser,
    shaunUser,
    davidUser,
    charlieUser,
    katherineUser,
    russellUser,
    frankieUser,
    mickyUser,
    stephenUser,
    alanUser,
    daraUser,
    jackUser,
    jonUser,
    michaelUser,
    joUser,
    henningUser,
    geraltUser,
    yenneferUser,
    dandelionUser,
    karlUser,
    haroldUser,
    toadieUser,
    wolverineUser,
    cyclopsUser,
    gambitUser,
    demoUser
];

export const ownerUserRoleChangeDataMock: UserRoleChangeData = {
    acspMembershipId: "12345",
    userRole: UserRole.OWNER.toString(),
    userEmail: "j.smith@test.com",
    changeRolePageUrl: "/change-user-role-page-url"
};

export const ownerUserRoleChangeDataWithDisplayNameMock: UserRoleChangeData = {
    acspMembershipId: "12345",
    userRole: UserRole.OWNER.toString(),
    userEmail: "j.smith@test.com",
    userDisplayName: "John Smith",
    changeRolePageUrl: "/change-user-role-page-url"
};

export const adminUserRoleChangeDataMock: UserRoleChangeData = {
    acspMembershipId: "23456",
    userRole: UserRole.ADMIN.toString(),
    userEmail: "a.black@test.com",
    changeRolePageUrl: "/change-user-role-page-url"
};

export const adminUserRoleChangeDataWithDisplayNameMock: UserRoleChangeData = {
    acspMembershipId: "23456",
    userRole: UserRole.ADMIN.toString(),
    userEmail: "a.black@test.com",
    userDisplayName: "Adam Black",
    changeRolePageUrl: "/change-user-role-page-url"
};

export const standardUserRoleChangeDataMock: UserRoleChangeData = {
    acspMembershipId: "54321",
    userRole: UserRole.STANDARD.toString(),
    userEmail: "e.brown@test.com",
    changeRolePageUrl: "/change-user-role-page-url"
};

export const standardUserRoleChangeDataWithDisplayNameMock: UserRoleChangeData = {
    acspMembershipId: "54321",
    userRole: UserRole.STANDARD.toString(),
    userEmail: "e.brown@test.com",
    userDisplayName: "Eva Brown",
    changeRolePageUrl: "/change-user-role-page-url"
};
