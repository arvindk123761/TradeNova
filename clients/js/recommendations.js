(() => {
    const API = `${window.location.origin}/api`;
    const rangeLabels = { day: "Day", week: "Week", month: "Month" };
    const signalLabels = {
        bullish: "BUY SIGNAL",
        bearish: "SELL SIGNAL",
        neutral: "MIXED / WAIT"
    };
    const numberFormat = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const currencyFormat = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    let activeRange = "day";
    let stocks = [];
    let invalidStockCount = 0;

    const sidebar = document.getElementById("sidebar");
    const topbar = document.getElementById("topbar");
    const status = document.getElementById("signalsStatus");
    const summary = document.getElementById("signalsSummary");
    const grid = document.getElementById("signalsGrid");

    function setStatus(message) {
        status.textContent = message;
    }

    async function loadComponent(container, filename) {
        const response = await fetch(`components/${filename}`);
        if (!response.ok) {
            throw new Error(`Unable to load ${filename} (${response.status}).`);
        }
        container.innerHTML = await response.text();
    }

    function loadNavigation() {
        Promise.all([
            loadComponent(sidebar, "sidebar.html"),
            loadComponent(topbar, "topbar.html")
        ]).then(() => {
            const activeLink = document.getElementById("marketSignalsLink");
            if (activeLink) activeLink.classList.add("active");
        }).catch((error) => {
            console.error("Unable to load TradeNova navigation", error);
            setStatus("The page navigation could not be loaded. Refresh to try again.");
        });
    }

    function formatCurrency(value) {
        return `₹${currencyFormat.format(value)}`;
    }

    function formatPercent(value) {
        const sign = value > 0 ? "+" : "";
        return `${sign}${numberFormat.format(value)}%`;
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function createSparkline(analysis, stock) {
        const namespace = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(namespace, "svg");
        svg.setAttribute("class", "signal-chart");
        svg.setAttribute("viewBox", "0 0 280 82");
        svg.setAttribute("role", "img");
        svg.setAttribute(
            "aria-label",
            `${stock.company_name} simulated ${rangeLabels[activeRange].toLowerCase()} price chart`
        );

        const prices = analysis.prices;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const spread = maxPrice - minPrice || Math.max(maxPrice * 0.01, 1);
        const points = prices.map((price, index) => {
            const x = 8 + (index / (prices.length - 1)) * 264;
            const y = 72 - ((price - minPrice) / spread) * 60;
            return `${x.toFixed(2)},${y.toFixed(2)}`;
        }).join(" ");

        const line = document.createElementNS(namespace, "polyline");
        line.setAttribute("class", `signal-chart__line signal-chart__line--${analysis.signal}`);
        line.setAttribute("points", points);
        svg.appendChild(line);
        return svg;
    }

    function createBasis(analysis) {
        const list = document.createElement("ul");
        list.className = "signal-card__basis";

        const averagePosition = analysis.currentPrice > analysis.movingAverage
            ? "above"
            : analysis.currentPrice < analysis.movingAverage ? "below" : "at";
        const items = [
            `Chart-period change: ${formatPercent(analysis.changePercent)} (threshold ±${numberFormat.format(analysis.thresholdPercent)}%).`,
            `Latest price is ${averagePosition} the ${analysis.averageWindow}-point average (${formatCurrency(analysis.movingAverage)}).`,
            `Rising intervals: ${analysis.risingCount}; falling intervals: ${analysis.fallingCount}.`
        ];

        items.forEach((text) => list.appendChild(createElement("li", "", text)));
        return list;
    }

    function createCard(stock, analysis) {
        const card = createElement("article", `signal-card signal-card--${analysis.signal}`);
        const header = createElement("div", "signal-card__header");
        const identity = createElement("div", "signal-card__name");
        const company = createElement("h2", "", stock.company_name || "Unnamed stock");
        const symbol = createElement("p", "", stock.symbol || "Symbol unavailable");
        const badge = createElement("span", `signal-badge signal-badge--${analysis.signal}`, signalLabels[analysis.signal]);

        identity.append(company, symbol);
        header.append(identity, badge);

        const priceRow = createElement("div", "signal-card__price-row");
        const priceInfo = createElement("div");
        priceInfo.append(
            createElement("p", "", "Latest simulated price"),
            createElement("p", "signal-card__price", formatCurrency(analysis.currentPrice))
        );
        const changeClass = analysis.changePercent > 0
            ? "up"
            : analysis.changePercent < 0 ? "down" : "flat";
        const changeInfo = createElement("p", `signal-card__change signal-card__change--${changeClass}`, formatPercent(analysis.changePercent));
        priceRow.append(priceInfo, changeInfo);

        const basisTitle = createElement("h3", "signal-card__basis-title", `Why this ${rangeLabels[activeRange].toLowerCase()} signal?`);
        const footer = createElement("div", "signal-card__footer");
        const momentumLabel = analysis.momentumDirection > 0
            ? "Bullish momentum"
            : analysis.momentumDirection < 0 ? "Bearish momentum" : "Momentum below threshold";
        const footerNote = createElement(
            "span",
            "",
            `${momentumLabel} · confirmations: ${analysis.bullishConfirmations} bullish / ${analysis.bearishConfirmations} bearish`
        );
        const detailsLink = createElement("a", "", "View stock chart");
        detailsLink.href = `stock-details.html?id=${encodeURIComponent(stock.id)}`;
        footer.append(footerNote, detailsLink);

        card.append(header, priceRow, createSparkline(analysis, stock), basisTitle, createBasis(analysis), footer);
        return card;
    }

    function createSummaryCount(label, count, signal) {
        const card = createElement("article", `signals-count signals-count--${signal}`);
        card.append(
            createElement("span", "", label),
            createElement("strong", "", String(count))
        );
        return card;
    }

    function render() {
        if (!stocks.length) {
            summary.replaceChildren();
            grid.replaceChildren(createElement(
                "p",
                "signals-empty",
                invalidStockCount
                    ? "Stocks are present, but their price data is not valid for chart analysis."
                    : "No stocks have been added yet. Add stocks to see their chart signals here."
            ));
            return;
        }

        const analyses = stocks.map((stock) => ({
            stock,
            analysis: window.TradeNovaStockChart.analyze(stock, activeRange)
        }));
        const counts = analyses.reduce((result, item) => {
            result[item.analysis.signal] += 1;
            return result;
        }, { bullish: 0, bearish: 0, neutral: 0 });

        summary.replaceChildren(
            createSummaryCount("Bullish · Buy signal", counts.bullish, "bullish"),
            createSummaryCount("Bearish · Sell signal", counts.bearish, "bearish"),
            createSummaryCount("Mixed · Wait", counts.neutral, "neutral")
        );
        grid.replaceChildren(...analyses.map(({ stock, analysis }) => createCard(stock, analysis)));
    }

    async function loadStocks() {
        try {
            const response = await fetch(`${API}/stocks`);
            if (!response.ok) {
                throw new Error(`Stock request failed (${response.status}).`);
            }

            const data = await response.json();
            if (!data || !Array.isArray(data.stocks)) {
                throw new Error("Stock response did not contain a stock list.");
            }

            const validStocks = data.stocks.filter((stock) =>
                stock && Number.isSafeInteger(Number(stock.id)) && Number(stock.id) > 0 &&
                Number.isFinite(Number(stock.current_price)) && Number(stock.current_price) > 0
            );
            invalidStockCount = data.stocks.length - validStocks.length;
            stocks = validStocks;
            render();

            const updatedAt = new Intl.DateTimeFormat(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }).format(new Date());
            const invalidNote = invalidStockCount
                ? ` ${invalidStockCount} stock(s) with invalid prices were excluded.`
                : "";
            setStatus(`${stocks.length} stock(s) · ${rangeLabels[activeRange]} view · Updated ${updatedAt}.${invalidNote}`);
        } catch (error) {
            console.error("Unable to load market signals", error);
            setStatus("Could not load stock data. Check the connection and refresh to retry.");
            if (!stocks.length) {
                summary.replaceChildren();
                grid.replaceChildren(createElement("p", "signals-empty", "Stock data is unavailable right now."));
            }
        }
    }

    document.querySelectorAll("[data-signal-range]").forEach((button) => {
        button.addEventListener("click", () => {
            activeRange = button.dataset.signalRange;
            document.querySelectorAll("[data-signal-range]").forEach((item) => {
                const isActive = item === button;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });
            render();
            setStatus(`${stocks.length} stock(s) · ${rangeLabels[activeRange]} view.`);
        });
    });

    loadNavigation();
    loadStocks();
    window.setInterval(loadStocks, 30000);
})();
