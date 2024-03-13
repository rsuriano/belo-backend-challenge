// saves and patches quotes to DB
import binanceSpot from "./binance-spot";
import { Route } from "../entity";
import { QuoteRequest, RouteEstimation, RouteSegment } from "../types/quote";
import pairDBService from "./pair-db-service";
import quoteDbService from "./quote-db-service";

const ORDER_BOOK_LIMITS = [100, 250, 700, 1900, 5000];

const estimatePairPrice = (quoteRequest: QuoteRequest) => async (segment: RouteSegment): Promise<number> => {
    try {
        console.log(`Estimating price for pair ${quoteRequest.pair}, volume ${quoteRequest.volume}, ${quoteRequest.operation}`);

        let orderBook: number[][] = [];
        let volume: number = 0;

        // check if volume is ok to estimate price, if not repeat process with a higher depth
        liquidityCheck: for (let i = 0; i < ORDER_BOOK_LIMITS.length; i++) {

            // get order book (only bid or ask side depending on operation)
            orderBook = await binanceSpot.getOrderBookProcessed(segment, quoteRequest.operation, ORDER_BOOK_LIMITS[i]);

            // check if volume is enough for estimation
            volume = 0;
            for (const item of orderBook) {
                volume += Number(item[1]);

                if (volume >= quoteRequest.volume) {
                    console.log(`Matched volume at depth ${ORDER_BOOK_LIMITS[i]}`);
                    break liquidityCheck;
                }
            }

        }

        // throw error if there's no volume for estimation
        if (volume <= quoteRequest.volume) {
            const low_volume_msg = `Not enough volume in market: ${volume}. try again with a lower volume`;
            console.error(low_volume_msg);
            throw Error(low_volume_msg);
        }

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
