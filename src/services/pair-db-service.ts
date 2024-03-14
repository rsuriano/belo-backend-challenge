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
    const pair = await AppDataSource.manager
        .findOne(Pair,
            {
                where: { name: pairName },
                relations: ["routes"],
                order: {
                    routes: {
                        createdAt: "ASC"
                    }
                }
            }
        );

    return pair;
};

export default {
    getPairs,
    getPairByName
};
