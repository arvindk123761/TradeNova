const savedSettings = JSON.parse(localStorage.getItem("tradenovaSettings") || "null");

if (savedSettings) {
    document.body.classList.toggle("dark-mode", savedSettings.dark_mode === true);
    document.body.classList.toggle("compact-view", savedSettings.compact_view === true);
    document.body.classList.toggle("reduced-motion", savedSettings.animation === false);
}

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