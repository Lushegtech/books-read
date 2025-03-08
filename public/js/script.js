document.addEventListener('DOMContentLoaded', function() {
    // Initialize Material UI components
    M.AutoInit();

    // Enhanced select initialization
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

    // Initialize floating action buttons
    var fabElems = document.querySelectorAll('.fixed-action-btn');
    M.FloatingActionButton.init(fabElems);

    // Delete confirmation with Material toast
    document.querySelectorAll('.delete-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this book?')) {
                this.submit();
                M.toast({html: 'Book deleted successfully'});
            }
        });
    });

    // Form validation with Material UI styling
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                M.toast({html: 'Please fill in all required fields', classes: 'red'});
            } else {
                M.toast({html: 'Processing...', classes: 'blue'});
            }
        });
    });

    // Form submission handling
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.classList.add('loading');
                submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${submitButton.innerText}`;
            }
        });
    });

    // Rating interaction
    document.querySelectorAll('.rating input[type="number"]').forEach(input => {
        input.addEventListener('input', function() {
            this.style.backgroundSize = `${(this.value * 20)}% 100%`;
        });
    });

    // Sorting interaction
    document.getElementById('sort-select')?.addEventListener('change', function() {
        const form = this.closest('form');
        const currentSort = this.value;
        const currentDirection = form.querySelector('input[name="direction"]').value;
        
        // Show loading state
        const container = document.querySelector('.book-grid');
        if (container) {
            container.style.opacity = '0.6';
            container.style.pointerEvents = 'none';
        }
        
        // Submit form
        form.submit();
    });

    // Modern form interactions
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        // Add placeholder for label animation
        input.setAttribute('placeholder', ' ');
        
        // Add focus animation
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Enhanced rating interaction
    document.querySelectorAll('.rating input[type="number"]').forEach(input => {
        const stars = Array.from({ length: 5 }, (_, i) => {
            const star = document.createElement('span');
            star.className = 'star';
            star.innerHTML = '★';
            star.dataset.value = i + 1;
            return star;
        });
        
        const container = document.createElement('div');
        container.className = 'stars-container';
        stars.forEach(star => container.appendChild(star));
        
        input.parentElement.appendChild(container);
        
        stars.forEach(star => {
            star.addEventListener('click', () => {
                input.value = star.dataset.value;
                updateStars();
            });
            
            star.addEventListener('mouseover', () => {
                stars
                    .slice(0, star.dataset.value)
                    .forEach(s => s.classList.add('hover'));
            });
            
            star.addEventListener('mouseout', () => {
                stars.forEach(s => s.classList.remove('hover'));
            });
        });
        
        function updateStars() {
            stars.forEach(star => {
                star.classList.toggle('filled', star.dataset.value <= input.value);
            });
        }
        
        updateStars();
    });

    // Book card hover effects
    document.querySelectorAll('.book-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Material ripple effect
    document.querySelectorAll('.btn, .btn-floating').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    // Consistent form validation feedback
    document.querySelectorAll('form').forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            const wrapper = input.closest('.input-field');
            
            input.addEventListener('focus', () => {
                wrapper.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                wrapper.classList.remove('focused');
                validateInput(input);
            });
            
            input.addEventListener('input', () => {
                validateInput(input);
            });
        });
    });
    
    function validateInput(input) {
        const wrapper = input.closest('.input-field');
        const errorMessage = wrapper.querySelector('.error-message');
        
        if (input.validity.valid) {
            wrapper.classList.remove('invalid');
            if (errorMessage) errorMessage.remove();
        } else {
            wrapper.classList.add('invalid');
            if (!errorMessage) {
                const message = document.createElement('span');
                message.className = 'error-message';
                message.textContent = input.validationMessage;
                wrapper.appendChild(message);
            }
        }
    }
});