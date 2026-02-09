// Validation functions
function validateEmail(email) {
  return email.includes('@') && email.includes('.com');
}

function validatePassword(password) {
  return password.length >= 6 && /\d/.test(password);
}

function validateName(name) {
  return name.length > 0 && /^[A-Z]/.test(name) && /^[a-zA-Z\s]+$/.test(name);
}

// Display message function
function showMessage(selector, message) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = message;
    element.style.display = 'block';
  }
}

function hideMessage(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.style.display = 'none';
  }
}

// Registration handler
function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('username')?.value?.trim() || '';
  const email = document.getElementById('email')?.value?.trim() || '';
  const password = document.getElementById('password')?.value || '';
  const confirmPassword = document.getElementById('confirm-password')?.value || '';

  // Clear previous messages
  hideMessage('.error-message');
  hideMessage('.success-message');

  // Validation checks
  if (!name || !email || !password || !confirmPassword) {
    showMessage('.error-message', 'Please fill in all fields.');
    return;
  }

  if (!validateName(name)) {
    showMessage('.error-message', 'Name must start with a capital letter and contain only letters.');
    return;
  }

  if (!validateEmail(email)) {
    showMessage('.error-message', 'Email must contain @ and .com');
    return;
  }

  if (!validatePassword(password)) {
    showMessage('.error-message', 'Password must be at least 6 characters and include at least 1 digit.');
    return;
  }

  if (password !== confirmPassword) {
    showMessage('.error-message', 'Passwords do not match.');
    return;
  }

  // Check if user already exists
  const existingUsers = JSON.parse(localStorage.getItem('users') || '{}');
  if (existingUsers[email]) {
    showMessage('.error-message', 'Email already registered.');
    return;
  }

  // Register user
  existingUsers[email] = {
    name: name,
    password: password,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('users', JSON.stringify(existingUsers));

  showMessage('.success-message', 'Registration successful! Redirecting to login...');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

// Login handler
function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('username')?.value?.trim() || '';
  const password = document.getElementById('password')?.value || '';

  // Clear previous messages
  hideMessage('.error-message');
  hideMessage('.success-message');

  // Validation checks
  if (!email || !password) {
    showMessage('.error-message', 'Please enter email and password.');
    return;
  }

  if (!validateEmail(email)) {
    showMessage('.error-message', 'Email must contain @ and .com');
    return;
  }

  if (!validatePassword(password)) {
    showMessage('.error-message', 'Password must be at least 6 characters and include at least 1 digit.');
    return;
  }

  // Check credentials
  const existingUsers = JSON.parse(localStorage.getItem('users') || '{}');
  
  if (!existingUsers[email]) {
    showMessage('.error-message', 'Email not found. Please register first.');
    return;
  }

  if (existingUsers[email].password !== password) {
    showMessage('.error-message', 'Incorrect password.');
    return;
  }

  // Successful login
  localStorage.setItem('currentUser', email);
  showMessage('.success-message', 'Login successful! Redirecting...');
  setTimeout(() => {
    window.location.href = 'home.html';
  }, 1500);
}

// Initialize event listeners
function init() {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
  }

  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) {
    registerBtn.addEventListener('click', handleRegister);
  }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
