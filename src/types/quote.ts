import { Route as RouteDB, Pair as PairDB } from "../entity";

export enum Operation {
    BUY = 'BUY',
    SELL = 'SELL',
}

export enum Direction {
    DIRECT = 'DIRECT',
    INVERTED = 'INVERTED',
}

export interface RouteSegment {
    binancePair: string;
    direction: Direction;
}

export interface PairResponse {
    pairs: string[];
}

export class QuoteRequest {
    pair: string;
    volume: number;
    operation: Operation;
}

export interface RouteEstimation {
    route: RouteDB;
    price: number;
}

export interface QuoteCreate {
    pair: PairDB;
    volume: number;
    operation: Operation;
    estimatedPrice: number;
    route: RouteDB;
    expirationSeconds: number;
}
export interface Quote extends QuoteCreate {
    uuid: string;
    createdAt: number;
    expiresAt: number; // now + expiration_seconds
}

export interface FormattedOrderBook {
    lastUpdateId: number;
    bids: number[][];
    asks: number[][];
}
