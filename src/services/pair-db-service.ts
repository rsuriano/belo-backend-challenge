// gets pairs from DB
import { AppDataSource } from "../utils/data-source";

import { Pair } from "../entity";
import { PairResponse } from "../types/quote";

const getPairs = async (): Promise<PairResponse> => {
    const pairs = await AppDataSource.manager.find(Pair.name);
    return {
        pairs: pairs as unknown as string[]
    };
};

const getPairByName = async (pairName: string): Promise<Pair | null> => {
    const pair = await AppDataSource.manager.findOneBy(Pair, {
        name: pairName,
    });

    return pair;
};

export default {
    getPairs,
    getPairByName
};
