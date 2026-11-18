const db = require("../config/db").promise();

const SCENARIO_IDS = new Set([
    "sudden-fall",
    "good-results",
    "breakout",
    "rsi-75",
    "market-crash"
]);
const INSTRUMENTS = new Set([
    "RELIANCE",
    "TCS",
    "HDFCBANK",
    "ICICIBANK",
    "SBIN",
    "INFY",
    "LTIM",
    "BHARTIARTL",
    "SUNPHARMA",
    "TATAMOTORS",
    "ITC",
    "ASIANPAINT",
    "AXISBANK",
    "NTPC",
    "POWERGRID",
    "KOTAKBANK",
    "ULTRACEMCO",
    "INDUSINDBK",
    "MARUTI",
    "WIPRO"
]);
const TABLE_SQL = `CREATE TABLE IF NOT EXISTS learning_lab_state (
    user_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
    lab_progress LONGTEXT NOT NULL,
    paper_account LONGTEXT NOT NULL,
    completed_modules LONGTEXT NOT NULL,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
        ON UPDATE CURRENT_TIMESTAMP(3)
)`;

let tableReady;

function ensureTable() {
    if (!tableReady) {
        tableReady = db.query(TABLE_SQL).catch((error) => {
            tableReady = null;
            throw error;
        });
    }
    return tableReady;
}

function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isTimestamp(value) {
    return Number.isSafeInteger(value) && value >= 0;
}

function isNullablePositiveNumber(value) {
    return value === null || (Number.isFinite(value) && value > 0);
}

function sanitizeLabProgress(value) {
    if (!isRecord(value) || !isRecord(value.firstQuizResults) ||
        !Array.isArray(value.attempts) || !Array.isArray(value.mistakes) ||
        !isRecord(value.scenarioResults) ||
        !Number.isSafeInteger(value.replayIndex) || value.replayIndex < 0 || value.replayIndex > 21 ||
        !Number.isSafeInteger(value.replayCorrect) || value.replayCorrect < 0 ||
        !Number.isSafeInteger(value.replayTotal) || value.replayTotal < 0 ||
        typeof value.replayAwaitingNext !== "boolean" ||
        typeof value.replayFeedback !== "string" || value.replayFeedback.length > 500) {
        return null;
    }
    if (value.replayDataset !== undefined &&
        (typeof value.replayDataset !== "string" ||
            (value.replayDataset !== "" &&
                !/^[A-Z0-9^][A-Z0-9.^_-]{0,23}:(1mo|3mo|6mo|1y):\d{4}-\d{2}-\d{2}:\d{4}-\d{2}-\d{2}$/.test(value.replayDataset)))) {
        return null;
    }

    const quizEntries = Object.entries(value.firstQuizResults);
    if (quizEntries.length > 100 || quizEntries.some(([key, result]) =>
        key.length > 120 || !isRecord(result) || typeof result.correct !== "boolean" ||
        typeof result.topic !== "string" || result.topic.length > 80 || !isTimestamp(result.time))) {
        return null;
    }

    if (value.attempts.length > 200 || value.attempts.some((attempt) =>
        !isRecord(attempt) || !["knowledge", "chart", "decision", "risk"].includes(attempt.category) ||
        !Number.isInteger(attempt.score) || attempt.score < 0 || attempt.score > 100 ||
        typeof attempt.topic !== "string" || attempt.topic.length > 120 ||
        !isTimestamp(attempt.time) || typeof attempt.session !== "string" || attempt.session.length > 100)) {
        return null;
    }

    if (value.mistakes.length > 30 || value.mistakes.some((mistake) =>
        !isRecord(mistake) || typeof mistake.type !== "string" || mistake.type.length > 100 ||
        !Number.isSafeInteger(mistake.count) || mistake.count < 1 ||
        (mistake.lastAt !== undefined && !isTimestamp(mistake.lastAt)))) {
        return null;
    }

    const scenarioEntries = Object.entries(value.scenarioResults);
    if (scenarioEntries.length > SCENARIO_IDS.size || scenarioEntries.some(([id, result]) =>
        !SCENARIO_IDS.has(id) || !isRecord(result) ||
        !Number.isInteger(result.score) || result.score < 0 || result.score > 100 ||
        typeof result.feedback !== "string" || result.feedback.length > 500)) {
        return null;
    }

    return value;
}

function sanitizePaperAccount(value) {
    if (!isRecord(value) || !Number.isFinite(value.cash) || value.cash < 0 || value.cash > 100000000 ||
        !isRecord(value.holdings) || !Array.isArray(value.history) ||
        !Number.isSafeInteger(value.marketStep) || value.marketStep < 0 || value.marketStep > 8) {
        return null;
    }

    const holdingEntries = Object.entries(value.holdings);
    if (holdingEntries.length > INSTRUMENTS.size || holdingEntries.some(([symbol, holding]) =>
        !INSTRUMENTS.has(symbol) || !isRecord(holding) ||
        !Number.isSafeInteger(holding.quantity) || holding.quantity < 1 ||
        !Number.isFinite(holding.averageCost) || holding.averageCost <= 0 ||
        !isNullablePositiveNumber(holding.stopLoss) || !isNullablePositiveNumber(holding.target) ||
        typeof holding.reason !== "string" || holding.reason.length > 240)) {
        return null;
    }

    if (value.history.length > 30 || value.history.some((trade) =>
        !isRecord(trade) || !["BUY", "SELL"].includes(trade.side) ||
        !INSTRUMENTS.has(trade.symbol) || !Number.isSafeInteger(trade.quantity) || trade.quantity < 1 ||
        !Number.isFinite(trade.price) || trade.price <= 0 || !isTimestamp(trade.time) ||
        !isNullablePositiveNumber(trade.stopLoss) || !isNullablePositiveNumber(trade.target) ||
        typeof trade.reason !== "string" || trade.reason.length > 240 ||
        !(trade.pnl === null || Number.isFinite(trade.pnl)) ||
        typeof trade.outcome !== "string" || trade.outcome.length > 80)) {
        return null;
    }

    return value;
}

function sanitizeCompletedModules(value) {
    if (!Array.isArray(value) || value.length > 32 ||
        value.some((id) => typeof id !== "string" || !/^[a-z0-9-]{1,64}$/.test(id))) {
        return null;
    }
    return [...new Set(value)];
}

function parseStoredJson(value) {
    try {
        return JSON.parse(value);
    } catch (error) {
        console.error("Stored learning state contains invalid JSON", error);
        return null;
    }
}

function getUserId(req, res) {
    const userId = req.user && Number(req.user.id);
    if (!Number.isSafeInteger(userId) || userId < 1) {
        res.status(401).json({ success: false, message: "A valid signed-in user is required." });
        return null;
    }
    return userId;
}

async function getLearningState(req, res) {
    const userId = getUserId(req, res);
    if (!userId) return;

    try {
        await ensureTable();
        const [rows] = await db.execute(
            "SELECT lab_progress, paper_account, completed_modules, updated_at FROM learning_lab_state WHERE user_id = ?",
            [userId]
        );
        if (!rows.length) {
            return res.json({ success: true, state: null });
        }

        const row = rows[0];
        const state = {
            labProgress: parseStoredJson(row.lab_progress),
            paperAccount: parseStoredJson(row.paper_account),
            completedModules: parseStoredJson(row.completed_modules),
            updatedAt: new Date(row.updated_at).toISOString()
        };
        if (!sanitizeLabProgress(state.labProgress) || !sanitizePaperAccount(state.paperAccount) ||
            !sanitizeCompletedModules(state.completedModules)) {
            console.error(`Stored learning state failed validation for user ${userId}`);
            return res.status(500).json({ success: false, message: "Saved learning data is invalid and could not be loaded." });
        }
        return res.json({ success: true, state });
    } catch (error) {
        console.error("Unable to load learning state", error);
        return res.status(503).json({ success: false, message: "Learning progress storage is unavailable." });
    }
}

async function saveLearningState(req, res) {
    const userId = getUserId(req, res);
    if (!userId) return;

    const body = req.body;
    const labProgress = body && sanitizeLabProgress(body.labProgress);
    const paperAccount = body && sanitizePaperAccount(body.paperAccount);
    const completedModules = body && sanitizeCompletedModules(body.completedModules);
    if (!labProgress || !paperAccount || !completedModules) {
        return res.status(400).json({ success: false, message: "Learning data is incomplete or invalid." });
    }

    const serialized = {
        labProgress: JSON.stringify(labProgress),
        paperAccount: JSON.stringify(paperAccount),
        completedModules: JSON.stringify(completedModules)
    };
    const bytes = Buffer.byteLength(JSON.stringify(serialized), "utf8");
    if (bytes > 65536) {
        return res.status(413).json({ success: false, message: "Learning data exceeds the 64 KB limit." });
    }

    try {
        await ensureTable();
        await db.execute(
            `INSERT INTO learning_lab_state (user_id, lab_progress, paper_account, completed_modules)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                lab_progress = VALUES(lab_progress),
                paper_account = VALUES(paper_account),
                completed_modules = VALUES(completed_modules),
                updated_at = CURRENT_TIMESTAMP(3)`,
            [userId, serialized.labProgress, serialized.paperAccount, serialized.completedModules]
        );
        const [rows] = await db.execute(
            "SELECT updated_at FROM learning_lab_state WHERE user_id = ?",
            [userId]
        );
        return res.json({ success: true, updatedAt: new Date(rows[0].updated_at).toISOString() });
    } catch (error) {
        console.error("Unable to save learning state", error);
        return res.status(503).json({ success: false, message: "Learning progress could not be saved to the server." });
    }
}

module.exports = { getLearningState, saveLearningState };
