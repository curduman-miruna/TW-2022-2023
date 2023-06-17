
/*
const narciseCard = document.getElementById("narcise");

narciseCard.addEventListener("click", function() {
    window.location.href = "oneculture.html";
});
const newCard =document.getElementById("newCulture");
newCard.addEventListener("click", function() {
    window.location.href = "new.html";
});
*/
let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    favoriteItem.classList.remove('active');
}

const cultureRow = document.getElementById('culture-row');

// Funcția pentru crearea coloanei de cultură
function createCultureColumn(culture) {
  const column = document.createElement('div');
  column.classList.add('culture-column');

  const card = document.createElement('div');
  card.classList.add('culture-card');

  const title = document.createElement('h3');
  title.textContent = culture.culture_name;

  const image = document.createElement('img');
  image.src = culture.image_url;
  image.alt = culture.culture_name;

  const description = document.createElement('p');
  description.textContent = culture.description;

  card.appendChild(title);
  card.appendChild(image);
  card.appendChild(description);

  column.appendChild(card);

  return column;
}

// Funcția pentru obținerea culturilor prin cerere GET la endpoint
async function getCultures() {
    const emailConst = localStorage.getItem('userEmail');
  try {
    const response = await fetch(`http://localhost:8080/cultures?email=${encodeURIComponent(emailConst)}`,{
        method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = await response.json();

    if (response.ok) {
      data.forEach((culture) => {
        console.log(culture.user_id);
        
        const cultureColumn = createCultureColumn(culture);
        cultureRow.appendChild(cultureColumn);
      });
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

window.addEventListener('DOMContentLoaded', getCultures);
