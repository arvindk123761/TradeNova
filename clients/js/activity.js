const API = "http://localhost:5000/api";
const token = localStorage.getItem("token") || sessionStorage.getItem("token");

fetch("components/sidebar.html").then(res => res.text()).then(html => {
    document.getElementById("sidebar").innerHTML = html;
});
fetch("components/topbar.html").then(res => res.text()).then(html => {
    document.getElementById("topbar").innerHTML = html;
});

async function loadActivities() {
    const response = await fetch(`${API}/activity`, { headers: { Authorization: token } });
    const data = await response.json();
    const list = document.getElementById("activityList");

    if (!response.ok || !data.success) {
        list.textContent = data.message || "Unable to load activity";
        return;
    }

    list.innerHTML = data.activities.length
        ? data.activities.map(item => `<div class="activity-item"><span>${item.activity}</span><time>${new Date(item.created_at).toLocaleString()}</time></div>`).join("")
        : "No activity yet.";
}

loadActivities();
