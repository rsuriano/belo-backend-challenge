import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Pair, Route, Quote, Swap } from "../entity";

dotenv.config();

let DB_HOST = process.env.RUN_MODE === "DOCKER" ? process.env.DB_HOST : "localhost";
DB_HOST = process.env.TEST === 'true' ? "localhost" : DB_HOST;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Pair, Route, Quote, Swap],
    migrations: [],
    subscribers: [],
});

export const connect_db = async () => {
    await AppDataSource.initialize();
};

export const disconnect_db = async () => {
    await AppDataSource.destroy();
};