document.addEventListener('DOMContentLoaded', function() {
    const toggleMode = document.getElementById('toggleMode');
    const body = document.body;

    
    function updateToggleIcon() {
        if (body.classList.contains('dark-mode')) {
            toggleMode.classList.add('dark-mode-active');
        } else {
            toggleMode.classList.remove('dark-mode-active');
        }
    }

    
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
        body.classList.add('dark-mode');
    }

    
    updateToggleIcon();

    toggleMode.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        updateToggleIcon(); 

        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});