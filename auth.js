  // Check for remembered login
    function checkRememberedLogin() {
      const remembered = localStorage.getItem('ceylon_remembered');
      if (remembered) {
        const userData = JSON.parse(remembered);
        document.getElementById('loginEmail').value = userData.email;
        document.getElementById('rememberMe').checked = true;
      }
    }

    // Check if already logged in
    function checkExistingAuth() {
      if (isAuthenticated()) {
        const user = getCurrentUser();
        if (user) {
          // Already logged in, redirect to home
          window.location.href = 'home.html';
        }
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
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
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
        try {
          // Disable submit button
          const submitBtn = document.querySelector('#loginForm button[type="submit"]');
          submitBtn.disabled = true;
          submitBtn.textContent = 'Logging in...';

          const response = await authAPI.login(email, password);
          
          if (response.success) {
            showToast('Login successful! Redirecting... 🎉', 'success');
            
            // Save remember me
            if (remember) {
              localStorage.setItem('ceylon_remembered', JSON.stringify({ email }));
            } else {
              localStorage.removeItem('ceylon_remembered');
            }
            
            // Redirect to home.html
            setTimeout(() => {
              window.location.href = 'home.html';
            }, 1500);
          } else {
            showToast(response.message || 'Login failed', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
          }
        } catch (error) {
          showToast(error.message || 'Login failed. Please try again.', 'error');
          const submitBtn = document.querySelector('#loginForm button[type="submit"]');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Login';
        }
      }
    });

    // Signup Form - Modified to switch to login after account creation
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
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
        try {
          // Disable submit button
          const submitBtn = document.querySelector('#signupForm button[type="submit"]');
          submitBtn.disabled = true;
          submitBtn.textContent = 'Creating account...';

          const response = await authAPI.signup({ username, email, phone, password });
          
          if (response.success) {
            showToast('Account created! Please login to continue', 'success');
            
            // Clear signup form
            document.getElementById('signupForm').reset();
            
            // Switch to login tab after 1.5 seconds
            setTimeout(() => {
              switchTab('login');
              // Pre-fill email in login form
              document.getElementById('loginEmail').value = email;
              submitBtn.disabled = false;
              submitBtn.textContent = 'Sign Up';
            }, 1500);
          } else {
            // Show error message
            const errorMessage = response.message || 'Signup failed';
            if (errorMessage.includes('Email already registered')) {
              showError('signupEmail', 'Email already registered');
            } else {
              showToast(errorMessage, 'error');
            }
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign Up';
          }
        } catch (error) {
          showToast(error.message || 'Signup failed. Please try again.', 'error');
          const submitBtn = document.querySelector('#signupForm button[type="submit"]');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign Up';
        }
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
    checkExistingAuth();
    checkRememberedLogin();