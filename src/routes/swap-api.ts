/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

// import typeParsers from '../utils/type-parsers';
import pairDBService from '../services/pair-db-service';
import quoteService from '../services/quote-service';
import { QuoteRequest } from '../types/quote';

const router = express.Router();

router.get('/pairs', async (_req, res) => {
    const pairs = await pairDBService.getPairs();
    res.send(pairs);
});

router.post('/quote', async (req, res) => {
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
        let errorMessage = 'Error creating quote.';

        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }

});

// router.post('/swap', (req, res) => {
//     try {
//         const swapRequest = typeParsers.toSwapRequest(req.body);

//         const newSwap = swapService.createSwap(swapRequest);

//         res.json(newSwap);
//     }

//     catch (error: unknown) {
//         let errorMessage = 'Error executing swap.';

//         if (error instanceof Error) {
//             errorMessage += ' Error: ' + error.message;
//         }
//         res.status(400).send(errorMessage);
//     }

// });

export default router;
