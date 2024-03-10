import dotenv from 'dotenv';
import express from 'express';

import swapRouter from './routes/swap-api';
import swapSettingsRouter from './routes/swap-settings';

dotenv.config();

const app = express();

app.use(express.json());

const PORT = 3000;

// app setup
app.use('/api', swapRouter);
app.use('/settings', swapSettingsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
