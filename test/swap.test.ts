// import * as fs from "fs";
import request from "supertest";
import dotenv from "dotenv";

import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

import { connect_db, disconnect_db, AppDataSource } from "../src/utils/data-source";
import { app } from "../src/app";

import { Quote, Swap } from "../src/entity";
// import { QuoteRequest } from "../src/types/quote";

dotenv.config();

// const rawData = fs.readFileSync("test/mockData/quoteRequests.json", "utf8");
// const mockQuotes: QuoteRequest[] = JSON.parse(rawData) as QuoteRequest[];

const quotesToDelete: { uuid: string }[] = [];
const swapsToDelete: { uuid: string }[] = [];

describe("POST /swap", () => {

    let newQuote: Quote;

    beforeAll(async () => {
        await connect_db();

    });

    beforeEach(async () => {
        const response = await request(app)
            .post("/api/quote")
            .send({
                "pair": "BTCUSDT",
                "volume": 0.0001,
                "operation": "BUY"
            });

        expect(response.statusCode).toBe(201);

        const quoteResponse = plainToClass(Quote, response.body);
        const errors = await validate(quoteResponse);

        if (errors.length > 0) {
            throw errors;
        }

        newQuote = quoteResponse;

        quotesToDelete.push(newQuote);
    });

    it("should create a swap", async () => {

        const response = await request(app)
            .post("/api/swap")
            .send({ quote_uuid: newQuote.uuid });

        expect(response.statusCode).toBe(201);
        expect(response.body).toBeInstanceOf(Object);

        expect(response.body).toHaveProperty("uuid");
        expect(typeof (response.body.uuid)).toBe("string");

        const swap: Swap = response.body as Swap;
        swapsToDelete.push({ uuid: swap.uuid });
    });

    it("should return a valid swap", async () => {

        const response = await request(app)
            .post("/api/swap")
            .send({ quote_uuid: newQuote.uuid });

        const swapResponse = plainToClass(Swap, response.body);
        const errors = await validate(swapResponse);

        expect(errors.length === 0);

        swapsToDelete.push({ uuid: swapResponse.uuid });

    });

    afterAll(async () => {

        if (swapsToDelete.length > 0) {
            await AppDataSource.manager.delete(Swap, swapsToDelete);
        }

        if (quotesToDelete.length > 0) {
            await AppDataSource.manager.delete(Quote, quotesToDelete);
        }

        await disconnect_db();
    });
});
