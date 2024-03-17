// separated app for testing
import express from "express";
import swapRouter from "./routes/swap-api";

const app = express();

app.get("/ping", (_req, res) => {
    res.status(200).send("pong");
});

// express setup
app.use("/api", swapRouter);

export { app };
