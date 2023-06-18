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

        const editButton = document.createElement('div');
        editButton.innerText = 'Edit';
        editButton.classList.add('btn');

        const deleteButton = document.createElement('div');
        deleteButton.innerText = 'Delete';
        deleteButton.classList.add('btn');
        // Create table row
        const tr = document.createElement('tr');
        tr.setAttribute('data-id', user.id);

        // Create ID cell
        const idCell = document.createElement('td');
        idCell.textContent = user.id;
        tr.appendChild(idCell);

        // Create Username cell
        const usernameCell = document.createElement('td');
        usernameCell.textContent = user.username;
        tr.appendChild(usernameCell);

        // Create Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = user.name;
        tr.appendChild(nameCell);

        // Create Email cell
        const emailCell = document.createElement('td');
        emailCell.textContent = user.email;
        tr.appendChild(emailCell);

        // Create empty cells
        for (let i = 0; i < 2; i++) {
          const emptyCell = document.createElement('td');
          tr.appendChild(emptyCell);
        }

        // Append the row to the table
        tableBody.appendChild(tr);

        const editCell = tr.querySelector('td:nth-child(5)');
        editCell.appendChild(editButton);

        
        const deleteCell = tr.querySelector('td:nth-child(6)');
        deleteCell.appendChild(deleteButton);
        tableBody.appendChild(tr);

        editButton.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          const tr = editButton.parentNode.parentNode.parentNode;
          const cells = tr.querySelectorAll('td');
          if (editButton.textContent === 'Edit') {
            editButton.textContent = 'Save';
            editButton.classList.add('saveBtn');
            const emailIndex = 0;
            const idIndex = 1;
            cells.forEach((cell, index) => {
              if (index !== emailIndex && index !== idIndex && !cell.contains(editButton) && !cell.contains(deleteButton)) {
                cell.setAttribute('contenteditable', 'true');
                cell.classList.add('editable');
              }
            });
          } else {
            editButton.textContent = 'Edit';
            editButton.classList.remove('saveBtn');

            cells.forEach(cell => {
              cell.removeEventListener('click', () => { });
              cell.removeAttribute('contenteditable');
              cell.classList.remove('editable');
            });
            const emailAd = emailCell.textContent.trim();
            const nameAd = nameCell.textContent.trim();
            const usernameAd = usernameCell.textContent.trim();

            const response = fetch('http://localhost:8080/editUser', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: emailAd, password: user.password, name: nameAd, username: usernameAd })
            })
              .then(response => {
                if (response.ok) {
                  const successMsg = document.createElement('span');
                  successMsg.textContent = 'Changes saved!';
                  successMsg.classList.add('success');
                  editCell.appendChild(successMsg);

                  // remove success message after 3 seconds
                  setTimeout(() => {
                    successMsg.remove();
                  }, 3000);
                } else {
                  // display error message
                  const errorMsg = document.createElement('span');
                  errorMsg.textContent = 'Error saving changes.';
                  errorMsg.classList.add('error');
                  editCell.appendChild(errorMsg);
                }
                response.json()
              })
              .then(data => console.log(data))
              .catch(error => {
                const errorMsg = document.createElement('span');
                errorMsg.textContent = 'Error saving changes.';
                errorMsg.classList.add('error');
                editCell.appendChild(errorMsg);
                console.error(error);
              });
          }
        });

        deleteButton.addEventListener('click', event => {
          console.log("am apasat pe delete");
        
          event.preventDefault();
          event.stopPropagation();
          const emailAd = emailCell.textContent.trim();
          const confirmed = confirm('Are you sure you want to delete this user?');
          if (confirmed) {
            const row2 = deleteButton.parentNode.parentNode;
            fetch('http://localhost:8080/deleteUser', {
              method: 'DELETE',
              headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({email: emailAd})
            })
            .then(response => {
              if (response.ok) {
                row2.remove();
              } else {
                const errorMsg = document.createElement('span');
                errorMsg.textContent = 'Error deleting user.';
                errorMsg.classList.add('error');
                editCell.appendChild(errorMsg);
              }

            }).catch(error => {
              const errorMsg = document.createElement('span');
              errorMsg.textContent = 'Error deleting user.';
              errorMsg.classList.add('error');
              editCell.appendChild(errorMsg);
            });
        }
        });




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