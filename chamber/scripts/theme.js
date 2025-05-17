document.addEventListener('DOMContentLoaded', function() {
    const toggleMode = document.getElementById('toggleMode');
    const body = document.body;

    // Función para actualizar el ícono del toggle
    function updateToggleIcon() {
        if (body.classList.contains('dark-mode')) {
            toggleMode.classList.add('dark-mode-active');
        } else {
            toggleMode.classList.remove('dark-mode-active');
        }
    }

    // Verifica si hay un modo guardado previamente
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
        body.classList.add('dark-mode');
    }

    // Actualiza el ícono al cargar la página
    updateToggleIcon();

    toggleMode.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        updateToggleIcon(); // Actualiza el ícono al hacer clic

        // Guarda el estado del modo en localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});