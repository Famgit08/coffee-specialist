const API_URL = 'http://127.0.0.1:8000';

async function loadProducts() {
    const response = await fetch(`${API_URL}/api/products`);
    const products = await response.json();
    
    const container = document.getElementById('products');
    container.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">${product.price} ₽</p>
            <button class="btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                Добавить в корзину
            </button>
        `;
        container.appendChild(card);
    });
}

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} добавлен в корзину!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

loadProducts();
updateCartCount();