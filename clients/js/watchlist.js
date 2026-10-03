const API = `${window.location.origin}/api`;

const token = localStorage.getItem("token") || sessionStorage.getItem("token");

let watchlist = [];

/* ==========================================
   LOAD SIDEBAR
========================================== */

fetch("components/sidebar.html")
.then(res=>res.text())
.then(data=>{
document.getElementById("sidebar").innerHTML=data;
});

/* ==========================================
   LOAD TOPBAR
========================================== */

fetch("components/topbar.html")
.then(res=>res.text())
.then(data=>{
document.getElementById("topbar").innerHTML=data;
});

/* ==========================================
   LOAD WATCHLIST
========================================== */

async function loadWatchlist(){

try{

const response=await fetch(`${API}/watchlist`,{
headers:{
Authorization:token
}
});

const data=await response.json();

watchlist=data.watchlist||[];

displayWatchlist(watchlist);

loadSummary();

if(watchlist.length===0){

document.getElementById("emptyWatchlist").style.display="flex";

document.getElementById("watchlistContainer").style.display="none";

}else{

document.getElementById("emptyWatchlist").style.display="none";

document.getElementById("watchlistContainer").style.display="grid";

}

}catch(err){

console.log(err);

showToast("Unable to load Watchlist","error");

}

}

/* ==========================================
   DISPLAY WATCHLIST
========================================== */

function displayWatchlist(list){

const container=document.getElementById("watchlistContainer");

container.innerHTML="";

list.forEach(stock=>{

const changeClass=
stock.change_percent>=0
?"up":"down";

const arrow=
stock.change_percent>=0
?"▲":"▼";

container.innerHTML+=`

<div class="watch-card">

<div class="company">

${stock.company_name}

</div>

<div class="symbol">

${stock.symbol}

</div>

<div class="price">

₹${Number(stock.current_price).toFixed(2)}

</div>

<div class="change ${changeClass}">

${arrow}

${stock.change_percent}%

</div>

<div class="watch-buttons">

<button
class="buy-btn"
onclick="buyStock(${stock.stock_id})">

Buy

</button>

<button
class="remove-btn"
onclick="removeWatchlist(${stock.stock_id})">

✖

</button>

</div>

</div>

`;

});

}

/* ==========================================
   SUMMARY
========================================== */

function loadSummary(){

document.getElementById("watchCount").innerText=
watchlist.length;

if(watchlist.length===0){

document.getElementById("highestPrice").innerText="₹0";
document.getElementById("lowestPrice").innerText="₹0";
document.getElementById("averagePrice").innerText="₹0";

return;

}

let prices=
watchlist.map(s=>Number(s.current_price));

let highest=
Math.max(...prices);

let lowest=
Math.min(...prices);

let average=
prices.reduce((a,b)=>a+b,0)/prices.length;

document.getElementById("highestPrice").innerText=
"₹"+highest.toLocaleString();

document.getElementById("lowestPrice").innerText=
"₹"+lowest.toLocaleString();

document.getElementById("averagePrice").innerText=
"₹"+average.toFixed(2);

}

/* ==========================================
   SEARCH
========================================== */

document
.getElementById("searchWatchlist")
.addEventListener("keyup",function(){

const value=
this.value.toLowerCase();

const filtered=
watchlist.filter(stock=>

stock.company_name.toLowerCase().includes(value)

||

stock.symbol.toLowerCase().includes(value)

);

displayWatchlist(filtered);

});

loadWatchlist();


/* ==========================================
   REMOVE FROM WATCHLIST
========================================== */

async function removeWatchlist(stockId){

if(!confirm("Remove this stock from Watchlist?")) return;

try{

const response=await fetch(`${API}/watchlist`,{

method:"DELETE",

headers:{
"Content-Type":"application/json",
Authorization:token
},

body:JSON.stringify({

stock_id:stockId
})
});

const data=await response.json();

if(data.success){

showToast(data.message,"success");

loadWatchlist();

}else{

showToast(data.message,"error");

}

}catch(err){

showToast("Server Error","error");

}
}

/* ==========================================
   BUY STOCK
=========================================== */

function buyStock(stockId){

window.location.href=`stocks.html?id=${stockId}`;

}

/* ==========================================
   REFRESH EVERY 10 SECONDS
========================================== */

setInterval(()=>{

loadWatchlist();

},10000);

/* ==========================================
   LOADING SCREEN
========================================== */

window.addEventListener("load",()=>{

const loader=document.getElementById("loadingScreen");

if(loader){

setTimeout(()=>{

loader.style.display="none";

},700);

}

});

/* ==========================================
   INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

loadWatchlist();

});