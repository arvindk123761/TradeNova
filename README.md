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

2. Configure the MySQL connection in `server/config/db.js` or move those values into environment configuration.

3. Make sure the MySQL database `tradenova_db` exists and contains the tables used by the application.

4. Start the backend:

   ```powershell
   cd server
   npm start
   ```

   The API runs at `http://localhost:5000`.

5. Open `clients/index.html` in a browser. Register a user, log in, add wallet funds, and test the trading modules.

## Development

```powershell
cd server
npm run dev
```

Do not run npm commands from the repository root; the package file is inside `server`.

## Important Notes

This is a final-year project prototype. Stock prices are simulated, and the investment categories are demo catalog data. It is not connected to a live exchange, broker, payment gateway, or production settlement system.

Never commit `server/.env`, credentials, access tokens, or other secrets.

## Repository

GitHub: https://github.com/arvindk123761/TradeNova
