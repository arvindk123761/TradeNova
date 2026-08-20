const API = "http://localhost:5000/api";

let stocks = [];
let selectedStock = null;

/* ===================================
   LOAD COMMON COMPONENTS
=================================== */

fetch("components/sidebar.html")
.then(res => res.text())
.then(data=>{
document.getElementById("sidebar").innerHTML=data;
});

fetch("components/topbar.html")
.then(res=>res.text())
.then(data=>{
document.getElementById("topbar").innerHTML=data;
});

/* ===================================
   TOKEN
=================================== */

const token = localStorage.getItem("token") || sessionStorage.getItem("token");

/* ===================================
   LOAD STOCKS
=================================== */

async function loadStocks(){

try{

const response = await fetch(`${API}/stocks`);

const data = await response.json();

stocks = data.stocks || data;

displayStocks(stocks);

}
catch(err){

console.log(err);

showToast("Unable to load stocks","error");

}

}

/* ===================================
   DISPLAY STOCKS
=================================== */

function displayStocks(list){

const container =
document.getElementById("stockContainer");

container.innerHTML="";

if(list.length===0){

container.innerHTML=`

<h2>No Stocks Found</h2>

`;

return;

}

list.forEach(stock=>{

const change =
Number(stock.change_percent);

const badge =
change>=0
?
`<div class="stock-change up">
▲ ${change}%
</div>`
:
`<div class="stock-change down">
▼ ${change}%
</div>`;

container.innerHTML +=`

<div class="stock-card">

${badge}

<h2>

${stock.company_name}

</h2>

<p>

${stock.symbol}

</p>

<h3>

₹${Number(stock.current_price).toFixed(2)}

</h3>

<div class="stock-buttons">

<button

class="details-btn"

onclick="viewDetails(${stock.id})">

View

</button>

<button

class="buy-btn"

onclick="openBuyModal(${stock.id})">

Buy

</button>

<button

class="watch-btn"

onclick="toggleWatchlist(${stock.id})">

⭐

</button>

</div>

</div>

`;

});

}

loadStocks();

document.querySelectorAll(".filter-btn").forEach((button, index) => {
   button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(item => item.classList.remove("active"));
      button.classList.add("active");

      const sorted = [...stocks];
      if (index === 1) sorted.sort((a, b) => Number(b.change_percent) - Number(a.change_percent));
      if (index === 2) sorted.sort((a, b) => Number(a.change_percent) - Number(b.change_percent));
      if (index === 3 || index === 4) sorted.sort((a, b) => Number(b.volume || 0) - Number(a.volume || 0));
      displayStocks(index === 0 ? stocks : sorted.slice(0, 10));
   });
});

/* ===================================
   SEARCH STOCKS
=================================== */

const searchInput =
document.getElementById("search");

searchInput.addEventListener("keyup", function(){

const value =
this.value.toLowerCase();

const filtered =
stocks.filter(stock=>

stock.company_name.toLowerCase().includes(value) ||

stock.symbol.toLowerCase().includes(value)

);

displayStocks(filtered);

});

/* ===================================
   BUY MODAL
=================================== */

const buyModal =
document.getElementById("buyModal");

const qtyInput =
document.getElementById("quantity");

function openBuyModal(id){

selectedStock =
stocks.find(s=>s.id===id);

if(!selectedStock) return;

buyModal.style.display="flex";

document.getElementById("stockName").innerText =
selectedStock.company_name;

document.getElementById("stockSymbol").innerText =
selectedStock.symbol;

document.getElementById("stockPrice").innerText =
"₹"+Number(selectedStock.current_price).toFixed(2);

document.getElementById("pricePerShare").innerText =
"₹"+Number(selectedStock.current_price).toFixed(2);

qtyInput.value=1;

updateTotal();

}

/* ===================================
   CLOSE MODAL
=================================== */

document.getElementById("closeModal").onclick=()=>{

buyModal.style.display="none";

};

document.getElementById("cancelBuy").onclick=()=>{

buyModal.style.display="none";

};

window.onclick=(e)=>{

if(e.target===buyModal){

buyModal.style.display="none";

}

};

/* ===================================
   TOTAL PRICE
=================================== */

function updateTotal(){

if(!selectedStock) return;

const qty =
Number(qtyInput.value);

const total =
qty*Number(selectedStock.current_price);

document.getElementById("totalPrice").innerText =
"₹"+total.toLocaleString();

}

qtyInput.addEventListener("keyup",updateTotal);

qtyInput.addEventListener("change",updateTotal);

/* ===================================
   BUY STOCK API
=================================== */

document.getElementById("confirmBuy")

.addEventListener("click",async()=>{

const quantity =
Number(qtyInput.value);

if(quantity<=0){

showToast("Invalid Quantity","error");

return;

}

try{

const response =
await fetch(`${API}/trade/buy`,{

method:"POST",

headers:{

"Content-Type":"application/json",

Authorization:token

},

body:JSON.stringify({

stock_id:selectedStock.id,
quantity:quantity,
buy_price:Number(selectedStock.current_price)

})

});

const data =
await response.json();

if(data.success){

showToast(data.message,"success");

buyModal.style.display="none";

loadStocks();

}else{

showToast(data.message,"error");

}

}catch(err){

console.log(err);

showToast("Server Error","error");

}

});

/* ===========================================
   VIEW DETAILS
=========================================== */

async function viewDetails(id){

try{

const response =
await fetch(`${API}/stocks/${id}`);

const data =
await response.json();

const stock =
data.stock || data;

selectedStock = stock;

document.getElementById("detailCompany").innerText =
stock.company_name;

document.getElementById("detailSymbol").innerText =
stock.symbol;

document.getElementById("detailPrice").innerText =
"₹"+Number(stock.current_price).toFixed(2);

document.getElementById("detailsModal").style.display =
"flex";

}
catch(err){

console.log(err);

showToast("Unable to load stock","error");

}

}

/* ===========================================
   CLOSE DETAILS
=========================================== */

document.getElementById("closeDetails").onclick=()=>{

document.getElementById("detailsModal").style.display="none";

};

document.getElementById("buyFromDetails").onclick=()=>{

document.getElementById("detailsModal").style.display="none";

openBuyModal(selectedStock.id);

};

/* ===========================================
   WATCHLIST
=========================================== */

async function toggleWatchlist(id){

try{

const response =
await fetch(`${API}/watchlist`,{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:token
},

body:JSON.stringify({

stock_id:id

})

});

const data =
await response.json();

if(data.success){

showToast(data.message,"success");

}else{

showToast(data.message,"error");

}

}
catch(err){

console.log(err);

showToast("Server Error","error");

}

}

/* ===========================================
   TOP GAINERS
=========================================== */

async function loadTopGainers(){

try{

const response =
await fetch(`${API}/stocks/top-gainers`);

const data =
await response.json();

const box =
document.getElementById("topGainers");

box.innerHTML="";

data.gainers.forEach(stock=>{

box.innerHTML +=`

<div class="market-item">

<div>

<h4>${stock.company_name}</h4>

<small>

₹${Number(stock.current_price).toFixed(2)}

</small>

</div>

<span class="gain">

▲ ${stock.change_percent}%

</span>

</div>

`;

});

}
catch(err){

console.log(err);

}

}

/* ===========================================
   TOP LOSERS
=========================================== */

async function loadTopLosers(){

try{

const response =
await fetch(`${API}/stocks/top-losers`);

const data =
await response.json();

const box =
document.getElementById("topLosers");

box.innerHTML="";

data.losers.forEach(stock=>{

box.innerHTML +=`

<div class="market-item">

<div>

<h4>${stock.company_name}</h4>

<small>

₹${Number(stock.current_price).toFixed(2)}

</small>

</div>

<span class="loss">

▼ ${stock.change_percent}%

</span>

</div>

`;

});

}
catch(err){

console.log(err);

}

}

/* ===========================================
   MARKET OVERVIEW
=========================================== */

function loadMarketOverview(){

document.getElementById("nifty").innerHTML =
"25,180 <span class='green'>+0.82%</span>";

document.getElementById("sensex").innerHTML =
"82,420 <span class='green'>+1.14%</span>";

document.getElementById("banknifty").innerHTML =
"56,800 <span class='red'>-0.25%</span>";

}

/* ===========================================
   LOADING SCREEN
=========================================== */

window.addEventListener("load",()=>{

const loading =
document.getElementById("loadingScreen");

if(loading){

setTimeout(()=>{

loading.style.display="none";

},700);

}

});

/* ===========================================
   INITIALIZE PAGE
=========================================== */

loadTopGainers();

loadTopLosers();

loadMarketOverview();

/* Auto Refresh */

setInterval(loadStocks,5000);

setInterval(loadTopGainers,5000);

setInterval(loadTopLosers,5000);