import * as constants from "../../lib/constants";

const WHITELISTED_URLS: string[] = [
    constants.LANDING_URL + constants.HEALTHCHECK
];

export const isWhitelistedUrl = (url: string): boolean => WHITELISTED_URLS.includes(url);

export const getRemoveMemberCheckDetailsFullUrl = (id: string): string => `${constants.REMOVE_MEMBER_BASE}/${id}`;

export const getChangeMemberRoleFullUrl = (id: string): string => `${constants.CHANGE_MEMBER_ROLE_BASE}/${id}`;
