import express from 'express';

const router = express.Router();

router.get('/pairs', (_req, res) => {
    const pairs = [
        {
            "pair": "USDTETH",
            "fee": 1.5,
            "spread": 2
        },
        {
            "pair": "USDTBTC",
            "fee": 1.2,
            "spread": 1
        },
        {
            "pair": "USDCAAVE",
            "fee": 1.5,
            "spread": 2
        }
    ];
    res.send(pairs);
});

// router.patch('/fees_spread', (_req, res) => {
//     const newFeeSetting = _req.body;
//     res.send('Saving a diary!');
// });

export default router;
