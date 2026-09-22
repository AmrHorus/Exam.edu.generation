/**
 * Theme Manager Module
 * Handles light/dark/system theme switching with Sun.jpg and Moon.jpg images
 */

const ThemeManager = {
    THEME_KEY: 'exam_theme',
    
    /**
     * Initialize theme manager - must be called early to prevent flash
     */
    init() {
        const savedTheme = localStorage.getItem(this.THEME_KEY) || 'system';
        this.applyTheme(savedTheme);
        this.updateButtonStates(savedTheme);
        this.bindEvents();
        this.listenForSystemChanges();
    },
    
    /**
     * Apply theme immediately (called on page load)
     * @param {string} theme - 'light', 'dark', or 'system'
     */
    applyTheme(theme) {
        const root = document.documentElement;
        root.removeAttribute('data-theme');
        
        if (theme === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', systemDark ? 'dark' : 'light');
        } else {
            root.setAttribute('data-theme', theme);
        }
    },
    
    /**
     * Set the active theme
     * @param {string} theme - 'light', 'dark', or 'system'
     * @param {boolean} save - Whether to save to localStorage
     */
    setTheme(theme, save = true) {
        if (save) {
            localStorage.setItem(this.THEME_KEY, theme);
        }
        
        this.applyTheme(theme);
        this.updateButtonStates(theme);
    },
    
    /**
     * Update button active states
     * @param {string} theme - Current theme
     */
    updateButtonStates(theme) {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
        
        // Also update settings theme radios if they exist
        document.querySelectorAll('input[name="theme-setting"]').forEach(radio => {
            radio.checked = radio.value === theme;
        });
    },
    
    /**
     * Bind theme toggle events
     */
    bindEvents() {
        // Header theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.setTheme(theme);
            });
        });
        
        // Settings theme radios
        document.querySelectorAll('input[name="theme-setting"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        });
    },
    
    /**
     * Listen for system theme changes
     */
    listenForSystemChanges() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
            const currentTheme = localStorage.getItem(this.THEME_KEY) || 'system';
            if (currentTheme === 'system') {
                this.applyTheme('system');
            }
        };
        
        mediaQuery.addEventListener('change', handleChange);
    },
    
    /**
     * Get current theme
     * @returns {string} Current theme
     */
    getTheme() {
        return localStorage.getItem(this.THEME_KEY) || 'system';
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
