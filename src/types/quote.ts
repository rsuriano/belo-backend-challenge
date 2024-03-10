export type Pair = string;

export enum Operation {
    BUY = 'BUY',
    SELL = 'SELL',
}

export interface PairResponse {
    pairs: Pair[];
}

export interface QuoteRequest {
    pair: string;
    volume: number;
    operation: Operation;
}

export interface Quote extends QuoteRequest {
    swapUuid: string;
    estimatedPrice: number;
    expirationSeconds: number;
    expirationDate: number; //unix timestamp, now + expiration_seconds
}
