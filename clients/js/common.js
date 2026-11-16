const darkModeStorageKey = "tradenovaDarkMode";
let darkModeEnabled = localStorage.getItem(darkModeStorageKey) === "true";

if (localStorage.getItem(darkModeStorageKey) === null) {
    try {
        const previousSettings = JSON.parse(localStorage.getItem("tradenovaSettings") || "null");
        darkModeEnabled = previousSettings?.dark_mode === true;
    } catch (error) {
        console.error("Unable to read the saved TradeNova theme preference", error);
    }
}

const applyDarkMode = () => {
    document.body.classList.toggle("dark-mode", darkModeEnabled);
    const toggle = document.getElementById("darkModeToggle");
    if (!toggle) return;

    toggle.setAttribute("aria-pressed", String(darkModeEnabled));
    toggle.querySelector(".theme-toggle-icon").textContent = darkModeEnabled ? "☀️" : "🌙";
    toggle.querySelector(".theme-toggle-label").textContent = darkModeEnabled ? "Light mode" : "Dark mode";
};

applyDarkMode();

const themeObserver = new MutationObserver(() => {
    if (!document.getElementById("darkModeToggle")) return;
    applyDarkMode();
    themeObserver.disconnect();
});
themeObserver.observe(document.documentElement, { childList: true, subtree: true });

document.addEventListener("click", (event) => {
    const toggle = event.target.closest("#darkModeToggle");
    if (!toggle) return;

    darkModeEnabled = !darkModeEnabled;
    localStorage.setItem(darkModeStorageKey, String(darkModeEnabled));
    applyDarkMode();
});

window.addEventListener("load", () => {

    const page =
    location.pathname.split("/").pop();

    const map = {
        "dashboard.html":"dashboardLink",
        "stocks.html":"stocksLink",
        "portfolio.html":"portfolioLink",
        "watchlist.html":"watchlistLink",
        "orders.html":"ordersLink",
        "profile.html":"profileLink",
        "ipo.html":"ipoLink"
    };

    const id = map[page];

    if(id){

        const item = document.getElementById(id);

        if(item){

            item.classList.add("active");

        }

    }

});