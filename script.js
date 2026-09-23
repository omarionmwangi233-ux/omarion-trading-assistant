console.log("SCRIPT WORKING");
let tradeHistory = [];
function analyzeMarket() {

    // Read input values
    let market = document.getElementById("market").value;
    let timeframe = document.getElementById("timeframe").value;
    let session = document.getElementById("session").value;
    let trendDirection = document.getElementById("trendDirection").value;
    let marketStructure = document.getElementById("marketStructure").value;
    let candle = document.getElementById("candle").value;

    let support = Number(document.getElementById("support").value);
    let resistance = Number(document.getElementById("resistance").value);
    let price = Number(document.getElementById("price").value);
    let accountBalance =
    Number(document.getElementById("accountBalance").value);

    // Check inputs
    if (
    isNaN(accountBalance) ||
    accountBalance <= 0 ||
    isNaN(support) ||
    isNaN(resistance) ||
    isNaN(price)
) {
    alert("Please enter Account Balance, Support, Resistance and Current Price.");
    return;
}
  if (support >= resistance) {
    alert("Support must be lower than Resistance.");
    return;
  }
let riskPercent = 1;
let riskAmount = accountBalance * (riskPercent / 100);
    // Default values
    let trend = "WAIT ⏳";
    let signal = "WAIT ⏳";
    let confidence = 30;
    let strength = "Weak ❌";
    let stopLoss = "-";
    let takeProfit = "-";
    let tp1 = "-";
    let tp2 = "-";
    let tp3 = "-";
    let tradeScore = "3/10";
    let reason = "No trading setup found.";
    let entryConfirmation = "WAIT ⏳";
    let riskReward = "-";
    let tradeApproval = "⏳ WAIT FOR SETUP";
  let positionSize = "N/A";
  

// ===============================
// SCALPING SCORE SYSTEM
// ===============================

let score = 0;

// 1. Trend — 20 points
if (
    trendDirection === "Uptrend 📈" ||
    trendDirection === "Downtrend 📉"
) {
    score += 20;
}

// 2. Market Structure — 20 points
if (
    marketStructure === "Higher Highs & Higher Lows 📈" ||
    marketStructure === "Lower Highs & Lower Lows 📉"
) {
    score += 20;
}

// 3. Candle Confirmation — 20 points
if (
    candle === "Bullish Engulfing" ||
    candle === "Bearish Engulfing"
) {
    score += 20;
} else if (
    candle === "Hammer" ||
    candle === "Shooting Star"
) {
    score += 15;
} else if (
    candle === "Pin Bar"
) {
    score += 10;
}

// 4. Trading Session — 15 points
if (
    session === "London Session 🇬🇧" ||
    session === "New York Session 🇺🇸"
) {
    score += 15;
} else {
    score += 5;
}

// 5. Scalping Price Zone — 15 points

let range = resistance - support;
  // Scalping safety filter
let maxEntryDistance = range * 0.25;

let entryTooFar =
    Math.abs(price - resistance) > maxEntryDistance &&
    Math.abs(price - support) > maxEntryDistance;

let nearSupport =
    price >= support &&
    price <= support + (range * 0.25);

let nearResistance =
    price <= resistance &&
    price >= resistance - (range * 0.25);

let breakout =
    price > resistance;

let breakdown =
    price < support;

if (breakout || breakdown) {
    score += 15;
} else if (nearSupport || nearResistance) {
    score += 15;
}

// 6. Scalping Timeframe — 10 points
if (
    timeframe === "M1" ||
    timeframe === "M5"
) {
    score += 10;
}


// ===============================
// TREND & STRUCTURE ALIGNMENT
// ===============================

// Bullish trend must match bullish structure
if (
    trendDirection === "Uptrend 📈" &&
    marketStructure === "Lower Highs & Lower Lows 📉"
) {
    score -= 30;
}


// Bearish trend must match bearish structure
if (
    trendDirection === "Downtrend 📉" &&
    marketStructure === "Higher Highs & Higher Lows 📈"
) {
    score -= 30;
}


// Prevent negative score
if (score < 0) {
    score = 0;
}


// Maximum score = 100

// ===============================
// SCALPING TRADE ENGINE
// ===============================

// BUY CONDITIONS
let bullishTrend =
    trendDirection === "Uptrend 📈";

let bullishStructure =
    marketStructure === "Higher Highs & Higher Lows 📈";

let bullishCandle =
    candle === "Bullish Engulfing" ||
    candle === "Hammer" ||
    candle === "Pin Bar";

let buyBreakout =
    price > resistance &&
    price <= resistance + ((resistance - support) * 0.25);

let buyPullback =
    price >= support &&
    price <= support + ((resistance - support) * 0.25);


// SELL CONDITIONS
let bearishTrend =
    trendDirection === "Downtrend 📉";

let bearishStructure =
    marketStructure === "Lower Highs & Lower Lows 📉";

let bearishCandle =
    candle === "Bearish Engulfing" ||
    candle === "Shooting Star" ||
    candle === "Pin Bar";

let sellBreakdown =
    price < support &&
    price >= support - ((resistance - support) * 0.25);

let sellPullback =
    price <= resistance &&
    price >= resistance - ((resistance - support) * 0.25);


// ===============================
// BUY SETUP
// ===============================

if (
    bullishTrend &&
    bullishStructure &&
    bullishCandle &&
    (buyBreakout || buyPullback) &&
      score >= 65 &&
    !entryTooFar
) {
    


    trend = "UPTREND 📈";
    signal = "BUY 🟢";
    confidence = score;

    if (score >= 80) {
        strength = "🔥 Strong Scalping Setup";
    } else if (score >= 65) {
        strength = "💪 Good Scalping Setup";
    } else {
        strength = "⚠️ Weak Setup";
    }

    tradeScore = (score / 10).toFixed(1) + "/10 ⭐";

    stopLoss = support;

// Calculate risk from entry to Stop Loss
let buyRisk = price - stopLoss;

if (buyRisk > 0) {
  let pipSize = 0.0001;

if (market === "USD/JPY") {
    pipSize = 0.01;
}

let buyRiskPips = buyRisk / pipSize;
    let buyLotSize = riskAmount / (buyRiskPips * 10);

    positionSize = buyLotSize >= 0.01
        ? buyLotSize.toFixed(2) + " lots"
        : "0.01 lots";
} else {
    positionSize = "N/A";
}
  console.log("BUY PRICE:", price);
console.log("BUY STOP LOSS:", stopLoss);
console.log("BUY RISK:", buyRisk);

// TP1 = 1:1
tp1 = price + buyRisk;

tp2 = price + (buyRisk * 2);

tp3 = price + (buyRisk * 3);

takeProfit = tp3;
  

   if (buyBreakout) {

    tradeApproval = "🟢 TRADE APPROVED";

    reason =
        "Bullish trend + bullish structure + bullish candle + resistance breakout.";

    entryConfirmation =
        "🟢 BUY CONFIRMED - BREAKOUT";

} else if (buyPullback) {

    tradeApproval = "🟡 WAIT FOR CONFIRMATION";

    reason =
        "Bullish trend + bullish structure + bullish candle + price is pulling back toward support.";

    entryConfirmation =
        "🟡 BUY PULLBACK - WAIT FOR CONFIRMATION";

} else {

    tradeApproval = "🔴 TRADE REJECTED - WAIT FOR BETTER ENTRY";

    reason =
        "Bullish conditions detected, but entry location is not ideal.";

    entryConfirmation =
        "⏳ WAIT FOR BETTER ENTRY";
   }
        

    let buyReward = Number(takeProfit) - price;

if (buyRisk > 0) {
    riskReward =
        "1 : " + (buyReward / buyRisk).toFixed(2);
} else {
    riskReward = "-";
}

}

// ===============================
// SELL SETUP
// ===============================

else if (
    bearishTrend &&
    bearishStructure &&
    bearishCandle &&
    (sellBreakdown || sellPullback) &&
    score >= 65 &&
    !entryTooFar
) {
    


    trend = "DOWNTREND 📉";
    signal = "SELL 🔴";
    confidence = score;
    if (score >= 80) {
        strength = "🔥 Strong Scalping Setup";
    } else if (score >= 65) {
        strength = "💪 Good Scalping Setup";
    } else {
        strength = "⚠️ Weak Setup";
    }

    tradeScore = (score / 10).toFixed(1) + "/10 ⭐";

    stopLoss = resistance;

// Calculate risk from entry to Stop Loss
let sellRisk = stopLoss - price;

if (sellRisk > 0) {
 let pipSize = 0.0001;

if (market === "USD/JPY") {
    pipSize = 0.01;
}

let sellRiskPips = sellRisk / pipSize;
    let sellLotSize = riskAmount / (sellRiskPips * 10);

    positionSize = sellLotSize >= 0.01
        ? sellLotSize.toFixed(2) + " lots"
        : "0.01 lots";
} else {
    positionSize = "N/A";
}

// TP1 = 1:1
tp1 = price - sellRisk;

tp2 = price - (sellRisk * 2);

tp3 = price - (sellRisk * 3);
  let reward = price - tp3;

if (sellRisk > 0) {
    riskReward = "1 : " + (reward / sellRisk).toFixed(2);
}

takeProfit = tp3;
    if (sellBreakdown) {

    tradeApproval = "🟢 TRADE APPROVED";

    reason =
        "Bearish trend + bearish structure + bearish candle + support breakdown.";

    entryConfirmation =
        "🔴 SELL CONFIRMED - BREAKDOWN";

} else if (sellPullback) {

    tradeApproval = "🟡 WAIT FOR CONFIRMATION";

    reason =
        "Bearish trend + bearish structure + bearish candle + price is pulling back toward resistance.";

    entryConfirmation =
        "🟡 SELL PULLBACK - WAIT FOR CONFIRMATION";

} else {

    tradeApproval = "🔴 TRADE REJECTED - WAIT FOR BETTER ENTRY";

    reason =
        "Bearish conditions detected, but entry location is not ideal.";

    entryConfirmation =
        "⏳ WAIT FOR BETTER ENTRY";
    }


    if (
    typeof takeProfit === "number" &&
    sellRisk > 0
) {

    let sellReward = price - takeProfit;

    riskReward =
        "1 : " + (sellReward / sellRisk).toFixed(2);
    }


}
// ===============================
// NO TRADE
// ===============================

else {

    trend = "WAIT ⏳";
    signal = "WAIT ⏳";
    confidence = score;
tradeApproval = "🔴 TRADE REJECTED - WAIT FOR BETTER SETUP";
    if (score >= 50) {
        strength = "⚠️ Setup Not Confirmed";
    } else {
        strength = "❌ Avoid Trade";
    }

    tradeScore = (score / 10).toFixed(1) + "/10 ⭐";

    stopLoss = "-";
    takeProfit = "-";
    tp1 = "-";
    tp2 = "-";
    tp3 = "-";

    reason =
        "Scalping conditions are not fully aligned. Wait for better confirmation.";

    entryConfirmation =
        "⏳ WAIT FOR BETTER ENTRY";

    riskReward = "-";
}
  // ===============================
// SCALPING SESSION FILTER
// ===============================

if (
    tradeApproval === "🟢 TRADE APPROVED" &&
    session !== "London Session 🇬🇧" &&
    session !== "New York Session 🇺🇸"
) {

    tradeApproval =
        "🟡 WAIT - SCALPING SESSION NOT IDEAL";

    entryConfirmation =
        "⏳ WAIT - LONDON OR NEW YORK SESSION";

    reason =
        reason +
        " Trade approval delayed because this is outside the preferred scalping sessions.";
}
// ===============================
// MINIMUM RISK / REWARD FILTER
// ===============================

if (
    tradeApproval === "🟢 TRADE APPROVED" &&
    riskReward !== "-"
) {

    let rrValue = parseFloat(
        riskReward.replace("1 : ", "")
    );

    if (rrValue < 1.50) {

        tradeApproval =
            "🔴 TRADE REJECTED - RISK/REWARD TOO LOW";

        entryConfirmation =
            "⏳ WAIT - BETTER RISK/REWARD NEEDED";

        reason =
            reason +
            " Trade rejected because Risk/Reward is below 1 : 1.50.";
    }
}
  // ===============================
// SCALPING SAFETY FILTER
// ===============================

if (
    tradeApproval === "🟢 TRADE APPROVED" &&
    typeof stopLoss === "number"
) {

    let marketRange = resistance - support;
    let stopDistance = Math.abs(price - stopLoss);

    // Stop loss should not be excessively large
    if (stopDistance > marketRange * 1.3) {

        tradeApproval = "🔴 TRADE REJECTED";
        signal = "WAIT ⏳";
        trend = "WAIT ⏳";
        confidence = 30;
        strength = "Weak ❌";
        tradeScore = "3.0/10 ⭐";

        stopLoss = "-";
        takeProfit = "-";
        tp1 = "-";
        tp2 = "-";
        tp3 = "-";
        riskReward = "-";
        positionSize = "N/A";

        entryConfirmation = "⛔ STOP LOSS TOO LARGE";
        reason =
            "Scalping safety filter rejected the setup because the required stop-loss distance is too large.";
    }
}
  // ===============================
// FINAL ENTRY CONFIDENCE FILTER
// ===============================

if (tradeApproval !== "🟢 TRADE APPROVED") {
    confidence = 30;
    tradeScore = "3.0/10 ⭐";
}
document.getElementById("trend").innerHTML =
"<h2>Trend: " + trend + "</h2>";

document.getElementById("signal").innerHTML =
"<h2>Signal: " + signal + "</h2>";

document.getElementById("confidence").innerHTML =
"<b>Confidence:</b> " + confidence + "%";

document.getElementById("strength").innerHTML =
"<b>Strength:</b> " + strength;
document.getElementById("tradeApproval").innerHTML =
"<b>Trade Status:</b> " + tradeApproval;

document.getElementById("stopLoss").innerHTML =
"<b>Stop Loss:</b> " + (typeof stopLoss === "number" ? stopLoss.toFixed(5) : stopLoss);

document.getElementById("takeProfit").innerHTML =
"<b>Take Profit:</b> " + (typeof takeProfit === "number" ? takeProfit.toFixed(5) : takeProfit);

document.getElementById("tp1").innerHTML =
"<b>TP1:</b> " + (typeof tp1 === "number" ? tp1.toFixed(5) : tp1);

document.getElementById("tp2").innerHTML =
"<b>TP2:</b> " + (typeof tp2 === "number" ? tp2.toFixed(5) : tp2);

document.getElementById("tp3").innerHTML =
"<b>TP3:</b> " + (typeof tp3 === "number" ? tp3.toFixed(5) : tp3);

document.getElementById("tradeScore").innerHTML =
"<b>Trade Score:</b> " + tradeScore;

document.getElementById("reason").innerHTML =
"<b>AI Reason:</b> " + reason;

document.getElementById("entryConfirmation").innerHTML =
"<b>Entry:</b> " + entryConfirmation;

document.getElementById("riskReward").innerHTML =
"<b>Risk/Reward:</b> " + riskReward;

document.getElementById("positionSize").innerHTML =
"<b>Recommended Position Size:</b> " + positionSize;
  if (tradeApproval === "🟢 TRADE APPROVED") {
    saveTradeToHistory();
  }
}

function resetForm() {
    document.getElementById("support").value = "";
    document.getElementById("resistance").value = "";
    document.getElementById("price").value = "";

    document.getElementById("trend").innerHTML = "";
    document.getElementById("signal").innerHTML = "";
    document.getElementById("confidence").innerHTML = "";
    document.getElementById("strength").innerHTML = "";
    document.getElementById("stopLoss").innerHTML = "";
    document.getElementById("takeProfit").innerHTML = "";
    document.getElementById("tp1").innerHTML = "";
    document.getElementById("tp2").innerHTML = "";
    document.getElementById("tp3").innerHTML = "";
    document.getElementById("reason").innerHTML = "";
    document.getElementById("riskReward").innerHTML = "";
    document.getElementById("entryConfirmation").innerHTML = "";
    document.getElementById("tradeScore").innerHTML = "";
  document.getElementById("positionSize").innerHTML = "";
  document.getElementById("tradeApproval").innerHTML = "";
}
document.getElementById("analyzeBtn").addEventListener("click", analyzeMarket);

document.getElementById("resetBtn").addEventListener("click", resetForm);
function saveTradeToHistory() {

    let tradeHistory = JSON.parse(localStorage.getItem("tradeHistory")) || [];

    let signal = document.getElementById("signal").innerText.replace("Signal: ", "");
let price = document.getElementById("price").value;
let stopLoss = document.getElementById("stopLoss").innerText.replace("Stop Loss: ", "");
let takeProfit = document.getElementById("takeProfit").innerText.replace("Take Profit: ", "");

    if (!signal || signal.includes("WAIT")) {
        return;
    }
let trade = {
    date: new Date().toLocaleString(),
    signal: signal,
    price: price,
    stopLoss: stopLoss,
    tp1: tp1,
    tp2: tp2,
    tp3: tp3,
    takeProfit: takeProfit
};
    

    tradeHistory.push(trade);

    localStorage.setItem("tradeHistory", JSON.stringify(tradeHistory));

    displayTradeHistory();
}
function displayTradeHistory() {

    let tradeHistory = JSON.parse(localStorage.getItem("tradeHistory")) || [];

    let historyDiv = document.getElementById("tradeHistory");

    if (tradeHistory.length === 0) {
        historyDiv.innerHTML = "<p>No trades yet.</p>";
        return;
    }

    historyDiv.innerHTML = "";

    tradeHistory.forEach((trade, index) => {

        historyDiv.innerHTML += `
            <div>
                <hr>
                <p><strong>Trade ${index + 1}</strong></p>
                <p>Date: ${trade.date}</p>
                <p>Signal: ${trade.signal}</p>
                <p>Entry: ${trade.price}</p>
                <p>Stop Loss: ${trade.stopLoss}</p>
                <p>Take Profit: ${trade.takeProfit}</p>

                <p><strong>Result:</strong> ${trade.result || "PENDING ⏳"}</p>

                <button onclick="markTradeResult(${index}, 'WIN')">
                    ✅ WIN
                </button>

                <button onclick="markTradeResult(${index}, 'LOSS')">
                    ❌ LOSS
                </button>
            </div>
        `;
    });
}
function markTradeResult(index, result) {

    let tradeHistory = JSON.parse(localStorage.getItem("tradeHistory")) || [];

    if (!tradeHistory[index]) {
        return;
    }

    tradeHistory[index].result = result;

    localStorage.setItem("tradeHistory", JSON.stringify(tradeHistory));

displayTradeHistory();
updateStatistics();
}
function updateStatistics() {

    let tradeHistory = JSON.parse(localStorage.getItem("tradeHistory")) || [];

    let wins = 0;
    let losses = 0;

    tradeHistory.forEach(trade => {

        if (trade.result === "WIN") {
            wins++;
        }

        if (trade.result === "LOSS") {
            losses++;
        }

    });

    let totalCompleted = wins + losses;

    let winRate = totalCompleted > 0
        ? ((wins / totalCompleted) * 100).toFixed(1)
        : "0.0";

    document.getElementById("wins").innerHTML =
        "<b>Wins:</b> " + wins;

    document.getElementById("losses").innerHTML =
        "<b>Losses:</b> " + losses;

    document.getElementById("winRate").innerHTML =
        "<b>Win Rate:</b> " + winRate + "%";
}
updateStatistics();
