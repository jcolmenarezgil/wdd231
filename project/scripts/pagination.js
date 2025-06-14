// js/pagination.js
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
    }

    const { totalProducts, currentPage, totalPages } = await renderProducts(
        'catalog-products-cards', sortBy, limit, page, category, 'catalog_title'
    );

    if (paginationControlsContainer) {
        paginationControlsContainer.innerHTML = ''; 

        if (totalPages > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.classList.add('pagination-button', 'm2');
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                updateCatalogAndUrl(category, sortBy, currentPage - 1);
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
                    updateCatalogAndUrl(category, sortBy, i);
                });
                paginationControlsContainer.appendChild(pageButton);
            }

            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.classList.add('pagination-button', 'm2');
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                updateCatalogAndUrl(category, sortBy, currentPage + 1);
            });
            paginationControlsContainer.appendChild(nextButton);
        } else if (totalProducts > 0) {
            const currentPageInfo = document.createElement('span');
            currentPageInfo.textContent = `Page 1 of 1`;
            currentPageInfo.classList.add('pagination-info', 'm2');
            paginationControlsContainer.appendChild(currentPageInfo);
        }
    }

    
    highlightActiveFilters(category, sortBy);
}


export function updateCatalogAndUrl(category, sortBy, newPage) {
    const currentUrlParams = new URLSearchParams(window.location.search);
    const newUrlParams = new URLSearchParams(); 

    if (category) {
        newUrlParams.set('category', category);
    }
    if (sortBy) {
        newUrlParams.set('sort', sortBy);
    }

    if (newPage > 1 || category || sortBy) { 
         newUrlParams.set('page', newPage.toString());
    } else { 
        newUrlParams.delete('page');
    }
   

    const newUrl = `${window.location.pathname}?${newUrlParams.toString()}`;
    
    if (window.location.search === `?${newUrlParams.toString()}`) {
        return;
    }

    window.history.pushState({ path: newUrl }, '', newUrl);

    
    loadCatalogPage();
}


function highlightActiveFilters(currentCategory, currentSortBy) {

    const categoryLinks = document.querySelectorAll('#category-filters a');
    categoryLinks.forEach(link => {
        const linkUrl = new URL(link.href);
        const linkCategory = linkUrl.searchParams.get('category');
        
        if (linkCategory === currentCategory) {
            link.classList.add('active-filter');
        } else {
            link.classList.remove('active-filter');
        }
    });

    
    const sortLinks = document.querySelectorAll('#sort-filters a');
    sortLinks.forEach(link => {
        const linkUrl = new URL(link.href);
        const linkSortBy = linkUrl.searchParams.get('sort');

        if (linkSortBy === currentSortBy) {
            link.classList.add('active-filter');
        } else {
            link.classList.remove('active-filter');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const categoryFilters = document.getElementById('category-filters');
    const sortFilters = document.getElementById('sort-filters');

    if (categoryFilters) {
        categoryFilters.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                event.preventDefault(); 
                const href = event.target.getAttribute('href');
                const url = new URL(href, window.location.origin); 
                const newCategory = url.searchParams.get('category');
                const currentSortBy = new URLSearchParams(window.location.search).get('sort');
                updateCatalogAndUrl(newCategory, currentSortBy, 1); 
            }
        });
    }

    if (sortFilters) {
        sortFilters.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                event.preventDefault(); 
                const href = event.target.getAttribute('href');
                const url = new URL(href, window.location.origin);
                const newSortBy = url.searchParams.get('sort');
                const currentCategory = new URLSearchParams(window.location.search).get('category');
                updateCatalogAndUrl(currentCategory, newSortBy, 1);
            }
        });
    }
});