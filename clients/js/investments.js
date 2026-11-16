const API = `${window.location.origin}/api`;
const category = document.body.dataset.category;
const token = localStorage.getItem("token") || sessionStorage.getItem("token");
const investmentGrid = document.getElementById("investmentGrid");
const holdingsContainer = document.getElementById("myInvestments");
let investments = [];
let holdings = [];
let refreshing = false;
let activeTrade = null;
let feedbackTimeout;
const tradeDialog = document.getElementById("fundTradeDialog");
const tradeInput = document.getElementById("tradeInput");

const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
}[character]));

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;

const signedCurrency = (value) => {
    const amount = Number(value || 0);
    return `${amount > 0 ? "+" : ""}${formatCurrency(amount)}`;
};

const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const requestJSON = async (url, options = {}) => {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || `Request failed (${response.status})`);
    }
    return data;
};

const loadComponents = async () => {
    const [sidebarResponse, topbarResponse] = await Promise.all([
        fetch("components/sidebar.html"),
        fetch("components/topbar.html")
    ]);
    if (!sidebarResponse.ok || !topbarResponse.ok) throw new Error("Unable to load page navigation");
    document.getElementById("sidebar").innerHTML = await sidebarResponse.text();
    document.getElementById("topbar").innerHTML = await topbarResponse.text();
};

const loadInvestments = async () => {
    const data = await requestJSON(`${API}/investments/${encodeURIComponent(category)}`);
    investments = Array.isArray(data.investments) ? data.investments : [];
    renderInvestments();
};

const loadHoldings = async () => {
    if (!token) {
        holdings = [];
        renderHoldings();
        return;
    }
    const data = await requestJSON(`${API}/investments/holdings`, {
        headers: { Authorization: token }
    });
    holdings = (Array.isArray(data.holdings) ? data.holdings : [])
        .filter((holding) => holding.category === category && Number(holding.units) > 0);
    renderHoldings();
};

const renderPortfolioSummary = () => {
    const invested = holdings.reduce((total, holding) => total + Number(holding.amount || 0), 0);
    const currentValue = holdings.reduce((total, holding) => total + Number(holding.current_value || 0), 0);
    const returns = currentValue - invested;
    const returnPercent = invested ? returns / invested * 100 : 0;

    document.getElementById("portfolioCurrent").textContent = formatCurrency(currentValue);
    document.getElementById("portfolioInvested").textContent = formatCurrency(invested);
    document.getElementById("portfolioReturns").textContent = signedCurrency(returns);
    document.getElementById("portfolioReturnPercent").textContent =
        `${returnPercent > 0 ? "+" : ""}${returnPercent.toFixed(2)}% overall`;
    document.getElementById("portfolioReturns").classList.toggle("positive", returns >= 0);
    document.getElementById("portfolioReturns").classList.toggle("negative", returns < 0);
    document.getElementById("portfolioReturnPercent").classList.toggle("positive", returns >= 0);
    document.getElementById("portfolioReturnPercent").classList.toggle("negative", returns < 0);
    document.getElementById("portfolioFundCount").textContent =
        new Set(holdings.map((holding) => holding.product_name)).size;
};

const renderInvestments = () => {
    const query = document.getElementById("investmentSearch").value.trim().toLowerCase();
    const filtered = investments.filter((item) =>
        `${item.name} ${item.type} ${item.risk}`.toLowerCase().includes(query));

    if (!filtered.length) {
        investmentGrid.innerHTML = '<p class="fund-empty">No funds match your search.</p>';
        return;
    }

    investmentGrid.innerHTML = filtered.map((item, index) => {
        const change = Number(item.dailyChange || 0);
        const returnClass = change >= 0 ? "positive" : "negative";
        const sparkline = Array.from({ length: 16 }, (_, point) => {
            const x = point * 6;
            const y = 22 - Math.sin((point + index * 2) * 0.62) * 6 - point * 0.43
                - Math.sin(point * 1.4 + index) * 2;
            return `${point === 0 ? "M" : "L"}${x},${y.toFixed(1)}`;
        }).join(" ");

        return `
            <article class="investment-card">
                <div class="fund-card-top">
                    <span class="fund-icon" aria-hidden="true">${escapeHTML(item.name.slice(0, 1))}</span>
                    <span class="fund-risk ${escapeHTML(String(item.risk).toLowerCase())}">${escapeHTML(item.risk)} risk</span>
                </div>
                <p class="fund-type">${escapeHTML(item.type)}</p>
                <h3>${escapeHTML(item.name)}</h3>
                <div class="fund-nav-row">
                    <div><span>Simulated NAV</span><strong>${formatCurrency(item.nav)}</strong></div>
                    <span class="nav-change ${returnClass}">${change > 0 ? "+" : ""}${change.toFixed(2)}% today</span>
                </div>
                <svg class="fund-sparkline ${returnClass}" viewBox="0 0 90 30" role="img"
                    aria-label="Illustrative simulated NAV movement">
                    <path d="${sparkline}" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <div class="fund-card-footer">
                    <span>Minimum investment</span><strong>${formatCurrency(item.minimum)}</strong>
                </div>
                <button class="fund-buy-button" type="button" data-buy-name="${escapeHTML(item.name)}">Invest now</button>
            </article>
        `;
    }).join("");
};

const renderHoldings = () => {
    renderPortfolioSummary();
    const updatedLabel = document.getElementById("holdingsUpdated");
    updatedLabel.textContent = `Updated ${new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
    })}`;

    if (!token) {
        holdingsContainer.innerHTML = '<p class="fund-empty">Sign in to see and manage your Mutual Fund holdings.</p>';
        return;
    }
    if (!holdings.length) {
        holdingsContainer.innerHTML = '<p class="fund-empty">No Mutual Fund holdings yet. Choose a fund above to get started.</p>';
        return;
    }

    holdingsContainer.innerHTML = holdings.map((holding) => {
        const profitLoss = Number(holding.profit_loss || 0);
        const returnClass = profitLoss >= 0 ? "positive" : "negative";
        return `
            <article class="holding-row">
                <div class="holding-fund">
                    <span class="holding-icon" aria-hidden="true">${escapeHTML(holding.product_name.slice(0, 1))}</span>
                    <div><strong>${escapeHTML(holding.product_name)}</strong><small>Invested ${formatDate(holding.created_at)}</small></div>
                </div>
                <div class="holding-metric"><span>Units</span><strong>${Number(holding.units).toFixed(4)}</strong></div>
                <div class="holding-metric"><span>Current NAV</span><strong>${formatCurrency(holding.current_nav)}</strong></div>
                <div class="holding-metric"><span>Invested</span><strong>${formatCurrency(holding.amount)}</strong></div>
                <div class="holding-metric"><span>Current value</span><strong>${formatCurrency(holding.current_value)}</strong></div>
                <div class="holding-metric ${returnClass}"><span>Total returns</span><strong>${signedCurrency(profitLoss)} (${Number(holding.return_percent).toFixed(2)}%)</strong></div>
                <button class="holding-sell-button" type="button" data-sell-id="${Number(holding.id)}"
                    data-sell-units="${Number(holding.units)}" data-sell-name="${escapeHTML(holding.product_name)}">
                    Sell units
                </button>
            </article>
        `;
    }).join("");
};

const updateWalletDisplay = async () => {
    if (!token) return;
    try {
        const data = await requestJSON(`${API}/wallet`, { headers: { Authorization: token } });
        const wallet = document.getElementById("topWallet");
        if (wallet && Number.isFinite(Number(data.balance))) {
            wallet.textContent = `₹${Number(data.balance).toLocaleString("en-IN")}`;
        }
    } catch (error) {
        console.error("Unable to refresh wallet balance after Mutual Fund trade", error);
    }
};

const showFeedback = (message, isError = false) => {
    const feedback = document.getElementById("tradeFeedback");
    feedback.textContent = message;
    feedback.classList.toggle("error", isError);
    feedback.classList.add("visible");
    window.clearTimeout(feedbackTimeout);
    feedbackTimeout = window.setTimeout(() => feedback.classList.remove("visible"), 5000);
};

const openTradeDialog = (mode, item, holding = null) => {
    if (!token) {
        showFeedback("Please sign in to invest in or sell Mutual Funds.", true);
        return;
    }

    activeTrade = { mode, item, holding };
    document.getElementById("tradeEyebrow").textContent =
        mode === "buy" ? "INVEST IN MUTUAL FUND" : "REDEEM MUTUAL FUND UNITS";
    document.getElementById("tradeTitle").textContent =
        mode === "buy" ? "Invest in fund" : "Sell fund units";
    document.getElementById("tradeFundName").textContent = item.name;
    document.getElementById("tradeNav").textContent = formatCurrency(item.nav);
    document.getElementById("tradeInputLabel").textContent = mode === "buy"
        ? "Investment amount (₹)"
        : "Units to sell";
    document.getElementById("tradeAvailableLabel").innerHTML = mode === "buy"
        ? `Minimum investment<strong>${formatCurrency(item.minimum)}</strong>`
        : `Available units<strong>${Number(holding.units).toFixed(6)}</strong>`;
    document.getElementById("tradeEstimateLabel").textContent =
        mode === "buy" ? "Estimated units" : "Estimated sale proceeds";
    document.getElementById("tradeSubmit").textContent =
        mode === "buy" ? "Confirm investment" : "Confirm sale";
    tradeInput.min = mode === "buy" ? String(item.minimum) : "0.000001";
    tradeInput.max = mode === "sell" ? String(holding.units) : "";
    tradeInput.step = mode === "buy" ? "0.01" : "0.000001";
    tradeInput.value = mode === "buy" ? String(item.minimum) : String(holding.units);
    updateTradeEstimate();
    tradeDialog.showModal();
    tradeInput.focus();
};

const updateTradeEstimate = () => {
    if (!activeTrade) return;
    const amount = Number(tradeInput.value);
    const estimate = document.getElementById("tradeEstimate");
    const submitButton = document.getElementById("tradeSubmit");
    const isBuy = activeTrade.mode === "buy";
    const isValid = Number.isFinite(amount) && amount > 0
        && (isBuy ? amount >= activeTrade.item.minimum
            : amount <= Number(activeTrade.holding.units) + 0.000001);
    estimate.textContent = !isValid
        ? "Enter a valid amount"
        : isBuy
            ? `${(amount / Number(activeTrade.item.nav)).toFixed(6)} units`
            : formatCurrency(amount * Number(activeTrade.item.nav));
    submitButton.disabled = !isValid;
};

const submitTrade = async () => {
    if (!activeTrade) return;
    const amount = Number(tradeInput.value);
    const button = document.getElementById("tradeSubmit");
    const mode = activeTrade.mode;
    const item = activeTrade.item;
    button.disabled = true;
    button.textContent = "Processing...";

    try {
        const data = await requestJSON(
            `${API}/investments/${mode === "buy" ? "order" : "sell"}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: token },
                body: JSON.stringify(mode === "buy"
                    ? { category, product_name: item.name, amount }
                    : { holding_id: activeTrade.holding.id, units: amount })
            }
        );
        tradeDialog.close();
        const message = mode === "buy"
            ? `${data.message}. ${Number(data.holding.units).toFixed(4)} units added.`
            : `${data.message}. ${formatCurrency(data.sale.proceeds)} credited to your wallet.`;
        showFeedback(message);
        await Promise.all([loadHoldings(), updateWalletDisplay()]);
    } catch (error) {
        showFeedback(error.message || "Unable to complete Mutual Fund transaction.", true);
    } finally {
        button.textContent = mode === "buy" ? "Confirm investment" : "Confirm sale";
        updateTradeEstimate();
    }
};

const refreshPortfolio = async () => {
    if (refreshing) return;
    refreshing = true;
    try {
        await loadInvestments();
        await loadHoldings();
    } catch (error) {
        console.error("Unable to refresh Mutual Fund data", error);
    } finally {
        refreshing = false;
    }
};

investmentGrid.addEventListener("click", (event) => {
    const fundButton = event.target.closest("[data-buy-name]");
    if (!fundButton) return;
    const item = investments.find((fund) => fund.name === fundButton.dataset.buyName);
    if (item) openTradeDialog("buy", item);
});

holdingsContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sell-id]");
    if (!button) return;
    const holding = holdings.find((item) => Number(item.id) === Number(button.dataset.sellId));
    const item = investments.find((fund) => fund.name === holding?.product_name);
    if (holding && item) openTradeDialog("sell", item, holding);
});

document.getElementById("investmentSearch").addEventListener("input", renderInvestments);
tradeInput.addEventListener("input", updateTradeEstimate);
document.getElementById("tradeSubmit").addEventListener("click", submitTrade);

const initialize = async () => {
    try {
        await loadComponents();
        await refreshPortfolio();
    } catch (error) {
        console.error("Unable to load Mutual Funds", error);
        investmentGrid.innerHTML = '<p class="fund-empty">Unable to load funds. Please refresh the page and try again.</p>';
        holdingsContainer.innerHTML = '<p class="fund-empty">Unable to load your holdings.</p>';
    }
};

window.setInterval(() => {
    refreshPortfolio();
}, 30000);

initialize();
