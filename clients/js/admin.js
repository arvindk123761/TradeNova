const API = "http://localhost:5000/api/admin";

const body = document.getElementById("stockBody");

// Load all stocks
async function loadStocks() {

    const res = await fetch(API);
    const data = await res.json();

    body.innerHTML = "";

    data.stocks.forEach(stock => {

        body.innerHTML += `
        <tr>

            <td>${stock.id}</td>

            <td>${stock.company_name}</td>

            <td>${stock.symbol}</td>

            <td>₹${stock.current_price}</td>

            <td>

                <button onclick="editPrice(${stock.id})">
                    Edit
                </button>

                <button onclick="deleteStock(${stock.id})">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

}

// Add Stock
async function addStock() {

    const company_name =
        document.getElementById("company").value;

    const symbol =
        document.getElementById("symbol").value;

    const current_price =
        document.getElementById("price").value;

    const res = await fetch(`${API}/add`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            company_name,
            symbol,
            current_price
        })

    });

    const data = await res.json();

    alert(data.message);

    loadStocks();

}

// Delete Stock
async function deleteStock(id) {

    if (!confirm("Delete this stock?")) return;

    const res = await fetch(`${API}/delete/${id}`, {

        method: "DELETE"

    });

    const data = await res.json();

    alert(data.message);

    loadStocks();

}

// Edit Price
async function editPrice(id) {

    const price = prompt("Enter New Price");

    if (!price) return;

    const res = await fetch(`${API}/update/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            current_price: price

        })

    });

    const data = await res.json();

    alert(data.message);

    loadStocks();

}

loadStocks();