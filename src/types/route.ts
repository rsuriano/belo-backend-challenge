import { Route as RouteDB } from "../entity";

export enum Direction {
    DIRECT = "DIRECT",
    INVERTED = "INVERTED",
}

export interface RouteSegment {
    binancePair: string;
    direction: Direction;
    volume?: number,
    price?: number
}

export interface RouteEstimation {
    route: RouteDB;
    price: number;
}
