const API = `${window.location.origin}/api`;

const token = localStorage.getItem("token") || sessionStorage.getItem("token");

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
   LOAD SETTINGS
========================================== */

function loadSettings(){

const settings=JSON.parse(localStorage.getItem("tradenovaSettings") || "null") || {
email_notification:true,
sms_notification:true,
price_alert:true,
dark_mode:false,
compact_view:false,
animation:true
};

document.getElementById("emailNotification").checked=settings.email_notification;

document.getElementById("smsNotification").checked=settings.sms_notification;

document.getElementById("priceAlert").checked=settings.price_alert;

document.getElementById("darkMode").checked=settings.dark_mode;

document.getElementById("compactView").checked=settings.compact_view;

document.getElementById("animationToggle").checked=settings.animation;

applySettings(settings);

}

function applySettings(settings){
   document.body.classList.toggle("dark-mode", settings.dark_mode);
   document.body.classList.toggle("compact-view", settings.compact_view);
   document.body.classList.toggle("reduced-motion", !settings.animation);
}

/* ==========================================
   SAVE SETTINGS
========================================== */

document
.getElementById("saveSettings")
.addEventListener("click",saveSettings);

async function saveSettings(){

const settings={

email_notification:document.getElementById("emailNotification").checked,

sms_notification:document.getElementById("smsNotification").checked,

price_alert:document.getElementById("priceAlert").checked,

dark_mode:document.getElementById("darkMode").checked,

compact_view:document.getElementById("compactView").checked,

animation:document.getElementById("animationToggle").checked

};

localStorage.setItem("tradenovaSettings",JSON.stringify(settings));
applySettings(settings);
showToast("Settings Saved","success");

}

/* ==========================================
   DARK MODE
========================================== */

document
.getElementById("darkMode")
.addEventListener("change",function(){
saveSettings();
});

loadSettings();

/* ==========================================
   CHANGE PASSWORD MODAL
========================================== */

const passwordModal =
document.getElementById("passwordModal");

document
.getElementById("changePasswordBtn")
.addEventListener("click",()=>{

passwordModal.style.display="flex";

});

document
.getElementById("closePasswordModal")
.addEventListener("click",()=>{

passwordModal.style.display="none";

});

document
.getElementById("cancelPassword")
.addEventListener("click",()=>{

passwordModal.style.display="none";

});

window.onclick=function(event){

if(event.target===passwordModal){

passwordModal.style.display="none";

}

};

/* ==========================================
   UPDATE PASSWORD
========================================== */

document
.getElementById("updatePassword")
.addEventListener("click",async()=>{

const currentPassword =
document.getElementById("currentPassword").value;

const newPassword =
document.getElementById("newPassword").value;

const confirmPassword =
document.getElementById("confirmPassword").value;

if(currentPassword===""){

showToast("Enter Current Password","error");

return;

}

if(newPassword===""){

showToast("Enter New Password","error");

return;

}

if(newPassword!==confirmPassword){

showToast("Passwords do not match","error");

return;

}

try{

const response=await fetch(`${API}/profile/change-password`,{

method:"PUT",

headers:{
"Content-Type":"application/json",
Authorization:token
},

body:JSON.stringify({

currentPassword,
newPassword

})

});

const data=await response.json();

if(data.success){

showToast("Password Updated Successfully","success");

passwordModal.style.display="none";

document.getElementById("currentPassword").value="";
document.getElementById("newPassword").value="";
document.getElementById("confirmPassword").value="";

}else{

showToast(data.message,"error");

}

}catch(err){

console.log(err);

showToast("Server Error","error");

}

});

/* ==========================================
   RESET SETTINGS
========================================== */

document
.getElementById("resetSettings")
.addEventListener("click",()=>{

if(!confirm("Reset all settings to default?")) return;

document.getElementById("emailNotification").checked=true;
document.getElementById("smsNotification").checked=false;
document.getElementById("priceAlert").checked=true;
document.getElementById("darkMode").checked=false;
document.getElementById("compactView").checked=false;
document.getElementById("animationToggle").checked=true;

saveSettings();

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
   AUTO REFRESH
========================================== */

setInterval(()=>{

loadSettings();

},30000);

/* ==========================================
   NETWORK STATUS
========================================== */

window.addEventListener("offline",()=>{

showToast("Internet Connection Lost","error");

});

window.addEventListener("online",()=>{

showToast("Connected","success");

loadSettings();

});

/* ==========================================
   INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

loadSettings();

});

/* ==========================================
   END OF FILE
========================================== */