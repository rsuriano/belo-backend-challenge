import { Quote } from "./quote";
import { Quote as QuoteDB } from "../entity";

export class SwapRequest {
    quote_uuid: string;
}

export interface Swap extends Quote {
    finalPrice: number;
    fee: number;
    spread: number;
    fulfilled: boolean;
}

export interface SwapCreate {
    quote: QuoteDB,
    finalPrice: number,
    binanceFee: number,
    binanceResponse: object[]
}

export interface SwapResponse {
    swapUuid: string;
    status: boolean;
    message?: string;
}

export interface Order {
    price: number,
    qty: number,
    commission: number,
    commissionAsset: string,
    tradeId: number
}

export interface BinanceSwapResponse {
    symbol: string,
    orderId: number,
    orderListId: number,
    clientOrderId: string,
    transactTime: number,
    price?: number,
    origQty?: number,
    executedQty?: number,
    cummulativeQuoteQty?: number,
    status?: string,
    timeInForce?: string,
    type?: string,
    side?: string,
    workingTime?: number,
    fills?: Order[],
    selfTradePreventionMode?: string
}
