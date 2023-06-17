async function fetchUsers() {
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const users = await response.json();
      if (response.ok) {
        const tableBody = document.querySelector('#users-table tbody');
        tableBody.innerHTML = ''; // Curăță conținutul anterior al tabelei
  
        users.forEach((user) => {
            console.log(user.name);
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
          `;
          tableBody.appendChild(row);
        });
      }else{
            // Incorrect credentials
            alert('Incorrect email or password. Please try again.');
          
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  
 fetchUsers();