
const AuthFormController = {
    
    // --- 1. Properties (Cached View Elements) ---
    loginSection: null,
    signupSection: null,
    toggleLink: null,
    toggleMessage: null,
    formTitle: null,
    loginForm: null,
    signupForm: null,
    
    // Form inputs
    loginEmailInput: null,
    loginPasswordInput: null,
    signupUsernameInput: null,
    signupEmailInput: null,
    signupPasswordInput: null,

    // Buttons
    loginButton: null,
    signupButton: null,

    // Notification element
    notificationElement: null,

    /**
     * Initializes the controller.
     */
    init: function() {
        // --- 2. Cache DOM Elements ---
        this.loginSection = document.getElementById('login-section');
        this.signupSection = document.getElementById('signup-section');
        this.toggleLink = document.getElementById('toggle-link');
        this.toggleMessage = document.getElementById('toggle-message');
        this.formTitle = document.getElementById('form-title');
        this.loginForm = document.getElementById('login-section');
        this.signupForm = document.getElementById('signup-section');
        
        this.loginEmailInput = document.getElementById('login-email');
        this.loginPasswordInput = document.getElementById('login-password');
        this.signupUsernameInput = document.getElementById('signup-username');
        this.signupEmailInput = document.getElementById('signup-email');
        this.signupPasswordInput = document.getElementById('signup-password');

        this.loginButton = document.getElementById('login-button');
        this.signupButton = document.getElementById('signup-button');

        this.notificationElement = document.getElementById('auth-notification');
        
        // Safety check
        if (!this.toggleLink || !this.loginForm || !this.signupForm) {
            console.error('Auth Form UI elements not found. Initialization failed.');
            return;
        }

        // --- 3. Bind Event Listeners ---
        this.toggleLink.addEventListener('click', this.toggleForm.bind(this));
        this.loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        this.signupForm.addEventListener('submit', this.handleSignUpSubmit.bind(this));
    },

    /**
     * Toggles the view between the login and sign-up forms.
     */
    toggleForm: function() {
        this.clearNotification(); // Clear any error messages
        if (this.loginSection.classList.contains('active')) {
            // Switch to Sign Up
            this.loginSection.classList.remove('active');
            this.signupSection.classList.add('active');
            this.toggleLink.textContent = 'Log in here';
            this.toggleMessage.textContent = 'Already have an account?';
            this.formTitle.textContent = 'Join the Challenge!';
        } else {
            // Switch to Login
            this.signupSection.classList.remove('active');
            this.loginSection.classList.add('active');
            this.toggleLink.textContent = 'Create an account';
            this.toggleMessage.textContent = 'New Player?';
            this.formTitle.textContent = 'The Math Challenge';
        }
    },

    /**
     * Handles the submission of the login form.
     * Uses async/await for cleaner fetch logic.
     */
    handleLoginSubmit: async function(event) {
        event.preventDefault(); 
        this.clearNotification();
        this.setLoading(this.loginButton, true);

        // 1. Get data from form
        const email = this.loginEmailInput.value;
        const password = this.loginPasswordInput.value;

        // 2. Prepare data for backend
        const postData = {
            email: email,
            password: password
        };

        try {
            // 3. Send data to backend/login.php
            const response = await fetch('backend/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();

            // 4. Handle response
            if (response.ok && data.status === 'success') {
                this.showNotification(data.data.message || 'Login successful! Redirecting...', 'success');
                // Redirect to the game page on success
                setTimeout(() => {
                    window.location.href = 'mainmanu.html'; // Or dashboard.php, etc.
                }, 1000);
            } else {
                // Show error message from backend
                this.showNotification(data.message || 'An unknown error occurred.', 'error');
                this.setLoading(this.loginButton, false);
            }

        } catch (error) {
            console.error('Login fetch error:', error);
            this.showNotification('Could not connect to the server.', 'error');
            this.setLoading(this.loginButton, false);
        }
    },

    /**
     * Handles the submission of the sign-up form.
     */
    handleSignUpSubmit: async function(event) {
        event.preventDefault();
        this.clearNotification();
        this.setLoading(this.signupButton, true);

        // 1. Get data from form
        const username = this.signupUsernameInput.value;
        const email = this.signupEmailInput.value;
        const password = this.signupPasswordInput.value;

        // 2. Prepare data
        const postData = {
            username: username,
            email: email,
            password: password
        };

        try {
            // 3. Send data to backend/signup.php
            const response = await fetch('backend/signup.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();

            // 4. Handle response
            if (response.ok && data.status === 'success') {
                this.showNotification('Account created! Please log in.', 'success');
                // Toggle back to the login form
                this.toggleForm();
                // Clear signup form for privacy
                this.signupForm.reset();
            } else {
                this.showNotification(data.message || 'An unknown error occurred.', 'error');
            }

        } catch (error) {
            console.error('Sign up fetch error:', error);
            this.showNotification('Could not connect to the server.', 'error');
        } finally {
            this.setLoading(this.signupButton, false);
        }
    },

    /**
     * Shows a notification message in the UI.
     * @param {string} message The message to display.
     * @param {'success'|'error'} type The type of notification.
     */
    showNotification: function(message, type) {
        const el = this.notificationElement;
        el.textContent = message;
        el.className = `notification ${type}`; // e.g., "notification success"
    },

    /**
     * Clears any active notification.
     */
    clearNotification: function() {
        const el = this.notificationElement;
        el.textContent = '';
        el.className = 'notification'; // Removes .success or .error
    },

    /**
     * Sets the loading state of a button (disables it).
     * @param {HTMLButtonElement} button The button element.
     * @param {boolean} isLoading Whether to set to loading or not.
     */
    setLoading: function(button, isLoading) {
        if (button) {
            button.disabled = isLoading;
            // You could also change button text, e.g., "Loading..."
        }
    }
};

// --- 4. Application Entry Point ---
document.addEventListener('DOMContentLoaded', function() {
    AuthFormController.init();
});