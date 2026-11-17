# TradeNova

TradeNova is a full-stack stock trading and investment dashboard built with a vanilla HTML/CSS/JavaScript frontend, an Express.js backend, MySQL, and JWT authentication.

## Features

- User registration and login with JWT authentication
- Wallet funding and balance tracking
- Stock browsing, search, filters, simulated price updates, and percentage changes
- Stock buy and sell flow with portfolio updates
- Portfolio summary, holdings, profit/loss, and a Day/Week/Month/Year performance chart with five-minute history snapshots and five-second current-value refreshes
- Orders, watchlist, and activity history
- Market Signals section with day/week/month simulated-chart trend indicators, transparent signal criteria, and a neutral option when signals conflict
- IPO listings with offer dates, lot sizes, simulated demo applications, and per-user application history
- Mutual Fund simulated NAVs, wallet-backed unit purchases, portfolio valuation, and partial/full unit selling
- Learning academy with 16 lessons and quizzes, chart and indicator exercises, candle replay, market scenarios, virtual trading journal, performance-based recommendations, and per-user progress sync
- Profile and password change
- Authenticated admin stock management routes

## Requirements

- Node.js 18+
- MySQL

## Setup

1. Install backend dependencies:

   ```powershell
   cd server
   npm install
   ```

2. Copy `server/.env.example` to `server/.env` and set your local MySQL credentials and a long random `JWT_SECRET`.

3. Make sure the MySQL database `tradenova_db` exists. On startup, the server creates the required tables and adds a small demo stock catalog only when the stocks table is empty.

4. Start the backend:

   ```powershell
   cd server
   npm start
   ```

   The API runs at `http://localhost:5000`.

5. Open `http://localhost:5000` in a browser. The Express server serves the frontend and API from the same origin.

## Development

```powershell
cd server
npm run dev
```

Do not run npm commands from the repository root; the package file is inside `server`.

## Important Notes

This is a final-year project prototype. Stock prices are simulated, and the investment categories are demo catalog data. It is not connected to a live exchange, broker, payment gateway, or production settlement system.

Signed-in learning progress and virtual-trading accounts sync to the authenticated user through `GET`/`PUT /api/learning/state`; the `learning_lab_state` table is created automatically on first use. A browser-local copy remains available if the API is temporarily unreachable. Guest progress stays in that browser.

The learning replay can load daily historical candles through `GET /api/learning/market-history` from Yahoo Finance's free chart endpoint; no API key is required. Enter a Yahoo ticker such as `RELIANCE.NS`, `TCS.NS`, or `AAPL`, choose a period, and load the most recent candles. The provider endpoint is unofficial, may be delayed or rate-limited, and can change without notice; this is for education, not live trading or investment decisions. The last 22 candles are cached in the browser. On another device, load the same symbol and period again to resume. The built-in synthetic replay remains available when the provider is unreachable.

Paper-trading prices and sample instruments remain illustrative simulations. The learning lab does not provide live quotes or broker connectivity.

The Market Signals page analyzes the same illustrative price series shown in stock details. Its bullish/bearish labels are educational, rule-based signals—not live market analysis, investment advice, or a promise of future performance.

Never commit `server/.env`, credentials, access tokens, or other secrets. The credentials previously embedded in source code should be considered exposed and rotated.

## Render deployment

The repository includes a Render Blueprint in `render.yaml`. It deploys the Express app and static frontend as one web service. Render does not provision a MySQL database for this app, so provide a separate MySQL-compatible database (for example, TiDB Cloud) and use the database provider's current connection and network-access requirements. Free plans and limits can change; Render's free web service sleeps after inactivity and its local filesystem is temporary.

1. Push the deployment changes to GitHub and sign in to [Render](https://dashboard.render.com/).
2. Create a MySQL-compatible database and an empty database/schema for TradeNova. Keep the provider's host, port, username, password, and database name private.
3. In Render, select **New > Blueprint** and choose this GitHub repository. Review the `tradenova` web service and select an available plan.
4. Set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` to the provider's connection values. The database user needs `SELECT`, `INSERT`, `UPDATE`, `DELETE`, and `CREATE` privileges on `DB_NAME` because startup creates the migration table and any missing application tables. The Blueprint defaults `DB_SSL=true`; change it only if your provider does not support TLS. Keep `NODE_ENV=production`; Render generates `JWT_SECRET`.
5. Deploy. The server verifies its DB connection and creates the required tables before listening; it seeds four clearly labeled demo stocks only when the stocks table is empty. The local database's users and records are not copied automatically.
6. Open the Render service URL and verify `/api/health` returns success. A fresh database is ready for registration after schema initialization.

Keep database network access restricted to the hosting provider's supported outbound access where possible. Never put production credentials in GitHub or in `server/.env.example`. The previously committed credential should be considered exposed and rotated.

This project simulates prices and trades and is not suitable for real investments or payments. Use only a disposable/demo database.

## Repository

GitHub: https://github.com/arvindk123761/TradeNova
