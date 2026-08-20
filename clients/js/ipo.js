const API = "http://localhost:5000/api";

const token = localStorage.getItem("token") || sessionStorage.getItem("token");

let ipoList = [];

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
   LOAD IPO
========================================== */

async function loadIPO(){

try{

const response=await fetch(`${API}/ipo`,{

headers:{
Authorization:token
}

});

const data=await response.json();

if(!data.success){

showToast(data.message,"error");
return;

}

ipoList=data.ipos || [];

displayIPO(ipoList);

loadSummary();

if(ipoList.length===0){

document.getElementById("emptyIPO").style.display="flex";

document.getElementById("ipoContainer").style.display="none";

}else{

document.getElementById("emptyIPO").style.display="none";

document.getElementById("ipoContainer").style.display="grid";

}

}catch(err){

console.log(err);

showToast("Unable to load IPO","error");

}

}

/* ==========================================
   DISPLAY IPO
========================================== */

function displayIPO(list){

const container=document.getElementById("ipoContainer");

container.innerHTML="";

list.forEach(ipo=>{

let badgeClass="active";

if(ipo.status==="Upcoming") badgeClass="upcoming";

if(ipo.status==="Closed") badgeClass="closed";

container.innerHTML+=`

<div class="ipo-card">

<div class="company-name">

${ipo.company_name}

</div>

<div class="company-sector">

${ipo.sector}

</div>

<div class="price-band">

<div class="price-box">

<h5>Price Band</h5>

<h3>

₹${ipo.price || ipo.price_band || 0}

</h3>

</div>

<div class="price-box">

<h5>Lot Size</h5>

<h3>

${ipo.lot_size}

</h3>

</div>

</div>

<div class="ipo-details">

<div class="detail-row">

<span>Issue Size</span>

<span>${ipo.issue_size}</span>

</div>

<div class="detail-row">

<span>Open Date</span>

<span>${ipo.open_date}</span>

</div>

<div class="detail-row">

<span>Close Date</span>

<span>${ipo.close_date}</span>

</div>

</div>

<div class="ipo-timeline">

<div class="timeline-item">

<span>Listing</span>

<span>${ipo.listing_date}</span>

</div>

</div>

<span class="badge ${badgeClass}">

${ipo.status}

</span>

<button

class="apply-btn"

onclick="applyIPO(${ipo.id})">

Apply Now

</button>

</div>

`;

});

}

/* ==========================================
   SUMMARY
========================================== */

function loadSummary(){

document.getElementById("activeIPO").innerText=
ipoList.filter(i=>i.status==="Active").length;

document.getElementById("upcomingIPO").innerText=
ipoList.filter(i=>i.status==="Upcoming").length;

document.getElementById("closedIPO").innerText=
ipoList.filter(i=>i.status==="Closed").length;

document.getElementById("myIPO").innerText=
ipoList.filter(i=>i.applied===1).length;

}

/* ==========================================
   SEARCH IPO
========================================== */

document
.getElementById("searchIPO")
.addEventListener("keyup",function(){

const value=this.value.toLowerCase();

const filtered=ipoList.filter(ipo=>

ipo.company_name.toLowerCase().includes(value)

||

ipo.sector.toLowerCase().includes(value)

);

displayIPO(filtered);

});

loadIPO();


/* ==========================================
   APPLY IPO
========================================== */

async function applyIPO(ipoId){

const lots = Number(prompt("Enter number of lots:", "1"));

if(!Number.isInteger(lots) || lots <= 0){
showToast("Enter a valid number of lots","error");
return;
}

if(!confirm("Do you want to apply for this IPO?")) return;

try{

const response = await fetch(`${API}/ipo/apply`,{

method:"POST",

headers:{
"Content-Type":"application/json",
Authorization:token
},

body:JSON.stringify({

ipo_id:ipoId
,
lots

})

});

const data = await response.json();

if(data.success){

showToast("IPO Application Submitted Successfully","success");

loadIPO();

}else{

showToast(data.message,"error");

}

}catch(err){

console.log(err);

showToast("Server Error","error");

}

}

/* ==========================================
   REFRESH IPO
========================================== */

function refreshIPO(){

loadIPO();

}

/* ==========================================
   AUTO REFRESH
========================================== */

setInterval(()=>{

refreshIPO();

},10000);

/* ==========================================
   REFRESH ON WINDOW FOCUS
========================================== */

window.addEventListener("focus",()=>{

refreshIPO();

});

/* ==========================================
   NETWORK STATUS
========================================== */

window.addEventListener("offline",()=>{

showToast("Internet Connection Lost","error");

});

window.addEventListener("online",()=>{

showToast("Connected","success");

refreshIPO();

});

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
   SORT IPO
========================================== */

function sortIPO(){

ipoList.sort((a,b)=>{

if(a.status==="Active" && b.status!=="Active") return -1;
if(a.status!=="Active" && b.status==="Active") return 1;

return a.company_name.localeCompare(b.company_name);

});

displayIPO(ipoList);

}

sortIPO();

/* ==========================================
   INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

loadIPO();

});

/* ==========================================
   END OF FILE
========================================== */