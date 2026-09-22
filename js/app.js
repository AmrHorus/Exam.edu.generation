/**
 * Main Application Module
 * Handles UI interactions and coordinates between modules
 */

const App = {
    // Current state
    state: {
        selectedTopics: [],
        difficulty: 'medium',
        questionCount: 15,
        currentQuiz: null,
        studentInfo: {}
    },

    /**
     * Initialize the application
     */
    async init() {
        this.cacheElements();
        this.bindEvents();
        this.renderTopicGrid();
        this.setDefaultDate();
        this.updateSelectedCount();
        
        console.log('English Grammar Quiz Generator initialized');
    },

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.elements = {
            // Topic selection
            topicGrid: document.getElementById('topic-grid'),
            selectedCount: document.getElementById('topic-count-display'),
            selectAllBtn: document.getElementById('select-all-topics'),
            clearAllBtn: document.getElementById('clear-all-topics'),
            
            // Difficulty
            difficultyRadios: document.querySelectorAll('input[name="difficulty"]'),
            
            // Question count
            countBtns: document.querySelectorAll('.count-btn'),
            customCountInput: document.getElementById('custom-question-count'),
            
            // Options
            randomizeQuestions: document.getElementById('randomize-questions'),
            randomizeAnswers: document.getElementById('randomize-answers'),
            includeAnswerKey: document.getElementById('include-answer-key'),
            includeExplanations: document.getElementById('include-explanations'),
            
            // Student info - using exam builder fields
            studentName: document.getElementById('exam-student'),
            className: document.getElementById('exam-class'),
            teacherName: document.getElementById('exam-teacher'),
            quizDate: document.getElementById('exam-date'),
            
            // Actions
            generateBtn: document.getElementById('generate-exam-btn'),
            regenerateBtn: document.getElementById('regenerate-exam-btn'),
            downloadPdfBtn: document.getElementById('download-pdf-btn'),
            
            // Preview
            previewContainer: document.getElementById('exam-preview-container'),
            previewSection: document.getElementById('view-builder'),
            
            // Notification
            notification: document.getElementById('notification-toast')
        };
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Topic selection
        this.elements.selectAllBtn.addEventListener('click', () => this.selectAllTopics());
        this.elements.clearAllBtn.addEventListener('click', () => this.clearAllTopics());
        
        // Difficulty selection
        this.elements.difficultyRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.difficulty = e.target.value;
            });
        });
        
        // Question count buttons
        this.elements.countBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setQuestionCount(parseInt(e.target.dataset.count));
                this.elements.customCountInput.value = '';
            });
        });
        
        // Custom question count
        this.elements.customCountInput.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            if (value && value > 0 && value <= 100) {
                this.state.questionCount = value;
                this.elements.countBtns.forEach(btn => btn.classList.remove('active'));
            }
        });
        
        // Generate button
        this.elements.generateBtn.addEventListener('click', () => this.generateQuiz());
        
        // Regenerate button
        this.elements.regenerateBtn.addEventListener('click', () => this.generateQuiz());
        
        // Download PDF button
        this.elements.downloadPdfBtn.addEventListener('click', () => this.downloadPdf());
    },

    /**
     * Render the topic grid
     */
    renderTopicGrid() {
        const topics = QuizGenerator.getTopics();
        const groupedByCategory = this.groupTopicsByCategory(topics);
        
        let html = '';
        
        for (const [category, categoryTopics] of Object.entries(groupedByCategory)) {
            html += `<div class="topic-category">`;
            html += `<h4 style="margin: 15px 0 10px 0; color: var(--text-secondary); font-size: 0.9rem;">${category}</h4>`;
            html += `<div class="topic-grid" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); margin-bottom: 15px;">`;
            
            for (const topic of categoryTopics) {
                html += `
                    <div class="topic-card" data-topic-id="${topic.id}">
                        <input type="checkbox" id="topic-${topic.id}" value="${topic.id}">
                        <label for="topic-${topic.id}">${topic.name}</label>
                    </div>
                `;
            }
            
            html += `</div>`;
        }
        
        this.elements.topicGrid.innerHTML = html;
        
        // Bind click events to topic cards
        document.querySelectorAll('.topic-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't toggle if clicking directly on checkbox
                if (e.target.tagName === 'INPUT') return;
                
                const checkbox = card.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                this.toggleTopic(card.dataset.topicId);
            });
            
            // Also handle checkbox change
            const checkbox = card.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => {
                this.toggleTopic(card.dataset.topicId);
            });
        });
    },

    /**
     * Group topics by category
     * @param {Array} topics - All topics
     * @returns {Object} - Topics grouped by category
     */
    groupTopicsByCategory(topics) {
        return topics.reduce((groups, topic) => {
            const category = topic.category || 'Other';
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(topic);
            return groups;
        }, {});
    },

    /**
     * Toggle topic selection
     * @param {string} topicId - Topic ID to toggle
     */
    toggleTopic(topicId) {
        const index = this.state.selectedTopics.indexOf(topicId);
        const card = document.querySelector(`.topic-card[data-topic-id="${topicId}"]`);
        
        if (index === -1) {
            this.state.selectedTopics.push(topicId);
            if (card) card.classList.add('selected');
        } else {
            this.state.selectedTopics.splice(index, 1);
            if (card) card.classList.remove('selected');
        }
        
        this.updateSelectedCount();
    },

    /**
     * Select all topics
     */
    selectAllTopics() {
        const topics = QuizGenerator.getTopics();
        this.state.selectedTopics = topics.map(t => t.id);
        
        document.querySelectorAll('.topic-card').forEach(card => {
            card.classList.add('selected');
            card.querySelector('input[type="checkbox"]').checked = true;
        });
        
        this.updateSelectedCount();
    },

    /**
     * Clear all topic selections
     */
    clearAllTopics() {
        this.state.selectedTopics = [];
        
        document.querySelectorAll('.topic-card').forEach(card => {
            card.classList.remove('selected');
            card.querySelector('input[type="checkbox"]').checked = false;
        });
        
        this.updateSelectedCount();
    },

    /**
     * Update the selected topics counter
     */
    updateSelectedCount() {
        this.elements.selectedCount.textContent = this.state.selectedTopics.length;
    },

    /**
     * Set question count
     * @param {number} count - Number of questions
     */
    setQuestionCount(count) {
        this.state.questionCount = count;
        
        this.elements.countBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.count) === count);
        });
    },

    /**
     * Set default date to today
     */
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        this.elements.quizDate.value = today;
    },

    /**
     * Get current form values
     * @returns {Object} - Form values
     */
    getFormValues() {
        return {
            topics: [...this.state.selectedTopics],
            difficulty: this.state.difficulty,
            questionCount: this.state.questionCount,
            randomizeQuestions: this.elements.randomizeQuestions.checked,
            randomizeAnswers: this.elements.randomizeAnswers.checked,
            includeAnswerKey: this.elements.includeAnswerKey.checked,
            includeExplanations: this.elements.includeExplanations.checked,
            studentInfo: {
                name: this.elements.studentName.value.trim(),
                class: this.elements.className.value.trim(),
                teacher: this.elements.teacherName.value.trim(),
                date: this.elements.quizDate.value
            }
        };
    },

    /**
     * Validate form before generation
     * @returns {boolean} - True if valid
     */
    validateForm() {
        if (this.state.selectedTopics.length === 0) {
            Utils.showNotification('Please select at least one grammar topic.', 'error');
            return false;
        }
        
        const count = this.state.questionCount;
        if (count < 1 || count > 100) {
            Utils.showNotification('Please select a valid number of questions (1-100).', 'error');
            return false;
        }
        
        return true;
    },

    /**
     * Generate the quiz
     */
    async generateQuiz() {
        if (!this.validateForm()) {
            return;
        }
        
        const formValues = this.getFormValues();
        this.state.studentInfo = formValues.studentInfo;
        
        // Show loading state
        this.elements.generateBtn.disabled = true;
        this.elements.generateBtn.textContent = 'Generating...';
        Utils.hideNotification();
        
        try {
            // Generate quiz
            const result = await QuizGenerator.generateQuiz(formValues);
            
            if (!result.success) {
                Utils.showNotification(result.error, 'error');
                return;
            }
            
            // Store current quiz
            this.state.currentQuiz = result.quiz;
            
            // Render preview
            this.renderPreview(result.quiz, formValues.studentInfo);
            
            // Show preview section
            this.elements.previewSection.classList.remove('hidden');
            this.elements.previewSection.classList.add('visible');
            
            // Scroll to preview
            Utils.scrollToElement(this.elements.previewSection);
            
            Utils.showNotification('Quiz generated successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating quiz:', error);
            Utils.showNotification('Something went wrong while generating the quiz. Please try again.', 'error');
        } finally {
            this.elements.generateBtn.disabled = false;
            this.elements.generateBtn.textContent = 'Generate Quiz';
        }
    },

    /**
     * Render quiz preview
     * @param {Object} quiz - Generated quiz
     * @param {Object} studentInfo - Student information
     */
    renderPreview(quiz, studentInfo) {
        const html = PdfGenerator.generatePreviewHtml(quiz, studentInfo);
        this.elements.previewContainer.innerHTML = html;
    },

    /**
     * Download PDF
     */
    async downloadPdf() {
        if (!this.state.currentQuiz) {
            Utils.showNotification('Please generate a quiz first.', 'warning');
            return;
        }
        
        try {
            this.elements.downloadPdfBtn.disabled = true;
            this.elements.downloadPdfBtn.textContent = 'Generating PDF...';
            
            const pdfBlob = await PdfGenerator.generatePdf(
                this.state.currentQuiz,
                this.state.studentInfo
            );
            
            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `grammar-quiz-${timestamp}.pdf`;
            
            PdfGenerator.downloadPdf(pdfBlob, filename);
            
            Utils.showNotification('PDF downloaded successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            Utils.showNotification('Something went wrong while generating the PDF. Please try again.', 'error');
        } finally {
            this.elements.downloadPdfBtn.disabled = false;
            this.elements.downloadPdfBtn.textContent = 'Download PDF';
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
