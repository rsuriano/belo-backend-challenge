/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

import pairDBService from "../services/database/pair-db-service";
import quoteService from "../services/quote-service";
import swapService from "../services/swap-service";

import { QuoteRequest } from "../types/quote";
import { SwapRequest } from "../types/swap";

const router = express.Router();

router.get("/pairs", async (_req, res) => {
    const pairs = await pairDBService.getPairs();
    res.json(pairs);
});

router.post("/quote", async (req, res) => {
    try {
        const quoteRequest = plainToClass(QuoteRequest, req.body);
        const errors = await validate(quoteRequest);

        if (errors.length > 0) {
            res.status(400).json({ errors });
        }

        const newQuote = await quoteService.createQuote(quoteRequest);

        res.status(201).json(newQuote);
    }

    catch (error: unknown) {
        let errorMessage = "Error creating quote.";

        if (error instanceof Error) {
            errorMessage += " Error: " + error.message;
        }
        res.status(400).json(errorMessage);
    }

});

router.post("/swap", async (req, res) => {
    try {
        const swapRequest = plainToClass(SwapRequest, req.body);
        const errors = await validate(swapRequest);

        if (errors.length > 0) {
            res.status(400).json({ errors });
        }

        const newSwap = await swapService.createSwap(swapRequest);

        res.status(201).json(newSwap);
    }

    catch (error: unknown) {
        let errorMessage = "Error executing swap.";

        if (error instanceof Error) {
            errorMessage += " Error: " + error.message;
        }
        res.status(400).json(errorMessage);
    }

});

export default router;
