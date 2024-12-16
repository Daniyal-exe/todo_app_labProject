import { ClassManager } from './classManager.mjs';

const classSearchInput = document.getElementById('class-search');
const searchButton = document.getElementById('search-button');
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const contentDiv = document.getElementById('content');
const classNameDisplay = document.getElementById('class-name');

const classManager = new ClassManager(contentDiv);

let selectedClass = null;

function searchClass() {
    const className = classSearchInput.value.trim();

    if (!className) {
        customAlert('Please enter a class name.');
        return;
    }

    selectedClass = className;
    classManager.addClass(className);
    classManager.showClassContent(className);

    todoInput.disabled = false;
    addButton.disabled = false;

    classNameDisplay.textContent = className;
    classNameDisplay.style.display = 'block';
}

function addTodo() {
    const text = todoInput.value.trim();
    if (!selectedClass) {
        customAlert('Please select or create a class first.');
    } else if (!text) {
        customAlert('Your text is empty. Please enter something to add.');
    } else {
        classManager.addTodoItem(selectedClass, text);
        todoInput.value = '';
    }
}

function openEditModal(todoItem, callback) {
  const modal = document.getElementById('edit-modal');
  const editInput = document.getElementById('edit-input');
  const saveButton = document.getElementById('save-edit');
  const cancelButton = document.getElementById('cancel-edit');

  editInput.value = todoItem.textContent;
  modal.style.display = 'block';

  saveButton.onclick = function() {
      const newText = editInput.value.trim();
      if (newText) {
          const todoId = todoItem.dataset.todoId;
          classManager.updateTodoItem(todoId, selectedClass, newText);
          modal.style.display = 'none';
      } else {
          customAlert('Todo cannot be empty!');
      }
  };

  cancelButton.onclick = function() {
      modal.style.display = 'none';
  };

  window.onclick = function(event) {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  };
}

searchButton.addEventListener('click', searchClass);
addButton.addEventListener('click', addTodo);

classSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchClass();
    }
});

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

contentDiv.addEventListener('click', function(event) {
    // Only proceed if clicking on buttons or icons
    if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'I') {
        return;
    }

    // Don't do anything for delete button (it has its own handler)
    if (event.target.classList.contains('delete-btn') || 
        event.target.closest('.delete-btn')) {
        return;
    }

    // Handle edit button click
    if (event.target.classList.contains('edit-btn') || 
        event.target.closest('.edit-btn')) {
        const li = event.target.closest('li');
        if (li) {
            const todoId = li.dataset.todoId;
            const currentText = li.textContent;
            classManager.openEditModal(currentText, todoId, selectedClass, function(newText) {
                li.textContent = newText;
            });
        }
    }
});

function customAlert(message) {
    const modal = document.getElementById('custom-alert');
    const alertText = document.getElementById('alert-text');
    const closeButton = document.getElementById('close-alert');

    alertText.textContent = message;
    modal.style.display = 'block';

    closeButton.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

window.alert = customAlert;



// Show Login Modal by default
document.addEventListener('DOMContentLoaded', function() {
    // Modal Handling for Login and Signup
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    const signupButton = document.getElementById('signup-button');
    const logoutButton = document.getElementById('logout-button'); // Logout button
  
    // Get form inputs
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const signupName = document.getElementById('signup-name');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const loginButton = document.getElementById('login-button'); // Login button (moved inside DOMContentLoaded)
  
    // Show Login Modal by default
    function showLogin() {
      console.log('Showing login modal');
      loginModal.style.display = 'flex';
      signupModal.style.display = 'none';
      document.body.classList.add('modal-active'); // Add blur effect to background
    }
  
    // Show Signup Modal
    function showSignup() {
      signupModal.style.display = 'flex';
      loginModal.style.display = 'none';
      document.body.classList.add('modal-active'); // Add blur effect to background
    }
  
    // Hide Modal and remove blur effect
    function hideModals() {
      loginModal.style.display = 'none';
      signupModal.style.display = 'none';
      document.body.classList.remove('modal-active'); // Remove blur effect
    }
  
    // Check login status on page load
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn === 'true') {
      console.log('User is logged in');
      hideModals();  // Hide the modals
      logoutButton.style.display = 'block';  // Show logout button
    } else {
      console.log('User is not logged in');
      showLogin();  // Show login modal if not logged in
      logoutButton.style.display = 'none';  // Hide logout button
    }
  
    // Event Listeners for modal toggling
    showSignupLink.addEventListener('click', showSignup);
    showLoginLink.addEventListener('click', showLogin);
  
    // Function to display error messages
    function displayErrorMessage(modalId, message) {
      const errorMessageElement = document.getElementById(modalId + '-error');
      errorMessageElement.textContent = message;
      errorMessageElement.classList.add('show'); // Show the error message
    }
  
    // Clear error message
    function clearErrorMessage(modalId) {
      const errorMessageElement = document.getElementById(modalId + '-error');
      errorMessageElement.textContent = '';
      errorMessageElement.classList.remove('show'); // Hide the error message
    }
  
    // Handle Signup Button Click
    signupButton.addEventListener('click', function() {
      const name = signupName.value.trim();
      const email = signupEmail.value.trim();
      const password = signupPassword.value.trim();
  
      clearErrorMessage('signup'); // Clear any existing error messages before validation
  
      if (name && email && password) {
        fetch('http://localhost:3002/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message) {
              alert(data.message); // Success message
              showLogin(); // Switch to login modal
            } else {
              displayErrorMessage('signup', data.error || 'Sign-up failed.'); // Display error in modal
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            displayErrorMessage('signup', 'An error occurred during sign-up.'); // Display error in modal
          });
      } else {
        displayErrorMessage('signup', 'Please fill in all fields!'); // Display error in modal
      }
    });
  
    // Handle Login Button Click
    loginButton.addEventListener('click', function() {
      const email = loginEmail.value.trim();
      const password = loginPassword.value.trim();
  
      if (email && password) {
          fetch('http://localhost:3002/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
          })
          .then((response) => response.json())
          .then((data) => {
              console.log('Login response:', data); // Add this line
              if (data.message) {
                  alert('Login successful!');
                  localStorage.setItem('isLoggedIn', 'true');
                  localStorage.setItem('userId', data.userId);
                  console.log('After storing - userId:', localStorage.getItem('userId')); // Add this line
                  hideModals();
                  logoutButton.style.display = 'block';
              } else {
                  displayErrorMessage('login', data.error || 'Login failed.');
              }
          })
          .catch((error) => {
              console.error('Error:', error);
              displayErrorMessage('login', 'An error occurred during login.');
          });
      } else {
          displayErrorMessage('login', 'Please fill in all fields!');
      }
  });
  
    // Handle Logout Button Click
    logoutButton.addEventListener('click', function() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userId');
      console.log('User logged out');
      logoutButton.style.display = 'none';
      showLogin();
  });
  });
  