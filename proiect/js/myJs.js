  let navbar = document.querySelector('.navbar');
  let searchForm = document.querySelector('.search-form');
  let cartItem = document.querySelector('.cart-items-container');
  let accountInfo = document.getElementById('account-info');
  

  window.onscroll = () => {
    navbar.classList.remove('active');
    searchForm.classList.remove('active');
    cartItem.classList.remove('active');
  };

  const form = document.getElementById('login-form');

  form.addEventListener('submit', async function(event) {
    //daca nu esti logat nu poti accesa site ul 
    /*
    const token = localStorage.getItem("token");
    if(token === null){
      window.location.href = 'index.html'; //login/sign up
      return;
  }*/
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
          window.location.href="home.html";
        }
      } else {
        // Incorrect credentials
        alert('Incorrect email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error executing login request', error);
    }
  });
