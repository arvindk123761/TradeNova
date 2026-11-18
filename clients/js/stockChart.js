(function () {
    const yearlyHistory = new Map();

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

    function getYearPrices(stock, currentPrice, seed) {
        const key = String(stock.id || stock.symbol || "stock");
        let prices = yearlyHistory.get(key);

        if (!prices) {
            prices = createYearPrices(currentPrice, seed);
        } else {
            prices = prices.slice();
            prices[prices.length - 1] = Math.max(0.01, currentPrice);
        }

        yearlyHistory.set(key, prices);
        return prices;
    }

    function createTradingDates(count) {
        const dates = [];
        const cursor = new Date();
        while (dates.length < count) {
            if (cursor.getDay() !== 0 && cursor.getDay() !== 6) {
                dates.push(new Date(cursor));
            }
            cursor.setDate(cursor.getDate() - 1);
        }
        return dates.reverse();
    }

    function formatMarketCap(value) {
        if (value === null || value === undefined || value === "") return "Not available";
        const normalized = String(value).trim().replace(/[₹$,\s]/g, "");
        const match = normalized.match(/^([-+]?\d*\.?\d+)(t|trillion|b|bn|billion|m|mn|million|k|thousand|cr|crores?|l|lakhs?)?$/i);
        if (!match) return "Not available";
        const units = {
            t: 1e12, trillion: 1e12,
            b: 1e9, bn: 1e9, billion: 1e9,
            m: 1e6, mn: 1e6, million: 1e6,
            k: 1e3, thousand: 1e3,
            cr: 1e7, crore: 1e7, crores: 1e7,
            l: 1e5, lakh: 1e5, lakhs: 1e5
        };
        const amount = Number(match[1]) * (units[(match[2] || "").toLowerCase()] || 1);
        if (!Number.isFinite(amount)) return "Not available";
        return `₹${amount.toLocaleString("en-IN", {
            maximumFractionDigits: 2
        })}`;
    }

    function getSector(stock) {
        if (stock.sector && String(stock.sector).trim()) return String(stock.sector).trim();

        const identity = `${stock.symbol || ""} ${stock.company_name || ""}`.toLowerCase();
        const sectors = [
            [/hdfc|icici|kotak|axis|sbi|bank|federal|indusind|idfc/, "Banking"],
            [/adani.?power|powergrid|ntpc|coal.?india|tata.?power|jsw.?energy/, "Energy & Utilities"],
            [/infosys|tcs|wipro|hcl|tech.?mahindra|persistent|ltimindtree/, "Information Technology"],
            [/itc|hindustan.?unilever|britannia|nestle|dabur|godrej.?consumer/, "Consumer Goods"],
            [/sun.?pharma|cipla|dr.?reddy|divis.?lab|apollo.?hospital/, "Healthcare"],
            [/maruti|tata.?motor|mahindra|eicher|bajaj.?auto|ola.?electric/, "Automobiles"],
            [/reliance/, "Energy & Retail"],
            [/adani.?ports|container.?corp/, "Transportation & Logistics"],
            [/arvind/, "Textiles"]
        ];

        const match = sectors.find(([pattern]) => pattern.test(identity));
        return match ? match[1] : "Sector not provided";
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
        const yearPrices = getYearPrices(stock, currentPrice, seed);
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

    function analyzePrices(values, range) {
        const thresholds = { day: 0.15, week: 0.35, month: 0.75 };
        if (!Object.prototype.hasOwnProperty.call(thresholds, range)) {
            throw new RangeError("Choose day, week, or month for stock signal analysis.");
        }
        if (!Array.isArray(values) || values.length < 2 ||
            values.some(value => !Number.isFinite(Number(value)) || Number(value) <= 0)) {
            throw new TypeError("At least two positive chart prices are required for signal analysis.");
        }

        const prices = values.map(Number);
        const currentPrice = prices[prices.length - 1];
        const firstPrice = prices[0];
        const averageWindow = Math.min(5, prices.length);
        const movingAverage = prices.slice(-averageWindow).reduce((sum, price) => sum + price, 0) / averageWindow;
        const changePercent = ((currentPrice - firstPrice) / firstPrice) * 100;
        let risingCount = 0;
        let fallingCount = 0;

        for (let index = 1; index < prices.length; index += 1) {
            if (prices[index] > prices[index - 1]) risingCount += 1;
            if (prices[index] < prices[index - 1]) fallingCount += 1;
        }

        const momentumDirection = changePercent >= thresholds[range]
            ? 1
            : changePercent <= -thresholds[range] ? -1 : 0;
        const averageDirection = currentPrice > movingAverage ? 1 : currentPrice < movingAverage ? -1 : 0;
        const intervalDirection = risingCount > fallingCount ? 1 : fallingCount > risingCount ? -1 : 0;
        const bullishConfirmations = [averageDirection, intervalDirection]
            .filter(direction => direction > 0).length;
        const bearishConfirmations = [averageDirection, intervalDirection]
            .filter(direction => direction < 0).length;
        const signal = momentumDirection > 0 && bullishConfirmations >= 1
            ? "bullish"
            : momentumDirection < 0 && bearishConfirmations >= 1 ? "bearish" : "neutral";

        return {
            signal,
            changePercent,
            thresholdPercent: thresholds[range],
            momentumDirection,
            currentPrice,
            movingAverage,
            averageWindow,
            risingCount,
            fallingCount,
            bullishConfirmations,
            bearishConfirmations,
            prices
        };
    }

    function analyze(stock, range) {
        return analyzePrices(getSeries(stock, range).values, range);
    }
    function createIllustrativeCandles(values) {
        return values.map((close, index) => {
            const open = index === 0 ? close * 0.999 : values[index - 1];
            const wick = Math.max(Math.abs(close - open) * 0.35, close * 0.0012);
            return {
                open,
                high: Math.max(open, close) + wick,
                low: Math.max(0.01, Math.min(open, close) - wick),
                close
            };
        });
    }
    const candlestickPlugin = {
        id: "tradeNovaCandlesticks",
        afterDatasetsDraw(chart, args, pluginOptions) {
            if (!pluginOptions.enabled || !chart.$tradeNovaCandles) return;
            const { ctx, chartArea, scales: { x, y } } = chart;
            const candles = chart.$tradeNovaCandles;
            const step = candles.length > 1
                ? Math.abs(x.getPixelForValue(1) - x.getPixelForValue(0))
                : chartArea.width;
            const bodyWidth = Math.max(2, Math.min(12, step * 0.58));
            ctx.save();
            ctx.beginPath();
            ctx.rect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
            ctx.clip();
            candles.forEach((candle, index) => {
                const center = chartArea.left + ((index + 0.5) / candles.length) * chartArea.width;
                const rising = candle.close >= candle.open;
                const color = rising ? "#16a34a" : "#dc2626";
                const openY = y.getPixelForValue(candle.open);
                const closeY = y.getPixelForValue(candle.close);
                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.max(2, Math.abs(closeY - openY));
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.lineWidth = 1.25;
                ctx.beginPath();
                ctx.moveTo(center, y.getPixelForValue(candle.high));
                ctx.lineTo(center, y.getPixelForValue(candle.low));
                ctx.stroke();
                ctx.fillRect(center - bodyWidth / 2, bodyTop, bodyWidth, bodyHeight);

                if (index === candles.length - 1) {
                    const latestY = y.getPixelForValue(candle.close);
                    ctx.setLineDash([3, 4]);
                    ctx.strokeStyle = "rgba(37, 99, 235, .65)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(center, chartArea.top);
                    ctx.lineTo(center, chartArea.bottom);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    ctx.fillStyle = "#2563eb";
                    ctx.beginPath();
                    ctx.arc(center, latestY, 3.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            ctx.restore();
        }
    };

    function create(options) {
        const canvas = options.canvas;
        const chart = new Chart(canvas, {
            plugins: [candlestickPlugin],
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
                    tradeNovaCandlesticks: { enabled: false },
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
                        reverse: false,
                        offset: true,
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
        let activeChartType = "line";

        function render() {
            if (!activeStock) return;
            const series = getSeries(activeStock, activeRange);
            const candles = createIllustrativeCandles(series.values);
            const lows = candles.map(candle => candle.low);
            const highs = candles.map(candle => candle.high);
            chart.$tradeNovaCandles = candles;
            chart.data.labels = series.labels;
            chart.data.datasets[0].data = series.values;
            chart.data.datasets[0].borderColor = activeChartType === "line" ? "#2563eb" : "rgba(0, 0, 0, 0)";
            chart.data.datasets[0].backgroundColor = activeChartType === "line" ? "rgba(37, 99, 235, 0.12)" : "rgba(0, 0, 0, 0)";
            chart.data.datasets[0].fill = activeChartType === "line";
            chart.options.plugins.tradeNovaCandlesticks.enabled = activeChartType === "candlestick";
            chart.options.scales.y.min = activeChartType === "candlestick" ? Math.min(...lows) : undefined;
            chart.options.scales.y.max = activeChartType === "candlestick" ? Math.max(...highs) : undefined;
            chart.update("none");

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

        (options.chartTypeButtons || []).forEach(button => {
            button.addEventListener("click", () => {
                activeChartType = button.dataset.chartType;
                (options.chartTypeButtons || []).forEach(item => {
                    const isActive = item === button;
                    item.classList.toggle("active", isActive);
                    item.setAttribute("aria-pressed", String(isActive));
                });
                render();
            });
        });

        return {
            update(stock) {
                const isNewStock = !activeStock || Number(activeStock.id) !== Number(stock.id);
                activeStock = stock;
                if (isNewStock) {
                    activeRange = "day";
                    options.rangeButtons.forEach(button => {
                        const isActive = button.dataset.range === activeRange;
                        button.classList.toggle("active", isActive);
                        button.setAttribute("aria-pressed", String(isActive));
                    });
                }
                (options.chartTypeButtons || []).forEach(button => {
                    const isActive = button.dataset.chartType === activeChartType;
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

    window.TradeNovaStockChart = { create, formatMarketCap, getSector, getSeries, analyze, analyzePrices };
})();
