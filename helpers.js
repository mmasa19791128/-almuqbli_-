// ====== نظام المساعدات والدوال المساعدة ======
// 🛠️ الإصدار 4.0 | يناير 2026
// 🔗 متكامل مع جميع أنظمة المشروع الزراعي

class Helpers {
    constructor() {
        this.cache = new Map();
        this.pausedTimers = [];
        this.pausedAnimations = [];
        this.pausedMedia = [];
        this.notificationQueue = [];
        this.activeNotifications = new Set();
        this.pageHiddenTime = null;
        this.lastScrollTop = 0;
        this.isLoadingMore = false;
        this.dataSyncInterval = null;
        this.dataRefreshInterval = null;
        this.init();
    }
    
    async init() {
        console.log('🛠️ نظام المساعدات الزراعي جاهز - الإصدار 4.0');
        
        // ⭐ ربط مع أنظمة المشروع
        this.setupProjectIntegration();
        
        // تحميل التكوين
        await this.loadConfig();
        
        // إعداد الأحداث
        this.setupEvents();
        
        // بدء الخدمات
        this.startServices();
        
        // تسجيل في نظام الإحصائيات
        this.logEvent('system_initialized');
    }
    
    // ⭐ ربط مع أنظمة المشروع
    setupProjectIntegration() {
        // ربط مع نظام النقاط
        if (window.pointsSystem) {
            this.pointsSystem = window.pointsSystem;
            console.log('✅ تم ربط نظام المساعدات مع نظام النقاط');
        }
        
        // ربط مع نظام التحقق
        if (window.validators) {
            this.validators = window.validators;
            console.log('✅ تم ربط نظام المساعدات مع نظام التحقق');
        }
        
        // ربط مع نظام الإعلانات
        if (window.adsManager) {
            this.adsManager = window.adsManager;
            console.log('✅ تم ربط نظام المساعدات مع نظام الإعلانات');
        }
        
        // ربط مع الجسر الرئيسي
        if (window.mainBridge) {
            this.mainBridge = window.mainBridge;
            window.mainBridge.helpers = this;
            console.log('✅ تم ربط نظام المساعدات مع الجسر الرئيسي');
        }
        
        // إعداد قاعدة البيانات المحلية
        this.setupDatabase();
        
        // حقن أنماط CSS
        this.injectHelperStyles();
    }
    
    // ⭐ إعداد قاعدة البيانات
    setupDatabase() {
        if ('indexedDB' in window) {
            this.dbName = 'agriculture-helpers';
            this.dbVersion = 1;
            this.setupIndexedDB();
        }
    }
    
    setupIndexedDB() {
        const request = indexedDB.open(this.dbName, this.dbVersion);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // مخزن للأحداث
            if (!db.objectStoreNames.contains('events')) {
                const store = db.createObjectStore('events', { 
                    keyPath: 'id',
                    autoIncrement: true 
                });
                store.createIndex('type', 'type', { unique: false });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
            
            // مخزن للتخزين المؤقت
            if (!db.objectStoreNames.contains('cache')) {
                db.createObjectStore('cache', { keyPath: 'key' });
            }
            
            // مخزن للإحصائيات
            if (!db.objectStoreNames.contains('stats')) {
                db.createObjectStore('stats', { keyPath: 'date' });
            }
        };
        
        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log('✅ قاعدة بيانات المساعدات جاهزة');
        };
        
        request.onerror = (event) => {
            console.error('❌ فشل فتح قاعدة بيانات:', event.target.error);
        };
    }
    
    // ⭐ حقن أنماط CSS
    injectHelperStyles() {
        if (document.getElementById('helper-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'helper-styles';
        style.textContent = `
            .helper-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 12px;
                box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 12px;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
                font-family: 'Tajawal', sans-serif;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
                transition: all 0.3s ease;
            }
            
            .helper-notification.info {
                background: linear-gradient(135deg, #2196F3, #1976D2);
                color: white;
            }
            
            .helper-notification.success {
                background: linear-gradient(135deg, #4CAF50, #2E7D32);
                color: white;
            }
            
            .helper-notification.warning {
                background: linear-gradient(135deg, #FF9800, #F57C00);
                color: white;
            }
            
            .helper-notification.error {
                background: linear-gradient(135deg, #F44336, #D32F2F);
                color: white;
            }
            
            .helper-notification.agriculture {
                background: linear-gradient(135deg, #8BC34A, #689F38);
                color: white;
                border-left: 4px solid #FFD700;
            }
            
            .helper-offline-notice {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                padding: 12px 20px;
                z-index: 10001;
                font-family: 'Tajawal', sans-serif;
                font-weight: bold;
                animation: slideDown 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                backdrop-filter: blur(10px);
            }
            
            .helper-back-to-top {
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #2E7D32, #1B5E20);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 6px 20px rgba(46, 125, 50, 0.3);
                z-index: 9999;
                display: none;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .helper-back-to-top:hover {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 0 8px 25px rgba(46, 125, 50, 0.4);
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes slideDown {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(-100%); opacity: 0; }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .helper-loading {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top: 3px solid #4CAF50;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .helper-tooltip {
                position: absolute;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                z-index: 10002;
                white-space: nowrap;
                animation: fadeIn 0.2s ease;
                pointer-events: none;
                font-family: 'Tajawal', sans-serif;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .device-desktop .mobile-only { display: none !important; }
            .device-tablet .mobile-only { display: none !important; }
            .device-mobile .desktop-only { display: none !important; }
        `;
        
        document.head.appendChild(style);
    }
    
    // ⚙️ تحميل التكوين
    async loadConfig() {
        try {
            const config = {
                appName: 'المرشد الزراعي الذكي',
                version: '6.0.0',
                environment: this.getEnvironment(),
                features: {
                    offline: true,
                    pwa: true,
                    ads: true,
                    ai: true,
                    search: true,
                    validation: true,
                    points: true,
                    calendar: true
                },
                // ⭐ إعدادات زراعية
                agriculture: {
                    seasons: ['شتوي', 'صيفي', 'ربيعي', 'خريفي', 'دائم'],
                    cropCategories: ['حبوب', 'خضروات', 'فواكه', 'أشجار', 'نخيل', 'زيتون'],
                    soilTypes: ['طينية', 'رملية', 'سلتية', 'طينية رملية', 'كلسية', 'ملحية'],
                    irrigationMethods: ['تنقيط', 'رشاشي', 'سطحي', 'تحت السطحي']
                }
            };
            
            this.config = config;
            console.log('✅ تم تحميل التكوين الزراعي:', config);
            
        } catch (error) {
            console.warn('⚠️ فشل تحميل التكوين:', error);
            this.config = this.getDefaultConfig();
        }
    }
    
    // 🏭 الحصول على البيئة
    getEnvironment() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'development';
        }
        
        if (window.location.hostname.includes('test') || window.location.hostname.includes('staging')) {
            return 'staging';
        }
        
        return 'production';
    }
    
    // ⚙️ التكوين الافتراضي
    getDefaultConfig() {
        return {
            appName: 'المرشد الزراعي الذكي',
            version: '6.0.0',
            environment: 'production',
            features: {
                offline: true,
                pwa: true,
                ads: true,
                ai: true,
                search: true,
                validation: true,
                points: true,
                calendar: true
            },
            agriculture: {
                seasons: ['شتوي', 'صيفي', 'ربيعي', 'خريفي', 'دائم'],
                cropCategories: ['حبوب', 'خضروات', 'فواكه', 'أشجار'],
                soilTypes: ['طينية', 'رملية', 'سلتية'],
                irrigationMethods: ['تنقيط', 'رشاشي', 'سطحي']
            }
        };
    }
    
    // ⭐ بدء الخدمات
    startServices() {
        // خدمة تنظيف الذاكرة المؤقتة
        this.startCacheCleanup();
        
        // خدمة مزامنة البيانات
        this.startDataSync();
        
        // خدمة مراقبة الأداء
        this.startPerformanceMonitor();
        
        // خدمة الإشعارات المجدولة
        this.startNotificationScheduler();
        
        // خدمة تحديث البيانات
        this.startDataRefresh();
    }
    
    // 🎧 إعداد الأحداث
    setupEvents() {
        // حدث الاتصال/انقطاع الاتصال
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // حدث الرؤية
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // حدث التمرير (باستخدام throttling)
        window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 100), { passive: true });
        
        // حدث تغيير الحجم (باستخدام debouncing)
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
        
        // حدث قبل إغلاق الصفحة
        window.addEventListener('beforeunload', (e) => this.handleBeforeUnload(e));
        
        // حدث تحميل الصفحة
        window.addEventListener('load', () => this.handlePageLoad());
        
        // ⭐ أحداث زراعية مخصصة
        document.addEventListener('cropSelected', (e) => this.handleCropSelected(e));
        document.addEventListener('diseaseDetected', (e) => this.handleDiseaseDetected(e));
        document.addEventListener('irrigationCalculated', (e) => this.handleIrrigationCalculated(e));
    }
    
    // 🌐 التعامل مع الاتصال (مُحسّن)
    handleOnline() {
        console.log('🌐 تم استعادة الاتصال بالإنترنت');
        
        // إضافة نقاط للاتصال
        if (this.pointsSystem) {
            this.pointsSystem.addPoints('reconnect', 2);
        }
        
        // مزامنة البيانات
        this.syncData().then(() => {
            // إشعار النجاح
            this.showNotification('تم استعادة الاتصال ومزامنة البيانات بنجاح', 'success', 3000);
        }).catch(error => {
            console.error('❌ فشل المزامنة:', error);
            this.showNotification('تم استعادة الاتصال ولكن فشل المزامنة', 'warning', 3000);
        });
        
        // إخفاء إشعار عدم الاتصال
        this.hideOfflineNotification();
        
        // تسجيل الحدث
        this.logEvent('connection_restored', { 
            timestamp: new Date().toISOString(),
            duration: this.calculateOfflineDuration()
        });
    }
    
    handleOffline() {
        console.log('📶 فقدان الاتصال بالإنترنت');
        
        // إظهار إشعار عدم الاتصال
        this.showOfflineNotification();
        
        // حفظ حالة عدم الاتصال
        this.saveOfflineData();
        
        // تسجيل الحدث
        this.logEvent('connection_lost', { 
            timestamp: new Date().toISOString() 
        });
        
        // ⭐ إشعار زراعي
        this.showNotification('📶 أنت الآن تعمل بدون اتصال. البيانات المحلية متاحة.', 'agriculture', 4000);
    }
    
    // ⭐ حساب مدة عدم الاتصال
    calculateOfflineDuration() {
        const offlineStart = localStorage.getItem('offline_start');
        if (offlineStart) {
            const duration = Date.now() - parseInt(offlineStart);
            return Math.round(duration / 1000); // بالثواني
        }
        return 0;
    }
    
    // 👁️ التعامل مع تغيير الرؤية (مُحسّن)
    handleVisibilityChange() {
        if (document.hidden) {
            console.log('👁️ الصفحة أصبحت مخفية');
            this.onPageHidden();
        } else {
            console.log('👁️ الصفحة أصبحت مرئية');
            this.onPageVisible();
        }
    }
    
    onPageHidden() {
        // حفظ حالة التطبيق
        this.saveAppState();
        
        // إيقاف الأنشطة غير الضرورية
        this.pauseNonEssentialTasks();
        
        // تسجيل وقت الخفاء
        this.pageHiddenTime = Date.now();
        
        // إرسال حدث للتحليلات
        this.dispatchEvent('page_hidden', { timestamp: new Date().toISOString() });
    }
    
    onPageVisible() {
        // حساب مدة الاختفاء
        const hiddenDuration = this.pageHiddenTime ? Date.now() - this.pageHiddenTime : 0;
        
        // استئناف الأنشطة
        this.resumeTasks();
        
        // التحقق من التحديثات
        this.checkForUpdates();
        
        // إرسال حدث للتحليلات
        this.dispatchEvent('page_visible', { 
            timestamp: new Date().toISOString(),
            hiddenDuration 
        });
        
        // ⭐ إضافة نقاط للعودة
        if (hiddenDuration > 30000 && this.pointsSystem) { // أكثر من 30 ثانية
            this.pointsSystem.addPoints('return_to_app', 1);
        }
    }
    
    // 🖱️ التعامل مع التمرير (مُحسّن)
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        // إرسال حدث التمرير
        this.dispatchEvent('scroll', { 
            position: scrollTop, 
            percentage: Math.round(scrollPercentage),
            direction: this.getScrollDirection()
        });
        
        // إظهار/إخفاء زر العودة للأعلى
        this.toggleBackToTop(scrollPercentage > 20);
        
        // ⭐ تحميل المحتوى التدريجي
        if (scrollPercentage > 70 && !this.isLoadingMore) {
            this.loadMoreContent();
        }
    }
    
    // ⭐ الحصول على اتجاه التمرير
    getScrollDirection() {
        if (!this.lastScrollTop) {
            this.lastScrollTop = window.pageYOffset;
            return 'none';
        }
        
        const direction = window.pageYOffset > this.lastScrollTop ? 'down' : 'up';
        this.lastScrollTop = window.pageYOffset;
        
        return direction;
    }
    
    // ⭐ تحميل المزيد من المحتوى
    loadMoreContent() {
        this.isLoadingMore = true;
        
        // البحث عن محتوى يمكن تحميله
        const loadableSections = document.querySelectorAll('[data-load-more]');
        
        loadableSections.forEach(section => {
            const loaded = section.dataset.loaded === 'true';
            
            if (!loaded && this.isElementInViewport(section)) {
                this.dispatchEvent('load_more_content', { 
                    section: section.id,
                    timestamp: Date.now() 
                });
                
                section.dataset.loaded = 'true';
            }
        });
        
        setTimeout(() => {
            this.isLoadingMore = false;
        }, 1000);
    }
    
    // 📏 التعامل مع تغيير الحجم (مُحسّن)
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isMobile = width <= 768;
        const isTablet = width > 768 && width <= 1024;
        const orientation = width > height ? 'landscape' : 'portrait';
        
        // تحديث فئات الجهاز
        this.updateDeviceClasses(isMobile, isTablet, width);
        
        // إرسال حدث تغيير الحجم
        this.dispatchEvent('resize', { 
            width, 
            height, 
            isMobile,
            isTablet,
            orientation,
            pixelRatio: window.devicePixelRatio
        });
        
        // ⭐ إعادة حساب التخطيطات الديناميكية
        this.recalculateLayouts();
    }
    
    // 🚪 التعامل مع إغلاق الصفحة (مُحسّن)
    handleBeforeUnload(e) {
        // حفظ بيانات الجلسة
        this.saveSessionData();
        
        // حفظ التفضيلات
        this.saveUserPreferences();
        
        // إرسال بيانات الاستخدام
        this.sendUsageAnalytics();
        
        // التحقق من التغييرات غير المحفوظة
        if (this.hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = '⚠️ لديك تغييرات غير محفوظة. هل تريد حقاً المغادرة؟';
        }
    }
    
    // ⭐ تحميل الصفحة
    handlePageLoad() {
        console.log('📄 تم تحميل الصفحة بالكامل');
        
        // إضافة نقاط لتحميل الصفحة
        if (this.pointsSystem) {
            this.pointsSystem.addPoints('page_load', 1);
        }
        
        // إرسال حدث تحميل الصفحة
        this.dispatchEvent('page_loaded', {
            loadTime: performance.now(),
            timestamp: new Date().toISOString()
        });
        
        // ⭐ عرض نصائح زراعية
        this.showAgricultureTips();
    }
    
    // ⭐ التعامل مع أحداث زراعية
    handleCropSelected(event) {
        const crop = event.detail;
        console.log('🌱 تم اختيار محصول:', crop.name);
        
        // تسجيل في الإحصائيات
        this.logEvent('crop_selected', crop);
        
        // إضافة نقاط
        if (this.pointsSystem) {
            this.pointsSystem.addPoints('crop_selection', 3);
        }
        
        // إشعار زراعي
        this.showNotification(`🌱 تم اختيار ${crop.name} - تحقق من معلومات الزراعة`, 'agriculture', 3000);
    }
    
    handleDiseaseDetected(event) {
        const disease = event.detail;
        console.log('🦠 تم اكتشاف مرض:', disease.name);
        
        // تسجيل في الإحصائيات
        this.logEvent('disease_detected', disease);
        
        // إضافة نقاط
        if (this.pointsSystem) {
            this.pointsSystem.addPoints('disease_detection', 5);
        }
    }
    
    handleIrrigationCalculated(event) {
        const data = event.detail;
        console.log('💧 تم حساب الري:', data);
        
        // تسجيل في الإحصائيات
        this.logEvent('irrigation_calculated', data);
        
        // إضافة نقاط
        if (this.pointsSystem) {
            this.pointsSystem.addPoints('irrigation_calculation', 2);
        }
    }
    
    // 🔄 مزامنة البيانات (مُحسّن)
    async syncData() {
        if (!navigator.onLine) {
            console.log('📶 لا يمكن المزامنة - غير متصل');
            return;
        }
        
        try {
            console.log('🔄 جاري مزامنة البيانات الزراعية...');
            
            const syncPromises = [
                this.syncPoints(),
                this.syncStats(),
                this.syncFavorites(),
                this.syncCropsData(),
                this.syncUserData()
            ];
            
            await Promise.all(syncPromises);
            
            console.log('✅ تمت مزامنة جميع البيانات');
            
            // إرسال حدث نجاح المزامنة
            this.dispatchEvent('sync_completed', {
                timestamp: new Date().toISOString(),
                itemsSynced: syncPromises.length
            });
            
        } catch (error) {
            console.error('❌ فشل مزامنة البيانات:', error);
            throw error;
        }
    }
    
    // 💾 حفظ بيانات عدم الاتصال
    saveOfflineData() {
        localStorage.setItem('offline_start', Date.now().toString());
        
        const offlineData = {
            timestamp: Date.now(),
            lastOnline: new Date().toISOString(),
            unsyncedData: this.collectUnsyncedData(),
            appState: this.getCurrentAppState()
        };
        
        localStorage.setItem('offline_data', JSON.stringify(offlineData));
        console.log('💾 تم حفظ بيانات عدم الاتصال');
        
        // حفظ في IndexedDB
        this.saveToDatabase('offline_sessions', offlineData);
    }
    
    // 📦 جمع البيانات غير المزامنة
    collectUnsyncedData() {
        const unsynced = {
            points: localStorage.getItem('unsynced_points') || '0',
            activities: JSON.parse(localStorage.getItem('unsynced_activities') || '[]'),
            searches: JSON.parse(localStorage.getItem('unsynced_searches') || '[]'),
            crops: JSON.parse(localStorage.getItem('unsynced_crops') || '[]'),
            diseases: JSON.parse(localStorage.getItem('unsynced_diseases') || '[]')
        };
        
        return unsynced;
    }
    
    // ⭐ الحصول على حالة التطبيق الحالية
    getCurrentAppState() {
        return {
            currentPage: window.location.hash || 'home',
            theme: localStorage.getItem('theme') || 'light',
            language: localStorage.getItem('language') || 'ar',
            points: localStorage.getItem('userPoints') || '0',
            lastAction: Date.now()
        };
    }
    
    // 💾 حفظ حالة التطبيق
    saveAppState() {
        const appState = {
            ...this.getCurrentAppState(),
            scrollPosition: window.pageYOffset,
            activeForm: document.querySelector('form:focus')?.id,
            timestamp: Date.now()
        };
        
        localStorage.setItem('app_state', JSON.stringify(appState));
        
        // حفظ في IndexedDB
        this.saveToDatabase('app_states', appState);
    }
    
    // ⏸️ إيقاف المهام غير الضرورية (مُحسّن)
    pauseNonEssentialTasks() {
        console.log('⏸️ إيقاف المهام غير الضرورية');
        
        // إيقاف المؤقتات
        this.pausedTimers = [];
        
        // إيقاف الرسوم المتحركة
        document.querySelectorAll('.animated, .lottie-animation').forEach(el => {
            if (el.style.animationPlayState !== 'paused') {
                el.style.animationPlayState = 'paused';
                this.pausedAnimations.push(el);
            }
        });
        
        // إيقاف الفيديوهات
        document.querySelectorAll('video, audio').forEach(media => {
            if (!media.paused) {
                media.pause();
                this.pausedMedia.push(media);
            }
        });
        
        // إيقاف تحديث البيانات
        clearInterval(this.dataRefreshInterval);
    }
    
    // ▶️ استئناف المهام (مُحسّن)
    resumeTasks() {
        console.log('▶️ استئناف المهام');
        
        // استئناف الرسوم المتحركة
        this.pausedAnimations?.forEach(el => {
            el.style.animationPlayState = 'running';
        });
        
        // استئناف الوسائط
        this.pausedMedia?.forEach(media => {
            media.play().catch(() => {}); // تجاهل الأخطاء
        });
        
        // تنظيف المصفوفات
        this.pausedAnimations = [];
        this.pausedMedia = [];
        
        // استئناف تحديث البيانات
        this.startDataRefresh();
    }
    
    // 🔍 التحقق من التحديثات (مُحسّن)
    async checkForUpdates() {
        if (!navigator.onLine) {
            console.log('📶 لا يمكن التحقق من التحديثات - غير متصل');
            return;
        }
        
        try {
            const response = await fetch('/version.json', { 
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache' }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const latest = await response.json();
            const current = this.config.version;
            
            const comparison = this.compareVersions(latest.version, current);
            
            if (comparison > 0) {
                console.log('🔄 تحديث متوفر:', latest.version);
                
                this.dispatchEvent('updateAvailable', { 
                    current, 
                    latest: latest.version,
                    changes: latest.changes || []
                });
                
                // ⭐ إشعار بالمستخدم
                this.showUpdateNotification(latest);
            } else if (comparison < 0) {
                console.log('⚠️ إصدار تجريبي:', current);
            } else {
                console.log('✅ التطبيق محدث:', current);
            }
            
        } catch (error) {
            console.warn('⚠️ فشل التحقق من التحديثات:', error);
        }
    }
    
    // ⭐ عرض إشعار التحديث
    showUpdateNotification(updateInfo) {
        this.showNotification(
            `🔄 تحديث متوفر ${updateInfo.version}`,
            'info',
            5000
        );
        
        // إضافة زر التحديث
        setTimeout(() => {
            if (confirm(`تحديث جديد ${updateInfo.version}\n${updateInfo.description || ''}\nتحديث الآن؟`)) {
                if (window.location.reload) {
                    window.location.reload();
                }
            }
        }, 2000);
    }
    
    // 🔄 مقارنة الإصدارات
    compareVersions(v1, v2) {
        const normalize = v => v.replace(/[^\d.]/g, '').split('.').map(Number);
        const parts1 = normalize(v1);
        const parts2 = normalize(v2);
        
        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;
            
            if (part1 > part2) return 1;
            if (part1 < part2) return -1;
        }
        
        return 0;
    }
    
    // ⬆️ تبديل زر العودة للأعلى
    toggleBackToTop(show) {
        let button = document.getElementById('helper-back-to-top');
        
        if (!button && show) {
            button = this.createBackToTopButton();
        }
        
        if (button) {
            if (show) {
                button.style.display = 'flex';
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
                setTimeout(() => {
                    if (button.classList.contains('visible')) return;
                    button.style.display = 'none';
                }, 300);
            }
        }
    }
    
    // 🏗️ إنشاء زر العودة للأعلى (مُحسّن)
    createBackToTopButton() {
        const button = document.createElement('button');
        button.id = 'helper-back-to-top';
        button.className = 'helper-back-to-top';
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        button.title = 'العودة للأعلى';
        button.setAttribute('aria-label', 'العودة إلى أعلى الصفحة');
        
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            button.style.animation = 'pulse 0.5s ease';
            setTimeout(() => button.style.animation = '', 500);
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1) rotate(0deg)';
        });
        
        document.body.appendChild(button);
        return button;
    }
    
    // 📱 تحديث فئات الجهاز
    updateDeviceClasses(isMobile, isTablet, width) {
        // إزالة الفئات القديمة
        document.body.classList.remove('device-desktop', 'device-tablet', 'device-mobile');
        document.body.classList.remove('screen-small', 'screen-medium', 'screen-large', 'screen-xlarge');
        
        // إضافة فئة الجهاز
        if (isMobile) {
            document.body.classList.add('device-mobile');
        } else if (isTablet) {
            document.body.classList.add('device-tablet');
        } else {
            document.body.classList.add('device-desktop');
        }
        
        // إضافة فئة حجم الشاشة
        if (width <= 480) {
            document.body.classList.add('screen-small');
        } else if (width <= 768) {
            document.body.classList.add('screen-medium');
        } else if (width <= 1200) {
            document.body.classList.add('screen-large');
        } else {
            document.body.classList.add('screen-xlarge');
        }
        
        // ⭐ إرسال حدث تغيير الجهاز
        this.dispatchEvent('device_changed', {
            isMobile,
            isTablet,
            width,
            deviceType: this.getDeviceType()
        });
    }
    
    // ⭐ إعادة حساب التخطيطات
    recalculateLayouts() {
        // تحديث خرائط المحاصيل إذا كانت موجودة
        const cropMaps = document.querySelectorAll('.crop-map-container');
        cropMaps.forEach(map => {
            if (typeof map.updateLayout === 'function') {
                map.updateLayout();
            }
        });
        
        // تحديث الجداول المتجاوبة
        const responsiveTables = document.querySelectorAll('.responsive-table');
        responsiveTables.forEach(table => {
            this.makeTableResponsive(table);
        });
    }
    
    // 💾 حفظ بيانات الجلسة (مُحسّن)
    saveSessionData() {
        const sessionStart = parseInt(sessionStorage.getItem('session_start') || Date.now());
        const sessionDuration = Date.now() - sessionStart;
        
        const sessionData = {
            id: this.generateId(),
            startTime: sessionStart,
            endTime: Date.now(),
            duration: sessionDuration,
            pagesVisited: JSON.parse(sessionStorage.getItem('pages_visited') || '[]'),
            actions: JSON.parse(sessionStorage.getItem('session_actions') || '[]'),
            device: this.getDeviceType(),
            language: this.getLanguage(),
            online: navigator.onLine
        };
        
        // حفظ في localStorage للإحصائيات
        const sessions = JSON.parse(localStorage.getItem('user_sessions') || '[]');
        sessions.push(sessionData);
        
        // الاحتفاظ بآخر 50 جلسة فقط
        if (sessions.length > 50) {
            sessions.splice(0, sessions.length - 50);
        }
        
        localStorage.setItem('user_sessions', JSON.stringify(sessions));
        
        // حفظ في IndexedDB
        this.saveToDatabase('sessions', sessionData);
        
        // مسح sessionStorage
        sessionStorage.clear();
        
        // ⭐ إضافة نقاط لإنهاء الجلسة
        if (sessionDuration > 60000 && this.pointsSystem) { // أكثر من دقيقة
            const points = Math.floor(sessionDuration / 60000); // نقطة لكل دقيقة
            this.pointsSystem.addPoints('session_completed', Math.min(points, 10));
        }
    }
    
    // ⭐ حفظ تفضيلات المستخدم
    saveUserPreferences() {
        const preferences = {
            theme: localStorage.getItem('theme'),
            language: localStorage.getItem('language'),
            notifications: localStorage.getItem('notifications_enabled') === 'true',
            fontSize: localStorage.getItem('font_size') || 'medium',
            autoSave: localStorage.getItem('auto_save') === 'true',
            agriculturalUnits: localStorage.getItem('agricultural_units') || 'metric',
            savedCrops: JSON.parse(localStorage.getItem('saved_crops') || '[]'),
            savedDiseases: JSON.parse(localStorage.getItem('saved_diseases') || '[]'),
            timestamp: Date.now()
        };
        
        localStorage.setItem('user_preferences', JSON.stringify(preferences));
        this.saveToDatabase('preferences', preferences);
    }
    
    // ⭐ إرسال بيانات الاستخدام
    sendUsageAnalytics() {
        if (!navigator.onLine) return;
        
        const analyticsData = {
            sessionId: sessionStorage.getItem('session_id'),
            actions: JSON.parse(sessionStorage.getItem('analytics_actions') || '[]'),
            errors: JSON.parse(sessionStorage.getItem('analytics_errors') || '[]'),
            timestamp: Date.now()
        };
        
        // هنا سيتم إرسال البيانات للخادم
        console.log('📊 بيانات الاستخدام:', analyticsData);
        
        // مسح البيانات المؤقتة
        sessionStorage.removeItem('analytics_actions');
        sessionStorage.removeItem('analytics_errors');
    }
    
    // 📝 التحقق من التغييرات غير المحفوظة
    hasUnsavedChanges() {
        const hasChanges = 
            localStorage.getItem('has_unsaved_changes') === 'true' ||
            sessionStorage.getItem('draft_crop') !== null ||
            sessionStorage.getItem('draft_disease') !== null ||
            sessionStorage.getItem('draft_irrigation') !== null;
        
        return hasChanges;
    }
    
    // ⭐ عرض نصائح زراعية
    showAgricultureTips() {
        // عرض نصائح عشوائية كل 5 دقائق
        const lastTip = localStorage.getItem('last_agriculture_tip');
        const now = Date.now();
        
        if (!lastTip || now - parseInt(lastTip) > 300000) { // 5 دقائق
            const tips = [
                "💧 تذكر ري المحاصيل في الصباح الباكر أو المساء لتقليل تبخر المياه",
                "🌱 اختبار التربة قبل الزراعة يضمن اختيار المحصول المناسب",
                "🔄 تناوب المحاصيل يحسن خصوبة التربة ويقلل الأمراض",
                "🐝 النحل يساعد في تلقيح المحاصيل وزيادة الإنتاج",
                "🌾 استخدام الأسمدة العضوية يحسن بنية التربة على المدى الطويل",
                "🔍 فحص النباتات بانتظام يساعد في الاكتشاف المبكر للأمراض",
                "💚 الزراعة المائية توفر 90% من المياه مقارنة بالزراعة التقليدية"
            ];
            
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            this.showNotification(randomTip, 'agriculture', 6000);
            
            localStorage.setItem('last_agriculture_tip', now.toString());
        }
    }
    
    // 📨 إرسال حدث
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
        
        // تسجيل الحدث
        this.logEvent(eventName, data);
        
        // ⭐ إضافة إلى تحليلات الجلسة
        if (eventName.startsWith('user_') || eventName.includes('click') || eventName.includes('select')) {
            this.addToSessionAnalytics(eventName, data);
        }
    }
    
    // ⭐ إضافة إلى تحليلات الجلسة
    addToSessionAnalytics(action, data) {
        const actions = JSON.parse(sessionStorage.getItem('analytics_actions') || '[]');
        actions.push({
            action,
            data: typeof data === 'object' ? JSON.stringify(data) : data,
            timestamp: Date.now()
        });
        
        // الاحتفاظ بآخر 100 إجراء
        if (actions.length > 100) {
            actions.splice(0, actions.length - 100);
        }
        
        sessionStorage.setItem('analytics_actions', JSON.stringify(actions));
    }
    
    // 📝 تسجيل الأحداث (مُحسّن)
    logEvent(eventName, data) {
        const logEntry = {
            id: this.generateId(),
            timestamp: Date.now(),
            isoTime: new Date().toISOString(),
            event: eventName,
            data: typeof data === 'object' ? JSON.stringify(data) : data,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: this.getLanguage(),
            online: navigator.onLine,
            url: window.location.href,
            referrer: document.referrer
        };
        
        // حفظ في localStorage
        const logs = JSON.parse(localStorage.getItem('event_logs') || '[]');
        logs.push(logEntry);
        
        if (logs.length > 1000) {
            logs.splice(0, logs.length - 1000);
        }
        
        localStorage.setItem('event_logs', JSON.stringify(logs));
        
        // حفظ في IndexedDB
        this.saveToDatabase('events', logEntry);
        
        // إرسال للخادم إذا كان متصلاً
        if (navigator.onLine && window.analyticsAPI) {
            this.sendToAnalytics(logEntry);
        }
        
        return logEntry.id;
    }
    
    // 🔔 عرض إشعار (مُحسّن)
    showNotification(message, type = 'info', duration = 4000) {
        // التحقق من نوع الإشعار
        const validTypes = ['info', 'success', 'warning', 'error', 'agriculture'];
        const notificationType = validTypes.includes(type) ? type : 'info';
        
        // إنشاء معرف فريد للإشعار
        const notificationId = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // التحقق إذا كان هناك إشعارات كثيرة
        if (this.activeNotifications.size >= 3) {
            this.notificationQueue.push({ message, type: notificationType, duration, id: notificationId });
            return notificationId;
        }
        
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `helper-notification ${notificationType}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        const icon = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-exclamation-circle',
            agriculture: 'fa-seedling'
        }[notificationType];
        
        notification.innerHTML = `
            <i class="fas ${icon}" style="font-size: 1.3rem;"></i>
            <span style="flex: 1; line-height: 1.4;">${message}</span>
            <button class="notification-close" aria-label="إغلاق الإشعار" style="
                background: none;
                border: none;
                color: inherit;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0 5px;
                opacity: 0.7;
                transition: opacity 0.2s;
            ">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        this.activeNotifications.add(notificationId);
        
        // إضافة حدث الإغلاق
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notificationId);
        });
        
        // إخفاء تلقائي
        if (duration > 0) {
            setTimeout(() => {
                this.hideNotification(notificationId);
            }, duration);
        }
        
        // تسجيل الحدث
        this.logEvent('notification_shown', { 
            type: notificationType, 
            message, 
            duration 
        });
        
        return notificationId;
    }
    
    // 🙈 إخفاء الإشعار
    hideNotification(notificationId) {
        const notification = document.getElementById(notificationId);
        if (!notification) return;
        
        notification.style.animation = 'slideOutRight 0.3s ease';
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
                this.activeNotifications.delete(notificationId);
                
                // عرض الإشعار التالي في الطابور
                if (this.notificationQueue.length > 0) {
                    const next = this.notificationQueue.shift();
                    setTimeout(() => {
                        this.showNotification(next.message, next.type, next.duration);
                    }, 300);
                }
            }
        }, 300);
    }
    
    // 📶 إظهار إشعار عدم الاتصال (مُحسّن)
    showOfflineNotification() {
        let notice = document.getElementById('helper-offline-notice');
        
        if (!notice) {
            notice = document.createElement('div');
            notice.id = 'helper-offline-notice';
            notice.className = 'helper-offline-notice';
            notice.setAttribute('role', 'alert');
            notice.setAttribute('aria-live', 'assertive');
            
            notice.innerHTML = `
                <i class="fas fa-wifi-slash" style="color: #FF9800; font-size: 1.2rem;"></i>
                <span>أنت تعمل بدون اتصال بالإنترنت. بعض الميزات قد تكون محدودة.</span>
                <button onclick="window.helpers.hideOfflineNotice()" style="
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: inherit;
                    padding: 4px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: auto;
                    font-size: 0.9rem;
                ">
                    إخفاء
                </button>
            `;
            
            notice.style.background = 'linear-gradient(135deg, #FFF3E0, #FFECB3)';
            notice.style.color = '#E65100';
            notice.style.borderBottom = '2px solid #FF9800';
            
            document.body.appendChild(notice);
            
            // إضافة نقاط للعمل بدون اتصال
            if (this.pointsSystem) {
                this.pointsSystem.addPoints('offline_mode', 2);
            }
        }
    }
    
    // 📶 إخفاء إشعار عدم الاتصال
    hideOfflineNotification() {
        const notice = document.getElementById('helper-offline-notice');
        if (notice) {
            notice.style.animation = 'slideUp 0.3s ease';
            
            setTimeout(() => {
                if (document.body.contains(notice)) {
                    document.body.removeChild(notice);
                }
            }, 300);
        }
    }
    
    // 💰 مزامنة النقاط (مُحسّن)
    async syncPoints() {
        const unsyncedPoints = parseInt(localStorage.getItem('unsynced_points') || '0');
        
        if (unsyncedPoints > 0) {
            console.log('💰 مزامنة النقاط:', unsyncedPoints);
            
            // محاكاة إرسال النقاط للخادم
            await this.delay(500);
            
            // مسح البيانات غير المزامنة
            localStorage.removeItem('unsynced_points');
            
            // تسجيل النجاح
            this.logEvent('points_synced', { points: unsyncedPoints });
            
            return true;
        }
        
        return false;
    }
    
    // 📊 مزامنة الإحصائيات (مُحسّن)
    async syncStats() {
        const unsyncedStats = JSON.parse(localStorage.getItem('unsynced_stats') || '[]');
        
        if (unsyncedStats.length > 0) {
            console.log('📊 مزامنة الإحصائيات:', unsyncedStats.length);
            
            // محاكاة إرسال الإحصائيات
            await this.delay(300);
            
            localStorage.setItem('unsynced_stats', '[]');
            
            this.logEvent('stats_synced', { count: unsyncedStats.length });
            
            return true;
        }
        
        return false;
    }
    
    // ⭐ مزامنة بيانات المحاصيل
    async syncCropsData() {
        const unsyncedCrops = JSON.parse(localStorage.getItem('unsynced_crops') || '[]');
        
        if (unsyncedCrops.length > 0) {
            console.log('🌱 مزامنة بيانات المحاصيل:', unsyncedCrops.length);
            
            // محاكاة الإرسال
            await this.delay(800);
            
            localStorage.setItem('unsynced_crops', '[]');
            
            this.logEvent('crops_synced', { count: unsyncedCrops.length });
            
            return true;
        }
        
        return false;
    }
    
    // ⭐ مزامنة بيانات المستخدم
    async syncUserData() {
        const userData = {
            preferences: JSON.parse(localStorage.getItem('user_preferences') || '{}'),
            savedItems: {
                crops: JSON.parse(localStorage.getItem('saved_crops') || '[]'),
                diseases: JSON.parse(localStorage.getItem('saved_diseases') || '[]'),
                articles: JSON.parse(localStorage.getItem('saved_articles') || '[]')
            }
        };
        
        // محاكاة الإرسال
        await this.delay(400);
        
        this.logEvent('user_data_synced', {
            hasPreferences: !!userData.preferences,
            savedCount: Object.values(userData.savedItems).flat().length
        });
        
        return true;
    }
    
    // ⭐ مزامنة المفضلة
    async syncFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorite_crops') || '[]');
        
        if (favorites.length > 0) {
            console.log('⭐ مزامنة المفضلة:', favorites.length);
            
            await this.delay(600);
            
            this.logEvent('favorites_synced', { count: favorites.length });
            
            return true;
        }
        
        return false;
    }
    
    // ⭐ بدء خدمة تنظيف الذاكرة المؤقتة
    startCacheCleanup() {
        setInterval(() => {
            this.cleanupCache();
        }, 5 * 60 * 1000); // كل 5 دقائق
    }
    
    // ⭐ تنظيف الذاكرة المؤقتة
    cleanupCache() {
        const now = Date.now();
        const cacheTTL = 30 * 60 * 1000; // 30 دقيقة
        
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > cacheTTL) {
                this.cache.delete(key);
            }
        }
        
        console.log('🧹 تم تنظيف الذاكرة المؤقتة');
    }
    
    // ⭐ بدء خدمة مزامنة البيانات
    startDataSync() {
        this.dataSyncInterval = setInterval(() => {
            if (navigator.onLine) {
                this.syncData().catch(console.error);
            }
        }, 2 * 60 * 1000); // كل دقيقتين
    }
    
    // ⭐ بدء خدمة مراقبة الأداء
    startPerformanceMonitor() {
        if ('performance' in window) {
            this.performanceEntries = [];
            
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.performanceEntries.push(entry);
                    
                    // تسجيل الأحداث البطيئة
                    if (entry.duration > 1000) {
                        this.logEvent('slow_performance', {
                            name: entry.name,
                            duration: entry.duration,
                            entryType: entry.entryType
                        });
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure', 'paint', 'largest-contentful-paint'] });
        }
    }
    
    // ⭐ بدء خدمة الإشعارات المجدولة
    startNotificationScheduler() {
        // إشعارات زراعية مجدولة
        setInterval(() => {
            if (!document.hidden) {
                this.showScheduledNotification();
            }
        }, 15 * 60 * 1000); // كل 15 دقيقة
    }
    
    // ⭐ عرض إشعار مجدول
    showScheduledNotification() {
        const notifications = [
            {
                message: "⏰ وقت الري! تذكر ري المحاصيل في الوقت المناسب",
                type: "agriculture",
                condition: () => {
                    const hour = new Date().getHours();
                    return hour >= 6 && hour <= 9;
                }
            },
            {
                message: "🌱 تذكر فحص التربة هذا الأسبوع",
                type: "info",
                condition: () => {
                    const lastCheck = localStorage.getItem('last_soil_check');
                    return !lastCheck || Date.now() - parseInt(lastCheck) > 7 * 24 * 60 * 60 * 1000;
                }
            },
            {
                message: "📊 لديك بيانات غير مزامنة. تأكد من الاتصال بالإنترنت",
                type: "warning",
                condition: () => {
                    const unsynced = localStorage.getItem('unsynced_points');
                    return unsynced && parseInt(unsynced) > 0;
                }
            }
        ];
        
        const validNotification = notifications.find(n => n.condition());
        if (validNotification) {
            this.showNotification(validNotification.message, validNotification.type, 5000);
        }
    }
    
    // ⭐ بدء تحديث البيانات
    startDataRefresh() {
        this.dataRefreshInterval = setInterval(() => {
            // تحديث بيانات الوقت الحقيقي
            this.updateRealTimeData();
        }, 60 * 1000); // كل دقيقة
    }
    
    // ⭐ تحديث بيانات الوقت الحقيقي
    updateRealTimeData() {
        // تحديث الوقت والتاريخ
        const now = new Date();
        document.dispatchEvent(new CustomEvent('timeUpdated', { detail: now }));
        
        // تحديث حالة الاتصال
        document.dispatchEvent(new CustomEvent('connectionStatusChanged', { 
            detail: { online: navigator.onLine } 
        }));
    }
    
    // ⭐ الحفظ في قاعدة البيانات
    saveToDatabase(storeName, data) {
        if (!this.db) return Promise.resolve();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            let request;
            if (data.id || data.date || data.key) {
                request = store.put(data);
            } else {
                request = store.add(data);
            }
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    // ⭐ القراءة من قاعدة البيانات
    readFromDatabase(storeName, key) {
        if (!this.db) return Promise.resolve(null);
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    
    // 🔧 دوال مساعدة متنوعة (مُحسّنة)
    
    // 🎯 تأخير تنفيذ الدالة (debounce)
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const context = this;
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // ⏱️ الحد من تكرار الاستدعاء (throttle)
    throttle(func, limit) {
        let inThrottle;
        let lastResult;
        
        return function(...args) {
            const context = this;
            
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
            
            return lastResult;
        };
    }
    
    // 🎲 توليد رقم عشوائي (مُحسّن)
    random(min, max, decimal = 0) {
        const value = Math.random() * (max - min) + min;
        return decimal === 0 ? Math.floor(value) : parseFloat(value.toFixed(decimal));
    }
    
    // 🔤 توليد معرف فريد (مُحسّن)
    generateId(length = 12, prefix = '') {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substr(2, length);
        const id = prefix + timestamp + randomStr;
        return id.substr(0, length);
    }
    
    // ⭐ توليد كود محصول
    generateCropCode(category = 'GEN') {
        const timestamp = Date.now().toString(36).toUpperCase().substr(-4);
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${category}-${timestamp}${randomNum}`.substr(0, 15);
    }
    
    // 🔄 نسخ النص للحافظة (مُحسّن)
    copyToClipboard(text, showNotification = true) {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text)
                    .then(() => {
                        if (showNotification) {
                            this.showNotification('تم نسخ النص إلى الحافظة ✓', 'success', 2000);
                        }
                        
                        // إضافة نقاط للنسخ
                        if (this.pointsSystem) {
                            this.pointsSystem.addPoints('copy_to_clipboard', 1);
                        }
                        
                        resolve(true);
                    })
                    .catch(err => {
                        console.warn('⚠️ فشل النسخ:', err);
                        this.fallbackCopyToClipboard(text, resolve, reject, showNotification);
                    });
            } else {
                this.fallbackCopyToClipboard(text, resolve, reject, showNotification);
            }
        });
    }
    
    // 📋 طريقة بديلة للنسخ
    fallbackCopyToClipboard(text, resolve, reject, showNotification) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (successful) {
                if (showNotification) {
                    this.showNotification('تم نسخ النص إلى الحافظة ✓', 'success', 2000);
                }
                resolve(true);
            } else {
                reject(new Error('فشل نسخ النص'));
            }
        } catch (err) {
            document.body.removeChild(textArea);
            reject(err);
        }
    }
    
    // 📥 تحميل ملف (مُحسّن)
    loadFile(url, type = 'json', forceRefresh = false) {
        const cacheKey = `${url}_${type}`;
        
        // التحقق من الذاكرة المؤقتة
        if (!forceRefresh && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 دقائق
                return Promise.resolve(cached.data);
            }
        }
        
        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 10000);
            
            fetch(url, { signal: controller.signal })
                .then(response => {
                    clearTimeout(timeout);
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    let dataPromise;
                    switch (type) {
                        case 'json':
                            dataPromise = response.json();
                            break;
                        case 'text':
                            dataPromise = response.text();
                            break;
                        case 'blob':
                            dataPromise = response.blob();
                            break;
                        case 'arraybuffer':
                            dataPromise = response.arrayBuffer();
                            break;
                        default:
                            dataPromise = response.text();
                    }
                    
                    return dataPromise;
                })
                .then(data => {
                    // حفظ في الذاكرة المؤقتة
                    this.cache.set(cacheKey, {
                        data,
                        timestamp: Date.now(),
                        url,
                        type
                    });
                    
                    resolve(data);
                })
                .catch(error => {
                    clearTimeout(timeout);
                    
                    // محاولة استخدام البيانات المخزنة مؤقتاً
                    if (this.cache.has(cacheKey)) {
                        console.warn('⚠️ استخدام البيانات المخزنة مؤقتاً بسبب:', error.message);
                        resolve(this.cache.get(cacheKey).data);
                    } else {
                        reject(error);
                    }
                });
        });
    }
    
    // ⭐ تحميل ملف زراعي
    loadAgricultureFile(filename) {
        const basePath = 'js/data/';
        const fullPath = `${basePath}${filename}`;
        
        return this.loadFile(fullPath, 'json')
            .then(data => {
                this.logEvent('agriculture_file_loaded', { filename, size: JSON.stringify(data).length });
                return data;
            })
            .catch(error => {
                console.error(`❌ فشل تحميل الملف الزراعي: ${filename}`, error);
                throw error;
            });
    }
    
    // 💾 حفظ في التخزين المحلي (مُحسّن)
    saveToStorage(key, value, useSession = false) {
        try {
            const storage = useSession ? sessionStorage : localStorage;
            const data = typeof value === 'object' ? JSON.stringify(value) : String(value);
            storage.setItem(key, data);
            
            // تسجيل في IndexedDB
            if (!useSession) {
                this.saveToDatabase('local_storage', { key, value: data, timestamp: Date.now() });
            }
            
            return true;
        } catch (error) {
            console.error('❌ فشل الحفظ في التخزين:', error);
            
            // محاولة تخزين بديل
            try {
                sessionStorage.setItem(`backup_${key}`, typeof value === 'object' ? JSON.stringify(value) : value);
            } catch (e) {
                console.error('❌ فشل الحفظ البديل:', e);
            }
            
            return false;
        }
    }
    
    // 📂 قراءة من التخزين المحلي (مُحسّن)
    readFromStorage(key, useSession = false, defaultValue = null) {
        try {
            const storage = useSession ? sessionStorage : localStorage;
            let data = storage.getItem(key);
            
            // محاولة النسخ الاحتياطي
            if (!data && !useSession) {
                data = sessionStorage.getItem(`backup_${key}`);
            }
            
            if (!data) return defaultValue;
            
            // محاولة تحليل JSON
            try {
                return JSON.parse(data);
            } catch {
                return data;
            }
            
        } catch (error) {
            console.error('❌ فشل القراءة من التخزين:', error);
            return defaultValue;
        }
    }
    
    // 🗑️ مسح من التخزين المحلي
    removeFromStorage(key, useSession = false) {
        try {
            const storage = useSession ? sessionStorage : localStorage;
            storage.removeItem(key);
            
            // مسح النسخ الاحتياطي
            if (!useSession) {
                sessionStorage.removeItem(`backup_${key}`);
            }
            
            return true;
        } catch (error) {
            console.error('❌ فشل المسح من التخزين:', error);
            return false;
        }
    }
    
    // 🧹 تنظيف التخزين
    cleanupStorage() {
        const now = Date.now();
        const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
        
        // مسح العناصر القديمة
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('temp_') || key.startsWith('cache_')) {
                try {
                    const item = localStorage.getItem(key);
                    const data = JSON.parse(item);
                    
                    if (data && data.timestamp && data.timestamp < oneMonthAgo) {
                        localStorage.removeItem(key);
                    }
                } catch (e) {
                    // تجاهل العناصر غير القابلة للتحليل
                }
            }
        }
        
        console.log('🧹 تم تنظيف التخزين المحلي');
        return true;
    }
    
    // 📊 الحصول على إحصائيات الاستخدام (مُحسّن)
    getUsageStats() {
        const visits = parseInt(localStorage.getItem('visit_count') || '0');
        const sessionTime = parseInt(localStorage.getItem('total_session_time') || '0');
        const points = parseInt(localStorage.getItem('userPoints') || '0');
        const favorites = JSON.parse(localStorage.getItem('favorite_crops') || '[]').length;
        const savedCrops = JSON.parse(localStorage.getItem('saved_crops') || '[]').length;
        const searches = JSON.parse(localStorage.getItem('search_history') || '[]').length;
        
        return {
            visits,
            sessionTime: this.formatTime(sessionTime),
            points,
            favorites,
            savedCrops,
            searches,
            lastVisit: localStorage.getItem('last_visit') || 'غير معروف',
            firstVisit: localStorage.getItem('first_visit') || 'غير معروف',
            device: this.getDeviceType(),
            onlineTime: this.calculateOnlineTime()
        };
    }
    
    // ⭐ حساب وقت الاتصال
    calculateOnlineTime() {
        const onlineTime = parseInt(localStorage.getItem('total_online_time') || '0');
        return this.formatTime(onlineTime);
    }
    
    // ⏱️ تنسيق الوقت (مُحسّن)
    formatTime(seconds) {
        if (!seconds || seconds < 0) return '0 ثانية';
        
        if (seconds < 60) return `${seconds} ثانية`;
        if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return remainingSeconds > 0 ? `${minutes} د ${remainingSeconds} ث` : `${minutes} دقيقة`;
        }
        if (seconds < 86400) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return minutes > 0 ? `${hours} س ${minutes} د` : `${hours} ساعة`;
        }
        
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        return hours > 0 ? `${days} يوم ${hours} س` : `${days} يوم`;
    }
    
    // 🔍 البحث في الكائن (مُحسّن)
    searchInObject(obj, query, caseSensitive = false) {
        const results = [];
        const search = caseSensitive ? query : query.toLowerCase();
        
        function traverse(current, path = '', depth = 0) {
            if (depth > 10) return; // منع التعمق المفرط
            
            if (typeof current === 'object' && current !== null) {
                for (const key in current) {
                    if (Object.prototype.hasOwnProperty.call(current, key)) {
                        const value = current[key];
                        const newPath = path ? `${path}.${key}` : key;
                        
                        if (typeof value === 'string') {
                            const text = caseSensitive ? value : value.toLowerCase();
                            if (text.includes(search)) {
                                results.push({ 
                                    path: newPath, 
                                    value,
                                    match: this.highlightMatch(value, query)
                                });
                            }
                        } else if (typeof value === 'number' || typeof value === 'boolean') {
                            const strValue = String(value);
                            if (strValue.includes(search)) {
                                results.push({ 
                                    path: newPath, 
                                    value: strValue,
                                    match: this.highlightMatch(strValue, query)
                                });
                            }
                        } else if (Array.isArray(value)) {
                            value.forEach((item, index) => {
                                traverse.call(this, item, `${newPath}[${index}]`, depth + 1);
                            });
                        } else if (typeof value === 'object') {
                            traverse.call(this, value, newPath, depth + 1);
                        }
                    }
                }
            }
        }
        
        traverse.call(this, obj);
        
        // ترتيب النتائج حسب الأفضلية
        results.sort((a, b) => {
            const aScore = this.calculateMatchScore(a.value, query);
            const bScore = this.calculateMatchScore(b.value, query);
            return bScore - aScore;
        });
        
        return results;
    }
    
    // ⭐ حساب درجة المطابقة
    calculateMatchScore(text, query) {
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        
        if (lowerText === lowerQuery) return 100;
        if (lowerText.startsWith(lowerQuery)) return 80;
        if (lowerText.includes(lowerQuery)) return 60;
        
        // البحث بالأحرف الأولى
        const words = lowerText.split(/\s+/);
        const queryWords = lowerQuery.split(/\s+/);
        
        let score = 0;
        queryWords.forEach(qWord => {
            words.forEach(word => {
                if (word.startsWith(qWord)) score += 20;
                else if (word.includes(qWord)) score += 10;
            });
        });
        
        return score;
    }
    
    // ⭐ تمييز النص المطابق
    highlightMatch(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
    
    // ⭐ تهريب أحرف regex
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // 🎨 تحويل HEX إلى RGB (مُحسّن)
    hexToRgb(hex, alpha = 1) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) ||
                      /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
        
        if (!result) return null;
        
        const r = parseInt(result[1].length === 1 ? result[1] + result[1] : result[1], 16);
        const g = parseInt(result[2].length === 1 ? result[2] + result[2] : result[2], 16);
        const b = parseInt(result[3].length === 1 ? result[3] + result[3] : result[3], 16);
        
        return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
    }
    
    // 🎨 توليد لون عشوائي للزراعة
    generateAgricultureColor() {
        const agricultureColors = [
            '#8BC34A', // أخضر فاتح
            '#689F38', // أخضر متوسط
            '#4CAF50', // أخضر
            '#2E7D32', // أخضر غامق
            '#FFD700', // ذهبي
            '#FF9800', // برتقالي
            '#795548', // بني
            '#5D4037'  // بني غامق
        ];
        
        return agricultureColors[Math.floor(Math.random() * agricultureColors.length)];
    }
    
    // 📱 التحقق من نوع الجهاز (مُحسّن)
    getDeviceType() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /mobile|android|iphone|ipod|blackberry|opera mini|webos/i.test(userAgent);
        const isTablet = /tablet|ipad|playbook|silk/i.test(userAgent);
        
        if (isMobile) return 'mobile';
        if (isTablet) return 'tablet';
        return 'desktop';
    }
    
    // 🌍 الحصول على اللغة (مُحسّن)
    getLanguage() {
        return localStorage.getItem('language') || 
               navigator.language || 
               navigator.userLanguage || 
               'ar';
    }
    
    // ⏰ تنفيذ بعد تأخير
    delay(ms) {
        return new Promise(resolve => {
            const timeoutId = setTimeout(() => {
                resolve();
            }, ms);
            
            // تخزين معرف المؤقت للإلغاء المحتمل
            this.pausedTimers.push(timeoutId);
        });
    }
    
    // 🔄 تنفيذ مع إعادة المحاولة (مُحسّن)
    async retry(fn, retries = 3, delayMs = 1000, onRetry = null) {
        let lastError;
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                console.warn(`⚠️ محاولة ${attempt} فشلت:`, error.message);
                
                if (onRetry) {
                    onRetry(attempt, error);
                }
                
                if (attempt < retries) {
                    await this.delay(delayMs * Math.pow(2, attempt - 1)); // Exponential backoff
                }
            }
        }
        
        throw lastError;
    }
    
    // ⭐ التحقق إذا كان العنصر في نطاق الرؤية
    isElementInViewport(el) {
        if (!el) return false;
        
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // ⭐ جعل الجدول متجاوباً
    makeTableResponsive(table) {
        if (!table || table.classList.contains('responsive-processed')) return;
        
        const headers = [];
        const headerCells = table.querySelectorAll('thead th');
        headerCells.forEach(th => {
            headers.push(th.textContent.trim());
        });
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (headers[index]) {
                    cell.setAttribute('data-label', headers[index]);
                }
            });
        });
        
        table.classList.add('responsive-processed');
    }
    
    // ⭐ إرسال بيانات التحليلات
    sendToAnalytics(data) {
        // محاكاة إرسال البيانات
        console.log('📈 إرسال بيانات التحليلات:', data.event);
        
        // يمكن تفعيل هذا عند وجود خادم تحليلات
        /*
        return fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        */
    }
    
    // ⭐ الحصول على معلومات النظام
    getSystemInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: this.getLanguage(),
            online: navigator.onLine,
            deviceMemory: navigator.deviceMemory || 'غير معروف',
            hardwareConcurrency: navigator.hardwareConcurrency || 'غير معروف',
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth
            },
            window: {
                width: window.innerWidth,
                height: window.innerHeight,
                pixelRatio: window.devicePixelRatio
            },
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack || 'غير معروف',
            appVersion: this.config.version,
            environment: this.config.environment
        };
    }
    
    // ⭐ تصدير البيانات
    exportData() {
        const data = {
            preferences: JSON.parse(localStorage.getItem('user_preferences') || '{}'),
            savedItems: {
                crops: JSON.parse(localStorage.getItem('saved_crops') || '[]'),
                diseases: JSON.parse(localStorage.getItem('saved_diseases') || '[]')
            },
            stats: this.getUsageStats(),
            system: this.getSystemInfo(),
            exportDate: new Date().toISOString(),
            exportVersion: '4.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `agriculture-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return data;
    }
    
    // ⭐ استيراد البيانات
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // التحقق من صحة البيانات
                    if (!data.exportVersion || !data.preferences) {
                        throw new Error('بيانات غير صالحة');
                    }
                    
                    // تطبيق التفضيلات
                    if (data.preferences) {
                        for (const [key, value] of Object.entries(data.preferences)) {
                            if (value !== null && value !== undefined) {
                                localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
                            }
                        }
                    }
                    
                    // تطبيق العناصر المحفوظة
                    if (data.savedItems) {
                        if (data.savedItems.crops) {
                            localStorage.setItem('saved_crops', JSON.stringify(data.savedItems.crops));
                        }
                        if (data.savedItems.diseases) {
                            localStorage.setItem('saved_diseases', JSON.stringify(data.savedItems.diseases));
                        }
                    }
                    
                    console.log('✅ تم استيراد البيانات بنجاح');
                    resolve(true);
                    
                } catch (error) {
                    console.error('❌ فشل استيراد البيانات:', error);
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('فشل قراءة الملف'));
            reader.readAsText(file);
        });
    }
}

// ====== إنشاء نسخة عالمية ======
let helpersInstance = null;

function initHelpers() {
    if (!helpersInstance) {
        helpersInstance = new Helpers();
        
        // ⭐ ربط مع الجسر الرئيسي
        if (window.mainBridge) {
            window.mainBridge.helpers = helpersInstance;
            console.log('✅ تم ربط نظام المساعدات مع الجسر الرئيسي');
        }
    }
    return helpersInstance;
}

// ====== واجهة مبسطة للاستخدام ======
window.helpers = {
    init: function() {
        return initHelpers();
    },
    
    // الإشعارات
    notify: function(message, type, duration) {
        const helper = initHelpers();
        return helper.showNotification(message, type, duration);
    },
    
    // النسخ
    copy: function(text, showNotification) {
        const helper = initHelpers();
        return helper.copyToClipboard(text, showNotification !== false);
    },
    
    // التحميل
    load: function(url, type, forceRefresh) {
        const helper = initHelpers();
        return helper.loadFile(url, type, forceRefresh);
    },
    
    // التحميل الزراعي
    loadAgriculture: function(filename) {
        const helper = initHelpers();
        return helper.loadAgricultureFile(filename);
    },
    
    // التخزين
    save: function(key, value, session) {
        const helper = initHelpers();
        return helper.saveToStorage(key, value, session);
    },
    
    read: function(key, session, defaultValue) {
        const helper = initHelpers();
        return helper.readFromStorage(key, session, defaultValue);
    },
    
    remove: function(key, session) {
        const helper = initHelpers();
        return helper.removeFromStorage(key, session);
    },
    
    // الإحصائيات
    stats: function() {
        const helper = initHelpers();
        return helper.getUsageStats();
    },
    
    // الأدوات
    debounce: function(func, wait, immediate) {
        const helper = initHelpers();
        return helper.debounce(func, wait, immediate);
    },
    
    throttle: function(func, limit) {
        const helper = initHelpers();
        return helper.throttle(func, limit);
    },
    
    random: function(min, max, decimal) {
        const helper = initHelpers();
        return helper.random(min, max, decimal);
    },
    
    generateId: function(length, prefix) {
        const helper = initHelpers();
        return helper.generateId(length, prefix);
    },
    
    generateCropCode: function(category) {
        const helper = initHelpers();
        return helper.generateCropCode(category);
    },
    
    delay: function(ms) {
        const helper = initHelpers();
        return helper.delay(ms);
    },
    
    retry: function(fn, retries, delayMs, onRetry) {
        const helper = initHelpers();
        return helper.retry(fn, retries, delayMs, onRetry);
    },
    
    // التحويلات
    hexToRgb: function(hex, alpha) {
        const helper = initHelpers();
        return helper.hexToRgb(hex, alpha);
    },
    
    agricultureColor: function() {
        const helper = initHelpers();
        return helper.generateAgricultureColor();
    },
    
    // الجهاز واللغة
    deviceType: function() {
        const helper = initHelpers();
        return helper.getDeviceType();
    },
    
    language: function() {
        const helper = initHelpers();
        return helper.getLanguage();
    },
    
    systemInfo: function() {
        const helper = initHelpers();
        return helper.getSystemInfo();
    },
    
    // البحث
    searchInObject: function(obj, query, caseSensitive) {
        const helper = initHelpers();
        return helper.searchInObject(obj, query, caseSensitive);
    },
    
    // التنسيق
    formatTime: function(seconds) {
        const helper = initHelpers();
        return helper.formatTime(seconds);
    },
    
    // التنظيف
    cleanup: function() {
        const helper = initHelpers();
        return helper.cleanupStorage();
    },
    
    // التصدير والاستيراد
    exportData: function() {
        const helper = initHelpers();
        return helper.exportData();
    },
    
    importData: async function(file) {
        const helper = initHelpers();
        return await helper.importData(file);
    },
    
    // ⭐ دعم مباشر للجسر الرئيسي
    syncData: function() {
        const helper = initHelpers();
        return helper.syncData();
    },
    
    showOfflineNotice: function() {
        const helper = initHelpers();
        helper.showOfflineNotification();
    },
    
    hideOfflineNotice: function() {
        const helper = initHelpers();
        helper.hideOfflineNotification();
    },
    
    // ⭐ دوال زراعية خاصة
    calculateIrrigation: function(cropType, area, season) {
        // محاكاة حساب الري
        const rates = {
            'القمح': { winter: 500, summer: 800 },
            'الطماطم': { winter: 800, summer: 1500 },
            'الخيار': { winter: 1000, summer: 2000 }
        };
        
        const rate = rates[cropType]?.[season] || 1000;
        return Math.round(area * rate);
    },
    
    getAgricultureTips: function() {
        const tips = [
            "💧 ري النباتات في الصباح يمنع الأمراض الفطرية",
            "🌱 اختبار التربة كل موسم يحسن الإنتاجية",
            "🔄 تناوب المحاصيل يحافظ على خصوبة التربة",
            "🌾 استخدام السماد العضوي يحسن جودة المحصول"
        ];
        
        return tips[Math.floor(Math.random() * tips.length)];
    }
};

// ====== تهيئة تلقائية ======
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة متأخرة لضمان تحميل جميع الأنظمة
    setTimeout(() => {
        initHelpers();
        console.log('🛠️ نظام المساعدات الزراعي جاهز - الإصدار 4.0');
        
        // ⭐ إضافة إلى لوحة المطور إذا كانت موجودة
        if (window.developerDashboard) {
            window.developerDashboard.registerModule('helpers', {
                name: 'نظام المساعدات',
                version: '4.0',
                instance: helpersInstance,
                methods: ['stats', 'systemInfo', 'cleanup', 'exportData']
            });
        }
        
        // تسجيل بداية الجلسة
        sessionStorage.setItem('session_id', window.helpers.generateId());
        sessionStorage.setItem('session_start', Date.now().toString());
        
        // تسجيل الزيارة
        const visitCount = parseInt(localStorage.getItem('visit_count') || '0') + 1;
        localStorage.setItem('visit_count', visitCount.toString());
        localStorage.setItem('last_visit', new Date().toISOString());
        
        if (!localStorage.getItem('first_visit')) {
            localStorage.setItem('first_visit', new Date().toISOString());
        }
        
        // تسجيل الصفحة الحالية
        const pagesVisited = JSON.parse(sessionStorage.getItem('pages_visited') || '[]');
        pagesVisited.push({
            page: window.location.pathname + window.location.hash,
            title: document.title,
            time: Date.now(),
            referrer: document.referrer
        });
        
        sessionStorage.setItem('pages_visited', JSON.stringify(pagesVisited));
        
        // ⭐ إشعار ترحيبي زراعي
        setTimeout(() => {
            window.helpers.notify('🌱 مرحباً بك في المرشد الزراعي الذكي!', 'agriculture', 4000);
        }, 2000);
        
    }, 1500);
});

// ====== رسالة المطور ======
console.log(`
🛠️ **نظام المساعدات والدوال المساعدة - الإصدار 4.0**
🌱 **مخصص للتطبيق الزراعي الذكي**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ المميزات الجديدة:
• تكامل كامل مع أنظمة المشروع الزراعي
• إدارة متقدمة للأحداث والاتصال
• نظام إشعارات زراعي مخصص
• أدوات تحليل وإحصائيات متقدمة
• دعم قاعدة البيانات المحلية (IndexedDB)
• دوال مساعدة زراعية متخصصة
• إدارة الذاكرة المؤقتة التلقائية
• تصدير واستيراد بيانات المستخدم
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 أمثلة الاستخدام:
1. window.helpers.notify('نجاح الزراعة!', 'agriculture')
2. window.helpers.copy('نص زراعي للنسخ')
3. window.helpers.loadAgriculture('crops.json')
4. window.helpers.save('user_preferences', {theme: 'dark'})
5. window.helpers.generateCropCode('TOM')
6. window.helpers.calculateIrrigation('طماطم', 2, 'صيفي')
7. window.helpers.exportData() - تصدير جميع البيانات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌱 الدوال الزراعية المتخصصة:
• generateCropCode - توليد أكواد محاصيل
• calculateIrrigation - حساب كميات الري
• loadAgriculture - تحميل ملفات زراعية
• agricultureColor - ألوان زراعية
• getAgricultureTips - نصائح زراعية
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 الأنظمة المتكاملة:
• نظام النقاط والمكافآت
• نظام التحقق والتحقق من الصحة
• نظام الإعلانات
• الجسر الرئيسي للتطبيق
• لوحة تحكم المطور
• قاعدة البيانات المحلية
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 الإحصائيات المتاحة:
• إحصائيات الاستخدام والزيارات
• معلومات النظام والجهاز
• بيانات الجلسات والتتبع
• أداء التطبيق وتحليلات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ الموقع في المشروع: js/utils/helpers.js
🔗 متكامل مع: main.js, points.js, validators.js, ads.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تم التطوير بواسطة: المرشد الزراعي الذكي
© 2026 جميع الحقوق محفوظة
`);

// ⭐ تصدير للاستخدام في الوحدات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Helpers, helpers: window.helpers };
}