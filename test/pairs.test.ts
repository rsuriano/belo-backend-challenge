import request from "supertest";
import dotenv from "dotenv";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

process.env.TEST = "true";

import { connect_db, disconnect_db } from "../src/utils/data-source";
import { app } from "../src/app";

import { Pair } from "../src/entity";

dotenv.config();

describe("GET /pairs", () => {

    beforeAll(async () => {
        await connect_db();

    });

    it("should fetch all pairs", async () => {

        const response = await request(app).get("/api/pairs");

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });

    it("should return valid pairs", async () => {

        const response = await request(app).get("/api/pairs");

        const pairResponse = plainToClass(Pair, response.body);
        const errors = await validate(pairResponse);

        expect(errors.length === 0);

    });

    afterAll(async () => {
        await disconnect_db();
    });
});

process.env.TEST = "false";
