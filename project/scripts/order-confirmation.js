// scripts/order-confirmation.js

import { showToast } from './toast.js'; // Asegúrate de que toast.js exista y exporte showToast
import { clearCart } from './cart.js'; // Asegúrate de que cart.js exista y exporte clearCart

// Función para obtener parámetros de la URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const queryData = {};
    for (const [key, value] of params.entries()) {
        queryData[key] = value;
    }
    return queryData;
}

// Función para obtener detalles de un producto por su ID (simulado o real)
// Esta función es crucial para mostrar detalles ricos de los productos
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching product details for ID ${productId}:`, error);
        return null;
    }
}

/**
 * Initializes the logic specific to the order confirmation page.
 * Should only be called when the user is in order-confirmation.html.
 */
export async function initializeOrderConfirmationPage() {
    console.log('Initializing Order Confirmation Page...');
    const orderDetailsContainer = document.getElementById('order-details');
    const productListSummaryContainer = document.getElementById('product-list-summary');
    const params = getQueryParams();

    let customerDetailsHtml = '<h3>Customer & Shipping Details</h3>';
    if (Object.keys(params).length > 0) {
        customerDetailsHtml += '<ul class="order-details-list">';
        const keysToShow = ['fullName', 'email', 'address1', 'city', 'state', 'zip', 'country', 'cardNumber', 'expiryDate', 'cvv', 'totalAmount'];

        for (const key of keysToShow) {
            if (params[key]) {
                let displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                if (key === 'fullName') displayKey = 'Full Name';
                if (key === 'email') displayKey = 'Email Address';
                if (key === 'address1') displayKey = 'Address Line 1';
                if (key === 'state') displayKey = 'State/Province';
                if (key === 'zip') displayKey = 'Zip/Postal Code';
                if (key === 'cardNumber') displayKey = 'Credit Card (Last 4)';
                if (key === 'expiryDate') displayKey = 'Expiry Date';
                if (key === 'cvv') displayKey = 'CVV';
                if (key === 'totalAmount') displayKey = 'Total Amount';

                customerDetailsHtml += `<li><strong>${displayKey}:</strong> ${params[key]}</li>`;
            }
        }
        customerDetailsHtml += '</ul>';
    } else {
        customerDetailsHtml += '<p>No order details found. Please go back to the <a href="cart.html">cart</a> to place an order.</p>';
    }
    if (orderDetailsContainer) {
        orderDetailsContainer.innerHTML = customerDetailsHtml;
    } else {
        console.warn("Element with ID 'order-details' not found in order-confirmation.html");
    }

    let productsHtml = '<h3>Items Purchased</h3>';
    let hasProductsToDisplay = false;
    if (params.cartItems) {
        try {
            const cartItemsData = JSON.parse(params.cartItems);
            if (cartItemsData.length > 0) {
                productsHtml += '<div class="confirmation-product-grid">';
                let totalAmountCalculated = 0;

                const productPromises = cartItemsData.map(item => fetchProductDetails(item.id).then(product => ({ item, product })));

                const results = await Promise.all(productPromises);

                for (const { item, product } of results) {
                    if (product) {
                        const itemTotal = product.price * item.quantity;
                        totalAmountCalculated += itemTotal;
                        productsHtml += `
                            <div class="confirmation-product-item">
                                <img src="${product.image}" alt="${product.title}">
                                <div class="product-info">
                                    <h4>${product.title}</h4>
                                    <p>Quantity: ${item.quantity}</p>
                                    <p>Price: <sup>USD </sup>$${product.price.toFixed(2)}</p>
                                    <p class="item-total">Subtotal: <sup>USD </sup>$${itemTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        `;
                        hasProductsToDisplay = true; 
                    } else {
                        productsHtml += `<p>Error loading product with ID: ${item.id}</p>`;
                    }
                }
                productsHtml += `</div>
                <div class="confirmation-total-summary">
                    <p>Total Confirmed: <strong><sup>USD </sup>$${totalAmountCalculated.toFixed(2)}</strong></p>
                </div>`;

                if (hasProductsToDisplay) {
                    clearCart();
                    showToast({ message: 'Order placed successfully! Your cart has been emptied.', type: 'success', duration: 4000 });
                }

            } else {
                productsHtml += '<p>No product items found in the order.</p>';
            }
        } catch (e) {
            console.error("Error parsing cartItems from URL:", e);
            productsHtml += '<p>Error displaying product details.</p>';
        }
    } else {
        productsHtml += '<p>No product items found in the order.</p>';
    }

    if (productListSummaryContainer) {
        productListSummaryContainer.innerHTML = productsHtml;
    } else {
        console.warn("Element with ID 'product-list-summary' not found in order-confirmation.html");
    }

    const downloadReceiptBtn = document.getElementById('download-receipt-btn');
    if (downloadReceiptBtn) {
        downloadReceiptBtn.addEventListener('click', () => {
            const productsText = productListSummaryContainer ? productListSummaryContainer.innerText : 'No products listed.';
            const customerDetailsText = orderDetailsContainer ? orderDetailsContainer.innerText : 'No customer details listed.';

            const receiptContent = `
            Order Confirmation

            ------------------------------------
            Order Summary
            ------------------------------------
            ${productsText}

            ------------------------------------
            Customer & Shipping Details
            ------------------------------------
            ${customerDetailsText}

            Thank you for your purchase!
            `;
            const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `order_confirmation_${new Date().toISOString().slice(0, 10)}.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            showToast({ message: 'Receipt downloaded!', type: 'info', duration: 2000 });
        });
    }
}