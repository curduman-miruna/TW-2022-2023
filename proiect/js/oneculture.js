
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cultureId = urlParams.get('id');
    let navbar = document.querySelector('.navbar');

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
    tipsHeading.textContent = 'How to grow '+ data.culture.culture_name;
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

}
