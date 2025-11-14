
    // User storage
    const users = {};

    // Load users from memory on page load
    function loadUsers() {
      const savedUsers = sessionStorage.getItem('ceylon_users');
      if (savedUsers) {
        Object.assign(users, JSON.parse(savedUsers));
      }
    }

    // Save users to session
    function saveUsers() {
      sessionStorage.setItem('ceylon_users', JSON.stringify(users));
    }

    // Check for remembered login
    function checkRememberedLogin() {
      const remembered = sessionStorage.getItem('ceylon_remembered');
      if (remembered) {
        const userData = JSON.parse(remembered);
        document.getElementById('loginEmail').value = userData.email;
        document.getElementById('rememberMe').checked = true;
      }
    }

    // Toast notification
    function showToast(message, type = 'success') {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.className = `toast show ${type}`;
      setTimeout(() => {
        toast.className = 'toast';
      }, 3000);
    }

    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        switchTab(target);
      });
    });

    document.querySelectorAll('.switch-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.dataset.target;
        switchTab(target);
      });
    });

    function switchTab(target) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.form-content').forEach(f => f.classList.remove('active'));
      
      document.querySelector(`.tab[data-tab="${target}"]`).classList.add('active');
      document.getElementById(`${target}-form`).classList.add('active');
    }

    // Validation helper
    function showError(fieldId, message) {
      const errorEl = document.getElementById(fieldId + 'Error');
      const inputEl = document.getElementById(fieldId);
      errorEl.textContent = message;
      errorEl.classList.add('show');
      inputEl.classList.add('error');
    }

    function clearError(fieldId) {
      const errorEl = document.getElementById(fieldId + 'Error');
      const inputEl = document.getElementById(fieldId);
      errorEl.textContent = '';
      errorEl.classList.remove('show');
      inputEl.classList.remove('error');
    }

    function clearAllErrors(formType) {
      if (formType === 'login') {
        clearError('loginEmail');
        clearError('loginPassword');
      } else {
        clearError('signupUsername');
        clearError('signupEmail');
        clearError('signupPhone');
        clearError('signupPassword');
      }
    }

    // Email validation
    function isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    // Phone validation
    function isValidPhone(phone) {
      const re = /^[+]?[\d\s-]{10,}$/;
      return re.test(phone);
    }

    // Login Form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors('login');

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const remember = document.getElementById('rememberMe').checked;
      
      let isValid = true;

      if (!email) {
        showError('loginEmail', 'Email is required');
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError('loginEmail', 'Please enter a valid email');
        isValid = false;
      }

      if (!password) {
        showError('loginPassword', 'Password is required');
        isValid = false;
      } else if (password.length < 6) {
        showError('loginPassword', 'Password must be at least 6 characters');
        isValid = false;
      }

      if (isValid) {
        // Check if user exists with correct credentials
        if (users[email] && users[email].password === password) {
          showToast('Login successful! Redirecting... 🎉', 'success');
          
          // Save remember me
          if (remember) {
            sessionStorage.setItem('ceylon_remembered', JSON.stringify({ email }));
          } else {
            sessionStorage.removeItem('ceylon_remembered');
          }

          // Save current session
          sessionStorage.setItem('ceylon_current_user', JSON.stringify(users[email]));
          
          // Redirect to index.html
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        } else {
          showToast('Invalid email or password', 'error');
        }
      }
    });

    // Signup Form - Modified to switch to login after account creation
    document.getElementById('signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors('signup');

      const username = document.getElementById('signupUsername').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const phone = document.getElementById('signupPhone').value.trim();
      const password = document.getElementById('signupPassword').value;
      const remember = document.getElementById('rememberSignup').checked;
      
      let isValid = true;

      if (!username) {
        showError('signupUsername', 'Username is required');
        isValid = false;
      } else if (username.length < 3) {
        showError('signupUsername', 'Username must be at least 3 characters');
        isValid = false;
      }

      if (!email) {
        showError('signupEmail', 'Email is required');
        isValid = false;
      } else if (!isValidEmail(email)) {
        showError('signupEmail', 'Please enter a valid email');
        isValid = false;
      } else if (users[email]) {
        showError('signupEmail', 'Email already registered');
        isValid = false;
      }

      if (!phone) {
        showError('signupPhone', 'Phone number is required');
        isValid = false;
      } else if (!isValidPhone(phone)) {
        showError('signupPhone', 'Please enter a valid phone number');
        isValid = false;
      }

      if (!password) {
        showError('signupPassword', 'Password is required');
        isValid = false;
      } else if (password.length < 6) {
        showError('signupPassword', 'Password must be at least 6 characters');
        isValid = false;
      }

      if (isValid) {
        // Create new user
        users[email] = {
          username,
          email,
          phone,
          password
        };
        
        saveUsers();
        showToast('Account created! Please login to continue', 'success');
        
        // Clear signup form
        document.getElementById('signupForm').reset();
        
        // Switch to login tab after 1.5 seconds
        setTimeout(() => {
          switchTab('login');
          // Pre-fill email in login form
          document.getElementById('loginEmail').value = email;
        }, 1500);
      }
    });

    // Clear errors on input
    document.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          clearError(input.id);
        }
      });
    });

    // Initialize
    loadUsers();
    checkRememberedLogin();
