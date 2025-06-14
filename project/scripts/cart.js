// scripts/cart.js

const CART_STORAGE_KEY = 'shoppingCart';
const cartItemCountElement = document.getElementById('cart-item-count');

/**
 * Gets the shopping cart from localStorage.
 * @returns {Array} An array of product objects in the cart.
 */
function getCart() {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
}

/**
 * Save your shopping cart in localStorage.
 * @param {Array} cart The array of product objects to store.
 */
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCountDisplay();
}

/**
 * Updates the display of the item counter in the cart.
 */
function updateCartCountDisplay() {

    if (cartItemCountElement) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        cartItemCountElement.textContent = totalItems;
        if (totalItems > 0) {
            cartItemCountElement.classList.remove('hidden');
        } else {
            cartItemCountElement.classList.add('hidden');
        }
    }
}

/**
 * Add a product to the cart.
 * @param {object} product The product object to add (must contain id, title, price, image, etc.).
 */
export function addProductToCart(product) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
    console.log('Product added to cart:', product.title);
    // console.log('Currently Cart:', cart); 
    renderCartItems();
}

/**
 * Decreases the quantity of a product in the cart. If the quantity reaches 0, it deletes it.
 * @param {number} productId The product ID.
 */
export function decreaseProductQuantity(productId) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {

            cart.splice(itemIndex, 1);
        }
        saveCart(cart);
        console.log(`Quantity of product with ID ${productId} updated.`);
        renderCartItems();
    }
}

/**
 * Remove a product completely from the cart.
 * @param {number} productId The ID of the product to be deleted.
 */
export function removeProductFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    console.log(`Product with ID ${productId} removed from cart.`);
    renderCartItems();
}

/**
 * Empty the cart completely.
 */
export function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartCountDisplay();
    renderCartItems();
    console.log('Cart emptied.');
}

/**
 * Calculates the subtotal of the cart.
 * @returns {number} The total subtotal of all items in the cart.
 */
export function getCartSubtotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}


/**
 * Renders the cart items on the cart.html page
 */
export function renderCartItems() {
    const cartContainer = document.getElementById('cart');
    if (!cartContainer) {
        console.error("Cart container with ID 'cart' not found.");
        return;
    }

    const cart = getCart();
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. Start shopping now!</p>';

        const asideAdmin = document.querySelector('.cart-page aside');
        if (asideAdmin) asideAdmin.style.display = 'none';

        const cartSummary = document.getElementById('cart-summary');
        if (cartSummary) cartSummary.innerHTML = '';
        return;
    } else {

        const asideAdmin = document.querySelector('.cart-page aside');
        if (asideAdmin) asideAdmin.style.display = 'block';
    }

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.dataset.productId = item.id;

        cartItemDiv.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price"><sup>USD </sup>$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity-controls">
                    <button class="decrease-quantity" data-product-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-quantity" data-product-id="${item.id}">+</button>
                </div>
                <button class="remove-from-cart-btn" data-product-id="${item.id}">Remove</button>
            </div>
        `;
        cartContainer.appendChild(cartItemDiv);
    });

    // render summary after rendering items
    renderCartSummary();
}

/**
 * Renders the cart summary (subtotal, etc.).
 */
function renderCartSummary() {
    const cartSummaryContainer = document.getElementById('cart-summary');
    if (!cartSummaryContainer) {
        console.warn("Cart summary container with ID 'cart-summary' not found.");
        return;
    }

    const cart = getCart();
    const totalItemsInCart = cart.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = getCartSubtotal();

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Format subtotal
    const formattedSubtotal = formatter.format(subtotal);

    cartSummaryContainer.innerHTML = `
        <div class="summary-line">
        <p>Items in cart:</p>
        <span>${totalItemsInCart}</span>
        </div>
        <div class="subtotal"><p>Subtotal:</p> <span><sup>USD </sup>$${formattedSubtotal}</span></div>
        <button class="checkout-btn">Proceed to Checkout</button>
    `;
}

/**
 * Initializes event listeners for “Add to Cart” buttons (on product pages)
 * and also the cart management buttons (in cart.html).
 */
export function initializeCartHandlers() {

    document.body.addEventListener('click', async (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(event.target.dataset.productId);
            if (!productId) {
                console.error('Product ID not found on add-to-cart-btn');
                return;
            }
            try {
                // Fetch product details for full product object (title, price, image, etc.)
                const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const product = await response.json();
                addProductToCart(product);
            } catch (error) {
                console.error('Error fetching product details for cart:', error);
            }
        }
    });

    // --- For cart management buttons in cart.html ---
    // Event delegation for quantity and delete buttons
    document.getElementById('cart')?.addEventListener('click', (event) => {
        const target = event.target;
        const productId = parseInt(target.dataset.productId);

        if (isNaN(productId)) return; 

        if (target.classList.contains('increase-quantity')) {
            const cart = getCart();
            const item = cart.find(i => i.id === productId);
            if (item) {
                addProductToCart(item); 
            }
        } else if (target.classList.contains('decrease-quantity')) {
            decreaseProductQuantity(productId);
        } else if (target.classList.contains('remove-from-cart-btn')) {
            removeProductFromCart(productId);
        }
    });

    // Event listener for the "Clear Cart" button
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Update cart count display on page load
    updateCartCountDisplay();
}