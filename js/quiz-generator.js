/**
 * Quiz Generator Module
 * Handles question filtering, selection, and quiz generation
 */

const QuizGenerator = {
    // In-memory cache of loaded questions
    questionCache: {},
    
    // List of all available topics with their file mappings
    topics: [
        // Tenses - Present
        { id: 'present-simple', name: 'Present Simple', category: 'Tenses' },
        { id: 'present-continuous', name: 'Present Continuous', category: 'Tenses' },
        { id: 'present-perfect', name: 'Present Perfect', category: 'Tenses' },
        { id: 'present-perfect-continuous', name: 'Present Perfect Continuous', category: 'Tenses' },
        // Tenses - Past
        { id: 'past-simple', name: 'Past Simple', category: 'Tenses' },
        { id: 'past-continuous', name: 'Past Continuous', category: 'Tenses' },
        { id: 'past-perfect', name: 'Past Perfect', category: 'Tenses' },
        { id: 'past-perfect-continuous', name: 'Past Perfect Continuous', category: 'Tenses' },
        // Tenses - Future
        { id: 'future-simple', name: 'Future Simple', category: 'Tenses' },
        { id: 'going-to', name: 'Going to (Future)', category: 'Tenses' },
        { id: 'future-continuous', name: 'Future Continuous', category: 'Tenses' },
        { id: 'future-perfect', name: 'Future Perfect', category: 'Tenses' },
        { id: 'future-perfect-continuous', name: 'Future Perfect Continuous', category: 'Tenses' },
        // Grammar - Core
        { id: 'modal-verbs', name: 'Modal Verbs', category: 'Grammar' },
        { id: 'articles', name: 'Articles', category: 'Grammar' },
        { id: 'prepositions', name: 'Prepositions', category: 'Grammar' },
        { id: 'pronouns', name: 'Pronouns', category: 'Grammar' },
        // Grammar - Word Forms
        { id: 'adjectives', name: 'Adjectives', category: 'Grammar' },
        { id: 'adverbs', name: 'Adverbs', category: 'Grammar' },
        { id: 'comparatives-superlatives', name: 'Comparatives & Superlatives', category: 'Grammar' },
        { id: 'countable-uncountable', name: 'Countable & Uncountable Nouns', category: 'Grammar' },
        { id: 'some-any', name: 'Some / Any', category: 'Grammar' },
        { id: 'much-many', name: 'Much / Many', category: 'Grammar' },
        // Grammar - Advanced
        { id: 'subject-verb-agreement', name: 'Subject-Verb Agreement', category: 'Grammar' },
        { id: 'conditionals', name: 'Conditionals', category: 'Grammar' },
        { id: 'passive-voice', name: 'Passive Voice', category: 'Grammar' },
        { id: 'reported-speech', name: 'Reported Speech', category: 'Grammar' },
        { id: 'question-forms', name: 'Question Forms', category: 'Grammar' },
        { id: 'relative-clauses', name: 'Relative Clauses', category: 'Grammar' },
        { id: 'gerunds-infinitives', name: 'Gerunds & Infinitives', category: 'Grammar' },
        { id: 'conjunctions', name: 'Conjunctions', category: 'Grammar' }
    ],

    /**
     * Load questions from JSON files
     * @param {string[]} topicIds - Array of topic IDs to load
     * @returns {Promise<Object>} - Loaded questions by topic
     */
    async loadQuestions(topicIds) {
        const loaded = {};
        
        for (const topicId of topicIds) {
            if (this.questionCache[topicId]) {
                loaded[topicId] = this.questionCache[topicId];
                continue;
            }
            
            try {
                const response = await fetch(`data/${topicId}.json`);
                if (!response.ok) {
                    console.warn(`Could not load ${topicId}.json`);
                    continue;
                }
                const data = await response.json();
                
                // Validate and filter questions
                const validQuestions = [];
                for (const question of data.questions || []) {
                    const validation = Utils.validateQuestion(question);
                    if (validation.valid) {
                        validQuestions.push(question);
                    } else {
                        console.warn(`Invalid question ${question.id || 'unknown'}:`, validation.errors);
                    }
                }
                
                this.questionCache[topicId] = validQuestions;
                loaded[topicId] = validQuestions;
            } catch (error) {
                console.error(`Error loading ${topicId}:`, error);
            }
        }
        
        return loaded;
    },

    /**
     * Get all available topics
     * @returns {Array} - Array of topic objects
     */
    getTopics() {
        return this.topics;
    },

    /**
     * Filter questions by difficulty
     * @param {Array} questions - Questions to filter
     * @param {string} difficulty - Difficulty level
     * @returns {Array} - Filtered questions
     */
    filterByDifficulty(questions, difficulty) {
        if (!difficulty || difficulty === 'all') return questions;
        return questions.filter(q => q.difficulty === difficulty);
    },

    /**
     * Count available questions for given topics and difficulty
     * @param {string[]} topicIds - Selected topic IDs
     * @param {string} difficulty - Selected difficulty
     * @returns {number} - Total available questions
     */
    async countAvailableQuestions(topicIds, difficulty) {
        const loaded = await this.loadQuestions(topicIds);
        let total = 0;
        
        for (const topicId of Object.keys(loaded)) {
            const filtered = this.filterByDifficulty(loaded[topicId], difficulty);
            total += filtered.length;
        }
        
        return total;
    },

    /**
     * Generate a quiz with selected options
     * @param {Object} options - Quiz generation options
     * @returns {Promise<Object>} - Generated quiz or error
     */
    async generateQuiz(options) {
        const {
            topics,
            difficulty,
            questionCount,
            randomizeQuestions,
            randomizeAnswers,
            includeAnswerKey,
            includeExplanations
        } = options;

        // Validate input
        if (!topics || topics.length === 0) {
            return {
                success: false,
                error: 'Please select at least one grammar topic.'
            };
        }

        // Load questions for selected topics
        const loadedQuestions = await this.loadQuestions(topics);
        
        // Check if any questions were loaded
        const totalAvailable = Object.values(loadedQuestions).reduce((sum, arr) => sum + arr.length, 0);
        
        if (totalAvailable === 0) {
            return {
                success: false,
                error: 'No questions are available for the selected topics. Please try selecting different topics.'
            };
        }

        // Filter by difficulty
        let availableQuestions = [];
        for (const topicId of Object.keys(loadedQuestions)) {
            const filtered = this.filterByDifficulty(loadedQuestions[topicId], difficulty);
            availableQuestions = availableQuestions.concat(filtered);
        }

        // Check if enough questions exist
        if (availableQuestions.length < questionCount) {
            return {
                success: false,
                error: `Not enough questions available for your selection.\n\nAvailable: ${availableQuestions.length} questions\nRequested: ${questionCount} questions\n\nTry selecting more topics, choosing a different difficulty, or reducing the number of questions.`
            };
        }

        // Distribute questions across topics when possible
        let selectedQuestions;
        if (topics.length > 1 && availableQuestions.length >= questionCount * 2) {
            // Try to distribute evenly across topics
            selectedQuestions = this.distributeQuestions(loadedQuestions, topics, difficulty, questionCount);
        } else {
            // Just randomly select from all available
            selectedQuestions = Utils.randomSelect(availableQuestions, questionCount);
        }

        // Randomize question order if enabled
        if (randomizeQuestions) {
            selectedQuestions = Utils.shuffleArray(selectedQuestions);
        }

        // Process each question
        const processedQuestions = selectedQuestions.map((q, index) => {
            const processed = Utils.deepClone(q);
            processed.originalIndex = q.answer; // Store original answer index
            
            // Randomize answer options if enabled
            if (randomizeAnswers) {
                const originalOptions = [...processed.options];
                const originalAnswer = processed.options[q.answer];
                
                // Shuffle options
                processed.options = Utils.shuffleArray(processed.options);
                
                // Find new position of correct answer
                processed.answer = processed.options.findIndex(
                    opt => opt === originalAnswer
                );
            }
            
            processed.questionNumber = index + 1;
            return processed;
        });

        return {
            success: true,
            quiz: {
                questions: processedQuestions,
                metadata: {
                    topics: topics.map(t => {
                        const topic = this.topics.find(tp => tp.id === t);
                        return topic ? topic.name : t;
                    }),
                    difficulty: difficulty,
                    questionCount: questionCount,
                    randomizeQuestions,
                    randomizeAnswers,
                    includeAnswerKey,
                    includeExplanations,
                    generatedAt: new Date().toISOString()
                }
            }
        };
    },

    /**
     * Distribute questions evenly across selected topics
     * @param {Object} loadedQuestions - Questions loaded by topic
     * @param {string[]} topics - Selected topic IDs
     * @param {string} difficulty - Difficulty filter
     * @param {number} questionCount - Total questions needed
     * @returns {Array} - Selected questions
     */
    distributeQuestions(loadedQuestions, topics, difficulty, questionCount) {
        const perTopic = Math.floor(questionCount / topics.length);
        let remainder = questionCount % topics.length;
        const selected = [];

        for (const topicId of topics) {
            const topicQuestions = this.filterByDifficulty(loadedQuestions[topicId] || [], difficulty);
            const countForThisTopic = perTopic + (remainder > 0 ? 1 : 0);
            
            const topicSelected = Utils.randomSelect(topicQuestions, countForThisTopic);
            selected.push(...topicSelected);
            
            if (remainder > 0) remainder--;
        }

        // If we still need more questions, add from any topic
        if (selected.length < questionCount) {
            const remaining = questionCount - selected.length;
            const usedIds = new Set(selected.map(q => q.id));
            const additional = availableQuestions.filter(q => !usedIds.has(q.id));
            selected.push(...Utils.randomSelect(additional, remaining));
        }

        return selected;
    },

    /**
     * Get questions by topic and difficulty (for debugging/stats)
     * @param {string} topicId - Topic ID
     * @param {string} difficulty - Difficulty level
     * @returns {Promise<Array>} - Matching questions
     */
    async getQuestionsByTopicAndDifficulty(topicId, difficulty) {
        const loaded = await this.loadQuestions([topicId]);
        const questions = loaded[topicId] || [];
        return this.filterByDifficulty(questions, difficulty);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizGenerator;
}
