import { Side } from "@binance/connector-typescript";

import { Operation } from "../types/quote";
import { Direction } from "../types/route";

const getSide = (op: Operation | "BUY" | "SELL", direction: Direction): Side => {

    if (direction === Direction.DIRECT) {
        return (op === Operation.BUY) ? Side.BUY : Side.SELL;
    }
    else {
        return (op === Operation.BUY) ? Side.SELL : Side.BUY;
    }

};

const roundTwoDecimals = (num: number): number => {
    return Math.round(num * 100) / 100;
};

export default {
    getSide,
    roundTwoDecimals
};
