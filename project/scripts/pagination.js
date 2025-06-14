// pagination.js
import { renderProducts } from './product-renderer.js';

export async function loadCatalogPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const sortBy = urlParams.get('sort');
    let page = parseInt(urlParams.get('page')) || 1;
    const limit = 8; 

    const paginationControlsContainer = document.getElementById('pagination-controls');
    if (!paginationControlsContainer) {
        console.error("Pagination controls container not found.");
        return;
    }

    const { totalProducts, currentPage, totalPages } = await renderProducts(
        'catalog-products-cards', sortBy, limit, page, category, 'catalog_title'
    );

    paginationControlsContainer.innerHTML = ''; 

    if (totalPages > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.classList.add('pagination-button', 'm2');
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            updateUrlAndReloadCatalog(category, sortBy, currentPage - 1);
        });
        paginationControlsContainer.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('pagination-button', 'm2');
            
            if (i === currentPage) {
                pageButton.classList.add('active-page');
            }
            pageButton.addEventListener('click', () => {
                updateUrlAndReloadCatalog(category, sortBy, i);
            });
            paginationControlsContainer.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.classList.add('pagination-button', 'm2');
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            updateUrlAndReloadCatalog(category, sortBy, currentPage + 1);
        });
        paginationControlsContainer.appendChild(nextButton);
    } else if (totalProducts > 0) {
        const currentPageInfo = document.createElement('span');
        currentPageInfo.textContent = `Page 1 of 1`;
        currentPageInfo.classList.add('pagination-info', 'm2');
        paginationControlsContainer.appendChild(currentPageInfo);
    }
}

export function updateUrlAndReloadCatalog(category, sortBy, newPage) {
    const urlParams = new URLSearchParams(window.location.search);
    if (category) {
        urlParams.set('category', category);
    } else {
        urlParams.delete('category'); 
    }
    if (sortBy) {
        urlParams.set('sort', sortBy);
    } else {
        urlParams.delete('sort');
    }
    urlParams.set('page', newPage.toString());

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    
    window.history.pushState({ path: newUrl }, '', newUrl);

    loadCatalogPage();
}