(() => {
    const MODULES = [
        {
            id: "market-basics", level: "Beginner", title: "How the stock market works", duration: "8 min",
            summary: "Understand what a stock represents and why companies list shares.",
            topics: [
                ["What a share is", "A share is a unit of ownership in a company. Owning a share gives you exposure to the company's results and market value; it does not guarantee a profit."],
                ["Why companies list", "Companies may raise capital by offering shares to the public. After listing, investors buy and sell those shares on an exchange."],
                ["Price and value", "A quoted price is the latest price at which buyers and sellers matched. It can change as expectations, information and demand change."]
            ],
            quiz: { question: "What does one ordinary share generally represent?", options: ["A small ownership stake in a company", "A guaranteed interest payment", "A loan that must be repaid on a fixed date"], answer: 0, explanation: "A share represents ownership; its market price and any dividends are not guaranteed." }
        },
        {
            id: "market-participants", level: "Beginner", title: "Exchanges, brokers and market participants", duration: "7 min",
            summary: "Learn the roles of exchanges, brokers, investors and regulators.",
            topics: [
                ["Stock exchanges", "An exchange is an organised marketplace where eligible securities can be traded under published rules. In India, NSE and BSE are major stock exchanges."],
                ["Brokers and orders", "A broker provides access to an exchange and routes client orders. Before investing, understand the broker's charges, order types and account protections."],
                ["Different participants", "Individuals, institutions, companies and market makers may all participate. Their goals, time horizons and information can differ."]
            ],
            quiz: { question: "What is a broker's usual role in a stock trade?", options: ["Guarantee that a trade is profitable", "Provide access and route an order to the market", "Set every stock's closing price"], answer: 1, explanation: "A broker facilitates access and order routing; it cannot guarantee a profit or set market prices." }
        },
        {
            id: "quotes-and-tickers", level: "Beginner", title: "Reading a stock quote", duration: "7 min",
            summary: "Read a ticker, last traded price, volume, bid and ask.",
            topics: [
                ["Ticker and price", "A ticker is a short identifier for a listed instrument. The last traded price (LTP) is the price of the most recent matched trade, not a promise of the next execution price."],
                ["Bid and ask", "The bid is a buyer's offered price and the ask is a seller's requested price. The difference is the spread; a wide spread can increase trading costs."],
                ["Volume", "Volume counts units traded during a period. High volume can indicate activity, but it does not tell you whether a share is fairly valued."]
            ],
            quiz: { question: "What is the bid-ask spread?", options: ["The difference between the bid and ask prices", "The company's annual profit", "The total number of shareholders"], answer: 0, explanation: "The spread is the gap between the best available buying and selling quotes." }
        },
        {
            id: "order-types", level: "Beginner", title: "Order types and trade settlement", duration: "9 min",
            summary: "Compare market, limit and stop orders and understand settlement basics.",
            topics: [
                ["Market and limit orders", "A market order prioritises execution at available prices, which may differ from the displayed quote. A limit order sets a maximum buy price or minimum sell price but may not execute."],
                ["Stop orders", "A stop order becomes active after a trigger price is reached. Trigger behaviour depends on the order type and platform; it cannot guarantee a particular execution price."],
                ["Settlement", "After a trade, securities and funds go through a settlement process. Learn your market's settlement cycle and check contract notes and account statements."]
            ],
            quiz: { question: "Which statement about a limit order is true?", options: ["It guarantees immediate execution", "It sets a price boundary but may not execute", "It removes all investment risk"], answer: 1, explanation: "A limit order controls the acceptable price, but a matching counterparty may not be available." }
        },
        {
            id: "investing-vs-trading", level: "Beginner", title: "Investing, trading and time horizons", duration: "7 min",
            summary: "Distinguish long-term investing from short-term trading and set learning goals.",
            topics: [
                ["Different approaches", "Investing often focuses on ownership over a longer horizon; trading seeks to act on shorter-term price changes. Both involve uncertainty and can lose money."],
                ["Time horizon", "A time horizon is when you expect to need the money. Short horizons leave less time to recover from a market decline."],
                ["Start with a plan", "Write down a learning objective, a time horizon and a maximum amount of practice risk before trying a strategy."]
            ],
            quiz: { question: "Why should your time horizon matter?", options: ["It guarantees what return you will earn", "It affects how much time you may have to handle market declines", "It removes the need to diversify"], answer: 1, explanation: "A short time horizon can make a downturn harder to wait through; it does not guarantee outcomes." }
        },
        {
            id: "risk-and-diversification", level: "Intermediate", title: "Risk, return and diversification", duration: "9 min",
            summary: "Explore volatility, concentration, diversification and risk capacity.",
            topics: [
                ["Risk and return", "Higher potential returns usually come with higher uncertainty, not certainty of higher results. Price volatility is one risk, but not the only one."],
                ["Diversification", "Spreading exposure across companies, industries or asset types can reduce the impact of one holding performing poorly. It cannot eliminate market-wide losses."],
                ["Risk capacity", "Consider your financial ability and emotional willingness to handle losses. Avoid using money needed for essential expenses to experiment."]
            ],
            quiz: { question: "What can diversification do?", options: ["Guarantee no losses", "Reduce concentration in one holding or area", "Ensure every investment rises together"], answer: 1, explanation: "Diversification may reduce concentration risk, but broad market risk remains." }
        },
        {
            id: "fundamental-analysis", level: "Intermediate", title: "Fundamental analysis: business and financials", duration: "10 min",
            summary: "Use revenue, earnings, cash flow and debt as research starting points.",
            topics: [
                ["Understand the business", "Ask how the company earns money, who its customers are, what could disrupt it and whether its business model is understandable."],
                ["Financial statements", "The income statement reports performance, the balance sheet shows assets and obligations, and the cash-flow statement tracks cash movement. Read them together."],
                ["Quality of information", "Compare results across periods and read official filings and disclosures. Accounting numbers and ratios need context and can be revised."]
            ],
            quiz: { question: "Which statement tracks cash moving into and out of a company?", options: ["Cash-flow statement", "Shareholder list", "Order book"], answer: 0, explanation: "The cash-flow statement reports operating, investing and financing cash flows." }
        },
        {
            id: "valuation", level: "Intermediate", title: "Valuation and financial ratios", duration: "9 min",
            summary: "Interpret common valuation measures without treating them as standalone signals.",
            topics: [
                ["Price-to-earnings", "The P/E ratio compares a share price with earnings per share. It can be misleading when earnings are unusually high, low or negative."],
                ["Other measures", "Price-to-book, debt-to-equity and return on equity answer different questions. Definitions and accounting choices can vary."],
                ["Compare carefully", "Ratios are more useful with peers, history, industry context and business quality. A low ratio alone does not mean a share is undervalued."]
            ],
            quiz: { question: "What is a sensible way to use a valuation ratio?", options: ["As a guaranteed buy signal", "Alongside company context, peers and history", "Without checking the underlying financials"], answer: 1, explanation: "Ratios are simplified indicators; they need context and should not be used alone." }
        },
        {
            id: "technical-analysis", level: "Intermediate", title: "Charts, trends and technical indicators", duration: "10 min",
            summary: "Read candlesticks, support/resistance and indicators with caution.",
            topics: [
                ["Candlesticks and timeframe", "A candle summarises open, high, low and close for a chosen interval. The same instrument can look different across timeframes."],
                ["Trends and levels", "Support and resistance are areas where price has historically reacted, not fixed barriers. Breakouts can fail and past patterns may not repeat."],
                ["Indicators", "Moving averages and momentum indicators summarise past prices. They lag or produce false signals and should be tested before use."]
            ],
            quiz: { question: "Do support and resistance levels guarantee a price reversal?", options: ["Yes, always", "No, they are historical reference areas", "Only on daily charts"], answer: 1, explanation: "These levels are analytical references, not guarantees that price will turn." }
        },
        {
            id: "portfolio-construction", level: "Intermediate", title: "Portfolio construction and rebalancing", duration: "9 min",
            summary: "Connect asset allocation, position sizing and periodic portfolio review.",
            topics: [
                ["Asset allocation", "Allocation is how a portfolio is divided among asset categories. It should reflect goals, horizon and ability to withstand losses."],
                ["Position sizing", "Sizing limits how much a single idea can affect the whole portfolio. Avoid basing size only on confidence or a recent winning streak."],
                ["Rebalancing", "Rebalancing returns a portfolio toward a chosen allocation. Consider costs, taxes and the reason for the target before making changes."]
            ],
            quiz: { question: "What is the purpose of position sizing?", options: ["To control the impact of one holding", "To predict the next market price", "To guarantee a positive return"], answer: 0, explanation: "Position sizing can limit concentration and the effect of one investment on the portfolio." }
        },
        {
            id: "derivatives-basics", level: "Advanced", title: "Derivatives: futures and options", duration: "11 min",
            summary: "Understand contract obligations, expiry and how derivatives amplify risk.",
            topics: [
                ["Futures", "A futures contract creates an obligation for parties under its terms. Leverage means a relatively small price move can produce a large gain or loss relative to margin."],
                ["Options", "A call gives the buyer a right to buy under contract terms; a put gives a right to sell. Buyers pay a premium, while option writers may face substantial obligations."],
                ["Expiry and settlement", "Derivatives have contract specifications, expiry and settlement rules. Learn lot size, margin and worst-case exposure before considering any product."]
            ],
            quiz: { question: "Why can derivatives be especially risky?", options: ["They always move opposite to shares", "Leverage and contract obligations can magnify losses", "They have no expiry dates"], answer: 1, explanation: "Leverage and obligations can create losses larger or faster than expected, including beyond the initial amount in some strategies." }
        },
        {
            id: "options-risk", level: "Advanced", title: "Options payoff and strategy risk", duration: "12 min",
            summary: "Map payoff, premium, breakeven and maximum loss before a hypothetical options trade.",
            topics: [
                ["Payoff diagrams", "A payoff diagram shows results at expiry across different underlying prices. It may omit transaction costs, volatility changes and early-exercise details."],
                ["Breakeven", "Breakeven is the price at which a simplified payoff equals zero after premium. It is not a forecast that price will reach that level."],
                ["Defined and undefined risk", "Some strategies have a defined maximum loss while others can have very large or theoretically unlimited loss. Know the full exposure and margin rules."]
            ],
            quiz: { question: "Before evaluating an options strategy, what should you map?", options: ["Only the expected profit", "Payoff, breakeven and maximum possible loss", "Only the option's current premium"], answer: 1, explanation: "A complete risk review includes the range of outcomes, breakeven and loss exposure, plus costs." }
        },
        {
            id: "margin-short-selling", level: "Advanced", title: "Margin, leverage and short selling", duration: "10 min",
            summary: "Learn how borrowed exposure, margin calls and short positions can magnify losses.",
            topics: [
                ["Leverage", "Leverage increases exposure relative to your own capital. Losses, funding costs and forced liquidation can grow quickly when prices move against you."],
                ["Margin", "Margin is collateral required by a broker or clearing system. Requirements can change; failing to meet a call can lead to positions being closed."],
                ["Short selling", "A short seller borrows or otherwise obtains a position intended to benefit from a price decline. A rising price can create very large losses and additional obligations."]
            ],
            quiz: { question: "What can happen if a leveraged position breaches margin requirements?", options: ["The broker may close the position", "The loss is automatically cancelled", "The position becomes risk-free"], answer: 0, explanation: "A broker may liquidate positions to address a margin shortfall, potentially at an unfavourable time." }
        },
        {
            id: "systematic-strategies", level: "Advanced", title: "Strategy design, testing and execution", duration: "11 min",
            summary: "Build a testable trading hypothesis and recognise common backtest pitfalls.",
            topics: [
                ["Define rules", "Specify entry, exit, position size, instruments and timeframe before testing. Clear rules help distinguish a repeatable process from hindsight."],
                ["Backtest carefully", "Historical tests can suffer from overfitting, survivorship bias, look-ahead bias and unrealistic execution assumptions."],
                ["Paper forward testing", "Practice with small, predefined rules and record fills, slippage and emotions. Simulated execution still cannot reproduce every live-market condition."]
            ],
            quiz: { question: "What is overfitting in strategy testing?", options: ["A strategy works equally in all conditions", "Rules are tuned to past data and may not generalise", "A broker rejects a trade"], answer: 1, explanation: "Overfit rules match historical noise and can fail on unseen data." }
        },
        {
            id: "risk-management", level: "Advanced", title: "Risk management and trading psychology", duration: "10 min",
            summary: "Use risk limits, a trading journal and decision rules to manage behaviour.",
            topics: [
                ["Set limits before entry", "Define what would invalidate an idea, the maximum acceptable loss and a daily or portfolio risk limit. A stop order may not fill at its trigger price."],
                ["Keep a journal", "Record the hypothesis, planned risk, actual execution and whether you followed the process. Review patterns rather than judging only by profit."],
                ["Manage emotions", "Fear of missing out, revenge trading and overconfidence can lead to impulsive decisions. Taking a pause is a valid risk-control action."]
            ],
            quiz: { question: "What should a written trade plan define before entry?", options: ["Only the desired profit", "The hypothesis, exit conditions and acceptable risk", "A guarantee that the trade will work"], answer: 1, explanation: "A plan should clarify why the trade exists and how risk will be handled; no plan guarantees success." }
        },
        {
            id: "tax-regulation", level: "Advanced", title: "Costs, taxes, compliance and investor protection", duration: "9 min",
            summary: "Account for trading costs, tax rules, disclosures and responsible use of information.",
            topics: [
                ["Total costs", "Brokerage, exchange charges, taxes, spreads and slippage can reduce returns. Review the current tariff and contract notes rather than assuming a trade is cost-free."],
                ["Taxes and rules", "Tax treatment depends on the instrument, holding period, activity and current law. Consult official sources or a qualified tax professional for your situation."],
                ["Protect yourself", "Use official disclosures, protect account credentials and be cautious of guaranteed-return claims, unregistered advice and pressure to act quickly."]
            ],
            quiz: { question: "Why should you include costs when evaluating a strategy?", options: ["Costs can reduce the net result", "Costs always increase returns", "Costs matter only for long-term investors"], answer: 0, explanation: "Charges, taxes, spreads and slippage affect net performance across approaches." }
        }
    ];

    const INSTRUMENTS = [
        { symbol: "ALFA", name: "Alpha Learning Co.", price: 250 },
        { symbol: "BETA", name: "Beta Sample Bank", price: 480 },
        { symbol: "GROW", name: "Growth Practice Ltd.", price: 125 },
        { symbol: "NOVA", name: "Nova Demo Energy", price: 760 }
    ];
    const STARTING_CASH = 100000;
    const PROGRESS_KEY = "tradenovaLearningProgress";
    const PAPER_KEY = "tradenovaPaperTrading";
    let activeModuleId = null;
    let selectedQuizAnswer = null;

    const $ = (id) => document.getElementById(id);
    const formatCurrency = (amount) => `₹${Number(amount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

    function readJSON(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "null");
            return value === null ? fallback : value;
        } catch (error) {
            console.error(`Unable to read saved learning data: ${key}`, error);
            return fallback;
        }
    }

    function saveJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Unable to save learning data: ${key}`, error);
            return false;
        }
    }

    function getCompletedModules() {
        const saved = readJSON(PROGRESS_KEY, []);
        return Array.isArray(saved) ? saved.filter((id) => MODULES.some((module) => module.id === id)) : [];
    }

    function updateProgress() {
        const completed = getCompletedModules();
        const percent = Math.round(completed.length / MODULES.length * 100);
        $("progressSummary").textContent = `${completed.length} / ${MODULES.length}`;
        $("overallProgress").style.width = `${percent}%`;
        $("overallProgress").parentElement.setAttribute("aria-label", `${percent}% complete`);

        document.querySelectorAll(".module-card").forEach((card) => {
            const done = completed.includes(card.dataset.moduleId);
            card.classList.toggle("is-complete", done);
            const status = card.querySelector(".module-complete");
            status.textContent = done ? "✓ Completed" : "";
        });
    }

    function renderModules(level = "all") {
        const completed = getCompletedModules();
        const visible = MODULES.filter((module) => level === "all" || module.level === level);
        $("moduleCount").textContent = `${visible.length} module${visible.length === 1 ? "" : "s"}`;
        $("moduleGrid").innerHTML = visible.map((module) => {
            const done = completed.includes(module.id);
            const levelClass = module.level.toLowerCase();
            const moduleNumber = MODULES.indexOf(module) + 1;
            return `<button type="button" class="module-card${done ? " is-complete" : ""}" data-module-id="${module.id}">
                <span class="module-card-top"><span class="module-level ${levelClass}">${module.level}</span><span class="module-complete">${done ? "✓ Completed" : ""}</span></span>
                <span class="module-card-content"><span class="module-title">${moduleNumber}. ${module.title}</span><span class="module-summary">${module.summary}</span></span>
                <span class="module-meta">${module.duration} · 3 learning points · Knowledge check</span>
            </button>`;
        }).join("");
    }

    function openModule(moduleId) {
        const module = MODULES.find((item) => item.id === moduleId);
        if (!module) return;
        activeModuleId = module.id;
        selectedQuizAnswer = null;
        $("lessonLevel").textContent = module.level;
        $("lessonLevel").className = `lesson-level ${module.level.toLowerCase()}`;
        $("lessonTitle").textContent = module.title;
        $("lessonContent").innerHTML = module.topics.map(([title, text]) =>
            `<article class="lesson-topic"><h3>${title}</h3><p>${text}</p></article>`
        ).join("");
        $("knowledgeCheck").innerHTML = `<h3>Quick knowledge check</h3>
            <p class="quiz-question">${module.quiz.question}</p>
            <div class="quiz-options">${module.quiz.options.map((option, index) =>
                `<button type="button" class="quiz-option" data-answer="${index}">${option}</button>`
            ).join("")}</div>
            <p class="quiz-feedback" id="quizFeedback" role="status" aria-live="polite"></p>`;
        const done = getCompletedModules().includes(module.id);
        $("completeLesson").disabled = done || selectedQuizAnswer === null;
        $("completeLesson").textContent = done ? "Module completed" : "Mark module complete";
        $("lessonStatus").textContent = done
            ? "You've completed this module. Revisit it anytime."
            : "Answer the knowledge check to unlock module completion.";
        $("lessonPanel").hidden = false;
        $("lessonPanel").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function loadPaperAccount() {
        const saved = readJSON(PAPER_KEY, null);
        if (!saved || typeof saved.cash !== "number" || !Number.isFinite(saved.cash) || saved.cash < 0 ||
            !saved.holdings || typeof saved.holdings !== "object" || Array.isArray(saved.holdings) || !Array.isArray(saved.history)) {
            return { cash: STARTING_CASH, holdings: {}, history: [] };
        }
        const holdings = {};
        Object.entries(saved.holdings).forEach(([symbol, holding]) => {
            if (INSTRUMENTS.some((item) => item.symbol === symbol) && holding &&
                Number.isSafeInteger(holding.quantity) && holding.quantity > 0 &&
                Number.isFinite(holding.averageCost) && holding.averageCost > 0) {
                holdings[symbol] = { quantity: holding.quantity, averageCost: holding.averageCost };
            }
        });
        return {
            cash: saved.cash,
            holdings,
            history: saved.history.filter((trade) =>
                trade && (trade.side === "BUY" || trade.side === "SELL") &&
                INSTRUMENTS.some((item) => item.symbol === trade.symbol) &&
                Number.isSafeInteger(trade.quantity) && trade.quantity > 0 &&
                Number.isFinite(trade.price) && Number.isFinite(trade.time)
            ).slice(0, 10)
        };
    }

    let paperAccount = loadPaperAccount();

    function persistPaperAccount() {
        return saveJSON(PAPER_KEY, paperAccount);
    }

    function renderPaperAccount() {
        const positions = Object.entries(paperAccount.holdings)
            .filter(([, holding]) => holding && Number(holding.quantity) > 0)
            .map(([symbol, holding]) => {
                const instrument = INSTRUMENTS.find((item) => item.symbol === symbol);
                if (!instrument || !Number.isFinite(Number(holding.averageCost))) return null;
                return { symbol, instrument, quantity: Number(holding.quantity), averageCost: Number(holding.averageCost) };
            }).filter(Boolean);
        const holdingsValue = positions.reduce((sum, item) => sum + item.quantity * item.instrument.price, 0);
        const unrealised = positions.reduce((sum, item) => sum + (item.instrument.price - item.averageCost) * item.quantity, 0);

        $("paperCash").textContent = formatCurrency(paperAccount.cash);
        $("paperHoldingsValue").textContent = formatCurrency(holdingsValue);
        $("paperPortfolioValue").textContent = formatCurrency(paperAccount.cash + holdingsValue);
        $("paperPnl").textContent = formatCurrency(unrealised);
        $("paperPnl").classList.toggle("negative-value", unrealised < 0);
        $("paperPositions").innerHTML = positions.map((item) => {
            const pnl = (item.instrument.price - item.averageCost) * item.quantity;
            return `<tr><td>${item.instrument.name}<br><small>${item.symbol}</small></td>
                <td>${item.quantity}</td><td>${formatCurrency(item.averageCost)}</td>
                <td>${formatCurrency(item.quantity * item.instrument.price)}</td>
                <td class="${pnl < 0 ? "negative-value" : "positive-value"}">${formatCurrency(pnl)}</td></tr>`;
        }).join("");
        $("emptyPositions").hidden = positions.length > 0;
        $("paperHistory").innerHTML = paperAccount.history.length
            ? paperAccount.history.map((trade) => `<div class="history-row">
                <span><strong class="${trade.side === "BUY" ? "history-buy" : "history-sell"}">${trade.side}</strong> ${trade.quantity} × ${trade.symbol}</span>
                <span>${formatCurrency(trade.price)} · ${new Date(trade.time).toLocaleString()}</span>
            </div>`).join("")
            : "<p>No simulated orders yet.</p>";
    }

    function setTradeMessage(message, isError = false) {
        $("tradeMessage").textContent = message;
        $("tradeMessage").classList.toggle("error-message", isError);
    }

    function executePaperTrade(side) {
        const symbol = $("paperSymbol").value;
        const instrument = INSTRUMENTS.find((item) => item.symbol === symbol);
        const quantity = Number($("paperQuantity").value);
        if (!instrument || !Number.isSafeInteger(quantity) || quantity <= 0) {
            setTradeMessage("Enter a whole-number quantity greater than zero.", true);
            return;
        }

        const total = quantity * instrument.price;
        const current = paperAccount.holdings[symbol] || { quantity: 0, averageCost: 0 };
        if (!Number.isFinite(total) || total <= 0) {
            setTradeMessage("This practice order amount is invalid.", true);
            return;
        }
        if (side === "BUY" && total > paperAccount.cash) {
            setTradeMessage("Not enough virtual cash for this practice order.", true);
            return;
        }
        if (side === "SELL" && quantity > current.quantity) {
            setTradeMessage(`You only hold ${current.quantity || 0} ${symbol} in this simulation.`, true);
            return;
        }

        if (side === "BUY") {
            const newQuantity = current.quantity + quantity;
            current.averageCost = (current.quantity * current.averageCost + total) / newQuantity;
            current.quantity = newQuantity;
            paperAccount.cash -= total;
            paperAccount.holdings[symbol] = current;
        } else {
            paperAccount.cash += total;
            current.quantity -= quantity;
            if (current.quantity === 0) delete paperAccount.holdings[symbol];
        }

        paperAccount.history.unshift({ side, symbol, quantity, price: instrument.price, time: Date.now() });
        paperAccount.history = paperAccount.history.slice(0, 10);
        const saved = persistPaperAccount();
        renderPaperAccount();
        setTradeMessage(saved
            ? `${side === "BUY" ? "Bought" : "Sold"} ${quantity} ${symbol} at the illustrative price of ${formatCurrency(instrument.price)}.`
            : "The simulated order was processed, but this browser could not save it. Your changes will be lost when you leave this page.", !saved);
    }

    function initializePage() {
        fetch("components/sidebar.html")
            .then((response) => {
                if (!response.ok) throw new Error(`Sidebar request failed (${response.status})`);
                return response.text();
            })
            .then((html) => {
                $("sidebar").innerHTML = html;
                const active = [...document.querySelectorAll(".sidebar li")].find((item) => item.textContent.includes("Learn & Practice"));
                if (active) active.classList.add("active");
            })
            .catch((error) => console.error("Unable to load the sidebar", error));
        fetch("components/topbar.html")
            .then((response) => {
                if (!response.ok) throw new Error(`Topbar request failed (${response.status})`);
                return response.text();
            })
            .then((html) => { $("topbar").innerHTML = html; })
            .catch((error) => console.error("Unable to load the topbar", error));

        renderModules();
        updateProgress();
        renderPaperAccount();
        $("paperSymbol").innerHTML = INSTRUMENTS.map((item) =>
            `<option value="${item.symbol}">${item.symbol} — ${item.name}</option>`
        ).join("");
        updateSelectedQuote();
    }

    function updateSelectedQuote() {
        const instrument = INSTRUMENTS.find((item) => item.symbol === $("paperSymbol").value);
        $("selectedQuote").textContent = instrument
            ? `Illustrative price: ${formatCurrency(instrument.price)} per unit`
            : "";
    }

    document.addEventListener("click", (event) => {
        const card = event.target.closest(".module-card");
        if (card) openModule(card.dataset.moduleId);

        const filter = event.target.closest(".level-filter");
        if (filter) {
            document.querySelectorAll(".level-filter").forEach((button) => {
                const active = button === filter;
                button.classList.toggle("active", active);
                button.setAttribute("aria-pressed", String(active));
            });
            renderModules(filter.dataset.level);
        }

        const answerButton = event.target.closest(".quiz-option");
        if (answerButton && activeModuleId) {
            const module = MODULES.find((item) => item.id === activeModuleId);
            const answer = Number(answerButton.dataset.answer);
            selectedQuizAnswer = answer;
            document.querySelectorAll(".quiz-option").forEach((button) => {
                button.disabled = true;
                if (Number(button.dataset.answer) === module.quiz.answer) button.classList.add("correct");
            });
            const correct = answer === module.quiz.answer;
            if (!correct) answerButton.classList.add("incorrect");
            $("quizFeedback").textContent = `${correct ? "Correct. " : "Not quite. "}${module.quiz.explanation}`;
            if (!getCompletedModules().includes(module.id)) $("completeLesson").disabled = false;
        }
    });

    $("closeLesson").addEventListener("click", () => { $("lessonPanel").hidden = true; });
    $("completeLesson").addEventListener("click", () => {
        if (!activeModuleId) return;
        const completed = getCompletedModules();
        if (!completed.includes(activeModuleId)) {
            completed.push(activeModuleId);
            if (!saveJSON(PROGRESS_KEY, completed)) {
                $("lessonStatus").textContent = "Could not save your progress in this browser.";
                return;
            }
        }
        $("completeLesson").disabled = true;
        $("completeLesson").textContent = "Module completed";
        $("lessonStatus").textContent = "Progress saved in this browser. You can revisit this module anytime.";
        renderModules(document.querySelector(".level-filter.active").dataset.level);
        updateProgress();
    });
    $("paperTradeForm").addEventListener("submit", (event) => {
        event.preventDefault();
        executePaperTrade("BUY");
    });
    $("sellPaper").addEventListener("click", () => executePaperTrade("SELL"));
    $("paperSymbol").addEventListener("change", updateSelectedQuote);
    $("resetSimulation").addEventListener("click", () => {
        if (!window.confirm("Reset your paper account to ₹1,00,000 and clear simulated holdings and orders?")) return;
        paperAccount = { cash: STARTING_CASH, holdings: {}, history: [] };
        const saved = persistPaperAccount();
        renderPaperAccount();
        setTradeMessage(saved
            ? "Practice account reset to ₹1,00,000 in virtual cash."
            : "Account reset for this page, but your browser could not save the reset.", !saved);
    });

    initializePage();
})();
