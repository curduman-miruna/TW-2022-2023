const infoBox = document.getElementById('infoBox');


async function fetchUserInfo() {
  try {
    const response = await fetch('http://localhost:8080/userInfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const user = await response.json();
    console.log(user.name);
    const username = document.createElement('h2');
    infoBox.appendChild(username);
    username.setAttribute('user-username', user.username);

    const name = document.createElement('p');
    infoBox.appendChild(name);
    name.setAttribute('user-name', user.name);

    const eMail = document.createElement('p');
    infoBox.appendChild(eMail);
    eMail.setAttribute('user-email', user.email);

    const password = document.createElement('p');
    infoBox.appendChild(password);
    password.setAttribute('user-password', user.password);
  } catch (error) {
    console.error('Error executing login request', error);
  }
}

fetchUserInfo(); // Call the async function to fetch user info





/*
async function loadProfile() {
    const token = localStorage.getItem('token');
    const Email = getEmailFromJWT(token);
    const response = await fetch("http://16.16.174.129:8080/api/userByEmail/", {
        method: "POST",
        headers:{
            'Content-Type': 'text/plain',
            'Authorization': `Bearer ${token}`
        },
        body: Email
    });
    const data = await response.json();
    fullName.innerHTML = "";
    userName.innerHTML = "";
    email.innerHTML = "";
    address.innerHTML = "";

    fullName.innerHTML = data.name;
    userName.innerHTML = data.username;
    email.innerHTML = data.email;
    address.innerHTML = data.location;
}*/
