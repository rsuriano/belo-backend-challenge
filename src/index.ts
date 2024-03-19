import dotenv from "dotenv";

import { app } from "./app";
import { connect_db } from "./utils/data-source";

dotenv.config();

// typeorm initialization
connect_db()
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
    console.log(`USERDB: ${process.env.DB_USER}`);
});

export default {
    app
};
