const API = `${window.location.origin}/api`;

const token = localStorage.getItem("token") || sessionStorage.getItem("token");

let portfolio = [];
let selectedHolding = null;
let portfolioChart = null;

/* ===========================================
   LOAD COMMON COMPONENTS
=========================================== */

fetch("components/sidebar.html")
.then(res=>res.text())
.then(data=>{
document.getElementById("sidebar").innerHTML=data;
});

fetch("components/topbar.html")
.then(res=>res.text())
.then(data=>{
document.getElementById("topbar").innerHTML=data;
});

/* ===========================================
   LOAD PORTFOLIO
=========================================== */

async function loadPortfolio(){

if(!token){

showToast("Session expired. Please log in again.","error");

setTimeout(()=>{
window.location.href="login.html";
},1000);

return;

}

try{

const response =
await fetch(`${API}/portfolio`,{

headers:{
Authorization:`Bearer ${token}`
}

});

if(!response.ok){

if(response.status===401){
showToast("Session expired. Please log in again.","error");
setTimeout(()=>window.location.href="login.html",1000);
return;
}

throw new Error(`Portfolio request failed: ${response.status}`);

}

const data =
await response.json();

portfolio =
data.portfolio || [];

displayPortfolio(portfolio);

loadSummary(portfolio);

drawChart(portfolio);

if(portfolio.length===0){

document.getElementById("emptyPortfolio").style.display="flex";

document.querySelector(".table-card").style.display="none";

}else{

document.getElementById("emptyPortfolio").style.display="none";

document.querySelector(".table-card").style.display="block";

}

}
catch(err){

console.log(err);

showToast("Unable to load portfolio","error");

}

}

/* ===========================================
   DISPLAY TABLE
=========================================== */

function displayPortfolio(list){

const tbody =
document.getElementById("portfolioTable");

tbody.innerHTML="";

list.forEach(stock=>{

const investment =
Number(stock.buy_price)*
Number(stock.quantity);

const current =
Number(stock.current_price)*
Number(stock.quantity);

const profit =
current-investment;

tbody.innerHTML +=`

<tr>

<td>

<strong>

${stock.company_name}

</strong>

<br>

<small>

${stock.symbol}

</small>

</td>

<td>

${stock.quantity}

</td>

<td>

₹${Number(stock.buy_price).toFixed(2)}

</td>

<td>

₹${Number(stock.current_price).toFixed(2)}

</td>

<td>

₹${investment.toLocaleString()}

</td>

<td class="${profit>=0?'profit':'loss'}">

₹${profit.toLocaleString()}

</td>

<td>

<button

class="sell-btn"

onclick="openSellModal(${stock.id})">

Sell

</button>

</td>

</tr>

`;

});

}

/* ===========================================
   SEARCH
=========================================== */

document
.getElementById("portfolioSearch")
.addEventListener("keyup",function(){

const value =
this.value.toLowerCase();

const filtered =
portfolio.filter(stock=>

stock.company_name.toLowerCase().includes(value)

||

stock.symbol.toLowerCase().includes(value)

);

displayPortfolio(filtered);

});

/* ===========================================
   SUMMARY
=========================================== */

function loadSummary(list){

let investment=0;

let current=0;

const holdings = list.length;

list.forEach(stock=>{

investment +=
Number(stock.buy_price)*
Number(stock.quantity);

current +=
Number(stock.current_price)*
Number(stock.quantity);

});

const profit =
current-investment;

document.getElementById("investment").innerText =
"₹"+investment.toLocaleString();

document.getElementById("currentValue").innerText =
"₹"+current.toLocaleString();

document.getElementById("profit").innerText =
"₹"+profit.toLocaleString();

document.getElementById("holdings").innerText =
holdings;

}

/* ===========================================
   CHART
=========================================== */

function drawChart(list){

const ctx =
document
.getElementById("portfolioChart")
.getContext("2d");

const labels =
list.map(stock=>stock.symbol);

const values =
list.map(stock=>

Number(stock.current_price)*
Number(stock.quantity)

);

if (portfolioChart) {
portfolioChart.destroy();
}

portfolioChart = new Chart(ctx,{

type:"doughnut",

data:{

labels,

datasets:[{

data:values,

backgroundColor:[

"#2563eb",

"#16a34a",

"#f59e0b",

"#ef4444",

"#7c3aed",

"#06b6d4",

"#ec4899",

"#84cc16"

]

}]

},

options:{

responsive:true,

plugins:{

legend:{

position:"bottom"

}

}

}

});

}

/* ===========================================
   SELL MODAL
=========================================== */

const sellModal =
document.getElementById("sellModal");

function openSellModal(id){

selectedHolding =
portfolio.find(stock=>stock.id===id);

if(!selectedHolding) return;

sellModal.style.display="flex";

document.getElementById("sellCompany").value =
selectedHolding.company_name;

document.getElementById("availableQty").value =
selectedHolding.quantity;

document.getElementById("sellQty").value = 1;

document.getElementById("sellPrice").value =
"₹"+Number(selectedHolding.current_price).toFixed(2);

updateSellTotal();

}

/* ===========================================
   UPDATE SELL TOTAL
=========================================== */

function updateSellTotal(){

if(!selectedHolding) return;

const qty =
Number(document.getElementById("sellQty").value);

const total =
qty * Number(selectedHolding.current_price);

document.getElementById("sellTotal").innerText =
"₹"+total.toLocaleString();

}

document
.getElementById("sellQty")
.addEventListener("keyup",updateSellTotal);

document
.getElementById("sellQty")
.addEventListener("change",updateSellTotal);

/* ===========================================
   CLOSE MODAL
=========================================== */

document
.getElementById("closeSellModal")
.onclick=()=>{

sellModal.style.display="none";

};

document
.getElementById("cancelSell")
.onclick=()=>{

sellModal.style.display="none";

};

window.addEventListener("click",(e)=>{

if(e.target===sellModal){

sellModal.style.display="none";

}

});

/* ===========================================
   SELL STOCK
=========================================== */

document
.getElementById("confirmSell")
.addEventListener("click",async()=>{

const qty =
Number(document.getElementById("sellQty").value);

if(!token){

showToast("Session expired. Please log in again.","error");
setTimeout(()=>window.location.href="login.html",1000);
return;

}

if(qty<=0){

showToast("Invalid Quantity","error");

return;

}

try{

const response =
await fetch(`${API}/trade/sell`,{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:`Bearer ${token}`

},

body:JSON.stringify({

portfolio_id:selectedHolding.id,

quantity:qty

})

});

const data =
await response.json();

if(data.success){

showToast(data.message,"success");

sellModal.style.display="none";

loadPortfolio();

}else{

showToast(data.message,"error");

}

}
catch(err){

console.log(err);

showToast("Server Error","error");

}

});

/* ===========================================
   LOADING SCREEN
=========================================== */

window.addEventListener("load",()=>{

const loader =
document.getElementById("loadingScreen");

if(loader){

setTimeout(()=>{

loader.style.display="none";

},700);

}

});

/* ===========================================
   AUTO REFRESH
=========================================== */

setInterval(loadPortfolio,5000);

/* ===========================================
   INITIALIZE
=========================================== */

loadPortfolio();