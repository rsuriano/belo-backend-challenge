import { Spot, RestMarketTypes, OrderType, OrderStatus, RestTradeTypes } from "@binance/connector-typescript";

import { Operation, FormattedOrderBook } from "../types/quote";
import { RouteSegment, Direction } from "../types/route";
import { BinanceSwapResponse } from "../types/swap";

import { Quote } from "../entity";
import utils from "../utils/utils";


const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_SECRET_KEY;
const BASE_URL = process.env.BINANCE_URL;

const client = new Spot(API_KEY, API_SECRET, { baseURL: BASE_URL });

const adjustOrderBook = (orderBook: RestMarketTypes.orderBookResponse, direction: string): FormattedOrderBook => {
    if (direction === String(Direction.INVERTED)) {
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

    const fullOrderBook = await getOrderBook(segment.binancePair, limit);

    const processedOrderBook = adjustOrderBook(fullOrderBook, segment.direction);

    const orderBook = (operation === Operation.BUY) ? processedOrderBook.asks : processedOrderBook.bids;

    return orderBook;
};

const executeSwap = async (quote: Quote): Promise<BinanceSwapResponse[]> => {
    try {
        const routeForLog = quote.route.path.map((item) => (`[${item.binancePair}(${item.direction})]`));
        console.debug(`Starting to execute swap: ${quote.pair.name}: ${routeForLog.join("->")} ...`);

        const newOrders: BinanceSwapResponse[] = [];
        let quantity = quote.volume;

        for (const pair of quote.route.path) {

            // set quantity and side
            const side = utils.getSide(quote.operation, pair.direction);
            const options: RestTradeTypes.testNewOrderOptions = {
                quantity: quantity < 1 ? quantity : Math.ceil(quantity)
            };

            console.debug(`\tswap: ${pair.binancePair} -> ${quantity}...`);


            let newOrder = await client.newOrder(pair.binancePair, side, OrderType.MARKET, options);
            // TODO: 
            //      -> check for limits using exchange info endpoint and parsing for pair:
            // 
            //      Filter failure: NOTIONAL
            //      Filter failure: LOT_SIZE
            //
            //      -> check for balances using account info endpoint
            //

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

            console.debug(`\tfinished swap: ${JSON.stringify(newOrderFormatted)}`);

            // update volume according to this pair"s price
            quantity = newOrderFormatted.cummulativeQuoteQty;

        }

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
