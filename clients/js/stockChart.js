(function () {
    function createRandom(seed) {
        let value = seed >>> 0;
        return function () {
            value = (value * 1664525 + 1013904223) >>> 0;
            return value / 4294967296;
        };
    }

    function stockSeed(stockId, symbol) {
        const source = String(stockId || symbol || "stock");
        let seed = 2166136261;
        for (let index = 0; index < source.length; index += 1) {
            seed ^= source.charCodeAt(index);
            seed = Math.imul(seed, 16777619);
        }
        return seed >>> 0;
    }

    function createYearPrices(currentPrice, seed) {
        const random = createRandom(seed);
        const prices = new Array(252);
        prices[251] = currentPrice;

        for (let index = 250; index >= 0; index -= 1) {
            const dailyReturn = (random() - 0.5) * 0.018;
            prices[index] = prices[index + 1] / (1 + dailyReturn);
        }

        return prices.map(price => Math.max(0.01, price));
    }

    function createTradingDates(count) {
        const dates = [new Date()];
        while (dates.length < count) {
            const previousDate = new Date(dates[dates.length - 1]);
            previousDate.setDate(previousDate.getDate() - 1);
            if (previousDate.getDay() !== 0 && previousDate.getDay() !== 6) {
                dates.push(previousDate);
            }
        }
        return dates.reverse();
    }

    function formatLabel(date, range, index, total) {
        if (range === "day") {
            return date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });
        }

        if (range === "year") {
            return index % 21 === 0 || index === total - 1
                ? date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" })
                : "";
        }

        return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }

    function getSeries(stock, range) {
        const currentPrice = Number(stock.current_price);
        const seed = stockSeed(stock.id, stock.symbol);
        const yearPrices = createYearPrices(currentPrice, seed);
        const yearlyStats = {
            low: Math.min(...yearPrices),
            high: Math.max(...yearPrices)
        };
        let values;
        let dates;

        if (range === "year") {
            values = yearPrices;
            dates = createTradingDates(yearPrices.length);
        } else if (range === "month" || range === "week") {
            const count = range === "month" ? 22 : 5;
            values = yearPrices.slice(-count);
            dates = createTradingDates(yearPrices.length).slice(-count);
        } else {
            const random = createRandom(seed ^ 0x9e3779b9);
            const previousClose = currentPrice / (1 + (Number(stock.change_percent) || 0) / 100);
            values = Array.from({ length: 25 }, (_, index) => {
                if (index === 24) return currentPrice;
                const progress = index / 24;
                const movement = Math.sin(progress * Math.PI * 3) * currentPrice * 0.004
                    + (random() - 0.5) * currentPrice * 0.003;
                return Math.max(0.01, previousClose + (currentPrice - previousClose) * progress + movement);
            });
            values[0] = previousClose;
            dates = values.map((_, index) => {
                const date = new Date();
                date.setHours(9 + Math.floor(index / 4), (index % 4) * 15, 0, 0);
                return date;
            });
        }

        return {
            labels: dates.map((date, index) => formatLabel(date, range, index, values.length)),
            values,
            yearlyStats
        };
    }

    function create(options) {
        const canvas = options.canvas;
        const chart = new Chart(canvas, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: "Price",
                    data: [],
                    borderColor: "#2563eb",
                    backgroundColor: "rgba(37, 99, 235, 0.12)",
                    borderWidth: 2,
                    fill: true,
                    tension: 0.25,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { intersect: false, mode: "index" },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context => `₹${Number(context.parsed.y).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { maxTicksLimit: 7, maxRotation: 0 }
                    },
                    y: {
                        grid: { color: "rgba(148, 163, 184, 0.18)" },
                        ticks: {
                            maxTicksLimit: 5,
                            callback: value => `₹${Number(value).toLocaleString("en-IN")}`
                        }
                    }
                }
            }
        });

        let activeStock = null;
        let activeRange = "day";

        function render() {
            if (!activeStock) return;
            const series = getSeries(activeStock, activeRange);
            chart.data.labels = series.labels;
            chart.data.datasets[0].data = series.values;
            chart.update();

            if (options.highElement) {
                options.highElement.textContent = `₹${series.yearlyStats.high.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            }
            if (options.lowElement) {
                options.lowElement.textContent = `₹${series.yearlyStats.low.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`;
            }
        }

        options.rangeButtons.forEach(button => {
            button.addEventListener("click", () => {
                activeRange = button.dataset.range;
                options.rangeButtons.forEach(item => {
                    const isActive = item === button;
                    item.classList.toggle("active", isActive);
                    item.setAttribute("aria-pressed", String(isActive));
                });
                render();
            });
        });

        return {
            update(stock) {
                activeStock = stock;
                activeRange = "day";
                options.rangeButtons.forEach(button => {
                    const isActive = button.dataset.range === activeRange;
                    button.classList.toggle("active", isActive);
                    button.setAttribute("aria-pressed", String(isActive));
                });
                render();
            },
            destroy() {
                chart.destroy();
            }
        };
    }

    window.TradeNovaStockChart = { create };
})();
