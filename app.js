// --- CATALOGUE PRODUITS ---
const products = [
    {
        id: 'p1',
        name: 'Impression PLA 50g',
        price: 5.00,
        description: 'Impression 3D sur-mesure en PLA (50g)',
        image: 'images/p1.jpg',
        stripeLink: 'https://buy.stripe.com/test_1'
    },
    {
        id: 'p2',
        name: 'Kit Électronique Test',
        price: 15.00,
        description: 'Composants pour prototypage rapide',
        image: 'images/p2.jpg',
        stripeLink: 'https://buy.stripe.com/test_2'
    },
    {
        id: 'p3',
        name: 'Consulting R&D (1h)',
        price: 50.00,
        description: 'Session d\'étude technique de 1h',
        image: 'images/p3.jpg',
        stripeLink: 'https://buy.stripe.com/test_3'
    }
];

// --- GESTION DU PANIER (LOCALSTORAGE) ---
let cart = JSON.parse(localStorage.getItem('vagabond_cart')) || [];

function saveCart() {
    localStorage.setItem('vagabond_cart', JSON.stringify(cart));
    updateCartBadge();
    if (document.getElementById('cart-container')) {
        renderCartPage();
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    alert(`${product.name} ajouté au panier !`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
        }
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
    }
}

// --- RENDU E-SHOP (Si on est sur eshop.html) ---
function renderEshopPage() {
    const grid = document.getElementById('product-list');
    if (!grid) return;

    grid.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div>
                <img src="${p.image}" alt="${p.name}" class="product-img">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <p class="price">${p.price.toFixed(2)} €</p>
            </div>
            <button class="btn" onclick="addToCart('${p.id}')">Ajouter au panier</button>
        `;
        grid.appendChild(card);
    });
}


// --- NAVIGATION PAR ONGLETS ---
function showTab(tabId, element) {
    // Masque toutes les sections
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Retire la classe 'active' de tous les liens du menu
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Affiche l'onglet sélectionné et active son bouton dans le menu
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    if (element) {
        element.classList.add('active');
    }
}

// --- RENDU PANIER (Si on est sur panier.html) ---
function renderCartPage() {
    const cartContainer = document.getElementById('cart-container');
    const emptyMsg = document.getElementById('cart-empty-msg');
    const cartItemsTable = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyMsg.style.display = 'block';
        return;
    }

    cartContainer.style.display = 'block';
    emptyMsg.style.display = 'none';
    cartItemsTable.innerHTML = '';

    let grandTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td>${item.price.toFixed(2)} €</td>
            <td>
                <button onclick="changeQuantity('${item.id}', -1)">-</button>
                ${item.quantity}
                <button onclick="changeQuantity('${item.id}', 1)">+</button>
            </td>
            <td>${itemTotal.toFixed(2)} €</td>
            <td><button class="btn btn-danger" onclick="removeFromCart('${item.id}')">X</button></td>
        `;
        cartItemsTable.appendChild(tr);
    });

    totalSpan.innerText = grandTotal.toFixed(2);
}

function checkout() {
    if (cart.length === 0) return;
    window.location.href = cart[0].stripeLink;
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    renderEshopPage();
    renderCartPage();
});