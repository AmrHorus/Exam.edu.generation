/**
 * Utility Functions for English Grammar Quiz Generator
 */

const Utils = {
    /**
     * Shuffle an array using Fisher-Yates algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} - Shuffled array (new instance)
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Randomly select n items from an array
     * @param {Array} array - Source array
     * @param {number} n - Number of items to select
     * @returns {Array} - Selected items
     */
    randomSelect(array, n) {
        const shuffled = this.shuffleArray(array);
        return shuffled.slice(0, Math.min(n, array.length));
    },

    /**
     * Get a random item from an array
     * @param {Array} array - Source array
     * @returns {*} - Random item or undefined if empty
     */
    randomItem(array) {
        if (!array || array.length === 0) return undefined;
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Generate a unique ID
     * @returns {string} - Unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Format date for display
     * @param {string|Date} date - Date to format
     * @returns {string} - Formatted date string
     */
    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString('en-US', options);
    },

    /**
     * Validate question structure
     * @param {Object} question - Question object to validate
     * @returns {Object} - { valid: boolean, errors: string[] }
     */
    validateQuestion(question) {
        const errors = [];

        if (!question) {
            errors.push('Question is null or undefined');
            return { valid: false, errors };
        }

        if (!question.id) {
            errors.push('Question missing id');
        }

        if (!question.topic) {
            errors.push('Question missing topic');
        }

        if (!question.difficulty) {
            errors.push('Question missing difficulty');
        }

        if (!question.question || typeof question.question !== 'string') {
            errors.push('Question text is missing or invalid');
        }

        if (!Array.isArray(question.options)) {
            errors.push('Options must be an array');
        } else if (question.options.length !== 4) {
            errors.push(`Expected 4 options, got ${question.options.length}`);
        } else {
            // Check for duplicate options
            const uniqueOptions = new Set(question.options.map(o => o.toLowerCase().trim()));
            if (uniqueOptions.size !== 4) {
                errors.push('Duplicate options detected');
            }
        }

        if (typeof question.answer !== 'number' || question.answer < 0 || question.answer > 3) {
            errors.push('Answer must be a number between 0 and 3');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    },

    /**
     * Show notification message
     * @param {string} message - Message to display
     * @param {string} type - Type: 'success', 'error', 'warning'
     */
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        if (!notification) return;

        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 5000);
    },

    /**
     * Hide notification
     */
    hideNotification() {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.classList.add('hidden');
        }
    },

    /**
     * Convert letter index to option label (A, B, C, D)
     * @param {number} index - Index (0-3)
     * @returns {string} - Letter label
     */
    indexToLetter(index) {
        return String.fromCharCode(65 + index); // A=65, B=66, etc.
    },

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} - Cloned object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Debounce function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} - Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Escape HTML special characters
     * @param {string} str - String to escape
     * @returns {string} - Escaped string
     */
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Scroll to element smoothly
     * @param {HTMLElement} element - Element to scroll to
     */
    scrollToElement(element) {
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
