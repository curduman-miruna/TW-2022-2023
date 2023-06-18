let idConst;
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cultureId = urlParams.get('id');
    let navbar = document.querySelector('.navbar');
idConst=cultureId;
    document.querySelector('#menu-btn').onclick = () => {
        navbar.classList.toggle('active');
        searchForm.classList.remove('active');
        favoriteItem.classList.remove('active');
    };

    if (cultureId) {
        fetchCultureById(cultureId);
    }
    console.log(cultureId);

    const editBtn = document.querySelector('.edit-culture .edit-button');
    let isEditMode = false;
    let originalButtonText = editBtn.textContent;

    editBtn.addEventListener('click', function (event) {
        event.preventDefault();
        const cultureDescription = document.querySelector('.description p');
        const priceHeading = document.querySelector('.price h2');
        const cultureName = document.querySelector('.description h2');

        if (!isEditMode) {
            // Enter edit mode
            cultureDescription.setAttribute('contenteditable', 'true');
            priceHeading.setAttribute('contenteditable', 'true');
            cultureName.setAttribute('contenteditable', 'true');

            cultureDescription.classList.add('editable');
            priceHeading.classList.add('editable');
            cultureName.classList.add('editable');

            editBtn.classList.add('edit-mode');
            editBtn.textContent = 'Save changes';
            
        } else {
            // Exit edit mode and send changes to the server
            const priceInt = parseInt(priceHeading.textContent.split(' ')[0]);

            const id = cultureId;
            const updatedCulture = {
                id,
                culture_name: cultureName.textContent,
                price: priceInt,
                description: cultureDescription.textContent
            };
            console.log(updatedCulture.culture_name);
            console.log(updatedCulture.id);
            console.log(updatedCulture.description);


            fetch('http://localhost:8080/culture/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCulture)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Changes saved successfully
                        console.log('Changes saved:', data.culture);
                        // You can perform any additional actions here
                    } else {
                        // Failed to save changes
                        console.error('Failed to save changes:', data.message);
                        // You can handle the error or display a message to the user
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Handle the error or display a message to the user
                });

            cultureDescription.removeAttribute('contenteditable');
            priceHeading.removeAttribute('contenteditable');
            cultureName.removeAttribute('contenteditable');

            cultureDescription.classList.remove('editable');
            priceHeading.classList.remove('editable');
            cultureName.classList.remove('editable');
            editBtn.classList.remove('edit-mode');
            editBtn.textContent = originalButtonText;
        }

        isEditMode = !isEditMode;
    });
   

    


});

async function fetchCultureById(cultureId) {
    console.log(cultureId);
    try {
        const response = await fetch(`http://localhost:8080/MyCulture?id=${cultureId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log(data.culture.culture_name);
        if (response.ok) {
            createCultureView(data);
            showTips(data);
            const tipsElement = showTips(data);
            const cultureTip = document.querySelector('.culture-tip');
            cultureTip.appendChild(tipsElement);
        } else {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
function showTips(data) {
    console.log(data.tips);
    const cultureTip = document.createElement('div');
    cultureTip.classList.add('culture-tip');

    const lineDiv = document.createElement('div');
    lineDiv.classList.add('line');
    const tipsHeading = document.createElement('h2');
    tipsHeading.textContent = 'How to grow ' + data.culture.culture_type;
    lineDiv.appendChild(tipsHeading);
    cultureTip.appendChild(lineDiv);

    const tipBox = document.createElement('div');
    tipBox.classList.add('tip-box');
    const tipParagraph = document.createElement('p');
    tipParagraph.textContent = data.tips;
    tipBox.appendChild(tipParagraph);
    cultureTip.appendChild(tipBox);


    return cultureTip;
}
function createCultureView(data) {
    const cultureView = document.querySelector('.culture-view');

    const imageView = document.createElement('div');
    imageView.classList.add('image');
    const image = document.createElement('img');
    image.src = data.culture.image_url;
    imageView.appendChild(image);

    const sellDiv = document.createElement('div');
    sellDiv.classList.add('sell');
    const sellHeading = document.createElement('h2');
    sellHeading.textContent = 'Sell';
    sellDiv.appendChild(sellHeading);
    imageView.appendChild(sellDiv);
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
    priceHeading.textContent = data.culture.price + '  lei';
    price.appendChild(priceHeading);
    description.appendChild(cultureName);
    description.appendChild(cultureDescription);
    description.appendChild(price);
    cultureView.appendChild(description);
    sellDiv.addEventListener('click', async function (event) {
  event.preventDefault();
  try {
    const response = await fetch('http://localhost:8080/changeAvailabilityTrue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: idConst })
    });

    if (response.ok) {
      const successMessage = document.getElementById('sell-message');
      successMessage.style.display = 'block';
    } else {
      const data = await response.json();
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  console.log('Sell button clicked');
  console.log(idConst);
});

    
    
}