/**
 * Import/Export Module
 * Handles question bank and exam import/export functionality
 */

const ImportExport = {
    /**
     * Export question bank to JSON file
     * @param {Array} questions - Questions to export
     * @param {string} filename - Output filename
     */
    exportQuestions(questions, filename = 'question-bank.json') {
        const data = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            questionCount: questions.length,
            questions: questions
        };

        this.downloadJSON(data, filename);
    },

    /**
     * Export all saved exams to JSON file
     */
    exportExams(exams, filename = 'saved-exams.json') {
        const data = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            examCount: exams.length,
            exams: exams
        };

        this.downloadJSON(data, filename);
    },

    /**
     * Download JSON data as file
     * @param {Object} data - Data to export
     * @param {string} filename - Filename
     */
    downloadJSON(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Import question bank from JSON file
     * @param {File} file - JSON file to import
     * @returns {Promise<Object>} - Import result with questions and errors
     */
    async importQuestions(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const result = this.validateQuestionBank(data);

                    if (!result.valid) {
                        resolve({
                            success: false,
                            error: result.errors.join('\n'),
                            questions: []
                        });
                        return;
                    }

                    // Merge with existing questions
                    const imported = result.questions.map(q => ({
                        ...q,
                        imported: true,
                        importedAt: new Date().toISOString()
                    }));

                    resolve({
                        success: true,
                        questions: imported,
                        count: imported.length
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        error: 'Invalid JSON file: ' + error.message,
                        questions: []
                    });
                }
            };

            reader.onerror = () => {
                resolve({
                    success: false,
                    error: 'Failed to read file',
                    questions: []
                });
            };

            reader.readAsText(file);
        });
    },

    /**
     * Import saved exams from JSON file
     * @param {File} file - JSON file to import
     * @returns {Promise<Object>} - Import result
     */
    async importExams(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    if (!data.exams || !Array.isArray(data.exams)) {
                        resolve({
                            success: false,
                            error: 'Invalid exam file format',
                            exams: []
                        });
                        return;
                    }

                    // Validate each exam
                    const validExams = [];
                    const errors = [];

                    for (let i = 0; i < data.exams.length; i++) {
                        const exam = data.exams[i];
                        const validation = this.validateExam(exam);

                        if (validation.valid) {
                            validExams.push({
                                ...exam,
                                imported: true,
                                importedAt: new Date().toISOString()
                            });
                        } else {
                            errors.push(`Exam ${i + 1}: ${validation.errors.join(', ')}`);
                        }
                    }

                    resolve({
                        success: errors.length === 0,
                        exams: validExams,
                        count: validExams.length,
                        errors: errors
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        error: 'Invalid JSON file: ' + error.message,
                        exams: []
                    });
                }
            };

            reader.onerror = () => {
                resolve({
                    success: false,
                    error: 'Failed to read file',
                    exams: []
                });
            };

            reader.readAsText(file);
        });
    },

    /**
     * Validate imported question bank structure
     * @param {Object} data - Imported data
     * @returns {Object} - Validation result
     */
    validateQuestionBank(data) {
        const errors = [];
        const questions = [];

        // Check for array or object with questions property
        if (Array.isArray(data)) {
            questions.push(...data);
        } else if (data && Array.isArray(data.questions)) {
            questions.push(...data.questions);
        } else {
            errors.push('No questions found in file');
            return { valid: false, errors, questions: [] };
        }

        // Validate each question
        const validQuestions = [];
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const validation = Utils.validateQuestion(q);

            if (validation.valid) {
                validQuestions.push(q);
            } else {
                errors.push(`Question ${i + 1} (${q.id || 'unknown'}): ${validation.errors.join(', ')}`);
            }
        }

        return {
            valid: errors.length === 0 || validQuestions.length > 0,
            errors,
            questions: validQuestions
        };
    },

    /**
     * Validate exam structure
     * @param {Object} exam - Exam to validate
     * @returns {Object} - Validation result
     */
    validateExam(exam) {
        const errors = [];

        if (!exam.quiz || !exam.quiz.questions) {
            errors.push('Missing quiz data');
        }

        if (!exam.metadata && !exam.quiz.metadata) {
            errors.push('Missing metadata');
        }

        if (!exam.studentInfo && !exam.studentInfo) {
            // Student info is optional
        }

        return {
            valid: errors.length === 0,
            errors
        };
    },

    /**
     * Create a template question bank file for users to edit
     * @returns {Object} - Template structure
     */
    getTemplate() {
        return {
            version: '1.0',
            description: 'Custom Question Bank Template',
            questions: [
                {
                    id: 'custom-001',
                    topic: 'Your Topic',
                    subtopic: 'Optional Subtopic',
                    difficulty: 'easy',
                    type: 'multiple-choice',
                    question: 'Your question text here?',
                    options: ['Option A', 'Option B', 'Option C', 'Option D'],
                    answer: 0,
                    explanation: 'Explanation for the correct answer',
                    tags: ['tag1', 'tag2']
                }
            ]
        };
    },

    /**
     * Download template file
     */
    downloadTemplate() {
        this.downloadJSON(this.getTemplate(), 'question-bank-template.json');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImportExport;
}
