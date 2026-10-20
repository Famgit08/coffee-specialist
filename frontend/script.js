const API_URL = 'http://127.0.0.1:8000';

async function loadCoffeeShops() {
    try {
        const response = await fetch(`${API_URL}/api/coffee-shops`);
        const shops = await response.json();
        
        const container = document.getElementById('coffee-shops');
        container.innerHTML = '';
        
        shops.forEach(shop => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${shop.name}</h3>
                <p class="address">📍 ${shop.address}</p>
                <p class="rating">⭐ ${shop.rating}</p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        document.getElementById('coffee-shops').innerHTML = 
            '<p style="color: red;">Не удалось загрузить данные. Убедитесь, что бэкенд запущен.</p>';
    }
}

loadCoffeeShops();