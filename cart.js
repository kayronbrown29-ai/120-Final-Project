function saveCartToLocalStorage() {
    let cartItems = [];
    const cartContent = document.querySelectorAll(".cart-list .cart-item");
    cartContent.forEach(item => {
        const name = item.querySelector('.cart-item-title')?.innerText || item.querySelector('h3')?.innerText;
        const price = item.querySelector('.cart-price')?.innerHTML || item.querySelector('h2')?.innerText;
        const priceValue = parseFloat(price.replace('$', ''));
        const image = item.querySelector('.cart-item-image')?.src || item.querySelector('.item-photo')?.src;
        const quantity = item.querySelector('.cart-quantity-input')?.value || 1;
        const itemId = item.id;

        if (name && priceValue) {
            cartItems.push({
                id: itemId,
                name: name,
                price: priceValue,
                image: image,
                quantity: parseInt(quantity)
            });
        }
    });
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
}

function updateTotal(){
    let total = 0;
    const cartContent = document.querySelectorAll(".cart-list .cart-item");
    cartContent.forEach(item =>{
        const priceElement = item.querySelector('.cart-price');
        const quantityInput = item.querySelector('.cart-quantity-input');

        if(priceElement && quantityInput){
            const itemPrice = parseFloat(priceElement.innerHTML.replace('$',''));
            const quantity = parseInt(quantityInput.value)||0;

            if(!isNaN(itemPrice)){
                total += itemPrice * quantity;
            };
        }
    });

    const subtotal = total;
    const tax = subtotal * 0.1;
    const finalTotal = subtotal + tax;

    const addedPrice = document.querySelector('.added-price');
    if (addedPrice) {
        const priceElements = addedPrice.querySelectorAll('h2');
        if (priceElements[0]) priceElements[0].innerHTML = `$${subtotal.toFixed(2)}`;
        if (priceElements[1]) priceElements[1].innerHTML = `$${tax.toFixed(2)}`;
        const totalElement = addedPrice.querySelector('h1');
        if (totalElement) totalElement.innerHTML = `$${finalTotal.toFixed(2)}`;
    }

    saveCartToLocalStorage();
}

function addItem(item) {
    let product = document.getElementById(item);
    let name = product.querySelector('.menu-item-name').innerText; 
    let price = product.querySelector('.menu-item-price').innerText;
    let priceValue = parseFloat(price.replace('$', ''));
    let image = product.querySelector('.item-photo').src;

    return toCart(name, priceValue, image, item + 'Cart');  
}

function toCart(name, priceValue, image, itemName) {
    let location = document.querySelector('.cart-list');

    if (document.getElementById(itemName)) {
        alert('This item is already added in the cart');
        return;
    }

    let cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.id = itemName;

    let cartItemHTML = `
        <figure class="cart-photo">
            <img src="${image}" class="cart-item-image item-photo">
        </figure>
        <div class="text-container">
            <h3 class="cart-item-title">${name}</h3>
            <h2 class="cart-price">$${priceValue.toFixed(2)}</h2>
            <input type="number" class="cart-quantity-input" value="1" min="1">
        </div>
        <button type="button" class="item-del" onclick="removeItem('${itemName}')">Remove Item</button>
    `;

    cartItem.innerHTML = cartItemHTML;
    
    const quantityInput = cartItem.querySelector('.cart-quantity-input');
    quantityInput.onchange = function(){
        updateQuantity(quantityInput.value, priceValue.toFixed(2));
    }

    location.appendChild(cartItem);
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

function loadCartFromLocalStorage() {
    const cartList = document.querySelector('.cart-list');
    if (!cartList) return;

    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        cartList.innerHTML = ''; // Clear placeholder items

        cartItems.forEach(item => {
            let cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.id = item.id;

            let cartItemHTML = `
                <figure class="cart-photo">
                    <img src="${item.image}" class="cart-item-image item-photo">
                </figure>
                <div class="text-container">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <h2 class="cart-price">$${item.price.toFixed(2)}</h2>
                    <input type="number" class="cart-quantity-input" value="${item.quantity}" min="1">
                </div>
                <button type="button" class="item-del" onclick="removeItem('${item.id}')">Remove Item</button>
            `;

            cartItem.innerHTML = cartItemHTML;
            
            const quantityInput = cartItem.querySelector('.cart-quantity-input');
            quantityInput.onchange = function(){
                updateQuantity(quantityInput.value, item.price.toFixed(2));
            }

            cartList.appendChild(cartItem);
        });

        updateTotal();
    }
}

document.addEventListener('DOMContentLoaded', loadCartFromLocalStorage);