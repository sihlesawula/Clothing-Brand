// Retrieve the cart from sessionStorage
let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

function displayCart() {
    const checkoutItems = document.getElementById('checkout-items');
    checkoutItems.innerHTML = '';  // Clear previous content
    
    let totalPrice = 0;

    // Loop through cart items and display them
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.textContent = `${item.color} ${item.size} - R${item.price.toFixed(2)}`;
        checkoutItems.appendChild(cartItem);
        
        totalPrice += item.price;  // Calculate total price
    });

    // Display the total price at the bottom
    const totalPriceElement = document.createElement('div');
    totalPriceElement.textContent = `Total: R${totalPrice.toFixed(2)}`;
    checkoutItems.appendChild(totalPriceElement);
}

// Call displayCart to show cart details when the page loads
window.onload = function() {
    displayCart();
};

// Placeholder function for proceeding to payment (PayFast integration will go here)
function proceedToPayment() {
    alert("Proceeding to PayFast...");

    // You would handle the PayFast API integration here,
    // For example, create a payment request and redirect to PayFast's payment page.
    // This is where you would send the cart details to PayFast.

    // For now, let's just log the cart data to simulate the checkout process.
    console.log(cart);

    // Example: Redirecting to a PayFast payment page (this is just a placeholder)
    // window.location.href = "https://www.payfast.co.za/online-payment";
}

