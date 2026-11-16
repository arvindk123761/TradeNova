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

/* ---------------- Market Overview ---------------- */

function loadMarketOverview(){

    document.getElementById("nifty").innerHTML =
        "25,180 <span style='color:green'>+0.82%</span>";

    document.getElementById("sensex").innerHTML =
        "82,420 <span style='color:green'>+1.14%</span>";

    document.getElementById("banknifty").innerHTML =
        "56,800 <span style='color:red'>-0.25%</span>";

}

loadMarketOverview();

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

        const user = document.getElementById("topUser");

        if (user) {

            user.innerText = data.user.full_name;

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

        data.gainers.forEach(stock => {
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

        data.losers.forEach(stock => {

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

    }

    catch(err){

        console.log(err);

    }

}

loadTopGainers();

loadTopLosers();


async function loadPortfolioChart() {

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {

        const response = await fetch(`${API}/portfolio/history`, {

            headers: {
                Authorization: token
            }

        });

        const data = await response.json();

        if (!data.success) {

            console.log(data.message);
            return;

        }

        const labels = data.history.map(item => item.created_at);

        const values = data.history.map(item =>
            Number(item.portfolio_value)
        );

        const ctx = document
            .getElementById("portfolioChart")
            .getContext("2d");

        new Chart(ctx, {

            type: "line",

            data: {

                labels,

                datasets: [

                    {

                        label: "Portfolio Value",

                        data: values,

                        borderColor: "#16a34a",

                        backgroundColor: "rgba(22,163,74,0.15)",

                        borderWidth: 3,

                        fill: true,

                        tension: 0.4

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        });

    }

    catch(err){

        console.log(err);

    }

}

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

console.log("Analytics Response:", data);

       

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

    } catch (err) {

        console.log(err);

    }

}
loadAnalytics();


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

/* ---------------- Market News Demo Briefings ---------------- */

const marketBriefings = [
    {
        category: "Markets",
        title: "What can move a broad market index?",
        summary: "Index moves reflect the combined performance of their constituent companies. A few heavily weighted stocks can influence the headline number more than others."
    },
    {
        category: "Stocks",
        title: "Reading an earnings announcement",
        summary: "Compare reported revenue and profit with the same period last year, then look at management guidance and the risks described in the filing."
    },
    {
        category: "Economy",
        title: "Why interest rates matter to equity investors",
        summary: "Rate changes can affect borrowing costs, consumer demand, and how investors value future company earnings. Their impact varies across industries."
    },
    {
        category: "Trading",
        title: "A quick guide to volatility",
        summary: "Volatility describes how much a price fluctuates over time. It does not indicate direction, and sharp moves can increase the risk of a trade."
    },
    {
        category: "Markets",
        title: "How global markets can influence local shares",
        summary: "Overseas market moves, currency changes, and commodity prices can shape sentiment, but local company and economic factors matter too."
    },
    {
        category: "Stocks",
        title: "Look beyond a stock's headline price",
        summary: "A share price alone does not tell you whether a company is expensive or cheap. Investors often consider earnings, debt, cash flow, and business risks."
    }
];

function renderMarketBriefings(category = "All") {
    const container = document.getElementById("marketNews");

    if (!container) {
        return;
    }

    container.replaceChildren();

    marketBriefings
        .filter(briefing => category === "All" || briefing.category === category)
        .forEach(briefing => {
            const article = document.createElement("article");
            article.className = "news-card";

            const label = document.createElement("span");
            label.className = "news-category";
            label.textContent = briefing.category;

            const title = document.createElement("h3");
            title.textContent = briefing.title;

            const summary = document.createElement("p");
            summary.textContent = briefing.summary;

            const source = document.createElement("span");
            source.className = "news-source";
            source.textContent = "TradeNova learning brief";

            article.append(label, title, summary, source);
            container.appendChild(article);
        });
}

document.querySelectorAll("[data-news-filter]").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll("[data-news-filter]").forEach(filter => {
            const isActive = filter === button;
            filter.classList.toggle("active", isActive);
            filter.setAttribute("aria-pressed", String(isActive));
        });

        renderMarketBriefings(button.dataset.newsFilter);
    });
});

renderMarketBriefings();