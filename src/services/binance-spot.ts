// interfaces with binance
import { Spot, RestMarketTypes } from '@binance/connector-typescript';
import { RouteSegment, Direction, Operation, FormattedOrderBook } from '../types/quote';

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_SECRET_KEY;
const BASE_URL = 'https://testnet.binance.vision';

const client = new Spot(API_KEY, API_SECRET, { baseURL: BASE_URL });

const adjustOrderBook = (orderBook: RestMarketTypes.orderBookResponse, direction: Direction): FormattedOrderBook => {
    if (direction == Direction.INVERTED) {
        return {
            lastUpdateId: orderBook.lastUpdateId,
            bids: orderBook.asks.map(([price, volume]) => [1 / Number(price), Number(volume) * Number(price)]),
            asks: orderBook.bids.map(([price, volume]) => [1 / Number(price), Number(volume) * Number(price)])
        };
    } else {
        return {
            lastUpdateId: orderBook.lastUpdateId,
            bids: orderBook.bids.map(([price, volume]) => [Number(price), Number(volume)]),
            asks: orderBook.asks.map(([price, volume]) => [Number(price), Number(volume)])
        };
    }
};

const getOrderBook = async (pair: string, limit: number = 100): Promise<RestMarketTypes.orderBookResponse> => {

    const options: RestMarketTypes.orderBookOptions = {
        limit: limit,
    };

    try {
        return await client.orderBook(pair, options);
    }
    catch (err) {
        console.error(err);
        throw err;
    }

};

const getOrderBookProcessed = async (segment: RouteSegment, operation: Operation, limit: number) => {

    // get order book for pair
    const fullOrderBook = await getOrderBook(segment.binancePair, limit);

    // invert if needed, parse strings to numbers
    const processedOrderBook = adjustOrderBook(fullOrderBook, segment.direction);

    // chose bid or ask accordingly
    const orderBook = (operation == Operation.BUY) ? processedOrderBook.asks : processedOrderBook.bids;

    return orderBook;
};

// const executeSwap = () => {
//     ...
// };

export default {
    getOrderBookProcessed
};
