// import utils from "./utils";
// import { QuoteRequest } from "../types/quote";

// const toQuoteRequest = (object: unknown): QuoteRequest => {

//     if (!object || typeof object !== 'object') {
//         throw new Error('Incorrect or missing data');
//     }

//     if ('pair' in object && 'volume' in object && 'operation' in object) {
//         const newQuote: QuoteRequest = {
//             pair: utils.parsePair(object.pair),
//             volume: utils.parseVolume(object.volume),
//             operation: utils.parseOperation(object.operation),
//         };

//         return newQuote;
//     }

//     throw new Error('Field missing');
// };


// export default {
//     toQuoteRequest
// };