// Simple password show/hide
  const passwordInput = document.getElementById('password-input');
  const passwordToggle = document.getElementById('password-toggle');

  if (passwordInput && passwordToggle) {
    passwordToggle.addEventListener('click', () => {
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      passwordToggle.textContent = isHidden ? 'Hide' : 'Show';
    });
  }