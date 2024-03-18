import dotenv from "dotenv";

import { app } from "./app";
import { AppDataSource } from "./utils/data-source";

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
const PORT = Number(process.env.API_PORT ?? 3000);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default {
    app
};
