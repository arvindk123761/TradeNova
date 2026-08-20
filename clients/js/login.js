const API = "http://localhost:5000/api";

localStorage.removeItem("token");
sessionStorage.removeItem("token");

/* ==========================================
   LOGIN
========================================== */

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

e.preventDefault();

const email = document.getElementById("email").value.trim();

const password = document.getElementById("password").value;

const rememberMe = document.getElementById("rememberMe").checked;

if(email==="" || password===""){

showToast("Please fill all fields","error");

return;

}

document.getElementById("loadingScreen").style.display="flex";

try{

const response = await fetch(`${API}/auth/login`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

email,
password

})

});

const data = await response.json();

document.getElementById("loadingScreen").style.display="none";

if(data.success){

showToast("Login Successful","success");

localStorage.removeItem("token");
sessionStorage.removeItem("token");

if(rememberMe){
   localStorage.setItem("token",data.token);
}else{
   sessionStorage.setItem("token",data.token);
}

localStorage.setItem("user",JSON.stringify(data.user));

setTimeout(()=>{

window.location.href="dashboard.html";

},1000);

}else{

showToast(data.message || "Invalid Email or Password","error");

}

}catch(err){

console.log(err);

document.getElementById("loadingScreen").style.display="none";

showToast("Server Error","error");

}

});

/* ==========================================
   ENTER KEY LOGIN
========================================== */

document.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

loginForm.requestSubmit();

}

});

/* ==========================================
   PASSWORD SHOW/HIDE (Optional)
========================================== */

const passwordInput = document.getElementById("password");

passwordInput.addEventListener("dblclick",()=>{

passwordInput.type =
passwordInput.type==="password"
?
"text"
:
"password";

});

/* ==========================================
   ONLINE / OFFLINE
========================================== */

window.addEventListener("offline",()=>{

showToast("Internet Connection Lost","error");

});

window.addEventListener("online",()=>{

showToast("Connected","success");

});

/* ==========================================
   REMOVE LOADER
========================================== */

window.onload=()=>{

document.getElementById("loadingScreen").style.display="none";

};