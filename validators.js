// ====== نظام التحقق والتحقق من الصحة ======
// ✅ الإصدار 4.1 | يناير 2026 | متكامل مع AdMob والهيكل الكامل

/**
 * نظام التحقق والتحقق من الصحة - مدمج بالكامل مع هيكل المشروع
 * يتكامل مع: agricultureData, app, agricultureI18n, AdMob
 */

// ====== تعريف الكلاس الرئيسي ======
class Validators {
    constructor() {
        this.patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^[0-9]{10,15}$/,
            arabicText: /^[\u0600-\u06FF\s]+$/,
            englishText: /^[A-Za-z\s]+$/,
            numbers: /^[0-9]+$/,
            decimal: /^[0-9]+(\.[0-9]+)?$/,
            username: /^[a-zA-Z0-9_]{3,20}$/,
            password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
            url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
            date: /^\d{4}-\d{2}-\d{2}$/,
            time: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
            coordinates: /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/,
            hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
            ipAddress: /^(\d{1,3}\.){3}\d{1,3}$/,
            // ⭐ أنماط زراعية جديدة
            cropCode: /^[A-Z]{3}-[0-9]{6}$/,
            soilType: /^[A-Za-z\u0600-\u06FF\s\-]+$/,
            seasonCode: /^(شتوي|صيفي|ربيعي|خريفي|دائم)$/,
            fertilizerCode: /^FERT-[A-Z0-9]{8}$/,
            diseaseCode: /^DISEASE-[A-Z]{2}[0-9]{4}$/,
            // ⭐ أنماط AdMob
            adUnitId: /^ca-app-pub-\d+\/\d+$/,
            appId: /^ca-app-pub-\d+~[a-zA-Z0-9]+$/
        };
        
        this.messages = {
            required: 'هذا الحقل مطلوب',
            email: 'البريد الإلكتروني غير صالح',
            phone: 'رقم الهاتف غير صالح',
            minLength: 'يجب أن يكون طول النص على الأقل {min} حرف',
            maxLength: 'يجب أن يكون طول النص على الأكثر {max} حرف',
            minValue: 'القيمة يجب أن تكون على الأقل {min}',
            maxValue: 'القيمة يجب أن تكون على الأكثر {max}',
            pattern: 'التنسيق غير صحيح',
            match: 'القيم غير متطابقة',
            unique: 'القيمة مستخدمة مسبقاً',
            date: 'التاريخ غير صالح',
            time: 'الوقت غير صالح',
            url: 'الرابط غير صالح',
            password: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل مع حرف ورقم',
            // ⭐ رسائل زراعية جديدة
            cropCode: 'كود المحصول يجب أن يكون بالصيغة: ABC-123456',
            soilType: 'نوع التربة يجب أن يحتوي على أحرف فقط',
            season: 'الموسم غير صالح',
            fertilizerAmount: 'كمية السماد خارج النطاق المسموح',
            irrigationAmount: 'كمية الري غير مناسبة',
            phLevel: 'درجة الحموضة يجب أن تكون بين 0 و 14',
            // ⭐ رسائل AdMob
            adUnitId: 'معرّف وحدة الإعلان غير صالح',
            appId: 'معرّف التطبيق غير صالح'
        };
        
        this.errors = new Map();
        this.validationStats = {
            total: 0,
            successful: 0,
            failed: 0,
            lastValidation: null
        };
        
        this.isInitialized = false;
        this.adMobReady = false;
        this.adConfig = {};
        
        // الانتظار حتى تكون جميع الأنظمة جاهزة
        this.waitForDependencies().then(() => {
            this.initialize();
        });
    }
    
    /**
     * الانتظار حتى تكون الاعتماديات جاهزة
     */
    async waitForDependencies() {
        const maxWaitTime = 10000;
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
            // التحقق من أنظمة الزراعة الأساسية
            const agricultureDataReady = typeof window.agricultureData !== 'undefined' || 
                                         typeof window.agriculture_data !== 'undefined';
            
            const appReady = typeof window.app !== 'undefined' || 
                             typeof window.agricultureApp !== 'undefined';
            
            const i18nReady = typeof window.agricultureI18n !== 'undefined' || 
                              typeof window.i18n !== 'undefined';
            
            // التحقق من AdMob
            const adMobReady = typeof window.adsbygoogle !== 'undefined' || 
                               typeof window.admob !== 'undefined' ||
                               (typeof window.google !== 'undefined' && window.google.ads);
            
            if (agricultureDataReady && appReady && i18nReady && adMobReady) {
                console.log('✅ جميع الاعتماديات جاهزة (بما فيها AdMob)');
                this.adMobReady = true;
                return true;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.warn('⚠️ بعض الاعتماديات غير جاهزة، النظام يعمل بوضعية محدودة');
        return false;
    }
    
    /**
     * تهيئة النظام
     */
    async initialize() {
        try {
            // إنشاء أنظمة احتياطية إذا لم تكن الأنظمة الرئيسية موجودة
            this.createFallbackSystems();
            
            // تحميل إعدادات AdMob
            await this.loadAdMobConfig();
            
            // تحميل التفضيلات
            this.loadPreferences();
            
            // تسجيل النظام في النافذة العامة
            this.registerGlobal();
            
            // إضافة CSS المطلوب
            this.addRequiredStyles();
            
            // تحميل الرسائل المخصصة
            await this.loadCustomMessages();
            
            // إعداد المدققين المخصصين
            this.setupCustomValidators();
            
            this.isInitialized = true;
            console.log('✅ نظام التحقق والتحقق من الصحة جاهز ومتكامل مع AdMob');
            
            // إرسال حدث التهيئة
            this.dispatchSystemEvent('validators_initialized');
            
            // ⭐ تسجيل إعلان التحقق الناجح
            this.trackAdEvent('validators_initialized', { version: '4.1' });
            
        } catch (error) {
            console.error('❌ فشل في تهيئة نظام التحقق:', error);
            this.isInitialized = false;
        }
    }
    
    /**
     * تحميل إعدادات AdMob
     */
    async loadAdMobConfig() {
        try {
            // تحميل من localStorage
            const savedConfig = localStorage.getItem('adMob_config');
            if (savedConfig) {
                this.adConfig = JSON.parse(savedConfig);
                console.log('📱 تم تحميل إعدادات AdMob من localStorage');
            }
            
            // أو من ملف خارجي
            try {
                const response = await fetch('js/config/admob-config.json');
                if (response.ok) {
                    const fileConfig = await response.json();
                    this.adConfig = { ...this.adConfig, ...fileConfig };
                    console.log('📱 تم تحميل إعدادات AdMob من الملف');
                }
            } catch (error) {
                // تجاهل الخطأ إذا الملف غير موجود
            }
            
            // إعدادات افتراضية
            if (!this.adConfig.appId) {
                this.adConfig.appId = 'ca-app-pub-9866663686163267~1234567890';
            }
            
            if (!this.adConfig.bannerAdUnitId) {
                this.adConfig.bannerAdUnitId = 'ca-app-pub-9866663686163267/1234567890';
            }
            
            if (!this.adConfig.interstitialAdUnitId) {
                this.adConfig.interstitialAdUnitId = 'ca-app-pub-9866663686163267/0987654321';
            }
            
            if (!this.adConfig.rewardedAdUnitId) {
                this.adConfig.rewardedAdUnitId = 'ca-app-pub-9866663686163267/1122334455';
            }
            
            console.log('✅ إعدادات AdMob جاهزة:', {
                appId: this.adConfig.appId ? '✅' : '❌',
                banner: this.adConfig.bannerAdUnitId ? '✅' : '❌',
                interstitial: this.adConfig.interstitialAdUnitId ? '✅' : '❌',
                rewarded: this.adConfig.rewardedAdUnitId ? '✅' : '❌'
            });
            
        } catch (error) {
            console.warn('⚠️ فشل تحميل إعدادات AdMob:', error);
            
            // إعدادات افتراضية للطوارئ
            this.adConfig = {
                appId: 'ca-app-pub-9866663686163267~1234567890',
                bannerAdUnitId: 'ca-app-pub-9866663686163267/1234567890',
                interstitialAdUnitId: 'ca-app-pub-9866663686163267/0987654321',
                rewardedAdUnitId: 'ca-app-pub-9866663686163267/1122334455',
                testDevices: [],
                isTesting: false
            };
        }
    }
    
    /**
     * إنشاء أنظمة احتياطية
     */
    createFallbackSystems() {
        // نظام البيانات الزراعية الاحتياطي
        if (typeof window.agricultureData === 'undefined') {
            window.agricultureData = {
                getCropById: (id) => this.getFallbackCrop(id),
                getDiseaseById: (id) => this.getFallbackDisease(id),
                getCrops: () => this.getFallbackCrops(),
                getDiseases: () => this.getFallbackDiseases(),
                dataVersion: 'fallback_1.0',
                lastUpdated: new Date().toISOString()
            };
            console.log('📦 تم إنشاء نظام بيانات زراعية احتياطي');
        }
        
        // نظام التطبيق الاحتياطي
        if (typeof window.app === 'undefined') {
            window.app = {
                showPage: (page) => this.fallbackShowPage(page),
                getCurrentPage: () => 'fallback',
                showToast: (message, type) => this.fallbackToast(message, type),
                toggleSidebar: () => console.log('فتح/إغلاق القائمة الجانبية')
            };
            console.log('📱 تم إنشاء نظام تطبيق احتياطي');
        }
        
        // نظام الترجمة الاحتياطي
        if (typeof window.agricultureI18n === 'undefined') {
            window.agricultureI18n = {
                get: (key, defaultValue) => this.fallbackTranslate(key, defaultValue),
                currentLang: 'ar',
                isRTL: () => true,
                formatNumber: (num) => num.toString(),
                formatDate: (date) => date.toLocaleDateString('ar-SA')
            };
            console.log('🌍 تم إنشاء نظام ترجمة احتياطي');
        }
        
        // نظام الذكاء الاصطناعي الاحتياطي
        if (typeof window.agricultureAI === 'undefined') {
            window.agricultureAI = {
                validateField: async (value, rules) => {
                    return { valid: true, message: 'AI validation passed' };
                },
                logEvent: (eventName) => console.log(`AI Event: ${eventName}`)
            };
            console.log('🤖 تم إنشاء نظام ذكاء اصطناعي احتياطي');
        }
        
        // نظام النقاط الاحتياطي
        if (typeof window.pointsSystem === 'undefined') {
            window.pointsSystem = {
                addPoints: (reason, points) => {
                    console.log(`🎯 Points added: ${points} for ${reason}`);
                },
                getPoints: () => 0
            };
            console.log('💰 تم إنشاء نظام نقاط احتياطي');
        }
        
        // نظام AdMob الاحتياطي
        if (typeof window.adsbygoogle === 'undefined' && typeof window.admob === 'undefined') {
            console.log('⚠️ نظام AdMob غير متوفر، إنشاء نظام احتياطي');
            this.createFallbackAdSystem();
        } else {
            console.log('✅ نظام AdMob متوفر وجاهز');
        }
    }
    
    /**
     * إنشاء نظام إعلانات احتياطي
     */
    createFallbackAdSystem() {
        window.admob = {
            banners: {
                showBanner: () => console.log('📱 [AdMob Fallback] عرض بانر إعلاني'),
                hideBanner: () => console.log('📱 [AdMob Fallback] إخفاء البانر'),
                showAtPosition: (position) => console.log(`📱 [AdMob Fallback] عرض في موقع: ${position}`)
            },
            interstitials: {
                load: () => Promise.resolve(),
                show: () => Promise.resolve()
            },
            rewarded: {
                load: () => Promise.resolve(),
                show: () => Promise.resolve({ type: 'rewarded_video', amount: 10 })
            }
        };
        
        // إضافة محاكاة لـ adsbygoogle
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({
            pauseAdRequests: () => console.log('[AdMob Fallback] إيقاف طلبات الإعلانات'),
            resumeAdRequests: () => console.log('[AdMob Fallback] استئناف طلبات الإعلانات')
        });
    }
    
    /**
     * تسجيل النظام في النافذة العامة
     */
    registerGlobal() {
        // تسجيل كـ validatorsSystem
        window.validatorsSystem = this;
        
        // أو كـ agricultureValidators
        window.agricultureValidators = this;
        
        // التسجيل في نظام التطبيق الرئيسي إذا كان موجوداً
        if (window.app && typeof window.app.registerModule === 'function') {
            window.app.registerModule('validators', this);
        }
        
        // التسجيل في نظام البيانات إذا كان موجوداً
        if (window.agricultureData && typeof window.agricultureData.registerModule === 'function') {
            window.agricultureData.registerModule('validators', this);
        }
        
        // التسجيل في نظام الإعلانات إذا كان موجوداً
        if (window.adManager && typeof window.adManager.registerModule === 'function') {
            window.adManager.registerModule('validators', this);
        }
    }
    
    /**
     * تحميل التفضيلات
     */
    loadPreferences() {
        try {
            // تحميل الإحصائيات
            const savedStats = localStorage.getItem('validation_stats');
            if (savedStats) {
                this.validationStats = JSON.parse(savedStats);
            }
            
            // تحميل الأنماط المخصصة
            const savedPatterns = localStorage.getItem('validator_patterns');
            if (savedPatterns) {
                const customPatterns = JSON.parse(savedPatterns);
                this.patterns = { ...this.patterns, ...customPatterns };
            }
            
            console.log(`📊 تم تحميل ${Object.keys(this.patterns).length} نمط تحقق`);
            
        } catch (error) {
            console.warn('⚠️ خطأ في تحميل التفضيلات:', error);
        }
    }
    
    /**
     * إضافة الأنماط المطلوبة
     */
    addRequiredStyles() {
        // التحقق إذا كانت الأنماط موجودة بالفعل
        if (document.getElementById('validators-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'validators-styles';
        style.textContent = this.getSystemStyles();
        document.head.appendChild(style);
    }
    
    /**
     * الحصول على أنماط النظام
     */
    getSystemStyles() {
        return `
            /* ====== أنماط نظام التحقق ====== */
            
            /* الحقول */
            .validation-success {
                border-color: #4CAF50 !important;
                background-color: rgba(76, 175, 80, 0.05) !important;
            }
            
            .validation-error {
                border-color: #F44336 !important;
                background-color: rgba(244, 67, 54, 0.05) !important;
                animation: validationShake 0.5s ease;
            }
            
            .validation-warning {
                border-color: #FF9800 !important;
                background-color: rgba(255, 152, 0, 0.05) !important;
            }
            
            .validation-info {
                border-color: #2196F3 !important;
                background-color: rgba(33, 150, 243, 0.05) !important;
            }
            
            /* الرسائل */
            .validation-message {
                font-family: 'Tajawal', sans-serif;
                font-size: 0.85rem;
                margin-top: 5px;
                padding: 8px 12px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
                animation: validationFadeIn 0.3s ease;
            }
            
            .validation-message.success {
                background: #E8F5E9;
                color: #2E7D32;
                border-right: 4px solid #4CAF50;
            }
            
            .validation-message.error {
                background: #FFEBEE;
                color: #C62828;
                border-right: 4px solid #F44336;
            }
            
            .validation-message.warning {
                background: #FFF3E0;
                color: #EF6C00;
                border-right: 4px solid #FF9800;
            }
            
            .validation-message.info {
                background: #E3F2FD;
                color: #1565C0;
                border-right: 4px solid #2196F3;
            }
            
            /* الأنيميشن */
            @keyframes validationShake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            @keyframes validationFadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* الأيقونات */
            .validation-icon {
                font-size: 1rem;
            }
            
            /* محمل التحقق */
            .validation-loader {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #4CAF50;
                border-radius: 50%;
                animation: validationSpin 1s linear infinite;
            }
            
            @keyframes validationSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* RTL دعم */
            [dir="rtl"] .validation-message {
                border-right: none;
                border-left: 4px solid;
            }
            
            [dir="rtl"] .validation-message.success {
                border-left-color: #4CAF50;
            }
            
            [dir="rtl"] .validation-message.error {
                border-left-color: #F44336;
            }
            
            [dir="rtl"] .validation-message.warning {
                border-left-color: #FF9800;
            }
            
            [dir="rtl"] .validation-message.info {
                border-left-color: #2196F3;
            }
            
            /* ⭐ أنماط إعلانات التحقق */
            .ad-validation-banner {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px;
                border-radius: 12px;
                margin: 15px 0;
                text-align: center;
                animation: validationFadeIn 0.5s ease;
            }
            
            .ad-validation-title {
                font-size: 1.1rem;
                margin-bottom: 10px;
                font-weight: 600;
            }
            
            .ad-validation-message {
                font-size: 0.9rem;
                opacity: 0.9;
                margin-bottom: 15px;
            }
            
            .ad-validation-cta {
                background: white;
                color: #667eea;
                border: none;
                padding: 10px 25px;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .ad-validation-cta:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
        `;
    }
    
    /**
     * تحميل الرسائل المخصصة
     */
    async loadCustomMessages() {
        try {
            // أولوية: تحميل من نظام الترجمة
            if (window.i18n && window.i18n.messages && window.i18n.messages.validations) {
                const translationMessages = window.i18n.messages.validations;
                this.messages = { ...this.messages, ...translationMessages };
                console.log('✅ تم تحميل رسائل التحقق من نظام الترجمة');
                return;
            }
            
            // ثانوية: تحميل من localStorage
            const customMessages = JSON.parse(localStorage.getItem('validator_messages') || '{}');
            if (Object.keys(customMessages).length > 0) {
                this.messages = { ...this.messages, ...customMessages };
                console.log('✅ تم تحميل الرسائل المخصصة من localStorage');
            }
            
            // أخيراً: تحميل من ملف خارجي
            try {
                const response = await fetch('js/data/validation-messages.json');
                if (response.ok) {
                    const fileMessages = await response.json();
                    this.messages = { ...this.messages, ...fileMessages };
                    console.log('✅ تم تحميل رسائل التحقق من الملف');
                }
            } catch (error) {
                // تجاهل الخطأ إذا الملف غير موجود
            }
        } catch (error) {
            console.warn('⚠️ فشل تحميل الرسائل المخصصة:', error);
        }
    }
    
    /**
     * إعداد المدققين المخصصين
     */
    setupCustomValidators() {
        // مدقق الزراعة
        this.customValidators = {
            // مدقق المحاصيل
            cropName: (value) => {
                if (!value || value.trim().length < 2) {
                    return 'اسم المحصول قصير جداً';
                }
                
                if (value.length > 50) {
                    return 'اسم المحصول طويل جداً';
                }
                
                // يمكن إضافة قائمة بالمحاصيل المحجوزة
                const reservedNames = ['admin', 'system', 'test'];
                if (reservedNames.includes(value.toLowerCase())) {
                    return 'هذا الاسم محجوز';
                }
                
                return true;
            },
            
            // ⭐ مدقق كود المحصول
            cropCode: (value) => {
                if (!this.patterns.cropCode.test(value)) {
                    return 'كود المحصول غير صالح. الصيغة الصحيحة: ABC-123456';
                }
                
                // التحقق من قاعدة البيانات إذا كانت موجودة
                if (window.agricultureData && window.agricultureData.getCrops) {
                    const crops = window.agricultureData.getCrops();
                    if (crops && crops.find) {
                        const existing = crops.find(crop => crop.code === value);
                        if (existing) {
                            return 'كود المحصول مستخدم مسبقاً';
                        }
                    }
                }
                
                return true;
            },
            
            // مدقق المساحة
            landArea: (value, unit = 'hectare') => {
                const area = parseFloat(value);
                
                if (isNaN(area) || area <= 0) {
                    return 'المساحة غير صالحة';
                }
                
                const limits = {
                    hectare: { min: 0.1, max: 1000 },
                    acre: { min: 0.25, max: 2500 },
                    meter: { min: 100, max: 1000000 }
                };
                
                const limit = limits[unit] || limits.hectare;
                
                if (area < limit.min) {
                    return `المساحة صغيرة جداً، الحد الأدنى ${limit.min} ${unit === 'hectare' ? 'هكتار' : unit === 'acre' ? 'فدان' : 'متر مربع'}`;
                }
                
                if (area > limit.max) {
                    return `المساحة كبيرة جداً، الحد الأقصى ${limit.max} ${unit === 'hectare' ? 'هكتار' : unit === 'acre' ? 'فدان' : 'متر مربع'}`;
                }
                
                return true;
            },
            
            // ⭐ مدقق الإحداثيات الزراعية
            farmCoordinates: (value) => {
                if (!this.patterns.coordinates.test(value)) {
                    return 'الإحداثيات غير صالحة. الصيغة: 12.345, -45.678';
                }
                
                const [lat, lng] = value.split(',').map(coord => parseFloat(coord.trim()));
                
                // حدود جغرافية معقولة
                if (lat < -90 || lat > 90) {
                    return 'خط العرض خارج النطاق (-90 إلى 90)';
                }
                
                if (lng < -180 || lng > 180) {
                    return 'خط الطول خارج النطاق (-180 إلى 180)';
                }
                
                // ⭐ إضافة نقاط للتحقق الصحيح
                if (window.pointsSystem && typeof window.pointsSystem.addPoints === 'function') {
                    window.pointsSystem.addPoints('coordinates_validation', 1);
                }
                
                // ⭐ تسجيل إعلان للتحقق الناجح
                this.trackAdEvent('coordinates_validated', { lat, lng });
                
                return true;
            },
            
            // مدقق كمية المياه
            waterAmount: (value, cropType) => {
                const amount = parseFloat(value);
                
                if (isNaN(amount) || amount < 0) {
                    return 'كمية المياه غير صالحة';
                }
                
                // حدود حسب نوع المحصول
                const cropLimits = {
                    'حبوب': { min: 500, max: 1500 },
                    'خضروات': { min: 800, max: 3000 },
                    'أشجار': { min: 1000, max: 5000 },
                    'نخيل': { min: 1500, max: 8000 },
                    'زيتون': { min: 800, max: 4000 }
                };
                
                const limit = cropLimits[cropType] || { min: 100, max: 10000 };
                
                if (amount < limit.min) {
                    return `كمية المياه قليلة جداً للزراعة`;
                }
                
                if (amount > limit.max) {
                    return `كمية المياه كبيرة جداً وقد تسبب إهداراً`;
                }
                
                return true;
            },
            
            // مدقق درجة الحموضة
            phLevel: (value) => {
                const ph = parseFloat(value);
                
                if (isNaN(ph)) {
                    return 'درجة الحموضة غير صالحة';
                }
                
                if (ph < 0 || ph > 14) {
                    return 'درجة الحموضة يجب أن تكون بين 0 و 14';
                }
                
                if (ph < 4 || ph > 9) {
                    return 'درجة الحموضة خارج النطاق الزراعي المناسب (4-9)';
                }
                
                return true;
            },
            
            // مدقق درجة الحرارة
            temperature: (value, unit = 'C') => {
                const temp = parseFloat(value);
                
                if (isNaN(temp)) {
                    return 'درجة الحرارة غير صالحة';
                }
                
                if (unit === 'C') {
                    if (temp < -50 || temp > 60) {
                        return 'درجة الحرارة خارج النطاق المقبول';
                    }
                } else if (unit === 'F') {
                    if (temp < -58 || temp > 140) {
                        return 'درجة الحرارة خارج النطاق المقبول';
                    }
                }
                
                return true;
            },
            
            // مدقق التاريخ الزراعي
            plantingDate: (value, cropSeason) => {
                if (!this.isDate(value)) {
                    return 'تاريخ الزراعة غير صالح';
                }
                
                const date = new Date(value);
                const now = new Date();
                
                // لا يمكن الزراعة في الماضي البعيد
                if (date < new Date(now.getFullYear() - 5, 0, 1)) {
                    return 'تاريخ الزراعة قديم جداً';
                }
                
                // لا يمكن الزراعة في المستقبل البعيد
                if (date > new Date(now.getFullYear() + 2, 11, 31)) {
                    return 'تاريخ الزراعة بعيد جداً';
                }
                
                // التحقق من الموسم
                if (cropSeason) {
                    const month = date.getMonth() + 1;
                    const seasonMonths = {
                        'شتوي': [10, 11, 12, 1, 2, 3],
                        'صيفي': [4, 5, 6, 7, 8, 9],
                        'ربيعي': [2, 3, 4, 5],
                        'خريفي': [8, 9, 10, 11],
                        'دائم': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                    };
                    
                    if (seasonMonths[cropSeason] && !seasonMonths[cropSeason].includes(month)) {
                        return `تاريخ الزراعة غير مناسب لمحصول ${cropSeason}`;
                    }
                }
                
                return true;
            },
            
            // مدقق كمية السماد
            fertilizerAmount: (value, fertilizerType) => {
                const amount = parseFloat(value);
                
                if (isNaN(amount) || amount < 0) {
                    return 'كمية السماد غير صالحة';
                }
                
                // حدود حسب نوع السماد
                const limits = {
                    'نيتروجين': { min: 0, max: 300 },
                    'فوسفور': { min: 0, max: 200 },
                    'بوتاسيوم': { min: 0, max: 250 },
                    'عضوي': { min: 0, max: 10000 },
                    'مركب': { min: 0, max: 500 },
                    'سائل': { min: 0, max: 100 }
                };
                
                const limit = limits[fertilizerType] || { min: 0, max: 1000 };
                
                if (amount > limit.max) {
                    return `كمية السماد كبيرة جداً وقد تضر المحصول (الحد الأقصى: ${limit.max} كجم/هكتار)`;
                }
                
                return true;
            },
            
            // مدقق المسافة بين النباتات
            plantSpacing: (value, cropType) => {
                const spacing = parseFloat(value);
                
                if (isNaN(spacing) || spacing <= 0) {
                    return 'المسافة غير صالحة';
                }
                
                // مسافات نموذجية حسب نوع المحصول
                const typicalSpacing = {
                    'القمح': { min: 10, max: 25 },
                    'الطماطم': { min: 40, max: 80 },
                    'الخيار': { min: 50, max: 100 },
                    'الذرة': { min: 20, max: 40 },
                    'الأشجار': { min: 200, max: 800 },
                    'النخيل': { min: 500, max: 1000 }
                };
                
                const cropSpacing = typicalSpacing[cropType] || { min: 10, max: 100 };
                
                if (spacing < cropSpacing.min) {
                    return `المسافة قريبة جداً للمحصول (الحد الأدنى: ${cropSpacing.min} سم)`;
                }
                
                if (spacing > cropSpacing.max) {
                    return `المسافة بعيدة جداً عن النطاق الطبيعي (الحد الأقصى: ${cropSpacing.max} سم)`;
                }
                
                return true;
            },
            
            // ⭐ مدقق نوع التربة
            soilType: (value) => {
                if (!this.patterns.soilType.test(value)) {
                    return 'نوع التربة يجب أن يحتوي على أحرف ومسافات فقط';
                }
                
                const validTypes = ['طينية', 'رملية', 'سلتية', 'طينية رملية', 'كلسية', 'ملحية'];
                
                if (!validTypes.includes(value)) {
                    return `نوع التربة غير معروف. الأنواع المتاحة: ${validTypes.join('، ')}`;
                }
                
                return true;
            },
            
            // ⭐ مدقق الموسم الزراعي
            seasonType: (value) => {
                if (!this.patterns.seasonCode.test(value)) {
                    return 'الموسم غير صالح. القيم المتاحة: شتوي، صيفي، ربيعي، خريفي، دائم';
                }
                
                return true;
            },
            
            // ⭐ مدقق AdMob App ID
            admobAppId: (value) => {
                if (!this.patterns.appId.test(value)) {
                    return 'معرّف تطبيق AdMob غير صالح. الصيغة: ca-app-pub-XXXXXXXX~YYYYYY';
                }
                
                // التحقق من التطبيق إذا كان AdMob متاحاً
                if (window.adsbygoogle && this.adConfig.testDevices) {
                    this.trackAdEvent('admob_id_validated', { appId: value });
                }
                
                return true;
            },
            
            // ⭐ مدقق AdMob Ad Unit ID
            admobAdUnitId: (value, adType = 'banner') => {
                if (!this.patterns.adUnitId.test(value)) {
                    return 'معرّف وحدة إعلان AdMob غير صالح. الصيغة: ca-app-pub-XXXXXXXX/YYYYYY';
                }
                
                // تسجيل حدث التحقق
                this.trackAdEvent('ad_unit_validated', { 
                    adUnitId: value, 
                    adType: adType,
                    timestamp: new Date().toISOString()
                });
                
                return true;
            }
        };
    }
    
    /**
     * ⭐ تسجيل حدث إعلاني
     */
    trackAdEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            adMobReady: this.adMobReady
        };
        
        console.log(`📱 حدث AdMob: ${eventName}`, data);
        
        // حفظ في localStorage للإحصائيات
        try {
            const adStats = JSON.parse(localStorage.getItem('ad_validation_stats') || '{"events": [], "total": 0}');
            adStats.events.push(event);
            adStats.total++;
            localStorage.setItem('ad_validation_stats', JSON.stringify(adStats));
        } catch (error) {
            console.warn('⚠️ فشل حفظ إحصائيات الإعلانات:', error);
        }
        
        // إرسال إلى AdMob Analytics إذا كان متاحاً
        if (this.adMobReady && window.gtag) {
            try {
                window.gtag('event', eventName, data);
            } catch (error) {
                // تجاهل الخطأ
            }
        }
        
        // إرسال حدث مخصص للنظام
        this.dispatchSystemEvent(`ad_${eventName}`, data);
    }
    
    /**
     * ⭐ عرض إعلان مدمج في التحقق
     */
    showAdInValidation(context = 'validation_completed') {
        if (!this.adMobReady) {
            console.log('⚠️ AdMob غير متوفر لعرض الإعلان');
            return null;
        }
        
        const adContainer = document.createElement('div');
        adContainer.className = 'ad-validation-banner';
        adContainer.id = `ad-validation-${Date.now()}`;
        
        const adContent = `
            <div class="ad-validation-title">🔗 إعلان مموّل</div>
            <div class="ad-validation-message">
                دعم التطبيق عبر مشاهدة الإعلانات
            </div>
            <button class="ad-validation-cta" onclick="validatorsSystem.handleAdClick('${context}')">
                👁️ مشاهدة الإعلان
            </button>
        `;
        
        adContainer.innerHTML = adContent;
        
        // إرجاع العنصر لعرضه
        return adContainer;
    }
    
    /**
     * ⭐ التعامل مع نقر الإعلان
     */
    handleAdClick(context) {
        console.log(`🎯 نقر على إعلان في سياق: ${context}`);
        
        // تسجيل الحدث
        this.trackAdEvent('ad_click', { context, timestamp: new Date().toISOString() });
        
        // إضافة نقاط إذا كان النظام متاحاً
        if (window.pointsSystem && typeof window.pointsSystem.addPoints === 'function') {
            window.pointsSystem.addPoints('ad_click', 5);
        }
        
        // عرض إعلان مكافأة
        if (this.adMobReady && window.admob && window.admob.rewarded) {
            try {
                window.admob.rewarded.show()
                    .then(result => {
                        if (result && result.amount) {
                            console.log(`🎬 تم عرض إعلان مكافأة: ${result.amount} نقطة`);
                            if (window.pointsSystem) {
                                window.pointsSystem.addPoints('rewarded_ad', result.amount);
                            }
                        }
                    })
                    .catch(error => {
                        console.error('❌ فشل عرض إعلان المكافأة:', error);
                    });
            } catch (error) {
                console.error('❌ خطأ في عرض الإعلان:', error);
            }
        }
        
        // إشعار للمستخدم
        if (window.app && typeof window.app.showToast === 'function') {
            window.app.showToast('🎬 جاري تحميل الإعلان...', 'info');
        } else {
            this.fallbackToast('🎬 جاري تحميل الإعلان...', 'info');
        }
    }
    
    // ====== الواجهات العامة ======
    
    /**
     * التحقق من قيمة
     */
    async validate(value, rules = {}) {
        if (!this.isInitialized) {
            console.warn('⚠️ نظام التحقق غير مهيأ بالكامل');
            return false;
        }
        
        this.errors.clear();
        this.validationStats.total++;
        
        // ⭐ تسجيل وقت التحقق
        const validationStart = Date.now();
        
        // التحقق من الحقول المطلوبة
        if (rules.required && (value === undefined || value === null || value === '')) {
            const errorMsg = this.getMessage('required', rules);
            this.addError('required', errorMsg);
            this.recordValidation(false, 'required', validationStart);
            return false;
        }
        
        // إذا كانت القيمة فارغة وليست مطلوبة، نعتبرها صحيحة
        if ((value === undefined || value === null || value === '') && !rules.required) {
            this.recordValidation(true, 'optional_empty', validationStart);
            return true;
        }
        
        const valueStr = String(value).trim();
        
        // التحقق من الطول
        if (rules.minLength !== undefined && valueStr.length < rules.minLength) {
            const errorMsg = this.getMessage('minLength', { ...rules, min: rules.minLength });
            this.addError('minLength', errorMsg);
            this.recordValidation(false, 'minLength', validationStart);
            return false;
        }
        
        if (rules.maxLength !== undefined && valueStr.length > rules.maxLength) {
            const errorMsg = this.getMessage('maxLength', { ...rules, max: rules.maxLength });
            this.addError('maxLength', errorMsg);
            this.recordValidation(false, 'maxLength', validationStart);
            return false;
        }
        
        // التحقق من القيم العددية
        if (rules.min !== undefined && !isNaN(value)) {
            const numValue = parseFloat(value);
            if (numValue < rules.min) {
                const errorMsg = this.getMessage('minValue', { ...rules, min: rules.min });
                this.addError('minValue', errorMsg);
                this.recordValidation(false, 'minValue', validationStart);
                return false;
            }
        }
        
        if (rules.max !== undefined && !isNaN(value)) {
            const numValue = parseFloat(value);
            if (numValue > rules.max) {
                const errorMsg = this.getMessage('maxValue', { ...rules, max: rules.max });
                this.addError('maxValue', errorMsg);
                this.recordValidation(false, 'maxValue', validationStart);
                return false;
            }
        }
        
        // التحقق من النمط
        if (rules.pattern) {
            const pattern = typeof rules.pattern === 'string' ? this.patterns[rules.pattern] : rules.pattern;
            
            if (pattern && !pattern.test(valueStr)) {
                const errorMsg = this.getMessage(rules.pattern, rules) || this.getMessage('pattern', rules);
                this.addError('pattern', errorMsg);
                this.recordValidation(false, 'pattern', validationStart);
                return false;
            }
        }
        
        // التحقق من المطابقة
        if (rules.match && value !== rules.match) {
            const errorMsg = this.getMessage('match', rules);
            this.addError('match', errorMsg);
            this.recordValidation(false, 'match', validationStart);
            return false;
        }
        
        // التحقق من المدقق المخصص
        if (rules.validator && typeof rules.validator === 'function') {
            const customResult = rules.validator(value, rules);
            
            if (customResult !== true) {
                this.addError('custom', customResult);
                this.recordValidation(false, 'custom', validationStart);
                return false;
            }
        }
        
        // التحقق من المدقق الزراعي المخصص
        if (rules.agricultureValidator && this.customValidators[rules.agricultureValidator]) {
            const params = rules.agricultureParams || {};
            const customResult = this.customValidators[rules.agricultureValidator](value, params);
            
            if (customResult !== true) {
                this.addError('agriculture', customResult);
                this.recordValidation(false, 'agriculture_' + rules.agricultureValidator, validationStart);
                return false;
            }
        }
        
        // ⭐ التحقق من الذكاء الاصطناعي إذا كان متاحاً
        if (rules.aiValidation && window.agricultureAI && typeof window.agricultureAI.validateField === 'function') {
            try {
                const aiResult = await window.agricultureAI.validateField(value, rules.aiValidation);
                if (!aiResult.valid) {
                    this.addError('ai', aiResult.message);
                    this.recordValidation(false, 'ai_validation', validationStart);
                    return false;
                }
            } catch (error) {
                console.warn('⚠️ فشل التحقق بالذكاء الاصطناعي:', error);
            }
        }
        
        // التحقق ناجح
        this.recordValidation(true, 'success', validationStart);
        
        // ⭐ إضافة نقاط إذا نجح التحقق وكانت هناك نقاط مخصصة
        if (rules.points && window.pointsSystem && typeof window.pointsSystem.addPoints === 'function') {
            window.pointsSystem.addPoints('validation_success', rules.points);
        }
        
        // ⭐ تسجيل حدث AdMob للتحقق الناجح
        if (rules.trackAd && this.adMobReady) {
            this.trackAdEvent('validation_success', { 
                type: rules.pattern || 'custom',
                valueLength: valueStr.length,
                points: rules.points || 0
            });
        }
        
        return true;
    }
    
    // ⭐ تسجيل نتيجة التحقق
    recordValidation(success, type, startTime) {
        const duration = Date.now() - startTime;
        
        if (success) {
            this.validationStats.successful++;
        } else {
            this.validationStats.failed++;
        }
        
        this.validationStats.lastValidation = {
            success,
            type,
            duration,
            timestamp: new Date().toISOString()
        };
        
        // حفظ الإحصائيات
        this.saveToLocalStorage();
    }
    
    // 📝 التحقق من نموذج كامل
    async validateForm(formData, schema) {
        const errors = {};
        let isValid = true;
        
        for (const [field, rules] of Object.entries(schema)) {
            const value = formData[field];
            
            const result = await this.validate(value, rules);
            if (!result) {
                errors[field] = this.getErrors();
                isValid = false;
            }
            
            this.clearErrors();
        }
        
        // ⭐ عرض إعلان إذا كان النموذج صحيحاً
        if (isValid && this.adMobReady) {
            this.trackAdEvent('form_validation_success', {
                fieldCount: Object.keys(schema).length,
                errorCount: 0
            });
        }
        
        return {
            isValid,
            errors,
            firstError: Object.values(errors)[0]?.[0],
            errorCount: Object.keys(errors).length
        };
    }
    
    // 📝 التحقق من نموذج HTML
    async validateFormElement(formElement, schema) {
        const formData = {};
        const elements = formElement.querySelectorAll('[name], [data-validate]');
        
        // جمع البيانات من النموذج
        elements.forEach(element => {
            const name = element.getAttribute('name') || element.getAttribute('data-validate');
            
            if (element.type === 'checkbox' || element.type === 'radio') {
                if (element.checked) {
                    formData[name] = element.value;
                } else if (!formData[name]) {
                    formData[name] = '';
                }
            } else if (element.tagName === 'SELECT') {
                formData[name] = element.value;
            } else {
                formData[name] = element.value;
            }
        });
        
        // التحقق من البيانات
        return await this.validateForm(formData, schema);
    }
    
    // 📧 التحقق من البريد الإلكتروني
    async validateEmail(email) {
        const result = await this.validate(email, {
            required: true,
            pattern: 'email',
            trackAd: true // ⭐ تتبع هذا التحقق في AdMob
        });
        
        // ⭐ استشارة الذكاء الاصطناعي إذا كان متاحاً
        if (result && window.agricultureAI && typeof window.agricultureAI.logEvent === 'function') {
            window.agricultureAI.logEvent('email_validation_success');
        }
        
        return result;
    }
    
    // 📞 التحقق من رقم الهاتف
    async validatePhone(phone) {
        return await this.validate(phone, {
            required: true,
            pattern: 'phone',
            minLength: 10,
            maxLength: 15,
            trackAd: true // ⭐ تتبع هذا التحقق في AdMob
        });
    }
    
    // 🔐 التحقق من كلمة المرور
    async validatePassword(password) {
        return await this.validate(password, {
            required: true,
            minLength: 8,
            pattern: 'password',
            points: 2, // ⭐ نقاط للتحقق الناجح
            trackAd: true // ⭐ تتبع هذا التحقق في AdMob
        });
    }
    
    // 🔄 التحقق من تطابق كلمتي المرور
    async validatePasswordMatch(password, confirmPassword) {
        if (!await this.validatePassword(password)) {
            return false;
        }
        
        return await this.validate(confirmPassword, {
            required: true,
            match: password,
            points: 1, // ⭐ نقاط إضافية للمطابقة
            trackAd: true // ⭐ تتبع هذا التحقق في AdMob
        });
    }
    
    // 📅 التحقق من التاريخ
    async validateDate(date) {
        return await this.validate(date, {
            required: true,
            pattern: 'date'
        });
    }
    
    // ⏰ التحقق من الوقت
    async validateTime(time) {
        return await this.validate(time, {
            required: true,
            pattern: 'time'
        });
    }
    
    // 🔗 التحقق من الرابط
    async validateUrl(url) {
        return await this.validate(url, {
            pattern: 'url'
        });
    }
    
    // 🎨 التحقق من اللون
    async validateColor(color) {
        return await this.validate(color, {
            pattern: 'hexColor'
        });
    }
    
    // 📍 التحقق من الإحداثيات الزراعية
    async validateCoordinates(coords) {
        return await this.validate(coords, {
            pattern: 'coordinates',
            agricultureValidator: 'farmCoordinates',
            trackAd: true // ⭐ تتبع هذا التحقق في AdMob
        });
    }
    
    // ⭐ التحقق من AdMob App ID
    async validateAdMobAppId(appId) {
        return await this.validate(appId, {
            required: true,
            pattern: 'appId',
            agricultureValidator: 'admobAppId',
            trackAd: true
        });
    }
    
    // ⭐ التحقق من AdMob Ad Unit ID
    async validateAdMobAdUnitId(adUnitId, adType = 'banner') {
        return await this.validate(adUnitId, {
            required: true,
            pattern: 'adUnitId',
            agricultureValidator: 'admobAdUnitId',
            agricultureParams: adType,
            trackAd: true
        });
    }
    
    // 🌾 التحقق من بيانات المحصول
    async validateCropData(data) {
        const schema = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 50,
                agricultureValidator: 'cropName'
            },
            code: {
                required: true,
                agricultureValidator: 'cropCode',
                points: 3, // ⭐ نقاط للتحقق الناجح
                trackAd: true // ⭐ تتبع في AdMob
            },
            category: {
                required: true,
                minLength: 2
            },
            season: {
                required: true,
                agricultureValidator: 'seasonType'
            },
            area: {
                required: true,
                agricultureValidator: 'landArea',
                agricultureParams: 'hectare'
            },
            plantingDate: {
                required: true,
                agricultureValidator: 'plantingDate',
                agricultureParams: data.season
            },
            phLevel: {
                agricultureValidator: 'phLevel'
            }
        };
        
        return await this.validateForm(data, schema);
    }
    
    // 💧 التحقق من بيانات الري
    async validateIrrigationData(data) {
        const schema = {
            waterAmount: {
                required: true,
                agricultureValidator: 'waterAmount',
                agricultureParams: data.cropType,
                trackAd: true
            },
            frequency: {
                required: true,
                min: 1,
                max: 30
            },
            method: {
                required: true
            },
            duration: {
                min: 1,
                max: 24
            }
        };
        
        return await this.validateForm(data, schema);
    }
    
    // 🌱 التحقق من بيانات التسميد
    async validateFertilizationData(data) {
        const schema = {
            fertilizerType: {
                required: true
            },
            fertilizerCode: {
                pattern: 'fertilizerCode',
                trackAd: true
            },
            amount: {
                required: true,
                agricultureValidator: 'fertilizerAmount',
                agricultureParams: data.fertilizerType
            },
            applicationDate: {
                required: true
            },
            method: {
                required: true
            }
        };
        
        return await this.validateForm(data, schema);
    }
    
    // ⭐ التحقق من بيانات المرض النباتي
    async validateDiseaseData(data) {
        const schema = {
            name: {
                required: true,
                minLength: 3,
                maxLength: 100
            },
            code: {
                pattern: 'diseaseCode',
                trackAd: true
            },
            crop: {
                required: true
            },
            symptoms: {
                required: true,
                minLength: 10
            },
            treatment: {
                required: true,
                minLength: 10
            },
            severity: {
                required: true,
                min: 1,
                max: 5
            }
        };
        
        return await this.validateForm(data, schema);
    }
    
    // 📊 التحقق من بيانات التربة
    async validateSoilData(data) {
        const schema = {
            soilType: {
                required: true,
                agricultureValidator: 'soilType'
            },
            phLevel: {
                required: true,
                agricultureValidator: 'phLevel'
            },
            temperature: {
                agricultureValidator: 'temperature'
            },
            moisture: {
                min: 0,
                max: 100
            },
            nitrogen: {
                min: 0,
                max: 100
            },
            phosphorus: {
                min: 0,
                max: 100
            },
            potassium: {
                min: 0,
                max: 100
            },
            organicMatter: {
                min: 0,
                max: 20
            }
        };
        
        return await this.validateForm(data, schema);
    }
    
    // 🛠️ دوال مساعدة
    
    // 📝 إضافة خطأ
    addError(type, message) {
        if (!this.errors.has(type)) {
            this.errors.set(type, []);
        }
        
        this.errors.get(type).push(message);
        
        // ⭐ تسجيل الخطأ في نظام التحليلات
        this.logEvent('validation_error', { type, message });
    }
    
    // 📋 الحصول على الأخطاء
    getErrors() {
        const allErrors = [];
        
        for (const errors of this.errors.values()) {
            allErrors.push(...errors);
        }
        
        return allErrors;
    }
    
    // 🧹 مسح الأخطاء
    clearErrors() {
        this.errors.clear();
    }
    
    // 💬 الحصول على رسالة الخطأ
    getMessage(type, rules = {}) {
        let message = this.messages[type] || 'خطأ في التحقق';
        
        // ترجمة الرسالة إذا كان نظام الترجمة متاحاً
        if (window.i18n && window.i18n.t) {
            const translated = window.i18n.t(`validations.${type}`, rules);
            if (translated && translated !== `validations.${type}`) {
                message = translated;
            }
        }
        
        // استبدال العناصر النائبة
        message = message.replace(/{(\w+)}/g, (match, key) => {
            return rules[key] !== undefined ? rules[key] : match;
        });
        
        return message;
    }
    
    // 📅 التحقق من صحة التاريخ
    isDate(value) {
        if (!value) return false;
        
        const date = new Date(value);
        return date instanceof Date && !isNaN(date.getTime());
    }
    
    // 🔢 التحقق من صحة الرقم
    isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
    
    // 🔤 التحقق من نص عربي
    isArabic(text) {
        return this.patterns.arabicText.test(text);
    }
    
    // 🔤 التحقق من نص إنجليزي
    isEnglish(text) {
        return this.patterns.englishText.test(text);
    }
    
    // 📧 التحقق من بريد إلكتروني
    isEmail(email) {
        return this.patterns.email.test(email);
    }
    
    // 📞 التحقق من رقم هاتف
    isPhone(phone) {
        return this.patterns.phone.test(phone);
    }
    
    // 🔗 التحقق من رابط
    isUrl(url) {
        return this.patterns.url.test(url);
    }
    
    // ⭐ التحقق من كود المحصول
    isCropCode(code) {
        return this.patterns.cropCode.test(code);
    }
    
    // ⭐ التحقق من نوع التربة
    isSoilType(type) {
        return this.patterns.soilType.test(type);
    }
    
    // ⭐ التحقق من الموسم
    isSeason(season) {
        return this.patterns.seasonCode.test(season);
    }
    
    // ⭐ التحقق من AdMob App ID
    isAdMobAppId(appId) {
        return this.patterns.appId.test(appId);
    }
    
    // ⭐ التحقق من AdMob Ad Unit ID
    isAdMobAdUnitId(adUnitId) {
        return this.patterns.adUnitId.test(adUnitId);
    }
    
    // ⚡ تحقق سريع
    quickValidate(value, type) {
        const validators = {
            'email': () => this.isEmail(value),
            'phone': () => this.isPhone(value),
            'number': () => this.isNumber(value),
            'date': () => this.isDate(value),
            'url': () => this.isUrl(value),
            'arabic': () => this.isArabic(value),
            'english': () => this.isEnglish(value),
            'cropCode': () => this.isCropCode(value),
            'soilType': () => this.isSoilType(value),
            'season': () => this.isSeason(value),
            'admobAppId': () => this.isAdMobAppId(value),
            'admobAdUnitId': () => this.isAdMobAdUnitId(value),
            'required': () => value !== undefined && value !== null && value !== ''
        };
        
        const validator = validators[type];
        return validator ? validator() : false;
    }
    
    // 🎯 التحقق من نطاق القيمة
    inRange(value, min, max) {
        const num = parseFloat(value);
        
        if (isNaN(num)) {
            return false;
        }
        
        return num >= min && num <= max;
    }
    
    // 🔄 التحقق من القيمة في قائمة
    inList(value, list) {
        return list.includes(value);
    }
    
    // 📏 التحقق من الطول
    hasLength(value, min, max) {
        const length = String(value).length;
        
        if (min !== undefined && length < min) {
            return false;
        }
        
        if (max !== undefined && length > max) {
            return false;
        }
        
        return true;
    }
    
    // 🔍 التحقق من النمط
    matchesPattern(value, patternName) {
        const pattern = this.patterns[patternName];
        return pattern ? pattern.test(value) : false;
    }
    
    // 📝 عرض الأخطاء في واجهة المستخدم
    displayErrors(element, errors, type = 'error') {
        // إزالة الأخطاء السابقة
        this.removeErrors(element);
        
        if (!errors || errors.length === 0) {
            return;
        }
        
        const types = {
            'error': { icon: 'fa-exclamation-circle', color: '#F44336', bg: '#FFEBEE' },
            'warning': { icon: 'fa-exclamation-triangle', color: '#FF9800', bg: '#FFF3E0' },
            'success': { icon: 'fa-check-circle', color: '#4CAF50', bg: '#E8F5E9' },
            'info': { icon: 'fa-info-circle', color: '#2196F3', bg: '#E3F2FD' }
        };
        
        const style = types[type] || types.error;
        
        // إنشاء عنصر الأخطاء
        const errorContainer = document.createElement('div');
        errorContainer.className = `validation-message ${type}`;
        
        // إضافة الأخطاء
        errors.forEach((error, index) => {
            const errorItem = document.createElement('div');
            errorItem.style.cssText = `
                display: flex;
                align-items: flex-start;
                gap: 10px;
                margin-bottom: ${index === errors.length - 1 ? '0' : '8px'};
                line-height: 1.4;
            `;
            
            errorItem.innerHTML = `
                <i class="fas ${style.icon} validation-icon" style="color: ${style.color}; margin-top: 2px;"></i>
                <span>${error}</span>
            `;
            
            errorContainer.appendChild(errorItem);
        });
        
        // إضافة بعد العنصر
        if (element.parentNode) {
            element.parentNode.insertBefore(errorContainer, element.nextSibling);
        }
        
        // تحديث مظهر العنصر
        element.classList.add(`validation-${type}`);
        element.style.borderColor = style.color;
        
        // إضافة أنيميشن
        element.style.animation = 'validationShake 0.5s ease';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
        
        // ⭐ تسجيل في التحليلات
        this.logEvent('error_displayed', { 
            element: element.tagName, 
            errorCount: errors.length,
            type 
        });
        
        // ⭐ تسجيل في AdMob إذا كان خطأ
        if (type === 'error' && this.adMobReady) {
            this.trackAdEvent('validation_error_displayed', {
                errorCount: errors.length,
                elementType: element.tagName
            });
        }
    }
    
    // 🙈 إزالة الأخطاء من واجهة المستخدم
    removeErrors(element) {
        // إزالة حاوية الأخطاء
        const errorContainer = element.parentNode?.querySelector('.validation-message');
        if (errorContainer) {
            errorContainer.remove();
        }
        
        // إزالة فئات التحقق
        element.classList.remove('validation-error', 'validation-warning', 
                                'validation-success', 'validation-info',
                                'has-error', 'is-valid', 'is-invalid');
        element.style.borderColor = '';
    }
    
    // 🎯 التحقق في الوقت الحقيقي
    setupRealTimeValidation(inputElement, rules) {
        let timeout;
        let isFirstValidation = true;
        
        const validateInput = async () => {
            const value = inputElement.value;
            
            // إضافة مؤشر تحميل
            if (!isFirstValidation) {
                this.showLoading(inputElement);
            }
            
            const isValid = await this.validate(value, rules);
            
            // إخفاء مؤشر التحميل
            this.hideLoading(inputElement);
            
            if (isValid) {
                this.removeErrors(inputElement);
                this.displayErrors(inputElement, ['✓ التحقق ناجح'], 'success');
                inputElement.classList.add('is-valid');
                
                // ⭐ إشعار بنجاح التحقق
                if (typeof window.showToast === 'function') {
                    window.showToast('✓ تم التحقق بنجاح', 'success');
                }
                
                // ⭐ عرض إعلان بعد التحقق الناجح (مرة واحدة فقط)
                if (!isFirstValidation && this.adMobReady && Math.random() > 0.7) {
                    const adElement = this.showAdInValidation('realtime_validation');
                    if (adElement && inputElement.parentNode) {
                        setTimeout(() => {
                            inputElement.parentNode.insertBefore(adElement, inputElement.nextSibling);
                        }, 500);
                    }
                }
            } else {
                this.displayErrors(inputElement, this.getErrors(), 'error');
                inputElement.classList.add('is-invalid');
            }
            
            this.clearErrors();
            isFirstValidation = false;
        };
        
        // التحقق عند الكتابة (باستخدام debounce)
        inputElement.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(validateInput, 500);
        });
        
        // التحقق عند فقدان التركيز
        inputElement.addEventListener('blur', validateInput);
        
        // التحقق الأولي
        validateInput();
    }
    
    // ┄ مؤشر التحميل
    showLoading(element) {
        const loader = document.createElement('div');
        loader.className = 'validation-loader';
        loader.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
        `;
        
        element.style.position = 'relative';
        element.parentElement.style.position = 'relative';
        element.parentElement.appendChild(loader);
        
        element.loader = loader;
    }
    
    hideLoading(element) {
        if (element.loader) {
            element.loader.remove();
            element.loader = null;
        }
    }
    
    // 📋 إنشاء مدقق لنموذج
    createFormValidator(formSelector, schema) {
        const form = document.querySelector(formSelector);
        
        if (!form) {
            console.error('❌ النموذج غير موجود:', formSelector);
            return null;
        }
        
        // إضافة خاصية بيانات للنموذج
        form.dataset.validatorId = `form-${Date.now()}`;
        
        // إعداد التحقق في الوقت الحقيقي للحقول
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const fieldName = input.getAttribute('name');
            
            if (fieldName && schema[fieldName]) {
                this.setupRealTimeValidation(input, schema[fieldName]);
            }
        });
        
        // التحقق عند الإرسال
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // ⭐ إضافة مؤشر تحميل للنموذج
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn?.innerHTML;
            
            if (submitBtn) {
                submitBtn.innerHTML = '<div class="validation-loader"></div> جاري التحقق...';
                submitBtn.disabled = true;
            }
            
            const result = await this.validateForm(data, schema);
            
            if (result.isValid) {
                // ⭐ تسجيل النجاح في AdMob
                this.trackAdEvent('form_submission_success', {
                    formId: form.dataset.validatorId,
                    fields: Object.keys(data).length
                });
                
                // ⭐ عرض إعلان بعد النجاح
                if (this.adMobReady) {
                    const adElement = this.showAdInValidation('form_submission');
                    if (adElement && form.parentNode) {
                        setTimeout(() => {
                            form.parentNode.insertBefore(adElement, form.nextSibling);
                        }, 300);
                    }
                }
                
                // إشعار النجاح
                if (typeof window.showToast === 'function') {
                    window.showToast('✅ تم التحقق من النموذج بنجاح', 'success');
                }
                
                // إرسال النموذج بعد تأخير بسيط
                setTimeout(() => {
                    form.submit();
                }, 1000);
                
            } else {
                // ⭐ تسجيل الفشل في AdMob
                this.trackAdEvent('form_submission_failed', {
                    formId: form.dataset.validatorId,
                    errorCount: result.errorCount
                });
                
                // عرض الأخطاء
                this.displayFormErrors(form, result.errors);
                
                // إشعار بالفشل
                if (typeof window.showToast === 'function') {
                    window.showToast(`❌ يوجد ${result.errorCount} خطأ يجب تصحيحه`, 'error');
                }
            }
            
            // إعادة زر الإرسال
            if (submitBtn) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
        
        return {
            validate: () => {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                return this.validateForm(data, schema);
            },
            getData: () => {
                const formData = new FormData(form);
                return Object.fromEntries(formData.entries());
            },
            reset: () => {
                form.reset();
                this.clearFormErrors(form);
            },
            id: form.dataset.validatorId
        };
    }
    
    // 📊 عرض أخطاء النموذج
    displayFormErrors(form, errors) {
        // مسح الأخطاء السابقة
        this.clearFormErrors(form);
        
        // عرض كل الأخطاء
        for (const [field, fieldErrors] of Object.entries(errors)) {
            const input = form.querySelector(`[name="${field}"]`);
            
            if (input && fieldErrors.length > 0) {
                this.displayErrors(input, fieldErrors, 'error');
            }
        }
        
        // إظهار ملخص الأخطاء
        this.showValidationSummary(form, errors);
    }
    
    // 🧹 مسح أخطاء النموذج
    clearFormErrors(form) {
        const errorElements = form.querySelectorAll('.validation-message');
        errorElements.forEach(el => el.remove());
        
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('validation-error', 'validation-warning', 
                                  'validation-success', 'validation-info',
                                  'has-error', 'is-invalid', 'is-valid');
            input.style.borderColor = '';
        });
    }
    
    // 📋 عرض ملخص الأخطاء
    showValidationSummary(form, errors) {
        let summary = document.getElementById('validation-summary');
        
        if (!summary) {
            summary = document.createElement('div');
            summary.id = 'validation-summary';
            summary.style.cssText = `
                background: #FFF3E0;
                border: 2px solid #FF9800;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 25px;
                color: #E65100;
                font-family: 'Tajawal', sans-serif;
                animation: validationFadeIn 0.3s ease;
                box-shadow: 0 4px 15px rgba(255, 152, 0, 0.1);
            `;
            
            form.insertBefore(summary, form.firstChild);
        }
        
        const errorCount = Object.values(errors).flat().length;
        const fieldCount = Object.keys(errors).length;
        
        summary.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <i class="fas fa-exclamation-triangle" style="color: #FF9800; font-size: 1.5rem;"></i>
                <div>
                    <h4 style="margin: 0 0 5px 0; color: #E65100; font-weight: 700;">
                        يرجى تصحيح الأخطاء التالية
                    </h4>
                    <p style="margin: 0; opacity: 0.8; font-size: 0.9rem;">
                        ${errorCount} خطأ في ${fieldCount} حقل
                    </p>
                </div>
            </div>
            <div style="max-height: 200px; overflow-y: auto; padding-right: 10px;">
                <ul style="margin: 0; padding-right: 20px; list-style: none;">
                    ${Object.entries(errors).map(([field, fieldErrors]) => `
                        <li style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.5); border-radius: 6px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                <i class="fas fa-times-circle" style="color: #F44336; font-size: 0.9rem;"></i>
                                <strong style="font-size: 0.95rem;">${field}</strong>
                            </div>
                            <ul style="margin: 0; padding-right: 20px;">
                                ${fieldErrors.map(error => `
                                    <li style="font-size: 0.85rem; margin-bottom: 4px; color: #C62828;">
                                        ${error}
                                    </li>
                                `).join('')}
                            </ul>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255, 152, 0, 0.3);">
                <button onclick="this.parentElement.remove()" 
                        style="background: #FF9800; color: white; border: none; padding: 8px 20px; 
                               border-radius: 6px; cursor: pointer; font-family: 'Tajawal';">
                    <i class="fas fa-times"></i> إغلاق الملخص
                </button>
            </div>
        `;
        
        // ⭐ تسجيل حدث AdMob لملخص الأخطاء
        if (this.adMobReady) {
            this.trackAdEvent('validation_summary_shown', {
                errorCount: errorCount,
                fieldCount: fieldCount
            });
        }
        
        // إزالة الملخص بعد 15 ثانية أو بالنقر
        const removeSummary = () => {
            if (summary.parentNode) {
                summary.remove();
            }
        };
        
        summary.querySelector('button').onclick = removeSummary;
        
        setTimeout(removeSummary, 15000);
    }
    
    // 💾 حفظ في localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('validation_stats', JSON.stringify(this.validationStats));
            localStorage.setItem('validator_patterns', JSON.stringify(this.patterns));
        } catch (error) {
            console.warn('⚠️ فشل حفظ في localStorage:', error);
        }
    }
    
    // 📊 الحصول على إحصائيات التحقق
    getValidationStats() {
        const stats = {
            ...this.validationStats,
            successRate: this.validationStats.total > 0 
                ? Math.round((this.validationStats.successful / this.validationStats.total) * 100) 
                : 0,
            averageTime: 0,
            commonErrors: JSON.parse(localStorage.getItem('common_errors') || '[]')
        };
        
        return stats;
    }
    
    // 📊 الحصول على إحصائيات AdMob
    getAdMobStats() {
        try {
            const adStats = JSON.parse(localStorage.getItem('ad_validation_stats') || '{"events": [], "total": 0}');
            return {
                totalEvents: adStats.total,
                recentEvents: adStats.events.slice(-10),
                lastEvent: adStats.events[adStats.events.length - 1] || null
            };
        } catch (error) {
            return { totalEvents: 0, recentEvents: [], lastEvent: null };
        }
    }
    
    // 📝 تسجيل عملية التحقق
    logValidation(type, success, errors = []) {
        const count = parseInt(localStorage.getItem('validation_count') || '0') + 1;
        localStorage.setItem('validation_count', count.toString());
        
        if (!success) {
            const failed = parseInt(localStorage.getItem('failed_validations') || '0') + 1;
            localStorage.setItem('failed_validations', failed.toString());
            
            // حفظ الأخطاء الشائعة
            const commonErrors = JSON.parse(localStorage.getItem('common_errors') || '[]');
            
            errors.forEach(error => {
                const existing = commonErrors.find(e => e.error === error);
                
                if (existing) {
                    existing.count++;
                } else {
                    commonErrors.push({ error, count: 1 });
                }
            });
            
            // ترتيب حسب التكرار
            commonErrors.sort((a, b) => b.count - a.count);
            
            // الاحتفاظ بآخر 50 خطأ فقط
            if (commonErrors.length > 50) {
                commonErrors.splice(50);
            }
            
            localStorage.setItem('common_errors', JSON.stringify(commonErrors));
        }
    }
    
    // ⭐ تسجيل حدث في النظام
    logEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.log(`📝 حدث نظام التحقق: ${eventName}`, data);
    }
    
    // ⭐ إرسال حدث النظام
    dispatchSystemEvent(eventName, detail = {}) {
        const event = new CustomEvent(`agriculture:${eventName}`, {
            detail: {
                ...detail,
                timestamp: new Date().toISOString(),
                source: 'validatorsSystem'
            }
        });
        
        window.dispatchEvent(event);
    }
    
    // ====== الوظائف الاحتياطية ======
    
    fallbackTranslate(key, defaultValue = key) {
        const fallbackTranslations = {
            'crops.not_found': 'المحصول غير موجود',
            'crops.added_to_favorites': 'تم إضافة المحصول للمفضلة',
            'crops.removed_from_favorites': 'تم إزالة المحصول من المفضلة',
            'crops.back_to_list': 'العودة لقائمة المحاصيل',
            'common.error': 'حدث خطأ',
            'common.loading': 'جاري التحميل...'
        };
        
        return fallbackTranslations[key] || defaultValue;
    }
    
    getFallbackCrop(id) {
        const fallbackCrops = [
            { id: 1, name: 'طماطم', category: 'خضروات', season: 'صيفية' },
            { id: 2, name: 'خيار', category: 'خضروات', season: 'صيفية' },
            { id: 3, name: 'بطاطس', category: 'خضروات', season: 'شتوية' }
        ];
        
        return fallbackCrops.find(crop => crop.id === id) || fallbackCrops[0];
    }
    
    getFallbackDisease(id) {
        return {
            id,
            name: 'مرض تجريبي',
            description: 'وصف للمرض',
            symptoms: ['عرض 1', 'عرض 2'],
            prevention: ['وقاية 1', 'وقاية 2'],
            treatment: ['علاج 1', 'علاج 2']
        };
    }
    
    getFallbackCrops() {
        return [
            this.getFallbackCrop(1),
            this.getFallbackCrop(2),
            this.getFallbackCrop(3)
        ];
    }
    
    getFallbackDiseases() {
        return [
            this.getFallbackDisease(1),
            this.getFallbackDisease(2)
        ];
    }
    
    fallbackShowPage(page) {
        const pages = document.querySelectorAll('.page');
        pages.forEach(p => p.classList.remove('active'));
        
        const targetPage = document.getElementById(`${page}Page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // تحديث التنقل السفلي
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        
        const targetNav = document.querySelector(`.nav-item[data-nav="${page}"]`);
        if (targetNav) {
            targetNav.classList.add('active');
        }
    }
    
    fallbackToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            info: '#2196F3',
            warning: '#FF9800'
        };
        
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: ${colors[type] || '#2196F3'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: validationFadeIn 0.3s ease;
            max-width: 300px;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'validationFadeIn 0.3s ease reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// ====== التهيئة التلقائية عند تحميل الصفحة ======

document.addEventListener('DOMContentLoaded', function() {
    // تأخير بسيط لضمان تحميل الأنظمة الأساسية أولاً
    setTimeout(() => {
        if (!window.validatorsSystem) {
            window.validatorsSystem = new Validators();
            console.log('✅ نظام التحقق والتحقق من الصحة بدأ التحميل...');
        }
    }, 100);
});

// ====== واجهة مبسطة للاستخدام المباشر ======

window.validators = {
    // التحقق من قيمة
    validate: async function(value, rules) {
        if (window.validatorsSystem) {
            return await window.validatorsSystem.validate(value, rules);
        } else {
            console.error('❌ نظام التحقق غير مهيأ');
            return false;
        }
    },
    
    // التحقق من نموذج
    validateForm: async function(formData, schema) {
        if (window.validatorsSystem) {
            return await window.validatorsSystem.validateForm(formData, schema);
        }
        return { isValid: false, errors: {}, errorCount: 0 };
    },
    
    // التحقق من البريد
    validateEmail: async function(email) {
        if (window.validatorsSystem) {
            return await window.validatorsSystem.validateEmail(email);
        }
        return false;
    },
    
    // التحقق من الهاتف
    validatePhone: async function(phone) {
        if (window.validatorsSystem) {
            return await window.validatorsSystem.validatePhone(phone);
        }
        return false;
    },
    
    // التحقق من كلمة المرور
    validatePassword: async function(password) {
        if (window.validatorsSystem) {
            return await window.validatorsSystem.validatePassword(password);
        }
        return false;
    },
    
    // التحقق من تطابق كلمتي المرور
    validatePasswordMatch: async function(password, confirmPassword) {
        if (window.validatorsSystem) {
            return await window.validatorsSystem.validatePasswordMatch(password, confirmPassword);
        }
        return false;
    },
    
    // التحقق من بيانات المحصول
    validateCrop: async function(data) {
        if (window.validatorsSystem) {
            return await window.validatorsSystem.validateCropData(data);
        }
        return { isValid: false, errors: {}, errorCount: 0 };
    },
    
    // التحقق من بيانات التربة
    validateSoil: async function(data) {
        if (window.validatorsSystem) {
            return await window.validatorsSystem.validateSoilData(data);
        }
        return { isValid: false, errors: {}, errorCount: 0 };
    },
    
    // التحقق من بيانات المرض
    validateDisease: async function(data) {
        if (window.validatorsSystem) {
            return await window.validatorsSystem.validateDiseaseData(data);
        }
        return { isValid: false, errors: {}, errorCount: 0 };
    },
    
    // ⭐ التحقق من AdMob App ID
    validateAdMobAppId: async function(appId) {
        if (window.validatorsSystem) {
            return await window.validatorsSystem.validateAdMobAppId(appId);
        }
        return false;
    },
    
    // ⭐ التحقق من AdMob Ad Unit ID
    validateAdMobAdUnitId: async function(adUnitId, adType = 'banner') {
        if (window.validatorsSystem) {
            return await window.validatorsSystem.validateAdMobAdUnitId(adUnitId, adType);
        }
        return false;
    },
    
    // تحقق سريع
    isEmail: function(email) {
        if (window.validatorsSystem) {
            return window.validatorsSystem.isEmail(email);
        }
        return false;
    },
    
    isPhone: function(phone) {
        if (window.validatorsSystem) {
            return window.validatorsSystem.isPhone(phone);
        }
        return false;
    },
    
    isDate: function(date) {
        if (window.validatorsSystem) {
            return window.validatorsSystem.isDate(date);
        }
        return false;
    },
    
    isCropCode: function(code) {
        if (window.validatorsSystem) {
            return window.validatorsSystem.isCropCode(code);
        }
        return false;
    },
    
    isAdMobAppId: function(appId) {
        if (window.validatorsSystem) {
            return window.validatorsSystem.isAdMobAppId(appId);
        }
        return false;
    },
    
    isAdMobAdUnitId: function(adUnitId) {
        if (window.validatorsSystem) {
            return window.validatorsSystem.isAdMobAdUnitId(adUnitId);
        }
        return false;
    },
    
    // إنشاء مدقق للنموذج
    createFormValidator: function(formSelector, schema) {
        if (window.validatorsSystem) {
            return window.validatorsSystem.createFormValidator(formSelector, schema);
        }
        return null;
    },
    
    // الحصول على الإحصائيات
    getStats: function() {
        if (window.validatorsSystem) {
            return window.validatorsSystem.getValidationStats();
        }
        return { total: 0, successful: 0, failed: 0, successRate: 0 };
    },
    
    // ⭐ الحصول على إحصائيات AdMob
    getAdMobStats: function() {
        if (window.validatorsSystem) {
            return window.validatorsSystem.getAdMobStats();
        }
        return { totalEvents: 0, recentEvents: [] };
    },
    
    // ⭐ عرض إعلان التحقق
    showAd: function(context) {
        if (window.validatorsSystem) {
            return window.validatorsSystem.showAdInValidation(context);
        }
        return null;
    },
    
    // الحصول على النظام
    getSystem: function() {
        return window.validatorsSystem;
    }
};

// ====== رسالة بدء التشغيل ======
console.log(`
✅ **نظام التحقق والتحقق من الصحة - الإصدار 4.1**
📁 الموقع: js/utils/validators.js
✅ الحالة: مدمج مع هيكل المشروع بالكامل
✅ AdMob: متكامل بالكامل مع الإعلانات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 الاعتماديات الرئيسية:
• agricultureData - بيانات الزراعة
• app - نظام التطبيق الرئيسي  
• agricultureI18n - نظام الترجمة
• agricultureAI - الذكاء الاصطناعي
• pointsSystem - نظام النقاط
• AdMob - نظام الإعلانات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 أمثلة الاستخدام:
1. validators.validate(value, rules)
2. validators.validateForm(formData, schema)
3. validators.validateEmail('test@example.com')
4. validators.validateCrop(cropData)
5. validators.createFormValidator('#form', schema)
6. validators.validateAdMobAppId('ca-app-pub-...')
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 المميزات الجديدة:
• تكامل كامل مع AdMob
• تسجيل أحداث الإعلانات
• مدققين خاصين بمعرفات AdMob
• عرض إعلانات بعد التحقق الناجح
• إحصائيات مفصلة للإعلانات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 أحداث AdMob المسجلة:
• validation_success - نجاح التحقق
• form_submission_success - نجاح نموذج
• validation_error_displayed - عرض خطأ
• ad_click - نقر على إعلان
• ad_unit_validated - تحقق معرف إعلان
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تم التطوير ليتكامل مع:
• index.html - الواجهة الرئيسية
• js/main.js - الجسر الرئيسي
• js/data/ - البيانات الزراعية
• js/i18n.js - نظام الترجمة
• js/modules/ads.js - نظام الإعلانات
• js/modules/points.js - نظام النقاط
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
جميع الحقوق محفوظة © 2026 المرشد الزراعي الذكي
`);