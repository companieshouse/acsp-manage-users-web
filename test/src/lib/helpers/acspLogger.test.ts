import { acspLogger } from "../../../../src/lib/helpers/acspLogger";
import { getSessionRequestWithPermission } from "../../../mocks/session.mock";
import logger from "../../../../src/lib/Logger";
import * as sessionUtils from "../../../../src/lib/utils/sessionUtils";

const getLoggedUserAcspMembershipSpy: jest.SpyInstance = jest.spyOn(sessionUtils, "getLoggedUserAcspMembership");

logger.error = jest.fn();
logger.info = jest.fn();

const session = getSessionRequestWithPermission();

describe("Acsp logger tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("acspLogger", () => {
        it("Should log messages with ACSP information", () => {
            const message = "something went wrong";
            const functionName = "functionName";
            getLoggedUserAcspMembershipSpy.mockReturnValue({ acspNumber: "ABC321", userId: "123", userRole: "standard" });

            acspLogger(session, functionName, message);

            expect(logger.info).toHaveBeenCalledTimes(1);
            expect(logger.info).toHaveBeenCalledWith("123: ABC321: standard: functionName: something went wrong");
            expect(logger.error).not.toHaveBeenCalled();
        });

        it("Should log error messages with ACSP info", () => {
            const message = "something went wrong";
            getLoggedUserAcspMembershipSpy.mockReturnValue({ acspNumber: "ABC321", userId: "123", userRole: "standard" });
            const functionName = "functionName";

            acspLogger(session, functionName, message, true);

            expect(logger.info).not.toHaveBeenCalledTimes(1);
            expect(logger.error).toHaveBeenCalledWith("123: ABC321: standard: functionName: something went wrong");
            expect(logger.error).toHaveBeenCalled();
        });
    });
});
