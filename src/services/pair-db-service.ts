// gets pairs from DB
import { AppDataSource } from "../utils/data-source";

import { Pair } from "../entity";
import { PairResponse } from "../types/quote";

const getPairs = async (): Promise<PairResponse> => {
    const pairs = await AppDataSource.manager.find(Pair);
    console.log(pairs);
    return {
        pairs: pairs.map((pair) => pair.name)
    };
};

export default {
    getPairs
};
