const API_URL = '';

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center text-[#6D4C41] mt-10 text-lg font-medium">Корзина пуста</p>';
        if (totalEl) totalEl.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }
    
    container.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'bg-white rounded-xl p-4 mb-3 flex justify-between items-center shadow-md';
        div.innerHTML = `
            <div>
                <h3 class="font-bold text-[#3E2723] text-lg mb-1">${item.name}</h3>
                <p class="text-sm text-[#6D4C41]">${item.quantity} шт. × ${item.price} ₽</p>
            </div>
            <button onclick="removeFromCart(${item.id})" class="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition font-bold">×</button>
        `;
        container.appendChild(div);
    });
    
    if (totalEl) { totalEl.innerHTML = `<h3>Итого: ${total} ₽</h3>`; totalEl.style.display = 'block'; }
    if (checkoutBtn) checkoutBtn.style.display = 'block';
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

async function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) { alert('Корзина пуста!'); return; }
    const order = { user_id: 1, coffee_shop_id: 1, items: cart.map(item => ({ product_id: item.id, quantity: item.quantity })) };
    try {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order)
        });
        const result = await response.json();
        alert(`Заказ №${result.order_id} оформлен! Сумма: ${result.total} ₽`);
        localStorage.removeItem('cart');
        renderCart();
    } catch (error) { alert('Не удалось оформить заказ.'); }
}
renderCart();