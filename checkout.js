
let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

function displayCart() {
    const checkoutItems = document.getElementById('checkout-items');
    checkoutItems.innerHTML = '';  
    
    let totalPrice = 0;

   
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.textContent = `${item.color} ${item.size} - R${item.price.toFixed(2)}`;
        checkoutItems.appendChild(cartItem);
        
        totalPrice += item.price;  
    });

    const totalPriceElement = document.createElement('div');
    totalPriceElement.textContent = `Total: R${totalPrice.toFixed(2)}`;
    checkoutItems.appendChild(totalPriceElement);
}

window.onload = function() {
    displayCart();
};

function proceedToPayment() {
    alert("Proceeding to PayFast...");

    console.log(cart);
}

