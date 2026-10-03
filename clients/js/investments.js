const API = `${window.location.origin}/api`;
const category = document.body.dataset.category;
const title = document.body.dataset.title;
let investments = [];

fetch("components/sidebar.html").then(res => res.text()).then(html => { document.getElementById("sidebar").innerHTML = html; });
fetch("components/topbar.html").then(res => res.text()).then(html => { document.getElementById("topbar").innerHTML = html; });

document.getElementById("pageTitle").textContent = title;
document.getElementById("pageDescription").textContent = `${title} products available to explore in TradeNova.`;

async function loadInvestments() {
    const response = await fetch(`${API}/investments/${category}`);
    const data = await response.json();
    if (!response.ok || !data.success) {
        document.getElementById("investmentGrid").textContent = data.message || "Unable to load investments";
        return;
    }
    investments = data.investments;
    renderInvestments(investments);
        loadHoldings();
}

    async function loadHoldings() {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch(`${API}/investments/holdings`, {
            headers: { Authorization: token }
        });
        const data = await response.json();
        const container = document.getElementById("myInvestments");
        const holdings = (data.holdings || []).filter(item => item.category === category);

        container.innerHTML = holdings.length
            ? holdings.map(item => `<div class="holding-row"><strong>${item.product_name}</strong><span>₹${Number(item.amount).toLocaleString()}</span><small>${new Date(item.created_at).toLocaleDateString()}</small></div>`).join("")
            : "No investments in this category yet.";
    }

function renderInvestments(items) {
    document.getElementById("investmentGrid").innerHTML = items.map((item, index) => `
        <article class="investment-card">
            <h2>${item.name}</h2>
            <p>${item.type}</p>
            <p>Risk: <strong>${item.risk}</strong></p>
            <p>Minimum: ₹${Number(item.minimum).toLocaleString()}</p>
            <div class="return">${item.returnRate}</div>
            <button type="button" data-index="${index}">Invest Now</button>
        </article>
    `).join("");

    document.querySelectorAll(".investment-card button").forEach(button => {
        button.addEventListener("click", async () => {
            const item = items[Number(button.dataset.index)];
            const amount = Number(prompt(`Enter amount to invest (minimum ₹${item.minimum}):`, item.minimum));
            if (!Number.isFinite(amount) || amount < item.minimum) return;

            const response = await fetch(`${API}/investments/order`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") || sessionStorage.getItem("token") },
                body: JSON.stringify({ category, product_name: item.name, amount })
            });
            const data = await response.json();
            alert(data.message);
            if (data.success) {
                button.textContent = "Invested";
                loadHoldings();
            }
        });
    });
}

document.getElementById("investmentSearch").addEventListener("input", event => {
    const value = event.target.value.toLowerCase();
    renderInvestments(investments.filter(item => `${item.name} ${item.type} ${item.risk}`.toLowerCase().includes(value)));
});

loadInvestments();
