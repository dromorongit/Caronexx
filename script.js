// Load products data
let productsData = {};

fetch('products.json')
    .then(response => response.json())
    .then(data => {
        productsData = data;
        populateCarousel(data.carousel);
        populateProducts('corsets', data.corsets);
        populateProducts('lingeries', data.lingeries);
        populateProducts('mens-briefs', data['mens-briefs']);
        populateProducts('underwears', data.underwears);
    })
    .catch(error => console.error('Error loading products:', error));

// Carousel functionality
let currentSlide = 0;
let slides = [];

function populateCarousel(images) {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;
    carousel.innerHTML = '';
    images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide' + (index === 0 ? ' active' : '');
        slide.innerHTML = `<img src="${img}" alt="Carousel ${index + 1}" loading="lazy">`;
        carousel.appendChild(slide);
    });
    slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        setInterval(nextSlide, 3000);
    }
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Populate products
function populateProducts(sectionId, products) {
    const grid = document.querySelector(`#${sectionId} .product-grid`);
    if (!grid) return;
    grid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <p>GHS ${product.price}</p>
            <button onclick="addToCartFromData('${product.id}', '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
        `;
        grid.appendChild(card);
    });
}

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const menu = document.querySelector('.menu');

if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart();
    alert('Added to cart!');
}

function addToCartFromData(id, name, price, image) {
    addToCart({ id, name, price, image });
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');
    if (!cartItems || !totalEl) return;

    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>GHS ${item.price} x <input type="number" value="${item.qty}" min="1" onchange="updateQty(${index}, this.value)">
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
                <p>GHS ${itemTotal.toFixed(2)}</p>
            </div>
        `;
    });
    totalEl.textContent = total.toFixed(2);
}

function updateQty(index, qty) {
    cart[index].qty = parseInt(qty);
    saveCart();
    updateCartDisplay();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
}

// Checkout order summary
function updateOrderSummary() {
    const orderItems = document.getElementById('order-items');
    const subtotalEl = document.getElementById('subtotal');
    const grandTotalEl = document.getElementById('grand-total');
    if (!orderItems || !subtotalEl || !grandTotalEl) return;

    orderItems.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        orderItems.innerHTML += `<p>${item.name} x ${item.qty} - GHS ${itemTotal.toFixed(2)}</p>`;
    });
    subtotalEl.textContent = subtotal.toFixed(2);
    const shipping = 10;
    const grandTotal = subtotal + shipping;
    grandTotalEl.textContent = grandTotal.toFixed(2);
}

// Form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Form submitted successfully!');
        // In a real app, send data to server
    });
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    updateOrderSummary();
    // Add fade-in to sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
    });
});