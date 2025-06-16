// scripts/cart.js

import { showToast, hideToast } from './toast.js';
import { openModal, closeModal } from './modal.js';

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
    let isNewItem = false;

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
        isNewItem = true; // Flag para saber si es un nuevo item
    }
    saveCart(cart);
    console.log('Product added to cart:', product.title);

    showToast({
        message: `${product.title} added to cart!`,
        type: 'success',
        duration: 4000,
        action: {
            text: 'Undo',
            callback: () => {
                removeProductFromCart(product.id);
                showToast({ message: `${product.title} removed!`, type: 'info', duration: 2000 });
            }
        }
    });

    renderCartItems();
}

/**
 * Decreases the quantity of a product in the cart. If the quantity reaches 0, it deletes it.
 * @param {number} productId The product ID.
 */
export function decreaseProductQuantity(productId) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    let removedCompletely = false;
    let productName = '';

    if (itemIndex > -1) {
        productName = cart[itemIndex].title;
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
            removedCompletely = true;
        }
        saveCart(cart);
        console.log(`Quantity of product with ID ${productId} updated.`);

        if (removedCompletely) {
            showToast({
                message: `${productName} removed from cart.`,
                type: 'info',
                duration: 5000,
                action: {
                    text: 'Undo',
                    callback: () => {
                        // Re-add the product to the cart
                        console.log(`UNDO: Re-adding ${productName} (ID: ${productId}).`);
                        // Get product details again if needed
                        fetch(`https://fakestoreapi.com/products/${productId}`).then(res => res.json()).then(product => {
                            addProductToCart(product);
                        });
                        showToast({ message: `${productName} restored!`, type: 'success', duration: 2000 });
                    }
                }
            });
        } else {
            showToast({
                message: `Quantity of ${productName} updated.`,
                type: 'info',
                duration: 2000
            });
        }
        renderCartItems();
    }
}

/**
 * Remove a product completely from the cart.
 * @param {number} productId The ID of the product to be deleted.
 */
export function removeProductFromCart(productId) {
    let cart = getCart();
    const itemToRemove = cart.find(item => item.id === productId);
    let productName = itemToRemove ? itemToRemove.title : 'Item';

    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    console.log(`Product with ID ${productId} removed from cart.`);

    showToast({
        message: `${productName} removed from cart.`,
        type: 'info',
        duration: 4000,
        action: {
            text: 'Undo',
            callback: () => {
                // Re-add the product to the cart
                console.log(`UNDO: Re-adding ${productName} (ID: ${productId}).`);
                // Get product details again if needed
                fetch(`https://fakestoreapi.com/products/${productId}`).then(res => res.json()).then(product => {
                    addProductToCart(product);
                });
                showToast({ message: `${productName} restored!`, type: 'success', duration: 2000 });
            }
        }
    });
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
    showToast({
        message: 'Your cart has been cleared!',
        type: 'warning',
        duration: 3000
    });
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

    const checkoutBtn = cartSummaryContainer.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showCheckoutFormInModal);
    }
}

/**
 * Determines the type of credit card based on the prefix.
 * @param {string} cardNumber The credit card number (or a prefix).
 * @returns {string} The type of card (‘visa’, ‘mastercard’, ‘amex’, etc.) or ‘default’ if it is not recognized.
 */
function getCardType(cardNumber) {
    cardNumber = cardNumber.replace(/\D/g, '');
    if (cardNumber.length < 2) return 'default'; 

    // Source: https://www.regular-expressions.info/creditcard.html
    // Visa: 4
    if (/^4/.test(cardNumber)) return 'visa';
    // Mastercard: 51-55, 2221-2720
    if (/^5[1-5]|^2(?:22[1-9]|2[3-9][0-9]|2[0-7][0-1]|7[0-1][0-9]|720)/.test(cardNumber)) return 'mastercard';
    // American Express: 34, 37
    if (/^3[47]/.test(cardNumber)) return 'amex';
    // Discover: 6011, 622126-622925, 644-649, 65
    if (/^6(?:011|5|4[4-9]|22(?:1(?:2[6-9]|[3-9][0-9])|[2-8][0-9]{2}|9(?:[01][0-9]|2[0-5])))/.test(cardNumber)) return 'discover';
    // Diners Club: 300-305, 309, 36, 38, 39
    if (/^3(?:0[0-5]|[689])/.test(cardNumber)) return 'diners';
    // JCB: 3528-3589
    if (/^35(?:2[8-9]|[3-8][0-9])/.test(cardNumber)) return 'jcb';

    return 'default';
}

/**
 * Displays the checkout form within the generic modal.
 */
function showCheckoutFormInModal() {
    const checkoutFormHTML = `
    <div class="checkout-form-content">
        <h2>Complete Your Order</h2>
        <form id="checkout-form">
            <fieldset>
                <legend>Personal Information</legend>
                <div class="form-group">
                    <label for="fullName">Full Name:</label>
                    <input type="text" id="fullName" name="fullName" placeholder="John Doe" autocomplete="given-name"
                        required>
                </div>

                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="email@example.com" autocomplete="email"
                        required>
                </div>
            </fieldset>

            <fieldset>
                <legend>Payment Information</legend>


                <div class="form-group">
                    <label for="address1">Address Line 1:</label>
                    <input type="text" id="address1" name="address1" placeholder="1234 Main St" autocomplete="address-line1" required>
                </div>

                <div class="form-group">
                    <label for="state">State/Province:</label>
                    <input type="text" id="state" name="state" placeholder="EC-P" autocomplete="address-level1" required>
                </div>

                <div class="form-group-line">
                    <div>
                        <label for="city">City:</label>
                        <input type="text" id="city" name="city" placeholder="Quito" autocomplete="address-level2" required>
                    </div>
                    <div>
                        <label for="zip">Zip/Postal Code:</label>
                        <input type="number" id="zip" class="no-spin" name="zip" placeholder="170515"
                            autocomplete="postal-code" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="country">Country:</label>
                    <select id="country" name="country" required>
                        <option value="">Select a country</option>
                        <option value="EC">Ecuador</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="ES">Spain</option>
                    </select>
                </div>

                <div class="form-group card-number-group">
                    <label for="cardNumber">Credit Card Number:</label>
                    <div class="card-input-wrapper">
                        <input type="text" id="cardNumber" name="cardNumber" placeholder="XXXX XXXX XXXX XXXX" required
                            pattern="[0-9 ]{13,19}">
                        <img id="card-logo" src="images/default.webp" alt="Card type" class="card-logo">
                    </div>
                </div>
                <div class="form-group-line">
                    <div>
                        <label for="expiryDate">Expiry Date (MM/YY):</label>
                        <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required
                            pattern="(0[1-9]|1[0-2])\/?([0-9]{2})">
                    </div>
                    <div>
                        <label for="cvv">CVV:</label>
                        <input type="text" id="cvv" name="cvv" placeholder="XXX" required pattern="[0-9]{3,4}">
                    </div>
                </div>
            </fieldset>

            <button type="submit" class="m2 checkout-submit-btn">Place Order</button>

        </form>
    </div>
    `;

    openModal(checkoutFormHTML, {
        closeButton: true,
        onClose: () => {
            console.log('Checkout form modal closed.');
            const form = document.getElementById('checkout-form');
            if (form) form.reset();
        }
    });

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        const cardNumberInput = checkoutForm.querySelector('#cardNumber');
        const cardLogoImg = checkoutForm.querySelector('#card-logo');

        if (cardNumberInput && cardLogoImg) {
            cardNumberInput.addEventListener('input', (event) => {
                const number = event.target.value.replace(/\s/g, ''); 
                const cardType = getCardType(number);
                cardLogoImg.src = `images/${cardType}.webp`;
                cardLogoImg.alt = `${cardType} card`;

                let formattedNumber = '';
                if (cardType === 'amex') {
                    formattedNumber = number.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim();
                } else {
                    formattedNumber = number.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                }
                event.target.value = formattedNumber;
            });

            cardNumberInput.dispatchEvent(new Event('input'));
        }

        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(checkoutForm);
            const orderDetails = Object.fromEntries(formData.entries());

            orderDetails.cardNumber = "************" + orderDetails.cardNumber.slice(-4);
            orderDetails.cvv = "***";
            orderDetails.expiryDate = "**/****";

            const cart = getCart();
            
            orderDetails.cartItems = JSON.stringify(cart.map(item => ({ id: item.id, quantity: item.quantity })));

            const subtotal = getCartSubtotal();
            orderDetails.totalAmount = subtotal.toFixed(2); 

            const queryString = new URLSearchParams(orderDetails).toString();

            window.location.href = `order-confirmation.html?${queryString}`;
        });

        const cancelBtn = checkoutForm.querySelector('.modal-close-btn-in-form');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }
    }
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