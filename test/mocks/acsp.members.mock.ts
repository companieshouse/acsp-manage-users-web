import {
    AcspMembers,
    AcspMembership,
    MembershipStatus,
    UserRole,
    AcspStatus
} from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import {
    alanUser,
    buzzUser,
    charlieUser,
    cyclopsUser,
    dandelionUser,
    daraUser,
    davidUser,
    demoUser,
    frankieUser,
    gambitUser,
    geraltUser,
    haroldUser,
    henningUser,
    jackUser,
    jimmyUser,
    jonUser,
    joUser,
    karlUser,
    katherineUser,
    michaelUser,
    mickyUser,
    russellUser,
    shaunUser,
    stephenUser,
    toadieUser,
    wolverineUser,
    woodyUser,
    yenneferUser
} from "./user.mock";

const generateEtag = () => Math.random().toString(36).substring(2, 15);
export const createAcspMembershipMock = (
    id: string,
    userId: string,
    userRole: UserRole,
    acspNumber: string,
    addedAt: Date,
    status: MembershipStatus,
    addedBy?: string,
    removedAt?: Date,
    removedBy?: string
): AcspMembership => ({
    etag: generateEtag(),
    id,
    userId,
    userDisplayName: `User ${userId}`,
    userEmail: `user${userId}@example.com`,
    userRole,
    acspNumber,
    acspName: `ACSP ${acspNumber}`,
    acspStatus: AcspStatus.ACTIVE,
    membershipStatus: status,
    addedAt: addedAt.toISOString(),
    addedBy: addedBy || "",
    removedBy: removedBy || "",
    removedAt: removedAt ? removedAt.toISOString() : "",
    kind: "",
    links: {
        self: ""
    }
});

export const accountOwnerAcspMembership: AcspMembership = {
    etag: "nj3",
    id: "JGyB",
    userId: "Scu1Kk4",
    userEmail: "james.morris@gmail.com",
    userDisplayName: "Not Provided",
    userRole: UserRole.OWNER,
    acspNumber: "123456",
    acspName: "Acme ltd",
    acspStatus: AcspStatus.ACTIVE,
    addedAt: "2024-06-21T08:15:02.836Z",
    membershipStatus: MembershipStatus.ACTIVE,
    addedBy: "1234567",
    removedBy: "12345678",
    removedAt: "2024-06-22T05:15:02.836Z",
    kind: "acsp-association",
    links: {
        self: "/12345"
    }
};

export const loggedAccountOwnerAcspMembership: AcspMembership = {
    etag: "nj53",
    id: "JGyBds2w",
    userId: "Wgu21K54",
    userEmail: "j.smith@domain.com",
    userDisplayName: "Not Provided",
    userRole: UserRole.OWNER,
    acspNumber: "123456",
    acspName: "Acme ltd",
    acspStatus: AcspStatus.ACTIVE,
    addedAt: "2024-06-21T08:15:02.836Z",
    membershipStatus: MembershipStatus.ACTIVE,
    addedBy: "1234567",
    removedBy: "12345678",
    removedAt: "2024-06-22T05:15:02.836Z",
    kind: "acsp-association",
    links: {
        self: "/12345"
    }
};

export const administratorAcspMembership: AcspMembership = {
    etag: "wd939",
    id: "ABC123",
    userId: "U123",
    userEmail: "jeremy.lloris@gmail.com",
    userDisplayName: "Not Provided",
    userRole: UserRole.ADMIN,
    acspNumber: "123456",
    acspName: "Acme ltd",
    acspStatus: AcspStatus.ACTIVE,
    addedAt: "2024-06-21T08:15:02.836Z",
    membershipStatus: MembershipStatus.ACTIVE,
    addedBy: "1234567",
    removedBy: "12345678",
    removedAt: "2024-06-22T05:15:02.836Z",
    kind: "acsp-association",
    links: {
        self: "/12345"
    }
};

export const standardUserAcspMembership: AcspMembership = {
    etag: "nj534",
    id: "WSC838",
    userId: "U939",
    userEmail: "jane.doe@gmail.com",
    userDisplayName: "Not Provided",
    userRole: UserRole.STANDARD,
    acspNumber: "123456",
    acspName: "Acme ltd",
    acspStatus: AcspStatus.ACTIVE,
    addedAt: "2024-06-21T08:15:02.836Z",
    membershipStatus: MembershipStatus.ACTIVE,
    addedBy: "1234567",
    removedBy: "12345678",
    removedAt: "2024-06-22T05:15:02.836Z",
    kind: "acsp-association",
    links: {
        self: "/12345"
    }
};
export const getMockAcspMembersResource = (
    acspMembership: AcspMembership
): AcspMembers => ({
    items: [acspMembership],
    links: {
        self: "http://localhost:8080/",
        next: "http://localhost:8080/"
    },
    itemsPerPage: 1,
    pageNumber: 2,
    totalResults: 3,
    totalPages: 4
});

export const acspMembership: AcspMembership = {
    etag: "nj3",
    id: "JGyB",
    userId: "Scu1Kk4",
    userEmail: "email@domain.com",
    userDisplayName: "Not Provided",
    userRole: UserRole.OWNER,
    acspNumber: "123456",
    acspName: "Acme ltd",
    acspStatus: AcspStatus.ACTIVE,
    addedAt: "2024-06-21T08:15:02.836Z",
    membershipStatus: MembershipStatus.ACTIVE,
    addedBy: "1234567",
    removedBy: "12345678",
    removedAt: "2024-06-22T05:15:02.836Z",
    kind: "acsp-association",
    links: {
        self: "/12345"
    }
};

export const mockAcspMembersResource: AcspMembers = {
    items: [acspMembership],
    links: {
        self: "http://localhost:8080/",
        next: "http://localhost:8080/"
    },
    itemsPerPage: 1,
    pageNumber: 2,
    totalResults: 3,
    totalPages: 4
};

// NOTE: All the below is based upon the TestDataManager on the acsp-manage-users-api
// https://github.com/companieshouse/acsp-manage-users-api/blob/main/src/test/java/uk/gov/companieshouse/acsp/manage/users/common/TestDataManager.java
export const ToyStoryBuzzAcspMembership: AcspMembership = createAcspMembershipMock(
    "TS001",
    buzzUser.userId as string,
    UserRole.OWNER,
    "TSA001",
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE
);

export const ToyStoryWoodyAcspMembership: AcspMembership = createAcspMembershipMock(
    "TS002",
    woodyUser.userId as string,
    UserRole.ADMIN,
    "TSA001",
    new Date(Date.now() - 11 * 30 * 24 * 60 * 60 * 1000),
    MembershipStatus.REMOVED,
    buzzUser.userId as string,
    new Date(Date.now() - 10 * 30 * 24 * 60 * 60 * 1000),
    buzzUser.userId
);

export const NetflixBuzzAcspMembership: AcspMembership = createAcspMembershipMock(
    "NF001",
    buzzUser.userId as string,
    UserRole.ADMIN,
    "NFA001",
    new Date(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000),
    MembershipStatus.REMOVED,
    woodyUser.userId as string,
    new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000),
    woodyUser.userId
);

export const NetflixWoodyAcspMembership: AcspMembership = createAcspMembershipMock(
    "NF002",
    woodyUser.userId as string,
    UserRole.OWNER,
    "NFA001",
    new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE
);

export const ComedyJimmyAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM001",
    jimmyUser.userId as string,
    UserRole.OWNER,
    "COMA001",
    new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.REMOVED,
    undefined,
    new Date(Date.now() - 8 * 365 * 24 * 60 * 60 * 1000),
    shaunUser.userId
);

export const ComedyShaunAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM002",
    shaunUser.userId as string,
    UserRole.OWNER,
    "COMA001",
    new Date(Date.now() - 9 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE
);

export const ComedyDavidAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM003",
    davidUser.userId as string,
    UserRole.ADMIN,
    "COMA001",
    new Date(Date.now() - 8 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.REMOVED,
    shaunUser.userId as string,
    new Date(Date.now() - 7 * 365 * 24 * 60 * 60 * 1000),
    shaunUser.userId
);

export const ComedyCharlieAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM004",
    charlieUser.userId as string,
    UserRole.ADMIN,
    "COMA001",
    new Date(Date.now() - 8 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    shaunUser.userId
);

export const ComedyKatherineAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM005",
    katherineUser.userId as string,
    UserRole.ADMIN,
    "COMA001",
    new Date(Date.now() - 7 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    charlieUser.userId
);

export const ComedyRussellAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM006",
    russellUser.userId as string,
    UserRole.STANDARD,
    "COMA001",
    new Date(Date.now() - 6 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.REMOVED,
    shaunUser.userId as string,
    new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
    shaunUser.userId
);

export const ComedyFrankieAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM007",
    frankieUser.userId as string,
    UserRole.STANDARD,
    "COMA001",
    new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    shaunUser.userId
);

export const ComedyMickyAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM008",
    mickyUser.userId as string,
    UserRole.STANDARD,
    "COMA001",
    new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    charlieUser.userId
);

export const ComedyStephenAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM009",
    stephenUser.userId as string,
    UserRole.OWNER,
    "COMA001",
    new Date(Date.now() - 20 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.REMOVED,
    undefined,
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    shaunUser.userId
);

export const ComedyAlanAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM010",
    alanUser.userId as string,
    UserRole.OWNER,
    "COMA001",
    new Date(Date.now() - 19 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE
);

export const ComedyDaraAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM011",
    daraUser.userId as string,
    UserRole.ADMIN,
    "COMA001",
    new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.REMOVED,
    shaunUser.userId as string,
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    charlieUser.userId
);

export const ComedyJackAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM012",
    jackUser.userId as string,
    UserRole.ADMIN,
    "COMA001",
    new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    shaunUser.userId
);

export const ComedyJonAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM013",
    jonUser.userId as string,
    UserRole.ADMIN,
    "COMA001",
    new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    charlieUser.userId
);

export const ComedyMichealAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM014",
    michaelUser.userId as string,
    UserRole.STANDARD,
    "COMA001",
    new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.REMOVED,
    shaunUser.userId as string,
    new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000),
    charlieUser.userId
);

export const ComedyJoAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM015",
    joUser.userId as string,
    UserRole.STANDARD,
    "COMA001",
    new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    shaunUser.userId
);

export const ComedyHenningAcspMembership: AcspMembership = createAcspMembershipMock(
    "COM016",
    henningUser.userId as string,
    UserRole.STANDARD,
    "COMA001",
    new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    charlieUser.userId
);

export const WitcherGeraltAcspMembership: AcspMembership = createAcspMembershipMock(
    "WIT001",
    geraltUser.userId as string,
    UserRole.OWNER,
    "WITA001",
    new Date(Date.now() - 20 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE
);

export const WitcherYenneferAcspMembership: AcspMembership = createAcspMembershipMock(
    "WIT002",
    yenneferUser.userId as string,
    UserRole.ADMIN,
    "WITA001",
    new Date(Date.now() - 11 * 30 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    geraltUser.userId
);

export const WitcherDandelionAcspMembership: AcspMembership = createAcspMembershipMock(
    "WIT003",
    dandelionUser.userId as string,
    UserRole.STANDARD,
    "WITA001",
    new Date(Date.now() - 10 * 30 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    yenneferUser.userId
);

export const WitcherDemoAcspMembership: AcspMembership = createAcspMembershipMock(
    "WIT004",
    demoUser.userId as string,
    UserRole.OWNER,
    "WITA001",
    new Date(Date.now() - 21 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE
);

export const NeighboursKarlAcspMembership: AcspMembership = createAcspMembershipMock(
    "NEI001",
    karlUser.userId as string,
    UserRole.OWNER,
    "NEIA001",
    new Date(Date.now() - 25 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE
);

export const NeighboursHaroldAcspMembership: AcspMembership = createAcspMembershipMock(
    "NEI002",
    haroldUser.userId as string,
    UserRole.ADMIN,
    "NEIA001",
    new Date(Date.now() - 11 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    karlUser.userId
);

export const NeighboursToadieAcspMembership: AcspMembership = createAcspMembershipMock(
    "NEI003",
    toadieUser.userId as string,
    UserRole.STANDARD,
    "NEIA001",
    new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    haroldUser.userId
);

export const NeighboursDemoAcspMembership: AcspMembership = createAcspMembershipMock(
    "NEI004",
    demoUser.userId as string,
    UserRole.ADMIN,
    "NEIA001",
    new Date(Date.now() - 26 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE
);

export const XmenWolverineAcspMembership: AcspMembership = createAcspMembershipMock(
    "XME001",
    wolverineUser.userId as string,
    UserRole.OWNER,
    "XMEA001",
    new Date(Date.now() - 14 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE
);

export const XmenCyclopsAcspMembership: AcspMembership = createAcspMembershipMock(
    "XME002",
    cyclopsUser.userId as string,
    UserRole.ADMIN,
    "XMEA001",
    new Date(Date.now() - 11 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    wolverineUser.userId
);

export const XmenGambitAcspMembership: AcspMembership = createAcspMembershipMock(
    "XME003",
    gambitUser.userId as string,
    UserRole.STANDARD,
    "XMEA001",
    new Date(Date.now() - 4 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE,
    cyclopsUser.userId
);

export const XmenDemoAcspMembership: AcspMembership = createAcspMembershipMock(
    "XME004",
    demoUser.userId as string,
    UserRole.STANDARD,
    "XMEA001",
    new Date(Date.now() - 15 * 365 * 24 * 60 * 60 * 1000),
    MembershipStatus.ACTIVE
);

export const allAcspMemberships: AcspMembership[] = [
    ToyStoryBuzzAcspMembership,
    ToyStoryWoodyAcspMembership,
    NetflixBuzzAcspMembership,
    NetflixWoodyAcspMembership,
    ComedyJimmyAcspMembership,
    ComedyShaunAcspMembership,
    ComedyDavidAcspMembership,
    ComedyCharlieAcspMembership,
    ComedyKatherineAcspMembership,
    ComedyRussellAcspMembership,
    ComedyFrankieAcspMembership,
    ComedyMickyAcspMembership,
    ComedyStephenAcspMembership,
    ComedyAlanAcspMembership,
    ComedyDaraAcspMembership,
    ComedyJackAcspMembership,
    ComedyJonAcspMembership,
    ComedyMichealAcspMembership,
    ComedyJoAcspMembership,
    ComedyHenningAcspMembership,
    WitcherGeraltAcspMembership,
    WitcherYenneferAcspMembership,
    WitcherDandelionAcspMembership,
    WitcherDemoAcspMembership,
    NeighboursKarlAcspMembership,
    NeighboursHaroldAcspMembership,
    NeighboursToadieAcspMembership,
    NeighboursDemoAcspMembership,
    XmenWolverineAcspMembership,
    XmenCyclopsAcspMembership,
    XmenGambitAcspMembership,
    XmenDemoAcspMembership
];
