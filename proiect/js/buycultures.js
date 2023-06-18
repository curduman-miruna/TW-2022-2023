const emailConst = localStorage.getItem('userEmail');
const cultureContainer = document.getElementById('cultureRow');
function generateCultureContent() {
  // Facem o cerere GET către endpoint
  console.log(emailConst);
  try { 
    fetch(`http://localhost:8080/buyPage?email=${encodeURIComponent(emailConst)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        
        data.forEach(culture => {
          console.log(culture.id);
          const cultureColumn = document.createElement('div');
          cultureColumn.classList.add('culture-column');
  
          const buyCard = document.createElement('div');
          buyCard.classList.add('buy-card');
  
          const cultureName = document.createElement('h3');
          cultureName.textContent = culture.culture_name;
  
          const stageOfGrowth = document.createElement('h2');
          stageOfGrowth.textContent = `Stage of growth: ${culture.status}`;
  
          const cultureImage = document.createElement('img');
          cultureImage.src = culture.image_url;
          cultureImage.alt = culture.culture_name;
  
          const cultureDescription = document.createElement('p');
          cultureDescription.textContent = culture.description;
  
          buyCard.appendChild(cultureName);
          buyCard.appendChild(stageOfGrowth);
          buyCard.appendChild(cultureImage);
          buyCard.appendChild(cultureDescription);
  
          cultureColumn.appendChild(buyCard);
          cultureContainer.appendChild(cultureColumn);
        });
      })
      .catch(error => {
        console.error('Error fetching data from endpoint:', error);
      });
  } catch (error) {
    console.error('Error:', error);
  }
}

window.addEventListener('DOMContentLoaded', generateCultureContent);
