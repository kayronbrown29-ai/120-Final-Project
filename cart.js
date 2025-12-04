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
    
    document.querySelector('.cart-subtotal').innerHTML = `$${total.toFixed(2)}`;
    document.querySelector('.cart-tax').innerHTML = `$${tax.toFixed(2)}`;
    document.querySelector('.cart-total-price').innerHTML = `Total Price: $${finalTotal.toFixed(2)}`;
    
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
        window.location.href = 'shopping-cart.html';
    }
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
    if(!isNaN(value) && value>0){
        let checkValue = Math.floor(value);
        price*checkValue;
        updateTotal();
    }
}

// Load cart when the page loads
document.addEventListener('DOMContentLoaded', loadCart);