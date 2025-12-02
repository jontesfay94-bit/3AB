
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

const BINANCE_BASE = 'https://api.binance.com/api/v3';

// --- API ROUTES ---

// 1. Price
app.get('/proxy/ticker', async (req, res) => {
    try {
        const { symbol } = req.query;
        const response = await axios.get(`${BINANCE_BASE}/ticker/price?symbol=${symbol}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Price fetch failed' });
    }
});

// 2. 24hr Stats
app.get('/proxy/24hr', async (req, res) => {
    try {
        const { symbol } = req.query;
        const response = await axios.get(`${BINANCE_BASE}/ticker/24hr?symbol=${symbol}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Stats fetch failed' });
    }
});

// 3. Klines (Candles)
app.get('/proxy/klines', async (req, res) => {
    try {
        const { symbol, interval, limit } = req.query;
        const response = await axios.get(`${BINANCE_BASE}/klines`, {
            params: { symbol, interval, limit: limit || 500 }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Kline fetch failed' });
    }
});

// 4. Order Book Depth (CRITICAL)
app.get('/proxy/depth', async (req, res) => {
    try {
        const { symbol, limit } = req.query;
        const response = await axios.get(`${BINANCE_BASE}/depth`, {
            params: { symbol, limit: limit || 50 }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Depth fetch failed' });
    }
});

// Fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




