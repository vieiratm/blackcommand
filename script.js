// Configuration
const DISCORD_WEBHOOK_URL = 'YOUR_WEBHOOK_HERE'; 

let currentUser = null;
let cart = [];
let products = [
    { id: 1, name: "Sample Item", price: 10, qty: 5, img: "https://via.placeholder.com/150" }
];

// Simple Login Logic
function login() {
    const user = document.getElementById('username').value;
    if(user) {
        currentUser = { name: user, role: (user === 'admin' ? 'admin' : 'customer') };
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('user-display').innerText = `User: ${user}`;
        
        if(currentUser.role === 'admin') {
            document.getElementById('admin-tools').classList.remove('hidden');
        }
        renderProducts();
    }
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(p => `
        <div class="card">
            <img src="${p.img}">
            <h4>${p.name}</h4>
            <p>Price: $${p.price} | Qty: ${p.qty}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

function addToCart(id) {
    const item = products.find(p => p.id === id);
    cart.push(item);
    updateCartUI();
}

function updateCartUI() {
    const cartDiv = document.getElementById('cart-items');
    cartDiv.innerHTML = cart.map(i => `<p>${i.name} - $${i.price}</p>`).join('');
}

async function sendToDiscord() {
    if (cart.length === 0) return alert("Cart is empty!");

    const message = {
        content: `📦 **New Order!**\nUser: ${currentUser.name}\nItems: ${cart.map(i => i.name).join(', ')}`
    };

    await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    });

    alert("Pedido enviado!");
    cart = [];
    updateCartUI();
}

function toggleModal(id) {
    const m = document.getElementById(id);
    m.style.display = m.style.display === 'block' ? 'none' : 'block';
}
