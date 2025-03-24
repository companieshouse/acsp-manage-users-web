import { Session } from "@companieshouse/node-session-handler";
import { Request } from "express";
import { getAccessToken } from "../lib/utils/sessionUtils";
import { acspLogger } from "../lib/helpers/acspLogger";
import { createOauthPrivateApiClient } from "./apiClientService";
import { refreshToken } from "./refreshTokenService";

export const makeApiCallWithRetry = async (
    serviceName: string,
    fnName: string,
    req: Request,
    session: Session,
    ...otherParams: any[]
): Promise<unknown> => {

    acspLogger(session, makeApiCallWithRetry.name, `Making a ${fnName} call on ${serviceName} service with token ${getAccessToken(session)}`);

    let client = createOauthPrivateApiClient(req);

    let response = await client[serviceName][fnName](...otherParams);

    if (response && response.httpStatusCode === 401) {

        const responseMsg = `Retrying ${fnName} call on ${serviceName} service after unauthorised response`;
        acspLogger(session, makeApiCallWithRetry.name, `${responseMsg} - ${JSON.stringify(response)}`);

        const accessToken = await refreshToken(req, session);
        acspLogger(session, makeApiCallWithRetry.name, `New access token: ${accessToken}`);

        client = createOauthPrivateApiClient(req);
        response = await client[serviceName][fnName](...otherParams);

    }

    acspLogger(session, makeApiCallWithRetry.name, "Call successful.");

    return response;

};
