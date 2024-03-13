// saves and patches quotes to DB
import binanceSpot from "./binance-spot";
import { Route } from "../entity";
import { QuoteRequest, RouteEstimation, RouteSegment } from "../types/quote";
import pairDBService from "./pair-db-service";
import quoteDbService from "./quote-db-service";

const ORDER_BOOK_LIMITS = [100, 250, 700, 1900, 5000];

const estimatePairPrice = (quoteRequest: QuoteRequest) => async (lastSegment: RouteSegment, segment: RouteSegment): Promise<RouteSegment> => {
    try {
        // console.log(`Estimating price for pair ${segment.binancePair}, volume ${quoteRequest.volume}, ${quoteRequest.operation}`);

        if (!('volume' in lastSegment && 'price' in lastSegment)) {
            throw Error('Error in path price estimation');
        }

        const currentSegmentVolume = Number(lastSegment.volume) * Number(lastSegment.price);
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

                if (volume >= currentSegmentVolume) {
                    // console.log(`${segment.binancePair} - Matched volume at depth ${ORDER_BOOK_LIMITS[i]}`);
                    break liquidityCheck;
                }
            }

        }

        // throw error if there's no volume for estimation
        if (volume <= currentSegmentVolume) {
            const low_volume_msg = `Not enough volume in pair ${segment.binancePair}: ${volume}. try again with a lower volume`;
            console.error(low_volume_msg);
            throw Error(low_volume_msg);
        }

        // estimate price
        let priceAvg = orderBook.reduce(
            (prev, curr) => { return prev + Number(curr[0]); }, 0
        );
        priceAvg = priceAvg / orderBook.length;

        return {
            ...segment,
            volume: currentSegmentVolume,
            price: Number(lastSegment.price) * priceAvg
        };

    }
    catch (error: unknown) {
        console.error(error);
        throw error;
    }

};

const estimateRoutePrice = (quoteRequest: QuoteRequest) => async (route: Route): Promise<RouteEstimation> => {

    // calculate price for each segment in path
    const estimatePrice = estimatePairPrice(quoteRequest);

    let initialSegment: RouteSegment = { binancePair: 'ROOT', direction: 'DIRECT', volume: quoteRequest.volume, price: 1 };
    for (const segment of route.path) {
        initialSegment = await estimatePrice(initialSegment, segment);
    }

    return {
        route: route,
        price: Number(initialSegment.price)
    };
};

const getCheapestRoute = async (routes: Route[], quoteRequest: QuoteRequest): Promise<RouteEstimation> => {

    // calculate price for each route
    const estimatePrice = estimateRoutePrice(quoteRequest);

    const routePrices = await Promise.all(routes.map(estimatePrice));

    console.log(routePrices.map((item) => { return `${item.route.name}: ${item.price}`; }));

    // get cheapest route and return it
    const cheapestRoute = routePrices.reduce(
        (prev: RouteEstimation, curr: RouteEstimation) => {
            return curr.price < prev.price ? curr : prev;
        },
        routePrices[0]
    );

    console.log(`Cheapest route was ${cheapestRoute.route.name}: ${cheapestRoute.price}`);
    return cheapestRoute;
};

const createQuote = async (quoteRequest: QuoteRequest) => {

    // get pair's available routes
    const pair = await pairDBService.getPairByName(quoteRequest.pair);

    if (!pair) {
        throw Error("Pair not found");
    }

    // calculate price for all routes and return the cheapest
    const bestRoute = await getCheapestRoute(pair.routes, quoteRequest);

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
