const db = require("../config/db");

const demoIPOData = [
    { key: "nova-mobility", company_name: "Nova Mobility", sector: "Electric Mobility", price: 142, lot_size: 100, issue_size: 840, open_in: 0, close_in: 3, list_in: 8 },
    { key: "greengrid-energy", company_name: "GreenGrid Energy", sector: "Renewable Energy", price: 218, lot_size: 60, issue_size: 1250, open_in: 5, close_in: 8, list_in: 13 },
    { key: "finleaf-technologies", company_name: "FinLeaf Technologies", sector: "Financial Technology", price: 365, lot_size: 40, issue_size: 980, open_in: 11, close_in: 14, list_in: 19 },
    { key: "skyline-retail", company_name: "Skyline Retail", sector: "Retail", price: 176, lot_size: 80, issue_size: 620, open_in: 18, close_in: 21, list_in: 26 },
    { key: "aster-health", company_name: "Aster Health Systems", sector: "Healthcare", price: 294, lot_size: 50, issue_size: 760, open_in: 25, close_in: 28, list_in: 33 },
    { key: "cloudcove-digital", company_name: "CloudCove Digital", sector: "Information Technology", price: 486, lot_size: 30, issue_size: 1480, open_in: 32, close_in: 35, list_in: 40 },
    { key: "urbannest-living", company_name: "UrbanNest Living", sector: "Consumer & Housing", price: 128, lot_size: 120, issue_size: 540, open_in: 39, close_in: 42, list_in: 47 },
    { key: "prism-foods", company_name: "Prism Foods", sector: "Food & Beverages", price: 205, lot_size: 70, issue_size: 690, open_in: 46, close_in: 49, list_in: 54 }
];

const ensureDemoApplicationsTable = () => db.promise().query(`
    CREATE TABLE IF NOT EXISTS ipo_demo_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        ipo_id VARCHAR(80) NOT NULL,
        company_name VARCHAR(150) NOT NULL,
        sector VARCHAR(100) NOT NULL,
        price DECIMAL(12,2) NOT NULL,
        lot_size INT NOT NULL,
        lots INT NOT NULL,
        amount DECIMAL(14,2) NOT NULL,
        application_status VARCHAR(40) NOT NULL DEFAULT 'Submitted',
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_demo_ipo (user_id, ipo_id),
        INDEX (user_id)
    )
`);

const addDays = (days) => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
};

const getDemoIPOs = () => demoIPOData.map((ipo) => {
    const openDate = addDays(ipo.open_in);
    const closeDate = addDays(ipo.close_in);
    const listingDate = addDays(ipo.list_in);
    const today = addDays(0);
    const status = today < openDate ? "Upcoming" : today > closeDate ? "Closed" : "Active";

    return {
        id: `demo-${ipo.key}`,
        company_name: ipo.company_name,
        sector: ipo.sector,
        price: ipo.price,
        price_band: `₹${ipo.price.toLocaleString("en-IN")}`,
        lot_size: ipo.lot_size,
        issue_size: ipo.issue_size,
        open_date: openDate,
        close_date: closeDate,
        listing_date: listingDate,
        status,
        is_demo: true
    };
});

const resolvePrice = (ipo) => {
    const price = Number(ipo.price);
    if (Number.isFinite(price) && price > 0) return price;

    const band = String(ipo.price_band || "").match(/[\d,.]+/g);
    if (!band || !band.length) return 0;
    return Number(band[band.length - 1].replace(/,/g, ""));
};

const resolveStatus = (ipo) => {
    const today = addDays(0);
    const openDate = ipo.open_date ? String(ipo.open_date).slice(0, 10) : "";
    const closeDate = ipo.close_date ? String(ipo.close_date).slice(0, 10) : "";

    if (closeDate && closeDate < today) return "Closed";
    if (openDate && openDate > today) return "Upcoming";
    if (openDate && closeDate) return "Active";

    const status = String(ipo.status || "").toLowerCase();
    if (status === "active" || status === "open") return "Active";
    if (status === "upcoming") return "Upcoming";
    return "Closed";
};

const getIPOs = async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM ipo ORDER BY id DESC");
        const ipos = rows.map((ipo) => ({ ...ipo, status: resolveStatus(ipo), is_demo: false }));
        const allIPOs = [...getDemoIPOs(), ...ipos];
        const order = { Active: 0, Upcoming: 1, Closed: 2 };
        allIPOs.sort((a, b) => order[a.status] - order[b.status]
            || String(a.open_date || "").localeCompare(String(b.open_date || "")));

        res.json({ success: true, ipos: allIPOs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getApplications = async (req, res) => {
    try {
        await ensureDemoApplicationsTable();
        const [existingApplications] = await db.promise().query(
            `SELECT applications.*, ipo.company_name AS company_name, ipo.sector AS sector,
                    ipo.price AS price, ipo.lot_size AS lot_size, ipo.open_date AS open_date,
                    ipo.close_date AS close_date, ipo.status AS ipo_status
             FROM ipo_applications AS applications
             INNER JOIN ipo ON ipo.id = applications.ipo_id
             WHERE applications.user_id = ?
             ORDER BY applications.id DESC`,
            [req.user.id]
        );
        const [demoApplications] = await db.promise().query(
            `SELECT id AS application_id, ipo_id, company_name, sector, price, lot_size,
                    lots, amount, application_status, applied_at
             FROM ipo_demo_applications
             WHERE user_id = ?
             ORDER BY applied_at DESC`,
            [req.user.id]
        );

        const applications = [
            ...existingApplications.map((application) => ({
                ...application,
                application_status: "Submitted",
                is_demo: false
            })),
            ...demoApplications.map((application) => ({ ...application, is_demo: true }))
        ];
        res.json({ success: true, applications });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const applyIPO = async (req, res) => {
    const lots = Number(req.body.lots);
    const ipoId = String(req.body.ipo_id || "");

    if (!ipoId || !Number.isInteger(lots) || lots < 1) {
        return res.status(400).json({ success: false, message: "Choose an IPO and enter a valid number of lots" });
    }

    try {
        if (ipoId.startsWith("demo-")) {
            const ipo = getDemoIPOs().find((item) => item.id === ipoId);
            if (!ipo) return res.status(404).json({ success: false, message: "IPO not found" });
            if (ipo.status !== "Active") {
                return res.status(400).json({ success: false, message: "Applications are available only while the IPO is open" });
            }

            await ensureDemoApplicationsTable();
            const [existing] = await db.promise().query(
                "SELECT id FROM ipo_demo_applications WHERE user_id = ? AND ipo_id = ?",
                [req.user.id, ipoId]
            );
            if (existing.length) {
                return res.status(409).json({ success: false, message: "You have already applied for this IPO" });
            }

            const amount = ipo.price * ipo.lot_size * lots;
            await db.promise().query(
                `INSERT INTO ipo_demo_applications
                 (user_id, ipo_id, company_name, sector, price, lot_size, lots, amount)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [req.user.id, ipoId, ipo.company_name, ipo.sector, ipo.price, ipo.lot_size, lots, amount]
            );

            return res.json({
                success: true,
                message: "Demo IPO application submitted",
                application: { ipo_id: ipoId, lots, amount, application_status: "Submitted" }
            });
        }

        const numericIPOId = Number(ipoId);
        if (!Number.isInteger(numericIPOId) || numericIPOId < 1) {
            return res.status(400).json({ success: false, message: "Choose a valid IPO" });
        }

        const [rows] = await db.promise().query("SELECT * FROM ipo WHERE id = ?", [numericIPOId]);
        if (!rows.length) return res.status(404).json({ success: false, message: "IPO not found" });

        const ipo = rows[0];
        if (resolveStatus(ipo) !== "Active") {
            return res.status(400).json({ success: false, message: "Applications are available only while the IPO is open" });
        }

        const price = resolvePrice(ipo);
        const lotSize = Number(ipo.lot_size);
        if (!price || !Number.isInteger(lotSize) || lotSize < 1) {
            return res.status(400).json({ success: false, message: "This IPO is missing valid price or lot-size details" });
        }

        const amount = price * lotSize * lots;
        const [result] = await db.promise().query(
            `INSERT INTO ipo_applications (user_id, ipo_id, lots, amount)
             VALUES (?, ?, ?, ?)`,
            [req.user.id, numericIPOId, lots, amount]
        );

        res.json({
            success: true,
            message: "IPO application submitted",
            application: { id: result.insertId, ipo_id: numericIPOId, lots, amount, application_status: "Submitted" }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getIPOs,
    getApplications,
    applyIPO
};
