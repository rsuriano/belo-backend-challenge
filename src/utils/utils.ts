import { Pair, Operation } from '../types/quote';

const isString = (data: unknown): data is string => {
    return typeof data === 'string' || data instanceof String;
};

const isNumber = (data: unknown): data is number => {
    return typeof data === 'number' || data instanceof Number;
};

const isOperation = (data: string): data is Operation => {
    return Object.values(Operation).map(v => v.toString()).includes(data);
};

const parsePair = (pair: unknown): Pair => {
    if (!pair || !isString(pair)) {
        throw new Error('Incorrect or missing pair');
    }

    return pair;
};

const parseVolume = (volume: unknown): number => {
    if (!volume || !isNumber(volume)) {
        throw new Error('Incorrect or missing volume');
    }

    return volume;
};

const parseOperation = (operation: unknown): Operation => {
    if (!operation || !isString(operation) || !isOperation(operation)) {
        throw new Error('Incorrect or missing operation');
    }

    return operation;
};

export default {
    parsePair,
    parseVolume,
    parseOperation
};
