function updateTotal(){
    let total = 0;
    totalOutput = document.querySelector("cart-total-price");
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

    document.querySelector('.cart-total-price').innerHTML = `Totale Price: $${total.toFixed(2)}`;
}

function addItem(item) {
    let product = document.getElementById(item);
    let name = product.querySelector('.shop-item-title').innerText; 
    let price = product.querySelector('.shop-item-price').innerText;
    let priceValue = parseFloat(price.replace('$', ''));
    let image = product.querySelector('.shop-item-image').src;

    return toCart(name, priceValue, image, item + 'Cart');  
}

function toCart(name, priceValue, image, itemName) {
    let location = document.getElementsByClassName('cart-items')[0];

    if (document.getElementById(itemName)) {
        alert('This item is already added in the cart');
        return;
    }

    let cartRow = document.createElement("div");
    cartRow.className = "cart-row";
    cartRow.id = itemName;

    let cartItemColumn = document.createElement("div");
    cartItemColumn.className = "cart-item cart-column";
    cartRow.appendChild(cartItemColumn);

    let cartItemImage = document.createElement("img");
    cartItemImage.className = "cart-item-image";
    cartItemImage.src = image;
    cartItemImage.width = 100;
    cartItemImage.height = 100;
    cartItemColumn.appendChild(cartItemImage);

    let cartItemTitle = document.createElement("span");
    cartItemTitle.className = "cart-item-title";
    cartItemTitle.innerText = name;
    cartItemColumn.appendChild(cartItemTitle);

    let cartPriceColumn = document.createElement("span");
    cartPriceColumn.className = "cart-price cart-column";
    cartPriceColumn.innerHTML = `$${priceValue.toFixed(2)}`;
    cartRow.appendChild(cartPriceColumn);

    let cartQuantityColumn = document.createElement("div");
    cartQuantityColumn.className = "cart-quantity cart-column";
    cartRow.appendChild(cartQuantityColumn);

    let cartQuantityInput = document.createElement("input");
    cartQuantityInput.className = "cart-quantity-input";
    cartQuantityInput.type = "number";
    cartQuantityInput.value = 1;
    cartQuantityInput.min = 1;
    cartQuantityColumn.appendChild(cartQuantityInput);

    cartQuantityInput.onchange = function(){
        updateQuantity(cartQuantityInput.value, priceValue.toFixed(2));
    }

    let btnDanger = document.createElement("button");
    btnDanger.className = "btn btn-danger";
    btnDanger.type = "button";
    btnDanger.innerHTML = "REMOVE";
    cartQuantityColumn.appendChild(btnDanger);
    
    btnDanger.onclick = function(){
        removeItem(cartRow.id);
    }

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