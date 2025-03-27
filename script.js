const PAYFAST_MERCHANT_ID = '25459155'; 
const PAYFAST_MERCHANT_KEY = '6cnc8ytucwfg1'; 
const PAYFAST_URL = 'https://www.payfast.co.za/eng/process'; 


let cart = JSON.parse(sessionStorage.getItem('cart')) || [];


function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    cartItemsContainer.innerHTML = '';  

    let cartTotal = 0;

    
    cart.forEach(item => {
        cartTotal += item.price + item.deliveryCost;

        const cartItem = document.createElement('p');
        cartItem.innerHTML = `${item.name} (${item.size} - ${item.color}) - R${(item.price + item.deliveryCost).toFixed(2)} 
            <span class="bin" onclick="removeFromCart('${item.id}')">🗑️</span>`;
        
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.innerText = cartTotal.toFixed(2);
}


function addToCart(productId) {
    const size = document.querySelector(`#${productId} .size-selector`).value;
    const delivery = document.querySelector(`#${productId} .delivery-selector`).value;
    const price = parseFloat(document.querySelector(`#${productId} .price`).textContent.replace('R', ''));

    
    let deliveryCost = 0;
    if (delivery === 'standard') deliveryCost = 60;
    if (delivery === 'express') deliveryCost = 120;

    // Get the name of the product
    const name = document.querySelector(`#${productId} h3`).textContent;

    // Add the item to the cart
    const item = {
        id: productId,
        name,
        color,
        size,
        delivery,
        price,
        deliveryCost
    };

    // Add item to cart array
    cart.push(item);

    // Save updated cart to sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart display
    updateCartDisplay();
}

// Function to remove an item from the cart
function removeFromCart(productId) {
    // Filter out the item by productId
    cart = cart.filter(item => item.id !== productId);

    
    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}


function openCart() {
    document.querySelector('.cart-container').style.display = 'block';
}


function closeCart() {
    document.querySelector('.cart-container').style.display = 'none';
}


function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    
    const totalAmount = cart.reduce((total, item) => total + (item.price + item.deliveryCost), 0);

   
    const itemDescription = cart.map(item => `${item.name} (${item.size}, ${item.color})`).join(', ');


    const payfastParams = {
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        amount: totalAmount.toFixed(2),  // Total amount to be paid (product + delivery)
        item_name: cart.length === 1 ? cart[0].name : "Multiple Items", // Fix: Required 'item_name'
        item_description: itemDescription, // List of items (optional)
        return_url: window.location.href, // Return to the same page after successful payment
        cancel_url: window.location.href, // Return to the same page if the user cancels
        email_address: 'customer_email@example.com', // Replace with actual email address
        name_first: 'First Name', // Replace with actual first name
        name_last: 'Last Name',  // Replace with actual last name
        m_payment_id: new Date().getTime(), 
    };

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = PAYFAST_URL;


    for (const key in payfastParams) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payfastParams[key];
        form.appendChild(input);
    }

    document.body.appendChild(form);

   
    form.submit();

 
    document.body.removeChild(form);

    cart = [];
    sessionStorage.removeItem('cart');
    updateCartDisplay();
}
