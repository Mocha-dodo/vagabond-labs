// --- CATALOGUE PRODUITS ---
const products = [
{
    id: 'support_1',
    atelier: 'support',
    name: 'Support adapté PS5',
    price: 12.90,
    description: 'Impression 3D avec logo personnalisable',

    fullDescription: `
    <p>Ce support a été conçu...</p>
    <h3>Caractéristiques</h3>
    <p>Dimensions : x*x*xcm</p>
    <p>Support Modélisé dans le 3D de la manette PS5 le support n est pas adapté pour un autre type de manette</p>
    <p>Personnalisation disponible, contactez moi en MP</p>


    <img src="images/support_detail.jpg"
         class="product-description-image">
    <h3>Fabrication</h3>
    <p>...</p>`,

    image: 'images/support_1.jpg',
    weight: 100,
    stripeLink: 'https://buy.stripe.com/support_1',

    options: [
        {
            name: 'Couleur',
            choices: ['Noir', 'Blanc', 'Rouge']
        },
        {
            name: 'Finition',
            choices: ['Standard', 'Premium']
        }
    ]
},

    {
        id: 'textile_1',
        atelier: "textile",
        name: 'Support adapté PS5',
        price: 12.90,
        description: 'Impression 3D sur-mesure en PLA (50g)',
        image: 'images/p1.jpg',
        weight: 50,
        stripeLink: 'https://buy.stripe.com/test_1'
    },
    {
        id: 'objet_1',
        atelier: "objets",
        name: 'Kit Électronique Test',
        price: 15.00,
        description: 'Composants pour prototypage rapide',
        image: 'images/p2.jpg',
        weight: 200,
        stripeLink: 'https://buy.stripe.com/test_2'
    },
    {
        id: 'p3',
        atelier: "none",
        name: 'Consulting R&D (1h)',
        price: 50.00,
        description: 'Session d\'étude technique de 1h',
        image: 'images/p3.jpg',
        weight: 0,
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


let selectedAtelier = 'support';

function selectAtelier(atelier, element) {
    selectedAtelier = atelier;

    document.querySelectorAll('.atelier-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    element.classList.add('active');

    renderEshopPage();
}

function renderEshopPage() {
    const grid = document.getElementById('product-list');
    if (!grid) return;

    grid.classList.remove('product-detail-view');

    grid.innerHTML = '';

    const atelierProducts = products.filter(
        p => p.atelier === selectedAtelier
    );

    atelierProducts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.onclick = () => showProduct(p.id);

        card.innerHTML = `
            <div>
                <img src="${p.image}" alt="${p.name}" class="product-img">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <p class="price">${p.price.toFixed(2)} €</p>
            </div>
        `;

        grid.appendChild(card);
    });
}

function showProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const grid = document.getElementById('product-list');
    if (!grid) return;

    grid.classList.add('product-detail-view');

    grid.innerHTML = `
        <button class="product-back" onclick="renderEshopPage()">
        ← Retour aux produits
        </button>
        <div class="product-detail">
            <div class="product-main">
                <div class="product-main-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h2>${product.name}</h2>
                    <p class="price">
                        ${product.price.toFixed(2)} €
                    </p>
                    <p>${product.description}</p>
                    <div id="product-options"></div>
                    <button class="btn" onclick="addConfiguredProduct('${product.id}')">
                        Ajouter au panier
                    </button>
                </div>
            </div>
            <div class="product-description">
                <h2>Description</h2>
                ${product.fullDescription || `<p>${product.description}</p>`}
            </div>
        </div>
    `;

    renderProductOptions(product);
}

function renderProductOptions(product) {
    const container = document.getElementById('product-options');
    if (!container || !product.options) return;

    product.options.forEach((option, index) => {

        const label = document.createElement('label');
        label.textContent = option.name;

        const select = document.createElement('select');
        select.id = `product-option-${index}`;

        option.choices.forEach(choice => {
            const optionElement = document.createElement('option');

            optionElement.value = choice;
            optionElement.textContent = choice;

            select.appendChild(optionElement);
        });

        container.appendChild(label);
        container.appendChild(select);
    });
}


function addConfiguredProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const selectedOptions = {};

    product.options?.forEach((option, index) => {
        const select = document.getElementById(`product-option-${index}`);

        if (select) {
            selectedOptions[option.name] = select.value;
        }
    });

    cart.push({
        ...product,
        quantity: 1,
        selectedOptions: selectedOptions
    });

    saveCart();

    alert(`${product.name} ajouté au panier !`);
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

    let grandTotal = 0; // Réinitialisation du total

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal; // Incrémentation du total pour chaque article

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <strong>${item.name}</strong>

                ${
                    item.selectedOptions &&
                    Object.keys(item.selectedOptions).length > 0
                    ? `
                        <div class="cart-options">
                            ${Object.entries(item.selectedOptions)
                                .map(([name, value]) => `
                                    <div>${name} : ${value}</div>
                                `)
                                .join('')}
                        </div>
                    `
                    : ''
                }
            </td>

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

    // Mise à jour de l'affichage du total général
    if (totalSpan) totalSpan.innerText = grandTotal.toFixed(2);
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