// saves and patches quotes to DB
import { Quote, QuoteRequest, PairResponse, Operation } from "../types/quote";

const getPairs = (): PairResponse => {
    return {
        pairs: [
            "USDTETH",
            "USDTBTC",
            "USDCAAVE"
        ]
    };
};

const createQuote = (_quoteRequest: QuoteRequest) => {

    // get estimated price from binance-spot.ts

    // assemble newQuote object

    // save to DB and return quote

    const newQuote: Quote = {
        pair: 'USDTETH',
        volume: 1000,
        operation: Operation.BUY,
        swap_uuid: 'abcde',
        estimated_price: 3500,
        expiration_seconds: 30,
        expiration_date: 123123
    };

    return newQuote;
};

export default {
    getPairs,
    createQuote
};
