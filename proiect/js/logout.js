const logoutButton= document.getElementById('logout');
logoutButton.addEventListener('click',()=>{
localStorage.removeItem("token");
window.location.href="index.html";
});