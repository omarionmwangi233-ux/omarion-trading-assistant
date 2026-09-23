const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;

app.get("/api/gold", async (req, res) => {
    try {
        const url =
            "https://api.twelvedata.com/time_series" +
            "?symbol=XAUUSD" +
            "&interval=1min" +
            "&format=JSON" +
            "&apikey=" + TWELVE_DATA_API_KEY;

        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        res.status(500).json({
            error: "Failed to get Gold market data"
        });
    }
});

app.get("/", (req, res) => {
    res.send("Omarion Trading Assistant API is running.");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});