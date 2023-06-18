let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
  navbar.classList.toggle('active');
  searchForm.classList.remove('active');
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
  column.addEventListener('click', () => redirectToMyCulture(culture.id));
  return column;
}

async function redirectToMyCulture(cultureId) {
  try {
    const response = await fetch(`http://localhost:8080/MyCulture?id=${cultureId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    if (response.ok) {
      // Redirecționează către pagina "oneculture" și furnizează ID-ul culturii ca parametru de căutare
      window.location.href = `oneculture.html?id=${cultureId}`;
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Funcția pentru obținerea culturilor prin cerere GET la endpoint
async function getCultures() {
  const emailConst = localStorage.getItem('userEmail');
  try {
    const response = await fetch(`http://localhost:8080/cultures?email=${encodeURIComponent(emailConst)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

const addButton = document.getElementById('add-culture');
addButton.addEventListener('click', event=>{
 event.preventDefault();
 window.location.href='new.html';
});