const CACHE_TTL_MS = 15 * 60 * 1000;
const MAX_CACHE_ENTRIES = 50;
const MAX_PROVIDER_REQUESTS_PER_MINUTE = 30;
const ALLOWED_RANGES = new Set(["1mo", "3mo", "6mo", "1y"]);
const SYMBOL_PATTERN = /^[A-Z0-9^][A-Z0-9.^_-]{0,23}$/;
const historyCache = new Map();
const providerRequestCounts = new Map();

function isProviderRateLimited(clientAddress) {
    const now = Date.now();
    const windowStart = Math.floor(now / 60000) * 60000;
    for (const [key, request] of providerRequestCounts) {
        if (request.windowStart < windowStart) providerRequestCounts.delete(key);
    }

    const key = `${clientAddress}:${windowStart}`;
    const request = providerRequestCounts.get(key) || { windowStart, count: 0 };
    request.count += 1;
    providerRequestCounts.set(key, request);
    return request.count > MAX_PROVIDER_REQUESTS_PER_MINUTE;
}

function isValidCandle(candle) {
    return candle && /^\d{4}-\d{2}-\d{2}$/.test(candle.date) &&
        Number.isFinite(candle.open) && candle.open > 0 &&
        Number.isFinite(candle.high) && candle.high > 0 &&
        Number.isFinite(candle.low) && candle.low > 0 &&
        Number.isFinite(candle.close) && candle.close > 0 &&
        Number.isFinite(candle.volume) && candle.volume >= 0 &&
        candle.high >= Math.max(candle.open, candle.close) &&
        candle.low <= Math.min(candle.open, candle.close) &&
        candle.high >= candle.low;
}

function trimCache() {
    while (historyCache.size > MAX_CACHE_ENTRIES) {
        historyCache.delete(historyCache.keys().next().value);
    }
}

async function getMarketHistory(req, res) {
    const symbol = typeof req.query.symbol === "string" ? req.query.symbol.trim().toUpperCase() : "";
    const range = typeof req.query.range === "string" ? req.query.range : "3mo";
    if (!SYMBOL_PATTERN.test(symbol) || !ALLOWED_RANGES.has(range)) {
        return res.status(400).json({
            success: false,
            message: "Enter a valid Yahoo Finance symbol and choose 1mo, 3mo, 6mo or 1y."
        });
    }

    const cacheKey = `${symbol}:${range}`;
    const cached = historyCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
        historyCache.delete(cacheKey);
        historyCache.set(cacheKey, cached);
        return res.json(cached.data);
    }
    if (cached) historyCache.delete(cacheKey);

    const clientAddress = req.ip || (req.socket && req.socket.remoteAddress) || "unknown";
    if (isProviderRateLimited(clientAddress)) {
        res.set("Retry-After", "60");
        return res.status(429).json({
            success: false,
            message: "Too many new history requests. Wait a minute before trying again."
        });
    }

    const url = new URL(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`
    );
    url.searchParams.set("range", range);
    url.searchParams.set("interval", "1d");
    url.searchParams.set("events", "div,splits");

    try {
        const response = await fetch(url, {
            headers: { "User-Agent": "TradeNova-Learning-Lab/1.0" },
            signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) {
            return res.status(502).json({
                success: false,
                message: response.status === 404
                    ? "The market-data provider could not find this symbol."
                    : `The market-data provider is unavailable (${response.status}).`
            });
        }

        const payload = await response.json();
        const result = payload && payload.chart && Array.isArray(payload.chart.result)
            ? payload.chart.result[0] : null;
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No daily history was found. Check the symbol and try again."
            });
        }

        const timestamps = Array.isArray(result.timestamp) ? result.timestamp : [];
        const quote = result.indicators && Array.isArray(result.indicators.quote)
            ? result.indicators.quote[0] : null;
        const candles = timestamps.map((timestamp, index) => {
            if (!Number.isFinite(timestamp)) return null;
            const candle = {
                date: new Date(timestamp * 1000).toISOString().slice(0, 10),
                open: quote && quote.open && quote.open[index],
                high: quote && quote.high && quote.high[index],
                low: quote && quote.low && quote.low[index],
                close: quote && quote.close && quote.close[index],
                volume: quote && quote.volume && quote.volume[index]
            };
            if (!Number.isFinite(candle.volume) || candle.volume < 0) candle.volume = 0;
            return candle;
        }).filter(isValidCandle).slice(-253);

        if (candles.length < 7) {
            return res.status(404).json({
                success: false,
                message: "There are not enough daily candles for a replay with this symbol."
            });
        }

        const data = {
            success: true,
            symbol: result.meta && result.meta.symbol ? result.meta.symbol : symbol,
            name: result.meta && (result.meta.longName || result.meta.shortName)
                ? (result.meta.longName || result.meta.shortName) : symbol,
            exchange: result.meta && result.meta.exchangeName ? result.meta.exchangeName : "",
            currency: result.meta && result.meta.currency ? result.meta.currency : "",
            range,
            source: "Yahoo Finance",
            candles
        };
        historyCache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
        trimCache();
        return res.json(data);
    } catch (error) {
        console.error("Unable to load daily market history", error);
        return res.status(502).json({
            success: false,
            message: error.name === "TimeoutError"
                ? "The market-data request timed out. Please try again."
                : "Historical market data is temporarily unavailable. Please try again."
        });
    }
}

module.exports = { getMarketHistory };
