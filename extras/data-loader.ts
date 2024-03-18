import * as fs from "fs";

import { AppDataSource } from "../src/utils/data-source";

import { Direction } from "../src/types/route";

import { Pair } from "../src/entity/Pair";
import { Route } from "../src/entity/Route";


interface RouteDataWithPairUUID {
    uuid: string;
    name: string;
    path: {
        binancePair: string;
        direction: Direction;
    }[];
    pair_uuid: string; // to link with pair during data load
    created_at: Date;
}


type LoadData = { pairs: Pair[], routes: RouteDataWithPairUUID[] };

async function readAndSaveData() {
    await AppDataSource.initialize();

    const pairRepository = AppDataSource.getRepository(Pair);
    const routeRepository = AppDataSource.getRepository(Route);

    const rawData = fs.readFileSync("extras/initial-data.json", "utf8");
    const data: LoadData = JSON.parse(rawData) as LoadData;

    // save pairs
    const pairs = data.pairs.map(pairData => pairRepository.create(pairData));
    await pairRepository.save(pairs);

    // save routes
    const routes = data.routes.map(routeData => {
        const route = routeRepository.create({
            ...routeData,
            pair: pairs.find(pair => pair.uuid === routeData.pair_uuid)
        });
        return route;
    });
    await routeRepository.save(routes);

    console.log("Pairs and Routes have been saved successfully.");
}

readAndSaveData().catch(error => {
    console.error("Failed to read and save data:", error);
});
