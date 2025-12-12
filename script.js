// Modern JavaScript for Caronexx Caroche Website

// Global add to cart function
function addToCart(button) {
    const card = button.closest('.product-card');
    const productName = card.querySelector('h3').textContent.trim();
    
    // Robust price extraction
    const priceElement = card.querySelector('p');
    let productPrice = priceElement.textContent.trim();
    
    // Remove currency symbol and any non-numeric characters except decimal point
    productPrice = productPrice.replace(/[₵$,\s]/g, '');
    
    // Convert to float, ensure it's a valid number
    const numericPrice = parseFloat(productPrice);
    
    if (isNaN(numericPrice) || numericPrice <= 0) {
        console.error('Invalid price detected:', productPrice);
        showNotification('Error: Invalid product price', 'error');
        return;
    }
    
    const productImg = card.querySelector('img').src;
    
    // Create cart item
    const cartItem = {
        id: Date.now(),
        name: productName,
        price: numericPrice,
        image: productImg,
        quantity: 1
    };
    
    // Add visual feedback
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    
    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartItem);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Reset button after delay
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        button.style.background = '';
    }, 2000);
    
    // Show success notification
    showNotification(`${productName} added to cart!`, 'success');
}

// Global update cart count function
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update navigation cart count
    const cartLink = document.querySelector('a[href="cart.html"]');
    if (cartLink) {
        const existingCount = cartLink.querySelector('.cart-count');
        if (existingCount) {
            existingCount.textContent = cartCount;
        } else {
            const countBadge = document.createElement('span');
            countBadge.className = 'cart-count';
            countBadge.style.cssText = `
                position: absolute;
                top: -8px;
                right: -8px;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            `;
            countBadge.textContent = cartCount;
            cartLink.style.position = 'relative';
            cartLink.appendChild(countBadge);
        }
    }
    
    // Update cart page count display
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = `${cartCount} item${cartCount !== 1 ? 's' : ''} in your cart`;
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all features
    initNavigation();
    initCarousel();
    initAnimations();
    initProductCards();
    initCart();
    initForms();
    initScrollEffects();
    initModernInteractions();
});

// Modern Navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    const header = document.querySelector('header');
    
    if (hamburger && menu) {
        hamburger.addEventListener('click', function() {
            menu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Animate hamburger lines
            const spans = hamburger.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = menu.classList.contains('active') 
                    ? `rotate(${index === 1 ? 45 : index === 2 ? -45 : 0}deg) translate(${index === 0 ? '5px, 5px' : index === 1 ? '0, 0' : '-5px, 5px'})`
                    : 'none';
            });
        });
    }
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.15)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.1)';
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Modern Carousel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
                slide.style.opacity = '1';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0';
            }
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Auto-advance carousel
    setInterval(nextSlide, slideInterval);
    
    // Pause on hover
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', function() {
            clearInterval(carouselInterval);
        });
        
        carousel.addEventListener('mouseleave', function() {
            carouselInterval = setInterval(nextSlide, slideInterval);
        });
    }
    
    let carouselInterval = setInterval(nextSlide, slideInterval);
}

// Modern Animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.product-card, .contact-form, .cart, .checkout-container');
    animateElements.forEach(el => observer.observe(el));
}

// Modern Product Cards
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add loading state
        const img = card.querySelector('img');
        if (img) {
            img.addEventListener('load', function() {
                card.style.opacity = '1';
            });
            
            img.addEventListener('error', function() {
                card.style.opacity = '0.5';
            });
        }
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.37)';
        });
        
        // Add to cart functionality
        const addToCartBtn = card.querySelector('button');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                addToCart(this);
            });
        }
    });
}

// Modern Cart Functionality
function initCart() {
    // Load cart items on cart page
    if (window.location.pathname.includes('cart.html')) {
        loadCartItems();
    }
    
    // Load cart items
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsList = document.getElementById('cart-items-list');
        
        if (cart.length === 0) {
            // Cart is empty - show the existing empty state from HTML
            cartItemsList.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <a href="index.html" class="btn-primary" style="margin-top: 2rem; display: inline-block;">
                        <i class="fas fa-arrow-left"></i> Continue Shopping
                    </a>
                </div>
            `;
        } else {
            // Cart has items - display them
            cartItemsList.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">₵${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        // Update totals
        updateCartTotals();
        updateCartCount();
    }
    
    // Update cart totals - NO SHIPPING ON CART PAGE
    function updateCartTotals() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = 0; // No shipping fees on cart page
        const tax = 0; // No tax charged
        const total = subtotal + shipping + tax;
        
        // Update cart page totals
        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');
        
        if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
        if (shippingElement) shippingElement.textContent = shipping.toFixed(2);
        if (taxElement) taxElement.textContent = tax.toFixed(2);
        if (totalElement) totalElement.textContent = total.toFixed(2);
        
        // Update checkout totals if on checkout page - NO TAX ON CHECKOUT
        if (document.getElementById('grand-total')) {
            document.getElementById('subtotal').textContent = subtotal.toFixed(2);
            document.getElementById('shipping-cost').textContent = shipping.toFixed(2);
            document.getElementById('tax').textContent = tax.toFixed(2);
            document.getElementById('grand-total').textContent = total.toFixed(2);
        }
    }
    
    // Update quantity function
    window.updateQuantity = function(itemId, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const item = cart.find(item => item.id === itemId);
        
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                // Remove item if quantity is 0 or less
                cart = cart.filter(item => item.id !== itemId);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartItems();
            showNotification('Cart updated', 'info');
        }
    };
    
    // Remove from cart function
    window.removeFromCart = function(itemId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        showNotification('Item removed from cart', 'info');
    };
    
    // Initialize cart count on page load
    updateCartCount();
}

// Modern Forms
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Form validation
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Animated focus effects
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                submitForm(this);
            }
        });
    });
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+?/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}?/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }
    }
    
    // Update field styling
    const fieldGroup = field.parentElement;
    fieldGroup.classList.remove('error', 'success');
    
    if (!isValid) {
        fieldGroup.classList.add('error');
        showFieldError(field, message);
    } else if (value) {
        fieldGroup.classList.add('success');
        hideFieldError(field);
    }
    
    return isValid;
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    hideFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
        color: #f5576c;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        animation: fadeIn 0.3s ease;
    `;
    errorElement.textContent = message;
    
    field.parentElement.appendChild(errorElement);
}

// Hide field error
function hideFieldError(field) {
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Submit form
function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Processing...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        showNotification('Form submitted successfully!', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Modern Scroll Effects
function initScrollEffects() {
    // Parallax effect for hero sections
    const heroSections = document.querySelectorAll('.hero');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        heroSections.forEach(hero => {
            const speed = 0.5;
            hero.style.transform = `translateY(${scrollTop * speed}px)`;
        });
    });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Modern Interactions
function initModernInteractions() {
    // Button ripple effect
    const buttons = document.querySelectorAll('button, .cta-button, .checkout-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const creditCardForm = document.getElementById('credit-card-form');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'credit-card' && creditCardForm) {
                creditCardForm.style.display = 'block';
                creditCardForm.style.animation = 'fadeIn 0.3s ease';
            } else if (creditCardForm) {
                creditCardForm.style.display = 'none';
            }
        });
    });
    
    // Shipping method selection
    const shippingMethods = document.querySelectorAll('input[name="shipping"]');
    shippingMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Update shipping cost in order summary
            const shippingCost = document.getElementById('shipping-cost');
            if (shippingCost) {
                const costs = { standard: 0, express: 0, overnight: 0 }; // No shipping costs
                shippingCost.textContent = costs[this.value];
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 
                   type === 'error' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 
                   'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .field-error input,
    .field-error textarea,
    .field-error select {
        border-color: #f5576c !important;
        box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1) !important;
    }
    
    .success input,
    .success textarea,
    .success select {
        border-color: #4facfe !important;
        box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1) !important;
    }
    
    .form-group.focused label {
        color: #4facfe;
        transform: scale(0.9);
    }
`;

document.head.appendChild(style);
