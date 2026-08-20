/* ==========================================
   SMOOTH SCROLL
========================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

const target=document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({

behavior:"smooth"

});

}

});

});

/* ==========================================
   NAVBAR SHADOW
========================================== */

const navbar=document.querySelector(".navbar");

window.addEventListener("scroll",()=>{

if(window.scrollY>30){

navbar.style.boxShadow="0 10px 30px rgba(0,0,0,.12)";
navbar.style.background="#ffffff";

}else{

navbar.style.boxShadow="0 8px 20px rgba(0,0,0,.05)";
navbar.style.background="#ffffff";

}

});

/* ==========================================
   HERO COUNTERS
========================================== */

const counters=document.querySelectorAll(".hero-stats h2");

function animateCounter(counter){

const text=counter.innerText;

const number=parseInt(text.replace(/\D/g,""));

const suffix=text.replace(/[0-9]/g,"");

let current=0;

const increment=Math.ceil(number/60);

const timer=setInterval(()=>{

current+=increment;

if(current>=number){

current=number;

clearInterval(timer);

}

counter.innerText=current+suffix;

},25);

}

let counterStarted=false;

window.addEventListener("scroll",()=>{

const hero=document.querySelector(".hero");

if(!counterStarted && window.scrollY<hero.offsetHeight){

counterStarted=true;

counters.forEach(animateCounter);

}

});

/* ==========================================
   FAQ ACCORDION
========================================== */

document.querySelectorAll(".faq-item").forEach(item=>{

const answer=item.querySelector("p");

answer.style.display="none";

item.querySelector("h3").style.cursor="pointer";

item.querySelector("h3").onclick=()=>{

document.querySelectorAll(".faq-item p").forEach(p=>{

if(p!==answer){

p.style.display="none";

}

});

answer.style.display=

answer.style.display==="block"

?

"none"

:

"block";

};

});

/* ==========================================
   REVEAL ANIMATION
========================================== */

const revealElements=document.querySelectorAll(

".stock-card,.feature-card,.fund-card,.testimonial-card,.faq-item"

);

function reveal(){

revealElements.forEach(el=>{

const top=el.getBoundingClientRect().top;

if(top<window.innerHeight-80){

el.style.opacity="1";
el.style.transform="translateY(0)";

}

});

}

revealElements.forEach(el=>{

el.style.opacity="0";
el.style.transform="translateY(40px)";
el.style.transition=".6s ease";

});

window.addEventListener("scroll",reveal);

reveal();

/* ==========================================
   MARKET TICKER PAUSE
========================================== */

const ticker=document.querySelector(".ticker");

ticker.addEventListener("mouseenter",()=>{

ticker.style.animationPlayState="paused";

});

ticker.addEventListener("mouseleave",()=>{

ticker.style.animationPlayState="running";

});

/* ==========================================
   HERO BUTTON EFFECT
========================================== */

document.querySelectorAll(".primary-btn").forEach(btn=>{

btn.addEventListener("mouseenter",()=>{

btn.style.transform="translateY(-4px) scale(1.02)";

});

btn.addEventListener("mouseleave",()=>{

btn.style.transform="translateY(0) scale(1)";

});

});

/* ==========================================
   BACK TO TOP BUTTON
========================================== */

const topBtn=document.createElement("button");

topBtn.innerHTML="↑";

topBtn.className="back-to-top";

document.body.appendChild(topBtn);

topBtn.style.cssText=`

position:fixed;
bottom:30px;
right:30px;
width:55px;
height:55px;
border:none;
border-radius:50%;
background:#2563eb;
color:white;
font-size:22px;
cursor:pointer;
display:none;
box-shadow:0 10px 25px rgba(37,99,235,.30);
z-index:9999;
transition:.3s;

`;

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

});

topBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

/* ==========================================
   PAGE LOADED
========================================== */

window.addEventListener("load",()=>{

document.body.style.opacity="1";

});

document.body.style.opacity="0";

document.body.style.transition=".4s";

/* ==========================================
   END OF FILE
========================================== */