const API_URL = 'http://127.0.0.1:8000';

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Если корзина пуста
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: #6D4C41; margin-top: 20px;">Корзина пуста</p>';
        if (totalEl) totalEl.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }
    
    // Если есть товары
    container.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <h3 style="margin-bottom: 5px;">${item.name}</h3>
                <p style="color: #6D4C41;">${item.quantity} шт. × ${item.price} ₽</p>
            </div>
            <button onclick="removeFromCart(${item.id})">×</button>
        `;
        container.appendChild(div);
    });
    
    if (totalEl) {
        totalEl.innerHTML = `<h3>Итого: ${total} ₽</h3>`;
        totalEl.style.display = 'block';
    }
    if (checkoutBtn) {
        checkoutBtn.style.display = 'block';
    }
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

async function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    const order = {
        user_id: 1,
        coffee_shop_id: 1,
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity }))
    };
    
    try {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        
        const result = await response.json();
        alert(`Заказ №${result.order_id} оформлен! Сумма: ${result.total} ₽`);
        localStorage.removeItem('cart');
        renderCart();
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        alert('Не удалось оформить заказ. Проверьте, запущен ли бэкенд.');
    }
}

// Запускаем отрисовку при загрузке страницы
renderCart();