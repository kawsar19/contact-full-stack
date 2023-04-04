// select the ul element
const ul = document.querySelector('ul');
let loader= document.querySelector('.loader')

// fetch data from API endpoint
fetch('https://personal-back.vercel.app/contacts')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // loop through the data and create a list item for each contact
   loader.style.display='none'
    for (let contact of data) {
      // create HTML elements for each contact info
      const li = document.createElement('li');
      const leftDiv = document.createElement('div');
      const rightDiv = document.createElement('div');
      const nameSpan = document.createElement('span');
      const phoneSpan = document.createElement('span');
      const callSpan = document.createElement('span');
      const editSpan = document.createElement('span');
      const deleteSpan = document.createElement('span');

      // set contact info as text content of the HTML elements
      nameSpan.textContent = contact.name;
      phoneSpan.textContent = contact.phoneNumber;
      callSpan.textContent = '';
      editSpan.textContent = '';
      deleteSpan.textContent = '';
      callSpan.onclick = function() {
        window.location.href = `tel:${contact.phoneNumber}`;
      };

      // Add onclick function for edit button
      editSpan.onclick = function() {
        openEditModal(contact);
      };

      // Add onclick function for delete button
      deleteSpan.onclick = function() {
        const confirmed = window.confirm(`Are you sure you want to delete ${contact.name}?`);
        if (confirmed) {
          fetch(`https://personal-back.vercel.app/contacts/${contact._id}`, {
              method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
              console.log('Contact deleted:', data);
              window.location.reload();
            })
            .catch(error => {
              console.error('Error deleting contact:', error);
            });
        }
      };


      // add CSS classes to the HTML elements
      li.classList.add('contact-item');
      leftDiv.classList.add('left');
      rightDiv.classList.add('right');
      callSpan.classList.add('call');
      editSpan.classList.add('edit');
      deleteSpan.classList.add('delete');

      // append the HTML elements to the list item
      leftDiv.appendChild(nameSpan);
      leftDiv.appendChild(phoneSpan);
      rightDiv.appendChild(callSpan);
      rightDiv.appendChild(editSpan);
      rightDiv.appendChild(deleteSpan);
      li.appendChild(leftDiv);
      li.appendChild(rightDiv);

      // append the list item to the ul element
      ul.appendChild(li);
    }
  })
  .catch(error => console.log(error));








const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.close-modal-btn');
const form = document.querySelector('form');

function openModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

window.addEventListener('click', function(event) {
  if (event.target === modal) {
    closeModal();
  }
});

form.addEventListener('submit', function(event) {
  event.preventDefault()
  const nameInput = document.querySelector('#name');
  const phoneInput = document.querySelector('#phone');

  fetch('https://personal-back.vercel.app/contacts', {
      method: 'POST',
      body: JSON.stringify({
        name: nameInput.value,
        phoneNumber: phoneInput.value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Contact created:', data);
      nameInput.value = '';
      phoneInput.value = '';
      closeModal();
      window.location.reload()
    })
    .catch(error => {
      console.error('Error creating contact:', error);
    });
});









function openEditModal(contact) {
  const editModal = document.getElementById('editModal');
  const closeModalBtn = editModal.querySelector('.close-modal-btn');
  const saveEditBtn = editModal.querySelector('.save-edit-btn');
  const editNameInput = editModal.querySelector('#edit-name');
  const editPhoneInput = editModal.querySelector('#edit-phone');

  // set the inputs' values to the current contact's name and phone number
  editNameInput.value = contact.name // get current name value from contact item with given id
  editPhoneInput.value = contact.phoneNumber // get current phone value from contact item with given id

  // show the modal
  editModal.style.display = 'block';

  // add event listener for the close button
  closeModalBtn.addEventListener('click', function() {
    editModal.style.display = 'none';
  });


  // add event listener for the save button
  saveEditBtn.addEventListener('click', function(e) {
    e.preventDefault()
    
    // fetch PUT request to update the contact info in the server
    fetch(`https://personal-back.vercel.app/contacts/${contact._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editNameInput.value,
          phoneNumber: editPhoneInput.value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('Contact updated:', data);
        editModal.style.display = 'none';
        window.location.reload();
      })
      .catch(error => {
        console.error('Error updating contact:', error);
      });
  });
}