// interfaces with binance
import { Spot, RestMarketTypes, OrderType, RestTradeTypes } from '@binance/connector-typescript';
import { RouteSegment, Direction, Operation, FormattedOrderBook } from '../types/quote';
import { Quote } from '../entity';
import utils from '../utils/utils';

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_SECRET_KEY;
const BASE_URL = 'https://testnet.binance.vision';

const client = new Spot(API_KEY, API_SECRET, { baseURL: BASE_URL });

const adjustOrderBook = (orderBook: RestMarketTypes.orderBookResponse, direction: string): FormattedOrderBook => {
    if (direction == String(Direction.INVERTED)) {
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

// const executeSwap = async (quote: Quote): Promise<(Record<string, never> | RestTradeTypes.testNewOrderResponse)[]> => {
const executeSwap = async (quote: Quote) => {
    try {
        // const status: (Record<string, never> | RestTradeTypes.testNewOrderResponse )[] = [];
        const status = [];
        const quantity = quote.volume;

        for (const pair of quote.route.path) {

            const options: RestTradeTypes.testNewOrderOptions = {
                quantity: quantity
            };

            const side = utils.getSide(quote.operation, pair.direction);
            // const testOrder = await client.testNewOrder(pair.binancePair, side, OrderType.MARKET, options);
            const testOrder = await client.newOrder(pair.binancePair, side, OrderType.MARKET, options);

            status.push(testOrder);

            // update volume according to last price

        }

        console.log(status);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return status;
    }
    catch (err) {
        console.error(err);
        throw err;
    }
};

export default {
    getOrderBookProcessed,
    executeSwap
};
