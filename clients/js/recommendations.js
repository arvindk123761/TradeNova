(() => {
    const API = `${window.location.origin}/api`;
    const rangeLabels = { day: "Day", week: "Week", month: "Month" };
    const timeframeDetails = {
        day: {
            title: "Day timeframe · 1D",
            detail: "25 simulated intraday points, spaced 15 minutes apart from 09:00 to 15:00. This is illustrative—not a complete NSE trading session or real intraday feed."
        },
        week: {
            title: "Week timeframe · 1W",
            detail: "5 simulated trading-day points, representing roughly one trading week. The points are generated for chart illustration, not fetched historical closes."
        },
        month: {
            title: "Month timeframe · 1M",
            detail: "22 simulated trading-day points, representing roughly one trading month. The points are generated for chart illustration, not fetched historical closes."
        }
    };
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
    let latestStocksRequest = 0;
    let selectedBuyStock = null;
    let buyDialogCloseTimer = null;

    const sidebar = document.getElementById("sidebar");
    const topbar = document.getElementById("topbar");
    const status = document.getElementById("signalsStatus");
    const summary = document.getElementById("signalsSummary");
    const grid = document.getElementById("signalsGrid");
    const timeframeTitle = document.getElementById("signalsTimeframeTitle");
    const timeframeDetail = document.getElementById("signalsTimeframeDetail");
    const screenerRows = document.getElementById("screenerRows");
    const screenerStatus = document.getElementById("screenerStatus");
    const screenerSearch = document.getElementById("screenerSearch");
    const screenerSort = document.getElementById("screenerSort");
    const buyDialog = document.getElementById("screenerBuyDialog");
    const buyQuantity = document.getElementById("screenerBuyQuantity");
    const buyMessage = document.getElementById("screenerBuyMessage");
    const buyConfirm = document.getElementById("screenerBuyConfirm");
    const buyLoginLink = document.getElementById("screenerLoginLink");

    function updateTimeframeDetails() {
        const details = timeframeDetails[activeRange];
        timeframeTitle.textContent = details.title;
        timeframeDetail.textContent = details.detail;
    }

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

    function createSparkline(analysis, stock, chartType = "line") {
        const namespace = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(namespace, "svg");
        svg.setAttribute("class", `signal-chart${chartType === "candlestick" ? " signal-chart--candlestick" : ""}`);
        svg.setAttribute("viewBox", "0 0 280 82");
        svg.setAttribute("role", "img");
        svg.setAttribute(
            "aria-label",
            `${stock.company_name} simulated ${rangeLabels[activeRange].toLowerCase()} ${chartType === "candlestick" ? "candlestick" : "line"} price chart`
        );

        const prices = analysis.prices;
        const candles = prices.map((close, index) => {
            const open = index === 0 ? close * 0.999 : prices[index - 1];
            const wick = Math.max(Math.abs(close - open) * 0.35, close * 0.0012);
            return {
                open,
                high: Math.max(open, close) + wick,
                low: Math.max(0.01, Math.min(open, close) - wick),
                close
            };
        });
        const minPrice = chartType === "candlestick"
            ? Math.min(...candles.map((candle) => candle.low))
            : Math.min(...prices);
        const maxPrice = chartType === "candlestick"
            ? Math.max(...candles.map((candle) => candle.high))
            : Math.max(...prices);
        const spread = maxPrice - minPrice || Math.max(maxPrice * 0.01, 1);
        const yFor = (price) => 72 - ((price - minPrice) / spread) * 60;

        if (chartType === "candlestick") {
            const bodyWidth = Math.max(2, Math.min(7, (264 / Math.max(prices.length - 1, 1)) * 0.55));
            candles.forEach((candle, index) => {
                const x = 8 + (index / (prices.length - 1)) * 264;
                const rising = candle.close >= candle.open;
                const wick = document.createElementNS(namespace, "line");
                wick.setAttribute("class", `signal-chart__wick signal-chart__wick--${rising ? "up" : "down"}`);
                wick.setAttribute("x1", x.toFixed(2));
                wick.setAttribute("x2", x.toFixed(2));
                wick.setAttribute("y1", yFor(candle.high).toFixed(2));
                wick.setAttribute("y2", yFor(candle.low).toFixed(2));

                const body = document.createElementNS(namespace, "rect");
                const openY = yFor(candle.open);
                const closeY = yFor(candle.close);
                body.setAttribute("class", `signal-chart__candle signal-chart__candle--${rising ? "up" : "down"}`);
                body.setAttribute("x", (x - bodyWidth / 2).toFixed(2));
                body.setAttribute("y", Math.min(openY, closeY).toFixed(2));
                body.setAttribute("width", bodyWidth.toFixed(2));
                body.setAttribute("height", Math.max(2, Math.abs(closeY - openY)).toFixed(2));
                svg.append(wick, body);

                if (index === candles.length - 1) {
                    const marker = document.createElementNS(namespace, "circle");
                    marker.setAttribute("class", "signal-chart__latest-marker");
                    marker.setAttribute("cx", x.toFixed(2));
                    marker.setAttribute("cy", closeY.toFixed(2));
                    marker.setAttribute("r", "2.5");
                    svg.appendChild(marker);
                    const latestLabel = document.createElementNS(namespace, "text");
                    latestLabel.setAttribute("class", "signal-chart__latest-label");
                    latestLabel.setAttribute("x", "272");
                    latestLabel.setAttribute("y", "12");
                    latestLabel.setAttribute("text-anchor", "end");
                    latestLabel.textContent = "NOW";
                    svg.appendChild(latestLabel);
                }
            });
        } else {
            const points = prices.map((price, index) => {
                const x = 8 + (index / (prices.length - 1)) * 264;
                return `${x.toFixed(2)},${yFor(price).toFixed(2)}`;
            }).join(" ");
            const line = document.createElementNS(namespace, "polyline");
            line.setAttribute("class", `signal-chart__line signal-chart__line--${analysis.signal}`);
            line.setAttribute("points", points);
            svg.appendChild(line);
        }
        return svg;
    }

    function createChartDisplay(analysis, stock) {
        const wrapper = createElement("div", "signal-chart-wrap");
        const controls = createElement("div", "signal-chart-types");
        controls.setAttribute("role", "group");
        controls.setAttribute("aria-label", `${stock.company_name || "Stock"} chart style`);
        const plot = createElement("div", "signal-chart-container");
        let activeChartType = "line";

        [
            ["line", "Line"],
            ["candlestick", "Candles"]
        ].forEach(([chartType, label]) => {
            const button = createElement("button", chartType === activeChartType ? "active" : "", label);
            button.type = "button";
            button.setAttribute("aria-pressed", String(chartType === activeChartType));
            button.addEventListener("click", () => {
                activeChartType = chartType;
                controls.querySelectorAll("button").forEach((item) => {
                    const isActive = item === button;
                    item.classList.toggle("active", isActive);
                    item.setAttribute("aria-pressed", String(isActive));
                });
                plot.replaceChildren(createSparkline(analysis, stock, activeChartType));
            });
            controls.appendChild(button);
        });

        plot.appendChild(createSparkline(analysis, stock, activeChartType));
        wrapper.append(controls, plot);
        return wrapper;
    }

    function createBasis(analysis) {
        const list = document.createElement("ul");
        list.className = "signal-card__basis";

        const averagePosition = analysis.currentPrice > analysis.movingAverage
            ? "above"
            : analysis.currentPrice < analysis.movingAverage ? "below" : "at";
        const trendBias = analysis.momentumDirection > 0
            ? "Uptrend bias"
            : analysis.momentumDirection < 0 ? "Downtrend bias" : "Range / sideways bias";
        const signalType = analysis.signal === "bullish"
            ? "bullish continuation"
            : analysis.signal === "bearish" ? "bearish continuation" : "mixed structure";
        const items = [
            `${trendBias}: ${formatPercent(analysis.changePercent)} over the selected period, against the threshold of ±${numberFormat.format(analysis.thresholdPercent)}%.`,
            `Momentum filter: price is ${averagePosition} the ${analysis.averageWindow}-point moving average (${formatCurrency(analysis.movingAverage)}), showing ${signalType}.`,
            `Confirmation check: ${analysis.risingCount} rising intervals vs ${analysis.fallingCount} falling intervals, with ${analysis.bullishConfirmations} bullish confirmations and ${analysis.bearishConfirmations} bearish confirmations.`,
            `Risk note: this is a rule-based technical signal from simulated price history, not a live market guarantee or personal trading advice.`
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
            createElement("p", "signal-card__price", formatCurrency(Number(stock.current_price)))
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
            `${momentumLabel} · trend + momentum + MA confirmation: ${analysis.bullishConfirmations} bullish / ${analysis.bearishConfirmations} bearish`
        );
        const detailsLink = createElement("a", "", "View stock chart");
        detailsLink.href = `stock-details.html?id=${encodeURIComponent(stock.id)}`;
        footer.append(footerNote, detailsLink);

        card.append(header, priceRow, createChartDisplay(analysis, stock), basisTitle, createBasis(analysis), footer);
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

    function signalText(signal) {
        return signal === "bullish" ? "BUY" : signal === "bearish" ? "SELL" : "WAIT";
    }

    function renderScreener() {
        const searchTerm = screenerSearch.value.trim().toLocaleLowerCase();
        const sort = screenerSort.value;
        const candidates = stocks.map((stock) => {
            const weekly = window.TradeNovaStockChart.analyze(stock, "week");
            const monthly = window.TradeNovaStockChart.analyze(stock, "month");
            return {
                stock,
                weekly,
                monthly,
                averageReturn: (weekly.changePercent + monthly.changePercent) / 2
            };
        }).filter(({ stock, weekly, monthly }) => {
            const matchesSearch = `${stock.company_name || ""} ${stock.symbol || ""}`
                .toLocaleLowerCase()
                .includes(searchTerm);
            return matchesSearch && weekly.signal === "bullish" && monthly.signal === "bullish";
        });

        candidates.sort((left, right) => {
            if (sort === "price") {
                return Number(left.stock.current_price) - Number(right.stock.current_price);
            }
            if (sort === "name") {
                return String(left.stock.company_name || "").localeCompare(String(right.stock.company_name || ""));
            }
            return right.averageReturn - left.averageReturn;
        });

        const topFive = candidates.slice(0, 5);
        screenerRows.replaceChildren();
        screenerStatus.textContent = `${topFive.length} of ${candidates.length} matching stock(s) shown · top 5`;

        if (!topFive.length) {
            const row = document.createElement("tr");
            const cell = createElement("td", "screener__empty", "No stocks currently have BUY signals on both timeframes.");
            cell.colSpan = 7;
            row.appendChild(cell);
            screenerRows.appendChild(row);
            return;
        }

        topFive.forEach(({ stock, weekly, monthly, averageReturn }, index) => {
            const row = document.createElement("tr");
            const rank = createElement("td", "screener__rank", String(index + 1));
            const identity = document.createElement("td");
            identity.append(
                createElement("strong", "screener__company", stock.company_name || "Unnamed stock"),
                createElement("span", "screener__symbol", stock.symbol || "—")
            );
            const price = createElement("td", "screener__price", formatCurrency(Number(stock.current_price)));
            const weekChange = createElement(
                "td",
                `screener__return screener__return--${weekly.signal}`,
                `${formatPercent(weekly.changePercent)} · ${signalText(weekly.signal)}`
            );
            const monthChange = createElement(
                "td",
                `screener__return screener__return--${monthly.signal}`,
                `${formatPercent(monthly.changePercent)} · ${signalText(monthly.signal)}`
            );
            const combinedReturn = createElement(
                "td",
                `screener__combined${averageReturn >= 0 ? " screener__combined--up" : " screener__combined--down"}`,
                formatPercent(averageReturn)
            );
            const action = document.createElement("td");
            const button = createElement("button", "screener__buy", "Buy");
            button.type = "button";
            button.setAttribute("aria-label", `Buy ${stock.company_name || stock.symbol || "stock"}`);
            button.addEventListener("click", () => openBuyDialog(stock));
            action.appendChild(button);
            row.append(rank, identity, price, weekChange, monthChange, combinedReturn, action);
            screenerRows.appendChild(row);
        });
    }

    function updateBuyEstimate() {
        const quantity = Number(buyQuantity.value);
        const total = quantity * Number(selectedBuyStock && selectedBuyStock.current_price);
        document.getElementById("screenerBuyTotal").textContent = Number.isFinite(total) && total > 0
            ? formatCurrency(total)
            : "—";
    }

    function openBuyDialog(stock) {
        window.clearTimeout(buyDialogCloseTimer);
        selectedBuyStock = stock;
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        document.getElementById("screenerBuyIdentity").textContent =
            `${stock.company_name || "Stock"} (${stock.symbol || "NSE"})`;
        document.getElementById("screenerBuyPrice").textContent = formatCurrency(Number(stock.current_price));
        buyQuantity.value = "1";
        buyMessage.textContent = token ? "" : "Sign in to place a paper-trade order.";
        buyConfirm.disabled = !token;
        buyLoginLink.hidden = Boolean(token);
        updateBuyEstimate();
        buyDialog.showModal();
    }

    async function submitScreenerBuy() {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const quantity = Number(buyQuantity.value);
        if (!token) {
            buyMessage.textContent = "Please sign in before placing an order.";
            buyLoginLink.hidden = false;
            return;
        }
        if (!selectedBuyStock || !Number.isSafeInteger(quantity) || quantity <= 0) {
            buyMessage.textContent = "Enter a valid whole-number quantity.";
            return;
        }

        buyConfirm.disabled = true;
        buyMessage.textContent = "Placing paper-trade order...";
        let orderSucceeded = false;
        try {
            const response = await fetch(`${API}/trade/buy`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },
                body: JSON.stringify({
                    stock_id: selectedBuyStock.id,
                    quantity
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                if (response.status === 401) {
                    buyLoginLink.hidden = false;
                }
                throw new Error(data.message || `Order failed (${response.status}).`);
            }
            buyMessage.textContent = data.message || "Paper-trade order placed.";
            orderSucceeded = true;
            buyDialogCloseTimer = window.setTimeout(() => buyDialog.close(), 900);
        } catch (error) {
            console.error("Unable to place screener paper-trade order", error);
            buyMessage.textContent = error.message || "Unable to place the order. Please try again.";
        } finally {
            buyConfirm.disabled = orderSucceeded;
        }
    }

    function render() {
        renderScreener();
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
            const requestId = ++latestStocksRequest;
            const response = await fetch(`${API}/stocks`, { cache: "no-store" });
            if (!response.ok) {
                throw new Error(`Stock request failed (${response.status}).`);
            }

            const data = await response.json();
            if (requestId !== latestStocksRequest) return;
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
            updateTimeframeDetails();
            document.querySelectorAll("[data-signal-range]").forEach((item) => {
                const isActive = item === button;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });
            render();
            setStatus(`${stocks.length} stock(s) · ${rangeLabels[activeRange]} view.`);
        });
    });

    screenerSearch.addEventListener("input", renderScreener);
    screenerSort.addEventListener("change", renderScreener);
    buyQuantity.addEventListener("input", updateBuyEstimate);
    buyConfirm.addEventListener("click", submitScreenerBuy);
    document.getElementById("screenerBuyCancel").addEventListener("click", () => buyDialog.close());
    buyDialog.addEventListener("click", (event) => {
        if (event.target === buyDialog) buyDialog.close();
    });

    updateTimeframeDetails();
    loadNavigation();
    loadStocks();
    window.setInterval(loadStocks, 5000);
})();
