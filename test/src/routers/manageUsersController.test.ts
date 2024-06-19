import supertest from "supertest";
import app from "../../../src/app";

const router = supertest(app);

describe("GET /acsp-manage-users", () => {
    it("should return status 200", async () => {
        await router.get("/acsp-manage-users").expect(200);
    });
});
