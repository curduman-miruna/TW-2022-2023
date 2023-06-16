const infoBox = document.getElementById('infoBox');
const editButton = document.getElementById('edit-button');


async function fetchUserInfo() {
  try {
    const response = await fetch('http://localhost:8080/userInfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const user = await response.json();
      console.log(user.name);

      const username = document.createElement('h2');
      username.textContent = 'Hello, ' + user.username;
      infoBox.appendChild(username);

      const name = document.createElement('p');
      name.textContent = 'name:     ' + user.name;
      infoBox.appendChild(name);

      const email = document.createElement('p');
      email.textContent = 'e-mail:     ' + user.email;
      infoBox.appendChild(email);

      const usernameInput = document.querySelector('input[name="username"]');
      const nameInput = document.querySelector('input[name="name"]');
      const passwordInput = document.querySelector('input[name="password"]');

      passwordInput.value = user.password;
      usernameInput.value = user.username;
      nameInput.value = user.name;

    } else {
      console.error('Failed to fetch user info:', response.status);
    }
  } catch (error) {
    console.error('Error executing login request', error);
  }
}

fetchUserInfo(); // Call the async function to fetch user info

const editPage=document.getElementById('edit-page');
editButton.addEventListener('click', function (event) {
  event.preventDefault();
  infoBox.style.display='none';
  editPage.style.display = 'block';
});

