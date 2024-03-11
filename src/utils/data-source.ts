import dotenv from 'dotenv';
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Pair, Route, Quote, Swap } from "../entity";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
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
