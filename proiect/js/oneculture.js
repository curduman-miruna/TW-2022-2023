window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cultureId = urlParams.get('id');
  
    if (cultureId) {
      fetchCultureById(cultureId);
    }
  });
  
  async function fetchCultureById(cultureId) {
    try {
      const response = await fetch(`http://localhost:8080/MyCulture?id=${cultureId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
  
      if (response.ok) {
        createCultureView(data);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  function createCultureView(culture) {
    const cultureView = document.querySelector('.culture-view');
  
    const cultureViewContent = document.createElement('div');
    cultureViewContent.classList.add('culture-view-content');
  
    const imageView = document.createElement('div');
    imageView.classList.add('image');
    const image = document.createElement('img');
    image.src = culture.image_url;
    imageView.appendChild(image);
    cultureViewContent.appendChild(imageView);
  
    const sellDiv = document.createElement('div');
    sellDiv.classList.add('sell');
    const sellHeading = document.createElement('h2');
    sellHeading.textContent = 'Sell';
    sellDiv.appendChild(sellHeading);
    cultureViewContent.appendChild(sellDiv);
  
    const description = document.createElement('div');
    description.classList.add('description');
    const cultureName = document.createElement('h2');
    cultureName.textContent = culture.culture_name;
    const cultureDescription = document.createElement('p');
    cultureDescription.textContent = culture.description;
    const price = document.createElement('div');
    price.classList.add('price');
    const priceHeading = document.createElement('h2');
    priceHeading.textContent = culture.price;
    price.appendChild(priceHeading);
    description.appendChild(cultureName);
    description.appendChild(cultureDescription);
    description.appendChild(price);
    cultureViewContent.appendChild(description);
  
    cultureView.appendChild(cultureViewContent);
  }
  