/**
 * i18n Module
 * Centralized translation system for English and Arabic (RTL).
 * Keys are referenced via data-i18n / data-i18n-placeholder attributes in HTML.
 */

const I18n = {
    STORAGE_KEY: 'exam_language',
    current: 'en',

    translations: {
        en: {
            // Brand / header
            appTitle: 'EXAM',
            appSubtitle: 'English Grammar Exam Generator',
            skipToContent: 'Skip to main content',

            // Navigation
            navDashboard: 'Dashboard',
            navCreateExam: 'Create Exam',
            navQuestionBank: 'Question Bank',
            navSavedExams: 'Saved Exams',
            navSettings: 'Settings',

            // Dashboard
            dashboardTitle: 'Dashboard',
            dashboardSubtitle: 'Welcome to EXAM - Your offline English grammar exam generator',
            statTotalQuestions: 'Total Questions',
            statTopicsAvailable: 'Topics Available',
            statSavedExams: 'Saved Exams',
            statCustomQuestions: 'Custom Questions',
            btnCreateNewExam: 'Create New Exam',
            btnBrowseQuestionBank: 'Browse Question Bank',
            recentExams: 'Recent Exams',
            quickStartGuide: 'Quick Start Guide',
            step1: 'Select grammar topics from the Question Bank',
            step2: 'Configure difficulty and number of questions',
            step3: 'Generate your customized exam',
            step4: 'Preview and download as PDF',
            noSavedExamsYet: 'No saved exams yet',
            noSavedExamsHint: 'Create your first exam to see it here.',
            createExam: 'Create Exam',

            // Builder
            builderTitle: 'Create Exam',
            builderSubtitle: 'Configure your exam settings and generate a customized test',
            examDetails: 'Exam Details',
            examTitleLabel: 'Exam Title',
            examTitlePlaceholder: 'Enter exam title',
            subjectLabel: 'Subject',
            subjectPlaceholder: 'Enter subject',
            schoolLabel: 'School/Institution',
            schoolPlaceholder: 'Enter school name',
            teacherLabel: 'Teacher Name',
            teacherPlaceholder: 'Enter teacher name',
            studentLabel: 'Student Name',
            studentPlaceholder: 'Enter student name',
            classLabel: 'Class/Grade',
            classPlaceholder: 'Enter class',
            dateLabel: 'Date',
            durationLabel: 'Duration (minutes)',
            grammarTopics: 'Grammar Topics',
            selectedCountSuffix: 'selected',
            selectAll: 'Select All',
            clearAll: 'Clear All',
            difficultyQuestions: 'Difficulty & Questions',
            difficultyLevel: 'Difficulty Level',
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard',
            advanced: 'Advanced',
            numberOfQuestions: 'Number of Questions',
            customLabel: 'Custom:',
            enterNumber: 'Enter number',
            examOptions: 'Exam Options',
            randomizeQuestions: 'Randomize Questions',
            randomizeAnswers: 'Randomize Answers',
            includeAnswerKey: 'Include Answer Key',
            includeExplanations: 'Include Explanations',
            generateExam: 'Generate Exam',
            generating: 'Generating...',
            loadingQuestionBank: 'Loading question bank...',
            questionsAvailable: 'questions available',
            examPreview: 'Exam Preview',
            regenerate: 'Regenerate',
            downloadPdf: 'Download PDF',
            generatingPdf: 'Generating PDF...',
            previewEmptyText: 'Your exam preview will appear here',
            previewEmptyHint: 'Configure the settings and click "Generate Exam"',
            saveExam: 'Save Exam',
            printExam: 'Print',

            // Question bank view
            questionBankTitle: 'Question Bank',
            questionBankSubtitle: 'Browse, search, and manage your grammar questions',
            searchQuestionsPlaceholder: 'Search questions...',
            allTopics: 'All Topics',
            allDifficulties: 'All Difficulties',
            allTypes: 'All Types',
            typeMultipleChoice: 'Multiple Choice',
            typeTrueFalse: 'True/False',
            typeFillBlank: 'Fill in Blank',
            typeShortAnswer: 'Short Answer',
            typeMatching: 'Matching',
            addQuestion: 'Add Question',
            exportBtn: 'Export',
            importBtn: 'Import',
            showingQuestions: 'questions',
            noQuestionsFound: 'No questions found',
            noQuestionsFoundHint: 'Try adjusting your filters or add a new question',
            colId: 'ID',
            colQuestion: 'Question',
            colTopic: 'Topic',
            colDifficulty: 'Difficulty',
            colType: 'Type',
            colActions: 'Actions',
            preview: 'Preview',
            edit: 'Edit',
            duplicate: 'Duplicate',
            delete: 'Delete',
            cancel: 'Cancel',
            close: 'Close',
            confirm: 'Confirm',
            save: 'Save',
            showingFirst50: 'Showing 50 of {total} questions. Use filters to find specific questions.',

            // Saved exams view
            savedExamsTitle: 'Saved Exams',
            savedExamsSubtitle: 'Manage your previously generated exams',
            importExam: 'Import Exam',
            noSavedExams: 'No saved exams',
            noSavedExamsDesc: 'Generate and save an exam to see it here.',
            createYourFirstExam: 'Create Your First Exam',
            open: 'Open',
            questionsWord: 'questions',
            topicsWord: 'topics',

            // Settings
            settingsTitle: 'Settings',
            settingsSubtitle: 'Customize your EXAM experience',
            appearance: 'Appearance',
            themeLabel: 'Theme',
            themeDescription: 'Choose your preferred color theme',
            light: 'Light',
            dark: 'Dark',
            system: 'System',
            languageLabel: 'Language',
            languageDescription: 'Choose your interface language',
            defaultExamSettings: 'Default Exam Settings',
            defaultDifficulty: 'Default Difficulty',
            defaultDifficultyDesc: 'Default difficulty for new exams',
            defaultQuestionCount: 'Default Question Count',
            defaultQuestionCountDesc: 'Default number of questions for new exams',
            dataManagement: 'Data Management',
            exportAllQuestions: 'Export Question Bank',
            exportAllQuestionsDesc: 'Download all custom questions as JSON',
            exportAllExams: 'Export All Exams',
            exportAllExamsDesc: 'Download all saved exams as JSON',
            clearCustomQuestions: 'Clear Custom Questions',
            clearCustomQuestionsDesc: 'Remove all custom questions from local storage',
            clearAllData: 'Clear All Data',
            clearAllDataDesc: 'Reset all application data to defaults',
            resetAllData: 'Reset All Data',
            aboutExam: 'About EXAM',

            // Modals / messages
            confirmDeleteTitle: 'Confirm Delete',
            confirmDeleteExamMsg: 'Are you sure you want to delete this exam? This action cannot be undone.',
            confirmClearQuestionsMsg: 'Are you sure you want to delete all custom questions? This action cannot be undone.',
            confirmClearAllDataMsg: 'Are you sure you want to reset ALL application data? Exams, custom questions and settings will be removed.',
            toastExamGenerated: 'Exam generated successfully!',
            toastExamSaved: 'Exam saved successfully!',
            toastExamLoaded: 'Exam loaded successfully!',
            toastExamDuplicated: 'Exam duplicated successfully!',
            toastExamDeleted: 'Exam deleted successfully!',
            toastPdfDone: 'PDF downloaded successfully!',
            toastQuestionAdded: 'Question added to the bank!',
            toastQuestionUpdated: 'Question updated!',
            toastQuestionDeleted: 'Custom question deleted!',
            toastImportedQuestions: 'Imported {count} questions into the bank.',
            toastImportedExams: 'Imported {count} exams.',
            toastClearedQuestions: 'Custom questions cleared.',
            toastDataReset: 'All data has been reset.',
            toastLanguageChanged: 'Language switched to English.',
            errNoTopics: 'Please select at least one grammar topic.',
            errInvalidCount: 'Please select a valid number of questions (1-100).',
            errNotEnoughQuestions: 'Only {available} questions available for selected topics and difficulty. Please reduce the question count or select more topics.',
            errNoQuestionsLoaded: 'No questions are available for the selected topics. Please try selecting different topics.',
            errGenerateFailed: 'Failed to generate exam. Please try again.',
            errPdfFailed: 'Failed to generate PDF. Please try again.',
            errNoExamToSave: 'No exam to save',
            errNoExamFirst: 'Please generate an exam first.',
            errInitFailed: 'Failed to initialize application',
            errInvalidJsonFile: 'The selected file is not a valid JSON file.',
            errNoQuestionsInFile: 'No questions found in file.',
            errStorageFull: 'Browser storage is full. Unable to save.',
            validationError: 'Please fill in all required fields correctly.',
            addQuestionTitle: 'Add Question',
            editQuestionTitle: 'Edit Question',
            questionTextLabel: 'Question Text',
            questionTextPlaceholder: 'Enter your question',
            optionsLabel: 'Answer Options',
            optionA: 'Option A', optionB: 'Option B', optionC: 'Option C', optionD: 'Option D',
            correctAnswerIndex: 'Correct Answer Index (0-3)',
            explanationLabel: 'Explanation (Optional)',
            explanationPlaceholder: 'Explain why this answer is correct',
            tagsLabel: 'Tags (Optional)',
            tagsPlaceholder: 'comma, separated, tags',
            saveQuestion: 'Save Question',
            updateQuestion: 'Update Question',
            deleteQuestionBtn: 'Delete',
            questionPreviewTitle: 'Question Preview',
            onlyCustomEditable: 'Built-in bank questions are read-only. You can still preview them.',
            versionInfo: 'Version',
            offlineNote: 'All data stays in your browser. Nothing is uploaded to any server.'
        },

        ar: {
            // Brand / header
            appTitle: 'إكزام',
            appSubtitle: 'مولّد اختبارات القواعد الإنجليزية',
            skipToContent: 'الانتقال إلى المحتوى الرئيسي',

            // Navigation
            navDashboard: 'لوحة التحكم',
            navCreateExam: 'إنشاء اختبار',
            navQuestionBank: 'بنك الأسئلة',
            navSavedExams: 'الاختبارات المحفوظة',
            navSettings: 'الإعدادات',

            // Dashboard
            dashboardTitle: 'لوحة التحكم',
            dashboardSubtitle: 'مرحبًا بك في إكزام — مولّد اختبارات القواعد الإنجليزية الذي يعمل دون اتصال',
            statTotalQuestions: 'إجمالي الأسئلة',
            statTopicsAvailable: 'المواضيع المتاحة',
            statSavedExams: 'الاختبارات المحفوظة',
            statCustomQuestions: 'الأسئلة المخصصة',
            btnCreateNewExam: 'إنشاء اختبار جديد',
            btnBrowseQuestionBank: 'تصفّح بنك الأسئلة',
            recentExams: 'أحدث الاختبارات',
            quickStartGuide: 'دليل البدء السريع',
            step1: 'اختر مواضيع القواعد من بنك الأسئلة',
            step2: 'حدّد مستوى الصعوبة وعدد الأسئلة',
            step3: 'أنشئ اختبارك المخصّص',
            step4: 'عاين الاختبار وحمّله بصيغة PDF',
            noSavedExamsYet: 'لا توجد اختبارات محفوظة بعد',
            noSavedExamsHint: 'أنشئ أول اختبار ليظهر هنا.',
            createExam: 'إنشاء اختبار',

            // Builder
            builderTitle: 'إنشاء اختبار',
            builderSubtitle: 'اضبط إعدادات الاختبار وأنشئ اختبارًا مخصّصًا',
            examDetails: 'بيانات الاختبار',
            examTitleLabel: 'عنوان الاختبار',
            examTitlePlaceholder: 'أدخل عنوان الاختبار',
            subjectLabel: 'المادة',
            subjectPlaceholder: 'أدخل اسم المادة',
            schoolLabel: 'المدرسة / المؤسسة',
            schoolPlaceholder: 'أدخل اسم المدرسة',
            teacherLabel: 'اسم المعلم',
            teacherPlaceholder: 'أدخل اسم المعلم',
            studentLabel: 'اسم الطالب',
            studentPlaceholder: 'أدخل اسم الطالب',
            classLabel: 'الفصل / الصف',
            classPlaceholder: 'أدخل الفصل',
            dateLabel: 'التاريخ',
            durationLabel: 'المدة (بالدقائق)',
            grammarTopics: 'مواضيع القواعد',
            selectedCountSuffix: 'محدد',
            selectAll: 'تحديد الكل',
            clearAll: 'إلغاء التحديد',
            difficultyQuestions: 'الصعوبة والأسئلة',
            difficultyLevel: 'مستوى الصعوبة',
            easy: 'سهل',
            medium: 'متوسط',
            hard: 'صعب',
            advanced: 'متقدم',
            numberOfQuestions: 'عدد الأسئلة',
            customLabel: 'مخصص:',
            enterNumber: 'أدخل عددًا',
            examOptions: 'خيارات الاختبار',
            randomizeQuestions: 'ترتيب عشوائي للأسئلة',
            randomizeAnswers: 'ترتيب عشوائي للإجابات',
            includeAnswerKey: 'تضمين نموذج الإجابة',
            includeExplanations: 'تضمين الشرح',
            generateExam: 'إنشاء الاختبار',
            generating: 'جارٍ الإنشاء...',
            loadingQuestionBank: 'جارٍ تحميل بنك الأسئلة...',
            questionsAvailable: 'سؤالًا متاحًا',
            examPreview: 'معاينة الاختبار',
            regenerate: 'إعادة الإنشاء',
            downloadPdf: 'تنزيل PDF',
            generatingPdf: 'جارٍ إنشاء PDF...',
            previewEmptyText: 'ستظهر معاينة الاختبار هنا',
            previewEmptyHint: 'اضبط الإعدادات ثم اضغط "إنشاء الاختبار"',
            saveExam: 'حفظ الاختبار',
            printExam: 'طباعة',

            // Question bank view
            questionBankTitle: 'بنك الأسئلة',
            questionBankSubtitle: 'تصفّح وابحث وأدر أسئلة القواعد',
            searchQuestionsPlaceholder: 'ابحث في الأسئلة...',
            allTopics: 'كل المواضيع',
            allDifficulties: 'كل المستويات',
            allTypes: 'كل الأنواع',
            typeMultipleChoice: 'اختيار من متعدد',
            typeTrueFalse: 'صح / خطأ',
            typeFillBlank: 'أكمل الفراغ',
            typeShortAnswer: 'إجابة قصيرة',
            typeMatching: 'المطابقة',
            addQuestion: 'إضافة سؤال',
            exportBtn: 'تصدير',
            importBtn: 'استيراد',
            showingQuestions: 'سؤالًا',
            noQuestionsFound: 'لم يتم العثور على أسئلة',
            noQuestionsFoundHint: 'جرّب تعديل عوامل التصفية أو إضافة سؤال جديد',
            colId: 'المعرّف',
            colQuestion: 'السؤال',
            colTopic: 'الموضوع',
            colDifficulty: 'الصعوبة',
            colType: 'النوع',
            colActions: 'إجراءات',
            preview: 'معاينة',
            edit: 'تعديل',
            duplicate: 'نسخ',
            delete: 'حذف',
            cancel: 'إلغاء',
            close: 'إغلاق',
            confirm: 'تأكيد',
            save: 'حفظ',
            showingFirst50: 'عرض 50 من أصل {total} سؤالًا. استخدم عوامل التصفية للعثور على أسئلة محددة.',

            // Saved exams view
            savedExamsTitle: 'الاختبارات المحفوظة',
            savedExamsSubtitle: 'أدر الاختبارات التي أنشأتها سابقًا',
            importExam: 'استيراد اختبار',
            noSavedExams: 'لا توجد اختبارات محفوظة',
            noSavedExamsDesc: 'أنشئ اختبارًا واحفظه ليظهر هنا.',
            createYourFirstExam: 'أنشئ أول اختبار',
            open: 'فتح',
            questionsWord: 'أسئلة',
            topicsWord: 'مواضيع',

            // Settings
            settingsTitle: 'الإعدادات',
            settingsSubtitle: 'خصّص تجربتك مع إكزام',
            appearance: 'المظهر',
            themeLabel: 'السمة',
            themeDescription: 'اختر السمة اللونية المفضلة لديك',
            light: 'فاتح',
            dark: 'داكن',
            system: 'النظام',
            languageLabel: 'اللغة',
            languageDescription: 'اختر لغة الواجهة',
            defaultExamSettings: 'الإعدادات الافتراضية للاختبار',
            defaultDifficulty: 'مستوى الصعوبة الافتراضي',
            defaultDifficultyDesc: 'المستوى الافتراضي للاختبارات الجديدة',
            defaultQuestionCount: 'عدد الأسئلة الافتراضي',
            defaultQuestionCountDesc: 'العدد الافتراضي للأسئلة في الاختبارات الجديدة',
            dataManagement: 'إدارة البيانات',
            exportAllQuestions: 'تصدير بنك الأسئلة',
            exportAllQuestionsDesc: 'تنزيل جميع الأسئلة المخصصة بصيغة JSON',
            exportAllExams: 'تصدير كل الاختبارات',
            exportAllExamsDesc: 'تنزيل جميع الاختبارات المحفوظة بصيغة JSON',
            clearCustomQuestions: 'مسح الأسئلة المخصصة',
            clearCustomQuestionsDesc: 'إزالة كل الأسئلة المخصصة من التخزين المحلي',
            clearAllData: 'مسح كل البيانات',
            clearAllDataDesc: 'إعادة ضبط جميع بيانات التطبيق إلى الوضع الافتراضي',
            resetAllData: 'إعادة ضبط الكل',
            aboutExam: 'حول إكزام',

            // Modals / messages
            confirmDeleteTitle: 'تأكيد الحذف',
            confirmDeleteExamMsg: 'هل أنت متأكد من حذف هذا الاختبار؟ لا يمكن التراجع عن هذا الإجراء.',
            confirmClearQuestionsMsg: 'هل أنت متأكد من حذف جميع الأسئلة المخصصة؟ لا يمكن التراجع عن هذا الإجراء.',
            confirmClearAllDataMsg: 'هل أنت متأكد من إعادة ضبط جميع البيانات؟ سيتم حذف الاختبارات والأسئلة المخصصة والإعدادات.',
            toastExamGenerated: 'تم إنشاء الاختبار بنجاح!',
            toastExamSaved: 'تم حفظ الاختبار بنجاح!',
            toastExamLoaded: 'تم تحميل الاختبار بنجاح!',
            toastExamDuplicated: 'تم نسخ الاختبار بنجاح!',
            toastExamDeleted: 'تم حذف الاختبار بنجاح!',
            toastPdfDone: 'تم تنزيل ملف PDF بنجاح!',
            toastQuestionAdded: 'تمت إضافة السؤال إلى البنك!',
            toastQuestionUpdated: 'تم تحديث السؤال!',
            toastQuestionDeleted: 'تم حذف السؤال المخصص!',
            toastImportedQuestions: 'تم استيراد {count} سؤالًا إلى البنك.',
            toastImportedExams: 'تم استيراد {count} اختبارًا.',
            toastClearedQuestions: 'تم مسح الأسئلة المخصصة.',
            toastDataReset: 'تمت إعادة ضبط جميع البيانات.',
            toastLanguageChanged: 'تم تبديل اللغة إلى العربية.',
            errNoTopics: 'يرجى اختيار موضوع قواعدي واحد على الأقل.',
            errInvalidCount: 'يرجى تحديد عدد صحيح للأسئلة (1-100).',
            errNotEnoughQuestions: 'متاح {available} سؤالًا فقط للمواضيع والمستوى المحددين. يرجى تقليل عدد الأسئلة أو اختيار مواضيع إضافية.',
            errNoQuestionsLoaded: 'لا توجد أسئلة متاحة للمواضيع المحددة. جرّب اختيار مواضيع أخرى.',
            errGenerateFailed: 'تعذّر إنشاء الاختبار. يرجى المحاولة مرة أخرى.',
            errPdfFailed: 'تعذّر إنشاء ملف PDF. يرجى المحاولة مرة أخرى.',
            errNoExamToSave: 'لا يوجد اختبار للحفظ',
            errNoExamFirst: 'يرجى إنشاء اختبار أولًا.',
            errInitFailed: 'تعذّر تهيئة التطبيق',
            errInvalidJsonFile: 'الملف المحدد ليس ملف JSON صالحًا.',
            errNoQuestionsInFile: 'لم يتم العثور على أسئلة في الملف.',
            errStorageFull: 'مساحة تخزين المتصفح ممتلئة. تعذّر الحفظ.',
            validationError: 'يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح.',
            addQuestionTitle: 'إضافة سؤال',
            editQuestionTitle: 'تعديل سؤال',
            questionTextLabel: 'نص السؤال',
            questionTextPlaceholder: 'اكتب سؤالك',
            optionsLabel: 'خيارات الإجابة',
            optionA: 'الخيار أ', optionB: 'الخيار ب', optionC: 'الخيار ج', optionD: 'الخيار د',
            correctAnswerIndex: 'فهرس الإجابة الصحيحة (0-3)',
            explanationLabel: 'الشرح (اختياري)',
            explanationPlaceholder: 'اشرح سبب صحة هذه الإجابة',
            tagsLabel: 'الوسوم (اختياري)',
            tagsPlaceholder: 'وسوم مفصولة بفواصل',
            saveQuestion: 'حفظ السؤال',
            updateQuestion: 'تحديث السؤال',
            deleteQuestionBtn: 'حذف',
            questionPreviewTitle: 'معاينة السؤال',
            onlyCustomEditable: 'أسئلة البنك المدمجة للقراءة فقط. يمكنك معاينتها.',
            versionInfo: 'الإصدار',
            offlineNote: 'تبقى جميع البيانات في متصفحك. لا يتم رفع أي شيء إلى أي خادم.'
        }
    },

    t(key, vars) {
        let str = (this.translations[this.current] && this.translations[this.current][key]) ||
                  this.translations.en[key] || key;
        if (vars) {
            Object.keys(vars).forEach(v => {
                str = str.replace(new RegExp('\\{' + v + '\\}', 'g'), vars[v]);
            });
        }
        return str;
    },

    getLang() {
        let l = 'en';
        try { l = localStorage.getItem(this.STORAGE_KEY); } catch (e) {}
        return (l === 'ar') ? 'ar' : 'en';
    },

    setLang(lang, persist = true) {
        lang = (lang === 'ar') ? 'ar' : 'en';
        this.current = lang;
        if (persist) {
            try { localStorage.setItem(this.STORAGE_KEY, lang); } catch (e) {}
        }

        const root = document.documentElement;
        root.lang = lang;
        root.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        root.classList.toggle('lang-ar', lang === 'ar');
        root.classList.toggle('lang-en', lang === 'en');

        this.applyToDOM();

        // Notify app modules so dynamic content can re-render
        document.dispatchEvent(new CustomEvent('languagechange:i18n', { detail: { lang } }));
    },

    toggle() {
        this.setLang(this.current === 'en' ? 'ar' : 'en');
    },

    applyToDOM() {
        // Text nodes
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = this.t(el.getAttribute('data-i18n'));
        });
        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.setAttribute('placeholder', this.t(el.getAttribute('data-i18n-placeholder')));
        });
        // Aria labels / titles
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            el.setAttribute('aria-label', this.t(el.getAttribute('data-i18n-aria')));
        });
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            el.setAttribute('title', this.t(el.getAttribute('data-i18n-title')));
        });

        // Update language toggle button label (shows the OTHER language)
        const codeEl = document.getElementById('lang-code-display');
        if (codeEl) codeEl.textContent = (this.current === 'en') ? 'عربي' : 'EN';
    },

    init() {
        this.current = this.getLang();
        const root = document.documentElement;
        root.lang = this.current;
        root.dir = (this.current === 'ar') ? 'rtl' : 'ltr';
        root.classList.toggle('lang-ar', this.current === 'ar');
        root.classList.toggle('lang-en', this.current === 'en');
        this.applyToDOM();
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}

document.addEventListener('DOMContentLoaded', () => {
    I18n.init();
});
