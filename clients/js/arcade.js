(() => {
    const storageKey = "tradenovaArcadeProgress";
    const gameMeta = {
        predict: {
            title: "Bull vs Bear",
            intro: "Read the visible price action, then make your call before the next candle is revealed."
        },
        detective: {
            title: "Candlestick Detective",
            intro: "Study the candle shape and context, then identify the pattern."
        },
        stoploss: {
            title: "Stop-Loss Challenge",
            intro: "Set an entry, stop-loss, target, and quantity, then calculate the potential risk and reward."
        }
    };
    const gameStage = document.getElementById("gameStage");
    const title = document.getElementById("activeGameTitle");
    const intro = document.getElementById("activeGameIntro");
    const roundLabel = document.getElementById("gameRoundLabel");
    let activeGame = "predict";
    let round = { predict: 1, detective: 1, stoploss: 1 };
    let progress = { points: 0, rounds: 0 };
    let answered = false;

    function loadProgress() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
            if (saved && Number.isFinite(saved.points) && Number.isFinite(saved.rounds)) {
                progress = { points: Math.max(0, saved.points), rounds: Math.max(0, saved.rounds) };
            }
        } catch (error) {
            console.warn("Arcade progress could not be loaded", error);
        }
        renderProgress();
    }

    function saveProgress() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(progress));
        } catch (error) {
            console.warn("Arcade progress could not be saved", error);
        }
        renderProgress();
    }

    function renderProgress() {
        document.getElementById("arcadeTotalScore").innerHTML = `${progress.points.toLocaleString("en-IN")} <em>pts</em>`;
        document.getElementById("arcadeRoundsPlayed").textContent = String(progress.rounds);
    }

    function setActiveGame(game) {
        if (!gameMeta[game]) return;
        activeGame = game;
        answered = false;
        document.querySelectorAll("[data-game]").forEach((button) => {
            const selected = button.dataset.game === game;
            button.classList.toggle("is-selected", selected);
            button.setAttribute("aria-pressed", String(selected));
        });
        title.textContent = gameMeta[game].title;
        intro.textContent = gameMeta[game].intro;
        renderGame();
    }

    function createRandom(seed) {
        let value = seed >>> 0;
        return () => {
            value = (value * 1664525 + 1013904223) >>> 0;
            return value / 4294967296;
        };
    }

    function createPriceCandles(direction, currentRound) {
        const random = createRandom(currentRound * 7919 + 103);
        let close = 100;
        const candles = [];
        for (let index = 0; index < 14; index += 1) {
            const drift = direction === "bullish" ? 0.34 : direction === "bearish" ? -0.31 : Math.sin(index * 1.7) * 0.13;
            const movement = drift + (random() - 0.48) * 1.05;
            const open = close;
            close = Math.max(70, close + movement);
            const wick = .22 + random() * .62;
            candles.push({ open, close, high: Math.max(open, close) + wick, low: Math.min(open, close) - wick });
        }
        const nextChange = direction === "bullish" ? 1.15 : direction === "bearish" ? -1.12 : (currentRound % 2 ? .14 : -.16);
        const nextOpen = close;
        const nextClose = close * (1 + nextChange / 100);
        const wick = close * .003;
        return {
            candles,
            next: { open: nextOpen, close: nextClose, high: Math.max(nextOpen, nextClose) + wick, low: Math.min(nextOpen, nextClose) - wick },
            direction,
            change: nextChange
        };
    }

    function chartSvg(candles, options = {}) {
        const width = 720;
        const height = 220;
        const margin = { left: 28, right: 20, top: 16, bottom: 24 };
        const all = options.next && options.revealed ? [...candles, options.next] : candles;
        const high = Math.max(...all.map((item) => item.high));
        const low = Math.min(...all.map((item) => item.low));
        const spread = high - low || 1;
        const yFor = (value) => margin.top + (high - value) / spread * (height - margin.top - margin.bottom);
        const slot = (width - margin.left - margin.right) / all.length;
        const bodyWidth = Math.max(5, Math.min(20, slot * .46));
        const lines = [0, 1, 2, 3].map((line) => {
            const y = margin.top + line * (height - margin.top - margin.bottom) / 3;
            return `<line class="arcade-chart__grid" x1="${margin.left}" x2="${width - margin.right}" y1="${y}" y2="${y}"/>`;
        }).join("");
        const bars = all.map((candle, index) => {
            const x = margin.left + slot * index + slot / 2;
            const rising = candle.close >= candle.open;
            const candleClass = `arcade-candle--${rising ? "up" : "down"}`;
            const top = Math.min(yFor(candle.open), yFor(candle.close));
            const bodyHeight = Math.max(2, Math.abs(yFor(candle.close) - yFor(candle.open)));
            return `<line class="arcade-candle__wick ${candleClass}" x1="${x}" x2="${x}" y1="${yFor(candle.high)}" y2="${yFor(candle.low)}"/><rect class="arcade-candle__body ${candleClass}" x="${x - bodyWidth / 2}" y="${top}" width="${bodyWidth}" height="${bodyHeight}" rx="2"/>`;
        }).join("");
        const latestIndex = options.next && options.revealed ? all.length - 1 : candles.length - 1;
        const latestX = margin.left + slot * latestIndex + slot / 2;
        const latestCandle = all[latestIndex];
        const latestY = yFor(latestCandle.close);
        const latestMarker = `<line x1="${latestX}" x2="${latestX}" y1="${margin.top}" y2="${height - margin.bottom}" stroke="rgba(37,99,235,.55)" stroke-dasharray="3 4"/><circle cx="${latestX}" cy="${latestY}" r="4" fill="#2878f0" stroke="#fff" stroke-width="2"/><text x="${latestX}" y="${margin.top + 10}" text-anchor="middle" fill="#2878f0" font-size="9" font-weight="700">${options.revealed ? "NEXT" : "LATEST"}</text>`;
        const hiddenNote = options.next && !options.revealed
            ? `<text x="${width - 22}" y="${height - 6}" text-anchor="end" fill="#8291a4" font-size="10">NEXT CANDLE HIDDEN</text>`
            : `<text x="${width - 22}" y="${height - 6}" text-anchor="end" fill="#8291a4" font-size="10">${options.revealed ? "NEXT CANDLE REVEALED" : "PRICE ACTION"}</text>`;
        return `<svg class="arcade-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Illustrative simulated candlestick price chart">${lines}${bars}${latestMarker}${hiddenNote}</svg>`;
    }

    function predictRoundData() {
        const sequence = ["bullish", "bearish", "sideways", "bullish", "sideways", "bearish"];
        return createPriceCandles(sequence[(round.predict - 1) % sequence.length], round.predict);
    }

    function renderPrediction() {
        const data = predictRoundData();
        const choices = [
            ["bullish", "↗", "Bullish", "Price moves higher"],
            ["bearish", "↘", "Bearish", "Price moves lower"],
            ["sideways", "↔", "Sideways", "Price stays in a tight range"]
        ];
        gameStage.innerHTML = `
            <div class="game-layout">
                <article class="game-panel">
                    <span class="game-panel__eyebrow">SIMULATED PRICE ACTION · 14 CANDLES SHOWN</span>
                    <h3>What might the next candle do?</h3>
                    <p>Use the visible trend as a clue. The next candle is hidden until you lock in your prediction.</p>
                    <div id="predictionChart">${chartSvg(data.candles, { next: data.next, revealed: false })}</div>
                </article>
                <article class="game-panel">
                    <span class="game-panel__eyebrow">MAKE YOUR CALL</span>
                    <h3>Choose a direction</h3>
                    <p>This is a chart-reading exercise—not a forecast. Price action can be uncertain.</p>
                    <div class="game-answers" role="group" aria-label="Choose predicted market direction">
                        ${choices.map(([value, icon, label, detail]) => `<button class="arcade-answer" type="button" data-prediction="${value}"><span class="arcade-answer__icon">${icon}</span><span>${label}<br><small>${detail}</small></span></button>`).join("")}
                    </div>
                    <div id="predictionFeedback" class="game-feedback" role="status" hidden></div>
                    <div class="arcade-game-actions"><button id="nextPrediction" class="primary" type="button" hidden>Next round →</button><button type="button" data-reset-game="predict">Reset game</button></div>
                </article>
            </div>`;

        gameStage.querySelectorAll("[data-prediction]").forEach((button) => {
            button.addEventListener("click", () => {
                if (answered) return;
                answered = true;
                const guess = button.dataset.prediction;
                const correct = guess === data.direction;
                const points = correct ? 100 : 20;
                progress.points += points;
                progress.rounds += 1;
                saveProgress();
                document.getElementById("predictionChart").innerHTML = chartSvg(data.candles, { next: data.next, revealed: true });
                gameStage.querySelectorAll("[data-prediction]").forEach((answer) => {
                    answer.disabled = true;
                    if (answer.dataset.prediction === data.direction) answer.classList.add("is-correct");
                    else if (answer === button && !correct) answer.classList.add("is-wrong");
                });
                const feedback = document.getElementById("predictionFeedback");
                const actual = data.direction === "sideways" ? "Sideways" : data.direction[0].toUpperCase() + data.direction.slice(1);
                feedback.hidden = false;
                feedback.className = `game-feedback ${correct ? "is-correct" : "is-wrong"}`;
                feedback.innerHTML = `<strong>${correct ? "Good read!" : "Not this time."}</strong> The next simulated candle was ${actual} (${data.change > 0 ? "+" : ""}${data.change.toFixed(2)}%). ${correct ? `You earned ${points} points.` : `You earned ${points} practice points. Trends are clues, not certainty.`}`;
                document.getElementById("nextPrediction").hidden = false;
            });
        });
        document.getElementById("nextPrediction").addEventListener("click", () => {
            round.predict += 1;
            answered = false;
            renderGame();
        });
    }

    const patterns = [
        { name: "Hammer", context: "After a decline, a small real body near the top and a long lower shadow can signal rejection of lower prices. Context and confirmation matter.", candles: [{ open: 69, close: 70, high: 71, low: 48 }] },
        { name: "Inverted Hammer", context: "After a decline, a small body near the low with a long upper shadow may hint that buyers tested higher prices. It needs confirmation and is not a guarantee.", candles: [{ open: 70, close: 71, high: 92, low: 68 }] },
        { name: "Hanging Man", context: "After an advance, a small body near the top with a long lower shadow can warn that selling pressure appeared. Wait for a confirming candle.", candles: [{ open: 70, close: 71, high: 73, low: 49 }] },
        { name: "Shooting Star", context: "After an advance, a small body near the low with a long upper shadow can show that higher prices were rejected. Wait for context and confirmation.", candles: [{ open: 70, close: 69.5, high: 91, low: 68 }] },
        { name: "Doji", context: "Open and close are nearly equal, creating a tiny body. It can show indecision; by itself it does not confirm a reversal.", candles: [{ open: 67, close: 67.12, high: 78, low: 56 }] },
        { name: "Spinning Top", context: "A small real body with visible upper and lower shadows suggests indecision between buyers and sellers. Read it with the surrounding trend.", candles: [{ open: 69, close: 71, high: 82, low: 57 }] },
        { name: "Bullish Engulfing", context: "A larger bullish real body covers the prior bearish real body. It may show buyers taking control, especially after a decline; confirmation still matters.", candles: [{ open: 73, close: 65, high: 75, low: 63 }, { open: 63, close: 78, high: 80, low: 61 }] },
        { name: "Bearish Engulfing", context: "A larger bearish real body covers the prior bullish real body. It may show sellers taking control, especially after an advance; confirmation still matters.", candles: [{ open: 65, close: 74, high: 76, low: 63 }, { open: 77, close: 61, high: 79, low: 59 }] },
        { name: "Piercing Line", context: "After a decline, a bullish candle opens below the prior bearish close and closes above the midpoint of its body. Context and confirmation are important.", candles: [{ open: 78, close: 62, high: 80, low: 60 }, { open: 58, close: 72, high: 74, low: 56 }] },
        { name: "Dark Cloud Cover", context: "After an advance, a bearish candle opens above the prior bullish close and closes below the midpoint of its body. It may signal pressure, not certainty.", candles: [{ open: 62, close: 78, high: 80, low: 60 }, { open: 82, close: 68, high: 84, low: 66 }] }
    ];

    function renderPatternChart(pattern) {
        const candles = pattern.candles;
        const width = 500;
        const height = 190;
        const max = Math.max(...candles.map((candle) => candle.high)) + 4;
        const min = Math.min(...candles.map((candle) => candle.low)) - 4;
        const yFor = (price) => 20 + (max - price) / (max - min) * 142;
        const slot = width / (candles.length + 1);
        const bodyWidth = candles.length === 1 ? 46 : 54;
        const grid = [0, 1, 2].map((i) => `<line class="arcade-chart__grid" x1="30" x2="470" y1="${35 + i * 48}" y2="${35 + i * 48}"/>`).join("");
        const bars = candles.map((candle, index) => {
            const x = slot * (index + 1);
            const rising = candle.close >= candle.open;
            const cls = `arcade-candle--${rising ? "up" : "down"}`;
            return `<line class="arcade-candle__wick ${cls}" x1="${x}" x2="${x}" y1="${yFor(candle.high)}" y2="${yFor(candle.low)}"/><rect class="arcade-candle__body ${cls}" x="${x - bodyWidth / 2}" y="${Math.min(yFor(candle.open), yFor(candle.close))}" width="${bodyWidth}" height="${Math.max(3, Math.abs(yFor(candle.open) - yFor(candle.close)))}" rx="3"/>`;
        }).join("");
        const latestX = slot * candles.length;
        const latest = candles[candles.length - 1];
        const latestMarker = `<circle cx="${latestX}" cy="${yFor(latest.close)}" r="4" fill="#2878f0" stroke="#fff" stroke-width="2"/><text x="${latestX}" y="15" text-anchor="middle" fill="#2878f0" font-size="9" font-weight="700">LATEST</text>`;
        return `<svg class="arcade-chart candle-quiz-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${candles.length === 1 ? "Single candle" : "Two-candle"} pattern illustration, latest candle at the right">${grid}${bars}${latestMarker}<text x="250" y="181" text-anchor="middle" fill="#8291a4" font-size="10">${candles.length === 1 ? "ONE CANDLE" : "EARLIER          LATEST"}</text></svg>`;
    }

    function renderDetective() {
        const pattern = patterns[(round.detective - 1) % patterns.length];
        const answerPosition = round.detective % 4;
        const options = [pattern.name];
        for (let offset = 1; options.length < 4; offset += 1) {
            const distractor = patterns[(round.detective * 3 + offset * 2) % patterns.length].name;
            if (!options.includes(distractor)) options.push(distractor);
        }
        const orderedOptions = [];
        options.forEach((option, index) => {
            orderedOptions[index === 0 ? answerPosition : (answerPosition + index) % 4] = option;
        });
        gameStage.innerHTML = `
            <div class="game-layout">
                <article class="game-panel">
                    <span class="game-panel__eyebrow">PATTERN ${((round.detective - 1) % patterns.length) + 1} OF ${patterns.length} · CANDLESTICK CHALLENGE</span>
                    <h3>What pattern do you see?</h3>
                    <p>Look at the real body and shadows. For reversal patterns, remember to consider the trend before the candle.</p>
                    ${renderPatternChart(pattern)}
                </article>
                <article class="game-panel">
                    <span class="game-panel__eyebrow">YOUR DIAGNOSIS</span>
                    <h3>Choose the closest match</h3>
                    <div class="pattern-choices" role="group" aria-label="Candlestick pattern answers">
                        ${orderedOptions.map((option) => `<button class="arcade-answer" type="button" data-pattern="${option}">${option}</button>`).join("")}
                    </div>
                    <div id="patternFeedback" class="game-feedback" role="status" hidden></div>
                    <div class="arcade-game-actions"><button id="nextPattern" class="primary" type="button" hidden>Next pattern →</button><button type="button" data-reset-game="detective">Reset game</button></div>
                </article>
            </div>`;
        gameStage.querySelectorAll("[data-pattern]").forEach((button) => {
            button.addEventListener("click", () => {
                if (answered) return;
                answered = true;
                const correct = button.dataset.pattern === pattern.name;
                const points = correct ? 100 : 20;
                progress.points += points;
                progress.rounds += 1;
                saveProgress();
                gameStage.querySelectorAll("[data-pattern]").forEach((answer) => {
                    answer.disabled = true;
                    if (answer.dataset.pattern === pattern.name) answer.classList.add("is-correct");
                    else if (answer === button) answer.classList.add("is-wrong");
                });
                const feedback = document.getElementById("patternFeedback");
                feedback.hidden = false;
                feedback.className = `game-feedback ${correct ? "is-correct" : "is-wrong"}`;
                feedback.innerHTML = `<strong>${correct ? "Pattern spotted!" : `The pattern was ${pattern.name}.`}</strong> ${pattern.context} ${correct ? `+${points} points.` : `+${points} practice points.`}`;
                document.getElementById("nextPattern").hidden = false;
            });
        });
        document.getElementById("nextPattern").addEventListener("click", () => {
            round.detective += 1;
            answered = false;
            renderGame();
        });
    }

    function renderStopLossChart(entry, stop, target) {
        const candles = [
            [500, 496], [496, 492], [492, 497], [497, 494], [494, 499],
            [499, 503], [503, 500], [500, 506], [506, 502], [502, 500]
        ];
        const high = Math.max(target + 8, entry + 8, 510);
        const low = Math.min(stop - 8, entry - 8, 445);
        const yFor = (value) => 16 + (high - value) / (high - low) * 168;
        const grid = [0, 1, 2, 3].map((index) => `<line class="arcade-chart__grid" x1="32" x2="690" y1="${24 + index * 48}" y2="${24 + index * 48}"/>`).join("");
        const levels = [
            { value: target, label: "TARGET", color: "#15803d" },
            { value: entry, label: "ENTRY", color: "#64748b" },
            { value: stop, label: "STOP-LOSS", color: "#dc2626" }
        ].map((level) => `<line x1="32" x2="690" y1="${yFor(level.value)}" y2="${yFor(level.value)}" stroke="${level.color}" stroke-dasharray="5 5"/><rect x="620" y="${yFor(level.value) - 9}" width="70" height="17" rx="5" fill="${level.color}"/><text x="655" y="${yFor(level.value) + 3}" text-anchor="middle" fill="#fff" font-size="8" font-weight="700">${level.label}</text><text x="35" y="${yFor(level.value) - 5}" fill="${level.color}" font-size="9">₹${level.value.toFixed(2)}</text>`).join("");
        const bars = candles.map(([open, close], index) => {
            const x = 56 + index * 51;
            const wick = 2.5;
            const rising = close >= open;
            const cls = `arcade-candle--${rising ? "up" : "down"}`;
            const y = Math.min(yFor(open), yFor(close));
            const height = Math.max(3, Math.abs(yFor(open) - yFor(close)));
            return `<line class="arcade-candle__wick ${cls}" x1="${x}" x2="${x}" y1="${yFor(Math.max(open, close) + wick)}" y2="${yFor(Math.min(open, close) - wick)}"/><rect class="arcade-candle__body ${cls}" x="${x - 9}" y="${y}" width="18" height="${height}" rx="2"/>`;
        }).join("");
        const latestX = 56 + (candles.length - 1) * 51;
        const latestY = yFor(candles[candles.length - 1][1]);
        const latestMarker = `<line x1="${latestX}" x2="${latestX}" y1="16" y2="184" stroke="rgba(37,99,235,.55)" stroke-dasharray="3 4"/><circle cx="${latestX}" cy="${latestY}" r="4" fill="#2878f0" stroke="#fff" stroke-width="2"/><text x="${latestX}" y="12" text-anchor="middle" fill="#2878f0" font-size="8" font-weight="700">LATEST</text>`;
        return `<svg class="arcade-chart stoploss-chart" viewBox="0 0 720 205" role="img" aria-label="Illustrative stock chart with entry, stop-loss and target levels">${grid}${levels}${bars}${latestMarker}<text x="40" y="199" fill="#8291a4" font-size="9">SIMULATED PRICE ACTION · NOT A LIVE QUOTE</text></svg>`;
    }

    function renderStopLoss() {
        const entry = Number(document.getElementById("stopEntry")?.value || 500);
        const stop = Number(document.getElementById("stopPrice")?.value || 480);
        const target = Number(document.getElementById("targetPrice")?.value || 540);
        const quantity = Math.max(1, Number(document.getElementById("stopQuantity")?.value || 1));
        const valid = entry > 0 && stop > 0 && target > 0 && stop < entry && target > entry;
        const risk = valid ? (entry - stop) * quantity : 0;
        const reward = valid ? (target - entry) * quantity : 0;
        const ratio = valid ? reward / risk : 0;
        gameStage.innerHTML = `
            <div class="game-layout">
                <article class="game-panel">
                    <span class="game-panel__eyebrow">SIMULATED CHART · ENTRY PRICE ₹500</span>
                    <h3>Plan the trade before entering</h3>
                    <p>The dashed levels update with your choices. This exercise illustrates position risk; it does not forecast where price will go.</p>
                    <div id="stoplossChart">${renderStopLossChart(entry, stop, target)}</div>
                </article>
                <article class="game-panel">
                    <span class="game-panel__eyebrow">ROUND ${round.stoploss} · DEFINE YOUR RISK</span>
                    <h3>Set your trade parameters</h3>
                    <div class="stoploss-form">
                        <label for="stopEntry">Entry price <span>₹</span><input id="stopEntry" type="number" min="1" step="1" value="500"></label>
                        <label for="stopPrice">Stop-loss <span>below entry</span><select id="stopPrice"><option value="480">₹480</option><option value="490">₹490</option><option value="450">₹450</option></select></label>
                        <label for="targetPrice">Target price <span>above entry</span><select id="targetPrice"><option value="540">₹540</option><option value="520">₹520</option><option value="550">₹550</option><option value="600">₹600</option></select></label>
                        <label for="stopQuantity">Quantity <span>shares</span><input id="stopQuantity" type="number" min="1" max="10000" step="1" value="1"></label>
                    </div>
                    <div id="stoplossReadout" class="risk-readout"></div>
                    <div id="stoplossFeedback" class="game-feedback" role="status" hidden></div>
                    <div class="arcade-game-actions"><button id="checkStopPlan" class="primary" type="button">Check my plan</button><button id="nextStoploss" class="primary" type="button" hidden>Next challenge →</button><button type="button" data-reset-game="stoploss">Reset game</button></div>
                </article>
            </div>`;

        const updatePlan = () => {
            const currentEntry = Number(document.getElementById("stopEntry").value);
            const currentStop = Number(document.getElementById("stopPrice").value);
            const currentTarget = Number(document.getElementById("targetPrice").value);
            const currentQuantity = Math.max(1, Number(document.getElementById("stopQuantity").value || 1));
            const isValid = currentEntry > 0 && currentStop > 0 && currentTarget > 0 && currentStop < currentEntry && currentTarget > currentEntry;
            const riskAmount = isValid ? (currentEntry - currentStop) * currentQuantity : 0;
            const rewardAmount = isValid ? (currentTarget - currentEntry) * currentQuantity : 0;
            const riskReward = isValid ? rewardAmount / riskAmount : 0;
            document.getElementById("stoplossChart").innerHTML = renderStopLossChart(currentEntry, currentStop, currentTarget);
            document.getElementById("stoplossReadout").innerHTML = isValid
                ? `<div><span>Potential risk</span><strong class="risk-negative">₹${riskAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong></div><div><span>Potential reward</span><strong class="risk-positive">₹${rewardAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong></div><div class="risk-readout__ratio"><span>Risk : reward</span><strong>1 : ${riskReward.toFixed(2)}</strong></div><small>Formula: (Target − Entry) ÷ (Entry − Stop-loss). Estimates only; gaps and slippage can change actual outcomes.</small>`
                : `<p class="allocation-warning">For a long trade, enter a positive entry, stop-loss below entry, and target above entry.</p>`;
            document.getElementById("checkStopPlan").disabled = !isValid || answered;
        };

        gameStage.querySelectorAll("#stopEntry, #stopPrice, #targetPrice, #stopQuantity").forEach((input) => {
            input.addEventListener("input", updatePlan);
            input.addEventListener("change", updatePlan);
        });
        updatePlan();
        document.getElementById("checkStopPlan").addEventListener("click", () => {
            if (answered) return;
            const currentEntry = Number(document.getElementById("stopEntry").value);
            const currentStop = Number(document.getElementById("stopPrice").value);
            const currentTarget = Number(document.getElementById("targetPrice").value);
            const currentQuantity = Math.max(1, Number(document.getElementById("stopQuantity").value || 1));
            if (!(currentEntry > 0 && currentStop < currentEntry && currentTarget > currentEntry)) return;
            answered = true;
            const ratio = (currentTarget - currentEntry) / (currentEntry - currentStop);
            const soundPlan = ratio >= 2;
            const points = soundPlan ? 100 : 50;
            progress.points += points;
            progress.rounds += 1;
            saveProgress();
            const feedback = document.getElementById("stoplossFeedback");
            feedback.hidden = false;
            feedback.className = `game-feedback ${soundPlan ? "is-correct" : "is-wrong"}`;
            feedback.innerHTML = `<strong>${soundPlan ? "Risk plan checked!" : "Plan calculated—review the ratio."} +${points} points.</strong> At quantity ${currentQuantity}, potential risk is ₹${((currentEntry - currentStop) * currentQuantity).toLocaleString("en-IN", { maximumFractionDigits: 2 })}, potential reward is ₹${((currentTarget - currentEntry) * currentQuantity).toLocaleString("en-IN", { maximumFractionDigits: 2 })}, giving a risk-reward ratio of 1:${ratio.toFixed(2)}. A higher ratio does not guarantee a successful trade.`;
            document.getElementById("checkStopPlan").disabled = true;
            document.getElementById("nextStoploss").hidden = false;
        });
        document.getElementById("nextStoploss").addEventListener("click", () => {
            round.stoploss += 1;
            answered = false;
            renderGame();
        });
    }

    function renderGame() {
        roundLabel.textContent = `ROUND ${round[activeGame]}`;
        if (activeGame === "predict") renderPrediction();
        else if (activeGame === "detective") renderDetective();
        else renderStopLoss();
    }

    gameStage.addEventListener("click", (event) => {
        const resetButton = event.target.closest("[data-reset-game]");
        if (!resetButton) return;
        const game = resetButton.dataset.resetGame;
        round[game] = 1;
        answered = false;
        renderGame();
    });

    document.querySelectorAll("[data-game]").forEach((button) => {
        button.addEventListener("click", () => {
            setActiveGame(button.dataset.game);
            document.getElementById("game-desk").scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    async function loadNavigation() {
        const sidebar = document.getElementById("sidebar");
        const topbar = document.getElementById("topbar");
        try {
            const [sidebarResponse, topbarResponse] = await Promise.all([
                fetch("components/sidebar.html"),
                fetch("components/topbar.html")
            ]);
            if (!sidebarResponse.ok || !topbarResponse.ok) throw new Error("Navigation could not be loaded");
            sidebar.innerHTML = await sidebarResponse.text();
            topbar.innerHTML = await topbarResponse.text();
            document.getElementById("arcadeLink")?.classList.add("active");
            window.dispatchEvent(new Event("tradenova:user-updated"));
        } catch (error) {
            console.error("Unable to load Arcade navigation", error);
        }
    }

    loadProgress();
    setActiveGame("predict");
    loadNavigation();
})();
