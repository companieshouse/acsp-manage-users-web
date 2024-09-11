import mocks from "../mocks/all.middleware.mock";
import supertest from "supertest";
import app from "../../src/app";
import { NextFunction, Request, Response } from "express";

const router = supertest(app);
const url = "/authorised-agent/";

describe("process.on", () => {

    it("catches uncaught exceptions", async () => {
        // Given
        mocks.mockLoggedUserAcspMembershipMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            process.emit("uncaughtException", new Error("test error"));
            next();
        });
        const processExitMock = jest.spyOn(process, "exit").mockImplementation((number) => { throw new Error("process.exit: " + number); });
        // When
        await router.get(url);
        // Then
        expect(processExitMock).toHaveBeenCalledWith(1);
    });

    it("catches unhandled rejection", async () => {
        // Given
        mocks.mockLoggedUserAcspMembershipMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => {
            const promise = new Promise<string>((resolve, reject) => {
                return reject;
            });
            process.emit("unhandledRejection", "reason", promise);
            next();
        });
        const processExitMock = jest.spyOn(process, "exit").mockImplementation((number) => { throw new Error("process.exit: " + number); });
        // When
        await router.get(url);
        // Then
        expect(processExitMock).toHaveBeenCalledWith(1);
    });
});
