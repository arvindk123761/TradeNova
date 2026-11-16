/* ---------------- Load Sidebar ---------------- */

fetch("components/sidebar.html")

.then(response => response.text())

.then(data => {

    document.getElementById("sidebar").innerHTML = data;

});

/* ------------ Load Topbar ------------ */

fetch("components/topbar.html")

.then(response => response.text())

.then(data=>{

document.getElementById("topbar").innerHTML=data;

});
const API = `${window.location.origin}/api`;

function updateTodayDate() {
    const dateElement = document.getElementById("todayDate");

    if (dateElement) {
        dateElement.textContent = new Intl.DateTimeFormat(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(new Date());
    }
}

updateTodayDate();
setInterval(updateTodayDate, 60 * 1000);

async function loadDashboard() {

    try {

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await fetch(`${API}/wallet`, {
            headers: {
                Authorization: token
            }
        });

        const data = await response.json();
if (!data.success) {
    console.log("Wallet API Error:", data);
  showToast(data.message, "success");
    return;
}

        document.getElementById("wallet").innerText =
            "₹" + Number(data.balance).toLocaleString();

        document.getElementById("investment").innerText =
            "₹" + Number(data.investment).toLocaleString();

       document.getElementById("stocks").innerText =
    data.totalHoldings;
    document.getElementById("heroWallet").innerText =
    "₹" + Number(data.balance).toLocaleString();

document.getElementById("heroHoldings").innerText =
    data.totalHoldings;
    } catch (err) {

        console.log(err);
        showToast("Server Error","error");

    }

}



async function loadRecentOrders() {

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const response = await fetch(`${API}/orders/recent`, {

        headers: {

            Authorization: token

        }

    });

    const data = await response.json();

    const tbody = document.getElementById("recentOrders");

    tbody.innerHTML = "";

    data.orders.forEach(order => {

        tbody.innerHTML += `

        <tr>

            <td>${order.company_name}</td>

            <td>${order.order_type}</td>

            <td>${order.quantity}</td>

            <td>₹${order.price}</td>

        </tr>

        `;

    });

}

loadDashboard();

loadRecentOrders();

document.getElementById("addMoneyBtn").addEventListener("click", async () => {

    const amount = prompt("Enter amount to add:");

    if (!amount || Number(amount) <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {

        const response = await fetch(`${API}/wallet/add`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },

            body: JSON.stringify({
                amount: Number(amount)
            })

        });

        const data = await response.json();

       showToast(data.message, "success");

        if (data.success) {

           loadDashboard();

setInterval(loadDashboard, 5000);

        }

    } catch (err) {

        console.log(err);

       showToast("Server Error","error");

    }

});

async function loadUser() {

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const response = await fetch(`${API}/profile`, {

        headers: {
            Authorization: token
        }

    });

    const data = await response.json();

    console.log("Profile Response:", data);

    if (data.success && data.user) {

        try {
            const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...savedUser, ...data.user }));
        } catch (error) {
            console.error("Unable to cache the latest TradeNova profile", error);
        }

        const user = document.getElementById("topUser");

        if (user) {

            user.innerText = data.user.full_name;

        }

        const avatar = document.getElementById("topUserAvatar");
        if (avatar) {
            const initial = String(data.user.full_name || data.user.email || "U").trim().charAt(0).toLocaleUpperCase() || "U";
            avatar.textContent = initial;
            avatar.setAttribute("aria-label", `${data.user.full_name || "User"} profile`);
        }

    } else {

        console.log("Profile Error:", data);

    }

}

async function loadTopGainers() {

    try {

        const response = await fetch(`${API}/stocks/top-gainers`);

        const data = await response.json();

        const container = document.getElementById("topGainers");

        container.innerHTML = "";

        (data.gainers || []).filter(stock => Number(stock.change_percent) > 0).forEach(stock => {
container.innerHTML += `

<div class="market-item">

    <div>

        <h4>${stock.company_name}</h4>

        <small>₹${Number(stock.current_price).toFixed(2)}</small>

    </div>

    <span class="${Number(stock.change_percent) >= 0 ? "gain" : "loss"}">

        ${Number(stock.change_percent) >= 0 ? "▲" : "▼"} ${stock.change_percent}%

    </span>

</div>

`;

        });

        if (!container.children.length) {
            container.innerHTML = `<p class="market-empty">No stocks are currently gaining.</p>`;
        }

    }

    catch(err){

        console.log(err);

    }

}


async function loadTopLosers() {

    try {

        const response = await fetch(`${API}/stocks/top-losers`);

        const data = await response.json();

        const container = document.getElementById("topLosers");

        container.innerHTML = "";

        (data.losers || []).filter(stock => Number(stock.change_percent) < 0).forEach(stock => {

           container.innerHTML += `

<div class="market-item">

    <div>

        <h4>${stock.company_name}</h4>

        <small>₹${Number(stock.current_price).toFixed(2)}</small>

    </div>

    <span class="${Number(stock.change_percent) >= 0 ? "gain" : "loss"}">

        ${Number(stock.change_percent) >= 0 ? "▲" : "▼"} ${stock.change_percent}%

    </span>

</div>

`;

        });

        if (!container.children.length) {
            container.innerHTML = `<p class="market-empty">No stocks are currently losing.</p>`;
        }

    }

    catch(err){

        console.log(err);

    }

}

loadTopGainers();

loadTopLosers();


let portfolioChart;
let portfolioChartRange = "day";
let currentPortfolioValue = 0;
let portfolioHistoryRequest = 0;

function formatPortfolioValue(value) {
    return `₹${Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function refreshPortfolioChartValue() {
    const valueElement = document.getElementById("portfolioChartCurrentValue");
    const updatedElement = document.getElementById("portfolioChartUpdated");
    if (valueElement) valueElement.textContent = formatPortfolioValue(currentPortfolioValue);
    if (updatedElement) {
        updatedElement.textContent = `Current portfolio value · updated ${new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        })}`;
    }

    if (portfolioChart) {
        const values = portfolioChart.data.datasets[0].data;
        if (values.length) {
            values[values.length - 1] = currentPortfolioValue;
            portfolioChart.update("none");
        }
    }
}

function formatPortfolioHistoryLabel(value, range) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    if (range === "day") {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (range === "week") {
        return date.toLocaleDateString([], { weekday: "short", hour: "2-digit" });
    }
    if (range === "month") {
        return date.toLocaleDateString([], { day: "numeric", month: "short" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function renderPortfolioChart(history, range) {
    const validHistory = history
        .map(item => ({
            date: item.created_at,
            value: Number(item.portfolio_value)
        }))
        .filter(item => Number.isFinite(item.value) && item.date);

    const maxHistoricalPoints = 120;
    const sampleEvery = Math.max(1, Math.ceil(validHistory.length / maxHistoricalPoints));
    const sampledHistory = validHistory.filter((_, index) =>
        index % sampleEvery === 0 || index === validHistory.length - 1
    );
    const labels = sampledHistory.map(item => formatPortfolioHistoryLabel(item.date, range));
    const values = sampledHistory.map(item => item.value);
    labels.push("Now");
    values.push(currentPortfolioValue);

    if (!portfolioChart) {
        const context = document.getElementById("portfolioChart").getContext("2d");
        portfolioChart = new Chart(context, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Portfolio value",
                    data: values,
                    borderColor: "#16806d",
                    backgroundColor: (contextInfo) => {
                        const chart = contextInfo.chart;
                        const area = chart.chartArea;
                        if (!area) return "rgba(22,128,109,0.12)";
                        const gradient = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
                        gradient.addColorStop(0, "rgba(22,128,109,0.22)");
                        gradient.addColorStop(1, "rgba(22,128,109,0.015)");
                        return gradient;
                    },
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHitRadius: 12,
                    fill: true,
                    tension: 0.32
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: "index",
                    intersect: false
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context => `Portfolio value: ${formatPortfolioValue(context.parsed.y)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { maxTicksLimit: 8, maxRotation: 0 }
                    },
                    y: {
                        grace: "8%",
                        ticks: {
                            maxTicksLimit: 6,
                            callback: value => `₹${Number(value).toLocaleString("en-IN")}`
                        }
                    }
                }
            }
        });
    } else {
        portfolioChart.data.labels = labels;
        portfolioChart.data.datasets[0].data = values;
        portfolioChart.update("none");
    }

    const updatedElement = document.getElementById("portfolioChartUpdated");
    if (!validHistory.length) {
        updatedElement.textContent = "History is collecting now; past values appear as snapshots are recorded.";
    } else if (validHistory.length === 1) {
        updatedElement.textContent = "Building portfolio history · snapshots are saved every 5 minutes.";
    } else {
        updatedElement.textContent = `${sampledHistory.length} historical points · current value updates every 5 seconds`;
    }
}

async function loadPortfolioChart(range = portfolioChartRange) {
    const requestId = ++portfolioHistoryRequest;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
        const response = await fetch(`${API}/portfolio/history?range=${encodeURIComponent(range)}`, {
            headers: { Authorization: token }
        });
        const data = await response.json();
        if (!response.ok || !data.success || !Array.isArray(data.history)) {
            throw new Error(data.message || `Unable to load portfolio history (${response.status})`);
        }
        if (requestId !== portfolioHistoryRequest) return;

        portfolioChartRange = range;
        renderPortfolioChart(data.history, range);
        document.querySelectorAll("[data-portfolio-range]").forEach(button => {
            const selected = button.dataset.portfolioRange === range;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-pressed", String(selected));
        });
    } catch (error) {
        console.error("Unable to load portfolio performance history", error);
        const updatedElement = document.getElementById("portfolioChartUpdated");
        if (updatedElement) updatedElement.textContent = "Portfolio history could not be loaded. Please try again.";
    }
}

document.querySelectorAll("[data-portfolio-range]").forEach(button => {
    button.addEventListener("click", () => loadPortfolioChart(button.dataset.portfolioRange));
});

loadPortfolioChart();

async function loadAnalytics() {

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {

        const response = await fetch(`${API}/portfolio/summary`, {

            headers: {
                Authorization: token
            }

        });

        const data = await response.json();

if (!data.success) {

            console.log(data.message);
            return;

        }

        document.getElementById("totalInvestment").innerText =
            "₹" + Number(data.investment || 0).toLocaleString();

        document.getElementById("currentValue").innerText =
            "₹" + Number(data.currentValue || 0).toLocaleString();

        document.getElementById("totalProfit").innerText =
            "₹" + Number(data.profit || 0).toLocaleString();

        currentPortfolioValue = Number(data.currentValue) || 0;
        refreshPortfolioChartValue();

    } catch (err) {

        console.log(err);

    }

}
loadAnalytics();
setInterval(loadAnalytics, 5000);


async function loadTicker() {

    try {

        const response = await fetch(`${API}/stocks`);

        const data = await response.json();

        const ticker = document.getElementById("tickerContent");

        ticker.innerHTML = "";

        data.stocks.forEach(stock => {

            const color =
                stock.change_percent >= 0
                    ? "#22c55e"
                    : "#ef4444";

            const arrow =
                stock.change_percent >= 0
                    ? "▲"
                    : "▼";

            ticker.innerHTML += `

            <span style="color:${color};font-weight:600;">

                ${stock.company_name}

                ₹${Number(stock.current_price).toFixed(2)}

                ${arrow}

                ${stock.change_percent}%

            </span>

            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

            `;

        });

    }

    catch(err){

        console.log(err);

    }

}

loadTicker();

setInterval(loadTicker,5000);
