/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import request from "supertest";
import dotenv from "dotenv";

import { connect_db, disconnect_db } from "../src/utils/data-source";
import { app } from "../src/app";

dotenv.config();

describe("GET /pairs", () => {

    beforeAll(() => {
        connect_db();
    });

    it("should fetch all pairs", async () => {

        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        // Add more assertions based on the expected structure of your pairs
        // For example, if you expect each pair to have a "name" property:
        // expect(response.body.every(pair => "name" in pair)).toBeTruthy();
    });

    afterAll(async () => {
        await disconnect_db();
    });
});
