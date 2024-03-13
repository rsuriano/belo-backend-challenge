// executes swap with binance spot api
import binanceAPI from "./binance-service";
import { Quote } from "../entity";
import { SwapRequest } from "../types/swap";
import quoteDBService from "./quote-db-service";
import { AppDataSource } from "../utils/data-source";

const entityManager = AppDataSource.manager;

// const createSwap = async (swapRequest: SwapRequest): Promise<Swap> => {
const createSwap = async (swapRequest: SwapRequest) => {
    // get quote from DB
    const quote = await quoteDBService.getQuoteByUuid(swapRequest.quote_uuid);

    if (!quote) {
        throw Error("Quote not found");
    }

    // check if it's expired
    if (quote.expiresAt < Date.now() / 1000) {
        throw Error("Quote has expired, must estimate a new price");
    }

    // execute swap via Binance
    const swapStatus = binanceAPI.executeSwap(quote);
    console.log(swapStatus);

    // mark quote as used
    quote.used = true;
    await entityManager.save(Quote, quote);

    //return swap results
    // Swap(
    //     ...
    // )
};

export default {
    createSwap
};
