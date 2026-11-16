(() => {
    const topbar = document.getElementById("topbar");
    if (!topbar) return;
    let walletLoadStarted = false;
    let interactionsBound = false;

    const loadWalletBalance = async () => {
        const wallet = document.getElementById("topWallet");
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!wallet || !token) return;

        try {
            const response = await fetch(`${window.location.origin}/api/wallet`, {
                headers: { Authorization: token }
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || `Wallet request failed (${response.status})`);
            }

            const balance = Number(data.balance);
            if (!Number.isFinite(balance)) {
                throw new Error("Wallet response contains an invalid balance");
            }

            wallet.textContent = `₹${balance.toLocaleString("en-IN")}`;
        } catch (error) {
            console.error("Unable to load the topbar wallet balance", error);
        }
    };

    const initializeProfile = () => {
        initializeTopbarInteractions();
        const avatar = document.getElementById("topUserAvatar");
        const label = document.getElementById("topUser");
        if (!avatar || !label) return false;

        let user = null;
        try {
            user = JSON.parse(localStorage.getItem("user") || "null");
        } catch (error) {
            console.error("Unable to read the saved TradeNova user profile", error);
        }

        const fullName = user && typeof user.full_name === "string"
            ? user.full_name.trim()
            : "";
        const email = user && typeof user.email === "string"
            ? user.email.trim()
            : "";
        const displayName = fullName || email || "Account";

        const initial = displayName.charAt(0).toUpperCase() || "U";
        if (avatar.textContent !== initial) avatar.textContent = initial;
        if (label.textContent !== displayName) label.textContent = displayName;

        if (!walletLoadStarted && document.getElementById("topWallet")) {
            walletLoadStarted = true;
            loadWalletBalance();
        }

        return true;
    };

    const marketIndexes = {
        nifty: {
            name: "NIFTY 50",
            baseValue: 25180,
            baseChange: 0.82,
            description: "NSE's broad large-company index, covering companies across major sectors of the Indian economy.",
            color: "#16803c",
            seed: 1,
            companies: [
                ["RELIANCE", "Reliance Industries"],
                ["HDFCBANK", "HDFC Bank"],
                ["ICICIBANK", "ICICI Bank"],
                ["INFY", "Infosys"],
                ["TCS", "Tata Consultancy Services"],
                ["BHARTIARTL", "Bharti Airtel"],
                ["SBIN", "State Bank of India"],
                ["ITC", "ITC Limited"]
            ]
        },
        sensex: {
            name: "SENSEX",
            baseValue: 82420,
            baseChange: 1.14,
            description: "BSE's benchmark index of 30 large, established companies listed on the Bombay Stock Exchange.",
            color: "#16803c",
            seed: 2,
            companies: [
                ["RELIANCE", "Reliance Industries"],
                ["HDFCBANK", "HDFC Bank"],
                ["ICICIBANK", "ICICI Bank"],
                ["TCS", "Tata Consultancy Services"],
                ["INFY", "Infosys"],
                ["ITC", "ITC Limited"],
                ["LT", "Larsen & Toubro"],
                ["AXISBANK", "Axis Bank"]
            ]
        },
        banknifty: {
            name: "BANK NIFTY",
            baseValue: 56800,
            baseChange: -0.25,
            description: "NSE's banking-sector index, tracking large and liquid banks listed on the exchange.",
            color: "#dc2626",
            seed: 3,
            companies: [
                ["HDFCBANK", "HDFC Bank"],
                ["ICICIBANK", "ICICI Bank"],
                ["SBIN", "State Bank of India"],
                ["AXISBANK", "Axis Bank"],
                ["KOTAKBANK", "Kotak Mahindra Bank"],
                ["BANKBARODA", "Bank of Baroda"],
                ["INDUSINDBK", "IndusInd Bank"],
                ["AUBANK", "AU Small Finance Bank"]
            ]
        }
    };

    const marketPeriods = {
        day: { label: "Illustrative day trend", count: 24, range: 0.35, ticks: ["9:15", "10:30", "12:00", "1:30", "3:30"] },
        week: { label: "Illustrative week trend", count: 28, range: 1.8, ticks: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
        month: { label: "Illustrative month trend", count: 30, range: 4, ticks: ["1", "7", "14", "21", "30"] },
        year: { label: "Illustrative year trend", count: 12, range: 12, ticks: ["Jan", "Apr", "Jul", "Oct", "Dec"] }
    };
    const numberFormat = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    let activeMarketKey = null;
    let activeMarketPeriod = "day";
    let marketTick = 0;
    let selectedChartPoint = null;

    Object.values(marketIndexes).forEach((index) => {
        index.referenceValue = index.baseValue / (1 + index.baseChange / 100);
        index.currentValue = index.baseValue;
    });

    function formatIndexValue(value) {
        return numberFormat.format(value);
    }

    function getMarketChange(index) {
        return (index.currentValue / index.referenceValue - 1) * 100;
    }

    function updateMarketSnapshots(advance = true) {
        if (advance) marketTick += 1;
        Object.entries(marketIndexes).forEach(([key, index]) => {
            if (advance) {
                const movement = Math.sin(marketTick * 1.7 + index.seed) * index.baseValue * 0.00012;
                index.currentValue = Math.max(0, index.currentValue + movement);
            }
            const change = getMarketChange(index);
            const changeText = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

            document.querySelectorAll(`[data-market-change="${key}"]`).forEach((element) => {
                element.textContent = changeText;
                element.classList.toggle("green", change >= 0);
                element.classList.toggle("red", change < 0);
            });

            const dashboardValue = document.getElementById(key);
            if (dashboardValue) {
                const changeElement = document.createElement("span");
                changeElement.className = change >= 0 ? "green" : "red";
                changeElement.textContent = changeText;
                dashboardValue.replaceChildren(
                    document.createTextNode(formatIndexValue(index.currentValue) + " "),
                    changeElement
                );
            }
        });

        if (activeMarketKey && !document.getElementById("marketDetailModal")?.hidden) {
            renderMarketDetails(activeMarketKey);
        }
    }

    function showChartPointValue(pointIndex) {
        const index = marketIndexes[activeMarketKey];
        const period = marketPeriods[activeMarketPeriod];
        if (!index || !period) return;

        const safeIndex = Math.max(0, Math.min(pointIndex, period.count - 1));
        const progress = safeIndex / (period.count - 1);
        const wave = Math.sin(safeIndex * 1.31 + index.seed) * 0.48 +
            Math.cos(safeIndex * 0.57 + index.seed * 2) * 0.28 +
            (progress - 0.5) * 0.8;
        const pointValue = safeIndex === period.count - 1
            ? index.currentValue
            : index.referenceValue * (1 + wave * period.range / 100);
        const tick = period.ticks[Math.round(safeIndex * (period.ticks.length - 1) / (period.count - 1))];
        document.getElementById("marketChartPointValue").textContent =
            `${tick} · ${index.name}: ${formatIndexValue(pointValue)} (simulated)`;
        selectedChartPoint = {
            index: safeIndex,
            indexKey: activeMarketKey,
            period: activeMarketPeriod
        };
    }

    function renderMarketDetails(indexKey) {
        const index = marketIndexes[indexKey];
        const period = marketPeriods[activeMarketPeriod];
        if (!index || !period) return;

        const value = document.getElementById("marketDetailValue");
        const change = document.getElementById("marketDetailChange");
        const svg = document.getElementById("marketDetailChart");
        const labels = document.getElementById("marketDetailChartLabels");
        if (!value || !change || !svg || !labels) return;

        const changePercent = getMarketChange(index);
        value.textContent = formatIndexValue(index.currentValue);
        change.textContent = `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`;
        change.classList.toggle("positive", changePercent >= 0);
        change.classList.toggle("negative", changePercent < 0);
        document.getElementById("marketDetailPeriodLabel").textContent = period.label;
        document.getElementById("marketDetailUpdatedAt").textContent =
            new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        document.querySelectorAll("[data-market-period]").forEach((button) => {
            const selected = button.dataset.marketPeriod === activeMarketPeriod;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-pressed", String(selected));
        });

        const points = Array.from({ length: period.count }, (_, position) => {
            const progress = position / (period.count - 1);
            const wave = Math.sin(position * 1.31 + index.seed) * 0.48 +
                Math.cos(position * 0.57 + index.seed * 2) * 0.28 +
                (progress - 0.5) * 0.8;
            return index.referenceValue * (1 + wave * period.range / 100);
        });
        points[points.length - 1] = index.currentValue;

        const minValue = Math.min(...points);
        const maxValue = Math.max(...points);
        const valueRange = maxValue - minValue || 1;
        const chartPoints = points.map((point, position) => {
            const x = 20 + position * (600 / (points.length - 1));
            const y = 20 + ((maxValue - point) / valueRange) * 145;
            return `${x},${y}`;
        });

        svg.replaceChildren();
        const namespace = "http://www.w3.org/2000/svg";
        [45, 90, 135].forEach((y) => {
            const line = document.createElementNS(namespace, "line");
            line.setAttribute("x1", "20");
            line.setAttribute("x2", "620");
            line.setAttribute("y1", String(y));
            line.setAttribute("y2", String(y));
            line.setAttribute("stroke", "#e2e8f0");
            line.setAttribute("stroke-dasharray", "4 6");
            svg.appendChild(line);
        });

        const chartLine = document.createElementNS(namespace, "polyline");
        chartLine.setAttribute("points", chartPoints.join(" "));
        chartLine.setAttribute("fill", "none");
        chartLine.setAttribute("stroke", index.color);
        chartLine.setAttribute("stroke-width", "1.8");
        chartLine.setAttribute("stroke-linecap", "round");
        chartLine.setAttribute("stroke-linejoin", "round");
        svg.appendChild(chartLine);

        chartPoints.forEach((point, position) => {
            const [x, y] = point.split(",");
            const hitTarget = document.createElementNS(namespace, "circle");
            hitTarget.setAttribute("class", "market-chart-point");
            hitTarget.setAttribute("data-point-index", String(position));
            hitTarget.setAttribute("cx", x);
            hitTarget.setAttribute("cy", y);
            hitTarget.setAttribute("r", "9");
            hitTarget.setAttribute("fill", "transparent");
            hitTarget.setAttribute("tabindex", "0");
            hitTarget.setAttribute("role", "button");
            hitTarget.setAttribute(
                "aria-label",
                `${period.ticks[Math.round(position * (period.ticks.length - 1) / (period.count - 1))]}: ${formatIndexValue(points[position])}`
            );

            const title = document.createElementNS(namespace, "title");
            title.textContent = formatIndexValue(points[position]);
            hitTarget.appendChild(title);
            svg.appendChild(hitTarget);

            const dot = document.createElementNS(namespace, "circle");
            dot.setAttribute("class", "market-chart-point-dot");
            dot.setAttribute("cx", x);
            dot.setAttribute("cy", y);
            dot.setAttribute("r", position === points.length - 1 ? "3" : "2");
            dot.setAttribute("fill", index.color);
            dot.setAttribute("pointer-events", "none");
            svg.appendChild(dot);
        });

        if (selectedChartPoint && selectedChartPoint.indexKey === indexKey &&
            selectedChartPoint.period === activeMarketPeriod) {
            showChartPointValue(selectedChartPoint.index);
        } else {
            selectedChartPoint = null;
            document.getElementById("marketChartPointValue").textContent =
                "Hover over, focus, or tap a chart point to see its value.";
        }

        labels.replaceChildren();
        period.ticks.forEach((tick) => {
            const label = document.createElement("span");
            label.textContent = tick;
            labels.appendChild(label);
        });
    }

    function initializeTopbarInteractions() {
        if (interactionsBound) return;
        const searchInput = document.getElementById("searchBox");
        const searchResults = document.getElementById("stockSearchResults");
        const modal = document.getElementById("marketDetailModal");
        if (!searchInput || !searchResults || !modal) return;
        interactionsBound = true;

        let searchTimer;
        let activeSearchController;
        const chart = document.getElementById("marketDetailChart");
        chart.addEventListener("pointerover", (event) => {
            const point = event.target.closest("[data-point-index]");
            if (point) showChartPointValue(Number(point.dataset.pointIndex));
        });
        chart.addEventListener("focusin", (event) => {
            const point = event.target.closest("[data-point-index]");
            if (point) showChartPointValue(Number(point.dataset.pointIndex));
        });
        chart.addEventListener("click", (event) => {
            const point = event.target.closest("[data-point-index]");
            if (point) showChartPointValue(Number(point.dataset.pointIndex));
        });

        const hideSearchResults = () => {
            searchResults.hidden = true;
            searchInput.setAttribute("aria-expanded", "false");
        };

        const navigateToStock = (stock) => {
            hideSearchResults();
            window.location.href = `stock-details.html?id=${encodeURIComponent(stock.id)}`;
        };

        const renderSearchResults = (stocks, query) => {
            searchResults.replaceChildren();
            if (!stocks.length) {
                const empty = document.createElement("div");
                empty.className = "stock-search-empty";
                empty.textContent = `No companies found for "${query}".`;
                searchResults.appendChild(empty);
            } else {
                stocks.slice(0, 8).forEach((stock) => {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = "stock-search-result";
                    button.setAttribute("role", "option");
                    button.dataset.stockId = stock.id;

                    const company = document.createElement("span");
                    const name = document.createElement("strong");
                    name.textContent = stock.company_name || "Company";
                    const symbol = document.createElement("small");
                    symbol.textContent = stock.symbol || "";
                    company.append(name, symbol);

                    const price = document.createElement("strong");
                    const currentPrice = Number(stock.current_price);
                    price.textContent = Number.isFinite(currentPrice)
                        ? `₹${currentPrice.toLocaleString("en-IN")}`
                        : "";
                    button.append(company, price);
                    button.addEventListener("click", () => navigateToStock(stock));
                    searchResults.appendChild(button);
                });
            }
            searchResults.hidden = false;
            searchInput.setAttribute("aria-expanded", "true");
        };

        searchInput.addEventListener("input", () => {
            window.clearTimeout(searchTimer);
            if (activeSearchController) activeSearchController.abort();
            const query = searchInput.value.trim();
            if (query.length < 2) {
                hideSearchResults();
                return;
            }

            searchResults.replaceChildren();
            const loading = document.createElement("div");
            loading.className = "stock-search-empty";
            loading.textContent = "Searching companies...";
            searchResults.appendChild(loading);
            searchResults.hidden = false;
            searchInput.setAttribute("aria-expanded", "true");

            searchTimer = window.setTimeout(async () => {
                activeSearchController = new AbortController();
                try {
                    const response = await fetch(
                        `${window.location.origin}/api/stocks/search?q=${encodeURIComponent(query)}`,
                        { signal: activeSearchController.signal }
                    );
                    const data = await response.json();
                    if (!response.ok || !data.success || !Array.isArray(data.stocks)) {
                        throw new Error(data.message || `Stock search failed (${response.status})`);
                    }
                    if (searchInput.value.trim() === query) renderSearchResults(data.stocks, query);
                } catch (error) {
                    if (error.name === "AbortError") return;
                    console.error("Unable to search companies", error);
                    const message = document.createElement("div");
                    message.className = "stock-search-empty";
                    message.textContent = "Company search is unavailable right now. Please try again.";
                    searchResults.replaceChildren(message);
                    searchResults.hidden = false;
                    searchInput.setAttribute("aria-expanded", "true");
                }
            }, 250);
        });

        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                hideSearchResults();
                searchInput.blur();
            } else if (event.key === "Enter" && !searchResults.hidden) {
                const firstResult = searchResults.querySelector(".stock-search-result");
                if (firstResult) {
                    event.preventDefault();
                    firstResult.click();
                }
            } else if (event.key === "ArrowDown" && !searchResults.hidden) {
                event.preventDefault();
                searchResults.querySelector(".stock-search-result")?.focus();
            }
        });

        document.addEventListener("click", (event) => {
            if (!event.target.closest(".top-left")) hideSearchResults();
            const indexButton = event.target.closest("[data-market-index]");
            if (indexButton) openMarketDetails(indexButton.dataset.marketIndex);
            const periodButton = event.target.closest("[data-market-period]");
            if (periodButton && activeMarketKey) {
                activeMarketPeriod = periodButton.dataset.marketPeriod;
                selectedChartPoint = null;
                renderMarketDetails(activeMarketKey);
            }
            if (event.target === modal) closeMarketDetails();
        });

        searchResults.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                hideSearchResults();
                searchInput.focus();
            } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                const options = [...searchResults.querySelectorAll(".stock-search-result")];
                const current = options.indexOf(document.activeElement);
                const next = event.key === "ArrowDown"
                    ? Math.min(current + 1, options.length - 1)
                    : Math.max(current - 1, 0);
                options[next]?.focus();
            }
        });

        modal.querySelector(".market-detail-close").addEventListener("click", closeMarketDetails);
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !modal.hidden) closeMarketDetails();
        });
        updateMarketSnapshots(false);
        window.setInterval(updateMarketSnapshots, 5000);

        function openMarketDetails(indexKey) {
            const index = marketIndexes[indexKey];
            if (!index) return;

            activeMarketKey = indexKey;
            activeMarketPeriod = "day";
            selectedChartPoint = null;
            document.getElementById("marketDetailTitle").textContent = index.name;
            document.getElementById("marketDetailDescription").textContent = index.description;
            renderMarketDetails(indexKey);

            const companyList = document.getElementById("marketDetailCompanyList");
            companyList.replaceChildren();
            companyList.className = "market-detail-company-list";
            index.companies.forEach(([symbol, companyName]) => {
                const item = document.createElement("div");
                item.className = "market-detail-company";
                const companySymbol = document.createElement("strong");
                companySymbol.textContent = symbol;
                const companyLabel = document.createElement("span");
                companyLabel.textContent = companyName;
                item.append(companySymbol, companyLabel);
                companyList.appendChild(item);
            });
            modal.hidden = false;
            modal.querySelector(".market-detail-close").focus();
        }

        function closeMarketDetails() {
            modal.hidden = true;
            activeMarketKey = null;
            selectedChartPoint = null;
        }
    }

    window.addEventListener("tradenova:wallet-updated", loadWalletBalance);
    initializeProfile();

    const observer = new MutationObserver(initializeProfile);
    observer.observe(topbar, { childList: true, subtree: true });
})();
