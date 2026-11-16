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

    const LESSON_DETAILS = {
        "market-basics": {
            simple: "Think of a company like a large bakery. It can divide ownership into many small pieces called shares. Buying one share means owning a tiny piece of that company. The share price can rise or fall, so this ownership can make money or lose money.",
            example: "If a company has 1,000 shares and you own 10, you own 1% of its shares. If the share price is ₹100, your 10 shares are worth ₹1,000 at that quoted price. If the price falls to ₹80, they are worth ₹800. Neither price is guaranteed.",
            vocabulary: [["Share", "A small unit of ownership in a company."], ["Exchange", "An organised market where buyers and sellers can trade."], ["Dividend", "A portion of company profits that may be paid to shareholders; companies are not required to pay one every time."]],
            practice: "Explain in your own words what you own when you buy a share. Then name one reason its price could go down."
        },
        "market-participants": {
            simple: "A stock market is like a regulated marketplace. The exchange provides the marketplace and its rules. A broker connects your account to that marketplace. Buyers and sellers send orders, and a trade happens only when the order terms match.",
            example: "Imagine you want to buy a book listed for ₹200. You place an order through a shop (the broker). The marketplace matches you with a seller willing to accept your order. The shop helps with the transaction but cannot promise the book will become more valuable.",
            vocabulary: [["Broker", "A firm that provides access to market services and routes customer orders."], ["Regulator", "An authority that sets and enforces rules to help keep markets fair."], ["Order", "An instruction to buy or sell, usually with a quantity and price condition."]],
            practice: "Draw three boxes labelled you, broker and exchange. Draw an arrow showing how your order reaches the market."
        },
        "quotes-and-tickers": {
            simple: "A stock quote is a small information card for a share. It may show the share's short name, a recent trade price, the number of shares traded, and the prices buyers and sellers are currently offering.",
            example: "Suppose buyers are offering ₹99 and sellers are asking ₹101. The gap is ₹2. A last-traded price of ₹100 only tells you about the most recent matched trade. A new trade could happen at a different price.",
            vocabulary: [["Ticker", "A short code used to identify a listed share."], ["Bid", "The price a buyer is currently offering."], ["Ask", "The price a seller is currently asking."], ["Volume", "The number of units traded during a chosen period."]],
            practice: "On a pretend quote, point to the buyer's price, the seller's price and the gap between them."
        },
        "order-types": {
            simple: "An order is your instruction to buy or sell. Different instructions make different trade-offs. A market order prioritises getting a trade; a limit order prioritises staying within your chosen price. Neither type guarantees a profit.",
            example: "A share is shown near ₹100. A limit buy at ₹95 means you will not pay more than ₹95, but the order may never be filled. A market buy may fill sooner, but the actual price may be higher than ₹100 if prices move or sellers are scarce.",
            vocabulary: [["Market order", "An instruction that prioritises execution at available prices."], ["Limit order", "An instruction with a maximum buy price or minimum sell price."], ["Settlement", "The process of completing the exchange of money and securities after a trade."]],
            practice: "Write down which matters more in each pretend situation: getting a trade quickly or refusing to pay above a chosen price."
        },
        "investing-vs-trading": {
            simple: "Investing and trading both involve buying and selling financial products, but often use different time periods. Investing commonly looks at goals over years. Trading often tries to respond to shorter price changes. Both can lose money.",
            example: "Two people buy the same share. One plans to study the company and hold it for several years. Another hopes to sell it later today. They face different questions, costs and risks even though the share is the same.",
            vocabulary: [["Time horizon", "How long you expect to keep money invested before needing it."], ["Goal", "The reason you are saving or investing, such as a future expense."], ["Trading", "Buying and selling to act on expected price changes, often over shorter periods."]],
            practice: "For learning only, write one pretend goal and when the money would be needed. Notice why money needed soon should not be treated like spare practice money."
        },
        "risk-and-diversification": {
            simple: "Risk means that the result is uncertain and you could lose money. Putting all your eggs in one basket means one company can strongly affect your savings. Spreading investments can reduce dependence on one company, but cannot stop every loss.",
            example: "Imagine one basket has 10 eggs and it falls: all 10 may break. If the eggs are split among several baskets, one dropped basket may not ruin everything. In markets, different investments can still fall together, so spreading is helpful but not a promise.",
            vocabulary: [["Risk", "The possibility that the result differs from what you hoped, including a loss."], ["Diversification", "Spreading investments instead of relying on only one."], ["Volatility", "How much and how quickly a price moves up and down."]],
            practice: "Compare a pretend portfolio with one company against one spread across different kinds of businesses. Ask what could still make both lose value."
        },
        "fundamental-analysis": {
            simple: "Fundamental analysis means learning how a company works and checking its published financial information. It is like checking a shop's sales, bills, debts and cash before deciding whether the shop is healthy. It helps you ask questions; it cannot predict the future.",
            example: "A shop may report ₹10 lakh in sales but also owe ₹9 lakh and have very little cash. Sales alone do not tell the whole story. For a company, read its income statement, balance sheet and cash-flow statement together.",
            vocabulary: [["Revenue", "Money a business earns from selling goods or services before expenses."], ["Debt", "Money a company owes and may need to repay with interest."], ["Cash flow", "Money moving into and out of a business."]],
            practice: "Choose a public company's official report and find its revenue, debt and cash-flow sections. Do not treat any single number as a buy signal."
        },
        "valuation": {
            simple: "Valuation is an attempt to compare a company's price with information about its business. A number can help you ask whether a price seems high or low compared with something else, but no ratio can tell you the perfect price on its own.",
            example: "Two fruit stalls each sell a basket for ₹100. One earns ₹10 profit per basket and the other ₹2. The same price means something different for each stall. A P/E ratio makes a simplified price-to-earnings comparison for a company.",
            vocabulary: [["Earnings", "Profit measured after relevant expenses, using the company's reported accounting rules."], ["P/E ratio", "Share price compared with earnings per share; it needs context."], ["Valuation", "An estimate or comparison of what something may be worth."]],
            practice: "If two companies have different P/E ratios, list three other facts you would check before comparing them."
        },
        "technical-analysis": {
            simple: "A price chart is a picture of how a price moved in the past. Some people use patterns to plan a trade. A chart shows history, not the future, and a pattern can fail even when it looks convincing.",
            example: "A daily candle may show that a share opened at ₹100, reached ₹105, fell to ₹98 and closed at ₹102. It tells you what happened in that day, not what tomorrow's price must be.",
            vocabulary: [["Timeframe", "The length of time represented by one chart bar or candle."], ["Trend", "A general direction prices have moved over a chosen period."], ["Indicator", "A calculation based on past prices or volume, not a guarantee of future direction."]],
            practice: "Look at a pretend chart and describe only what it already shows. Avoid saying that a past pattern proves what happens next."
        },
        "portfolio-construction": {
            simple: "A portfolio is the collection of investments someone owns. Portfolio construction means deciding what to include and how much to place in each part. Rebalancing means reviewing those amounts and, if appropriate, bringing them back toward a planned mix.",
            example: "A pretend portfolio starts with half in one type of investment and half in another. If one grows more, the mix changes. Rebalancing is a planned review, not a promise to sell winners or buy losers at the perfect time.",
            vocabulary: [["Portfolio", "All the investments held together."], ["Allocation", "How the portfolio is divided among investments or asset types."], ["Rebalancing", "Adjusting a portfolio toward a chosen allocation."]],
            practice: "Use paper to sketch a pretend portfolio split into three categories. Ask what might happen if one category grows much faster than the others."
        },
        "derivatives-basics": {
            simple: "A derivative is a contract whose value depends on something else, such as a share or index. Futures and options have rules, dates and obligations. They can be complicated, and borrowed or leveraged exposure can make losses grow quickly.",
            example: "A futures contract is more like agreeing to a deal for a later date than buying a small piece of a company. An option is a contract that gives a right to act under its terms. A small upfront amount does not mean the risk is small.",
            vocabulary: [["Derivative", "A contract whose value depends on another price or asset."], ["Expiry", "The date when a contract ends or must be settled under its rules."], ["Leverage", "Using a smaller amount of money to control a larger exposure, which magnifies gains and losses."]],
            practice: "Before considering any derivative, write down the contract size, expiry, required margin and the worst loss you could face. If you cannot explain them, do not trade it."
        },
        "options-risk": {
            simple: "An option is a contract with detailed rules. The person who buys an option pays a premium for a right. The person who sells or writes an option takes on an obligation. The possible loss depends on the exact strategy and can be very large.",
            example: "Suppose an option costs ₹10 per unit. That ₹10 is the buyer's starting cost per unit, not proof that the trade is safe or that the buyer will profit. The share price, time remaining and other factors affect the result.",
            vocabulary: [["Premium", "The price paid to buy an option."], ["Call", "An option that gives the buyer a right to buy under the contract terms."], ["Put", "An option that gives the buyer a right to sell under the contract terms."], ["Breakeven", "A calculated price where a simplified outcome is neither profit nor loss before some costs."]],
            practice: "Draw a small table of possible ending prices and calculate the outcome using the actual contract terms. Include fees and the maximum possible loss."
        },
        "margin-short-selling": {
            simple: "Margin is money kept as security for certain trades. Leverage means your trade is larger than the cash you put down. Borrowing or short selling can create extra obligations. If the price moves the wrong way, you may need more money or your position may be closed.",
            example: "If you control ₹1,000 worth of exposure with ₹100 of your own money, a ₹100 price drop in the exposure is a ₹100 loss—your entire ₹100 stake. The exact rules differ by product, and some losses can exceed the initial deposit.",
            vocabulary: [["Margin", "Money or assets kept as security for a position."], ["Margin call", "A request to add money or reduce a position when required security is insufficient."], ["Short selling", "Taking a position designed to benefit if a price falls; a rising price can create large losses."]],
            practice: "Use paper to calculate how a 5% move against a leveraged position changes your own money. Include the possibility that the broker closes it."
        },
        "systematic-strategies": {
            simple: "A trading strategy is a set of written rules. Testing it on old prices can help you explore how those rules might have behaved. But old information is not the future, and a computer test can look good for the wrong reasons.",
            example: "If you keep changing rules until they fit last year's prices, you may have memorised last year's pattern rather than found a useful method. A fair test also considers fees and whether a real order could have filled at that price.",
            vocabulary: [["Backtest", "A test of rules using historical data."], ["Overfitting", "Making rules fit old data so closely they may fail on new data."], ["Slippage", "The difference between the price you expected and the price you actually get."]],
            practice: "Write one simple rule before looking at results. Test it on a separate time period and record fees, missed trades and losing periods."
        },
        "risk-management": {
            simple: "Risk management means deciding in advance how you will limit harm if an idea goes wrong. A plan can help you avoid panic, but it cannot make a risky trade safe or guarantee that an exit order fills at the price you want.",
            example: "Before a pretend trade, write down why you are entering, what would show the idea is wrong, how much you can accept losing and when you will review it. Compare the plan with what you actually did afterward.",
            vocabulary: [["Position size", "How much of an investment you buy or sell."], ["Stop order", "An order triggered after a chosen price is reached; the final execution price can differ."], ["Trading journal", "A record of decisions, reasons, results and mistakes."]],
            practice: "Complete a pretend trade-journal entry without using real money. Write the reason, planned exit, possible loss and what you learned."
        },
        "tax-regulation": {
            simple: "The result you keep may be less than the price change because charges, taxes and other costs can apply. Rules depend on the product and can change. Use official sources and qualified professionals for decisions about your own taxes.",
            example: "If a pretend trade gains ₹100 but costs ₹15 in charges, the amount before any applicable tax is ₹85, not ₹100. Real costs and tax rules vary, so check the current documents for your account and product.",
            vocabulary: [["Brokerage", "A fee charged for certain broker services or trades."], ["Disclosure", "Official information a company or service must provide."], ["Investor grievance", "A complaint or problem an investor raises with a financial service provider or authority."]],
            practice: "Find the current official fee schedule and a sample contract note from your broker. Identify the trade price, charges and where to raise a complaint."
        }
    };

    const EXTRA_QUESTIONS = {
        "market-basics": [
            { question: "If a share price falls from ₹100 to ₹80, what happens to the quoted value of one share?", options: ["It falls to ₹80", "It stays guaranteed at ₹100", "It becomes a bank deposit"], answer: 0, explanation: "At that quoted price one share is worth ₹80, though the price can change again." },
            { question: "Does owning a share guarantee that the company will pay you a dividend?", options: ["Yes, every month", "No, dividends are not guaranteed", "Only if the share price falls"], answer: 1, explanation: "A company may choose whether to declare dividends, subject to applicable rules." },
            { question: "What is a sensible way to think about a share?", options: ["A small ownership stake with risk", "A guaranteed savings account", "A fixed loan repayment"], answer: 0, explanation: "A share is ownership and its value can rise or fall." }
        ],
        "market-participants": [
            { question: "Who sets the market rules and supervises market conduct?", options: ["A market regulator", "Each buyer individually", "A company's customers"], answer: 0, explanation: "Regulators oversee markets and enforce applicable rules." },
            { question: "When does a trade usually happen?", options: ["When matching buy and sell orders meet", "Whenever a buyer opens an app", "Whenever a broker promises a profit"], answer: 0, explanation: "A trade occurs when order conditions match under the market's rules." },
            { question: "Can a broker promise that your investment will make money?", options: ["Yes, if the app looks modern", "No, market returns are uncertain", "Yes, for every first-time investor"], answer: 1, explanation: "A broker can provide services but cannot guarantee market outcomes." }
        ],
        "quotes-and-tickers": [
            { question: "If the best bid is ₹99 and the ask is ₹101, what is the spread?", options: ["₹2", "₹99", "₹200"], answer: 0, explanation: "The spread is ask minus bid: ₹101 - ₹99 = ₹2." },
            { question: "Does the last traded price promise the price of your next trade?", options: ["Yes", "No", "Only when volume is high"], answer: 1, explanation: "The next trade may occur at a different price as orders change." },
            { question: "What does volume usually count?", options: ["Units traded in a period", "Number of company employees", "The company's debt"], answer: 0, explanation: "Volume is the number of units traded during the selected period." }
        ],
        "order-types": [
            { question: "What is the main trade-off with a market order?", options: ["Execution is prioritised, but price can vary", "Price is fixed and execution guaranteed", "There are no buyers or sellers"], answer: 0, explanation: "A market order prioritises execution at the available prices, which may change." },
            { question: "You place a limit buy at ₹95. The price never reaches ₹95. What may happen?", options: ["The order may remain unfilled", "It must execute at ₹100", "You automatically earn a profit"], answer: 0, explanation: "A limit order may not fill if no seller accepts the limit price." },
            { question: "What is settlement?", options: ["Completing the exchange of money and securities after a trade", "Guessing tomorrow's price", "Choosing a company name"], answer: 0, explanation: "Settlement completes the transfer of funds and securities under market rules." }
        ],
        "investing-vs-trading": [
            { question: "Which approach often has a longer time horizon?", options: ["Investing", "A same-day trade", "Neither ever has a time horizon"], answer: 0, explanation: "Investing often focuses on goals over longer periods, though approaches vary." },
            { question: "Why should you avoid investing money needed for an urgent expense?", options: ["You may need it while its value is down", "It guarantees a higher return", "Urgent expenses cannot be paid"], answer: 0, explanation: "Market values can fall at the time you need the money." },
            { question: "Does holding longer guarantee that an investment will recover?", options: ["Yes, always", "No, recovery is not guaranteed", "Only for every listed company"], answer: 1, explanation: "A longer horizon does not guarantee recovery or a profit." }
        ],
        "risk-and-diversification": [
            { question: "What is concentration risk?", options: ["Relying heavily on one investment or area", "Owning several kinds of investments", "Reading a company report"], answer: 0, explanation: "Concentration means too much of a portfolio depends on one holding or risk." },
            { question: "Can diversification prevent every loss?", options: ["Yes", "No, many investments can fall together", "Only during market hours"], answer: 1, explanation: "Diversification may reduce some specific risks, not broad market risk." },
            { question: "What does volatility describe?", options: ["How much prices move up and down", "A guaranteed yearly profit", "A broker's customer count"], answer: 0, explanation: "Volatility describes the size and frequency of price movements." }
        ],
        "fundamental-analysis": [
            { question: "Which report helps show what a company owns and owes?", options: ["Balance sheet", "A share ticker", "A price chart only"], answer: 0, explanation: "A balance sheet lists assets, liabilities and equity at a point in time." },
            { question: "If sales rise, does that automatically prove a company is healthy?", options: ["Yes", "No, expenses, debt and cash also matter", "Only if the share is popular"], answer: 1, explanation: "Sales alone do not show profitability, debt burden or cash generation." },
            { question: "Where should you look for company-reported financial information?", options: ["Official filings and reports", "Anonymous promises in a chat", "A guaranteed-return advertisement"], answer: 0, explanation: "Official reports and disclosures are a better starting point for research." }
        ],
        "valuation": [
            { question: "What does a P/E ratio compare?", options: ["Price with earnings per share", "Debt with employee count", "Volume with the number of exchanges"], answer: 0, explanation: "P/E compares a share price with earnings per share." },
            { question: "Does a lower P/E always mean a share is cheap?", options: ["Yes", "No, the business and risks need context", "Only if it fell today"], answer: 1, explanation: "Low earnings quality, risk or business changes may explain a low ratio." },
            { question: "What is a useful comparison when reviewing a ratio?", options: ["Company history and comparable businesses", "A random social-media post", "Only the highest price ever"], answer: 0, explanation: "Peers and historical context can help, though they do not prove fair value." }
        ],
        "technical-analysis": [
            { question: "What information does a candle usually show for its timeframe?", options: ["Open, high, low and close", "Next week's guaranteed price", "Company tax return"], answer: 0, explanation: "A candle summarises those four prices for its chosen time interval." },
            { question: "Can a support area guarantee that price will stop falling?", options: ["Yes", "No, price can move through it", "Only if a chart is colourful"], answer: 1, explanation: "Support is a historical reference area, not a guaranteed barrier." },
            { question: "What are most chart indicators based on?", options: ["Past prices or volume", "Guaranteed future news", "A company's private plans"], answer: 0, explanation: "Indicators calculate patterns from past market data and can give false signals." }
        ],
        "portfolio-construction": [
            { question: "What is an allocation?", options: ["How a portfolio is divided", "The next share price", "A broker password"], answer: 0, explanation: "Allocation describes how much is assigned to different investments or asset types." },
            { question: "Why consider position size before a trade?", options: ["To control how much one idea can affect you", "To guarantee a winning result", "To avoid reading the order details"], answer: 0, explanation: "Position sizing can limit concentration and the effect of one position." },
            { question: "What should be considered before rebalancing?", options: ["Your plan, costs and possible taxes", "Only today's most popular stock", "A promise that prices will rise"], answer: 0, explanation: "Rebalancing should be deliberate and account for costs and applicable taxes." }
        ],
        "derivatives-basics": [
            { question: "What gives a derivative its value?", options: ["Another price or asset it is linked to", "A fixed guarantee from the exchange", "The investor's age"], answer: 0, explanation: "A derivative's value depends on an underlying asset, rate or other reference." },
            { question: "Why can leverage be dangerous?", options: ["It can magnify losses as well as gains", "It removes all price changes", "It guarantees a small loss only"], answer: 0, explanation: "Leverage increases exposure, so an adverse move can cause a large loss." },
            { question: "What should you understand before entering a derivatives contract?", options: ["Size, expiry, obligations and worst-case risk", "Only the contract nickname", "Only how to open the app"], answer: 0, explanation: "Contract terms and exposure determine how the product can behave." }
        ],
        "options-risk": [
            { question: "What does the option buyer generally pay?", options: ["A premium", "A guaranteed dividend", "No amount under any circumstances"], answer: 0, explanation: "The option buyer pays a premium for the rights in the contract." },
            { question: "Does paying a small premium make every options strategy low-risk?", options: ["Yes", "No, the seller's obligations and full strategy matter", "Only before expiry"], answer: 1, explanation: "Risk depends on the entire position; option writers can face very large losses." },
            { question: "Why calculate a breakeven?", options: ["To understand where a simplified payoff reaches zero", "To know the guaranteed future price", "To avoid knowing the premium"], answer: 0, explanation: "Breakeven is a calculation, not a prediction or guarantee." }
        ],
        "margin-short-selling": [
            { question: "What is margin used for?", options: ["Security for certain positions", "A guaranteed bonus", "A way to remove market risk"], answer: 0, explanation: "Margin is collateral required to support certain positions." },
            { question: "What can a broker do if you do not meet a margin requirement?", options: ["Close some or all of the position", "Cancel all losses", "Guarantee the price will recover"], answer: 0, explanation: "The broker may liquidate the position, possibly at an unfavourable price." },
            { question: "Why can a short position lose a lot?", options: ["The price can keep rising", "The price cannot change", "The company must pay the short seller"], answer: 0, explanation: "A rising price moves against a short, and losses can grow substantially." }
        ],
        "systematic-strategies": [
            { question: "What should a strategy's written rules specify?", options: ["Entry, exit and position size", "Only the name of the strategy", "A guaranteed target return"], answer: 0, explanation: "Clear rules make a test meaningful and repeatable." },
            { question: "What is a common backtest problem?", options: ["Rules fit past data too closely", "It uses any written rules", "It records a date"], answer: 0, explanation: "Overfitting makes past results look good but may not work on new data." },
            { question: "Why might a paper trade differ from a real fill?", options: ["A simulation may not reproduce liquidity and execution", "Paper trades always include real buyers", "The market never changes"], answer: 0, explanation: "Simulations often simplify fills, slippage and market conditions." }
        ],
        "risk-management": [
            { question: "When should you decide the amount you can risk?", options: ["Before entering the trade", "Only after a large loss", "Whenever someone online says so"], answer: 0, explanation: "Setting limits beforehand helps avoid emotional decisions." },
            { question: "Does a stop order guarantee the exact trigger price?", options: ["Yes", "No, execution can differ", "Only for a fast-moving share"], answer: 1, explanation: "A stop trigger does not guarantee the final execution price." },
            { question: "What can a trading journal help you review?", options: ["Your decisions and repeated mistakes", "Tomorrow's guaranteed price", "A company's private information"], answer: 0, explanation: "A journal helps you review your process, not predict the market." }
        ],
        "tax-regulation": [
            { question: "Can fees and taxes change your final result?", options: ["Yes, they may reduce what you keep", "No, only price matters", "Only for paper trading"], answer: 0, explanation: "Costs and applicable taxes affect net results." },
            { question: "Where should you check current tax rules?", options: ["Official sources or a qualified tax professional", "An anonymous guaranteed-tip message", "A year-old screenshot"], answer: 0, explanation: "Rules can change and depend on your situation; check authoritative current guidance." },
            { question: "Which is a warning sign of a possible investment scam?", options: ["A promise of guaranteed high returns and pressure to act", "A clear official fee schedule", "Reading a company filing"], answer: 0, explanation: "Guaranteed returns and urgency are common warning signs. Verify before sharing money or details." }
        ]
    };

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
    let activeQuizQuestions = [];
    let activeQuestionIndex = 0;
    let questionAnswered = false;

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
                <span class="module-meta">${module.duration} · Lesson, example &amp; 4 questions</span>
            </button>`;
        }).join("");
    }

    function getModuleQuestions(module) {
        return [
            module.quiz,
            ...(EXTRA_QUESTIONS[module.id] || [])
        ];
    }

    function renderQuizQuestion() {
        const question = activeQuizQuestions[activeQuestionIndex];
        const complete = activeQuestionIndex >= activeQuizQuestions.length;
        if (complete) {
            $("knowledgeCheck").innerHTML = `<h3>Knowledge check complete</h3>
                <p class="quiz-feedback">Well done. You answered all ${activeQuizQuestions.length} questions correctly. You can now mark this module complete.</p>`;
            const alreadyDone = getCompletedModules().includes(activeModuleId);
            $("completeLesson").disabled = alreadyDone;
            $("lessonStatus").textContent = alreadyDone
                ? "You have already completed this module."
                : "All questions answered correctly. Mark the module complete to save your progress.";
            return;
        }

        selectedQuizAnswer = null;
        questionAnswered = false;
        $("knowledgeCheck").innerHTML = `<div class="quiz-heading">
                <div><h3>Check what you learned</h3><span class="quiz-count">Question ${activeQuestionIndex + 1} of ${activeQuizQuestions.length}</span></div>
                <span class="quiz-progress-track"><span style="width:${activeQuestionIndex / activeQuizQuestions.length * 100}%"></span></span>
            </div>
            <p class="quiz-question" tabindex="-1">${question.question}</p>
            <div class="quiz-options" role="group" aria-label="Choose one answer">${question.options.map((option, index) =>
                `<button type="button" class="quiz-option" data-answer="${index}" aria-pressed="false">${option}</button>`
            ).join("")}</div>
            <div class="quiz-controls">
                <button type="button" class="quiz-action" id="checkAnswer" disabled>Check my answer</button>
                <button type="button" class="quiz-action quiz-next" id="nextQuestion" hidden>${activeQuestionIndex === activeQuizQuestions.length - 1 ? "Finish questions" : "Next question"}</button>
                <button type="button" class="quiz-action quiz-retry" id="retryQuestion" hidden>Try this question again</button>
            </div>
            <p class="quiz-feedback" id="quizFeedback" role="status" aria-live="polite"></p>`;
        $("completeLesson").disabled = true;
        $("lessonStatus").textContent = "Answer all four questions correctly to finish this module. You can retry any question.";
    }

    function openModule(moduleId) {
        const module = MODULES.find((item) => item.id === moduleId);
        if (!module) return;
        activeModuleId = module.id;
        activeQuizQuestions = getModuleQuestions(module);
        activeQuestionIndex = 0;
        questionAnswered = false;
        const details = LESSON_DETAILS[module.id];
        $("lessonLevel").textContent = module.level;
        $("lessonLevel").className = `lesson-level ${module.level.toLowerCase()}`;
        $("lessonTitle").textContent = module.title;
        $("lessonContent").innerHTML = `<article class="simple-explanation">
                <span class="content-label">START HERE · PLAIN LANGUAGE</span>
                <p>${details.simple}</p>
            </article>
            <div class="lesson-topics">${module.topics.map(([title, text]) =>
                `<article class="lesson-topic"><h3>${title}</h3><p>${text}</p></article>`
            ).join("")}</div>
            <article class="worked-example">
                <span class="content-label">A SIMPLE EXAMPLE</span>
                <p>${details.example}</p>
            </article>
            <section class="lesson-vocabulary" aria-label="Key words">
                <h3>Important words, explained</h3>
                <dl>${details.vocabulary.map(([term, definition]) => `<div><dt>${term}</dt><dd>${definition}</dd></div>`).join("")}</dl>
            </section>
            <article class="try-it-yourself">
                <span aria-hidden="true">✏️</span><div><h3>Try it yourself</h3><p>${details.practice}</p></div>
            </article>`;
        const done = getCompletedModules().includes(module.id);
        $("completeLesson").disabled = true;
        $("completeLesson").textContent = done ? "Module completed" : "Mark module complete";
        $("lessonPanel").hidden = false;
        renderQuizQuestion();
        if (done) {
            $("completeLesson").disabled = true;
            $("completeLesson").textContent = "Module completed";
            $("lessonStatus").textContent = "You've completed this module. Revisit it anytime; the questions are available to practise again.";
        }
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

    const ASSISTANT_STOP_WORDS = new Set([
        "about", "after", "also", "and", "are", "can", "could", "does", "for", "from",
        "give", "help", "how", "into", "like", "mean", "more", "please", "tell", "that",
        "the", "their", "them", "there", "this", "what", "when", "where", "which", "who",
        "why", "with", "would", "your", "explain", "simple", "words"
    ]);

    function normalizeAssistantText(value) {
        return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    }

    function findRelevantModules(question) {
        const normalizedQuestion = normalizeAssistantText(question);
        const words = [...new Set(normalizedQuestion.split(" ").filter((word) =>
            word.length > 2 && !ASSISTANT_STOP_WORDS.has(word)
        ))];
        if (!words.length) return [];

        return MODULES.map((module) => {
            const details = LESSON_DETAILS[module.id];
            const title = normalizeAssistantText(module.title);
            const summary = normalizeAssistantText(module.summary);
            const explanation = normalizeAssistantText(details.simple);
            const topics = normalizeAssistantText(module.topics.map(([topic, text]) => `${topic} ${text}`).join(" "));
            const vocabulary = normalizeAssistantText(details.vocabulary.map(([term, definition]) => `${term} ${definition}`).join(" "));
            let score = 0;
            words.forEach((word) => {
                if (title.includes(word)) score += 4;
                if (summary.includes(word)) score += 2;
                if (topics.includes(word)) score += 1;
                if (vocabulary.includes(word)) score += 2;
                if (explanation.includes(word)) score += 1;
            });
            if (normalizedQuestion.includes(title)) score += 8;
            return { module, details, score };
        }).filter((result) => result.score > 0)
            .sort((first, second) => second.score - first.score)
            .slice(0, 2);
    }

    function getAssistantReply(question) {
        const normalized = normalizeAssistantText(question);

        if (/\b(should i (buy|sell|invest)|which .{0,30}(stock|share|company)|what .{0,30}(stock|share) .{0,30}(buy|invest)|best .{0,20}(stock|share|company)|recommend|choose.{0,25}(stocks?|shares?)|pick.{0,25}(stocks?|shares?)|stock picks?|target price|price target|worth buying)\b/.test(normalized)) {
            return {
                text: "I can’t tell you which stock to buy or sell, or predict a target price. That depends on your personal goals and financial situation, and no market outcome is guaranteed.\n\nFor learning, start by understanding the business, reading its official financial reports, checking valuation and risks, and comparing it with similar companies. The “Fundamental analysis” and “Risk, return and diversification” modules can help you learn those ideas. You can practise with virtual money, but the practice prices are fictional.",
                source: "Learning only — not personal financial advice."
            };
        }

        if (/\b(live|latest|current|today|right now|real time|news|price|quote|trading at)\b/.test(normalized)) {
            return {
                text: "I don’t have live prices, current company news, or real-time market data. The paper-trading instruments use fictional names and fixed example prices.\n\nFor current information, check your broker’s live quote and the company’s official exchange filings. I can still explain how to read a quote, what bid and ask mean, or how to think about market risk.",
                source: "This helper uses course material only."
            };
        }

        if (/\b(paper trading|paper trade|virtual money|practice account|simulation|simulated trade)\b/.test(normalized)) {
            return {
                text: "Paper trading lets you practise order steps without using real money. In TradeNova’s lab, you start with ₹1,00,000 in virtual cash and use fictional instruments at fixed illustrative prices. A practice trade does not reach an exchange.\n\nChoose an instrument, enter a whole-number quantity and select “Buy with virtual cash”. Your holdings and virtual cash update on this device. “Sell holding” can sell only units already held. “Reset simulation” clears practice holdings and orders and returns the virtual cash to ₹1,00,000.\n\nA simulation cannot fully reproduce real-world price changes, execution delays, fees, or emotions.",
                source: "Paper Trading Lab — practice only."
            };
        }

        if (/^(hi|hello|hey|good morning|good afternoon|good evening)$/.test(normalized)) {
            return {
                text: "Hello! Ask me to explain a course topic, define a market word, or help you understand the paper-trading lab. For example: “What is a share?”",
                source: "TradeNova Learning Helper"
            };
        }

        const matches = findRelevantModules(question);
        if (!matches.length) {
            return {
                text: "I couldn’t find a close match in the course yet. Try asking about shares, exchanges, stock quotes, order types, investing, risk, company financials, valuation, charts, portfolios, derivatives, margin, trading strategies, costs, or paper trading.\n\nI can explain learning topics, but I don’t provide live stock data or personalised buy/sell advice.",
                source: "TradeNova course material"
            };
        }

        const result = matches[0];
        const { module, details } = result;
        const keyIdeas = module.topics.slice(0, 2)
            .map(([title, text]) => `${title}: ${text}`)
            .join("\n\n");
        const vocabulary = details.vocabulary.slice(0, 2)
            .map(([term, definition]) => `${term}: ${definition}`)
            .join("\n");
        return {
            text: `Here’s a simple explanation of ${module.title}:\n\n${details.simple}\n\nA simple example:\n${details.example}\n\nKey ideas:\n${keyIdeas}\n\nUseful words:\n${vocabulary}\n\nTry this: ${details.practice}`,
            source: `From the ${module.level.toLowerCase()} module: ${module.title}`
        };
    }

    function appendAssistantMessage(message, isUser = false) {
        const article = document.createElement("article");
        article.className = `chat-message ${isUser ? "user-message" : "assistant-message"}`;

        const avatar = document.createElement("span");
        avatar.className = "chat-avatar";
        avatar.setAttribute("aria-hidden", "true");
        avatar.textContent = isUser ? "YOU" : "TN";

        const bubble = document.createElement("div");
        bubble.className = "chat-bubble";

        const label = document.createElement("strong");
        label.textContent = isUser ? "You" : "TradeNova Learning Helper";
        bubble.appendChild(label);

        const text = document.createElement("p");
        text.textContent = message.text;
        bubble.appendChild(text);

        if (message.source) {
            const source = document.createElement("span");
            source.className = "chat-source";
            source.textContent = message.source;
            bubble.appendChild(source);
        }

        article.append(avatar, bubble);
        $("assistantChat").appendChild(article);
        $("assistantChat").scrollTop = $("assistantChat").scrollHeight;
    }

    function submitAssistantQuestion(question) {
        const trimmedQuestion = question.trim();
        if (!trimmedQuestion) {
            $("assistantStatus").textContent = "Type a question first.";
            $("assistantStatus").classList.add("assistant-error");
            return;
        }

        appendAssistantMessage({ text: trimmedQuestion }, true);
        appendAssistantMessage(getAssistantReply(trimmedQuestion));
        $("assistantStatus").textContent = "Questions stay in this browser and are not sent to an AI service.";
        $("assistantStatus").classList.remove("assistant-error");
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
                const active = window.location.hash === "#learningAssistant"
                    ? $("learningAssistantLink")
                    : [...document.querySelectorAll(".sidebar li")].find((item) => item.textContent.includes("Learn & Practice"));
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
        $("assistantForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const input = $("assistantInput");
            submitAssistantQuestion(input.value);
            input.value = "";
            input.focus();
        });
        $("assistantInput").addEventListener("input", () => {
            $("assistantStatus").textContent = `${500 - $("assistantInput").value.length} characters remaining`;
            $("assistantStatus").classList.remove("assistant-error");
        });
        $("assistantInput").addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                $("assistantForm").requestSubmit();
            }
        });
        document.querySelectorAll(".assistant-prompt").forEach((button) => {
            button.addEventListener("click", () => {
                submitAssistantQuestion(button.textContent);
                $("assistantInput").focus();
            });
        });

        if (window.location.hash === "#learningAssistant") {
            window.setTimeout(() => $("learningAssistant").scrollIntoView({ behavior: "smooth" }), 300);
        }
    }

    function updateSelectedQuote() {
        const instrument = INSTRUMENTS.find((item) => item.symbol === $("paperSymbol").value);
        $("selectedQuote").textContent = instrument
            ? `Illustrative price: ${formatCurrency(instrument.price)} per unit`
            : "";
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, (character) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[character]);
    }

    function createStudyGuide() {
        const modules = MODULES.map((module, index) => {
            const details = LESSON_DETAILS[module.id];
            const questions = getModuleQuestions(module);
            return `<article class="module">
                <p class="level">MODULE ${index + 1} · ${escapeHTML(module.level)}</p>
                <h2>${escapeHTML(module.title)}</h2>
                <p class="summary">${escapeHTML(module.summary)}</p>
                <h3>In simple words</h3><p>${escapeHTML(details.simple)}</p>
                ${module.topics.map(([title, text]) => `<h3>${escapeHTML(title)}</h3><p>${escapeHTML(text)}</p>`).join("")}
                <h3>A simple example</h3><p>${escapeHTML(details.example)}</p>
                <h3>Important words</h3><dl>${details.vocabulary.map(([term, definition]) => `<dt>${escapeHTML(term)}</dt><dd>${escapeHTML(definition)}</dd>`).join("")}</dl>
                <h3>Try it yourself</h3><p>${escapeHTML(details.practice)}</p>
                <h3>Questions and explanations</h3>
                <ol>${questions.map((question) => `<li><strong>${escapeHTML(question.question)}</strong><ul>${question.options.map((option, optionIndex) =>
                    `<li${optionIndex === question.answer ? ' class="answer"' : ""}>${escapeHTML(option)}${optionIndex === question.answer ? " — Correct answer" : ""}</li>`
                ).join("")}</ul><p class="explanation">${escapeHTML(question.explanation)}</p></li>`).join("")}</ol>
            </article>`;
        }).join("");

        return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
            <title>TradeNova Stock Learning Study Guide</title>
            <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
            <style>
                *{box-sizing:border-box}body{max-width:850px;margin:32px auto;padding:0 24px;color:#243244;font:16px/1.7 Inter,Arial,sans-serif}
                h1{color:#143d55;font-size:34px;line-height:1.2}h2{margin:8px 0;color:#153f58;font-size:25px}h3{margin:22px 0 5px;color:#176e5c;font-size:18px}
                p{margin:7px 0}li{margin:6px 0}.level,.label{color:#176e5c;font-size:12px;font-weight:800;letter-spacing:1px}
                .intro,.simple,.example{padding:16px;border-radius:10px;background:#f0f7f5}.module{padding:18px 0 30px;border-bottom:2px solid #e5edf1}
                dt{margin-top:8px;font-weight:700}dd{margin-left:0}.answer{font-weight:700;color:#176e5c}.explanation{color:#526174}
                .toolbar{position:sticky;top:8px;padding:12px;background:white;border:1px solid #dce5ef;border-radius:10px}
                button{padding:10px 14px;border:0;border-radius:8px;background:#176e5c;color:white;font:inherit;cursor:pointer}
                @media print{body{max-width:none;margin:0;padding:0;font-size:11pt}.toolbar{display:none}.module{break-inside:avoid-page}h2,h3{break-after:avoid}}
            </style></head><body>
            <div class="toolbar"><button onclick="window.print()">Print / Save as PDF</button> <span>In the print window, choose “Save as PDF” to create a PDF file.</span></div>
            <h1>TradeNova Stock Market Learning Guide</h1>
            <div class="intro"><p>This original guide is for learning only, not personal financial advice. It uses simple explanations and examples. Market prices can go up or down; no result is guaranteed. The examples are not real recommendations.</p>
            <p>Work through the modules in order. Pause to explain each idea in your own words. Use the questions to check understanding, not to make investment decisions.</p></div>
            ${modules}
            </body></html>`;
    }

    function printStudyGuide() {
        const guideWindow = window.open("", "_blank");
        if (!guideWindow) {
            $("resourceStatus").textContent = "Your browser blocked the new tab. Allow pop-ups for this site, then try again.";
            return;
        }
        guideWindow.document.open();
        guideWindow.document.write(createStudyGuide());
        guideWindow.document.close();
        guideWindow.focus();
        $("resourceStatus").textContent = "Study guide opened in a new tab. Use its Print / Save as PDF button, then choose “Save as PDF”.";
    }

    function downloadStudyGuide() {
        const guide = createStudyGuide();
        const downloadUrl = URL.createObjectURL(new Blob([guide], { type: "text/html;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "TradeNova-Stock-Learning-Guide.html";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
        $("resourceStatus").textContent = "Study guide downloaded as an HTML file. Open it and choose “Print / Save as PDF” to create a PDF.";
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
        if (answerButton && !questionAnswered) {
            selectedQuizAnswer = Number(answerButton.dataset.answer);
            document.querySelectorAll(".quiz-option").forEach((button) => {
                button.classList.toggle("selected", button === answerButton);
                button.setAttribute("aria-pressed", String(button === answerButton));
            });
            $("checkAnswer").disabled = false;
        }

        if (event.target.closest("#checkAnswer") && selectedQuizAnswer !== null && activeModuleId) {
            const question = activeQuizQuestions[activeQuestionIndex];
            const correct = selectedQuizAnswer === question.answer;
            questionAnswered = correct;
            $("quizFeedback").textContent = `${correct ? "That's right! " : "Not quite yet. "}${question.explanation}`;
            if (correct) {
                document.querySelectorAll(".quiz-option").forEach((button) => {
                    button.disabled = true;
                    if (Number(button.dataset.answer) === question.answer) button.classList.add("correct");
                });
                $("checkAnswer").hidden = true;
                $("nextQuestion").hidden = false;
            } else {
                const selectedButton = document.querySelector(`.quiz-option[data-answer="${selectedQuizAnswer}"]`);
                if (selectedButton) selectedButton.classList.add("incorrect");
                document.querySelectorAll(".quiz-option").forEach((button) => { button.disabled = true; });
                $("checkAnswer").hidden = true;
                $("retryQuestion").hidden = false;
            }
        }

        if (event.target.closest("#retryQuestion")) {
            renderQuizQuestion();
            const firstOption = document.querySelector(".quiz-option");
            if (firstOption) firstOption.focus();
        }

        if (event.target.closest("#nextQuestion")) {
            activeQuestionIndex += 1;
            renderQuizQuestion();
            const question = document.querySelector(".quiz-question");
            if (question) question.focus();
        }
    });

    $("closeLesson").addEventListener("click", () => { $("lessonPanel").hidden = true; });
    $("completeLesson").addEventListener("click", () => {
        if (!activeModuleId) return;
        if (activeQuestionIndex < activeQuizQuestions.length) {
            $("lessonStatus").textContent = "Please answer every question correctly before completing this module.";
            return;
        }
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
    $("printStudyGuide").addEventListener("click", printStudyGuide);
    $("downloadStudyGuide").addEventListener("click", downloadStudyGuide);
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
