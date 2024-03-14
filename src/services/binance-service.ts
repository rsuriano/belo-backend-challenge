// interfaces with binance
import { Spot, RestMarketTypes, OrderType, OrderStatus, RestTradeTypes } from '@binance/connector-typescript';
import { RouteSegment, Direction, Operation, FormattedOrderBook } from '../types/quote';
import { Quote } from '../entity';
import utils from '../utils/utils';
import { BinanceSwapResponse } from '../types/swap';

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

const executeSwap = async (quote: Quote): Promise<BinanceSwapResponse[]> => {
    try {
        const routeForLog = quote.route.path.map((item) => (`[${item.binancePair}(${item.direction})]`));
        console.log(`Starting to execute swap: ${quote.pair.name}: ${routeForLog.join('->')} ...`);

        const newOrders: BinanceSwapResponse[] = [];
        let quantity = quote.volume;

        // make swap for each segment in chosen route
        for (const pair of quote.route.path) {

            // set quantity and side
            const side = utils.getSide(quote.operation, pair.direction);
            const options: RestTradeTypes.testNewOrderOptions = {
                quoteOrderQty: quantity
            };

            console.log(`\tswap: ${pair.binancePair} -> ${quantity}...`);

            let newOrder = await client.newOrder(pair.binancePair, side, OrderType.MARKET, options);

            // repeat order if it failed
            // not handling partially filled orders at the moment, as it increases complexity for this project
            while (newOrder.status !== OrderStatus.FILLED) {
                newOrder = await client.newOrder(pair.binancePair, side, OrderType.MARKET, options);
            }

            // create order object for response
            const orderFills = (newOrder.fills ?? []).map(
                (fill) => ({
                    ...fill,
                    price: Number(fill.price),
                    qty: Number(fill.qty),
                    commission: Number(fill.commission)
                })
            );

            // create newOrder Object
            const newOrderFormatted = {
                ...newOrder,
                price: Number(newOrder.price),
                origQty: Number(newOrder.origQty),
                executedQty: Number(newOrder.executedQty),
                cummulativeQuoteQty: Number(newOrder.cummulativeQuoteQty),
                fills: orderFills
            };
            newOrders.push(newOrderFormatted);

            console.log(`\tfinished swap: ${JSON.stringify(newOrderFormatted)}`);

            // update volume according to this pair's price
            quantity = newOrderFormatted.cummulativeQuoteQty;

        }

        console.log(`Finished swaps: ${newOrders}`);
        return newOrders;
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
