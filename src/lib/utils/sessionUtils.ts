import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { ISignInInfo } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { UserProfileKeys } from "@companieshouse/node-session-handler/lib/session/keys/UserProfileKeys";
import { Session } from "@companieshouse/node-session-handler";
import { AcspMembership } from "private-api-sdk-node/dist/services/acsp-manage-users/types";
import * as constants from "../constants";
import { AccessTokenKeys } from "@companieshouse/node-session-handler/lib/session/keys/AccessTokenKeys";
import { acspLogger } from "../../lib/helpers/acspLogger";

const getSignInInfo = (session: Session | undefined): ISignInInfo | undefined => {
    return session?.data?.[SessionKey.SignInInfo];
};

export const getLoggedInUserEmail = (session: Session | undefined): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.UserProfile]?.[UserProfileKeys.Email] as string;
};

export const getLoggedInUserId = (session: Session | undefined): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.UserProfile]?.[UserProfileKeys.UserId] as string;
};

export const getLoggedUserAcspMembership = (session: Session | undefined): AcspMembership => {
    return getExtraData(session, constants.LOGGED_USER_ACSP_MEMBERSHIP);
};

export const getLoggedInAcspNumber = (session: Session | undefined): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.AcspNumber] as string;
};

export const setExtraData = (session: Session | undefined, key: string, data: unknown): void => {
    return session?.setExtraData(key, data);
};

export const getExtraData = (session: Session | undefined, key: string): any => {
    return session?.getExtraData(key);
};

/**
 * This function will attempt to remove from extra data in a session the value that the provided key points at.
 * @param session is the session from which the extra data should be removed
 * @param key is the key to the value that should be removed
 * @returns true if the function attepts to remove extra data, false if session is not provided
 */
export const deleteExtraData = (session: Session | undefined, key: string): boolean => {
    return session ? session.deleteExtraData(key) : false;
};

export const getAccessToken = (session: Session | undefined): string | undefined => {
    return session?.data.signin_info?.access_token?.access_token;
};

export const setAccessToken = (session: Session, accessToken: string): void => {
    const signInInfo = getSignInInfo(session);
    if (signInInfo) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        signInInfo[SignInInfoKeys.AccessToken]![AccessTokenKeys.AccessToken] = accessToken;
    } else {
        const errorMessage = "SignInInfo not present in the session";
        acspLogger(session, setAccessToken.name, errorMessage, true);
        throw new Error(errorMessage);
    }
};

export const getRefreshToken = (session: Session): string => {
    const signInInfo = getSignInInfo(session);
    return signInInfo?.[SignInInfoKeys.AccessToken]?.[AccessTokenKeys.RefreshToken] as string;
};
