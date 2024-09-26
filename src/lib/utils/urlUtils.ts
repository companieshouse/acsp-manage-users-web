import * as constants from "../../lib/constants";

const WHITELISTED_URLS: string[] = [
    constants.LANDING_URL + constants.HEALTHCHECK
];

export const isWhitelistedUrl = (url: string): boolean => WHITELISTED_URLS.includes(url);

export const getRemoveMemberCheckDetailsFullUrl = (id: string): string => `${constants.LANDING_URL}/${constants.REMOVE_MEMBER_PAGE}/${id}`;

export const getChangeMemberRoleFullUrl = (id: string): string => `${constants.LANDING_URL}/${constants.EDIT_MEMBER_ROLE_PAGE}/${id}`;
