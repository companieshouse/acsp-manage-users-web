import * as constants from "../../lib/constants";

const WHITELISTED_URLS: string[] = [
    constants.HEALTHCHECK_FULL_URL
];

export const isWhitelistedUrl = (url: string): boolean => WHITELISTED_URLS.includes(url);

export const getRemoveMemberCheckDetailsFullUrl = (id: string): string => constants.getFullUrl(`/${constants.REMOVE_MEMBER_PAGE}/${id}`);

export const getChangeMemberRoleFullUrl = (id: string): string => constants.getFullUrl(`/${constants.EDIT_MEMBER_ROLE_PAGE}/${id}`);

export const getEditMemberRoleFullUrl = (id: string): string => constants.getFullUrl(`/${constants.EDIT_MEMBER_ROLE_PAGE}/${id}`);
