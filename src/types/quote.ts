import { Route as RouteDB, Pair as PairDB } from "../entity";

export type Pair = string;

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
    direction: 'DIRECT' | 'INVERTED';
}

export interface PairResponse {
    pairs: Pair[];
}

export class QuoteRequest {
    pair: string;
    volume: number;
    operation: Operation;
}

export interface RouteEstimation {
    route: RouteDB,
    price: number
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
