let idConst;
let nameConst;
let followed = false;
const emailConst = localStorage.getItem('userEmail');

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cultureId = urlParams.get('id');
  let navbar = document.querySelector('.navbar');
  idConst = cultureId;
  document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    favoriteItem.classList.remove('active');
  };

  if (cultureId) {
    fetchCultureById(cultureId);
  }
  console.log(cultureId);
});

async function fetchCultureById(cultureId) {
  console.log(cultureId);
  try {
    const response = await fetch(`http://localhost:8080/culture?id=${cultureId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    nameConst = data.culture.culture_name;
    if (response.ok) {
      createCultureView(data);
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function createCultureView(data) {
  const cultureView = document.querySelector('.culture-view');

  const imageView = document.createElement('div');
  imageView.classList.add('image');

  const image = document.createElement('img');
  image.src = data.culture.image_url;

  imageView.appendChild(image);

  const sellDiv = document.createElement('div');
  sellDiv.classList.add('buy');

  const sellHeading = document.createElement('h2');
  if (data.culture.availability === true && data.culture.buyer === 'not bought') {
    sellHeading.textContent = 'Buy';
  } else {
    sellHeading.textContent = 'No longer available';
  }

  sellDiv.appendChild(sellHeading);
  imageView.appendChild(sellDiv);

  const iDiv = document.createElement('div');
  iDiv.classList.add('interested');
  const iHeading = document.createElement('h2');

  if (followed === false) {
    iHeading.textContent = 'Follow';
  } else {
    iHeading.textContent = 'Followed';
  }

  iDiv.appendChild(iHeading);
  imageView.appendChild(iDiv);
  cultureView.appendChild(imageView);

  const description = document.createElement('div');
  description.classList.add('description');
  const cultureName = document.createElement('h2');
  cultureName.textContent = data.culture.culture_name;
  const cultureDescription = document.createElement('p');
  cultureDescription.textContent = data.culture.description;
  const price = document.createElement('div');
  price.classList.add('price');
  const priceHeading = document.createElement('h2');
  priceHeading.textContent = data.culture.price + ' lei';
  price.appendChild(priceHeading);
  description.appendChild(cultureName);
  description.appendChild(cultureDescription);
  description.appendChild(price);
  cultureView.appendChild(description);
  console.log(idConst);

  sellDiv.addEventListener('click', async function (event) {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/changeAvailabilityFalse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: idConst, email: emailConst }),
      });

      if (response.ok) {
        sellHeading.textContent = 'Purchased';
      } else {
        const data = await response.json();
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    console.log('Buy button clicked');
    console.log(idConst);
  });

  iDiv.addEventListener('click', async function (event) {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/addFollow', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_email: emailConst, culture_id: idConst, culture_name: nameConst }),
      });

      if (response.ok) {
        followed = true;
        iHeading.textContent = 'Followed';
      } else {
        const data = await response.json();
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
}