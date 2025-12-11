/**
 * This script handles all modal interactions on the main menu.
 * It uses data-attributes to decouple the JavaScript from the HTML.
 */

// Wait for the DOM to be fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- Reusable Modal Functions (High Cohesion) ---
    // These functions are generic and can operate on *any* modal.

    /**
     * Opens a modal dialog.
     * @param {HTMLElement} modal - The modal element to show.
     */
    function openModal(modal) {
        if (modal) {
            modal.classList.add('active'); // We use a class to show the modal
        }
    }

    /**
     * Closes a modal dialog.
     * @param {HTMLElement} modal - The modal element to hide.
     */
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // --- Event Listener Setup (Low Coupling) ---
    // This section finds all interactive elements by their data-attributes
    // and attaches the correct behavior.

    /**
     * Finds all buttons with [data-modal-target] and attaches open listeners.
     */
    function initModalTriggers() {
        const modalTriggers = document.querySelectorAll('[data-modal-target]');
        
        modalTriggers.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal-target');
                const modal = document.getElementById(modalId);
                openModal(modal);
            });
        });
    }

    /**
     * Finds all buttons with [data-modal-close] and attaches close listeners.
     */
    function initModalCloseButtons() {
        const closeButtons = document.querySelectorAll('[data-modal-close]');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Find the closest parent modal and close it
                const modal = button.closest('.modal-backdrop');
                closeModal(modal);
            });
        });
    }

    /**
     * Adds listeners to all modal backdrops to close them when clicked.
     */
    function initBackdropClicks() {
        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
        
        modalBackdrops.forEach(backdrop => {
            backdrop.addEventListener('click', (event) => {
                // Only close if the user clicked the backdrop itself,
                // not the content window inside it.
                if (event.target === backdrop) {
                    closeModal(backdrop);
                }
            });
        });
    }


    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Call the backend to destroy session
            fetch('backend/logout.php')
                .then(response => {
                    // Redirect to login page regardless of response
                    window.location.href = 'index.php';
                })
                .catch(error => {
                    console.error('Logout error:', error);
                    window.location.href = 'index.php';
                });
        });
    }

    // --- Initialize All Behaviors ---
    initModalTriggers();
    initModalCloseButtons();
    initBackdropClicks();
});