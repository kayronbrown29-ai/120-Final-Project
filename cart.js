// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        const cartContainer = document.querySelector('.cart-items');
        if (cartContainer) {
            cartItems.forEach(item => {
                const cartRow = createCartRow(item.name, item.price, item.image, item.id, item.quantity);
                cartContainer.appendChild(cartRow);
            });
            updateTotal();
        }
    }
}

// Save cart to localStorage
function saveCart() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) {
        return; // Exit early if not on cart page
    }
    
    const cartRows = document.querySelectorAll('.cart-items .cart-row');
    const cartItems = [];
    
    cartRows.forEach(row => {
        const itemId = row.id;
        const name = row.querySelector('.cart-item-title').innerText;
        const price = parseFloat(row.querySelector('.cart-price').innerHTML.replace('$', ''));
        const quantity = parseInt(row.querySelector('.cart-quantity-input').value);
        const image = row.querySelector('.cart-item-image').src;
        
        cartItems.push({
            id: itemId,
            name: name,
            price: price,
            quantity: quantity,
            image: image
        });
    });
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    // keep the visible cart count in sync
    updateCartCount();
}

function updateTotal(){
    let total = 0;
    const cartContent = document.querySelectorAll(".cart-items .cart-row");
    cartContent.forEach(row =>{
        const priceElement = row.querySelector('.cart-price');
        const quantityInput = row.querySelector('.cart-quantity-input');

        if(priceElement && quantityInput){
            const itemPrice = parseFloat(priceElement.innerHTML.replace('$',''));
            const quantity = parseInt(quantityInput.value)||0;

            if(!isNaN(itemPrice)){
                total += itemPrice * quantity;
            };
        }
    });

    const taxRate = 0.10;
    const tax = total * taxRate;
    const finalTotal = total + tax;
    
    const subtotalElement = document.querySelector('.cart-subtotal');
    const taxElement = document.querySelector('.cart-tax');
    const totalElement = document.querySelector('.cart-total-price');
    
    if(subtotalElement) subtotalElement.innerHTML = `$${total.toFixed(2)}`;
    if(taxElement) taxElement.innerHTML = `$${tax.toFixed(2)}`;
    if(totalElement) totalElement.innerHTML = `Total Price: $${finalTotal.toFixed(2)}`;
    
    saveCart();
}

function addItem(item) {
    let product = document.getElementById(item);
    if (!product) {
        console.error('Product not found:', item);
        return;
    }
    
    let name = product.querySelector('.menu-item-title').innerText; 
    let price = product.querySelector('.menu-item-price').innerText;
    let priceValue = parseFloat(price.replace('$', ''));
    let image = product.querySelector('.item-photo').src;

    // Check if we're on the shopping cart page or menu page
    let cartContainer = document.querySelector('.cart-items');
    
    if (cartContainer) {
        // We're on the shopping cart page, add directly
        toCart(name, priceValue, image, item + 'Cart');
    } else {
        // We're on the menu page, add to localStorage and redirect
        addToCartFromMenu(name, priceValue, image, item + 'Cart');
        // Stay on the menu so user can continue adding items.
        // Show a small temporary toast to confirm the action.
        showAddedToast('Added to cart');
    }
}

// Small toast notification for menu adds
function showAddedToast(message) {
    let existing = document.getElementById('cart-toast');
    if (existing) {
        existing.remove();
    }
    const toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.right = '20px';
    toast.style.bottom = '20px';
    toast.style.background = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 14px';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    toast.style.zIndex = '9999';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'opacity 300ms';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 900);
}

function addToCartFromMenu(name, priceValue, image, itemName) {
    // Get existing cart or create new one
    const savedCart = localStorage.getItem('cart');
    let cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    // Check if item already exists
    const existingItem = cartItems.find(item => item.id === itemName);
    
    if (existingItem) {
        // Increment quantity if item exists
        existingItem.quantity += 1;
    } else {
        // Add new item
        cartItems.push({
            id: itemName,
            name: name,
            price: priceValue,
            quantity: 1,
            image: image
        });
    }
    
    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    // Update any cart count badges on the page immediately
    updateCartCount();
}

function createCartRow(name, priceValue, image, itemName, quantity = 1) {
    // Create cart row container
    let cartRow = document.createElement("div");
    cartRow.className = "cart-row";
    cartRow.id = itemName;

    // Create cart item div
    let cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item cart-column";
    cartRow.appendChild(cartItemDiv);

    // Create and add image
    let cartItemImage = document.createElement("img");
    cartItemImage.className = "cart-item-image";
    cartItemImage.src = image;
    cartItemImage.width = 100;
    cartItemImage.height = 100;
    cartItemDiv.appendChild(cartItemImage);

    // Create and add title
    let cartItemTitle = document.createElement("span");
    cartItemTitle.className = "cart-item-title";
    cartItemTitle.innerText = name;
    cartItemDiv.appendChild(cartItemTitle);

    // Create and add price
    let cartPrice = document.createElement("span");
    cartPrice.className = "cart-price";
    cartPrice.innerHTML = `$${priceValue.toFixed(2)}`;
    cartItemDiv.appendChild(cartPrice);

    // Create quantity div
    let cartQuantityDiv = document.createElement("div");
    cartQuantityDiv.className = "cart-quantity";
    cartItemDiv.appendChild(cartQuantityDiv);

    // Create and add quantity input
    let cartQuantityInput = document.createElement("input");
    cartQuantityInput.className = "cart-quantity-input";
    cartQuantityInput.type = "number";
    cartQuantityInput.value = quantity;
    cartQuantityInput.min = 1;
    cartQuantityDiv.appendChild(cartQuantityInput);

    cartQuantityInput.onchange = function(){
        updateQuantity(cartQuantityInput.value, priceValue.toFixed(2));
    }

    // Create and add remove button
    let btnDanger = document.createElement("button");
    btnDanger.className = "btn btn-danger";
    btnDanger.type = "button";
    btnDanger.innerHTML = "REMOVE";
    cartQuantityDiv.appendChild(btnDanger);
    
    btnDanger.onclick = function(){
        removeItem(cartRow.id);
    }

    return cartRow;
}

function toCart(name, priceValue, image, itemName) {
    let location = document.getElementsByClassName('cart-items')[0];
    
    if (!location) {
        console.error('Cart container not found');
        return;
    }

    if (document.getElementById(itemName)) {
        alert('This item is already added in the cart');
        return;
    }

    let cartRow = createCartRow(name, priceValue, image, itemName);
    location.appendChild(cartRow);
    updateTotal();
}

function removeItem(itemId) {
    var obj = document.getElementById(itemId);
    if (obj) {
        obj.remove();
    }
    updateTotal();
}

function updateQuantity(value, price){
    if(!isNaN(value) && value > 0){
        let checkValue = Math.floor(value);
        let newPrice = price * checkValue;
        updateTotal();
    }
}

// Load cart when the page loads
document.addEventListener('DOMContentLoaded', loadCart);

// --- Cart count badge (shows number beside View Cart links) ---
function getCartCount() {
    const saved = localStorage.getItem('cart');
    if (!saved) return 0;
    try {
        const items = JSON.parse(saved);
        return items.reduce((sum, it) => sum + (parseInt(it.quantity) || 0), 0);
    } catch (e) {
        return 0;
    }
}

function updateCartCount() {
    const count = getCartCount();

    // Update any inline cart emoji badges (e.g., in nav links)
    const inlineBadges = document.querySelectorAll('.inline-count');
    inlineBadges.forEach(b => {
        if (count > 0) {
            b.textContent = count;
            b.style.display = 'inline-block';
        } else {
            b.style.display = 'none';
        }
    });
}

// Ensure count is initialized on load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

// --- Payment handling ---
function openPaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) modal.style.display = 'flex';
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) modal.style.display = 'none';
    const error = document.getElementById('payment-error');
    if (error) error.textContent = '';
}

function validatePaymentFields(name, card, expiry, cvv) {
    if (!name || name.trim().length < 2) return 'Please enter the cardholder name.';
    const cardDigits = card.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(cardDigits)) return 'Enter a valid card number (13-19 digits).';
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry)) return 'Expiry must be MM/YY.';
    if (!/^\d{3,4}$/.test(cvv)) return 'Enter a valid 3 or 4 digit CVV.';
    return '';
}

function processPayment() {
    const name = document.getElementById('pay-name').value;
    const card = document.getElementById('pay-card').value;
    const expiry = document.getElementById('pay-expiry').value;
    const cvv = document.getElementById('pay-cvv').value;
    const errorDiv = document.getElementById('payment-error');

    const validation = validatePaymentFields(name, card, expiry, cvv);
    if (validation) {
        if (errorDiv) errorDiv.textContent = validation;
        return;
    }

    // Simulate processing
    if (errorDiv) {
        errorDiv.style.color = '#333';
        errorDiv.textContent = 'Processing payment...';
    }

    setTimeout(() => {
        // On success: record order, clear cart, show receipt, then redirect
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        // compute totals
        let subtotal = 0;
        cartItems.forEach(it => { subtotal += (parseFloat(it.price) || 0) * (parseInt(it.quantity) || 0); });
        const tax = +(subtotal * 0.10).toFixed(2);
        const total = +(subtotal + tax).toFixed(2);

        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = {
            id: 'ORD' + Date.now(),
            name: name || (localStorage.getItem('loggedInEmail') || 'Guest'),
            email: localStorage.getItem('loggedInEmail') || null,
            items: cartItems,
            subtotal: +subtotal.toFixed(2),
            tax: tax,
            total: total,
            time: new Date().toISOString()
        };
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('cart');
        const cartContainer = document.querySelector('.cart-items');
        if (cartContainer) cartContainer.innerHTML = '';
        updateTotal();
        closePaymentModal();

        // Build and show receipt modal
        const receipt = document.createElement('div');
        receipt.id = 'receipt-modal';
        receipt.style.position = 'fixed';
        receipt.style.inset = '0';
        receipt.style.display = 'flex';
        receipt.style.alignItems = 'center';
        receipt.style.justifyContent = 'center';
        receipt.style.background = 'rgba(0,0,0,0.5)';
        receipt.style.zIndex = '10000';

        const box = document.createElement('div');
        box.style.background = '#fff';
        box.style.padding = '18px';
        box.style.borderRadius = '8px';
        box.style.maxWidth = '520px';
        box.style.width = '92%';

        let html = `<h2>Receipt</h2>`;
        html += `<p><strong>Order ID:</strong> ${order.id}</p>`;
        html += `<p><strong>Name:</strong> ${order.name}</p>`;
        html += `<p><strong>Date:</strong> ${new Date(order.time).toLocaleString()}</p>`;
        html += `<hr><div style="max-height:240px; overflow:auto;"><ul>`;
        order.items.forEach(it => {
            html += `<li>${it.name} x ${it.quantity} — $${(it.price * it.quantity).toFixed(2)}</li>`;
        });
        html += `</ul></div><hr>`;
        html += `<p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>`;
        html += `<p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>`;
        html += `<h3>Total: $${order.total.toFixed(2)}</h3>`;
        html += `<div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
                    <button id="receipt-print" class="btn">Print</button>
                    <button id="receipt-done" class="btn btn-purchase">Done</button>
                 </div>`;

        box.innerHTML = html;
        receipt.appendChild(box);
        document.body.appendChild(receipt);

        document.getElementById('receipt-print').addEventListener('click', function() {
            // simple print of receipt box
            const original = document.body.innerHTML;
            const recHtml = box.innerHTML;
            document.body.innerHTML = `<div style="padding:20px;">${recHtml}</div>`;
            window.print();
            document.body.innerHTML = original;
            window.location.href = 'menu.html';
        });

        document.getElementById('receipt-done').addEventListener('click', function() {
            // remove receipt and go back to menu
            const el = document.getElementById('receipt-modal');
            if (el) el.remove();
            // update cart count displays
            if (typeof updateCartCount === 'function') updateCartCount();
            window.location.href = 'menu.html';
        });
    }, 1200);
}

// Wire up buttons when DOM ready
document.addEventListener('DOMContentLoaded', function() {
    const purchaseBtn = document.getElementById('purchase-btn');
    const payCancel = document.getElementById('pay-cancel');
    const paySubmit = document.getElementById('pay-submit');

    if (purchaseBtn) purchaseBtn.addEventListener('click', openPaymentModal);
    if (payCancel) payCancel.addEventListener('click', function(e) { e.preventDefault(); closePaymentModal(); });
    if (paySubmit) paySubmit.addEventListener('click', function(e) { e.preventDefault(); processPayment(); });
});