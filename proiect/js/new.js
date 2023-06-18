const addButton = document.getElementById('add-culture');
const emailConst = localStorage.getItem('userEmail');

addButton.addEventListener('click', async function(event) {
    let token = localStorage.getItem('token');
    console.log(token);

    if (token === null) {
        window.location.href = 'index.html'; //login/sign up
        return;
    }

    event.preventDefault(); 
    const form1 = document.getElementById('form1');
    const form2 = document.getElementById('form2');

    const name = form1.querySelector('input[name="name"]').value;
    const description = form1.querySelector('input[name="description"]').value;
    const price = form1.querySelector('input[name="price"]').value;

    const temperature = form1.querySelector('input[name="temperature"]').value;
    const soil = form1.querySelector('input[name="soil"]').value;
    const image = form1.querySelector('input[name="image"]').value;

    const categoryRadios = form2.querySelectorAll('input[name="category"]');
    let selectedCategory = '';
    categoryRadios.forEach(function(radio) {
        if (radio.checked) {
            selectedCategory = radio.value;
        }
    });

    console.log('Name:', name);
    console.log('Description:', description);
    console.log('Price:', price);
    console.log('Temperature:', temperature);
    console.log('Soil:', soil);
    console.log('Image:', image);
    console.log('Selected Category:', selectedCategory);

    try {
        const response = await fetch('http://localhost:8080/culture', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailConst, culture_name: name, soil_moisture: soil, ambient_temperature: temperature,  culture_type: selectedCategory, price: price, description: description }),
        });

        if (response.ok) {
            const successMsg = document.querySelector('.success-message');
            successMsg.style.display = 'block';
        } else {
            const data = await response.json();
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
    
    form1.reset();
    form2.reset();
});
