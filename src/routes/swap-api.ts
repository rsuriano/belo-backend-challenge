/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

import typeParsers from '../utils/type-parsers';
import quoteService from '../services/quote-service';

const router = express.Router();

router.get('/pairs', (_req, res) => {
    const pairs = quoteService.getPairs();
    res.send(pairs);
});

router.post('/quote', async (req, res) => {
    try {
        const quoteRequest = typeParsers.toQuoteRequest(req.body);

        const newQuote = await quoteService.createQuote(quoteRequest);

        res.json(newQuote);
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
