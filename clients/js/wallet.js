const API = `${window.location.origin}/api`;
const token = localStorage.getItem("token") || sessionStorage.getItem("token");

fetch("components/sidebar.html").then(res => res.text()).then(html => {
    document.getElementById("sidebar").innerHTML = html;
});
fetch("components/topbar.html").then(res => res.text()).then(html => {
    document.getElementById("topbar").innerHTML = html;
});

async function loadWallet() {
    const response = await fetch(`${API}/wallet`, { headers: { Authorization: token } });
    const data = await response.json();
    if (!response.ok || !data.success) return;
    document.getElementById("balance").textContent = `₹${Number(data.balance).toLocaleString()}`;
    document.getElementById("investment").textContent = `Investment: ₹${Number(data.investment).toLocaleString()}`;
    document.getElementById("holdings").textContent = `Holdings: ${data.totalHoldings}`;
}

document.getElementById("addMoney").addEventListener("click", async () => {
    const amount = Number(document.getElementById("amount").value);
    if (!Number.isFinite(amount) || amount <= 0) return;
    const response = await fetch(`${API}/wallet/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({ amount })
    });
    const data = await response.json();
    alert(data.message);
    if (data.success) {
        document.getElementById("amount").value = "";
        loadWallet();
    }
});

loadWallet();
