// script/toast.js

const toastNotificationElement = document.getElementById('cart-notification'); 
const toastMessageElement = toastNotificationElement ? toastNotificationElement.querySelector('p') : null;
const toastImageElement = toastNotificationElement ? toastNotificationElement.querySelector('img') : null;
const toastProgressBar = toastNotificationElement ? toastNotificationElement.querySelector('.cart-notification-progress') : null;
const toastActionButton = document.createElement('button');
toastActionButton.classList.add('toast-action-btn');
toastActionButton.style.display = 'none'; 
if (toastNotificationElement) {
    toastNotificationElement.appendChild(toastActionButton);
}

let notificationTimer;
let currentActionCallback = null; 

/**
 * Displays a “toast” type notification to the user.
 * @param {object} options Notification options.
 * @param {string} options.message The message to be displayed.
 * @param {string} [options.type='info'] Type of notification (‘success’, ‘error’, ‘warning’, ‘info’). Controls the image.
 * @param {number} [options.duration=3000] The duration in milliseconds.
 * @param {object} [options.action] Object for action button (e.g. “Undo”).
 * @param {string} options.action.text The text of the action button.
 * @param {function} options.action.callback The function to execute when the button is clicked.
 */
export function showToast(options) {
    if (!toastNotificationElement || !toastMessageElement || !toastImageElement || !toastProgressBar) {
        console.warn("Toast notification elements not found in DOM. Cannot show toast.");
        return;
    }

    const {
        message,
        type = 'info',
        duration = 3000,
        action = null
    } = options;

    clearTimeout(notificationTimer);

    toastMessageElement.textContent = message;
    let imageSrc = '';
    let imageAlt = '';
    let bgColor = '';
    let textColor = 'var(--blacktone)'; 

    switch (type) {
        case 'success':
            imageSrc = 'images/success.svg'; 
            imageAlt = 'Success icon';
            bgColor = 'var(--space-cadet)';
            textColor = 'white';
            break;
        case 'error':
            imageSrc = 'images/error.svg';
            imageAlt = 'Error icon';
            bgColor = '#dc3545';
            textColor = 'white';
            break;
        case 'warning':
            imageSrc = 'images/warning.svg';
            imageAlt = 'Warning icon';
            bgColor = '#ffc107';
            textColor = 'var(--blacktone)';
            break;
        case 'info':
        default:
            imageSrc = 'images/info.svg';
            imageAlt = 'Info icon';
            bgColor = 'var(--process-cyan)';
            textColor = 'white';
            break;
    }

    toastImageElement.src = imageSrc;
    toastImageElement.alt = imageAlt;
    toastNotificationElement.style.backgroundColor = bgColor;
    toastMessageElement.style.color = textColor;
    
    if (toastActionButton) {
        toastActionButton.style.color = textColor;
    }
    toastProgressBar.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; 

    // Handle action button
    if (action && action.text && typeof action.callback === 'function') {
        toastActionButton.textContent = action.text;
        toastActionButton.style.display = 'inline-block';
        currentActionCallback = action.callback; 
    } else {
        toastActionButton.style.display = 'none';
        currentActionCallback = null;
    }

    // Reset and restart progress bar animation
    toastProgressBar.style.animation = 'none';
    void toastProgressBar.offsetWidth;
    toastProgressBar.style.animation = `cart-notification-progress ${duration / 1000}s linear forwards`;

    // Show the toast
    toastNotificationElement.classList.remove('hidden');
    
    void toastNotificationElement.offsetWidth;
    toastNotificationElement.classList.add('show');

    notificationTimer = setTimeout(() => {
        hideToast();
    }, duration);
}

/**
 * Hides the toast notification.
 */
export function hideToast() {
    if (!toastNotificationElement) return;

    toastNotificationElement.classList.remove('show');
    
    setTimeout(() => {
        toastNotificationElement.classList.add('hidden');
        toastProgressBar.style.animation = 'none';
        toastActionButton.style.display = 'none';
        currentActionCallback = null;
    }, 300);
}

if (toastActionButton) {
    toastActionButton.addEventListener('click', () => {
        if (currentActionCallback) {
            currentActionCallback();
            hideToast();
        }
    });
}