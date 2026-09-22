/**
 * EXAM - Core Application Module
 * Retro English Grammar Exam Generator
 */

const ExamApp = {
    // Application state
    state: {
        currentView: 'dashboard',
        selectedTopics: [],
        difficulty: 'medium',
        questionCount: 15,
        customQuestionCount: null,
        randomizeQuestions: true,
        randomizeAnswers: true,
        includeAnswerKey: true,
        includeExplanations: false,
        examConfig: {
            title: 'English Grammar Quiz',
            subject: 'English Grammar',
            school: '',
            teacher: '',
            student: '',
            class: '',
            date: new Date().toISOString().split('T')[0],
            duration: 60
        },
        currentExam: null,
        savedExams: [],
        questions: [],
        customQuestions: [],
        settings: {
            defaultDifficulty: 'medium',
            defaultQuestionCount: 15,
            theme: 'system'
        }
    },

    // DOM elements cache
    elements: {},

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.cacheElements();
            await this.loadData();
            this.bindEvents();
            this.renderTopicGrid();
            this.updateDashboard();
            this.navigate(this.state.currentView);
            console.log('EXAM initialized successfully');
        } catch (error) {
            console.error('Failed to initialize EXAM:', error);
            this.showToast('Failed to initialize application', 'error');
        }
    },

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            // Navigation
            navButtons: document.querySelectorAll('.nav-btn'),
            
            // Views
            views: document.querySelectorAll('.view'),
            
            // Dashboard
            statTotalQuestions: document.getElementById('stat-total-questions'),
            statTotalTopics: document.getElementById('stat-total-topics'),
            statSavedExams: document.getElementById('stat-saved-exams'),
            statCustomQuestions: document.getElementById('stat-custom-questions'),
            recentExamsContainer: document.getElementById('recent-exams-container'),
            
            // Topic selection
            topicGrid: document.getElementById('topic-grid'),
            topicCountDisplay: document.getElementById('topic-count-display'),
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
            
            // Exam details
            examTitle: document.getElementById('exam-title'),
            examSubject: document.getElementById('exam-subject'),
            examSchool: document.getElementById('exam-school'),
            examTeacher: document.getElementById('exam-teacher'),
            examStudent: document.getElementById('exam-student'),
            examClass: document.getElementById('exam-class'),
            examDate: document.getElementById('exam-date'),
            examDuration: document.getElementById('exam-duration'),
            
            // Actions
            generateBtn: document.getElementById('generate-exam-btn'),
            regenerateBtn: document.getElementById('regenerate-exam-btn'),
            downloadPdfBtn: document.getElementById('download-pdf-btn'),
            bankStatus: document.getElementById('bank-status'),
            
            // Preview
            previewContainer: document.getElementById('exam-preview-container'),
            
            // Question Bank
            questionSearch: document.getElementById('question-search'),
            questionTopicFilter: document.getElementById('filter-topic'),
            questionDifficultyFilter: document.getElementById('filter-difficulty'),
            questionTypeFilter: document.getElementById('filter-type'),
            questionList: document.getElementById('question-list'),
            questionCount: document.getElementById('question-count-display'),
            questionEmptyState: document.getElementById('question-empty-state'),
            
            // Saved Exams
            savedExamsContainer: document.getElementById('exams-grid'),
            savedExamsEmptyState: document.getElementById('exams-empty-state'),
            
            // Dashboard
            recentExamsContainer: document.getElementById('recent-exams-list') || document.querySelector('.recent-exams-list'),
            
            // Modal root and toast container
            modalRoot: document.getElementById('modal-root'),
            toastContainer: document.getElementById('toast-container')
        };
    },

    /**
     * Load data from storage
     */
    async loadData() {
        // Load questions from data files
        await this.loadQuestionBank();
        
        // Load custom questions from storage
        this.state.customQuestions = Storage.getCustomQuestions();
        
        // Load saved exams
        this.state.savedExams = Storage.getSavedExams();
        
        // Load settings
        const settings = Storage.getSettings();
        if (settings) {
            this.state.settings = { ...this.state.settings, ...settings };
        }
        
        // Merge all questions
        this.state.questions = [...this.state.questions, ...this.state.customQuestions];
    },

    /**
     * Load question bank from JSON files
     */
    async loadQuestionBank() {
        const dataFiles = [
            'data/articles.json',
            'data/conditionals.json',
            'data/future-simple.json',
            'data/going-to.json',
            'data/modal-verbs.json',
            'data/past-continuous.json',
            'data/past-simple.json',
            'data/prepositions.json',
            'data/present-continuous.json',
            'data/present-perfect-continuous.json',
            'data/present-perfect.json',
            'data/present-simple.json'
        ];
        
        const allQuestions = [];
        
        for (const file of dataFiles) {
            try {
                const response = await fetch(file);
                if (response.ok) {
                    const data = await response.json();
                    if (data.questions && Array.isArray(data.questions)) {
                        allQuestions.push(...data.questions);
                    }
                }
            } catch (error) {
                console.warn(`Failed to load ${file}:`, error);
            }
        }
        
        this.state.questions = allQuestions;
        this.updateBankStatus(true);
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Navigation
        this.elements.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.navigate(view);
            });
        });
        
        // Dashboard quick actions
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleDashboardAction(action);
            });
        });
        
        // Topic selection
        if (this.elements.selectAllBtn) {
            this.elements.selectAllBtn.addEventListener('click', () => this.selectAllTopics());
        }
        if (this.elements.clearAllBtn) {
            this.elements.clearAllBtn.addEventListener('click', () => this.clearAllTopics());
        }
        
        // Difficulty selection
        this.elements.difficultyRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.difficulty = e.target.value;
            });
        });
        
        // Question count buttons
        this.elements.countBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const count = parseInt(e.target.dataset.count);
                this.setQuestionCount(count);
                this.elements.customCountInput.value = '';
                this.state.customQuestionCount = null;
            });
        });
        
        // Custom question count
        if (this.elements.customCountInput) {
            this.elements.customCountInput.addEventListener('change', (e) => {
                const value = parseInt(e.target.value);
                if (value && value > 0 && value <= 100) {
                    this.state.customQuestionCount = value;
                    this.state.questionCount = value;
                    this.elements.countBtns.forEach(btn => btn.classList.remove('active'));
                }
            });
        }
        
        // Options checkboxes
        if (this.elements.randomizeQuestions) {
            this.elements.randomizeQuestions.addEventListener('change', (e) => {
                this.state.randomizeQuestions = e.target.checked;
            });
        }
        if (this.elements.randomizeAnswers) {
            this.elements.randomizeAnswers.addEventListener('change', (e) => {
                this.state.randomizeAnswers = e.target.checked;
            });
        }
        if (this.elements.includeAnswerKey) {
            this.elements.includeAnswerKey.addEventListener('change', (e) => {
                this.state.includeAnswerKey = e.target.checked;
            });
        }
        if (this.elements.includeExplanations) {
            this.elements.includeExplanations.addEventListener('change', (e) => {
                this.state.includeExplanations = e.target.checked;
            });
        }
        
        // Exam detail fields
        this.bindExamFields();
        
        // Generate button
        if (this.elements.generateBtn) {
            this.elements.generateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.generateExam();
            });
        }
        
        // Regenerate button
        if (this.elements.regenerateBtn) {
            this.elements.regenerateBtn.addEventListener('click', () => this.generateExam());
        }
        
        // Download PDF button
        if (this.elements.downloadPdfBtn) {
            this.elements.downloadPdfBtn.addEventListener('click', () => this.downloadPdf());
        }
        
        // Question bank filters
        if (this.elements.questionSearch) {
            this.elements.questionSearch.addEventListener('input', 
                Utils.debounce(() => this.renderQuestionList(), 300)
            );
        }
        if (this.elements.questionTopicFilter) {
            this.elements.questionTopicFilter.addEventListener('change', 
                () => this.renderQuestionList()
            );
        }
        if (this.elements.questionDifficultyFilter) {
            this.elements.questionDifficultyFilter.addEventListener('change', 
                () => this.renderQuestionList()
            );
        }
        if (this.elements.questionTypeFilter) {
            this.elements.questionTypeFilter.addEventListener('change', 
                () => this.renderQuestionList()
            );
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    },

    /**
     * Bind exam detail field events
     */
    bindExamFields() {
        const fields = ['examTitle', 'examSubject', 'examSchool', 'examTeacher', 
                       'examStudent', 'examClass', 'examDate', 'examDuration'];
        
        fields.forEach(field => {
            if (this.elements[field]) {
                this.elements[field].addEventListener('input', (e) => {
                    const key = field.replace('exam', '').toLowerCase();
                    this.state.examConfig[key] = e.target.value;
                });
            }
        });
    },

    /**
     * Navigate to a view
     * @param {string} viewName - Name of view to navigate to
     */
    navigate(viewName) {
        // Update state
        this.state.currentView = viewName;
        
        // Update navigation buttons
        this.elements.navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });
        
        // Update views
        this.elements.views.forEach(view => {
            view.classList.toggle('active', view.id === `view-${viewName}`);
        });
        
        // View-specific initialization
        switch (viewName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'builder':
                this.setDefaultDate();
                break;
            case 'question-bank':
                this.renderQuestionList();
                break;
            case 'saved-exams':
                this.renderSavedExams();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * Handle dashboard quick actions
     * @param {string} action - Action name
     */
    handleDashboardAction(action) {
        switch (action) {
            case 'create-exam':
                this.navigate('builder');
                break;
            case 'browse-questions':
                this.navigate('question-bank');
                break;
            case 'saved-exams':
                this.navigate('saved-exams');
                break;
        }
    },

    /**
     * Update dashboard statistics
     */
    updateDashboard() {
        const totalQuestions = this.state.questions.length;
        const topics = [...new Set(this.state.questions.map(q => q.topic))];
        const savedExams = this.state.savedExams.length;
        const customQuestions = this.state.customQuestions.length;
        
        if (this.elements.statTotalQuestions) {
            this.elements.statTotalQuestions.textContent = totalQuestions;
        }
        if (this.elements.statTotalTopics) {
            this.elements.statTotalTopics.textContent = topics.length;
        }
        if (this.elements.statSavedExams) {
            this.elements.statSavedExams.textContent = savedExams;
        }
        if (this.elements.statCustomQuestions) {
            this.elements.statCustomQuestions.textContent = customQuestions;
        }
        
        // Update recent exams
        this.renderRecentExams();
    },

    /**
     * Render recent exams on dashboard
     */
    renderRecentExams() {
        const container = this.elements.recentExamsContainer;
        if (!container) return;
        
        const recent = this.state.savedExams.slice(0, 5);
        
        if (recent.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📄</div>
                    <h4 class="empty-state-title">No saved exams yet</h4>
                    <p class="empty-state-description">Create your first exam to see it here.</p>
                    <button class="btn btn-primary" onclick="ExamApp.navigate('builder')">
                        Create Exam
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recent.map(exam => `
            <div class="exam-card">
                <div class="exam-card-header">
                    <h4 class="exam-card-title">${Utils.escapeHtml(exam.title || 'Untitled Exam')}</h4>
                    <span class="exam-card-date">${Utils.formatDate(exam.createdAt)}</span>
                </div>
                <div class="exam-card-meta">
                    <span>📝 ${exam.questions?.length || 0} questions</span>
                    <span>📊 ${exam.config?.difficulty || 'Medium'}</span>
                </div>
                <div class="exam-card-actions">
                    <button class="btn btn-small" onclick="ExamApp.openExam('${exam.id}')">Open</button>
                    <button class="btn btn-small btn-secondary" onclick="ExamApp.duplicateExam('${exam.id}')">Duplicate</button>
                </div>
            </div>
        `).join('');
    },

    /**
     * Render topic grid
     */
    renderTopicGrid() {
        const topics = QuizGenerator.getTopics();
        
        if (!this.elements.topicGrid) return;
        
        let html = '';
        topics.forEach(topic => {
            html += `
                <label class="topic-label">
                    <input type="checkbox" class="topic-checkbox" value="${topic.id}" data-topic-id="${topic.id}">
                    <span class="topic-checkmark"></span>
                    <span>${topic.name}</span>
                </label>
            `;
        });
        
        this.elements.topicGrid.innerHTML = html;
        
        // Bind checkbox events
        this.elements.topicGrid.querySelectorAll('.topic-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleTopic(e.target.dataset.topicId);
            });
        });
    },

    /**
     * Toggle topic selection
     * @param {string} topicId - Topic ID to toggle
     */
    toggleTopic(topicId) {
        const index = this.state.selectedTopics.indexOf(topicId);
        
        if (index === -1) {
            this.state.selectedTopics.push(topicId);
        } else {
            this.state.selectedTopics.splice(index, 1);
        }
        
        this.updateSelectedCount();
    },

    /**
     * Select all topics
     */
    selectAllTopics() {
        const topics = QuizGenerator.getTopics();
        this.state.selectedTopics = topics.map(t => t.id);
        
        this.elements.topicGrid.querySelectorAll('.topic-checkbox').forEach(checkbox => {
            checkbox.checked = true;
        });
        
        this.updateSelectedCount();
    },

    /**
     * Clear all topic selections
     */
    clearAllTopics() {
        this.state.selectedTopics = [];
        
        this.elements.topicGrid.querySelectorAll('.topic-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        this.updateSelectedCount();
    },

    /**
     * Update selected topic count display
     */
    updateSelectedCount() {
        if (this.elements.topicCountDisplay) {
            this.elements.topicCountDisplay.textContent = `${this.state.selectedTopics.length} selected`;
        }
    },

    /**
     * Set question count
     * @param {number} count - Number of questions
     */
    setQuestionCount(count) {
        this.state.questionCount = count;
        this.state.customQuestionCount = null;
        
        this.elements.countBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.count) === count);
        });
    },

    /**
     * Set default date to today
     */
    setDefaultDate() {
        if (this.elements.examDate && !this.elements.examDate.value) {
            this.elements.examDate.value = new Date().toISOString().split('T')[0];
        }
    },

    /**
     * Update bank status indicator
     * @param {boolean} ready - Whether bank is loaded
     */
    updateBankStatus(ready) {
        if (!this.elements.bankStatus) return;
        
        if (ready) {
            this.elements.bankStatus.className = 'bank-status ready';
            this.elements.bankStatus.querySelector('.status-text').textContent = 
                `${this.state.questions.length} questions available`;
        } else {
            this.elements.bankStatus.className = 'bank-status loading';
        }
    },

    /**
     * Validate exam configuration
     * @returns {Object} - { valid: boolean, error?: string }
     */
    validateExamConfig() {
        if (this.state.selectedTopics.length === 0) {
            return { valid: false, error: 'Please select at least one grammar topic.' };
        }
        
        const count = this.state.customQuestionCount || this.state.questionCount;
        if (count < 1 || count > 100) {
            return { valid: false, error: 'Please select a valid number of questions (1-100).' };
        }
        
        // Check if enough questions are available
        const availableQuestions = this.state.questions.filter(q => 
            this.state.selectedTopics.includes(q.topic) && 
            q.difficulty === this.state.difficulty
        );
        
        if (availableQuestions.length < count) {
            return { 
                valid: false, 
                error: `Only ${availableQuestions.length} questions available for selected topics and difficulty. Please reduce the question count or select more topics.` 
            };
        }
        
        return { valid: true };
    },

    /**
     * Generate exam
     */
    generateExam() {
        const validation = this.validateExamConfig();
        if (!validation.valid) {
            this.showToast(validation.error, 'error');
            return;
        }
        
        // Disable generate button
        if (this.elements.generateBtn) {
            this.elements.generateBtn.disabled = true;
            this.elements.generateBtn.textContent = 'Generating...';
        }
        
        try {
            // Get configuration
            const config = {
                topics: this.state.selectedTopics,
                difficulty: this.state.difficulty,
                questionCount: this.state.customQuestionCount || this.state.questionCount,
                randomizeQuestions: this.state.randomizeQuestions,
                randomizeAnswers: this.state.randomizeAnswers,
                includeAnswerKey: this.state.includeAnswerKey,
                includeExplanations: this.state.includeExplanations,
                examInfo: { ...this.state.examConfig }
            };
            
            // Generate exam using QuizGenerator
            const result = QuizGenerator.generateQuiz(config);
            
            if (!result.success) {
                this.showToast(result.error, 'error');
                return;
            }
            
            // Store current exam
            this.state.currentExam = {
                id: Utils.generateId(),
                createdAt: new Date().toISOString(),
                config: config,
                questions: result.quiz.questions,
                metadata: result.quiz.metadata
            };
            
            // Render preview
            this.renderPreview(this.state.currentExam);
            
            // Enable buttons
            if (this.elements.regenerateBtn) {
                this.elements.regenerateBtn.disabled = false;
            }
            if (this.elements.downloadPdfBtn) {
                this.elements.downloadPdfBtn.disabled = false;
            }
            
            this.showToast('Exam generated successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating exam:', error);
            this.showToast('Failed to generate exam. Please try again.', 'error');
        } finally {
            if (this.elements.generateBtn) {
                this.elements.generateBtn.disabled = false;
                this.elements.generateBtn.textContent = 'Generate Exam';
            }
        }
    },

    /**
     * Render exam preview
     * @param {Object} exam - Generated exam
     */
    renderPreview(exam) {
        if (!this.elements.previewContainer) return;
        
        const html = PdfGenerator.generatePreviewHtml(exam, exam.config.examInfo);
        this.elements.previewContainer.innerHTML = html;
    },

    /**
     * Download PDF
     */
    async downloadPdf() {
        if (!this.state.currentExam) {
            this.showToast('Please generate an exam first.', 'warning');
            return;
        }
        
        try {
            if (this.elements.downloadPdfBtn) {
                this.elements.downloadPdfBtn.disabled = true;
                this.elements.downloadPdfBtn.textContent = 'Generating PDF...';
            }
            
            const pdfBlob = await PdfGenerator.generatePdf(
                this.state.currentExam,
                this.state.currentExam.config.examInfo
            );
            
            // Generate filename
            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `exam-${timestamp}.pdf`;
            
            PdfGenerator.downloadPdf(pdfBlob, filename);
            
            this.showToast('PDF downloaded successfully!', 'success');
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            this.showToast('Failed to generate PDF. Please try again.', 'error');
        } finally {
            if (this.elements.downloadPdfBtn) {
                this.elements.downloadPdfBtn.disabled = false;
                this.elements.downloadPdfBtn.textContent = 'Download PDF';
            }
        }
    },

    /**
     * Render question list in Question Bank
     */
    renderQuestionList() {
        const container = this.elements.questionList;
        if (!container) return;
        
        // Get filter values
        const search = this.elements.questionSearch?.value.toLowerCase() || '';
        const topicFilter = this.elements.questionTopicFilter?.value || '';
        const difficultyFilter = this.elements.questionDifficultyFilter?.value || '';
        const typeFilter = this.elements.questionTypeFilter?.value || '';
        
        // Filter questions
        let filtered = this.state.questions.filter(q => {
            const matchesSearch = !search || q.question.toLowerCase().includes(search);
            const matchesTopic = !topicFilter || q.topic === topicFilter;
            const matchesDifficulty = !difficultyFilter || q.difficulty === difficultyFilter;
            const matchesType = !typeFilter || q.type === typeFilter;
            
            return matchesSearch && matchesTopic && matchesDifficulty && matchesType;
        });
        
        // Update count
        if (this.elements.questionCount) {
            this.elements.questionCount.textContent = `${filtered.length} questions`;
        }
        
        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h4 class="empty-state-title">No questions found</h4>
                    <p class="empty-state-description">Try adjusting your search or filters.</p>
                </div>
            `;
            return;
        }
        
        // Limit display to first 50 for performance
        const displayQuestions = filtered.slice(0, 50);
        
        container.innerHTML = `
            <div class="question-item question-header">
                <div class="question-id">ID</div>
                <div class="question-preview">Question</div>
                <div class="question-topic">Topic</div>
                <div class="question-difficulty">Difficulty</div>
                <div class="question-type">Type</div>
                <div class="question-actions">Actions</div>
            </div>
            ${displayQuestions.map(q => `
                <div class="question-item">
                    <div class="question-id">${q.id}</div>
                    <div class="question-preview" title="${Utils.escapeHtml(q.question)}">
                        ${Utils.escapeHtml(q.question.substring(0, 80))}${q.question.length > 80 ? '...' : ''}
                    </div>
                    <div class="question-topic">${q.topic}</div>
                    <div class="question-difficulty ${q.difficulty}">${q.difficulty}</div>
                    <div class="question-type">${q.type || 'Multiple Choice'}</div>
                    <div class="question-actions">
                        <button class="btn btn-small" onclick="ExamApp.previewQuestion('${q.id}')">Preview</button>
                    </div>
                </div>
            `).join('')}
        `;
        
        if (filtered.length > 50) {
            container.innerHTML += `
                <div style="padding: var(--spacing-md); text-align: center; color: var(--text-muted);">
                    Showing 50 of ${filtered.length} questions. Use filters to find specific questions.
                </div>
            `;
        }
    },

    /**
     * Render saved exams
     */
    renderSavedExams() {
        const container = this.elements.savedExamsContainer;
        if (!container) return;
        
        if (this.state.savedExams.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📁</div>
                    <h4 class="empty-state-title">No saved exams</h4>
                    <p class="empty-state-description">Generate and save an exam to see it here.</p>
                    <button class="btn btn-primary" onclick="ExamApp.navigate('builder')">
                        Create Your First Exam
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div class="exams-grid">
                ${this.state.savedExams.map(exam => `
                    <div class="exam-card">
                        <div class="exam-card-header">
                            <h4 class="exam-card-title">${Utils.escapeHtml(exam.title || 'Untitled Exam')}</h4>
                            <span class="exam-card-date">${Utils.formatDate(exam.createdAt)}</span>
                        </div>
                        <div class="exam-card-meta">
                            <span>📝 ${exam.questions?.length || 0} questions</span>
                            <span>📊 ${exam.config?.difficulty || 'Medium'}</span>
                            <span>📚 ${(exam.config?.topics || []).length} topics</span>
                        </div>
                        <div class="exam-card-actions">
                            <button class="btn btn-small" onclick="ExamApp.openExam('${exam.id}')">Open</button>
                            <button class="btn btn-small btn-secondary" onclick="ExamApp.duplicateExam('${exam.id}')">Duplicate</button>
                            <button class="btn btn-small btn-danger" onclick="ExamApp.deleteExam('${exam.id}')">Delete</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Render settings
     */
    renderSettings() {
        // Sync theme radio with current theme state
        const currentTheme = ThemeManager.getTheme();
        const themeRadios = document.querySelectorAll('input[name="theme-setting"]');
        themeRadios.forEach(radio => {
            radio.checked = radio.value === currentTheme;
        });
        
        // Load other settings
        const settings = Storage.settings.get();
        
        if (document.getElementById('default-difficulty')) {
            document.getElementById('default-difficulty').value = settings.defaultDifficulty || 'medium';
        }
        if (document.getElementById('default-question-count')) {
            document.getElementById('default-question-count').value = settings.defaultQuestionCount || 15;
        }
        if (document.getElementById('default-language')) {
            document.getElementById('default-language').value = settings.language || 'en';
        }
        
        // Bind theme radio changes
        themeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                ThemeManager.setTheme(e.target.value);
                Storage.settings.update({ theme: e.target.value });
            });
        });
        
        // Bind other setting changes
        const difficultySelect = document.getElementById('default-difficulty');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                Storage.settings.update({ defaultDifficulty: e.target.value });
            });
        }
        
        const countInput = document.getElementById('default-question-count');
        if (countInput) {
            countInput.addEventListener('change', (e) => {
                const value = parseInt(e.target.value);
                if (value > 0 && value <= 100) {
                    Storage.settings.update({ defaultQuestionCount: value });
                }
            });
        }
        
        const languageSelect = document.getElementById('default-language');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                Storage.settings.update({ language: e.target.value });
            });
        }
    },

    /**
     * Preview a question
     * @param {string} questionId - Question ID
     */
    previewQuestion(questionId) {
        const question = this.state.questions.find(q => q.id === questionId);
        if (!question) return;
        
        const html = `
            <div style="font-family: Georgia, serif; padding: var(--spacing-lg);">
                <h3 style="margin-bottom: var(--spacing-md);">Question Preview</h3>
                <div style="margin-bottom: var(--spacing-lg);">
                    <strong>ID:</strong> ${question.id}<br>
                    <strong>Topic:</strong> ${question.topic}<br>
                    <strong>Difficulty:</strong> ${question.difficulty}<br>
                    <strong>Type:</strong> ${question.type || 'Multiple Choice'}
                </div>
                <div style="font-size: 1.1rem; margin-bottom: var(--spacing-lg); padding: var(--spacing-md); background: var(--bg-secondary); border-left: 4px solid var(--accent-primary);">
                    ${question.question}
                </div>
                ${question.options ? `
                    <div style="margin-bottom: var(--spacing-lg);">
                        <strong>Options:</strong>
                        <ol style="margin-top: var(--spacing-sm);">
                            ${question.options.map((opt, i) => `
                                <li style="${i === question.answer ? 'color: var(--accent-success); font-weight: bold;' : ''}">
                                    ${opt} ${i === question.answer ? '✓' : ''}
                                </li>
                            `).join('')}
                        </ol>
                    </div>
                ` : ''}
                ${question.explanation ? `
                    <div style="padding: var(--spacing-md); background: var(--surface-alt); border: 2px solid var(--border-light);">
                        <strong>Explanation:</strong><br>
                        ${question.explanation}
                    </div>
                ` : ''}
            </div>
        `;
        
        this.showModal({
            title: 'Question Preview',
            content: html,
            actions: [
                { label: 'Close', primary: true, onClick: () => this.closeModal() }
            ]
        });
    },

    /**
     * Open a saved exam
     * @param {string} examId - Exam ID
     */
    openExam(examId) {
        const exam = this.state.savedExams.find(e => e.id === examId);
        if (!exam) return;
        
        this.state.currentExam = exam;
        this.renderPreview(exam);
        this.navigate('builder');
        
        if (this.elements.regenerateBtn) {
            this.elements.regenerateBtn.disabled = false;
        }
        if (this.elements.downloadPdfBtn) {
            this.elements.downloadPdfBtn.disabled = false;
        }
        
        this.showToast('Exam loaded successfully!', 'success');
    },

    /**
     * Duplicate a saved exam
     * @param {string} examId - Exam ID
     */
    duplicateExam(examId) {
        const exam = this.state.savedExams.find(e => e.id === examId);
        if (!exam) return;
        
        const duplicate = {
            ...exam,
            id: Utils.generateId(),
            createdAt: new Date().toISOString(),
            title: `${exam.title} (Copy)`
        };
        
        this.state.savedExams.push(duplicate);
        Storage.saveExams(this.state.savedExams);
        this.renderSavedExams();
        this.updateDashboard();
        
        this.showToast('Exam duplicated successfully!', 'success');
    },

    /**
     * Delete a saved exam
     * @param {string} examId - Exam ID
     */
    deleteExam(examId) {
        this.showModal({
            title: 'Confirm Delete',
            content: '<p class="confirmation-message">Are you sure you want to delete this exam? This action cannot be undone.</p>',
            actions: [
                { label: 'Cancel', onClick: () => this.closeModal() },
                { 
                    label: 'Delete', 
                    primary: true, 
                    danger: true,
                    onClick: () => {
                        this.state.savedExams = this.state.savedExams.filter(e => e.id !== examId);
                        Storage.saveExams(this.state.savedExams);
                        this.renderSavedExams();
                        this.updateDashboard();
                        this.closeModal();
                        this.showToast('Exam deleted successfully!', 'success');
                    }
                }
            ]
        });
    },

    /**
     * Show a modal dialog
     * @param {Object} options - Modal options
     */
    showModal(options) {
        const { title, content, actions = [] } = options;
        
        const html = `
            <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title" id="modal-title">${title}</h3>
                        <button class="modal-close" onclick="ExamApp.closeModal()" aria-label="Close modal">×</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${actions.length > 0 ? `
                        <div class="modal-footer">
                            ${actions.map(action => `
                                <button class="btn ${action.danger ? 'btn-danger' : action.primary ? 'btn-primary' : 'btn-secondary'}"
                                    onclick="${action.onClick ? 'ExamApp.closeModal(); void(' + action.onClick.toString() + '())' : 'ExamApp.closeModal()'}">
                                    ${action.label}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        this.elements.modalRoot.innerHTML = html;
    },

    /**
     * Close modal
     */
    closeModal() {
        this.elements.modalRoot.innerHTML = '';
    },

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type: 'success', 'error', 'warning', 'info'
     */
    showToast(message, type = 'info') {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
        `;
        
        this.elements.toastContainer.appendChild(toast);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    /**
     * Save current exam
     */
    saveCurrentExam() {
        if (!this.state.currentExam) {
            this.showToast('No exam to save', 'warning');
            return;
        }
        
        const examToSave = {
            ...this.state.currentExam,
            title: this.state.examConfig.title,
            updatedAt: new Date().toISOString()
        };
        
        // Check if exam already exists
        const existingIndex = this.state.savedExams.findIndex(e => e.id === examToSave.id);
        
        if (existingIndex >= 0) {
            this.state.savedExams[existingIndex] = examToSave;
        } else {
            this.state.savedExams.unshift(examToSave);
        }
        
        Storage.saveExams(this.state.savedExams);
        this.showToast('Exam saved successfully!', 'success');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ExamApp.init();
});
