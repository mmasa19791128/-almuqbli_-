/**
 * نظام الترجمة متعدد اللغات - الإصدار 4.0
 * 🌐 يدعم 6 لغات: العربية، الإنجليزية، الفرنسية، الصينية، الهندية، الروسية
 * 🔗 متكامل مع جميع أنظمة المشروع الزراعي
 */

class SmartAgricultureI18n {
    constructor() {
        this.languages = {
            'ar': { 
                name: 'العربية', 
                native: 'العربية', 
                flag: '🇸🇦', 
                dir: 'rtl',
                locale: 'ar-SA',
                fontFamily: 'Tajawal, Arial, sans-serif'
            },
            'en': { 
                name: 'English', 
                native: 'English', 
                flag: '🇺🇸', 
                dir: 'ltr',
                locale: 'en-US',
                fontFamily: 'Arial, sans-serif'
            },
            'fr': { 
                name: 'French', 
                native: 'Français', 
                flag: '🇫🇷', 
                dir: 'ltr',
                locale: 'fr-FR',
                fontFamily: 'Arial, sans-serif'
            },
            'zh': { 
                name: 'Chinese', 
                native: '中文', 
                flag: '🇨🇳', 
                dir: 'ltr',
                locale: 'zh-CN',
                fontFamily: 'Arial, sans-serif'
            },
            'hi': { 
                name: 'Hindi', 
                native: 'हिन्दी', 
                flag: '🇮🇳', 
                dir: 'ltr',
                locale: 'hi-IN',
                fontFamily: 'Arial, sans-serif'
            },
            'ru': { 
                name: 'Russian', 
                native: 'Русский', 
                flag: '🇷🇺', 
                dir: 'ltr',
                locale: 'ru-RU',
                fontFamily: 'Arial, sans-serif'
            }
        };
        
        this.currentLang = 'ar';
        this.translations = {};
        this.availableLangs = new Set();
        this.translationCache = new Map();
        this.loading = false;
        
        // ⭐ ربط مع أنظمة المشروع
        this.setupProjectIntegration();
        
        // تهيئة النظام
        this.init();
    }

    /**
     * ⭐ ربط مع أنظمة المشروع
     */
    setupProjectIntegration() {
        // ربط مع نظام النقاط
        if (window.pointsSystem) {
            this.pointsSystem = window.pointsSystem;
            console.log('✅ تم ربط نظام الترجمة مع نظام النقاط');
        }
        
        // ربط مع نظام المساعدات
        if (window.helpers) {
            this.helpers = window.helpers;
            console.log('✅ تم ربط نظام الترجمة مع نظام المساعدات');
        }
        
        // ربط مع نظام التنسيق
        if (window.formatters) {
            this.formatters = window.formatters;
            console.log('✅ تم ربط نظام الترجمة مع نظام التنسيق');
        }
        
        // ربط مع الجسر الرئيسي
        if (window.mainBridge) {
            this.mainBridge = window.mainBridge;
            window.mainBridge.i18n = this;
            console.log('✅ تم ربط نظام الترجمة مع الجسر الرئيسي');
        }
        
        // إعداد قاعدة البيانات المحلية
        this.setupDatabase();
        
        // حقن أنماط CSS للترجمة
        this.injectI18nStyles();
    }
    
    /**
     * ⭐ إعداد قاعدة البيانات المحلية
     */
    setupDatabase() {
        if ('indexedDB' in window) {
            this.dbName = 'agriculture-translations';
            this.dbVersion = 1;
            this.setupIndexedDB();
        }
    }
    
    setupIndexedDB() {
        const request = indexedDB.open(this.dbName, this.dbVersion);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // مخزن للترجمات
            if (!db.objectStoreNames.contains('translations')) {
                const store = db.createObjectStore('translations', { 
                    keyPath: ['lang', 'key']
                });
                store.createIndex('lang', 'lang', { unique: false });
                store.createIndex('key', 'key', { unique: false });
            }
            
            // مخزن للإحصائيات
            if (!db.objectStoreNames.contains('translation_stats')) {
                db.createObjectStore('translation_stats', { keyPath: 'date' });
            }
            
            // مخزن للترجمات المخصصة
            if (!db.objectStoreNames.contains('custom_translations')) {
                db.createObjectStore('custom_translations', { keyPath: 'key' });
            }
        };
        
        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log('✅ قاعدة بيانات الترجمة جاهزة');
        };
        
        request.onerror = (event) => {
            console.error('❌ فشل فتح قاعدة بيانات الترجمة:', event.target.error);
        };
    }

    /**
     * ⭐ حقن أنماط CSS للترجمة
     */
    injectI18nStyles() {
        if (document.getElementById('i18n-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'i18n-styles';
        style.textContent = `
            .language-rtl {
                direction: rtl;
                text-align: right;
            }
            
            .language-ltr {
                direction: ltr;
                text-align: left;
            }
            
            .rtl-support {
                font-family: 'Tajawal', Arial, sans-serif;
            }
            
            .ltr-support {
                font-family: Arial, sans-serif;
            }
            
            .translation-pulse {
                animation: translationPulse 1.5s ease infinite;
            }
            
            .language-switch-btn {
                background: linear-gradient(135deg, #2196F3, #0D47A1);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 25px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: inherit;
                transition: all 0.3s ease;
            }
            
            .language-switch-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
            }
            
            .language-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 10px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                z-index: 1000;
                min-width: 200px;
                animation: fadeInUp 0.3s ease;
                border: 1px solid #E0E0E0;
            }
            
            .language-option {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid #F5F5F5;
                transition: background 0.2s ease;
            }
            
            .language-option:hover {
                background: #F5F5F5;
            }
            
            .language-option.active {
                background: #E3F2FD;
                color: #1565C0;
            }
            
            .language-flag {
                font-size: 1.5rem;
            }
            
            .language-name {
                flex: 1;
                font-weight: 500;
            }
            
            .language-active-badge {
                color: #4CAF50;
                font-weight: bold;
            }
            
            .translation-missing {
                background: #FFF3E0;
                color: #EF6C00;
                padding: 2px 6px;
                border-radius: 4px;
                border: 1px dashed #FF9800;
                font-size: 0.85rem;
            }
            
            @keyframes translationPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .language-tooltip {
                position: relative;
                cursor: help;
            }
            
            .language-tooltip:hover::after {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                white-space: nowrap;
                z-index: 1000;
                margin-bottom: 5px;
            }
            
            .translation-loading {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                vertical-align: middle;
                margin-left: 5px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * تهيئة النظام
     */
    async init() {
        console.log('🌐 نظام الترجمة الزراعي جاهز - الإصدار 4.0');
        
        // تحديد اللغة المبدئية
        this.currentLang = this.detectInitialLanguage();
        
        // تحميل الترجمات
        await this.loadTranslations();
        
        // تطبيق اللغة
        await this.applyLanguage();
        
        // تسجيل في نظام الإحصائيات
        this.logEvent('system_initialized');
        
        console.log(`✅ نظام الترجمة جاهز - اللغة: ${this.currentLang}`);
    }

    /**
     * اكتشاف اللغة المبدئية
     */
    detectInitialLanguage() {
        // 1. التحقق من اللغة المحفوظة
        const savedLang = localStorage.getItem('agriculture_app_lang');
        if (savedLang && this.languages[savedLang]) {
            console.log(`📝 استخدام اللغة المحفوظة: ${savedLang}`);
            return savedLang;
        }
        
        // 2. اكتشاف لغة المتصفح
        const browserLang = navigator.language.substring(0, 2);
        if (this.languages[browserLang]) {
            console.log(`🌐 اكتشاف لغة المتصفح: ${browserLang}`);
            return browserLang;
        }
        
        // 3. البحث عن لغات مشابهة
        const similarLang = this.findSimilarLanguage(browserLang);
        if (similarLang) {
            console.log(`🔍 استخدام لغة مشابهة: ${similarLang}`);
            return similarLang;
        }
        
        // 4. اللغة الافتراضية
        console.log('⚙️ استخدام اللغة الافتراضية: العربية');
        return 'ar';
    }
    
    /**
     * البحث عن لغة مشابهة
     */
    findSimilarLanguage(browserLang) {
        const languageMapping = {
            'es': 'en', // الإسبانية → الإنجليزية
            'de': 'en', // الألمانية → الإنجليزية
            'pt': 'en', // البرتغالية → الإنجليزية
            'it': 'fr', // الإيطالية → الفرنسية
            'ja': 'zh', // اليابانية → الصينية
            'ko': 'zh'  // الكورية → الصينية
        };
        
        return languageMapping[browserLang];
    }

    /**
     * تحميل جميع الترجمات
     */
    async loadTranslations() {
        this.loading = true;
        
        try {
            console.log('📦 جاري تحميل الترجمات...');
            
            // محاولة التحميل من قاعدة البيانات أولاً
            const cachedTranslations = await this.loadFromDatabase();
            
            if (cachedTranslations && Object.keys(cachedTranslations).length > 0) {
                this.translations = cachedTranslations;
                console.log('✅ تم تحميل الترجمات من قاعدة البيانات المحلية');
                this.loading = false;
                return;
            }
            
            // تحميل من ملفات JSON
            await this.loadFromJsonFiles();
            
            // حفظ في قاعدة البيانات
            await this.saveToDatabase();
            
            this.loading = false;
            
        } catch (error) {
            console.error('❌ خطأ في تحميل الترجمات:', error);
            
            // تحميل الترجمات الأساسية
            this.loadFallbackTranslations();
            this.loading = false;
        }
    }
    
    /**
     * تحميل من قاعدة البيانات
     */
    async loadFromDatabase() {
        if (!this.db) return null;
        
        return new Promise((resolve, reject) => {
            const translations = {};
            const transaction = this.db.transaction(['translations'], 'readonly');
            const store = transaction.objectStore('translations');
            const request = store.getAll();
            
            request.onsuccess = () => {
                request.result.forEach(item => {
                    if (!translations[item.lang]) {
                        translations[item.lang] = {};
                    }
                    translations[item.lang][item.key] = item.value;
                });
                resolve(translations);
            };
            
            request.onerror = () => reject(request.error);
        });
    }
    
    /**
     * حفظ في قاعدة البيانات
     */
    async saveToDatabase() {
        if (!this.db) return;
        
        const transaction = this.db.transaction(['translations'], 'readwrite');
        const store = transaction.objectStore('translations');
        
        const promises = [];
        
        for (const [lang, langTranslations] of Object.entries(this.translations)) {
            for (const [key, value] of Object.entries(langTranslations)) {
                promises.push(
                    new Promise((resolve, reject) => {
                        const request = store.put({ lang, key, value, timestamp: Date.now() });
                        request.onsuccess = resolve;
                        request.onerror = () => reject(request.error);
                    })
                );
            }
        }
        
        await Promise.all(promises);
        console.log('💾 تم حفظ الترجمات في قاعدة البيانات');
    }

    /**
     * تحميل من ملفات JSON
     */
    async loadFromJsonFiles() {
        const basePath = 'locales/';
        const loadPromises = [];
        
        for (const langCode of Object.keys(this.languages)) {
            const promise = this.loadLanguageFile(langCode, basePath);
            loadPromises.push(promise);
        }
        
        await Promise.all(loadPromises);
        console.log(`✅ تم تحميل ${Object.keys(this.translations).length} لغة`);
    }
    
    /**
     * تحميل ملف لغة معين
     */
    async loadLanguageFile(langCode, basePath) {
        try {
            const response = await fetch(`${basePath}${langCode}.json`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            this.translations[langCode] = data;
            this.availableLangs.add(langCode);
            
            console.log(`✅ تم تحميل ترجمة ${langCode}`);
            return true;
            
        } catch (error) {
            console.warn(`⚠️ فشل تحميل ${langCode}.json:`, error.message);
            
            // تحميل الترجمات الأساسية
            this.translations[langCode] = this.getMinimalTranslations(langCode);
            console.log(`📄 استخدام الترجمات الأساسية للغة ${langCode}`);
            
            return false;
        }
    }

    /**
     * ترجمات أساسية للغات غير المحملة
     */
    getMinimalTranslations(langCode) {
        const minimal = {
            'ar': {
                app: {
                    name: "المرشد الزراعي الذكي",
                    short_name: "المرشد الزراعي",
                    description: "تطبيق زراعي ذكي متكامل مع الذكاء الاصطناعي",
                    slogan: "الزراعة الذكية لمستقبل أفضل"
                },
                common: {
                    loading: "جاري التحميل...",
                    error: "حدث خطأ",
                    success: "نجاح",
                    warning: "تحذير",
                    save: "حفظ",
                    cancel: "إلغاء",
                    confirm: "تأكيد",
                    delete: "حذف",
                    edit: "تعديل",
                    search: "بحث",
                    filter: "تصفية",
                    sort: "ترتيب"
                },
                navigation: {
                    home: "الرئيسية",
                    crops: "المحاصيل",
                    diseases: "الأمراض",
                    ai: "الذكاء الاصطناعي",
                    search: "بحث عالمي",
                    calendar: "التقويم الزراعي",
                    library: "المكتبة",
                    points: "النقاط",
                    settings: "الإعدادات"
                },
                agriculture: {
                    planting: "زراعة",
                    harvesting: "حصاد",
                    irrigation: "ري",
                    fertilization: "تسميد",
                    soil_analysis: "تحليل التربة",
                    crop_rotation: "تناوب المحاصيل",
                    pest_control: "مكافحة الآفات",
                    yield: "إنتاجية"
                }
            },
            'en': {
                app: {
                    name: "Smart Agricultural Guide",
                    short_name: "Agri Guide",
                    description: "Smart agricultural application integrated with AI",
                    slogan: "Smart farming for a better future"
                },
                common: {
                    loading: "Loading...",
                    error: "Error occurred",
                    success: "Success",
                    warning: "Warning",
                    save: "Save",
                    cancel: "Cancel",
                    confirm: "Confirm",
                    delete: "Delete",
                    edit: "Edit",
                    search: "Search",
                    filter: "Filter",
                    sort: "Sort"
                },
                navigation: {
                    home: "Home",
                    crops: "Crops",
                    diseases: "Diseases",
                    ai: "AI Assistant",
                    search: "Global Search",
                    calendar: "Agricultural Calendar",
                    library: "Library",
                    points: "Points",
                    settings: "Settings"
                },
                agriculture: {
                    planting: "Planting",
                    harvesting: "Harvesting",
                    irrigation: "Irrigation",
                    fertilization: "Fertilization",
                    soil_analysis: "Soil Analysis",
                    crop_rotation: "Crop Rotation",
                    pest_control: "Pest Control",
                    yield: "Yield"
                }
            },
            'fr': {
                app: {
                    name: "Guide Agricole Intelligent",
                    short_name: "Guide Agri",
                    description: "Application agricole intelligente intégrée avec l'IA",
                    slogan: "Agriculture intelligente pour un avenir meilleur"
                },
                common: {
                    loading: "Chargement...",
                    error: "Erreur",
                    success: "Succès",
                    warning: "Avertissement",
                    save: "Enregistrer",
                    cancel: "Annuler",
                    confirm: "Confirmer",
                    delete: "Supprimer",
                    edit: "Modifier",
                    search: "Rechercher",
                    filter: "Filtrer",
                    sort: "Trier"
                },
                navigation: {
                    home: "Accueil",
                    crops: "Cultures",
                    diseases: "Maladies",
                    ai: "Assistant IA",
                    search: "Recherche Globale",
                    calendar: "Calendrier Agricole",
                    library: "Bibliothèque",
                    points: "Points",
                    settings: "Paramètres"
                },
                agriculture: {
                    planting: "Plantation",
                    harvesting: "Récolte",
                    irrigation: "Irrigation",
                    fertilization: "Fertilisation",
                    soil_analysis: "Analyse du Sol",
                    crop_rotation: "Rotation des Cultures",
                    pest_control: "Lutte contre les Ravageurs",
                    yield: "Rendement"
                }
            },
            'zh': {
                app: {
                    name: "智能农业指南",
                    short_name: "农业指南",
                    description: "集成人工智能的智能农业应用",
                    slogan: "智能农业，美好未来"
                },
                common: {
                    loading: "加载中...",
                    error: "发生错误",
                    success: "成功",
                    warning: "警告",
                    save: "保存",
                    cancel: "取消",
                    confirm: "确认",
                    delete: "删除",
                    edit: "编辑",
                    search: "搜索",
                    filter: "筛选",
                    sort: "排序"
                },
                navigation: {
                    home: "首页",
                    crops: "农作物",
                    diseases: "疾病",
                    ai: "人工智能助手",
                    search: "全球搜索",
                    calendar: "农业日历",
                    library: "图书馆",
                    points: "积分",
                    settings: "设置"
                },
                agriculture: {
                    planting: "种植",
                    harvesting: "收获",
                    irrigation: "灌溉",
                    fertilization: "施肥",
                    soil_analysis: "土壤分析",
                    crop_rotation: "作物轮作",
                    pest_control: "害虫控制",
                    yield: "产量"
                }
            },
            'hi': {
                app: {
                    name: "स्मार्ट कृषि गाइड",
                    short_name: "कृषि गाइड",
                    description: "कृत्रिम बुद्धिमत्ता के साथ एकीकृत स्मार्ट कृषि अनुप्रयोग",
                    slogan: "बेहतर भविष्य के लिए स्मार्ट खेती"
                },
                common: {
                    loading: "लोड हो रहा है...",
                    error: "त्रुटि हुई",
                    success: "सफलता",
                    warning: "चेतावनी",
                    save: "सहेजें",
                    cancel: "रद्द करें",
                    confirm: "पुष्टि करें",
                    delete: "हटाएं",
                    edit: "संपादित करें",
                    search: "खोज",
                    filter: "फ़िल्टर",
                    sort: "क्रमबद्ध करें"
                },
                navigation: {
                    home: "होम",
                    crops: "फसलें",
                    diseases: "रोग",
                    ai: "कृत्रिम बुद्धिमत्ता सहायक",
                    search: "वैश्विक खोज",
                    calendar: "कृषि कैलेंडर",
                    library: "पुस्तकालय",
                    points: "अंक",
                    settings: "सेटिंग्स"
                },
                agriculture: {
                    planting: "रोपण",
                    harvesting: "कटाई",
                    irrigation: "सिंचाई",
                    fertilization: "उर्वरीकरण",
                    soil_analysis: "मृदा विश्लेषण",
                    crop_rotation: "फसल चक्र",
                    pest_control: "कीट नियंत्रण",
                    yield: "उपज"
                }
            },
            'ru': {
                app: {
                    name: "Умный сельскохозяйственный гид",
                    short_name: "Сельхоз гид",
                    description: "Умное сельскохозяйственное приложение, интегрированное с ИИ",
                    slogan: "Умное земледелие для лучшего будущего"
                },
                common: {
                    loading: "Загрузка...",
                    error: "Произошла ошибка",
                    success: "Успех",
                    warning: "Предупреждение",
                    save: "Сохранить",
                    cancel: "Отмена",
                    confirm: "Подтвердить",
                    delete: "Удалить",
                    edit: "Редактировать",
                    search: "Поиск",
                    filter: "Фильтр",
                    sort: "Сортировать"
                },
                navigation: {
                    home: "Главная",
                    crops: "Культуры",
                    diseases: "Болезни",
                    ai: "ИИ помощник",
                    search: "Глобальный поиск",
                    calendar: "Сельскохозяйственный календарь",
                    library: "Библиотека",
                    points: "Очки",
                    settings: "Настройки"
                },
                agriculture: {
                    planting: "Посадка",
                    harvesting: "Сбор урожая",
                    irrigation: "Орошение",
                    fertilization: "Удобрение",
                    soil_analysis: "Анализ почвы",
                    crop_rotation: "Севооборот",
                    pest_control: "Борьба с вредителями",
                    yield: "Урожайность"
                }
            }
        };
        
        return minimal[langCode] || minimal['en'];
    }

    /**
     * ترجمات الطوارئ إذا فشل كل شيء
     */
    loadFallbackTranslations() {
        console.warn('⚠️ تحميل الترجمات الأساسية الطارئة');
        this.translations = {
            'ar': this.getMinimalTranslations('ar'),
            'en': this.getMinimalTranslations('en')
        };
        this.availableLangs.add('ar');
        this.availableLangs.add('en');
    }

    /**
     * تطبيق اللغة على الصفحة
     */
    async applyLanguage() {
        if (this.loading) {
            await this.waitForLoading();
        }
        
        console.log(`🔄 تطبيق اللغة: ${this.currentLang}`);
        
        // 1. تحديث سمات HTML
        this.updateHTMLAttributes();
        
        // 2. ترجمة العناصر
        this.translatePage();
        
        // 3. تحديث واجهة المستخدم
        this.updateLanguageUI();
        
        // 4. تحديث أنظمة التنسيق
        this.updateFormatters();
        
        // 5. حفظ التفضيل
        this.saveLanguagePreference();
        
        // 6. إرسال حدث التغيير
        this.dispatchLanguageChangeEvent();
        
        // 7. إضافة نقاط لتغيير اللغة
        this.awardLanguageChangePoints();
        
        console.log(`✅ تم تطبيق اللغة ${this.currentLang} بنجاح`);
    }
    
    /**
     * الانتظار حتى اكتمال التحميل
     */
    waitForLoading() {
        return new Promise((resolve) => {
            const checkLoading = () => {
                if (!this.loading) {
                    resolve();
                } else {
                    setTimeout(checkLoading, 100);
                }
            };
            checkLoading();
        });
    }

    /**
     * تحديث سمات HTML
     */
    updateHTMLAttributes() {
        const langInfo = this.languages[this.currentLang];
        
        document.documentElement.lang = this.currentLang;
        document.documentElement.dir = langInfo.dir;
        document.documentElement.setAttribute('data-lang', this.currentLang);
        
        // تحديث فونت العائلة
        document.body.style.fontFamily = langInfo.fontFamily;
        
        // إضافة/إزالة كلاسات الاتجاه
        document.body.classList.remove('language-rtl', 'language-ltr');
        document.body.classList.add(`language-${langInfo.dir}`);
        
        // تحديث كلاسات RTL/LTR
        if (langInfo.dir === 'rtl') {
            document.body.classList.add('rtl-support');
            document.body.classList.remove('ltr-support');
        } else {
            document.body.classList.add('ltr-support');
            document.body.classList.remove('rtl-support');
        }
        
        // تحديث الفونت لمحتوى محدد
        this.updateContentFontFamily(langInfo.fontFamily);
    }
    
    /**
     * تحديث فونت العائلة للمحتوى
     */
    updateContentFontFamily(fontFamily) {
        // تحديث عناصر محددة
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div.content, .text-content');
        elements.forEach(el => {
            if (!el.style.fontFamily || el.style.fontFamily.includes('Tajawal') || el.style.fontFamily.includes('Arial')) {
                el.style.fontFamily = fontFamily;
            }
        });
    }

    /**
     * ترجمة كافة عناصر الصفحة
     */
    translatePage() {
        console.log('📝 ترجمة عناصر الصفحة...');
        
        // ترجمة النصوص
        this.translateByAttribute('data-translate', 'textContent');
        
        // ترجمة placeholders
        this.translateByAttribute('data-translate-placeholder', 'placeholder');
        
        // ترجمة titles
        this.translateByAttribute('data-translate-title', 'title');
        
        // ترجمة aria-labels
        this.translateByAttribute('data-translate-aria', 'aria-label');
        
        // ترجمة alt texts
        this.translateByAttribute('data-translate-alt', 'alt');
        
        // ترجمة value
        this.translateByAttribute('data-translate-value', 'value');
        
        // ترجمة tooltips
        this.translateByAttribute('data-translate-tooltip', 'data-tooltip');
        
        // ترجمة زر الاتصال
        this.translateContactInfo();
        
        // ترجمة إشعارات التطبيق
        this.translateAppNotifications();
        
        console.log(`✅ تم ترجمة ${this.countTranslatedElements()} عنصر`);
    }
    
    /**
     * حساب العناصر المترجمة
     */
    countTranslatedElements() {
        return document.querySelectorAll('[data-translated]').length;
    }

    /**
     * ترجمة حسب السمة
     */
    translateByAttribute(attribute, property) {
        const elements = document.querySelectorAll(`[${attribute}]`);
        
        elements.forEach(element => {
            const key = element.getAttribute(attribute);
            const translation = this.get(key);
            
            if (translation && translation !== key) {
                if (property === 'data-tooltip') {
                    element.setAttribute(property, translation);
                } else {
                    element[property] = translation;
                }
                
                // إضافة سمة البيانات للمراقبة
                element.setAttribute('data-translated', 'true');
                element.setAttribute('data-translation-key', key);
                
                // إضافة تأثير بصرية مؤقت
                this.addTranslationEffect(element);
            } else if (translation === undefined) {
                // وضع علامة على الترجمة المفقودة
                this.markMissingTranslation(element, key);
            }
        });
    }
    
    /**
     * إضافة تأثير مرئي للترجمة
     */
    addTranslationEffect(element) {
        element.classList.add('translation-pulse');
        setTimeout(() => {
            element.classList.remove('translation-pulse');
        }, 1500);
    }
    
    /**
     * وضع علامة على الترجمة المفقودة
     */
    markMissingTranslation(element, key) {
        if (!element.hasAttribute('data-missing-translation')) {
            element.setAttribute('data-missing-translation', key);
            element.classList.add('translation-missing');
            
            // تسجيل الترجمة المفقودة
            this.logMissingTranslation(key);
        }
    }
    
    /**
     * تسجيل الترجمة المفقودة
     */
    logMissingTranslation(key) {
        const missing = JSON.parse(localStorage.getItem('missing_translations') || '[]');
        if (!missing.includes(key)) {
            missing.push(key);
            localStorage.setItem('missing_translations', JSON.stringify(missing));
        }
    }

    /**
     * ترجمة معلومات الاتصال
     */
    translateContactInfo() {
        const elements = {
            'contact.whatsapp': document.querySelector('[data-contact="whatsapp"]'),
            'contact.email': document.querySelector('[data-contact="email"]'),
            'contact.phone': document.querySelector('[data-contact="phone"]'),
            'contact.support': document.querySelector('[data-contact="support"]')
        };
        
        for (const [key, element] of Object.entries(elements)) {
            if (element) {
                const translation = this.get(key);
                if (translation && translation !== key) {
                    element.textContent = translation;
                }
            }
        }
    }
    
    /**
     * ترجمة إشعارات التطبيق
     */
    translateAppNotifications() {
        // ترجمة عناصر الإشعارات إذا كانت موجودة
        const notificationElements = document.querySelectorAll('.notification-message, .toast-message, .alert-message');
        
        notificationElements.forEach(element => {
            const text = element.textContent.trim();
            const translation = this.findTranslationForText(text);
            
            if (translation && translation !== text) {
                element.textContent = translation;
            }
        });
    }
    
    /**
     * البحث عن ترجمة للنص
     */
    findTranslationForText(text) {
        // بحث بسيط في الترجمات
        for (const langTranslations of Object.values(this.translations)) {
            for (const value of Object.values(langTranslations)) {
                if (typeof value === 'string' && value.includes(text)) {
                    return value;
                }
            }
        }
        return null;
    }

    /**
     * الحصول على ترجمة
     */
    get(key, defaultValue = '', params = {}) {
        const cacheKey = `${this.currentLang}_${key}_${JSON.stringify(params)}`;
        
        // التحقق من الذاكرة المؤقتة
        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }
        
        if (!key) {
            const result = defaultValue || '';
            this.translationCache.set(cacheKey, result);
            return result;
        }
        
        try {
            const keys = key.split('.');
            let value = this.translations[this.currentLang];
            
            // التنقل في هيكل الترجمات
            for (const k of keys) {
                if (value && typeof value === 'object' && value[k] !== undefined) {
                    value = value[k];
                } else {
                    // البحث في الإنجليزية كترجمة بديلة
                    const fallback = this.getFallbackTranslation(key, defaultValue);
                    this.translationCache.set(cacheKey, fallback);
                    return fallback;
                }
            }
            
            let result = typeof value === 'string' ? value : defaultValue || key;
            
            // تطبيق المعلمات
            if (params && typeof params === 'object') {
                for (const [paramKey, paramValue] of Object.entries(params)) {
                    result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), paramValue);
                }
            }
            
            this.translationCache.set(cacheKey, result);
            return result;
            
        } catch (error) {
            console.warn(`⚠️ خطأ في ترجمة المفتاح "${key}":`, error);
            const result = defaultValue || key;
            this.translationCache.set(cacheKey, result);
            return result;
        }
    }

    /**
     * البحث عن ترجمة بديلة
     */
    getFallbackTranslation(key, defaultValue) {
        // إذا لم تكن الإنجليزية هي اللغة الحالية، ابحث فيها
        if (this.currentLang !== 'en' && this.translations['en']) {
            const keys = key.split('.');
            let value = this.translations['en'];
            
            for (const k of keys) {
                if (value && typeof value === 'object' && value[k] !== undefined) {
                    value = value[k];
                } else {
                    return defaultValue || key;
                }
            }
            
            return typeof value === 'string' ? value : defaultValue || key;
        }
        
        return defaultValue || key;
    }

    /**
     * تحديث واجهة اختيار اللغة
     */
    updateLanguageUI() {
        // تحديث أزرار التبديل
        this.updateToggleButtons();
        
        // تحديث قائمة اللغات في القائمة الجانبية
        this.updateSidebarLanguageList();
        
        // تحديث قائمة البحث العالمية
        this.updateSearchLanguageSelector();
        
        // تحديث زر المطور الخفي
        this.updateDeveloperShortcut();
        
        // تحديث أزرار التنقل السفلية
        this.updateBottomNavigation();
    }

    /**
     * تحديث أزرار التبديل
     */
    updateToggleButtons() {
        const toggleButtons = document.querySelectorAll('.language-toggle-btn');
        const langInfo = this.languages[this.currentLang];
        
        toggleButtons.forEach(button => {
            // تحديث النص
            button.innerHTML = `
                <i class="fas fa-globe"></i>
                <span class="lang-text">${langInfo.name}</span>
                <span class="language-flag">${langInfo.flag}</span>
            `;
            
            // تحديث العنوان
            button.setAttribute('title', this.get('language.change_tooltip', 'تغيير اللغة'));
            
            // تحديث السمة
            button.setAttribute('data-current-lang', this.currentLang);
            
            // إضافة فئة حسب الاتجاه
            button.classList.toggle('rtl-button', langInfo.dir === 'rtl');
            button.classList.toggle('ltr-button', langInfo.dir === 'ltr');
        });
    }

    /**
     * تحديث قائمة اللغات في القائمة الجانبية
     */
    updateSidebarLanguageList() {
        const languageItems = document.querySelectorAll('.sidebar-language-item');
        
        languageItems.forEach(item => {
            const langCode = item.getAttribute('data-lang');
            const badge = item.querySelector('.lang-active-badge');
            const flag = item.querySelector('.lang-flag');
            const name = item.querySelector('.lang-name');
            
            if (langCode && this.languages[langCode]) {
                const langInfo = this.languages[langCode];
                
                // تحديث العلم
                if (flag) {
                    flag.textContent = langInfo.flag;
                    flag.setAttribute('title', langInfo.native);
                }
                
                // تحديث الاسم
                if (name) {
                    name.textContent = langInfo.native;
                }
                
                // تحديث البادج النشط
                if (badge) {
                    if (langCode === this.currentLang) {
                        badge.textContent = '✓';
                        badge.style.display = 'inline-block';
                        badge.style.color = '#4CAF50';
                    } else {
                        badge.style.display = 'none';
                    }
                }
                
                // تحديث الكلاس النشط
                if (langCode === this.currentLang) {
                    item.classList.add('active');
                    item.style.background = 'rgba(33, 150, 243, 0.1)';
                } else {
                    item.classList.remove('active');
                    item.style.background = '';
                }
                
                // تحديث حدث النقر
                item.onclick = (e) => {
                    e.preventDefault();
                    this.changeLanguage(langCode);
                };
            }
        });
    }

    /**
     * تحديث قائمة البحث العالمية
     */
    updateSearchLanguageSelector() {
        const select = document.getElementById('searchLanguage');
        if (!select) return;
        
        // حفظ القيمة المحددة
        const selectedValue = select.value;
        
        // تحديث الخيارات
        select.innerHTML = '';
        
        Object.entries(this.languages).forEach(([code, info]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = `${info.flag} ${info.native}`;
            option.selected = code === selectedValue || code === this.currentLang;
            select.appendChild(option);
        });
        
        // تحديث placeholder
        const placeholder = this.get('search.language_placeholder', 'اختر لغة البحث');
        select.setAttribute('placeholder', placeholder);
        select.setAttribute('title', placeholder);
    }
    
    /**
     * تحديث زر المطور الخفي
     */
    updateDeveloperShortcut() {
        const shortcut = document.getElementById('developerShortcut');
        if (shortcut) {
            shortcut.setAttribute('title', this.get('developer.shortcut', 'لوحة المطور'));
        }
    }
    
    /**
     * تحديث أزرار التنقل السفلية
     */
    updateBottomNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const page = item.getAttribute('data-nav');
            if (page) {
                const translation = this.get(`navigation.${page}`);
                const label = item.querySelector('.nav-label');
                if (label && translation) {
                    label.textContent = translation;
                }
            }
        });
    }

    /**
     * تحديث أنظمة التنسيق
     */
    updateFormatters() {
        if (window.formatters && window.formatters.updateSettings) {
            window.formatters.updateSettings({
                locale: this.languages[this.currentLang].locale
            });
        }
    }

    /**
     * حفظ تفضيل اللغة
     */
    saveLanguagePreference() {
        localStorage.setItem('agriculture_app_lang', this.currentLang);
        localStorage.setItem('agriculture_app_dir', this.languages[this.currentLang].dir);
        localStorage.setItem('agriculture_app_font', this.languages[this.currentLang].fontFamily);
        
        // تحديث تاريخ التغيير
        localStorage.setItem('agriculture_lang_changed', new Date().toISOString());
        
        // حفظ عدد مرات التغيير
        const changeCount = parseInt(localStorage.getItem('language_change_count') || '0') + 1;
        localStorage.setItem('language_change_count', changeCount.toString());
        
        // حفظ في قاعدة البيانات
        this.saveLanguagePreferenceToDB();
    }
    
    /**
     * حفظ تفضيل اللغة في قاعدة البيانات
     */
    saveLanguagePreferenceToDB() {
        if (!this.db) return;
        
        const transaction = this.db.transaction(['translation_stats'], 'readwrite');
        const store = transaction.objectStore('translation_stats');
        
        const today = new Date().toISOString().split('T')[0];
        const record = {
            date: today,
            language: this.currentLang,
            timestamp: Date.now()
        };
        
        store.put(record);
    }

    /**
     * إرسال حدث تغيير اللغة
     */
    dispatchLanguageChangeEvent() {
        const event = new CustomEvent('agriculture:languageChanged', {
            detail: {
                language: this.currentLang,
                direction: this.languages[this.currentLang].dir,
                locale: this.languages[this.currentLang].locale,
                fontFamily: this.languages[this.currentLang].fontFamily,
                timestamp: new Date().toISOString()
            }
        });
        
        window.dispatchEvent(event);
        
        // إرسال حدث للمطور
        if (window.developerDashboard) {
            window.developerDashboard.logEvent('language_changed', {
                from: this.previousLang,
                to: this.currentLang
            });
        }
    }
    
    /**
     * إضافة نقاط لتغيير اللغة
     */
    awardLanguageChangePoints() {
        if (this.pointsSystem && this.previousLang && this.previousLang !== this.currentLang) {
            this.pointsSystem.addPoints('language_change', 3);
        }
    }

    /**
     * تغيير اللغة
     */
    async changeLanguage(langCode, options = {}) {
        if (!this.languages[langCode] || this.currentLang === langCode) {
            if (options.silent !== true) {
                console.log(`⚠️ اللغة ${langCode} غير متاحة أو هي اللغة الحالية`);
            }
            return false;
        }
        
        console.log(`🔄 تغيير اللغة من ${this.currentLang} إلى ${langCode}`);
        
        // حفظ اللغة السابقة
        this.previousLang = this.currentLang;
        
        // تغيير اللغة
        this.currentLang = langCode;
        
        // مسح الذاكرة المؤقتة
        this.translationCache.clear();
        
        // إعادة تطبيق اللغة
        await this.applyLanguage();
        
        // إظهار إشعار النجاح
        if (options.silent !== true) {
            this.showLanguageChangeNotification();
        }
        
        // إعادة تحميل الإعلانات
        this.reloadAdvertisements();
        
        // تسجيل الحدث
        this.logEvent('language_changed', {
            from: this.previousLang,
            to: langCode
        });
        
        return true;
    }

    /**
     * إظهار إشعار تغيير اللغة
     */
    showLanguageChangeNotification() {
        const messages = {
            'ar': { 
                title: '✅ تم تغيير اللغة', 
                message: 'تم تغيير اللغة إلى العربية بنجاح',
                icon: '🌐'
            },
            'en': { 
                title: '✅ Language Changed', 
                message: 'Language changed to English successfully',
                icon: '🌐'
            },
            'fr': { 
                title: '✅ Langue Changée', 
                message: 'Langue changée en français avec succès',
                icon: '🌐'
            },
            'zh': { 
                title: '✅ 语言已更改', 
                message: '语言已成功更改为中文',
                icon: '🌐'
            },
            'hi': { 
                title: '✅ भाषा बदली गई', 
                message: 'भाषा हिंदी में सफलतापूर्वक बदली गई',
                icon: '🌐'
            },
            'ru': { 
                title: '✅ Язык Изменен', 
                message: 'Язык успешно изменен на русский',
                icon: '🌐'
            }
        };
        
        const message = messages[this.currentLang] || messages['en'];
        
        // استخدام نظام الإشعارات الموجود
        if (typeof window.showToast === 'function') {
            window.showToast(message.message, 'success');
        } else if (window.helpers && window.helpers.notify) {
            window.helpers.notify(message.message, 'success', 3000);
        } else {
            // إشعار بدائي
            console.log(message.message);
        }
    }

    /**
     * إعادة تحميل الإعلانات
     */
    reloadAdvertisements() {
        if (typeof window.adManager !== 'undefined') {
            setTimeout(() => {
                try {
                    window.adManager.refreshAllAds();
                    console.log('🔄 تم تحديث الإعلانات بعد تغيير اللغة');
                } catch (error) {
                    console.error('❌ خطأ في تحديث الإعلانات:', error);
                }
            }, 1000);
        }
    }

    /**
     * التبديل بين اللغات
     */
    toggleLanguage() {
        // التبديل بين العربية والإنجليزية بشكل افتراضي
        const nextLang = this.currentLang === 'ar' ? 'en' : 'ar';
        this.changeLanguage(nextLang);
    }

    /**
     * الحصول على قائمة اللغات المتاحة
     */
    getAvailableLanguages() {
        return Object.entries(this.languages).map(([code, info]) => ({
            code,
            name: info.name,
            native: info.native,
            flag: info.flag,
            direction: info.dir,
            locale: info.locale,
            fontFamily: info.fontFamily,
            isCurrent: code === this.currentLang,
            isLoaded: this.availableLangs.has(code)
        }));
    }

    /**
     * تنسيق الأرقام حسب اللغة
     */
    formatNumber(number, options = {}) {
        if (this.currentLang === 'ar') {
            // تحويل الأرقام العربية
            const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            return number.toString().replace(/\d/g, digit => arabicNumbers[digit]);
        }
        
        const locale = this.languages[this.currentLang]?.locale || 'en-US';
        return number.toLocaleString(locale, options);
    }

    /**
     * تنسيق التاريخ
     */
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };
        
        const formatOptions = { ...defaultOptions, ...options };
        
        const locale = this.languages[this.currentLang]?.locale || 'en-US';
        
        try {
            return date.toLocaleDateString(locale, formatOptions);
        } catch (error) {
            console.warn('⚠️ خطأ في تنسيق التاريخ:', error);
            return date.toLocaleDateString('en-US', formatOptions);
        }
    }

    /**
     * تنسيق الوقت
     */
    formatTime(date, includeSeconds = false) {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: this.currentLang !== 'ar' // استخدام 24 ساعة للعربية
        };
        
        if (includeSeconds) {
            options.second = '2-digit';
        }
        
        const locale = this.currentLang === 'ar' ? 'ar-SA' : 'en-US';
        
        return date.toLocaleTimeString(locale, options);
    }

    /**
     * التحقق إذا كانت اللغة RTL
     */
    isRTL() {
        return this.languages[this.currentLang].dir === 'rtl';
    }

    /**
     * الحصول على اتجاه النص
     */
    getTextDirection() {
        return this.isRTL() ? 'right' : 'left';
    }

    /**
     * الحصول على معلومات اللغة الحالية
     */
    getCurrentLanguageInfo() {
        return {
            ...this.languages[this.currentLang],
            code: this.currentLang,
            isRTL: this.isRTL()
        };
    }
    
    /**
     * تسجيل حدث
     */
    logEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            data,
            timestamp: new Date().toISOString(),
            language: this.currentLang,
            module: 'i18n'
        };
        
        if (window.helpers && window.helpers.logEvent) {
            window.helpers.logEvent(eventName, data);
        }
        
        console.log(`📝 حدث نظام الترجمة: ${eventName}`, data);
    }
    
    /**
     * ⭐ الحصول على إحصائيات الترجمة
     */
    getTranslationStats() {
        const stats = {
            currentLanguage: this.currentLang,
            availableLanguages: Array.from(this.availableLangs),
            translationCount: 0,
            missingTranslations: JSON.parse(localStorage.getItem('missing_translations') || '[]').length,
            languageChangeCount: parseInt(localStorage.getItem('language_change_count') || '0'),
            lastChange: localStorage.getItem('agriculture_lang_changed'),
            cacheSize: this.translationCache.size
        };
        
        // حساب عدد الترجمات
        for (const langTranslations of Object.values(this.translations)) {
            stats.translationCount += Object.keys(langTranslations).length;
        }
        
        return stats;
    }
    
    /**
     * ⭐ تحديث ترجمة مخصصة
     */
    updateCustomTranslation(key, value, lang = this.currentLang) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        
        this.translations[lang][key] = value;
        
        // مسح ذاكرة التخزين المؤقت
        this.translationCache.clear();
        
        // حفظ في قاعدة البيانات
        this.saveCustomTranslationToDB(key, value, lang);
        
        // إعادة تطبيق الترجمات
        this.translatePage();
        
        console.log(`✅ تم تحديث الترجمة المخصصة: ${key} = ${value}`);
        
        return true;
    }
    
    /**
     * ⭐ حفظ ترجمة مخصصة في قاعدة البيانات
     */
    saveCustomTranslationToDB(key, value, lang) {
        if (!this.db) return;
        
        const transaction = this.db.transaction(['custom_translations'], 'readwrite');
        const store = transaction.objectStore('custom_translations');
        
        const record = {
            key: `${lang}_${key}`,
            value,
            lang,
            timestamp: Date.now()
        };
        
        store.put(record);
    }
    
    /**
     * ⭐ تحميل الترجمات المخصصة
     */
    async loadCustomTranslations() {
        if (!this.db) return;
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['custom_translations'], 'readonly');
            const store = transaction.objectStore('custom_translations');
            const request = store.getAll();
            
            request.onsuccess = () => {
                request.result.forEach(item => {
                    const lang = item.lang || this.currentLang;
                    const key = item.key.includes('_') ? item.key.split('_')[1] : item.key;
                    
                    if (!this.translations[lang]) {
                        this.translations[lang] = {};
                    }
                    
                    this.translations[lang][key] = item.value;
                });
                
                console.log(`✅ تم تحميل ${request.result.length} ترجمة مخصصة`);
                resolve(request.result.length);
            };
            
            request.onerror = () => reject(request.error);
        });
    }
    
    /**
     * ⭐ تصدير الترجمات
     */
    exportTranslations(lang = this.currentLang) {
        const data = {
            language: lang,
            translations: this.translations[lang] || {},
            metadata: {
                exportDate: new Date().toISOString(),
                version: '4.0',
                app: 'Smart Agriculture Guide'
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `agriculture-translations-${lang}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return data;
    }
    
    /**
     * ⭐ استيراد الترجمات
     */
    async importTranslations(file, options = {}) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // التحقق من صحة البيانات
                    if (!data.language || !data.translations) {
                        throw new Error('بيانات غير صالحة');
                    }
                    
                    const lang = data.language;
                    
                    // دمج الترجمات
                    if (!this.translations[lang]) {
                        this.translations[lang] = {};
                    }
                    
                    Object.assign(this.translations[lang], data.translations);
                    
                    // حفظ في قاعدة البيانات
                    for (const [key, value] of Object.entries(data.translations)) {
                        this.saveCustomTranslationToDB(key, value, lang);
                    }
                    
                    // مسح الذاكرة المؤقتة
                    this.translationCache.clear();
                    
                    // إذا كانت اللغة الحالية، إعادة التطبيق
                    if (lang === this.currentLang) {
                        this.translatePage();
                    }
                    
                    console.log(`✅ تم استيراد ${Object.keys(data.translations).length} ترجمة للغة ${lang}`);
                    
                    // إشعار النجاح
                    if (options.showNotification !== false && window.helpers) {
                        window.helpers.notify(
                            `تم استيراد ${Object.keys(data.translations).length} ترجمة`,
                            'success',
                            3000
                        );
                    }
                    
                    resolve({
                        language: lang,
                        importedCount: Object.keys(data.translations).length,
                        totalTranslations: Object.keys(this.translations[lang]).length
                    });
                    
                } catch (error) {
                    console.error('❌ فشل استيراد الترجمات:', error);
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('فشل قراءة الملف'));
            reader.readAsText(file);
        });
    }
    
    /**
     * ⭐ البحث في الترجمات
     */
    searchTranslations(query, lang = this.currentLang) {
        if (!query || !this.translations[lang]) {
            return [];
        }
        
        const results = [];
        const searchTerm = query.toLowerCase();
        
        for (const [key, value] of Object.entries(this.translations[lang])) {
            if (key.toLowerCase().includes(searchTerm) || 
                (typeof value === 'string' && value.toLowerCase().includes(searchTerm))) {
                results.push({
                    key,
                    value,
                    matches: this.highlightMatch(`${key}: ${value}`, query)
                });
            }
        }
        
        return results.slice(0, 50); // إرجاع أول 50 نتيجة فقط
    }
    
    /**
     * ⭐ تمييز النص المطابق
     */
    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
    
    /**
     * ⭐ تهريب أحرف regex
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// ==================== التهيئة والتصدير ====================

// إنشاء نسخة عالمية
let agricultureI18n = null;

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    try {
        agricultureI18n = new SmartAgricultureI18n();
        await agricultureI18n.init();
        
        // جعل النظام متاحاً بشكل عام
        window.agricultureI18n = agricultureI18n;
        window.i18n = agricultureI18n; // اسم مختصر
        
        console.log('✅ نظام الترجمة محمل وجاهز للاستخدام');
        
        // إضافة أزرار اللغة ديناميكياً إذا لزم الأمر
        setTimeout(() => {
            initializeLanguageUI();
        }, 1000);
        
        // ⭐ إضافة إلى لوحة المطور إذا كانت موجودة
        if (window.developerDashboard) {
            window.developerDashboard.registerModule('i18n', {
                name: 'نظام الترجمة',
                version: '4.0',
                instance: agricultureI18n,
                methods: ['getTranslationStats', 'exportTranslations', 'searchTranslations']
            });
        }
        
    } catch (error) {
        console.error('❌ فشل في تحميل نظام الترجمة:', error);
        
        // إنشاء نظام ترجمة أساسي
        window.agricultureI18n = window.i18n = {
            get: (key) => key,
            changeLanguage: () => console.warn('نظام الترجمة غير متاح'),
            t: (key) => key
        };
    }
});

// تهيئة واجهة المستخدم للغات
function initializeLanguageUI() {
    // إضافة زر اللغة إذا لم يكن موجوداً
    if (!document.querySelector('.language-toggle-btn')) {
        addLanguageToggleButton();
    }
    
    // إضافة قائمة اللغات في القائمة الجانبية
    if (!document.querySelector('.sidebar-language-list')) {
        addSidebarLanguageList();
    }
}

// ==================== دوال مساعدة عالمية ====================

/**
 * دالة ترجمة سريعة
 */
function t(key, defaultValue = '', params = {}) {
    if (window.agricultureI18n && window.agricultureI18n.get) {
        return window.agricultureI18n.get(key, defaultValue, params);
    }
    return defaultValue || key;
}

/**
 * تغيير اللغة
 */
function changeLanguage(langCode, options = {}) {
    if (window.agricultureI18n && window.agricultureI18n.changeLanguage) {
        return window.agricultureI18n.changeLanguage(langCode, options);
    }
    return false;
}

/**
 * التبديل بين اللغات
 */
function toggleLanguage() {
    if (window.agricultureI18n && window.agricultureI18n.toggleLanguage) {
        window.agricultureI18n.toggleLanguage();
    }
}

/**
 * تنسيق رقم
 */
function formatNumber(num, options) {
    if (window.agricultureI18n && window.agricultureI18n.formatNumber) {
        return window.agricultureI18n.formatNumber(num, options);
    }
    return num.toLocaleString();
}

/**
 * تنسيق تاريخ
 */
function formatDate(date, options) {
    if (window.agricultureI18n && window.agricultureI18n.formatDate) {
        return window.agricultureI18n.formatDate(date, options);
    }
    return date.toLocaleDateString();
}

/**
 * تنسيق وقت
 */
function formatTime(date, includeSeconds) {
    if (window.agricultureI18n && window.agricultureI18n.formatTime) {
        return window.agricultureI18n.formatTime(date, includeSeconds);
    }
    return date.toLocaleTimeString();
}

/**
 * التحقق من اتجاه النص
 */
function isRTL() {
    if (window.agricultureI18n && window.agricultureI18n.isRTL) {
        return window.agricultureI18n.isRTL();
    }
    return false;
}

// ==================== تصدير الوحدة ====================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SmartAgricultureI18n,
        t,
        changeLanguage,
        toggleLanguage,
        formatNumber,
        formatDate,
        formatTime,
        isRTL
    };
}

// ==================== رسالة المطور ====================

console.log(`
🌐 **نظام الترجمة متعدد اللغات - الإصدار 4.0**
🌱 **مخصص للتطبيق الزراعي الذكي**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ المميزات الجديدة:
• دعم 6 لغات كاملة (عربي، إنجليزي، فرنسي، صيني، هندي، روسي)
• تكامل كامل مع جميع أنظمة المشروع
• قاعدة بيانات محلية لتخزين الترجمات
• نظام ذاكرة تخزين مؤقت للأداء
• دعم الترجمات المخصصة
• بحث في الترجمات
• تصدير واستيراد الترجمات
• إحصائيات وتحليلات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 أمثلة الاستخدام:
1. t('app.name') - الحصول على ترجمة
2. changeLanguage('en') - تغيير اللغة
3. toggleLanguage() - التبديل بين لغتين
4. formatNumber(1234567) - تنسيق رقم
5. formatDate(new Date()) - تنسيق تاريخ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 اللغات المدعومة:
• العربية 🇸🇦 (rtl)
• English 🇺🇸 (ltr)
• Français 🇫🇷 (ltr)
• 中文 🇨🇳 (ltr)
• हिन्दी 🇮🇳 (ltr)
• Русский 🇷🇺 (ltr)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 الأنظمة المتكاملة:
• نظام النقاط والمكافآت
• نظام المساعدات والدوال المساعدة
• نظام التنسيق والتنسيقات
• الجسر الرئيسي للتطبيق
• لوحة تحكم المطور
• قاعدة البيانات المحلية
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 الإحصائيات المتاحة:
• عدد الترجمات المحملة
• الترجمات المفقودة
• عدد مرات تغيير اللغة
• حجم الذاكرة المؤقتة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ الموقع في المشروع: js/i18n.js
📁 ملفات الترجمة: locales/*.json
🔗 متكامل مع: main.js, helpers.js, formatters.js, points.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تم التطوير بواسطة: المرشد الزراعي الذكي
© 2026 جميع الحقوق محفوظة
`);

// ==================== دوال دعم UI ====================

/**
 * إضافة زر تبديل اللغة
 */
function addLanguageToggleButton() {
    if (!document.querySelector('.language-toggle-btn')) {
        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            const button = document.createElement('button');
            button.className = 'icon-btn header-action language-toggle-btn';
            button.setAttribute('title', 'تغيير اللغة');
            button.innerHTML = `
                <i class="fas fa-globe"></i>
                <span class="lang-text">العربية</span>
            `;
            button.onclick = () => {
                if (window.agricultureI18n) {
                    window.agricultureI18n.toggleLanguage();
                }
            };
            
            headerRight.insertBefore(button, headerRight.firstChild);
        }
    }
}

/**
 * إضافة قائمة اللغات في القائمة الجانبية
 */
function addSidebarLanguageList() {
    const sidebar = document.querySelector('.sidebar-content');
    if (sidebar) {
        const languageSection = document.createElement('div');
        languageSection.className = 'sidebar-section';
        languageSection.innerHTML = `
            <h5 class="section-title">🌍 اللغات</h5>
            <div class="sidebar-language-list">
                <!-- ستتم إضافة اللغات ديناميكياً -->
            </div>
        `;
        
        sidebar.appendChild(languageSection);
    }
}