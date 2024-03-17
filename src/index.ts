import dotenv from "dotenv";
import express from "express";

import { AppDataSource } from "./utils/data-source";
import { app } from "./app";

dotenv.config();

// typeorm initialization
AppDataSource
    .initialize()
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.error("Error connecting to db:", err);
    });

// express setup
const PORT = 3000;
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default {
    app
};
