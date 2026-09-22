/**
 * Question Manager Module
 * Handles question browsing, filtering, and management
 */

const QuestionManager = {
    // Custom questions stored locally
    customQuestions: [],

    /**
     * Initialize the question manager
     */
    async init() {
        this.customQuestions = Storage.questionBank.getCustomQuestions() || [];
    },

    /**
     * Get all available topics from QuizGenerator
     * @returns {Array} - Topics array
     */
    getTopics() {
        return QuizGenerator.getTopics();
    },

    /**
     * Get all questions including custom ones
     * @param {Object} filters - Filter options
     * @returns {Promise<Array>} - Filtered questions
     */
    async getAllQuestions(filters = {}) {
        const { topic, difficulty, type, search } = filters;

        // Load questions from all available topic files
        const allTopics = this.getTopics().map(t => t.id);
        const loadedQuestions = await QuizGenerator.loadQuestions(allTopics);

        // Flatten all questions
        let questions = [];
        for (const topicQuestions of Object.values(loadedQuestions)) {
            questions.push(...topicQuestions);
        }

        // Add custom questions
        questions.push(...this.customQuestions);

        // Apply filters
        if (topic) {
            questions = questions.filter(q => q.topic === topic);
        }

        if (difficulty) {
            questions = questions.filter(q => q.difficulty === difficulty);
        }

        if (type) {
            questions = questions.filter(q => q.type === type || !q.type || q.type === 'multiple-choice');
        }

        if (search) {
            const searchLower = search.toLowerCase();
            questions = questions.filter(q =>
                q.question.toLowerCase().includes(searchLower) ||
                q.options.some(opt => opt.toLowerCase().includes(searchLower))
            );
        }

        return questions;
    },

    /**
     * Get questions by topic
     * @param {string} topicId - Topic ID
     * @returns {Promise<Array>} - Questions for topic
     */
    async getQuestionsByTopic(topicId) {
        return this.getAllQuestions({ topic: topicId });
    },

    /**
     * Get questions by difficulty
     * @param {string} difficulty - Difficulty level
     * @returns {Promise<Array>} - Questions for difficulty
     */
    async getQuestionsByDifficulty(difficulty) {
        return this.getAllQuestions({ difficulty });
    },

    /**
     * Search questions
     * @param {string} query - Search query
     * @returns {Promise<Array>} - Matching questions
     */
    async searchQuestions(query) {
        return this.getAllQuestions({ search: query });
    },

    /**
     * Get question statistics
     * @returns {Promise<Object>} - Statistics object
     */
    async getStatistics() {
        const questions = await this.getAllQuestions();

        const stats = {
            total: questions.length,
            byTopic: {},
            byDifficulty: { easy: 0, medium: 0, hard: 0, advanced: 0 },
            customCount: this.customQuestions.length
        };

        for (const q of questions) {
            // By topic
            if (!stats.byTopic[q.topic]) {
                stats.byTopic[q.topic] = 0;
            }
            stats.byTopic[q.topic]++;

            // By difficulty
            if (stats.byDifficulty.hasOwnProperty(q.difficulty)) {
                stats.byDifficulty[q.difficulty]++;
            }
        }

        return stats;
    },

    /**
     * Add a new custom question
     * @param {Object} question - Question object
     * @returns {Object} - Saved question
     */
    addQuestion(question) {
        // Validate question
        const validation = Utils.validateQuestion(question);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.errors.join(', ')
            };
        }

        // Check for duplicate ID
        const existing = this.customQuestions.find(q => q.id === question.id);
        if (existing) {
            return {
                success: false,
                error: 'A question with this ID already exists'
            };
        }

        // Add question
        const saved = Storage.questionBank.add(question);
        this.customQuestions.push(saved);

        return {
            success: true,
            question: saved
        };
    },

    /**
     * Update an existing custom question
     * @param {string} id - Question ID
     * @param {Object} updates - Updates to apply
     * @returns {Object} - Result
     */
    updateQuestion(id, updates) {
        const index = this.customQuestions.findIndex(q => q.id === id);
        if (index < 0) {
            return {
                success: false,
                error: 'Question not found'
            };
        }

        const updated = { ...this.customQuestions[index], ...updates };

        // Validate updated question
        const validation = Utils.validateQuestion(updated);
        if (!validation.valid) {
            return {
                success: false,
                error: validation.errors.join(', ')
            };
        }

        Storage.questionBank.update(id, updated);
        this.customQuestions[index] = updated;

        return {
            success: true,
            question: updated
        };
    },

    /**
     * Delete a custom question
     * @param {string} id - Question ID
     * @returns {Object} - Result
     */
    deleteQuestion(id) {
        const index = this.customQuestions.findIndex(q => q.id === id);
        if (index < 0) {
            return {
                success: false,
                error: 'Question not found'
            };
        }

        Storage.questionBank.delete(id);
        this.customQuestions.splice(index, 1);

        return {
            success: true
        };
    },

    /**
     * Duplicate a question
     * @param {Object} question - Question to duplicate
     * @returns {Object} - Duplicated question
     */
    duplicateQuestion(question) {
        const duplicate = {
            ...Utils.deepClone(question),
            id: Utils.generateId(),
            duplicatedFrom: question.id
        };

        return this.addQuestion(duplicate);
    },

    /**
     * Get a single question by ID
     * @param {string} id - Question ID
     * @returns {Promise<Object|null>} - Question or null
     */
    async getQuestionById(id) {
        const questions = await this.getAllQuestions();
        return questions.find(q => q.id === id) || null;
    },

    /**
     * Import questions from file
     * @param {File} file - JSON file
     * @returns {Promise<Object>} - Import result
     */
    async importQuestions(file) {
        const result = await ImportExport.importQuestions(file);

        if (!result.success) {
            return result;
        }

        // Add imported questions to storage
        let added = 0;
        let skipped = 0;

        for (const question of result.questions) {
            // Check if question already exists
            const existing = await this.getQuestionById(question.id);
            if (existing) {
                // Generate new ID for duplicate
                question.id = Utils.generateId();
                skipped++;
            }

            const saveResult = this.addQuestion(question);
            if (saveResult.success) {
                added++;
            }
        }

        return {
            success: true,
            added,
            skipped,
            total: result.count
        };
    },

    /**
     * Export all custom questions
     */
    exportCustomQuestions() {
        ImportExport.exportQuestions(this.customQuestions, 'custom-questions.json');
    },

    /**
     * Export all questions (including built-in)
     * @param {Array} questions - Questions to export
     */
    exportAllQuestions(questions) {
        ImportExport.exportQuestions(questions, 'all-questions.json');
    },

    /**
     * Clear all custom questions
     * @returns {Object} - Result
     */
    clearCustomQuestions() {
        Storage.questionBank.clear();
        this.customQuestions = [];

        return {
            success: true
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionManager;
}
