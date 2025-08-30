const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

function checkLogin() {
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (username === 'admin' && password === 'admin123') {
    // Redirect to the next page after correct login
    window.location.href = 'ADMIN FULL.html'; // change to your page
  }
}

// Auto-check while typing
usernameInput.addEventListener('input', checkLogin);
passwordInput.addEventListener('input', checkLogin);
