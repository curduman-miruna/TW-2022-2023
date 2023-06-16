const infoBox = document.getElementById('infoBox');
const editButton = document.getElementById('edit-button');
let emailConst=null;

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
      emailConst=user.email;
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

const editPage = document.getElementById('edit-page');
editButton.addEventListener('click', function (event) {
  event.preventDefault();
  infoBox.style.display = 'none';
  editPage.style.display = 'block';
});

const editInfo = document.getElementById('edit-info');
editInfo.addEventListener('click', async function (event) {
  event.preventDefault();
  const usernameInput = document.querySelector('input[name="username"]');
  const usernameValue = usernameInput.value;
  const nameInput = document.querySelector('input[name="name"]');
  const nameValue = nameInput.value;
  const passwordInput = document.querySelector('input[name="password"]');
  const passwordValue = passwordInput.value;
  console.log(usernameValue);

  try {
    const response = await fetch('http://localhost:8080/editUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailConst, passwordValue, nameValue, usernameValue })
    });

    if (response.ok) {
      const successMessage = document.getElementById('success-message');
      successMessage.style.display = 'block';

    } else {
      console.error('Failed to fetch user info:', response.status);
    }
  } catch (error) {
    console.error('Error executing login request', error);
  }
});
