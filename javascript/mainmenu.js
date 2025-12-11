
document.addEventListener('DOMContentLoaded', () => {

 
    function openModal(modal) {
        if (modal) {
            modal.classList.add('active');
        }
    }

    
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
    }

  
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

   
    function initModalCloseButtons() {
        const closeButtons = document.querySelectorAll('[data-modal-close]');
        
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal-backdrop');
                closeModal(modal);
            });
        });
    }

    
    function initBackdropClicks() {
        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
        
        modalBackdrops.forEach(backdrop => {
            backdrop.addEventListener('click', (event) => {
              
                if (event.target === backdrop) {
                    closeModal(backdrop);
                }
            });
        });
    }


    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          
            fetch('../backend/logout.php')
                .then(response => {
                    
                    window.location.href = 'index.php';
                })
                .catch(error => {
                    console.error('Logout error:', error);
                    window.location.href = 'index.php';
                });
        });
    }

   
    initModalTriggers();
    initModalCloseButtons();
    initBackdropClicks();
});