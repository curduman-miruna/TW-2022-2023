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
        const editButton = document.createElement('div');
        editButton.innerText = 'Edit';
        editButton.classList.add('btn');

        const deleteButton = document.createElement('div');
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('btn');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td></td>
            <td></td>
          `;
        const editCell = row.querySelector('td:nth-child(5)');
        editCell.appendChild(editButton);

        // Adaugă butonul de ștergere în celula corespunzătoare
        const deleteCell = row.querySelector('td:nth-child(6)');
        deleteCell.appendChild(deleteButton);
        tableBody.appendChild(row);
      });
    } else {
      // Incorrect credentials
      alert('Incorrect email or password. Please try again.');

    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

fetchUsers();