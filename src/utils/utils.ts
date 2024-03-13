import { Side } from '@binance/connector-typescript';
import { Operation, Direction } from '../types/quote';

const getSide = (op: Operation, direction: Direction): Side => {

    if (direction == Direction.DIRECT) {
        return (op == Operation.BUY) ? Side.BUY : Side.SELL;
    }
    else {
        return (op == Operation.BUY) ? Side.SELL : Side.BUY;
    }

};

export default {
    getSide
};
