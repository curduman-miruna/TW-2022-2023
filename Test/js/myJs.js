let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}

const accountIcon = document.getElementById("account");

accountIcon.addEventListener("click", function() {
  window.location.href = "account.html";
});

let cartItem = document.querySelector('.cart-items-container');

document.querySelector('#cart-btn').onclick = () =>{
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
}

window.onscroll = () =>{
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
}



const form = document.getElementById("login-form"); /*formularul de logare */

const accountInfo = document.getElementById("account-info"); /**informatiile contului  */

form.addEventListener("submit", function(event) {
    event.preventDefault();

const email = form.email.value;
const password = form.password.value;

if (email === "mariatodirel7@gmail.com" && password === "maria") {

      accountInfo.style.display = "block";

      form.style.display = "none";
    } else if(email === "admin" && password === "admin"){
        window.location.href="admin.html";
    }
    else

    {
      // If the login is incorrect, display an error message
      alert("Incorrect email or password. Please try again.");
    }
 
  });


const editButton =document.getElementById("edit-button");
const editPage =document.getElementById("edit-page");

editButton.addEventListener("click", function(event){
    editPage.style.display = "flex";
});

