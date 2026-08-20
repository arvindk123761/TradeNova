// Wait until sidebar is loaded
document.addEventListener("DOMContentLoaded", () => {

    const currentPage = window.location.pathname.split("/").pop();

    setTimeout(() => {

        const menuMap = {

            "dashboard.html": "dashboardLink",

            "stocks.html": "stocksLink",

            "portfolio.html": "portfolioLink",

            "watchlist.html": "watchlistLink",

            "orders.html": "ordersLink",

            "profile.html": "profileLink",

            "ipo.html": "ipoLink",

            "mutualfunds.html": "mutualFundsLink",

            "etfs.html": "etfsLink"

        };

        const activeId = menuMap[currentPage];

        if(activeId){

            const item = document.getElementById(activeId);

            if(item){

                item.classList.add("active");

            }

        }

    },300);

});