# TradeNova

TradeNova is a full-stack stock trading and investment dashboard built with a vanilla HTML/CSS/JavaScript frontend, an Express.js backend, MySQL, and JWT authentication.

## Features

- User registration and login with JWT authentication
- Wallet funding and balance tracking
- Stock browsing, search, filters, simulated price updates, and percentage changes
- Stock buy and sell flow with portfolio updates
- Portfolio summary, holdings, profit/loss, and chart
- Orders, watchlist, and activity history
- IPO listing and applications
- Mutual Funds, ETFs, Bonds, and F&O investment catalogs with wallet-backed demo investments
- Profile, password change, settings, dark mode, compact view, and animation preferences
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

3. Make sure the MySQL database `tradenova_db` exists and contains the tables used by the application.

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

Never commit `server/.env`, credentials, access tokens, or other secrets. The credentials previously embedded in source code should be considered exposed and rotated.

## Free deployment (Render + TiDB Cloud Starter)

The repository includes a Render Blueprint in `render.yaml`. It deploys the Express app and static frontend as one free web service. For a free MySQL-compatible database, TiDB Cloud Starter currently lists a no-cost monthly allowance. Both providers' free plans have limits; Render's free web service sleeps after 15 minutes without traffic, and its local filesystem is temporary. Uploaded files are therefore not durable.

1. Push the deployment changes to GitHub and sign in to [Render](https://dashboard.render.com/).
2. Create a free [TiDB Cloud Starter](https://tidbcloud.com/free-trial) cluster. Copy the connection host, port, username, password, and database name from its connection details; TiDB requires TLS.
3. In Render, select **New > Blueprint** and choose this GitHub repository. Review the `tradenova` web service and choose the Free plan.
4. Set the service variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` to the TiDB connection values, and set `DB_SSL=true`. Keep `NODE_ENV=production`; Render generates `JWT_SECRET` for the service.
5. Export your local `tradenova_db` schema/data and import it into TiDB. This repository does not contain a usable SQL schema or dump, so database-backed features will not work until your tables are imported.
6. Open the Render service URL and verify `/api/health` returns success. The first request after an idle period may take about a minute while the free service wakes.

Free-tier details can change; check the providers' [Render free-instance limits](https://render.com/docs/free) and [TiDB Cloud pricing](https://www.pingcap.com/tidb-cloud-pricing/) before using them. This demo simulates prices and trades and is not suitable for real investments or payments.

Use only a disposable/demo database for this prototype. It simulates prices and trades and is not suitable for handling real investments or payments.

## Repository

GitHub: https://github.com/arvindk123761/TradeNova
