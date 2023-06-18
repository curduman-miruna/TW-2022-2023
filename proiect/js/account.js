let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    favoriteItem.classList.remove('active');
}
const infoBox = document.getElementById('infoBox');
const editButton = document.getElementById('edit-button');
const emailConst = localStorage.getItem('userEmail');

async function fetchUserInfo() {
  let token = localStorage.getItem('token');
  console.log(token);

  if (token === null) {
      window.location.href = 'index.html'; 
      return;
  }
  try {
    const emailConst = localStorage.getItem('userEmail');

    const response = await fetch(`http://localhost:8080/userInfo?email=${encodeURIComponent(emailConst)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const user = await response.json();
      console.log(user.name);

      const username = document.createElement('h2');
      username.textContent = 'Hello, ' + user.username;
      infoBox.appendChild(username);

      const name = document.createElement('p');
      name.textContent = 'Name: ' + user.name;
      infoBox.appendChild(name);

      const email = document.createElement('p');
      email.textContent = 'Email: ' + user.email;
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

fetchUserInfo();
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
    const emailConst = localStorage.getItem('userEmail');

    const response = await fetch('http://localhost:8080/editUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: emailConst, password: passwordValue, name: nameValue, username: usernameValue })
    });

    if (response.ok) {
      const successMessage = document.getElementById('edit-message');
      successMessage.style.display = 'block';

    } else {
      console.error('Failed to fetch user info:', response.status);
    }
  } catch (error) {
    console.error('Error executing login request', error);
  }
});

const deleteUser = document.getElementById('delete-button');
deleteUser.addEventListener('click', async function(event) {
  event.preventDefault();
  try {
    const emailConst = localStorage.getItem('userEmail');
    //const requestData = { email: emailConst };
    console.log(emailConst);

    const response = await fetch(`http://localhost:8080/deleteUser`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },body: JSON.stringify({email: emailConst})
    });

    if (response.ok) {
      const successMessage = document.getElementById('delete-message');
      successMessage.style.display = 'block';
    } else {
      console.error('Failed to delete user:', response.status);
    }
  } catch (error) {
    console.error('Error executing delete request', error);
  }
});

