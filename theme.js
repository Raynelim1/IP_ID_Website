(function () {
    const storageKey = 'site-theme-mode';

    function applySavedTheme() {
        const mode = localStorage.getItem(storageKey);
        document.body.classList.toggle('dark-mode', mode === 'dark');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applySavedTheme);
    } else {
        applySavedTheme();
    }

    window.addEventListener('storage', (event) => {
        if (event.key === storageKey) {
            applySavedTheme();
        }
    });
})();
