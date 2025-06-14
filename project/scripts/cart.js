// js/cart.js

const CART_STORAGE_KEY = 'shoppingCart';
const cartItemCountElement = document.getElementById('cart-item-count');

/**
 * Obtiene el carrito de compra de localStorage.
 * @returns {Array} Un array de objetos de producto en el carrito.
 */
function getCart() {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
}

/**
 * Guarda el carrito de compra en localStorage.
 * @param {Array} cart El array de objetos de producto a guardar.
 */
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCountDisplay(); // Actualizar el contador cada vez que se guarda el carrito
}

/**
 * Actualiza la visualización del contador de ítems en el carrito.
 */
function updateCartCountDisplay() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Suma las cantidades

    if (cartItemCountElement) {
        cartItemCountElement.textContent = totalItems;
        if (totalItems > 0) {
            cartItemCountElement.classList.remove('hidden');
        } else {
            cartItemCountElement.classList.add('hidden');
        }
    }
}

/**
 * Agrega un producto al carrito.
 * @param {object} product El objeto del producto a agregar (debe contener id, title, price, image, etc.).
 */
export function addProductToCart(product) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        // Si el producto ya existe, incrementa la cantidad
        cart[existingItemIndex].quantity += 1;
    } else {
        // Si no existe, agrega el nuevo producto con cantidad 1
        cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
    console.log('Producto añadido al carrito:', product.title);
    console.log('Carrito actual:', cart);
}

/**
 * Elimina un producto del carrito.
 * @param {number} productId El ID del producto a eliminar.
 */
export function removeProductFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    console.log(`Producto con ID ${productId} eliminado del carrito.`);
}

/**
 * Vacía completamente el carrito.
 */
export function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartCountDisplay();
    console.log('Carrito vaciado.');
}

/**
 * Inicializa los event listeners para los botones "Add to Cart"
 * y actualiza el contador del carrito al cargar la página.
 */
export function initializeCart() {
    // Escucha eventos de clic en los botones "Add to Cart"
    // Usamos delegación de eventos en el body para capturar los clics en elementos que se añaden dinámicamente
    document.body.addEventListener('click', async (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productId = parseInt(event.target.dataset.productId);
            if (!productId) {
                console.error('Product ID not found on add-to-cart-btn');
                return;
            }

            // Para obtener la información completa del producto, haremos un fetch individual.
            // Esto es importante porque el botón solo tiene el ID, no el título, precio, etc.
            try {
                const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const product = await response.json();
                addProductToCart(product);
                // Opcional: mostrar una notificación "Producto añadido"
            } catch (error) {
                console.error('Error fetching product details for cart:', error);
                // Opcional: mostrar un mensaje de error al usuario
            }
        }
    });

    // Actualiza el contador al cargar la página
    updateCartCountDisplay();
}