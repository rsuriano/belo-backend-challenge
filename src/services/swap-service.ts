// executes swap with binance spot api
import binanceAPI from "./binance-service";
import { Quote, Swap } from "../entity";
import { SwapRequest } from "../types/swap";
import quoteDBService from "./quote-db-service";
import { AppDataSource } from "../utils/data-source";
import { BinanceSwapResponse } from '../types/swap';
import swapDBService from "./swap-db-service";

const entityManager = AppDataSource.manager;

const calculatePrices = (swapResponses: BinanceSwapResponse[]) => {
    let finalPrice = 1;
    let finalFees = 0;

    for (const response of swapResponses) {
        finalPrice *= (response.cummulativeQuoteQty ?? 1);
        finalFees += (response.fills ?? []).reduce((c, i) => (c + i.price), 0);
    }

    return [finalPrice, finalFees];
};

const createSwap = async (swapRequest: SwapRequest): Promise<Swap> => {
    // get quote from DB
    const quote = await quoteDBService.getQuoteByUuid(swapRequest.quote_uuid);

    if (!quote) {
        throw Error("Quote not found");
    }

    // these properties can be checked via the DB select, but 
    // you lose info for the error description: 

    // check if it's expired
    if (quote.expiresAt < Date.now() / 1000) {
        throw Error("Quote has expired, must estimate a new price");
    }

    // check if it's used
    if (quote.used == true) {
        throw Error("Quote has been used in a swap already");
    }

    // execute swap via Binance
    const swapResponses = await binanceAPI.executeSwap(quote);

    // get data for swap object
    const [finalPrice, binanceFee] = calculatePrices(swapResponses);

    console.log(`Final price for swap was: ${finalPrice}.`);

    // create new Swap object and save to DB
    const newSwap = {
        quote: quote,
        finalPrice: finalPrice,
        binanceFee: binanceFee,
        binanceResponse: swapResponses
    };
    const swapDB: Swap = await swapDBService.createSwap(newSwap);

    // mark quote as used
    quote.used = true;
    await entityManager.save(Quote, quote);

    return swapDB;
};

export default {
    createSwap
};
