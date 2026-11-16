const db = require("../config/db");

/* ==========================================
   DASHBOARD SUMMARY
========================================== */

exports.getDashboard = async (req, res) => {

    try {

        const userId = req.user.id;

        // Wallet
        const [wallet] = await db.promise().query(
            "SELECT balance FROM wallet WHERE user_id=?",
            [userId]
        );

        // Portfolio
        const [portfolio] = await db.promise().query(
            `SELECT
                p.stock_id,
                p.quantity,
                p.buy_price,
                s.current_price
            FROM portfolio p
            JOIN stocks s
            ON p.stock_id=s.id
            WHERE p.user_id=?`,
            [userId]
        );

        let investment = 0;
        let currentValue = 0;

        portfolio.forEach(stock => {

            investment += stock.quantity * stock.buy_price;

            currentValue += stock.quantity * stock.current_price;

        });

        const profit = currentValue - investment;

        res.json({

            success: true,

            summary: {

                wallet:

                    wallet.length
                        ? wallet[0].balance
                        : 0,

                investment,

                currentValue,

                profit,

                holdings: new Set(portfolio.map(stock => stock.stock_id)).size

            }

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Dashboard Error"

        });

    }

};

/* ==========================================
   MARKET OVERVIEW
========================================== */

exports.getMarketOverview = async (req, res) => {

    try {

        const [stocks] = await db.promise().query(

            `SELECT
                COUNT(*) AS totalStocks,
                AVG(current_price) AS averagePrice,
                MAX(current_price) AS highestPrice,
                MIN(current_price) AS lowestPrice
            FROM stocks`

        );

        res.json({

            success: true,

            overview: stocks[0]

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Market Overview Error"

        });

    }

};

/* ==========================================
   TOP GAINERS
========================================== */

exports.getTopGainers = async (req, res) => {

    try {

        const [stocks] = await db.promise().query(

            `SELECT
                id,
                symbol,
                company_name,
                current_price,
                percentage_change AS change_percent
            FROM stocks
            ORDER BY percentage_change DESC
            LIMIT 5`

        );

        res.json({

            success: true,

            gainers: stocks

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Top Gainers Error"

        });

    }

};

/* ==========================================
   TOP LOSERS
========================================== */

exports.getTopLosers = async (req, res) => {

    try {

        const [stocks] = await db.promise().query(

            `SELECT
                id,
                symbol,
                company_name,
                current_price,
                percentage_change AS change_percent
            FROM stocks
            ORDER BY percentage_change ASC
            LIMIT 5`

        );

        res.json({

            success: true,

            losers: stocks

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Top Losers Error"

        });

    }

};

/* ==========================================
   MARKET NEWS
========================================== */

const NEWS_CACHE_TTL_MS = 60 * 60 * 1000;
let newsCache = {
    expiresAt: 0,
    news: null
};
let newsRequest = null;

exports.getLatestNews = async (req, res) => {

    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (!apiKey) {
        return res.status(503).json({
            success: false,
            message: "Live news is not configured. Set ALPHA_VANTAGE_API_KEY on the server."
        });
    }

    if (newsCache.news && Date.now() < newsCache.expiresAt) {
        res.set("Cache-Control", "public, max-age=300");
        return res.json({ success: true, news: newsCache.news });
    }

    try {
        if (!newsRequest) {
            newsRequest = (async () => {
                const url = new URL("https://www.alphavantage.co/query");
                url.searchParams.set("function", "NEWS_SENTIMENT");
                url.searchParams.set("topics", "technology,financial_markets");
                url.searchParams.set("sort", "LATEST");
                url.searchParams.set("limit", "50");
                url.searchParams.set("apikey", apiKey);

                const response = await fetch(url, {
                    headers: { Accept: "application/json" },
                    signal: AbortSignal.timeout(10000)
                });

                if (!response.ok) {
                    throw new Error(`News provider returned HTTP ${response.status}`);
                }

                const data = await response.json();

                if (data["Error Message"] || data.Note || data.Information || !Array.isArray(data.feed)) {
                    throw new Error("News provider returned an invalid response or API limit message");
                }

                const news = data.feed
                    .filter(item => item && typeof item === "object")
                    .map(item => {
                        const articleUrl = typeof item.url === "string" ? item.url : "";
                        let parsedUrl;

                        try {
                            parsedUrl = new URL(articleUrl);
                        } catch {
                            return null;
                        }

                        if (!["http:", "https:"].includes(parsedUrl.protocol) || !item.title) {
                            return null;
                        }

                        const topics = Array.isArray(item.topics)
                            ? item.topics.map(topic => String(topic && topic.topic || "").toLowerCase())
                            : [];
                        const publishedAt = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/.exec(item.time_published || "");

                        return {
                            title: String(item.title),
                            source: String(item.source || "Publisher"),
                            url: parsedUrl.href,
                            publishedAt: publishedAt
                                ? `${publishedAt[1]}-${publishedAt[2]}-${publishedAt[3]}T${publishedAt[4]}:${publishedAt[5]}:${publishedAt[6]}Z`
                                : null,
                            category: topics.includes("technology") ? "Tech" : "Stocks"
                        };
                    })
                    .filter(Boolean);

                newsCache = {
                    expiresAt: Date.now() + NEWS_CACHE_TTL_MS,
                    news
                };

                return news;
            })();
        }

        const news = await newsRequest;

        res.set("Cache-Control", "public, max-age=300");
        return res.json({ success: true, news });
    } catch (err) {
        console.error("Live news request failed:", err.message);

        return res.status(502).json({
            success: false,
            message: "Live news is temporarily unavailable. Check the API key and provider quota, then try again."
        });
    } finally {
        newsRequest = null;
    }

};