const API = `${window.location.origin}/api`;

const token = localStorage.getItem("token") || sessionStorage.getItem("token");

let orders = [];

/* ==========================================
   LOAD SIDEBAR
========================================== */

fetch("components/sidebar.html")
.then(res => res.text())
.then(data => {
document.getElementById("sidebar").innerHTML = data;
});

/* ==========================================
   LOAD TOPBAR
========================================== */

fetch("components/topbar.html")
.then(res => res.text())
.then(data => {
document.getElementById("topbar").innerHTML = data;
});

/* ==========================================
   LOAD ORDERS
========================================== */

async function loadOrders(){

try{

const response = await fetch(`${API}/orders`,{
headers:{
Authorization:token
}
});

const data = await response.json();

orders = data.orders || [];

displayOrders(orders);

loadSummary();

if(orders.length===0){

document.getElementById("emptyOrders").style.display="flex";

document.querySelector(".table-card").style.display="none";

}else{

document.getElementById("emptyOrders").style.display="none";

document.querySelector(".table-card").style.display="block";

}

}catch(err){

console.log(err);

showToast("Unable to load Orders","error");

}

}

/* ==========================================
   DISPLAY ORDERS
========================================== */

function displayOrders(list){

const tbody = document.getElementById("ordersTable");

tbody.innerHTML="";

list.forEach(order=>{

const total =
Number(order.price) * Number(order.quantity);

const typeClass =
order.order_type==="BUY"
? "buy"
: "sell";

const status = order.status || "COMPLETED";

const statusClass =
status.toLowerCase();

tbody.innerHTML += `

<tr>

<td>

<strong>${order.company_name}</strong>

<br>

<small>${order.symbol}</small>

</td>

<td>

<span class="${typeClass}">

${order.order_type}

</span>

</td>

<td>${order.quantity}</td>

<td>₹${Number(order.price).toFixed(2)}</td>

<td>₹${total.toLocaleString()}</td>

<td>

<span class="${statusClass}">

${status}

</span>

</td>

<td>

${new Date(order.created_at).toLocaleDateString()}

</td>

</tr>

`;

});

}

/* ==========================================
   SUMMARY CARDS
========================================== */

function loadSummary(){

document.getElementById("totalOrders").innerText =
orders.length;

const buy =
orders.filter(o=>o.order_type==="BUY").length;

const sell =
orders.filter(o=>o.order_type==="SELL").length;

document.getElementById("buyOrders").innerText =
buy;

document.getElementById("sellOrders").innerText =
sell;

const today =
new Date().toLocaleDateString();

const todayCount =
orders.filter(o=>

new Date(o.created_at).toLocaleDateString()===today

).length;

document.getElementById("todayOrders").innerText =
todayCount;

}

/* ==========================================
   SEARCH
========================================== */

document
.getElementById("searchOrders")
.addEventListener("keyup",function(){

const value =
this.value.toLowerCase();

const filtered =
orders.filter(order=>

order.company_name.toLowerCase().includes(value)

||

order.symbol.toLowerCase().includes(value)

);

displayOrders(filtered);

});

loadOrders();


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
   REFRESH ORDERS
========================================== */

function refreshOrders(){

loadOrders();

}

/* ==========================================
   AUTO REFRESH
========================================== */

setInterval(refreshOrders,10000);

/* ==========================================
   REFRESH ON WINDOW FOCUS
========================================== */

window.addEventListener("focus",()=>{

refreshOrders();

});

/* ==========================================
   NETWORK STATUS
========================================== */

window.addEventListener("offline",()=>{

showToast("Internet Connection Lost","error");

});

window.addEventListener("online",()=>{

showToast("Connected","success");

refreshOrders();

});

/* ==========================================
   SORT (Newest First)
========================================== */

function sortOrders(){

orders.sort((a,b)=>{

return new Date(b.created_at)-new Date(a.created_at);

});

displayOrders(orders);

}

sortOrders();

/* ==========================================
   INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

loadOrders();

});

/* ==========================================
   END OF FILE
========================================== */

