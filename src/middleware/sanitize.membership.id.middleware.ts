import { NextFunction, Request, Response, RequestHandler } from "express";

export const sanitizeMembershipIdMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    let { id } = req.params;
    id = id.replace(/[^a-zA-Z0-9]/g, "").trim();
    req.params.id = id;
    next();
};
