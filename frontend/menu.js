const API_URL = '';

async function loadProducts() {
    const response = await fetch(`${API_URL}/api/products`);
    const products = await response.json();
    const container = document.getElementById('products');
    container.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow mb-4';
        card.innerHTML = `
            <h3 class="text-lg font-bold text-[#3E2723] mb-2">${product.name}</h3>
            <p class="text-sm text-gray-600 mb-3">${product.description}</p>
            <p class="text-lg font-bold text-[#3E2723] mb-3">${product.price} ₽</p>
            <button class="w-full bg-coffee text-white py-2.5 rounded-lg hover:opacity-90 transition font-medium" 
                    onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                Добавить в корзину
            </button>
        `;
        container.appendChild(card);
    });
}

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity++;
    else cart.push({ id, name, price, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} добавлен в корзину!`);
}
loadProducts();