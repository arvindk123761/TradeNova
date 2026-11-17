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
    const PRACTICE_CLOSING_PRICES = [
        101, 100, 103, 102, 104, 103, 106, 105, 107, 104, 108, 107,
        110, 108, 111, 109, 112, 111, 114, 110, 113, 115, 113, 117,
        115, 118, 116, 120, 117, 121, 119, 123, 120, 124, 122, 126
    ];
    const REPLAY_CLOSING_PRICES = [
        100, 102, 101, 104, 103, 105, 102, 99, 101, 98, 96, 99,
        102, 100, 104, 107, 105, 109, 111, 108, 112, 115
    ];
    const SIMULATED_MARKET_MOVES = {
        ALFA: [0, 0.018, 0.027, -0.014, -0.045, -0.068, -0.032, 0.014, 0.038],
        BETA: [0, -0.008, 0.012, 0.021, 0.009, -0.019, -0.031, -0.004, 0.016],
        GROW: [0, 0.025, -0.011, -0.036, -0.058, -0.024, 0.019, 0.047, 0.031],
        NOVA: [0, -0.013, -0.028, -0.009, 0.026, 0.055, 0.018, -0.041, -0.019]
    };
    const STARTING_CASH = 100000;
    const USER_STORAGE_SCOPE = getUserStorageScope();
    const PROGRESS_KEY = USER_STORAGE_SCOPE
        ? `tradenovaLearningProgress:${USER_STORAGE_SCOPE}` : "tradenovaLearningProgress";
    const PAPER_KEY = USER_STORAGE_SCOPE
        ? `tradenovaPaperTrading:${USER_STORAGE_SCOPE}` : "tradenovaPaperTrading";
    const LAB_KEY = USER_STORAGE_SCOPE
        ? `tradenovaPracticeProgress:${USER_STORAGE_SCOPE}` : "tradenovaPracticeProgress";
    const REPLAY_DATA_KEY = USER_STORAGE_SCOPE
        ? `tradenovaHistoricalReplay:${USER_STORAGE_SCOPE}` : "tradenovaHistoricalReplay";
    const SYNC_KEY = USER_STORAGE_SCOPE ? `tradenovaLearningSync:${USER_STORAGE_SCOPE}` : null;
    const CHART_QUESTIONS = [
        { topic: "Candlesticks", prompt: "The latest candle closes above its open. What does its body show?", options: ["The close was higher than the open", "The next candle must also rise", "The company reported a profit"], answer: 0, explanation: "A green candle means this candle's close was above its open; it does not predict the next candle." },
        { topic: "Trend reading", prompt: "Recent swing highs and swing lows are both rising. What is the simplest description?", options: ["A short-term uptrend", "A guaranteed breakout", "A fixed support level"], answer: 0, explanation: "Higher highs and higher lows describe an uptrend over the selected window, not a forecast." },
        { topic: "Support & resistance", prompt: "Price has paused near the same area several times. How should you read that area?", options: ["A reference area where price previously reacted", "A guaranteed floor that cannot break", "A guaranteed place to buy"], answer: 0, explanation: "Support and resistance are historical reference areas. Price can move through them." },
        { topic: "Breakouts", prompt: "Price moves above a prior resistance area. What is the most careful interpretation?", options: ["A possible breakout that still needs context and risk planning", "Proof that price will keep rising", "A signal to ignore position size"], answer: 0, explanation: "A move above resistance can fail. Volume, context and a defined risk plan still matter." },
        { topic: "Candlestick patterns", prompt: "A candle has a long lower wick and closes back above its open. What can that describe?", options: ["Price fell intraperiod but buyers lifted the close; it is not a guarantee", "Price never moved below its open", "The next session must gap up"], answer: 0, explanation: "A long lower wick shows the low was well below the close. It describes that period only." },
        { topic: "RSI", prompt: "A 14-period RSI reading is above 70. What does this commonly suggest?", options: ["Strong recent momentum that may be called overbought—not an automatic sell", "A guaranteed price reversal", "That the price cannot rise further"], answer: 0, explanation: "Above 70 is often called overbought, but strong trends can remain elevated and indicators can mislead." },
        { topic: "Moving averages", prompt: "The short moving average is above the long moving average. What does that compare?", options: ["Recent average prices are higher than the longer-period average", "The stock is guaranteed to outperform", "The company has more cash than debt"], answer: 0, explanation: "Moving averages smooth past prices. They lag and do not guarantee future direction." }
    ];
    const SCENARIOS = [
        {
            id: "sudden-fall", topic: "Risk management", title: "A sudden 5% price drop",
            situation: "A simulated holding falls 5% quickly. Your original reason for entering has not been reviewed yet.",
            options: [
                { label: "Pause, check the plan and predefined risk limit", score: 100, feedback: "A pause and a pre-written risk plan help avoid a rushed reaction. Reassess the original hypothesis and risk; no response guarantees an outcome." },
                { label: "Immediately buy more to recover faster", score: 0, feedback: "Adding after a loss without a fresh plan can increase concentration and risk. Review the position before acting." },
                { label: "Ignore the move because prices always recover", score: 0, feedback: "Prices do not always recover. A risk limit and an honest review are safer learning habits than assuming a recovery." }
            ]
        },
        {
            id: "good-results", topic: "Fundamental analysis", title: "A company announces strong results",
            situation: "A company reports higher revenue. You have not read its full results or checked its debt and cash flow.",
            options: [
                { label: "Read the full filing, compare context and note what remains uncertain", score: 100, feedback: "Revenue is only one part of a company's results. Check profitability, debt, cash flow, guidance and the source before forming a view." },
                { label: "Buy immediately because revenue increased", score: 0, feedback: "Revenue growth alone does not establish business quality or fair value. Read the rest of the report and consider uncertainty." },
                { label: "Assume the share price must rise", score: 0, feedback: "Prices can fall even after positive news, for example when expectations differ. No announcement guarantees a price move." }
            ]
        },
        {
            id: "breakout", topic: "Chart reading", title: "Price moves above resistance",
            situation: "Price moves above an area it previously struggled to cross. Volume is not noticeably higher.",
            options: [
                { label: "Treat it as a possible breakout; check context and define risk first", score: 100, feedback: "A breakout can fail. Confirmation, context and a defined loss limit matter more than assuming the pattern must continue." },
                { label: "Assume the breakout guarantees a rally", score: 0, feedback: "Chart patterns are not guarantees. A price can reverse or move sideways after crossing a reference area." },
                { label: "Use the largest possible position", score: 0, feedback: "Position size controls the impact of a wrong idea. Conviction is not a substitute for a risk limit." }
            ]
        },
        {
            id: "rsi-75", topic: "Technical indicators", title: "RSI reaches 75",
            situation: "A simulated 14-period RSI reads 75 while price is trending upward.",
            options: [
                { label: "Read it as strong recent momentum; avoid treating it as a standalone sell signal", score: 100, feedback: "An RSI above 70 is often described as overbought, but a strong trend can stay elevated. Indicators can give false signals." },
                { label: "Sell immediately because reversal is certain", score: 0, feedback: "An elevated RSI does not guarantee a reversal. Consider timeframe, context and risk rather than one indicator." },
                { label: "Ignore risk because momentum is strong", score: 0, feedback: "Momentum can change. A risk plan remains useful regardless of an indicator reading." }
            ]
        },
        {
            id: "market-crash", topic: "Portfolio protection", title: "The broader market falls sharply",
            situation: "Several simulated holdings decline together during a market-wide sell-off.",
            options: [
                { label: "Review concentration, cash needs and the plan before any changes", score: 100, feedback: "A broad decline can affect many holdings at once. Check concentration, time horizon and risk limits without assuming recovery." },
                { label: "Assume diversification prevents further losses", score: 0, feedback: "Diversification may reduce single-company risk but cannot eliminate market-wide losses." },
                { label: "Make an impulsive trade to win back the loss today", score: 0, feedback: "Trying to recover losses immediately can turn into revenge trading. Taking a pause is a valid risk-control action." }
            ]
        }
    ];
    const INITIAL_LAB_PROGRESS = {
        firstQuizResults: {},
        attempts: [],
        mistakes: [],
        replayIndex: 5,
        replayCorrect: 0,
        replayTotal: 0,
        replayAwaitingNext: false,
        replayFeedback: "",
        replayDataset: "",
        scenarioResults: {}
    };
    let activeModuleId = null;
    let selectedQuizAnswer = null;
    let activeQuizQuestions = [];
    let activeQuestionIndex = 0;
    let questionAnswered = false;
    let activeChartQuestionIndex = 0;
    let chartQuestionAnswered = false;
    let applyingRemoteState = false;
    let remoteSyncReady = false;
    let remoteSyncTimer = null;
    let remoteSyncQueue = Promise.resolve();
    let labProgress = loadLabProgress();
    let activeReplayData = null;

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

    function getUserStorageScope() {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (user && (typeof user.id === "string" || typeof user.id === "number") && String(user.id).trim()) {
                return `user-${encodeURIComponent(String(user.id).trim())}`;
            }
            return "";
        } catch (error) {
            console.error("Unable to identify the signed-in user for learning progress", error);
            return "";
        }
    }

    function getAuthToken() {
        try {
            return localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        } catch (error) {
            console.error("Unable to read the sign-in token for learning sync", error);
            return "";
        }
    }

    function setSyncStatus(message, isError = false, canRetry = false) {
        const status = $("learningSyncStatus");
        if (!status) return;
        status.textContent = message;
        status.classList.toggle("is-error", isError);
        $("retryLearningSync").hidden = !canRetry;
    }

    function getLocalStateTimestamp() {
        if (!SYNC_KEY) return 0;
        try {
            const savedAt = Number(localStorage.getItem(SYNC_KEY));
            if (Number.isFinite(savedAt) && savedAt > 0) return savedAt;
        } catch (error) {
            console.error("Unable to read the learning sync timestamp", error);
        }
        const savedProgress = readJSON(LAB_KEY, null);
        const savedPaper = readJSON(PAPER_KEY, null);
        const quizTimes = savedProgress && savedProgress.firstQuizResults
            ? Object.values(savedProgress.firstQuizResults).map((result) => Number(result.time) || 0) : [];
        const attemptTimes = savedProgress && Array.isArray(savedProgress.attempts)
            ? savedProgress.attempts.map((attempt) => Number(attempt.time) || 0) : [];
        const mistakeTimes = savedProgress && Array.isArray(savedProgress.mistakes)
            ? savedProgress.mistakes.map((mistake) => Number(mistake.lastAt) || 0) : [];
        const tradeTimes = savedPaper && Array.isArray(savedPaper.history)
            ? savedPaper.history.map((trade) => Number(trade.time) || 0) : [];
        return Math.max(0, ...quizTimes, ...attemptTimes, ...mistakeTimes, ...tradeTimes);
    }

    function getLocalLearningState() {
        return {
            labProgress,
            paperAccount,
            completedModules: getCompletedModules()
        };
    }

    function scheduleRemoteSync() {
        if (!SYNC_KEY || !remoteSyncReady || applyingRemoteState || !getAuthToken()) return;
        if (remoteSyncTimer !== null) window.clearTimeout(remoteSyncTimer);
        remoteSyncTimer = window.setTimeout(() => {
            remoteSyncTimer = null;
            remoteSyncQueue = remoteSyncQueue.then(syncLocalState).catch((error) => {
                console.error("Unable to sync learning progress", error);
                setSyncStatus(error.message || "Learning progress could not sync. Your local copy is saved.", true, true);
            });
        }, 500);
    }

    async function syncLocalState() {
        const token = getAuthToken();
        if (!token) throw new Error("You are signed out. Sign in again to sync this progress.");
        setSyncStatus("Syncing your learning progress and virtual account…");
        const response = await fetch(`${window.location.origin}/api/learning/state`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(getLocalLearningState())
        });
        const data = await response.json();
        if (!response.ok || !data.success || !data.updatedAt || !Number.isFinite(Date.parse(data.updatedAt))) {
            throw new Error(data.message || `Learning progress sync failed (${response.status}).`);
        }
        localStorage.setItem(SYNC_KEY, String(Date.parse(data.updatedAt)));
        setSyncStatus("Learning progress and virtual trades are synced to your signed-in account.");
    }

    function applyRemoteState(state, updatedAt) {
        applyingRemoteState = true;
        try {
            labProgress = loadLabProgress(state.labProgress);
            restoreHistoricalReplaySelection();
            paperAccount = loadPaperAccount(state.paperAccount);
            if (!saveJSON(PROGRESS_KEY, state.completedModules) ||
                !saveJSON(LAB_KEY, labProgress) ||
                !saveJSON(PAPER_KEY, paperAccount)) {
                throw new Error("The server copy loaded, but this browser could not save the local copy.");
            }
            localStorage.setItem(SYNC_KEY, String(updatedAt));
        } finally {
            applyingRemoteState = false;
        }
        const activeFilter = document.querySelector(".level-filter.active");
        renderModules(activeFilter ? activeFilter.dataset.level : "all");
        updateProgress();
        renderPaperAccount();
        renderReplayChart();
        renderScenarios();
    }

    async function syncLearningState() {
        if (!SYNC_KEY) {
            setSyncStatus(getAuthToken()
                ? "Your local user profile is unavailable. Progress remains saved in this browser."
                : "Saved in this browser. Sign in to sync progress to your account.",
            Boolean(getAuthToken()));
            return;
        }
        const token = getAuthToken();
        if (!token) {
            remoteSyncReady = false;
            setSyncStatus("Saved in this browser. Sign in to sync progress to your account.");
            return;
        }

        const localTimeAtStart = getLocalStateTimestamp();
        remoteSyncReady = false;
        setSyncStatus("Checking your saved learning progress…");
        try {
            const response = await fetch(`${window.location.origin}/api/learning/state`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || `Learning progress could not load (${response.status}).`);
            }
            const localTimeNow = getLocalStateTimestamp();
            const remoteTime = data.state ? Date.parse(data.state.updatedAt) : 0;
            if (data.state && !Number.isFinite(remoteTime)) {
                throw new Error("The server returned an invalid learning progress timestamp.");
            }

            if (localTimeNow > localTimeAtStart || localTimeNow > remoteTime) {
                remoteSyncReady = true;
                await syncLocalState();
            } else if (data.state && remoteTime > localTimeNow) {
                applyRemoteState(data.state, remoteTime);
                remoteSyncReady = true;
                setSyncStatus("Your latest learning progress and virtual trades were loaded from your account.");
            } else {
                remoteSyncReady = true;
                await syncLocalState();
            }
        } catch (error) {
            remoteSyncReady = true;
            console.error("Unable to load account learning progress", error);
            setSyncStatus(`${error.message || "Account sync is unavailable."} Your local copy is still available.`, true, true);
        }
    }

    function saveJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            if (SYNC_KEY && !applyingRemoteState &&
                [PROGRESS_KEY, PAPER_KEY, LAB_KEY].includes(key)) {
                localStorage.setItem(SYNC_KEY, String(Date.now()));
                scheduleRemoteSync();
            }
            return true;
        } catch (error) {
            console.error(`Unable to save learning data: ${key}`, error);
            return false;
        }
    }

    function loadLabProgress(savedValue) {
        const saved = arguments.length ? savedValue : readJSON(LAB_KEY, null);
        if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
            return JSON.parse(JSON.stringify(INITIAL_LAB_PROGRESS));
        }
        return {
            firstQuizResults: saved.firstQuizResults && typeof saved.firstQuizResults === "object" && !Array.isArray(saved.firstQuizResults)
                ? saved.firstQuizResults : {},
            attempts: Array.isArray(saved.attempts) ? saved.attempts.filter((item) =>
                item && ["knowledge", "chart", "decision", "risk"].includes(item.category) &&
                Number.isFinite(item.score) && item.score >= 0 && item.score <= 100 &&
                Number.isFinite(item.time) && typeof item.session === "string"
            ).slice(-200) : [],
            mistakes: Array.isArray(saved.mistakes) ? saved.mistakes.filter((item) =>
                item && typeof item.type === "string" && Number.isSafeInteger(item.count) && item.count > 0
            ).slice(-30) : [],
            replayIndex: Number.isSafeInteger(saved.replayIndex)
                ? Math.max(5, Math.min(REPLAY_CLOSING_PRICES.length - 1, saved.replayIndex)) : 5,
            replayCorrect: Number.isSafeInteger(saved.replayCorrect) && saved.replayCorrect >= 0 ? saved.replayCorrect : 0,
            replayTotal: Number.isSafeInteger(saved.replayTotal) && saved.replayTotal >= 0 ? saved.replayTotal : 0,
            replayAwaitingNext: saved.replayAwaitingNext === true,
            replayFeedback: typeof saved.replayFeedback === "string" ? saved.replayFeedback.slice(0, 500) : "",
            replayDataset: typeof saved.replayDataset === "string" &&
                /^[A-Z0-9^][A-Z0-9.^_-]{0,23}:(1mo|3mo|6mo|1y):\d{4}-\d{2}-\d{2}:\d{4}-\d{2}-\d{2}$/.test(saved.replayDataset)
                ? saved.replayDataset : "",
            scenarioResults: saved.scenarioResults && typeof saved.scenarioResults === "object" && !Array.isArray(saved.scenarioResults)
                ? saved.scenarioResults : {}
        };
    }

    function isValidHistoricalCandle(candle) {
        return candle && typeof candle.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(candle.date) &&
            ["open", "high", "low", "close", "volume"].every((key) => Number.isFinite(candle[key])) &&
            candle.open > 0 && candle.high > 0 && candle.low > 0 && candle.close > 0 &&
            candle.volume >= 0 && candle.high >= Math.max(candle.open, candle.close) &&
            candle.low <= Math.min(candle.open, candle.close) && candle.high >= candle.low;
    }

    function loadStoredReplayData() {
        const saved = readJSON(REPLAY_DATA_KEY, null);
        if (!saved || typeof saved.symbol !== "string" || typeof saved.range !== "string" ||
            !/^[A-Z0-9^][A-Z0-9.^_-]{0,23}$/.test(saved.symbol) ||
            !["1mo", "3mo", "6mo", "1y"].includes(saved.range) || !Array.isArray(saved.candles)) {
            return null;
        }
        const candles = saved.candles.filter(isValidHistoricalCandle).slice(-22);
        if (candles.length < 7) return null;
        const datasetKey = `${saved.symbol}:${saved.range}:${candles[0].date}:${candles[candles.length - 1].date}`;
        return {
            symbol: saved.symbol,
            name: typeof saved.name === "string" ? saved.name.slice(0, 120) : saved.symbol,
            exchange: typeof saved.exchange === "string" ? saved.exchange.slice(0, 40) : "",
            currency: typeof saved.currency === "string" ? saved.currency.slice(0, 12) : "",
            range: saved.range,
            source: "Yahoo Finance",
            datasetKey,
            candles
        };
    }

    function restoreHistoricalReplaySelection() {
        activeReplayData = loadStoredReplayData();
        if (!labProgress.replayDataset && activeReplayData) {
            labProgress.replayDataset = activeReplayData.datasetKey;
        }

        if (labProgress.replayDataset) {
            const [symbol, range] = labProgress.replayDataset.split(":");
            $("historicalSymbol").value = symbol;
            $("historicalRange").value = range;
            if (!activeReplayData || activeReplayData.datasetKey !== labProgress.replayDataset) {
                activeReplayData = null;
                $("historicalDataStatus").textContent =
                    `Load ${symbol} · ${range} again to resume the saved historical replay on this device.`;
                return;
            }
            $("historicalDataStatus").textContent =
                `${activeReplayData.name} · Cached historical data from Yahoo Finance. Reload to check for newer candles.`;
            return;
        }

        $("historicalDataStatus").textContent = activeReplayData
            ? `${activeReplayData.name} · Cached historical data from Yahoo Finance.`
            : "Using the built-in synthetic replay. Example symbols: RELIANCE.NS, TCS.NS or AAPL.";
    }

    function persistLabProgress() {
        return saveJSON(LAB_KEY, labProgress);
    }

    function getPracticeSessionId() {
        const sessionKey = "tradenovaLabSession";
        try {
            let session = sessionStorage.getItem(sessionKey);
            if (!session) {
                session = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                sessionStorage.setItem(sessionKey, session);
            }
            return session;
        } catch (error) {
            console.error("Unable to read the practice session in this browser", error);
            return `page-${Date.now()}`;
        }
    }

    function recordPerformance(category, score, topic, mistakeType = "") {
        labProgress.attempts.push({
            category,
            score: Math.max(0, Math.min(100, Math.round(score))),
            topic,
            time: Date.now(),
            session: getPracticeSessionId()
        });
        labProgress.attempts = labProgress.attempts.slice(-200);
        if (mistakeType) {
            const existing = labProgress.mistakes.find((mistake) => mistake.type === mistakeType);
            if (existing) {
                existing.count += 1;
                existing.lastAt = Date.now();
            } else {
                labProgress.mistakes.push({ type: mistakeType, count: 1, lastAt: Date.now() });
                labProgress.mistakes = labProgress.mistakes.slice(-30);
            }
        }
        persistLabProgress();
        renderAnalytics();
    }

    function getCategoryStats(category) {
        const attempts = labProgress.attempts.filter((item) => item.category === category);
        return {
            count: attempts.length,
            score: attempts.length
                ? Math.round(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length)
                : null
        };
    }

    function getQuizStats() {
        const results = Object.values(labProgress.firstQuizResults);
        return {
            count: results.length,
            score: results.length
                ? Math.round(results.reduce((sum, item) => sum + (item.correct ? 100 : 0), 0) / results.length)
                : null
        };
    }

    function renderAnalytics() {
        const categories = [
            { key: "knowledge", title: "Knowledge", stats: getQuizStats() },
            { key: "chart", title: "Chart reading", stats: getCategoryStats("chart") },
            { key: "decision", title: "Decision-making", stats: getCategoryStats("decision") },
            { key: "risk", title: "Risk management", stats: getCategoryStats("risk") }
        ];
        const overall = Math.round(categories.reduce((sum, item, index) =>
            sum + (item.stats.score || 0) * [0.4, 0.2, 0.2, 0.2][index], 0));
        const level = overall >= 75 ? "Advanced learner" : overall >= 45 ? "Intermediate learner" : "Beginner learner";
        $("learningScore").innerHTML = `${overall}<span>/100</span>`;
        $("learnerLevel").textContent = labProgress.attempts.length ? level : "New learner";
        $("quizAccuracy").textContent = categories[0].stats.score === null ? "—" : `${categories[0].stats.score}%`;
        $("completedLessons").textContent = `${getCompletedModules().length} / ${MODULES.length}`;
        $("practiceSessions").textContent = new Set(labProgress.attempts.map((item) => item.session)).size.toString();
        $("repeatedMistakes").textContent = labProgress.mistakes.filter((item) => item.count >= 2).length.toString();
        const closedTrades = paperAccount.history.filter((trade) =>
            trade.side === "SELL" && Number.isFinite(trade.pnl));
        const realizedPnl = closedTrades.reduce((sum, trade) => sum + trade.pnl, 0);
        const unrealizedPnl = Object.entries(paperAccount.holdings).reduce((sum, [symbol, holding]) =>
            sum + (getInstrumentPrice(symbol) - holding.averageCost) * holding.quantity, 0);
        const totalPnl = realizedPnl + unrealizedPnl;
        const positiveTrades = closedTrades.filter((trade) => trade.pnl > 0).length;
        $("tradingPerformance").textContent = formatCurrency(totalPnl);
        $("tradingPerformance").classList.toggle("negative-value", totalPnl < 0);
        $("tradingPerformance").classList.toggle("positive-value", totalPnl >= 0);
        $("tradingPerformanceDetail").textContent = closedTrades.length
            ? `${closedTrades.length} closed exits · ${Math.round(positiveTrades / closedTrades.length * 100)}% positive`
            : "No closed practice trades";
        const replayAttempts = labProgress.attempts.filter((item) =>
            item.category === "decision" && ["Historical replay", "Synthetic replay"].includes(item.topic));
        $("historicalReplayScore").textContent = replayAttempts.length
            ? `${Math.round(replayAttempts.reduce((sum, item) => sum + item.score, 0) / replayAttempts.length)}%`
            : "—";
        $("skillBreakdown").innerHTML = categories.map((item) => `<div class="skill-row">
            <span>${item.title}</span><span class="skill-track"><span style="width:${item.stats.score || 0}%"></span></span>
            <strong>${item.stats.score === null ? "—" : item.stats.score}</strong></div>`).join("");
        renderTopicMastery();
        renderWeeklyPerformance();
        renderRecommendations(categories);
    }

    function renderTopicMastery() {
        const quizTopics = [
            { title: "Market basics", modules: ["market-basics", "market-participants", "quotes-and-tickers", "order-types", "investing-vs-trading"] },
            { title: "Technical analysis", modules: ["technical-analysis", "systematic-strategies"] },
            { title: "Chart reading", category: "chart" },
            { title: "Risk management", category: "risk" },
            { title: "Fundamental analysis", modules: ["fundamental-analysis", "valuation"] }
        ];
        $("topicMastery").innerHTML = quizTopics.map((topic) => {
            const results = topic.category
                ? labProgress.attempts.filter((item) => item.category === topic.category)
                : Object.entries(labProgress.firstQuizResults)
                    .filter(([id]) => topic.modules.some((moduleId) => id.startsWith(`${moduleId}:`)))
                    .map(([, item]) => item);
            const score = results.length
                ? Math.round(results.reduce((sum, item) => sum + (topic.category ? item.score : item.correct ? 100 : 0), 0) / results.length)
                : null;
            return `<div class="topic-row"><span>${topic.title}</span>
                <span class="topic-track"><span style="width:${score || 0}%"></span></span>
                <strong>${score === null ? "Not started" : `${score}%`}</strong></div>`;
        }).join("");
    }

    function renderWeeklyPerformance() {
        const today = new Date();
        const days = [];
        for (let offset = 6; offset >= 0; offset -= 1) {
            const date = new Date(today);
            date.setDate(today.getDate() - offset);
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            const matches = labProgress.attempts.filter((item) => {
                const attempt = new Date(item.time);
                return `${attempt.getFullYear()}-${attempt.getMonth()}-${attempt.getDate()}` === key;
            });
            days.push({
                label: date.toLocaleDateString(undefined, { weekday: "short" }),
                score: matches.length
                    ? Math.round(matches.reduce((sum, item) => sum + item.score, 0) / matches.length)
                    : null
            });
        }
        const plotted = days.filter((day) => day.score !== null);
        $("weeklyPerformance").setAttribute("aria-label", plotted.length
            ? `Practice scores recorded on ${plotted.length} of the last seven days`
            : "No practice scores yet");
        $("weeklyCaption").textContent = plotted.length
            ? `${plotted.length} of the last 7 days have recorded practice scores.`
            : "Complete an exercise to start your personal trend.";
        const points = days.map((day, index) => ({
            ...day,
            x: 30 + index * 45,
            y: day.score === null ? null : 128 - day.score * 0.9
        }));
        const linePoints = points.filter((point) => point.score !== null).map((point) => `${point.x},${point.y}`).join(" ");
        $("weeklyPerformance").innerHTML = `<svg viewBox="0 0 340 155" aria-hidden="true">
            ${[0, 50, 100].map((value) => {
                const y = 128 - value * 0.9;
                return `<line x1="20" y1="${y}" x2="325" y2="${y}" stroke="#edf1f5"/><text x="0" y="${y + 3}">${value}</text>`;
            }).join("")}
            ${linePoints ? `<polyline points="${linePoints}" fill="none" stroke="#23866e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` : ""}
            ${points.map((point) => `<circle cx="${point.x}" cy="${point.y === null ? 137 : point.y}" r="${point.score === null ? 2 : 4}" fill="${point.score === null ? "#d8e1e8" : "#23866e"}"/>
                <text x="${point.x}" y="151" text-anchor="middle">${point.label}</text>${point.score === null ? "" : `<text x="${point.x}" y="${point.y - 8}" text-anchor="middle">${point.score}</text>`}`).join("")}
        </svg>`;
    }

    function renderRecommendations(categories) {
        const recommendations = [];
        const mistake = (type) => labProgress.mistakes.find((item) => item.type === type);
        const missingStop = mistake("trade-without-stop");
        const missingTarget = mistake("trade-without-target");
        const missingReason = mistake("missing-trade-reason");
        const oversized = mistake("oversized-position");
        const tradingAfterLoss = mistake("trade-after-loss");
        const chartScore = categories[1].stats;
        const decisionScore = categories[2].stats;
        const riskScore = categories[3].stats;
        const knowledgeScore = categories[0].stats;
        const getModuleQuizScore = (moduleId) => {
            const results = Object.entries(labProgress.firstQuizResults)
                .filter(([id]) => id.startsWith(`${moduleId}:`))
                .map(([, item]) => item);
            return {
                count: results.length,
                score: results.length
                    ? Math.round(results.reduce((sum, item) => sum + (item.correct ? 100 : 0), 0) / results.length)
                    : null
            };
        };
        const technicalQuiz = getModuleQuizScore("technical-analysis");
        const fundamentalQuiz = getModuleQuizScore("fundamental-analysis");

        if (missingStop && missingStop.count >= 2) {
            recommendations.push({
                title: "Build a stop-loss habit",
                text: `You placed ${missingStop.count} practice trades without a stop level. Review how planned exits and position sizing work.`,
                href: "learning.html#paperPractice",
                action: "Set a stop on your next practice order"
            });
        }
        if (missingTarget && missingTarget.count >= 2 && recommendations.length < 2) {
            recommendations.push({
                title: "Plan an exit before entry",
                text: `You placed ${missingTarget.count} practice trades without a target. Practise writing down both sides of a simulated exit plan.`,
                href: "learning.html#paperPractice",
                action: "Write a practice trade plan"
            });
        }
        if (missingReason && missingReason.count >= 2 && recommendations.length < 2) {
            recommendations.push({
                title: "Keep a decision journal",
                text: `You have ${missingReason.count} practice entries without a written reason. Record a hypothesis or learning goal before your next order.`,
                href: "learning.html#paperPractice",
                action: "Add a reason to your next practice trade"
            });
        }
        if (oversized && oversized.count >= 2) {
            recommendations.push({
                title: "Practise position sizing",
                text: `Your virtual risk exceeded the 1% learning-rubric limit ${oversized.count} times. Revisit the risk plan before another simulated order.`,
                href: "learning.html#paperPractice",
                action: "Review your practice trade plan"
            });
        }
        if (tradingAfterLoss && tradingAfterLoss.count >= 2 && recommendations.length < 2) {
            recommendations.push({
                title: "Pause after a simulated loss",
                text: `You opened ${tradingAfterLoss.count} practice trades immediately after a losing exit. Review your written plan before the next simulated decision.`,
                href: "learning.html#courseCatalog",
                action: "Review trading psychology"
            });
        }
        if (technicalQuiz.count && technicalQuiz.score < 50 && recommendations.length < 2) {
            recommendations.push({
                title: "Revisit RSI and chart indicators",
                text: `Your technical-analysis first-attempt score is ${technicalQuiz.score}%. Review indicator limits, then practise the chart-reading questions.`,
                href: "learning.html#chartPractice",
                action: "Open the chart studio"
            });
        }
        if (fundamentalQuiz.count && fundamentalQuiz.score < 50 && recommendations.length < 2) {
            recommendations.push({
                title: "Build a company-research habit",
                text: `Your fundamental-analysis first-attempt score is ${fundamentalQuiz.score}%. Review company reports, cash flow and valuation context.`,
                href: "learning.html#courseCatalog",
                action: "Review the fundamentals lessons"
            });
        }
        if (riskScore.count && riskScore.score < 60 && recommendations.length < 2) {
            recommendations.push({
                title: "Strengthen risk management",
                text: `Your current risk-plan score is ${riskScore.score}/100. Practise a stop, a sensible position size and a written reason.`,
                href: "learning.html#courseCatalog",
                action: "Open Risk management & trading psychology"
            });
        }
        if (chartScore.count && chartScore.score < 60 && recommendations.length < 2) {
            recommendations.push({
                title: "Practise reading charts",
                text: `Your chart-reading score is ${chartScore.score}/100. Review candles, trend and indicator limits, then try the chart studio again.`,
                href: "learning.html#chartPractice",
                action: "Try a chart-reading exercise"
            });
        }
        if (decisionScore.count && decisionScore.score < 60 && recommendations.length < 2) {
            recommendations.push({
                title: "Slow down in replay",
                text: `Your replay and scenario score is ${decisionScore.score}/100. Record a reasoned choice before revealing the next simulated candle.`,
                href: "learning.html#historicalReplay",
                action: "Continue the candle replay"
            });
        }
        if (knowledgeScore.count && knowledgeScore.score < 50 && recommendations.length < 2) {
            const weakTopic = Object.entries(labProgress.firstQuizResults)
                .filter(([, result]) => !result.correct)
                .map(([id]) => id.split(":")[0])[0];
            const module = MODULES.find((item) => item.id === weakTopic) || MODULES[0];
            recommendations.push({
                title: "Refresh a lesson concept",
                text: `Your first-attempt quiz accuracy is ${knowledgeScore.score}%. Review a lesson and retry its knowledge check.`,
                href: "learning.html#courseCatalog",
                action: `Review ${module.title}`
            });
        }
        if (!recommendations.length) {
            const title = labProgress.attempts.length ? "Keep building your practice streak" : "Start with a quick learning activity";
            const text = labProgress.attempts.length
                ? "Your recorded results have no repeated weak area yet. Try another chart or replay exercise to grow your personal score history."
                : "Complete a lesson quiz, chart-reading question or scenario. Your dashboard will adapt to your own results.";
            recommendations.push({
                title,
                text,
                href: labProgress.attempts.length ? "learning.html#chartPractice" : "learning.html#courseCatalog",
                action: labProgress.attempts.length ? "Open the chart studio" : "Start the first lesson"
            });
        }
        $("learningRecommendations").innerHTML = `<div class="recommendation-list">${recommendations.slice(0, 2).map((item) =>
            `<article class="recommendation-item"><strong>${item.title}</strong><p>${item.text}</p>
            <a href="${item.href}">${item.action} →</a></article>`).join("")}</div>`;
    }

    function createCandles(closes) {
        return closes.map((close, index) => {
            const open = index ? closes[index - 1] : close - 0.7;
            const high = Math.max(open, close) + 1 + (index % 3) * 0.3;
            const lowerWick = index === closes.length - 1 ? 3.8 : 0.8 + (index % 4) * 0.25;
            const low = Math.min(open, close) - lowerWick;
            return { open, high, low, close, volume: 420 + (index * 73) % 530 };
        });
    }

    function buildCandleChart(candles, options = {}) {
        if (!candles.length) return "";
        const width = 640;
        const height = 205;
        const chartTop = 13;
        const chartBottom = options.volume === false ? 177 : 150;
        const maxPrice = Math.max(...candles.map((item) => item.high));
        const minPrice = Math.min(...candles.map((item) => item.low));
        const spread = Math.max(maxPrice - minPrice, 1);
        const maxVolume = Math.max(1, ...candles.map((item) => item.volume || 0));
        const yFor = (price) => chartTop + (maxPrice - price) / spread * (chartBottom - chartTop);
        const slot = (width - 48) / candles.length;
        const bodyWidth = Math.max(3, Math.min(12, slot * 0.48));
        const startX = 31;
        const grid = [0, 1, 2, 3].map((line) => {
            const y = chartTop + line * (chartBottom - chartTop) / 3;
            const price = maxPrice - spread * line / 3;
            return `<line class="grid-line" x1="24" y1="${y}" x2="${width - 8}" y2="${y}"/>
                <text x="2" y="${y + 3}">${price.toFixed(0)}</text>`;
        }).join("");
        const bars = candles.map((candle, index) => {
            const x = startX + index * slot + slot / 2;
            const up = candle.close >= candle.open;
            const bodyY = Math.min(yFor(candle.open), yFor(candle.close));
            const bodyHeight = Math.max(2, Math.abs(yFor(candle.open) - yFor(candle.close)));
            const volumeHeight = options.volume === false ? 0 : (candle.volume || 0) / maxVolume * 24;
            return `<line class="wick ${up ? "wick-up" : "wick-down"}" x1="${x}" y1="${yFor(candle.high)}" x2="${x}" y2="${yFor(candle.low)}"/>
                <rect class="${up ? "candle-up" : "candle-down"}" x="${x - bodyWidth / 2}" y="${bodyY}" width="${bodyWidth}" height="${bodyHeight}" rx="1"/>
                ${options.volume === false ? "" : `<rect x="${x - bodyWidth / 2}" y="${height - volumeHeight - 8}" width="${bodyWidth}" height="${volumeHeight}" fill="${up ? "#a9dfca" : "#f2c0b9"}" rx="1"/>`}`;
        }).join("");
        let movingAverage = "";
        if (options.showMovingAverage) {
            const points = candles.map((item, index) => {
                const sample = candles.slice(Math.max(0, index - 4), index + 1);
                const average = sample.reduce((sum, candle) => sum + candle.close, 0) / sample.length;
                return `${startX + index * slot + slot / 2},${yFor(average)}`;
            }).join(" ");
            movingAverage = `<polyline class="moving-average" points="${points}"/>`;
        }
        const support = options.showSupport
            ? `<line class="support-line" x1="24" y1="${yFor(minPrice)}" x2="${width - 8}" y2="${yFor(minPrice)}"/>` : "";
        return `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true">${grid}${support}${bars}${movingAverage}
            <text x="24" y="${height - 1}">Earlier candles</text><text x="${width - 8}" y="${height - 1}" text-anchor="end">Latest</text>
            ${options.showMovingAverage ? `<text x="${width - 52}" y="${chartTop + 12}" fill="#4084c5">MA 5</text>` : ""}
        </svg>`;
    }

    function calculateIndicators(closes, candles) {
        const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
        const ema = (values, period) => {
            const multiplier = 2 / (period + 1);
            return values.reduce((result, value, index) =>
                index === 0 ? [value] : [...result, value * multiplier + result[index - 1] * (1 - multiplier)], []);
        };
        const differences = closes.slice(1).map((value, index) => value - closes[index]);
        const recentChanges = differences.slice(-14);
        const gains = recentChanges.filter((change) => change > 0);
        const losses = recentChanges.filter((change) => change < 0);
        const avgGain = gains.reduce((sum, value) => sum + value, 0) / 14;
        const avgLoss = Math.abs(losses.reduce((sum, value) => sum + value, 0)) / 14;
        const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
        const ema12 = ema(closes, 12);
        const ema26 = ema(closes, 26);
        const macd = ema12.map((value, index) => value - ema26[index]);
        const macdSignal = ema(macd, 9);
        return {
            ma5: average(closes.slice(-5)),
            ma20: average(closes.slice(-20)),
            rsi,
            macd: macd[macd.length - 1] - macdSignal[macdSignal.length - 1],
            volume: average(candles.slice(-5).map((item) => item.volume))
        };
    }

    function renderChartStudio() {
        const candles = createCandles(PRACTICE_CLOSING_PRICES);
        const closes = candles.map((item) => item.close);
        const indicators = calculateIndicators(closes, candles);
        $("practiceChart").innerHTML = buildCandleChart(candles, { showMovingAverage: true, showSupport: true });
        $("indicatorReadings").innerHTML = [
            ["MA 5 / MA 20", `${indicators.ma5.toFixed(1)} / ${indicators.ma20.toFixed(1)}`, indicators.ma5 > indicators.ma20 ? "Short avg. above long" : "Short avg. below long"],
            ["RSI (14)", indicators.rsi.toFixed(1), indicators.rsi >= 70 ? "Elevated momentum" : indicators.rsi <= 30 ? "Low recent momentum" : "Mid-range momentum"],
            ["MACD histogram", `${indicators.macd >= 0 ? "+" : ""}${indicators.macd.toFixed(2)}`, "EMA 12/26 − signal 9"],
            ["Avg. volume · 5", `${Math.round(indicators.volume)} units`, "Illustrative candle volume"]
        ].map(([label, value, note]) => `<div class="indicator-reading"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join("");
        renderChartQuestion();
    }

    function renderChartQuestion() {
        if (activeChartQuestionIndex >= CHART_QUESTIONS.length) {
            $("chartQuestionCount").textContent = `${CHART_QUESTIONS.length} of ${CHART_QUESTIONS.length} complete`;
            $("chartQuestionProgress").style.width = "100%";
            $("chartQuestionTopic").textContent = "CHART STUDIO COMPLETE";
            $("chartQuestion").textContent = "";
            $("chartOptions").innerHTML = `<div class="exercise-complete"><strong>Chart studio complete</strong>
                <p>Your chart-reading score is saved. The explanations are here whenever you want to review the concepts.</p>
                <button type="button" class="exercise-next" id="restartChartQuestions">Practise these questions again</button></div>`;
            $("chartFeedback").textContent = "";
            $("nextChartQuestion").hidden = true;
            return;
        }
        const question = CHART_QUESTIONS[activeChartQuestionIndex];
        chartQuestionAnswered = false;
        $("chartQuestionCount").textContent = `Question ${activeChartQuestionIndex + 1} of ${CHART_QUESTIONS.length}`;
        $("chartQuestionProgress").style.width = `${activeChartQuestionIndex / CHART_QUESTIONS.length * 100}%`;
        $("chartQuestionTopic").textContent = question.topic;
        $("chartQuestion").textContent = question.prompt;
        $("chartFeedback").textContent = "";
        $("nextChartQuestion").hidden = true;
        $("chartOptions").innerHTML = question.options.map((option, index) =>
            `<button type="button" class="practice-choice" data-chart-answer="${index}">${option}</button>`).join("");
    }

    function renderReplayChart() {
        const replayReady = !labProgress.replayDataset ||
            (activeReplayData && activeReplayData.datasetKey === labProgress.replayDataset);
        const replayCandles = activeReplayData ? activeReplayData.candles : createCandles(REPLAY_CLOSING_PRICES);
        const visible = replayReady ? replayCandles.slice(0, labProgress.replayIndex + 1) : [];
        $("replayChart").innerHTML = buildCandleChart(visible, { volume: false });
        const total = replayCandles.length - 6;
        const complete = replayReady && labProgress.replayIndex >= replayCandles.length - 1;
        $("replayProgress").textContent = !replayReady
            ? `Saved replay · ${labProgress.replayDataset}`
            : complete ? `Replay complete · ${total} decisions`
                : `Warm-up · Candle ${labProgress.replayIndex + 1} of ${replayCandles.length}`;
        $("replaySourceLabel").textContent = !replayReady
            ? "Load the saved symbol and period to resume this replay"
            : activeReplayData
                ? `${activeReplayData.name} · ${activeReplayData.symbol} · ${activeReplayData.candles[0].date} to ${activeReplayData.candles[activeReplayData.candles.length - 1].date} · Daily`
                : "Built-in synthetic practice data · Not live";
        $("replayScore").textContent = `${labProgress.replayCorrect} correct · ${labProgress.replayTotal} ${labProgress.replayTotal === 1 ? "decision" : "decisions"}`;
        $("replayDecision").hidden = !replayReady || complete || labProgress.replayAwaitingNext;
        $("nextReplayCandle").hidden = !replayReady || complete || !labProgress.replayAwaitingNext;
        $("replayFeedback").textContent = !replayReady
            ? "Load this saved historical symbol and period to continue. The replay will not substitute synthetic candles."
            : complete
            ? "Replay finished. Your choices are saved with your learning progress. Restart the replay to practise again."
            : labProgress.replayAwaitingNext ? labProgress.replayFeedback : "";
        $("replayActions").innerHTML = ["BUY", "HOLD", "SELL"].map((action) =>
            `<button class="replay-action" type="button" data-replay-action="${action}"${replayReady ? "" : " disabled"}>${action === "BUY" ? "Buy" : action === "SELL" ? "Sell" : "Hold"}</button>`).join("");
    }

    async function loadHistoricalReplay() {
        const symbol = $("historicalSymbol").value.trim().toUpperCase();
        const range = $("historicalRange").value;
        const status = $("historicalDataStatus");
        const button = $("loadHistoricalData");
        if (!/^[A-Z0-9^][A-Z0-9.^_-]{0,23}$/.test(symbol) ||
            !["1mo", "3mo", "6mo", "1y"].includes(range)) {
            status.textContent = "Enter a valid Yahoo Finance symbol and choose a history period.";
            status.classList.add("is-error");
            return;
        }

        button.disabled = true;
        status.classList.remove("is-error");
        status.textContent = `Loading daily history for ${symbol}…`;
        try {
            const query = new URLSearchParams({ symbol, range });
            const response = await fetch(`${window.location.origin}/api/learning/market-history?${query}`);
            const contentType = response.headers.get("content-type") || "";
            if (!contentType.includes("application/json")) {
                throw new Error(response.status === 404
                    ? "The historical-data API is not active yet. Restart the TradeNova server and try again."
                    : `The server returned an unexpected response (${response.status}).`);
            }
            const data = await response.json();
            if (!response.ok || !data.success || !Array.isArray(data.candles)) {
                throw new Error(data.message || `Historical data could not load (${response.status}).`);
            }
            const candles = data.candles.filter(isValidHistoricalCandle).slice(-22);
            if (candles.length < 7) {
                throw new Error("This symbol does not have enough valid daily candles for replay.");
            }

            const datasetKey = `${data.symbol}:${range}:${candles[0].date}:${candles[candles.length - 1].date}`;
            const sameDataset = labProgress.replayDataset === datasetKey;
            activeReplayData = {
                symbol: data.symbol,
                name: typeof data.name === "string" ? data.name.slice(0, 120) : data.symbol,
                exchange: typeof data.exchange === "string" ? data.exchange.slice(0, 40) : "",
                currency: typeof data.currency === "string" ? data.currency.slice(0, 12) : "",
                range,
                source: "Yahoo Finance",
                datasetKey,
                candles
            };
            $("historicalSymbol").value = activeReplayData.symbol;
            if (!sameDataset) {
                labProgress.replayIndex = 5;
                labProgress.replayCorrect = 0;
                labProgress.replayTotal = 0;
                labProgress.replayAwaitingNext = false;
                labProgress.replayFeedback = "";
            } else {
                labProgress.replayIndex = Math.max(5, Math.min(candles.length - 1, labProgress.replayIndex));
            }
            labProgress.replayDataset = activeReplayData.datasetKey;
            let cacheSaved = true;
            try {
                localStorage.setItem(REPLAY_DATA_KEY, JSON.stringify(activeReplayData));
            } catch (error) {
                cacheSaved = false;
                console.error("Unable to cache historical replay data", error);
            }
            persistLabProgress();
            renderReplayChart();
            status.textContent = `${activeReplayData.name} · ${activeReplayData.candles.length} recent daily candles from Yahoo Finance.${cacheSaved ? " Cached in this browser." : " Available until you leave this page; browser storage is full or unavailable."} Historical data can be delayed; it is not a live quote.`;
            status.classList.toggle("is-error", !cacheSaved);
        } catch (error) {
            console.error("Unable to load historical replay data", error);
            status.textContent = error.message || "Historical data could not load. The synthetic replay is still available.";
            status.classList.add("is-error");
        } finally {
            button.disabled = false;
        }
    }

    function renderScenarios() {
        $("scenarioGrid").innerHTML = SCENARIOS.map((scenario) => {
            const selected = labProgress.scenarioResults[scenario.id];
            return `<article class="scenario-card" data-scenario-id="${scenario.id}">
                <span class="scenario-tag">${scenario.topic}</span><h3>${scenario.title}</h3><p>${scenario.situation}</p>
                <div class="practice-options" role="group" aria-label="Choose a response to ${scenario.title}">${scenario.options.map((option, index) =>
                    `<button type="button" class="practice-choice" data-scenario-answer="${index}"${selected ? " disabled" : ""}>${option.label}</button>`).join("")}</div>
                <p class="scenario-feedback" role="status" aria-live="polite">${selected ? escapeHTML(selected.feedback) : ""}</p>
                ${selected ? `<button type="button" class="scenario-retry" data-scenario-retry="${scenario.id}">Try scenario again</button>` : ""}
            </article>`;
        }).join("");
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
        renderAnalytics();
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

    function loadPaperAccount(savedValue) {
        const saved = arguments.length ? savedValue : readJSON(PAPER_KEY, null);
        if (!saved || typeof saved.cash !== "number" || !Number.isFinite(saved.cash) || saved.cash < 0 ||
            !saved.holdings || typeof saved.holdings !== "object" || Array.isArray(saved.holdings) || !Array.isArray(saved.history)) {
            return { cash: STARTING_CASH, holdings: {}, history: [], marketStep: 0 };
        }
        const holdings = {};
        Object.entries(saved.holdings).forEach(([symbol, holding]) => {
            if (INSTRUMENTS.some((item) => item.symbol === symbol) && holding &&
                Number.isSafeInteger(holding.quantity) && holding.quantity > 0 &&
                Number.isFinite(holding.averageCost) && holding.averageCost > 0) {
                holdings[symbol] = {
                    quantity: holding.quantity,
                    averageCost: holding.averageCost,
                    stopLoss: Number.isFinite(holding.stopLoss) && holding.stopLoss > 0 ? holding.stopLoss : null,
                    target: Number.isFinite(holding.target) && holding.target > 0 ? holding.target : null,
                    reason: typeof holding.reason === "string" ? holding.reason.slice(0, 240) : ""
                };
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
            ).map((trade) => ({
                side: trade.side,
                symbol: trade.symbol,
                quantity: trade.quantity,
                price: trade.price,
                time: trade.time,
                stopLoss: Number.isFinite(trade.stopLoss) ? trade.stopLoss : null,
                target: Number.isFinite(trade.target) ? trade.target : null,
                reason: typeof trade.reason === "string" ? trade.reason.slice(0, 240) : "",
                pnl: Number.isFinite(trade.pnl) ? trade.pnl : null,
                outcome: typeof trade.outcome === "string" ? trade.outcome.slice(0, 80) : ""
            })).slice(0, 30),
            marketStep: Number.isSafeInteger(saved.marketStep)
                ? Math.max(0, Math.min(8, saved.marketStep)) : 0
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
                return {
                    symbol,
                    instrument,
                    price: getInstrumentPrice(symbol),
                    quantity: Number(holding.quantity),
                    averageCost: Number(holding.averageCost),
                    stopLoss: holding.stopLoss,
                    target: holding.target
                };
            }).filter(Boolean);
        const holdingsValue = positions.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const unrealised = positions.reduce((sum, item) => sum + (item.price - item.averageCost) * item.quantity, 0);

        $("paperCash").textContent = formatCurrency(paperAccount.cash);
        $("paperHoldingsValue").textContent = formatCurrency(holdingsValue);
        $("paperPortfolioValue").textContent = formatCurrency(paperAccount.cash + holdingsValue);
        $("paperPnl").textContent = formatCurrency(unrealised);
        $("paperPnl").classList.toggle("negative-value", unrealised < 0);
        $("paperPositions").innerHTML = positions.map((item) => {
            const pnl = (item.price - item.averageCost) * item.quantity;
            return `<tr><td>${item.instrument.name}<br><small>${item.symbol}</small></td>
                <td>${item.quantity}</td><td>${formatCurrency(item.averageCost)}<br><small>${item.stopLoss ? `SL ${formatCurrency(item.stopLoss)}` : "No stop"}${item.target ? ` · Target ${formatCurrency(item.target)}` : ""}</small></td>
                <td>${formatCurrency(item.quantity * item.price)}</td>
                <td class="${pnl < 0 ? "negative-value" : "positive-value"}">${formatCurrency(pnl)}</td></tr>`;
        }).join("");
        $("emptyPositions").hidden = positions.length > 0;
        $("paperHistory").innerHTML = paperAccount.history.length
            ? paperAccount.history.map((trade) => `<div class="history-row">
                <span><strong class="${trade.side === "BUY" ? "history-buy" : "history-sell"}">${trade.side}</strong> ${trade.quantity} × ${trade.symbol}
                    <small class="history-detail">${trade.reason ? escapeHTML(trade.reason) : "No trade reason recorded."}
                    ${trade.stopLoss ? ` · Stop ${formatCurrency(trade.stopLoss)}` : ""}${trade.target ? ` · Target ${formatCurrency(trade.target)}` : ""}</small></span>
                <span class="history-outcome">${formatCurrency(trade.price)} · ${new Date(trade.time).toLocaleString()}
                    ${trade.outcome ? `<small class="history-auto-exit">${escapeHTML(trade.outcome)}</small>` : ""}
                    ${trade.pnl !== null ? `<small class="${trade.pnl < 0 ? "negative-value" : "positive-value"}">P&amp;L ${formatCurrency(trade.pnl)}</small>` : ""}</span>
            </div>`).join("")
            : "<p>No simulated orders yet.</p>";
        $("marketStepLabel").textContent = `Candle ${paperAccount.marketStep + 1} of 9`;
        $("advanceMarket").disabled = paperAccount.marketStep >= 8;
        $("advanceMarket").textContent = paperAccount.marketStep >= 8 ? "Simulation complete" : "Advance simulated market →";
        $("advanceMarket").setAttribute("aria-label", paperAccount.marketStep >= 8
            ? "Simulated price path complete" : `Advance to simulated candle ${paperAccount.marketStep + 2}`);
        updateSelectedQuote();
    }

    function setTradeMessage(message, isError = false) {
        $("tradeMessage").textContent = message;
        $("tradeMessage").classList.toggle("error-message", isError);
    }

    function getInstrumentPrice(symbol, step = paperAccount.marketStep) {
        const instrument = INSTRUMENTS.find((item) => item.symbol === symbol);
        const path = SIMULATED_MARKET_MOVES[symbol];
        if (!instrument || !path) return 0;
        const move = path[Math.max(0, Math.min(path.length - 1, step))];
        return Math.round(instrument.price * (1 + move) * 100) / 100;
    }

    function updateRiskEstimate() {
        const symbol = $("paperSymbol").value;
        const instrument = INSTRUMENTS.find((item) => item.symbol === symbol);
        const quantity = Number($("paperQuantity").value);
        const stopLoss = Number($("paperStopLoss").value);
        const target = Number($("paperTarget").value);
        const output = $("riskEstimate");
        output.classList.remove("is-risky");
        if (!instrument || !Number.isSafeInteger(quantity) || quantity <= 0) {
            output.textContent = "";
            return;
        }
        const entry = getInstrumentPrice(symbol);
        if (!Number.isFinite(stopLoss) || stopLoss <= 0) {
            output.textContent = "No stop-loss entered. This order will be counted as a risk-planning practice mistake.";
            output.classList.add("is-risky");
            return;
        }
        if (stopLoss >= entry || (Number.isFinite(target) && target > 0 && target <= entry)) {
            output.textContent = "For a simulated long buy, set the stop below entry and any target above entry.";
            output.classList.add("is-risky");
            return;
        }
        const portfolio = paperAccount.cash + Object.entries(paperAccount.holdings).reduce((sum, [holdingSymbol, holding]) =>
            sum + holding.quantity * getInstrumentPrice(holdingSymbol), 0);
        const risk = (entry - stopLoss) * quantity;
        const riskPercent = portfolio > 0 ? risk / portfolio * 100 : 0;
        const rewardRisk = Number.isFinite(target) && target > entry ? (target - entry) / (entry - stopLoss) : null;
        output.textContent = `Planned virtual risk ${formatCurrency(risk)} (${riskPercent.toFixed(2)}% of simulated portfolio)${rewardRisk === null ? "" : ` · Reward/risk ${rewardRisk.toFixed(2)}:1`}. The 1% score guide is illustrative, not investment advice.`;
        if (riskPercent > 1 || (rewardRisk !== null && rewardRisk < 1.5)) output.classList.add("is-risky");
    }

    function saveTradeProgress(score, mistakes) {
        (mistakes || []).forEach((mistake) => {
            const existing = labProgress.mistakes.find((item) => item.type === mistake);
            if (existing) {
                existing.count += 1;
                existing.lastAt = Date.now();
            } else {
                labProgress.mistakes.push({ type: mistake, count: 1, lastAt: Date.now() });
            }
        });
        labProgress.mistakes = labProgress.mistakes.slice(-30);
        persistLabProgress();
        recordPerformance("risk", score, "Risk management");
        if (mistakes && mistakes.some((item) => item === "trade-without-stop" || item === "oversized-position")) {
            $("tradeMessage").textContent += " Your learning tracker noted a risk-planning habit to review.";
        }
    }

    function executePaperTrade(side) {
        const symbol = $("paperSymbol").value;
        const instrument = INSTRUMENTS.find((item) => item.symbol === symbol);
        const quantity = Number($("paperQuantity").value);
        if (!instrument || !Number.isSafeInteger(quantity) || quantity <= 0) {
            setTradeMessage("Enter a whole-number quantity greater than zero.", true);
            return;
        }

        const price = getInstrumentPrice(symbol);
        const total = quantity * price;
        const current = paperAccount.holdings[symbol] || { quantity: 0, averageCost: 0 };
        if (!Number.isFinite(total) || total <= 0) {
            setTradeMessage("This practice order amount is invalid.", true);
            return;
        }
        const stopInput = $("paperStopLoss").value.trim();
        const targetInput = $("paperTarget").value.trim();
        const stopLoss = stopInput ? Number(stopInput) : null;
        const target = targetInput ? Number(targetInput) : null;
        const immediatelyAfterLoss = side === "BUY" && paperAccount.history[0] &&
            paperAccount.history[0].side === "SELL" && Number.isFinite(paperAccount.history[0].pnl) &&
            paperAccount.history[0].pnl < 0;
        if (side === "BUY" && ((stopLoss !== null && (!Number.isFinite(stopLoss) || stopLoss <= 0 || stopLoss >= price)) ||
            (target !== null && (!Number.isFinite(target) || target <= price)))) {
            setTradeMessage("For this simulated long buy, the stop must be below entry and the target must be above entry.", true);
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
            current.stopLoss = stopLoss;
            current.target = target;
            current.reason = $("paperReason").value.trim().slice(0, 240);
            paperAccount.cash -= total;
            paperAccount.holdings[symbol] = current;
        } else {
            paperAccount.cash += total;
            current.quantity -= quantity;
            if (current.quantity === 0) delete paperAccount.holdings[symbol];
        }

        const trade = {
            side,
            symbol,
            quantity,
            price,
            time: Date.now(),
            stopLoss: side === "BUY" ? stopLoss : current.stopLoss,
            target: side === "BUY" ? target : current.target,
            reason: side === "BUY" ? current.reason : current.reason,
            pnl: side === "SELL" ? (price - current.averageCost) * quantity : null,
            outcome: side === "SELL" ? "Manual simulated exit" : ""
        };
        paperAccount.history.unshift(trade);
        paperAccount.history = paperAccount.history.slice(0, 30);
        const saved = persistPaperAccount();
        renderPaperAccount();
        renderAnalytics();
        setTradeMessage(saved
            ? `${side === "BUY" ? "Bought" : "Sold"} ${quantity} ${symbol} at the illustrative price of ${formatCurrency(price)}.`
            : "The simulated order was processed, but this browser could not save it. Your changes will be lost when you leave this page.", !saved);
        if (side === "BUY") {
            const portfolio = paperAccount.cash + Object.entries(paperAccount.holdings).reduce((sum, [holdingSymbol, holding]) =>
                sum + holding.quantity * getInstrumentPrice(holdingSymbol), 0);
            const risk = stopLoss === null ? null : (price - stopLoss) * quantity;
            const riskPercent = risk === null || portfolio <= 0 ? null : risk / portfolio * 100;
            const rewardRisk = stopLoss && target
                ? (target - price) / (price - stopLoss)
                : null;
            const mistakes = [];
            if (stopLoss === null) mistakes.push("trade-without-stop");
            if (target === null) mistakes.push("trade-without-target");
            if (riskPercent !== null && riskPercent > 1) mistakes.push("oversized-position");
            if (target !== null && rewardRisk !== null && rewardRisk < 1.5) mistakes.push("weak-reward-risk-plan");
            const hasReason = current.reason.length >= 10;
            if (!hasReason) mistakes.push("missing-trade-reason");
            if (immediatelyAfterLoss) mistakes.push("trade-after-loss");
            let score = (stopLoss !== null ? 35 : 0) + (riskPercent !== null && riskPercent <= 1 ? 25 : 0) +
                (rewardRisk !== null && rewardRisk >= 1.5 ? 25 : 0) + (hasReason ? 15 : 0);
            if (immediatelyAfterLoss) score = Math.max(0, score - 15);
            saveTradeProgress(score, mistakes);
            setTradeMessage(`${saved ? "Simulated order placed" : "Simulated order placed, but not saved"}: ${quantity} ${symbol} at ${formatCurrency(price)}. Risk-plan learning score ${score}/100.`);
            $("paperReason").value = "";
        }
        updateRiskEstimate();
    }

    function advanceSimulatedMarket() {
        if (paperAccount.marketStep >= 8) return;
        paperAccount.marketStep += 1;
        const exits = [];
        Object.entries(paperAccount.holdings).forEach(([symbol, holding]) => {
            const price = getInstrumentPrice(symbol);
            const triggeredByStop = Number.isFinite(holding.stopLoss) && price <= holding.stopLoss;
            const triggeredByTarget = Number.isFinite(holding.target) && price >= holding.target;
            if (!triggeredByStop && !triggeredByTarget) return;
            const pnl = (price - holding.averageCost) * holding.quantity;
            paperAccount.cash += price * holding.quantity;
            paperAccount.history.unshift({
                side: "SELL",
                symbol,
                quantity: holding.quantity,
                price,
                time: Date.now(),
                stopLoss: holding.stopLoss,
                target: holding.target,
                reason: holding.reason,
                pnl,
                outcome: triggeredByStop ? "Simulated stop triggered at candle close" : "Simulated target reached at candle close"
            });
            delete paperAccount.holdings[symbol];
            exits.push(`${symbol} ${triggeredByStop ? "stop" : "target"} triggered`);
        });
        paperAccount.history = paperAccount.history.slice(0, 30);
        const saved = persistPaperAccount();
        renderPaperAccount();
        renderAnalytics();
        setTradeMessage(exits.length
            ? `${exits.join("; ")}. This simulation checks candle closes only${saved ? "." : "; changes could not be saved."}`
            : `Illustrative prices advanced to candle ${paperAccount.marketStep + 1}. No active stop or target was reached.${saved ? "" : " Changes could not be saved."}`,
        !saved);
    }

    function initializePage() {
        fetch("components/sidebar.html")
            .then((response) => {
                if (!response.ok) throw new Error(`Sidebar request failed (${response.status})`);
                return response.text();
            })
            .then((html) => {
                $("sidebar").innerHTML = html;
                const active = [...document.querySelectorAll(".sidebar li")]
                    .find((item) => item.textContent.includes("Learn & Practice"));
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
        renderChartStudio();
        restoreHistoricalReplaySelection();
        renderReplayChart();
        renderScenarios();
        renderAnalytics();
        syncLearningState();
    }

    function updateSelectedQuote() {
        const instrument = INSTRUMENTS.find((item) => item.symbol === $("paperSymbol").value);
        $("selectedQuote").textContent = instrument
            ? `Illustrative candle-close price: ${formatCurrency(getInstrumentPrice(instrument.symbol))} per unit`
            : "";
        updateRiskEstimate();
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
            const quizResultKey = `${activeModuleId}:${activeQuestionIndex}`;
            if (!Object.prototype.hasOwnProperty.call(labProgress.firstQuizResults, quizResultKey)) {
                labProgress.firstQuizResults[quizResultKey] = {
                    correct,
                    topic: activeModuleId,
                    time: Date.now()
                };
                persistLabProgress();
                recordPerformance("knowledge", correct ? 100 : 0, activeModuleId, correct ? "" : `quiz:${activeModuleId}`);
            }
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

        const chartAnswer = event.target.closest("[data-chart-answer]");
        if (chartAnswer && !chartQuestionAnswered && activeChartQuestionIndex < CHART_QUESTIONS.length) {
            const question = CHART_QUESTIONS[activeChartQuestionIndex];
            const answer = Number(chartAnswer.dataset.chartAnswer);
            const correct = answer === question.answer;
            chartQuestionAnswered = true;
            document.querySelectorAll("[data-chart-answer]").forEach((button) => {
                button.disabled = true;
                const buttonAnswer = Number(button.dataset.chartAnswer);
                if (buttonAnswer === question.answer) button.classList.add("is-correct");
                else if (buttonAnswer === answer) button.classList.add("is-wrong");
            });
            $("chartFeedback").textContent = `${correct ? "Correct. " : "Not quite. "}${question.explanation}`;
            $("nextChartQuestion").hidden = false;
            $("nextChartQuestion").textContent = activeChartQuestionIndex === CHART_QUESTIONS.length - 1
                ? "See my score →" : "Next question →";
            recordPerformance("chart", correct ? 100 : 0, question.topic, correct ? "" : `chart:${question.topic}`);
        }

        if (event.target.closest("#nextChartQuestion")) {
            activeChartQuestionIndex += 1;
            renderChartQuestion();
        }

        if (event.target.closest("#restartChartQuestions")) {
            activeChartQuestionIndex = 0;
            renderChartQuestion();
        }

        const replayAction = event.target.closest("[data-replay-action]");
        const replayCandles = activeReplayData ? activeReplayData.candles : createCandles(REPLAY_CLOSING_PRICES);
        const replayReady = !labProgress.replayDataset ||
            (activeReplayData && activeReplayData.datasetKey === labProgress.replayDataset);
        if (replayAction && replayReady && !labProgress.replayAwaitingNext &&
            labProgress.replayIndex < replayCandles.length - 1) {
            const index = labProgress.replayIndex;
            const current = replayCandles[index].close;
            const next = replayCandles[index + 1].close;
            const change = (next - current) / current;
            const action = replayAction.dataset.replayAction;
            const correct = action === "BUY" ? change > 0 : action === "SELL" ? change < 0 : Math.abs(change) < 0.004;
            const score = correct ? 100 : action === "HOLD" ? 65 : 25;
            const outcome = change > 0 ? "the next candle closed higher" : change < 0 ? "the next candle closed lower" : "the next candle closed flat";
            const dataType = activeReplayData ? "historical" : "synthetic";
            labProgress.replayTotal += 1;
            if (correct) labProgress.replayCorrect += 1;
            labProgress.replayAwaitingNext = true;
            labProgress.replayFeedback = `${correct ? "Your choice matched the next candle: " : "The next candle shows why no single decision is certain: "}${outcome} (${change >= 0 ? "+" : ""}${(change * 100).toFixed(2)}%). This score measures one ${dataType} candle only—not profit, a strategy result or a forecast.`;
            persistLabProgress();
            recordPerformance("decision", score, activeReplayData ? "Historical replay" : "Synthetic replay", score < 70 ? "replay-decision-mismatch" : "");
            renderReplayChart();
        }

        if (event.target.closest("#nextReplayCandle") && replayReady && labProgress.replayAwaitingNext) {
            labProgress.replayIndex = Math.min(labProgress.replayIndex + 1, replayCandles.length - 1);
            labProgress.replayAwaitingNext = false;
            labProgress.replayFeedback = "";
            persistLabProgress();
            renderReplayChart();
        }

        const scenarioAnswer = event.target.closest("[data-scenario-answer]");
        if (scenarioAnswer) {
            const card = scenarioAnswer.closest(".scenario-card");
            const scenario = SCENARIOS.find((item) => item.id === card.dataset.scenarioId);
            if (!scenario || labProgress.scenarioResults[scenario.id]) return;
            const choice = scenario.options[Number(scenarioAnswer.dataset.scenarioAnswer)];
            if (!choice) return;
            labProgress.scenarioResults[scenario.id] = { score: choice.score, feedback: choice.feedback };
            persistLabProgress();
            card.querySelectorAll("[data-scenario-answer]").forEach((button, index) => {
                button.disabled = true;
                if (index === Number(scenarioAnswer.dataset.scenarioAnswer) && choice.score === 0) button.classList.add("is-wrong");
                if (scenario.options[index].score === 100) button.classList.add("is-correct");
            });
            card.querySelector(".scenario-feedback").textContent = choice.feedback;
            const retry = document.createElement("button");
            retry.type = "button";
            retry.className = "scenario-retry";
            retry.dataset.scenarioRetry = scenario.id;
            retry.textContent = "Try scenario again";
            card.appendChild(retry);
            recordPerformance("decision", choice.score, scenario.topic, choice.score < 70 ? `scenario:${scenario.id}` : "");
        }

        const retryScenario = event.target.closest("[data-scenario-retry]");
        if (retryScenario) {
            delete labProgress.scenarioResults[retryScenario.dataset.scenarioRetry];
            persistLabProgress();
            renderScenarios();
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
    $("paperQuantity").addEventListener("input", updateRiskEstimate);
    $("paperStopLoss").addEventListener("input", updateRiskEstimate);
    $("paperTarget").addEventListener("input", updateRiskEstimate);
    $("paperReason").addEventListener("input", updateRiskEstimate);
    $("advanceMarket").addEventListener("click", advanceSimulatedMarket);
    $("resetReplay").addEventListener("click", () => {
        labProgress.replayIndex = 5;
        labProgress.replayCorrect = 0;
        labProgress.replayTotal = 0;
        labProgress.replayAwaitingNext = false;
        labProgress.replayFeedback = "";
        persistLabProgress();
        renderReplayChart();
    });
    $("loadHistoricalData").addEventListener("click", loadHistoricalReplay);
    $("retryLearningSync").addEventListener("click", syncLearningState);
    $("printStudyGuide").addEventListener("click", printStudyGuide);
    $("downloadStudyGuide").addEventListener("click", downloadStudyGuide);
    $("resetSimulation").addEventListener("click", () => {
        if (!window.confirm("Reset your paper account to ₹1,00,000 and clear simulated holdings and orders?")) return;
        paperAccount = { cash: STARTING_CASH, holdings: {}, history: [], marketStep: 0 };
        const saved = persistPaperAccount();
        renderPaperAccount();
        renderAnalytics();
        setTradeMessage(saved
            ? "Practice account reset to ₹1,00,000 in virtual cash."
            : "Account reset for this page, but your browser could not save the reset.", !saved);
    });

    initializePage();
})();
