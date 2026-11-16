const API = `${window.location.origin}/api`;

const token = localStorage.getItem("token") || sessionStorage.getItem("token");

function saveUserProfile(user) {
    try {
        const previousUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...previousUser, ...user }));
        window.dispatchEvent(new Event("tradenova:user-updated"));
    } catch (error) {
        console.error("Unable to save the updated profile for the topbar", error);
    }
}

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
   LOAD PROFILE
========================================== */

async function loadProfile(){

try{

const response = await fetch(`${API}/profile`,{

headers:{
Authorization:token
}

});

const data = await response.json();

if(!data.success){

showToast(data.message,"error");
return;

}

const user = data.user;
saveUserProfile(user);

/* Header */

document.getElementById("profileName").innerText =
user.full_name;

const profileAvatar = document.getElementById("profileAvatar");
if (profileAvatar) {
    const initial = String(user.full_name || user.email || "U").trim().charAt(0).toLocaleUpperCase() || "U";
    profileAvatar.textContent = initial;
    profileAvatar.setAttribute("aria-label", `${user.full_name || "User"} profile`);
}

document.getElementById("profileEmail").innerText =
user.email;

/* Information */

document.getElementById("fullName").innerText =
user.full_name;

document.getElementById("email").innerText =
user.email;

document.getElementById("mobile").innerText =
user.mobile || "Not Added";

document.getElementById("createdAt").innerText =
new Date(user.created_at).toLocaleDateString();

/* Edit Form */

document.getElementById("editName").value =
user.full_name;

document.getElementById("editEmail").value =
user.email;

document.getElementById("editMobile").value =
user.mobile || "";

} catch (err) {

console.error("Unable to load Profile", err);

showToast("Unable to load Profile","error");

}

}

/* ==========================================
   DASHBOARD STATS
========================================== */

async function loadStats(){

try{

const response = await fetch(`${API}/wallet`,{

headers:{
Authorization:token
}

});

const data = await response.json();

if(!data.success) return;

document.getElementById("walletBalance").innerText =
"₹"+Number(data.balance).toLocaleString();

document.getElementById("portfolioValue").innerText =
"₹"+Number(data.investment).toLocaleString();

document.getElementById("holdingCount").innerText =
data.totalHoldings;

}catch(err){

console.log(err);

}

try{

const response = await fetch(`${API}/orders/recent`,{

headers:{
Authorization:token
}

});

const data = await response.json();

document.getElementById("orderCount").innerText =
data.orders.length;

}catch(err){

console.log(err);

}

}

/* ==========================================
   EDIT PROFILE MODAL
========================================== */

const modal =
document.getElementById("editProfileModal");

document
.getElementById("editProfileBtn")
.addEventListener("click",()=>{

modal.style.display="flex";

});

document
.getElementById("closeProfileModal")
.addEventListener("click",()=>{

modal.style.display="none";

});

document
.getElementById("cancelProfile")
.addEventListener("click",()=>{

modal.style.display="none";

});

window.onclick=function(event){

if(event.target===modal){

modal.style.display="none";

}

};

loadProfile();

loadStats();


/* ==========================================
   SAVE PROFILE
========================================== */

document
.getElementById("saveProfile")
.addEventListener("click",async()=>{

const full_name =
document.getElementById("editName").value.trim();

const mobile =
document.getElementById("editMobile").value.trim();

if(full_name===""){

showToast("Name is required","error");

return;

}

try{

const response = await fetch(`${API}/profile`,{

method:"PUT",

headers:{

"Content-Type":"application/json",
Authorization:token

},

body:JSON.stringify({

full_name,
mobile

})

});

const data = await response.json();

if(data.success){

showToast("Profile Updated","success");

saveUserProfile({ full_name, mobile });

modal.style.display="none";

await loadProfile();

}else{

showToast(data.message,"error");

}

}catch(err){

console.log(err);

showToast("Server Error","error");

}

});

/* ==========================================
   CHANGE PASSWORD
========================================== */

document
.getElementById("changePassword")
.addEventListener("click",async()=>{

const currentPassword =
document.getElementById("currentPassword").value;

const newPassword =
document.getElementById("newPassword").value;

const confirmPassword =
document.getElementById("confirmPassword").value;

if(newPassword!==confirmPassword){

showToast("Passwords do not match","error");

return;

}

try{

const response = await fetch(`${API}/profile/change-password`,{

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

const data = await response.json();

if(data.success){

showToast("Password Updated","success");

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
   LOGOUT
========================================== */

document
.getElementById("logoutBtn")
.addEventListener("click",()=>{

if(confirm("Are you sure you want to Logout?")){

localStorage.removeItem("token");
sessionStorage.removeItem("token");

window.location.href="login.html";

}

});

/* ==========================================
   LOADING SCREEN
========================================== */

window.addEventListener("load",()=>{

const loader =
document.getElementById("loadingScreen");

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

loadProfile();
loadStats();

},10000);

/* ==========================================
   INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

loadProfile();
loadStats();

});