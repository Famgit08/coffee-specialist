const API_URL = '';

async function loadCoffeeShops() {
    try {
        const response = await fetch(`${API_URL}/api/coffee-shops`);
        const shops = await response.json();
        
        const container = document.getElementById('coffee-shops');
        container.innerHTML = '';
        
        shops.forEach(shop => {
            const card = document.createElement('div');
            // Белая карточка, скругление, отступы, тень
            card.className = 'bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow';
            
            // Внутреннее содержимое с классами Tailwind
            card.innerHTML = `
                <h3 class="text-lg font-bold text-stone-800 mb-2">${shop.name}</h3>
                <p class="text-sm text-stone-600 flex items-center gap-1 mb-1">
                    <img src="images/location.png" alt="Адрес" class="h-4 w-4">
                    ${shop.address}
                </p>
                <p class="text-sm font-bold text-amber-500 flex items-center gap-1">
                    <img src="images/star.png" alt="Рейтинг" class="h-4 w-4">
                    ${shop.rating}
                </p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        document.getElementById('coffee-shops').innerHTML = `
            <p class="text-center text-red-500 mt-4 font-medium">
                Не удалось загрузить данные. Убедитесь, что бэкенд запущен.
            </p>`;
    }
}

loadCoffeeShops();