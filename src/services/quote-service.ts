// saves and patches quotes to DB
import { Quote, QuoteRequest, PairResponse, Operation } from "../types/quote";
import binanceSpot from "./binance-spot";
import db_conn from "../utils/db-conn";
import { v4 as uuidv4 } from 'uuid';


const getPairs = (): PairResponse => {
    return {
        pairs: [
            "ETHUSDT",
            "BTCUSDT",
            // "USDCAAVE"
        ]
    };
};

// const estimateQuotePrice = async (quoteRequest: QuoteRequest) => {
const estimateQuotePrice = async (quoteRequest: QuoteRequest) => {
    try {

        // get order book for pair
        const fullOrderBook = await binanceSpot.getOrderBook(quoteRequest.pair);
        // const fullOrderBook = {
        //     "lastUpdateId": 18287072,
        //     "bids": [
        //         [
        //             "3931.18000000",
        //             "0.11960000"
        //         ],
        //         [
        //             "3931.07000000",
        //             "0.11330000"
        //         ],
        //         [
        //             "3931.00000000",
        //             "0.10430000"
        //         ],
        //         [
        //             "3930.94000000",
        //             "0.06870000"
        //         ],
        //         [
        //             "3930.15000000",
        //             "0.07530000"
        //         ]
        //     ],
        //     "asks": [
        //         [
        //             "3931.19000000",
        //             "0.07380000"
        //         ],
        //         [
        //             "3931.23000000",
        //             "0.10690000"
        //         ],
        //         [
        //             "3931.25000000",
        //             "0.12340000"
        //         ],
        //         [
        //             "3931.26000000",
        //             "0.09040000"
        //         ],
        //         [
        //             "3931.31000000",
        //             "0.07250000"
        //         ]
        //     ]
        // };

        const orderBook: string[][] =
            (quoteRequest.operation == Operation.BUY) ? fullOrderBook.asks : fullOrderBook.bids;

        // // TODO: check if volume is ok to estimate price
        // let volume: number = 0;
        // for (const item of orderBook) {
        //     volume += Number(item[1]);

        //     if (volume >= quoteRequest.volume) {
        //         break;
        //     }
        // }
        // if (volume < quoteRequest.volume) {
        //     (go again with a higher limit)
        // }

        // estimate price
        let priceAvg = orderBook.reduce(
            (prev, curr) => { return prev + Number(curr[0]); }, 0
        );
        priceAvg = priceAvg / orderBook.length;

        // TODO: add fee and spread
        // let priceWithFees = priceAvg + fee + spread

        return priceAvg;

    }
    catch (error: unknown) {
        console.error(error);
        throw error;
    }

};

const createQuote = async (quoteRequest: QuoteRequest) => {

    // assemble newQuote object
    const newQuote: Quote = {
        pair: quoteRequest.pair,
        volume: quoteRequest.volume,
        operation: quoteRequest.operation,
        swapUuid: uuidv4(),
        estimatedPrice: await estimateQuotePrice(quoteRequest),
        expirationSeconds: Number(process.env.EXPIRATION_TIME),
        expirationDate: Date.now() + Number(process.env.EXPIRATION_TIME) * 1000
    };

    // TODO: save to DB
    await db_conn.saveQuote(newQuote);

    return newQuote;
};

export default {
    getPairs,
    createQuote
};
