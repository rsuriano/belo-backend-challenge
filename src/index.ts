import dotenv from 'dotenv';
import express from 'express';

import swapRouter from './routes/swap-api';
import { AppDataSource } from "./utils/data-source";

dotenv.config();

// express setup
const PORT = 3000;
const app = express();
app.use(express.json());


AppDataSource.initialize().then(() => {
    console.log('Database connected successfully.');

    // express setup
    app.use('/api', swapRouter);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}).catch(error => console.log(error));
