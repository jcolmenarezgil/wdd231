// scripts/product-renderer.js

import { addProductToCart } from './cart.js'; 
import { openModal, closeModal } from './modal.js'; 

const API_URL = 'https://fakestoreapi.com/products';
let allProductsCache = []; 

/**
 * Fetches products from the API, filters, sorts, and renders them into a specified container.
 * @param {string} containerId The ID of the HTML element where products will be rendered.
 * @param {string} [sortBy='rating_desc'] The criteria to sort by: 'rating_desc', 'price_asc', 'popular_desc'.
 * @param {number} [limit=8] The maximum number of products to display per page.
 * @param {number} [page=1] The current page number for pagination.
 * @param {string} [category=null] The category to filter products by.
 * @param {string} [titleElementId=null] The ID of the H1 element to update with the catalog title.
 * @returns {Promise<object>} A promise that resolves with an object containing { totalProducts, currentPage, totalPages }.
 */
export async function renderProducts(containerId, sortBy = 'rating_desc', limit = 8, page = 1, category = null, titleElementId = null) {
    const cardsContainer = document.getElementById(containerId);
    if (!cardsContainer) {
        console.error(`Container with ID '${containerId}' not found.`);
        return { totalProducts: 0, currentPage: page, totalPages: 0 };
    }

    cardsContainer.innerHTML = Array(limit).fill(`
        <div class="skeleton">
            <div class="skeleton-image sq-loader"></div>
            <div class="skeleton-text ln-loader">
                <div class="skeleton-title ln-loader"></div>
                <div class="skeleton-price ln-loader"></div>
            </div>
        </div>
    `).join('');

    const catalogTitleElement = titleElementId ? document.getElementById(titleElementId) : null;
    let titleTextBase = 'All Products';
    if (category) {
        titleTextBase = category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    try {
        if (allProductsCache.length === 0) {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProductsCache = await response.json(); 
        }

        let filteredProducts = allProductsCache;
        if (category) {
            filteredProducts = allProductsCache.filter(product => product.category === category);
        }

        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / limit);

        if (catalogTitleElement) {
            catalogTitleElement.textContent = `${titleTextBase} (${totalProducts} Items)`;
        }

        if (totalProducts === 0) {
            cardsContainer.innerHTML = '<div class="no-products"><p>No products found for this selection.</p></div>';
            if (catalogTitleElement) {
                catalogTitleElement.textContent = `${titleTextBase} (No Products)`;
            }
            return { totalProducts: 0, currentPage: page, totalPages: 0 };
        }

        switch (sortBy) {
            case 'rating_desc':
                filteredProducts.sort((a, b) => b.rating.rate - a.rating.rate);
                break;
            case 'price_asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'popular_desc':
                filteredProducts.sort((a, b) => b.rating.count - a.rating.count);
                break;
            default:

                break;
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

        cardsContainer.innerHTML = '';

        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-category">${product.category.replace("women's clothing", "Women's Clothing").replace("men's clothing", "Men's Clothing")}</p>
                    <p class="product-price"><sup>USD </sup>$${product.price.toFixed(2)}</p>
                    <div class="product-rating">
                        <span class="rating-value">${product.rating.rate}</span> 
                        <span class="rating-count">(${product.rating.count} reviews)</span>
                    </div>
                </div>
                <button class="add-to-cart-btn m2" data-product-id="${product.id}">Add to Cart</button>
            `;
            cardsContainer.appendChild(productCard);

            const clickableElements = productCard.querySelectorAll('.product-image-wrapper img, .product-info .product-title');
            clickableElements.forEach(element => {
                
                element.addEventListener('click', () => {
                    displayProductDetailsInModal(product); 
                });
            });
        });

        return { totalProducts, currentPage: page, totalPages };

    } catch (error) {
        console.error('Error fetching or rendering products:', error);
        cardsContainer.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>';
        if (catalogTitleElement) {
            catalogTitleElement.textContent = `${titleTextBase} (Error Loading)`;
        }
        return { totalProducts: 0, currentPage: page, totalPages: 0 };
    }
}

/**
 * Displays the complete details of a product in the modal.
 * @param {object} product The complete object of the product to be displayed.
 */
async function displayProductDetailsInModal(product) {

    if (!product) {
        console.error("Product object is null or undefined.");
        return;
    }

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const formattedPrice = formatter.format(product.price);

    const modalContent = `
        <div class="product-modal-content">
            <img src="${product.image}" alt="${product.title}">
            <div class="product-modal-details">
                <h2>${product.title}</h2>
                <p class="product-modal-category">${product.category.replace("women's clothing", "Women's Clothing").replace("men's clothing", "Men's Clothing")}</p>
                <p class="product-modal-price"><sup>USD </sup>$${formattedPrice}</p>
                <p class="product-modal-description">${product.description}</p>
                <div class="product-modal-rating">
                    <span class="rating-value">${product.rating.rate}</span> 
                    <span class="rating-count">(${product.rating.count} reviews)</span>
                </div>
                <button class="add-to-cart-btn m2" data-product-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;

    openModal(modalContent, {
        onClose: () => {
            console.log('Product details modal closed.');
        }
    });

    const addToCartBtnInModal = document.querySelector('.product-modal-content .add-to-cart-btn');
    if (addToCartBtnInModal) {
        addToCartBtnInModal.addEventListener('click', (event) => {
            event.stopPropagation();
            addProductToCart(product);
            closeModal(); 
        });
    }
}