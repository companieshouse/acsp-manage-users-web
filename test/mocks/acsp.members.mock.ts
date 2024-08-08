import { AcspMembers, UserRole, AcspMembership, UserStatus, MembershipStatus } from "private-api-sdk-node/dist/services/acsp-manage-users/types";

export const accountOwnerAcspMembership: AcspMembership = {
    etag: "nj3",
    id: "JGyB",
    userId: "Scu1Kk4",
    userEmail: "james.morris@gmail.com",
    userDisplayName: "Not Provided",
    userRole: UserRole.OWNER,
    acspNumber: "123456",
    acspName: "Acme ltd",
    acspStatus: UserStatus.ACTIVE,
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
    acspStatus: UserStatus.ACTIVE,
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
    acspStatus: UserStatus.ACTIVE,
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
    acspStatus: UserStatus.ACTIVE,
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
    acspStatus: UserStatus.ACTIVE,
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
