/**
 * Storage Module
 * Handles localStorage persistence for exams, settings, and question banks
 */

const Storage = {
    KEYS: {
        SAVED_EXAMS: 'exam_saved_exams',
        QUESTION_BANK: 'exam_question_bank',
        SETTINGS: 'exam_settings'
    },

    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {*} data - Data to save
     * @returns {boolean} - Success status
     */
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    },

    /**
     * Load data from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} - Loaded data or default
     */
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Storage load error:', error);
            return defaultValue;
        }
    },

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} - Success status
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    /**
     * Clear all exam-related storage
     * @returns {boolean} - Success status
     */
    clearAll() {
        try {
            Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },

    /**
     * Get saved exams
     * @returns {Array} - Saved exams
     */
    getSavedExams() {
        return this.load(this.KEYS.SAVED_EXAMS, []);
    },

    /**
     * Save exams
     * @param {Array} exams - Exams to save
     */
    saveExams(exams) {
        this.save(this.KEYS.SAVED_EXAMS, exams);
    },

    /**
     * Get custom questions
     * @returns {Array} - Custom questions
     */
    getCustomQuestions() {
        return this.load(this.KEYS.QUESTION_BANK, []);
    },

    /**
     * Get settings
     * @returns {Object} - Settings
     */
    getSettings() {
        return this.load(this.KEYS.SETTINGS, {});
    },

    /**
     * Save settings
     * @param {Object} settings - Settings to save
     */
    saveSettings(settings) {
        this.save(this.KEYS.SETTINGS, settings);
    },

    // Exam-specific methods
    exams: {
        getAll() {
            return Storage.load(Storage.KEYS.SAVED_EXAMS, []);
        },

        save(exam) {
            const exams = Storage.exams.getAll();
            exam.id = exam.id || Utils.generateId();
            exam.savedAt = new Date().toISOString();
            
            const existingIndex = exams.findIndex(e => e.id === exam.id);
            if (existingIndex >= 0) {
                exams[existingIndex] = exam;
            } else {
                exams.push(exam);
            }
            
            Storage.save(Storage.KEYS.SAVED_EXAMS, exams);
            return exam;
        },

        getById(id) {
            const exams = Storage.exams.getAll();
            return exams.find(e => e.id === id);
        },

        delete(id) {
            const exams = Storage.exams.getAll();
            const filtered = exams.filter(e => e.id !== id);
            Storage.save(Storage.KEYS.SAVED_EXAMS, filtered);
            return true;
        },

        update(id, updates) {
            const exams = Storage.exams.getAll();
            const index = exams.findIndex(e => e.id === id);
            if (index >= 0) {
                exams[index] = { ...exams[index], ...updates };
                Storage.save(Storage.KEYS.SAVED_EXAMS, exams);
                return exams[index];
            }
            return null;
        }
    },

    // Settings-specific methods
    settings: {
        getDefaults() {
            return {
                theme: 'system',
                defaultDifficulty: 'medium',
                defaultQuestionCount: 15,
                defaultRandomizeQuestions: true,
                defaultRandomizeAnswers: true,
                defaultIncludeAnswerKey: true,
                defaultIncludeExplanations: false,
                language: 'en'
            };
        },

        get() {
            const defaults = this.getDefaults();
            const saved = Storage.load(Storage.KEYS.SETTINGS, {});
            return { ...defaults, ...saved };
        },

        save(settings) {
            Storage.save(Storage.KEYS.SETTINGS, settings);
            return true;
        },

        update(updates) {
            const current = this.get();
            const updated = { ...current, ...updates };
            Storage.save(Storage.KEYS.SETTINGS, updated);
            return updated;
        },

        reset() {
            Storage.remove(Storage.KEYS.SETTINGS);
            return this.getDefaults();
        }
    },

    // Question bank persistence (for custom questions)
    questionBank: {
        getCustomQuestions() {
            return Storage.load(Storage.KEYS.QUESTION_BANK, []);
        },

        add(question) {
            const questions = this.getCustomQuestions();
            question.id = question.id || Utils.generateId();
            questions.push(question);
            Storage.save(Storage.KEYS.QUESTION_BANK, questions);
            return question;
        },

        update(id, updates) {
            const questions = this.getCustomQuestions();
            const index = questions.findIndex(q => q.id === id);
            if (index >= 0) {
                questions[index] = { ...questions[index], ...updates };
                Storage.save(Storage.KEYS.QUESTION_BANK, questions);
                return questions[index];
            }
            return null;
        },

        delete(id) {
            const questions = this.getCustomQuestions();
            const filtered = questions.filter(q => q.id !== id);
            Storage.save(Storage.KEYS.QUESTION_BANK, filtered);
            return true;
        },

        getAll() {
            return this.getCustomQuestions();
        },

        clear() {
            Storage.remove(Storage.KEYS.QUESTION_BANK);
            return true;
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
