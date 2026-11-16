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
            value: "25,180",
            description: "NSE's broad large-company index, covering companies across major sectors of the Indian economy.",
            color: "#16803c",
            trend: [44, 49, 42, 59, 53, 65, 60, 74, 68, 82, 77, 91],
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
            value: "82,420",
            description: "BSE's benchmark index of 30 large, established companies listed on the Bombay Stock Exchange.",
            color: "#16803c",
            trend: [47, 42, 50, 57, 48, 64, 59, 70, 65, 80, 75, 88],
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
            value: "56,800",
            description: "NSE's banking-sector index, tracking large and liquid banks listed on the exchange.",
            color: "#dc2626",
            trend: [82, 75, 80, 68, 73, 61, 66, 53, 59, 45, 50, 38],
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

    function initializeTopbarInteractions() {
        if (interactionsBound) return;
        const searchInput = document.getElementById("searchBox");
        const searchResults = document.getElementById("stockSearchResults");
        const modal = document.getElementById("marketDetailModal");
        if (!searchInput || !searchResults || !modal) return;
        interactionsBound = true;

        let searchTimer;
        let activeSearchController;

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

        function openMarketDetails(indexKey) {
            const index = marketIndexes[indexKey];
            if (!index) return;

            document.getElementById("marketDetailTitle").textContent = index.name;
            document.getElementById("marketDetailDescription").textContent = index.description;
            document.getElementById("marketDetailValue").textContent = index.value;

            const svg = document.getElementById("marketDetailChart");
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
            const points = index.trend.map((value, position) =>
                `${20 + position * (600 / (index.trend.length - 1))},${175 - value * 1.55}`
            );
            const path = document.createElementNS(namespace, "polyline");
            path.setAttribute("points", points.join(" "));
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", index.color);
            path.setAttribute("stroke-width", "4");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            svg.appendChild(path);

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
        }
    }

    window.addEventListener("tradenova:wallet-updated", loadWalletBalance);
    initializeProfile();

    const observer = new MutationObserver(initializeProfile);
    observer.observe(topbar, { childList: true, subtree: true });
})();
