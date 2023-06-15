document.addEventListener('DOMContentLoaded', function() {
  let navbar = document.querySelector('.navbar');
  let searchForm = document.querySelector('.search-form');
  let cartItem = document.querySelector('.cart-items-container');
  let accountInfo = document.getElementById('account-info');

  document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
  };

  const accountIcon = document.getElementById('account');

  accountIcon.addEventListener('click', function() {
    window.location.href = 'account.html';
  });

  document.querySelector('#cart-btn').onclick = () => {
    cartItem.classList.toggle('active');
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
  };

  window.onscroll = () => {
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
  };

  const form = document.getElementById('login-form');

  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('token', result.token);
        if (result.isAdmin) {
          // Redirect to admin page
          window.location.href = "admin.html";
        } else {
          accountInfo.style.display = 'block';
          form.style.display = 'none';
        }
      } else {
        // Incorrect credentials
        alert('Incorrect email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error executing login request', error);
    }
  });
});
