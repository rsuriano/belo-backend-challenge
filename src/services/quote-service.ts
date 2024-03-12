// saves and patches quotes to DB
import binanceSpot from "./binance-spot";
import { Route } from "../entity";
import { QuoteRequest, Operation, RouteEstimation, RouteSegment, Direction } from "../types/quote";
import pairDBService from "./pair-db-service";
import quoteDbService from "./quote-db-service";

const estimatePairPrice = (quoteRequest: QuoteRequest) => async (pair: RouteSegment): Promise<number> => {
    try {

        // get order book for pair
        const fullOrderBook = await binanceSpot.getOrderBook(pair.binancePair);
        let orderBook: string[][];

        if (pair.direction == Direction.DIRECT) {
            orderBook = (quoteRequest.operation == Operation.BUY) ?
                fullOrderBook.asks : fullOrderBook.bids;
        }
        else { // invert direction if needed
            orderBook = (quoteRequest.operation == Operation.BUY) ?
                fullOrderBook.bids : fullOrderBook.asks;
        }


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

        return priceAvg;

    }
    catch (error: unknown) {
        console.error(error);
        throw error;
    }

};

const estimatePathPrice = (quoteRequest: QuoteRequest) => async (route: Route): Promise<RouteEstimation> => {

    // calculate price for each segment in path
    const estimatePrice = estimatePairPrice(quoteRequest);

    const pairPrices = await Promise.all(route.path.map(estimatePrice));

    pairPrices.reduce((prev, curr) => { return prev * Number(curr); }, 1);

    return {
        route: route,
        price: pairPrices[0]
    };
};

const estimateRoutePrice = async (routes: Route[], quoteRequest: QuoteRequest): Promise<RouteEstimation> => {

    // calculate price for each route
    const estimatePrice = estimatePathPrice(quoteRequest);

    const routePrices = await Promise.all(routes.map(estimatePrice));

    // get cheapest route and return it
    routePrices.reduce(
        (prev: RouteEstimation, curr: RouteEstimation) => {
            return curr.price < prev.price ? curr : prev;
        },
        routePrices[0]
    );

    return routePrices[0];
};

const createQuote = async (quoteRequest: QuoteRequest) => {

    // get pair's available routes
    const pair = await pairDBService.getPairByName(quoteRequest.pair);

    if (!pair) {
        throw Error("Pair not found");
    }

    // calculate price for all routes and return the cheapest
    const bestRoute = await estimateRoutePrice(pair.routes, quoteRequest);

    // TODO: add fee and spread
    // let priceWithFees = priceAvg + fee + spread

    // assemble newQuote object
    const newQuote = {
        pair: pair,
        volume: quoteRequest.volume,
        operation: quoteRequest.operation,
        route: bestRoute.route,
        estimatedPrice: bestRoute.price,
        expirationSeconds: Number(process.env.EXPIRATION_TIME)
    };

    // save to DB
    const newDBquote = quoteDbService.createQuote(newQuote);

    return newDBquote;
};

export default {
    createQuote
};
