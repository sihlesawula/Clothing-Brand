const PAYFAST_MERCHANT_ID = '25459155'; // Replace with your PayFast merchant ID
const PAYFAST_MERCHANT_KEY = '6cnc8ytucwfg1'; // Replace with your PayFast merchant key
const PAYFAST_URL = 'https://www.payfast.co.za/eng/process'; // PayFast payment URL

// Initialize cart from sessionStorage, or use an empty array if no cart exists
let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

// Function to update the cart display (refreshes cart items)
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    cartItemsContainer.innerHTML = '';  // Clear existing cart items

    let cartTotal = 0;

    // Loop through the cart and display each item
    cart.forEach(item => {
        cartTotal += item.price + item.deliveryCost;

        const cartItem = document.createElement('p');
        cartItem.innerHTML = `${item.name} (${item.size} - ${item.color}) - R${(item.price + item.deliveryCost).toFixed(2)} 
            <span class="bin" onclick="removeFromCart('${item.id}')">🗑️</span>`;
        
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalElement.innerText = cartTotal.toFixed(2);
}

// Function to add a product to the cart
function addToCart(productId) {
    // Get the selected values (color, size, delivery)
    const color = document.querySelector(`#${productId} .color-selector`).value;
    const size = document.querySelector(`#${productId} .size-selector`).value;
    const delivery = document.querySelector(`#${productId} .delivery-selector`).value;
    const price = parseFloat(document.querySelector(`#${productId} .price`).textContent.replace('R', ''));

    // Delivery costs
    let deliveryCost = 0;
    if (delivery === 'standard') deliveryCost = 70;
    if (delivery === 'express') deliveryCost = 150;

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

    // Update sessionStorage and cart display
    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Open the cart container
function openCart() {
    document.querySelector('.cart-container').style.display = 'block';
}

// Close the cart container
function closeCart() {
    document.querySelector('.cart-container').style.display = 'none';
}

// Function to checkout and send data to PayFast
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Calculate total amount of cart items (including delivery cost)
    const totalAmount = cart.reduce((total, item) => total + (item.price + item.deliveryCost), 0);

    // Create a description of the items in the cart
    const itemDescription = cart.map(item => `${item.name} (${item.size}, ${item.color})`).join(', ');

    // PayFast request params (Fix: Added 'item_name' field)
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
        m_payment_id: new Date().getTime(), // Unique payment ID (could be an order number)
    };

    // Create a hidden form and append it to the document body
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = PAYFAST_URL;

    // Add PayFast parameters as hidden input fields
    for (const key in payfastParams) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payfastParams[key];
        form.appendChild(input);
    }

    // Append the form to the body
    document.body.appendChild(form);

    // Submit the form to PayFast
    form.submit();

    // Optionally, remove the form after submission
    document.body.removeChild(form);

    // Clear the cart after checkout
    cart = [];
    sessionStorage.removeItem('cart');
    updateCartDisplay();
}
