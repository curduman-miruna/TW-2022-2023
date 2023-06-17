let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    favoriteItem.classList.remove('active');
}
const buyFlower =document.getElementById("buyNarcise");
buyFlower.addEventListener("click", function() {
    window.location.href = "buyculture.html";
});