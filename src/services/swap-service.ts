import { SwapRequest } from "../types/swap";
import { BinanceSwapResponse } from "../types/swap";

import quoteDBService from "./database/quote-db-service";
import swapDBService from "./database/swap-db-service";
import binanceAPI from "./binance-service";

import { Swap } from "../entity";


const calculateFee = (swapResponses: BinanceSwapResponse[]) => {
    let finalFees = 0;

    for (const response of swapResponses) {
        finalFees += (response.fills ?? []).reduce((c, i) => (c + i.price), 0);
    }

    return finalFees;
};

const createSwap = async (swapRequest: SwapRequest): Promise<Swap> => {

    const quote = await quoteDBService.getQuoteByUuid(swapRequest.quote_uuid);

    if (!quote) {
        throw Error("Quote not found");
    }

    // these properties can be checked via the DB select, but 
    // you lose info for the error description:

    if (quote.expiresAt < Date.now() / 1000) {
        throw Error("Quote has expired, must estimate a new price");
    }

    if (quote.used === true) {
        throw Error("Quote has been used in a swap already");
    }

    const swapResponses = await binanceAPI.executeSwap(quote);

    const binanceFee = calculateFee(swapResponses);

    console.debug(`Final price for swap was: ${swapResponses[-1].cummulativeQuoteQty}.`);

    const newSwap = {
        quote: quote,
        finalPrice: Number(swapResponses[-1].cummulativeQuoteQty ?? 0),
        binanceFee: binanceFee,
        binanceResponse: swapResponses
    };
    const swapDB: Swap = await swapDBService.createSwap(newSwap);

    quote.used = true;
    await quoteDBService.updateQuote(quote);

    return swapDB;
};

export default {
    createSwap
};
