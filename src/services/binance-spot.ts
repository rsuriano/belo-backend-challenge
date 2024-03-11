// interfaces with binance
import { Spot, RestMarketTypes } from '@binance/connector-typescript';
import { Pair } from '../types/quote';

const API_KEY = process.env.BINANCE_API_KEY;
const API_SECRET = process.env.BINANCE_SECRET_KEY;
const BASE_URL = 'https://testnet.binance.vision';

const client = new Spot(API_KEY, API_SECRET, { baseURL: BASE_URL });

const getOrderBook = async (pair: Pair, limit: number = 100): Promise<RestMarketTypes.orderBookResponse> => {

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


// const executeSwap = () => {
//     ...
// };

export default {
    getOrderBook
};
