// Shopping Cart State
let cart = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeEventListeners();
    updateCartDisplay();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    // Purchase button
    const purchaseButton = document.getElementById('btn-purchase');
    purchaseButton.addEventListener('click', handlePurchase);
}

// Handle Add to Cart button click
function handleAddToCart(event) {
    const button = event.currentTarget;
    const productId = button.getAttribute('data-product-id');
    const productName = button.getAttribute('data-product-name');
    const productPrice = parseFloat(button.getAttribute('data-product-price'));

    // Custom code for Add to Cart
    console.log('=== ADD TO CART CLICKED ===');
    console.log('Product ID:', productId);
    console.log('Product Name:', productName);
    console.log('Product Price:', productPrice);
    console.log('Timestamp:', new Date().toISOString());

    // Add product to cart
    addToCart(productId, productName, productPrice);

    // Visual feedback
    button.classList.add('added');
    const originalText = button.textContent;
    button.textContent = 'Added!';

    setTimeout(() => {
        button.classList.remove('added');
        button.textContent = originalText;
    }, 1000);

    // Animate cart icon
    animateCartIcon();

    // You can add your custom logic here
    // For example: send analytics, update database, show notification, etc.
    customAddToCartLogic(productId, productName, productPrice);
}

// Custom Add to Cart Logic (You can modify this)
function customAddToCartLogic(productId, productName, productPrice) {
    // Example: Log to console
    console.log('Custom Add to Cart Logic Executed');

    // Example: Show a custom alert
    // alert(`${productName} has been added to your cart!`);

    // Example: Send to analytics
    // trackEvent('add_to_cart', { product_id: productId, product_name: productName, price: productPrice });

    // Example: Save to localStorage
    localStorage.setItem('lastAddedProduct', JSON.stringify({
        id: productId,
        name: productName,
        price: productPrice,
        timestamp: new Date().toISOString()
    }));

    // VWO Event Tracking - Add to Cart
    // Do not change anything in the following two lines
    window.VWO = window.VWO || [];
    VWO.event = VWO.event || function () { VWO.push(["event"].concat([].slice.call(arguments))) };

    // Replace the property values with your actual values
    VWO.event("addToCart", {
        "productCategory": "Electronics",
        "cartAmount": productPrice
    });

    // Example: Custom notification
    showCustomNotification(`${productName} added to cart!`);
}

// Add product to cart array
function addToCart(productId, productName, productPrice) {
    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    const cartCountElement = document.getElementById('cart-count');
    const cartItemsElement = document.getElementById('cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    const purchaseButton = document.getElementById('btn-purchase');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Update cart items display
    if (cart.length === 0) {
        cartItemsElement.innerHTML = `
            <h3 class="cart-title">Shopping Cart</h3>
            <p class="empty-cart-message">Your cart is empty</p>
        `;
        purchaseButton.disabled = true;
    } else {
        let cartHTML = '<h3 class="cart-title">Shopping Cart</h3><div class="cart-items-list">';

        cart.forEach(item => {
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-quantity">Quantity: ${item.quantity}</div>
                    </div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });

        cartHTML += '</div>';
        cartItemsElement.innerHTML = cartHTML;
        purchaseButton.disabled = false;
    }

    // Update total amount
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmountElement.textContent = `$${total.toFixed(2)}`;
}

// Handle Purchase button click
function handlePurchase(event) {
    if (cart.length === 0) {
        return;
    }

    // Custom code for Purchase
    console.log('=== PURCHASE BUTTON CLICKED ===');
    console.log('Cart Contents:', JSON.stringify(cart, null, 2));
    console.log('Total Items:', cart.reduce((sum, item) => sum + item.quantity, 0));
    console.log('Total Amount:', cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2));
    console.log('Timestamp:', new Date().toISOString());

    // You can add your custom purchase logic here
    customPurchaseLogic();
}

// Custom Purchase Logic (You can modify this)
function customPurchaseLogic() {
    console.log('Custom Purchase Logic Executed');

    // Example: Calculate order summary
    const orderSummary = {
        orderId: generateOrderId(),
        items: cart,
        totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        tax: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1, // 10% tax
        timestamp: new Date().toISOString()
    };

    orderSummary.total = orderSummary.subtotal + orderSummary.tax;

    console.log('Order Summary:', orderSummary);

    // Example: Save to localStorage
    localStorage.setItem('lastOrder', JSON.stringify(orderSummary));

    // Example: Send to backend API
    // fetch('/api/orders', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(orderSummary)
    // });

    // VWO Event Tracking - Purchase
    // Do not change anything in the following two lines
    window.VWO = window.VWO || [];
    VWO.event = VWO.event || function () { VWO.push(["event"].concat([].slice.call(arguments))) };

    // Replace the property values with your actual values
    const avgPrice = orderSummary.totalItems > 0 ? orderSummary.total / orderSummary.totalItems : 0;
    VWO.event("purchase", {
        "totalPrice": orderSummary.total,
        "avg": avgPrice,
        "itemsQuantity": orderSummary.totalItems,
        "productCategory": "Electronics"
    });

    // Show success message
    showPurchaseSuccessMessage(orderSummary);

    // Clear cart after purchase
    setTimeout(() => {
        cart = [];
        updateCartDisplay();
    }, 3000);
}

// Generate a random order ID
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Show custom notification
function showCustomNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;

    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show purchase success message
function showPurchaseSuccessMessage(orderSummary) {
    const message = `🎉 Purchase Successful! Order ID: ${orderSummary.orderId} | Total: $${orderSummary.total.toFixed(2)} | Items: ${orderSummary.totalItems}`;

    // Show custom notification instead of alert
    showCustomNotification(message);

    // You can replace this with a custom modal or notification
    console.log('Purchase completed successfully!');
    console.log('Order Details:', orderSummary);
}

// Animate cart icon
function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon-wrapper');
    cartIcon.style.animation = 'none';
    setTimeout(() => {
        cartIcon.style.animation = 'pulse 0.5s ease';
    }, 10);
}

// Additional utility functions you can use

// Clear entire cart
function clearCart() {
    cart = [];
    updateCartDisplay();
    console.log('Cart cleared');
}

// Remove specific item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    console.log(`Product ${productId} removed from cart`);
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            product.quantity = newQuantity;
            updateCartDisplay();
        }
    }
}

// Get cart total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Export cart data
function exportCartData() {
    return {
        items: cart,
        total: getCartTotal(),
        itemCount: getCartItemCount(),
        timestamp: new Date().toISOString()
    };
}

// Console helper - shows available functions
console.log(`
🛒 E-Commerce Cart System Loaded!

Available functions you can use in the console:
- clearCart() - Clear all items from cart
- removeFromCart(productId) - Remove specific item
- updateQuantity(productId, newQuantity) - Update item quantity
- getCartTotal() - Get total cart value
- getCartItemCount() - Get total items in cart
- exportCartData() - Export cart data as JSON

Cart state is available in the 'cart' variable.
`);