// separated app for testing
import express from "express";
import swapRouter from "./routes/swap-api";

const app = express();
app.use(express.json());

app.get("/ping", (_req, res) => {
    res.status(200).json("pong");
});

// express setup
app.use("/api", swapRouter);

export { app };
