// js/modal.js

const mainModal = document.getElementById('main-modal');
let currentCloseCallback = null;

/**
 * Open the modal and set its contents.
 * @param {string} contentHTML The HTML to inject into the modal.
 * @param {object} [options] Additional options.
 * @param {boolean} [options.closeButton=true] If the close button should be displayed.
 * @param {function} [options.onClose] A function that will be executed when the modal is closed.
 */
export function openModal(contentHTML, options = {}) {
    if (!mainModal) {
        console.error("Main modal element with ID 'main-modal' not found.");
        return;
    }

    const { closeButton = true, onClose = null } = options;

    mainModal.innerHTML = '';
    currentCloseCallback = onClose;

    if (closeButton) {
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('modal-close-btn');
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Close modal');
        closeBtn.addEventListener('click', closeModal);
        mainModal.appendChild(closeBtn);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('modal-content-wrapper');
    contentWrapper.innerHTML = contentHTML;
    mainModal.appendChild(contentWrapper);

    mainModal.showModal();
}

/**
 * Closes the modal.
 */
export function closeModal() {
    if (mainModal && mainModal.open) {
        mainModal.close();
        
        if (currentCloseCallback && typeof currentCloseCallback === 'function') {
            currentCloseCallback();
            currentCloseCallback = null; 
        }
    }
}

// Listen to the ‘cancel’ event (Escape key) to close the modal
if (mainModal) {
    mainModal.addEventListener('cancel', (event) => {
        event.preventDefault();
        closeModal();
    });
}