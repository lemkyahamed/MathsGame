
const AuthFormController = {
    
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

    
    init: function() {
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

        
        this.toggleLink.addEventListener('click', this.toggleForm.bind(this));
        this.loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        this.signupForm.addEventListener('submit', this.handleSignUpSubmit.bind(this));
    },

   
    toggleForm: function() {
        this.clearNotification(); 
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

   
    handleLoginSubmit: async function(event) {
        event.preventDefault(); 
        this.clearNotification();
        this.setLoading(this.loginButton, true);

      
        const email = this.loginEmailInput.value;
        const password = this.loginPasswordInput.value;

  
        const postData = {
            email: email,
            password: password
        };

        try {
       
            const response = await fetch('../backend/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();

           
            if (response.ok && data.status === 'success') {
                this.showNotification(data.data.message || 'Login successful! Redirecting...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'mainmanu.php'; 
                }, 1000);
            } else {
                
                this.showNotification(data.message || 'An unknown error occurred.', 'error');
                this.setLoading(this.loginButton, false);
            }

        } catch (error) {
            console.error('Login fetch error:', error);
            this.showNotification('Could not connect to the server.', 'error');
            this.setLoading(this.loginButton, false);
        }
    },


    handleSignUpSubmit: async function(event) {
        event.preventDefault();
        this.clearNotification();
        this.setLoading(this.signupButton, true);

        const username = this.signupUsernameInput.value;
        const email = this.signupEmailInput.value;
        const password = this.signupPasswordInput.value;

        const postData = {
            username: username,
            email: email,
            password: password
        };

        try {
            const response = await fetch('../backend/signup.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                this.showNotification('Account created! Please log in.', 'success');
                this.toggleForm();
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

    
    showNotification: function(message, type) {
        const el = this.notificationElement;
        el.textContent = message;
        el.className = `notification ${type}`; 
    },

    
    clearNotification: function() {
        const el = this.notificationElement;
        el.textContent = '';
        el.className = 'notification'; 
    },

    
    setLoading: function(button, isLoading) {
        if (button) {
            button.disabled = isLoading;
            
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    AuthFormController.init();
});