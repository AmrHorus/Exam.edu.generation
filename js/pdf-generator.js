/**
 * PDF Generator Module
 * Handles PDF creation using jsPDF
 */

const PdfGenerator = {
    /**
     * Generate a PDF from quiz data
     * @param {Object} quiz - Quiz object with questions and metadata
     * @param {Object} studentInfo - Student information (name, class, teacher, date)
     * @returns {Promise<Blob>} - PDF blob
     */
    async generatePdf(quiz, studentInfo) {
        const { jsPDF } = window.jspdf;
        
        // Create A4 PDF (210mm x 297mm)
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        let yPos = margin;
        let pageNumber = 1;

        // Helper function to add header
        const addHeader = () => {
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('ENGLISH GRAMMAR QUIZ', pageWidth / 2, yPos, { align: 'center' });
            yPos += 8;
            
            // Draw line under header
            doc.setLineWidth(0.5);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 10;
        };

        // Helper function to add footer with page number
        const addFooter = (pageNum, totalPages) => {
            const footerY = pageHeight - 15;
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100);
            doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, footerY, { align: 'center' });
        };

        // Helper function to check if we need a new page
        const checkNewPage = (requiredSpace) => {
            if (yPos + requiredSpace > pageHeight - 20) {
                // Add footer to current page
                addFooter(pageNumber, this.estimateTotalPages(quiz, studentInfo));
                
                // Add new page
                doc.addPage();
                pageNumber++;
                yPos = margin;
                addHeader();
                return true;
            }
            return false;
        };

        // Start PDF generation
        addHeader();

        // Student Information Section
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0);

        const infoLines = [];
        if (studentInfo.name && studentInfo.name.trim()) {
            infoLines.push(`Name: ${studentInfo.name}`);
        }
        if (studentInfo.class && studentInfo.class.trim()) {
            infoLines.push(`Class: ${studentInfo.class}`);
        }
        if (studentInfo.teacher && studentInfo.teacher.trim()) {
            infoLines.push(`Teacher: ${studentInfo.teacher}`);
        }
        if (studentInfo.date && studentInfo.date.trim()) {
            infoLines.push(`Date: ${studentInfo.date}`);
        }

        // If no student info provided, show blank lines for filling in
        if (infoLines.length === 0) {
            infoLines.push('Name: _________________________');
            infoLines.push('Class: ________________________');
            infoLines.push('Date: _________________________');
        }

        for (const line of infoLines) {
            checkNewPage(10);
            doc.text(line, margin, yPos);
            yPos += 7;
        }

        yPos += 5;

        // Quiz Metadata
        checkNewPage(15);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(80);
        
        const topicsText = `Topics: ${quiz.metadata.topics.join(', ')}`;
        doc.text(topicsText, margin, yPos);
        yPos += 6;
        
        const difficultyText = `Difficulty: ${this.capitalizeFirst(quiz.metadata.difficulty)} | Questions: ${quiz.metadata.questionCount}`;
        doc.text(difficultyText, margin, yPos);
        yPos += 10;

        // Reset font for questions
        doc.setFont('times', 'normal');
        doc.setTextColor(0);

        // Add Questions
        doc.setFontSize(12);
        
        for (let i = 0; i < quiz.questions.length; i++) {
            const question = quiz.questions[i];
            checkNewPage(35); // Estimate space needed for question + options

            // Question number and text
            doc.setFont('times', 'bold');
            const questionText = `${question.questionNumber}. ${question.question}`;
            const wrappedQuestion = doc.splitTextToSize(questionText, contentWidth - 10);
            doc.text(wrappedQuestion, margin + 5, yPos);
            yPos += (wrappedQuestion.length * 5) + 3;

            // Options
            doc.setFont('times', 'normal');
            doc.setFontSize(11);
            const letters = ['A', 'B', 'C', 'D'];
            
            for (let j = 0; j < question.options.length; j++) {
                const optionText = `${letters[j]}. ${question.options[j]}`;
                const wrappedOption = doc.splitTextToSize(optionText, contentWidth - 15);
                doc.text(wrappedOption, margin + 10, yPos);
                yPos += (wrappedOption.length * 5) + 2;
            }

            // Explanation (if enabled)
            if (quiz.metadata.includeExplanations && question.explanation) {
                yPos += 2;
                doc.setFont('times', 'italic');
                doc.setFontSize(10);
                doc.setTextColor(80);
                const explanationText = `Explanation: ${question.explanation}`;
                const wrappedExplanation = doc.splitTextToSize(explanationText, contentWidth - 10);
                doc.text(wrappedExplanation, margin + 10, yPos);
                yPos += (wrappedExplanation.length * 5) + 5;
                doc.setTextColor(0);
                doc.setFont('times', 'normal');
            }

            yPos += 8; // Space between questions
        }

        // Add Answer Key if enabled
        if (quiz.metadata.includeAnswerKey) {
            // Check if we need a new page for answer key
            checkNewPage(40);
            
            yPos += 10;
            
            // Draw separator line
            doc.setLineWidth(1);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 10;

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('ANSWER KEY', pageWidth / 2, yPos, { align: 'center' });
            yPos += 10;

            doc.setFont('times', 'normal');
            doc.setFontSize(11);

            const letters = ['A', 'B', 'C', 'D'];
            const answersPerRow = 5;
            let colCount = 0;
            let rowStartX = margin;

            for (let i = 0; i < quiz.questions.length; i++) {
                const question = quiz.questions[i];
                const correctLetter = letters[question.answer];
                
                if (colCount >= answersPerRow) {
                    colCount = 0;
                    rowStartX = margin;
                    yPos += 8;
                    checkNewPage(15);
                }

                const answerText = `${question.questionNumber}. ${correctLetter}`;
                doc.text(answerText, rowStartX + (colCount * 40), yPos);

                colCount++;
            }

            // Add explanations in answer key if enabled
            if (quiz.metadata.includeExplanations) {
                yPos += 15;
                checkNewPage(20);
                
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(12);
                doc.text('EXPLANATIONS', margin, yPos);
                yPos += 8;

                doc.setFont('times', 'normal');
                doc.setFontSize(10);

                for (let i = 0; i < quiz.questions.length; i++) {
                    const question = quiz.questions[i];
                    
                    if (question.explanation) {
                        checkNewPage(15);
                        
                        const correctLetter = letters[question.answer];
                        const explanationText = `${question.questionNumber}. ${correctLetter} — ${question.explanation}`;
                        const wrappedExplanation = doc.splitTextToSize(explanationText, contentWidth);
                        
                        doc.text(wrappedExplanation, margin, yPos);
                        yPos += (wrappedExplanation.length * 5) + 3;
                    }
                }
            }
        }

        // Add final footer
        addFooter(pageNumber, this.estimateTotalPages(quiz, studentInfo));

        // Save the PDF
        return doc.output('blob');
    },

    /**
     * Download PDF file
     * @param {Blob} pdfBlob - PDF blob
     * @param {string} filename - Filename for download
     */
    downloadPdf(pdfBlob, filename = 'grammar-quiz.pdf') {
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Capitalize first letter of string
     * @param {string} str - String to capitalize
     * @returns {string} - Capitalized string
     */
    capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Estimate total pages for footer display
     * @param {Object} quiz - Quiz object
     * @param {Object} studentInfo - Student info
     * @returns {number} - Estimated page count
     */
    estimateTotalPages(quiz, studentInfo) {
        // Rough estimation based on question count
        const basePages = 1;
        const questionsPerPage = 8;
        const questionPages = Math.ceil(quiz.questions.length / questionsPerPage);
        const answerKeyPages = quiz.metadata.includeAnswerKey ? 1 : 0;
        const explanationPages = quiz.metadata.includeExplanations ? Math.ceil(quiz.questions.length / 15) : 0;
        
        return basePages + questionPages + answerKeyPages + explanationPages;
    },

    /**
     * Generate preview HTML for the quiz
     * @param {Object} quiz - Quiz object
     * @param {Object} studentInfo - Student information
     * @returns {string} - HTML string
     */
    generatePreviewHtml(quiz, studentInfo) {
        const letters = ['A', 'B', 'C', 'D'];
        
        let html = `
            <div class="quiz-preview-header">
                <h2>English Grammar Quiz</h2>
            </div>
            
            <div class="student-info">
        `;

        // Student info lines
        const hasStudentInfo = studentInfo.name || studentInfo.class || studentInfo.teacher || studentInfo.date;
        
        if (hasStudentInfo) {
            if (studentInfo.name) {
                html += `<div class="info-line"><label>Name:</label><span>${this.escapeHtml(studentInfo.name)}</span></div>`;
            }
            if (studentInfo.class) {
                html += `<div class="info-line"><label>Class:</label><span>${this.escapeHtml(studentInfo.class)}</span></div>`;
            }
            if (studentInfo.teacher) {
                html += `<div class="info-line"><label>Teacher:</label><span>${this.escapeHtml(studentInfo.teacher)}</span></div>`;
            }
            if (studentInfo.date) {
                html += `<div class="info-line"><label>Date:</label><span>${studentInfo.date}</span></div>`;
            }
        } else {
            html += `
                <div class="info-line"><label>Name:</label><span></span></div>
                <div class="info-line"><label>Class:</label><span></span></div>
                <div class="info-line"><label>Date:</label><span></span></div>
            `;
        }

        html += `</div>`;

        // Quiz meta
        html += `
            <div class="quiz-meta">
                <p><strong>Topics:</strong> ${quiz.metadata.topics.join(', ')}</p>
                <p><strong>Difficulty:</strong> ${this.capitalizeFirst(quiz.metadata.difficulty)}</p>
                <p><strong>Number of Questions:</strong> ${quiz.metadata.questionCount}</p>
            </div>
        `;

        // Questions
        html += `<div class="questions-list">`;
        
        for (const question of quiz.questions) {
            html += `
                <div class="question-item">
                    <div class="question-text">${question.questionNumber}. ${this.escapeHtml(question.question)}</div>
                    <ul class="options-list">
            `;
            
            for (let i = 0; i < question.options.length; i++) {
                html += `<li><span class="option-label">${letters[i]}.</span> ${this.escapeHtml(question.options[i])}</li>`;
            }
            
            html += `</ul>`;
            
            // Explanation
            if (quiz.metadata.includeExplanations && question.explanation) {
                html += `<div class="explanation">💡 ${this.escapeHtml(question.explanation)}</div>`;
            }
            
            html += `</div>`;
        }
        
        html += `</div>`;

        // Answer Key
        if (quiz.metadata.includeAnswerKey) {
            html += `
                <div class="answer-key">
                    <h3>Answer Key</h3>
            `;
            
            if (quiz.metadata.includeExplanations) {
                // Show answers with explanations
                for (const question of quiz.questions) {
                    const correctLetter = letters[question.answer];
                    html += `
                        <div class="answer-with-explanation">
                            <strong>${question.questionNumber}. ${correctLetter}</strong>
                            ${question.explanation ? this.escapeHtml(question.explanation) : ''}
                        </div>
                    `;
                }
            } else {
                // Show grid of answers
                html += `<div class="answer-key-grid">`;
                for (const question of quiz.questions) {
                    const correctLetter = letters[question.answer];
                    html += `<div class="answer-item">${question.questionNumber}. ${correctLetter}</div>`;
                }
                html += `</div>`;
            }
            
            html += `</div>`;
        }

        return html;
    },

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PdfGenerator;
}
