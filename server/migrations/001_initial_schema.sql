CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(30) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    wallet DECIMAL(14,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS wallet (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    balance DECIMAL(14,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_wallet_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS stocks (
    id INT NOT NULL AUTO_INCREMENT,
    symbol VARCHAR(20) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    current_price DECIMAL(14,2) NOT NULL DEFAULT 0,
    open_price DECIMAL(14,2) NOT NULL DEFAULT 0,
    high_price DECIMAL(14,2) NOT NULL DEFAULT 0,
    low_price DECIMAL(14,2) NOT NULL DEFAULT 0,
    volume BIGINT NOT NULL DEFAULT 0,
    market_cap VARCHAR(50) NULL,
    pe_ratio DECIMAL(10,2) NULL,
    previous_price DECIMAL(14,2) NOT NULL DEFAULT 0,
    percentage_change DECIMAL(8,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE KEY uq_stocks_symbol (symbol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS portfolio (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    stock_id INT NOT NULL,
    quantity INT NOT NULL,
    buy_price DECIMAL(14,2) NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_portfolio_user (user_id),
    INDEX idx_portfolio_stock (stock_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    stock_id INT NOT NULL,
    order_type VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(14,2) NOT NULL,
    total_amount DECIMAL(16,2) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_stock (stock_id),
    INDEX idx_orders_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS transactions (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(16,2) NOT NULL,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_transactions_user (user_id),
    INDEX idx_transactions_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS watchlist (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    stock_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_watchlist_user_stock (user_id, stock_id),
    INDEX idx_watchlist_stock (stock_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS activities (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    activity VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_activities_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS portfolio_history (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    portfolio_value DECIMAL(16,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_portfolio_history_user_time (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ipo (
    id INT NOT NULL AUTO_INCREMENT,
    company_name VARCHAR(150) NOT NULL,
    sector VARCHAR(100) NULL,
    price DECIMAL(14,2) NULL,
    price_band VARCHAR(80) NULL,
    lot_size INT NULL,
    issue_size DECIMAL(16,2) NULL,
    open_date DATE NULL,
    close_date DATE NULL,
    listing_date DATE NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Upcoming',
    PRIMARY KEY (id),
    INDEX idx_ipo_dates (open_date, close_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ipo_applications (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    ipo_id INT NOT NULL,
    lots INT NOT NULL,
    amount DECIMAL(16,2) NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'Submitted',
    application_status VARCHAR(40) NOT NULL DEFAULT 'Submitted',
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_ipo_applications_user (user_id),
    INDEX idx_ipo_applications_ipo (ipo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ipo_demo_applications (
    id INT NOT NULL AUTO_INCREMENT,
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
    PRIMARY KEY (id),
    UNIQUE KEY uq_demo_ipo_user (user_id, ipo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS investment_holdings (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    category VARCHAR(30) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_investment_holdings_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS mutual_fund_positions (
    holding_id INT NOT NULL,
    user_id INT NOT NULL,
    units_remaining DECIMAL(18,6) NOT NULL,
    invested_amount DECIMAL(14,2) NOT NULL,
    purchase_nav DECIMAL(14,4) NOT NULL,
    PRIMARY KEY (holding_id),
    INDEX idx_mutual_fund_positions_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS learning_lab_state (
    user_id BIGINT UNSIGNED NOT NULL,
    lab_progress LONGTEXT NOT NULL,
    paper_account LONGTEXT NOT NULL,
    completed_modules LONGTEXT NOT NULL,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
        ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
