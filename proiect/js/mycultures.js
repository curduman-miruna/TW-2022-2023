
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    favoriteItem.classList.remove('active');
}
const narciseCard = document.getElementById("narcise");

narciseCard.addEventListener("click", function() {
    window.location.href = "oneculture.html";
});
const newCard =document.getElementById("newCulture");
newCard.addEventListener("click", function() {
    window.location.href = "new.html";
});
