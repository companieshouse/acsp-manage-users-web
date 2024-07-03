import { Request, Response, RequestHandler } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const healthCheckController: RequestHandler = (
    req: Request,
    res: Response
) => {
    res
        .status(StatusCodes.OK)
        .send(ReasonPhrases.OK);
};
