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

let marketNewsItems = [];
let selectedNewsCategory = "All";

function renderMarketNews(category = selectedNewsCategory) {
    const container = document.getElementById("marketNews");

    if (!container) {
        return;
    }

    container.replaceChildren();

    const articles = marketNewsItems.filter(item =>
        category === "All" || item.category === category
    );

    if (articles.length === 0) {
        const emptyState = document.createElement("p");
        emptyState.className = "news-state";
        emptyState.textContent = "No headlines are available in this category right now.";
        container.appendChild(emptyState);
        return;
    }

    articles.forEach(item => {
        const article = document.createElement("article");
        article.className = "news-card";

        const label = document.createElement("span");
        label.className = "news-category";
        label.textContent = item.category;

        const title = document.createElement("a");
        title.className = "news-title";
        title.href = item.url;
        title.target = "_blank";
        title.rel = "noopener noreferrer";
        title.textContent = item.title;

        const source = document.createElement("span");
        source.className = "news-source";
        source.textContent = item.source;

        if (item.publishedAt) {
            const published = new Date(item.publishedAt);
            if (!Number.isNaN(published.getTime())) {
                source.textContent += ` · ${published.toLocaleString()}`;
            }
        }

        article.append(label, title, source);
        container.appendChild(article);
    });
}

document.querySelectorAll("[data-news-filter]").forEach(button => {
    button.addEventListener("click", () => {
        selectedNewsCategory = button.dataset.newsFilter;

        document.querySelectorAll("[data-news-filter]").forEach(filter => {
            const isActive = filter === button;
            filter.classList.toggle("active", isActive);
            filter.setAttribute("aria-pressed", String(isActive));
        });

        renderMarketNews();
    });
});

async function loadMarketNews() {
    const container = document.getElementById("marketNews");
    if (!container) {
        return;
    }

    container.replaceChildren();
    const loading = document.createElement("p");
    loading.className = "news-state";
    loading.textContent = "Loading latest headlines...";
    container.appendChild(loading);

    try {
        const response = await fetch(`${API}/dashboard/news`);
        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error("The news service returned an unreadable response. Open the dashboard through the TradeNova server and check its API settings.");
        }

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to load live news.");
        }

        marketNewsItems = data.news;
        renderMarketNews();
    } catch (error) {
        const message = document.createElement("p");
        message.className = "news-state news-error";
        message.textContent = error.message || "Unable to load live news. Please try again later.";
        container.replaceChildren(message);
    }
}

loadMarketNews();
setInterval(loadMarketNews, 60 * 60 * 1000);