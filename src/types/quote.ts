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
    swap_uuid: string;
    estimated_price: number;
    expiration_seconds: number;
    expiration_date: number; //unix timestamp, now + expiration_seconds
}
