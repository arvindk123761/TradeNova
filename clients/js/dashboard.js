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
const API = "http://localhost:5000/api";

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
            const topWallet =
document.getElementById("topWallet");

if(topWallet){

topWallet.innerText =
"₹"+Number(data.balance).toLocaleString();

}

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