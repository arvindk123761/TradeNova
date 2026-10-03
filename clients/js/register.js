const API = `${window.location.origin}/api`;

/* ==========================================
   REGISTER
========================================== */

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

e.preventDefault();

const full_name = document.getElementById("fullName").value.trim();

const email = document.getElementById("email").value.trim();

const mobile = document.getElementById("mobile").value.trim();

const password = document.getElementById("password").value;

const confirmPassword = document.getElementById("confirmPassword").value;

const agree = document.getElementById("agree").checked;

/* Validation */

if(full_name===""){

showToast("Enter Full Name","error");
return;

}

if(email===""){

showToast("Enter Email","error");
return;

}

if(mobile===""){

showToast("Enter Mobile Number","error");
return;

}

if(password===""){

showToast("Enter Password","error");
return;

}

if(password.length<6){

showToast("Password must be at least 6 characters","error");
return;

}

if(password!==confirmPassword){

showToast("Passwords do not match","error");
return;

}

if(!agree){

showToast("Please accept Terms & Conditions","error");
return;

}

document.getElementById("loadingScreen").style.display="flex";

try{

const response = await fetch(`${API}/auth/register`,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

full_name,
email,
mobile,
password

})

});

const data = await response.json();

document.getElementById("loadingScreen").style.display="none";

if(data.success){

showToast("Registration Successful","success");

setTimeout(()=>{

window.location.href="login.html";

},1200);

}else{

showToast(data.message || "Registration Failed","error");

}

}catch(err){

console.log(err);

document.getElementById("loadingScreen").style.display="none";

showToast("Server Error","error");

}

});

/* ==========================================
   PASSWORD SHOW/HIDE
========================================== */

const passwordInput =
document.getElementById("password");

const confirmPasswordInput =
document.getElementById("confirmPassword");

passwordInput.addEventListener("dblclick",()=>{

passwordInput.type =
passwordInput.type==="password"
?
"text"
:
"password";

});

confirmPasswordInput.addEventListener("dblclick",()=>{

confirmPasswordInput.type =
confirmPasswordInput.type==="password"
?
"text"
:
"password";

});

/* ==========================================
   MOBILE VALIDATION
========================================== */

document
.getElementById("mobile")
.addEventListener("input",function(){

this.value =
this.value.replace(/[^0-9]/g,"");

});

/* ==========================================
   ENTER KEY
========================================== */

document.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

registerForm.requestSubmit();

}

});

/* ==========================================
   NETWORK STATUS
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