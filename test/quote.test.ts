import * as fs from "fs";
import request from "supertest";
import dotenv from "dotenv";

import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

import { connect_db, disconnect_db, AppDataSource } from "../src/utils/data-source";
import { app } from "../src/app";

import { Quote } from "../src/entity";
import { QuoteRequest } from "../src/types/quote";

dotenv.config();

const rawData = fs.readFileSync("test/mockData/quoteRequests.json", "utf8");
const mockQuotes: QuoteRequest[] = JSON.parse(rawData) as QuoteRequest[];

const quotesToDelete: { uuid: string }[] = [];

describe("POST /quote", () => {

    beforeAll(async () => {
        await connect_db();

    });

    it.each(mockQuotes)("should create a quote", async (quoteRequest) => {

        const response = await request(app)
            .post("/api/quote")
            .send(quoteRequest);

        expect(response.statusCode).toBe(201);
        expect(response.body).toBeInstanceOf(Object);

        expect(response.body).toHaveProperty("uuid");
        expect(typeof (response.body.uuid)).toBe("string");

        const quote: Quote = response.body as Quote;
        quotesToDelete.push({ uuid: quote.uuid });
    });

    it.each(mockQuotes)("should return a valid quote", async (quoteRequest) => {

        const response = await request(app)
            .post("/api/quote")
            .send(quoteRequest);

        const quoteResponse = plainToClass(Quote, response.body);
        const errors = await validate(quoteResponse);

        expect(errors.length === 0);

        quotesToDelete.push({ uuid: quoteResponse.uuid });

    });

    afterAll(async () => {

        await AppDataSource.manager.delete(Quote, quotesToDelete);

        await disconnect_db();
    });
});
