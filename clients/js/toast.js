function showToast(message,type="success"){

    let container=document.getElementById("toastContainer");

    if(!container){

        container=document.createElement("div");

        container.id="toastContainer";

        document.body.appendChild(container);

    }

    const toast=document.createElement("div");

    toast.className=`toast ${type}`;

    toast.innerHTML=message;

    container.appendChild(toast);

    setTimeout(()=>{

        toast.style.animation="slideOut .3s forwards";

        setTimeout(()=>{

            toast.remove();

        },300);

    },3000);

}