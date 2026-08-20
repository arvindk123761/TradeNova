let selectedStock = null;
let currentPrice = 0;
const API = "http://localhost:5000/api";

// Read stock ID from URL
const params = new URLSearchParams(window.location.search);
const stockId = params.get("id");

// Load stock details
async function loadStock() {

    try {

        const response = await fetch(`${API}/stocks/${stockId}`);

        const data = await response.json();

        if (!data.success) {
           showToast(data.message,"success");
            return;
        }

        const stock = data.stock;
        selectedStock = stock;
currentPrice = Number(stock.current_price);

        // Update page
        document.getElementById("companyName").innerText =
            stock.company_name;

        document.getElementById("companySymbol").innerText =
            stock.symbol;

        document.getElementById("currentPrice").innerText =
            "₹" + stock.current_price;

            loadChart(Number(stock.current_price));

        // Change today's values if your table has these columns
        document.getElementById("openPrice").innerText =
            stock.open_price ?? "-";

        document.getElementById("highPrice").innerText =
            stock.high_price ?? "-";

        document.getElementById("lowPrice").innerText =
            stock.low_price ?? "-";

        document.getElementById("current").innerText =
            stock.current_price;

        document.getElementById("volume").innerText =
            stock.volume ?? "-";

        document.getElementById("marketCap").innerText =
            stock.market_cap ?? "-";

        document.getElementById("peRatio").innerText =
            stock.pe_ratio ?? "-";

    }
    catch (err) {

        console.log(err);
showToast("Server Error","error");
    }

}

loadStock();


function loadChart(currentPrice) {

    const ctx = document.getElementById("priceChart");

    new Chart(ctx, {

        type: "line",

        data: {

            labels: [
                "9 AM",
                "10 AM",
                "11 AM",
                "12 PM",
                "1 PM",
                "2 PM",
                "3 PM"
            ],

            datasets: [{

                label: "Price",

                data: [

                    currentPrice - 18,
                    currentPrice - 10,
                    currentPrice - 6,
                    currentPrice - 3,
                    currentPrice + 2,
                    currentPrice + 8,
                    currentPrice

                ],

                borderColor: "#2e7d32",

                backgroundColor: "rgba(46,125,50,.1)",

                fill: true,

                tension: .4

            }]

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

function openBuyModal() {

    document.getElementById("buyModal").style.display = "flex";

    document.getElementById("buyCompany").innerText =
        selectedStock.company_name;

    document.getElementById("buyPrice").innerText =
        "₹" + currentPrice;

    document.getElementById("buyQty").value = 1;

    calculateTotal();

}

function closeBuyModal(){

    document.getElementById("buyModal").style.display = "none";

}

function calculateTotal(){

    const qty = Number(document.getElementById("buyQty").value);

    const total = qty * currentPrice;

    document.getElementById("buyTotal").innerText =
        "₹" + total.toFixed(2);

}

async function confirmBuy() {

    const quantity = Number(
        document.getElementById("buyQty").value
    );

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {

        const response = await fetch(
            "http://localhost:5000/api/trade/buy",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: token

                },

                body: JSON.stringify({

                    stock_id: selectedStock.id,

                    quantity: quantity,

                    buy_price: currentPrice

                })

            }
        );

        const data = await response.json();

       showToast(data.message,"success");

        if(data.success){

            closeBuyModal();

        }

    }

    catch(err){

        console.log(err);

      showToast("Server Error","error");

    }

}

function openSellModal(){

    document.getElementById("sellModal").style.display = "flex";

    document.getElementById("sellCompany").innerText =
        selectedStock.company_name;

    document.getElementById("sellPrice").innerText =
        "₹" + currentPrice;

    document.getElementById("sellQty").value = 1;

    calculateSellTotal();

}

function closeSellModal(){

    document.getElementById("sellModal").style.display = "none";

}

function calculateSellTotal(){

    const qty = Number(
        document.getElementById("sellQty").value
    );

    const total = qty * currentPrice;

    document.getElementById("sellTotal").innerText =
        "₹" + total.toFixed(2);

}
async function confirmSell() {

    const quantity = Number(
        document.getElementById("sellQty").value
    );

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    try {

        // Get portfolio first
        const portfolioResponse = await fetch(
            "http://localhost:5000/api/portfolio",
            {
                headers: {
                    Authorization: token
                }
            }
        );

        const portfolioData = await portfolioResponse.json();

        if (!portfolioData.success) {
            return alert("Unable to load portfolio");
        }

        // Find this stock in portfolio
        const portfolioStock = portfolioData.portfolio.find(
            item => item.stock_id == selectedStock.id
        );

        if (!portfolioStock) {
            return alert("You don't own this stock.");
        }

        // Sell API
        const response = await fetch(
            "http://localhost:5000/api/trade/sell",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: token
                },

                body: JSON.stringify({
                    portfolio_id: portfolioStock.id,
                    quantity: quantity
                })
            }
        );

        const data = await response.json();

       showToast(data.message,"success");

        if (data.success) {
            closeSellModal();
        }

    } catch (err) {

        console.log(err);
      showToast("Server Error","error");

    }
}