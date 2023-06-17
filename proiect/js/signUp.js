const form = document.getElementById('login-form');
form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = form.email.value;
    const password = form.password.value;
    const name=form.name.value;
    const username=form.username.value;

    try {
      const response = await fetch('http://localhost:8080/signup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, username }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userEmail', email);
        if (result.isAdmin) {
          // Redirect to admin page
          window.location.href = "admin.html";
        } else {
            window.location.href="index.html";
        }
      } else {
        // Incorrect credentials
        alert('Incorrect email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error executing login request', error);
    }
  });
