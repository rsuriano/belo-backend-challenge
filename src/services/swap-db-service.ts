/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// database connector
import { AppDataSource } from "../utils/data-source";

import { SwapCreate } from "../types/swap";
import { Swap } from '../entity';

const entityManager = AppDataSource.manager;

const createSwap = async (newSwap: SwapCreate) => {
    const swap = entityManager.create(
        Swap, { ...newSwap }
    );

    await entityManager.save(Swap, swap);
    return swap;
};

export default {
    createSwap
};
