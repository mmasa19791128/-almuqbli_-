// ====== البيانات العالمية للتطبيق الزراعي ======
// 🌍 الإصدار 6.0 | يناير 2026
// ⚡ قاعدة بيانات مركزية لجميع الأنظمة

class GlobalDataManager {
    constructor() {
        this.appConfig = {};
        this.userData = {};
        this.categories = {};
        this.regions = {};
        this.soilTypes = {};
        this.devLogs = [];
        
        // تحميل جميع البيانات
        this.loadAllData();
        
        // بدء النظام
        this.initialize();
        
        console.log('🚀 مدير البيانات العالمية جاهز');
        this.logDeveloperEvent('system_initialized');
    }
    
    // تحميل جميع البيانات
    loadAllData() {
        this.loadAppConfig();
        this.loadUserData();
        this.loadCategories();
        this.loadRegions();
        this.loadSoilTypes();
    }
    
    // تحميل إعدادات التطبيق
    loadAppConfig() {
        try {
            const savedConfig = localStorage.getItem('agriculture_app_config');
            if (savedConfig) {
                this.appConfig = JSON.parse(savedConfig);
            } else {
                // إعدادات افتراضية
                this.appConfig = {
                    appName: 'المرشد الزراعي الذكي',
                    version: '6.0.0',
                    buildDate: 'يناير 2026',
                    developer: 'محمد مقبل عبدالله سيف',
                    contact: {
                        whatsapp: '+967734750438',
                        email: 'mmasa197911282017@gmail.com'
                    },
                    settings: {
                        language: 'ar',
                        theme: 'light',
                        notifications: true,
                        sounds: true,
                        offlineMode: true,
                        autoUpdate: true,
                        dataCollection: false
                    },
                    ads: {
                        enabled: true,
                        frequency: 'normal',
                        lastAdShown: null
                    },
                    points: {
                        enabled: true,
                        dailyReward: 5,
                        shareReward: 15,
                        adReward: 3
                    },
                    ai: {
                        enabled: true,
                        models: ['disease', 'soil', 'recommendation'],
                        offlineMode: true
                    }
                };
                this.saveAppConfig();
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل إعدادات التطبيق:', error);
            this.createDefaultConfig();
        }
    }
    
    // إنشاء إعدادات افتراضية
    createDefaultConfig() {
        this.appConfig = {
            appName: 'المرشد الزراعي الذكي',
            version: '6.0.0',
            settings: {
                language: 'ar',
                theme: 'light',
                notifications: true
            }
        };
        this.saveAppConfig();
    }
    
    // حفظ إعدادات التطبيق
    saveAppConfig() {
        try {
            localStorage.setItem('agriculture_app_config', JSON.stringify(this.appConfig));
        } catch (error) {
            console.error('❌ خطأ في حفظ إعدادات التطبيق:', error);
        }
    }
    
    // تحميل بيانات المستخدم
    loadUserData() {
        try {
            const savedData = localStorage.getItem('agriculture_user_data');
            if (savedData) {
                this.userData = JSON.parse(savedData);
            } else {
                // بيانات افتراضية
                this.userData = {
                    id: `user_${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    profile: {
                        name: 'مستخدم جديد',
                        type: 'farmer', // farmer, expert, student
                        region: 'default',
                        experience: 'beginner', // beginner, intermediate, expert
                        farmSize: 'small' // small, medium, large
                    },
                    stats: {
                        points: 100,
                        level: 1,
                        daysActive: 1,
                        cropsPlanted: 0,
                        diseasesDiagnosed: 0,
                        soilTests: 0
                    },
                    preferences: {
                        favoriteCrops: [],
                        savedArticles: [],
                        recentSearches: []
                    },
                    achievements: []
                };
                this.saveUserData();
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل بيانات المستخدم:', error);
        }
    }
    
    // حفظ بيانات المستخدم
    saveUserData() {
        try {
            localStorage.setItem('agriculture_user_data', JSON.stringify(this.userData));
        } catch (error) {
            console.error('❌ خطأ في حفظ بيانات المستخدم:', error);
        }
    }
    
    // تحميل الفئات
    loadCategories() {
        try {
            const savedCategories = localStorage.getItem('agriculture_categories');
            if (savedCategories) {
                this.categories = JSON.parse(savedCategories);
            } else {
                // فئات افتراضية
                this.categories = {
                    crops: {
                        grains: ['قمح', 'شعير', 'ذرة', 'أرز'],
                        vegetables: ['طماطم', 'خيار', 'بصل', 'ثوم', 'بطاطس'],
                        fruits: ['موز', 'عنب', 'تفاح', 'برتقال'],
                        legumes: ['فول', 'عدس', 'حمص']
                    },
                    diseases: {
                        fungal: ['البياض الدقيقي', 'اللفحة المتأخرة', 'العفن الرمادي'],
                        bacterial: ['تبقع الأوراق', 'الذبول البكتيري'],
                        viral: ['فسيفساء الخيار', 'تورد الأوراق'],
                        pests: ['حفار الساق', 'من القطن', 'دودة ورق القطن']
                    },
                    soil: {
                        types: ['طينية', 'رملية', 'سلتية', 'طينية رملية'],
                        phLevels: ['حمضية', 'متعادلة', 'قلوية'],
                        nutrients: ['نيتروجين', 'فوسفور', 'بوتاسيوم', 'كالسيوم']
                    },
                    seasons: {
                        winter: ['قمح', 'شعير', 'برسيم'],
                        spring: ['طماطم', 'خيار', 'فلفل'],
                        summer: ['ذرة', 'قطن', 'سمسم'],
                        autumn: ['جزر', 'لفت', 'سبانخ']
                    }
                };
                this.saveCategories();
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل الفئات:', error);
        }
    }
    
    // حفظ الفئات
    saveCategories() {
        try {
            localStorage.setItem('agriculture_categories', JSON.stringify(this.categories));
        } catch (error) {
            console.error('❌ خطأ في حفظ الفئات:', error);
        }
    }
    
    // تحميل المناطق
    loadRegions() {
        try {
            const savedRegions = localStorage.getItem('agriculture_regions');
            if (savedRegions) {
                this.regions = JSON.parse(savedRegions);
            } else {
                // مناطق افتراضية
                this.regions = {
                    yemen: {
                        name: 'اليمن',
                        governorates: {
                            'صنعاء': {
                                climate: 'معتدل',
                                rainfall: 'متوسط',
                                crops: ['قمح', 'شعير', 'عنب', 'تين']
                            },
                            'تعز': {
                                climate: 'دافئ',
                                rainfall: 'منخفض',
                                crops: ['ذرة', 'سمسم', 'قطن']
                            },
                            'الحديدة': {
                                climate: 'حار رطب',
                                rainfall: 'منخفض',
                                crops: ['موز', 'طماطم', 'خيار']
                            },
                            'إب': {
                                climate: 'معتدل',
                                rainfall: 'مرتفع',
                                crops: ['بن', 'فواكه']
                            }
                        }
                    },
                    saudi: {
                        name: 'السعودية',
                        regions: {
                            'الرياض': { crops: ['قمح', 'شعير'] },
                            'الشرقية': { crops: ['تمور', 'خضروات'] },
                            'عسير': { crops: ['فواكه', 'زهور'] }
                        }
                    },
                    egypt: {
                        name: 'مصر',
                        regions: {
                            'الدلتا': { crops: ['أرز', 'قطن'] },
                            'الصعيد': { crops: ['قصب', 'حبوب'] }
                        }
                    }
                };
                this.saveRegions();
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل المناطق:', error);
        }
    }
    
    // حفظ المناطق
    saveRegions() {
        try {
            localStorage.setItem('agriculture_regions', JSON.stringify(this.regions));
        } catch (error) {
            console.error('❌ خطأ في حفظ المناطق:', error);
        }
    }
    
    // تحميل أنواع التربة
    loadSoilTypes() {
        try {
            const savedSoils = localStorage.getItem('agriculture_soil_types');
            if (savedSoils) {
                this.soilTypes = JSON.parse(savedSoils);
            } else {
                // أنواع تربة افتراضية
                this.soilTypes = {
                    clay: {
                        name: 'طينية',
                        characteristics: 'احتفاظ عالي بالماء، بطيئة التصريف',
                        suitableCrops: ['أرز', 'قمح', 'قصب السكر'],
                        improvements: ['إضافة الرمل', 'التسميد العضوي']
                    },
                    sandy: {
                        name: 'رملية',
                        characteristics: 'تصريف سريع، فقيرة بالمغذيات',
                        suitableCrops: ['بطيخ', 'جزر', 'بصل'],
                        improvements: ['إضافة الطين', 'التسميد المتكرر']
                    },
                    loamy: {
                        name: 'سلتية',
                        characteristics: 'مثالية، متوازنة',
                        suitableCrops: ['معظم المحاصيل'],
                        improvements: ['الحفاظ على الخصوبة']
                    },
                    'clay-loam': {
                        name: 'طينية سلتية',
                        characteristics: 'خصوبة عالية، احتفاظ جيد',
                        suitableCrops: ['طماطم', 'خيار', 'ذرة'],
                        improvements: ['تجنب الدوس الثقيل']
                    }
                };
                this.saveSoilTypes();
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل أنواع التربة:', error);
        }
    }
    
    // حفظ أنواع التربة
    saveSoilTypes() {
        try {
            localStorage.setItem('agriculture_soil_types', JSON.stringify(this.soilTypes));
        } catch (error) {
            console.error('❌ خطأ في حفظ أنواع التربة:', error);
        }
    }
    
    // تهيئة النظام
    initialize() {
        // تحديث الإحصائيات
        this.updateUserStats();
        
        // بدء المراقبة
        this.startMonitoring();
        
        // التحقق من التحديثات
        this.checkForUpdates();
        
        console.log('✅ البيانات العالمية مهيأة وجاهزة');
    }
    
    // تحديث إحصائيات المستخدم
    updateUserStats() {
        if (!this.userData.stats) {
            this.userData.stats = {
                points: 100,
                level: 1,
                daysActive: 1
            };
        }
        
        // تحديث أيام النشاط
        const lastActive = localStorage.getItem('last_active_date');
        const today = new Date().toDateString();
        
        if (lastActive !== today) {
            this.userData.stats.daysActive++;
            localStorage.setItem('last_active_date', today);
            
            // مكافأة يومية
            this.addUserPoints(this.appConfig.points?.dailyReward || 5, 'المكافأة اليومية');
            
            this.logDeveloperEvent('daily_reward_given', {
                points: this.appConfig.points?.dailyReward || 5,
                daysActive: this.userData.stats.daysActive
            });
        }
        
        this.saveUserData();
    }
    
    // بدء المراقبة
    startMonitoring() {
        // مراقبة استخدام التطبيق
        setInterval(() => {
            this.monitorUsage();
        }, 5 * 60 * 1000); // كل 5 دقائق
        
        // نسخ احتياطي للبيانات
        setInterval(() => {
            this.backupData();
        }, 30 * 60 * 1000); // كل 30 دقيقة
        
        console.log('👁️ بدء مراقبة استخدام التطبيق');
    }
    
    // مراقبة الاستخدام
    monitorUsage() {
        const usageData = {
            timestamp: new Date().toISOString(),
            activeSystems: this.getActiveSystems(),
            userPoints: this.userData.stats?.points || 0,
            memoryUsage: this.getMemoryUsage(),
            onlineStatus: navigator.onLine
        };
        
        // حفظ سجل الاستخدام
        try {
            const usageLogs = JSON.parse(localStorage.getItem('app_usage_logs') || '[]');
            usageLogs.push(usageData);
            
            // حفظ آخر 500 سجل فقط
            if (usageLogs.length > 500) {
                usageLogs.splice(0, usageLogs.length - 500);
            }
            
            localStorage.setItem('app_usage_logs', JSON.stringify(usageLogs));
        } catch (error) {
            console.warn('⚠️ لا يمكن حفظ سجل الاستخدام:', error);
        }
        
        this.logDeveloperEvent('usage_monitored', usageData);
    }
    
    // الحصول على الأنظمة النشطة
    getActiveSystems() {
        const systems = [];
        
        if (window.agricultureAlerts) systems.push('alerts');
        if (window.agricultureSchedule) systems.push('schedule');
        if (window.agricultureSeasons) systems.push('seasons');
        if (window.agricultureApp?.pointsSystem) systems.push('points');
        if (window.agricultureApp?.adsManager) systems.push('ads');
        if (window.agricultureApp?.searchSystem) systems.push('search');
        
        return systems;
    }
    
    // الحصول على استخدام الذاكرة
    getMemoryUsage() {
        try {
            const memory = performance.memory;
            return {
                usedJSHeapSize: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 'N/A',
                totalJSHeapSize: memory ? Math.round(memory.totalJSHeapSize / 1024 / 1024) : 'N/A'
            };
        } catch {
            return { usedJSHeapSize: 'N/A', totalJSHeapSize: 'N/A' };
        }
    }
    
    // نسخ احتياطي للبيانات
    backupData() {
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                appConfig: this.appConfig,
                userData: this.userData,
                categories: this.categories,
                regions: this.regions,
                soilTypes: this.soilTypes
            };
            
            // حفظ النسخة الاحتياطية
            const backups = JSON.parse(localStorage.getItem('data_backups') || '[]');
            backups.push(backup);
            
            // حفظ آخر 10 نسخ فقط
            if (backups.length > 10) {
                backups.splice(0, backups.length - 10);
            }
            
            localStorage.setItem('data_backups', JSON.stringify(backups));
            
            this.logDeveloperEvent('data_backup_created', {
                timestamp: backup.timestamp,
                size: JSON.stringify(backup).length
            });
        } catch (error) {
            console.error('❌ خطأ في النسخ الاحتياطي:', error);
        }
    }
    
    // التحقق من التحديثات
    checkForUpdates() {
        // التحقق من تحديثات البيانات
        this.checkDataUpdates();
        
        // التحقق من تحديثات الإعدادات
        this.checkConfigUpdates();
    }
    
    // التحقق من تحديثات البيانات
    checkDataUpdates() {
        const lastUpdate = localStorage.getItem('last_data_update');
        const today = new Date().toDateString();
        
        if (!lastUpdate || lastUpdate !== today) {
            console.log('🔍 التحقق من تحديثات البيانات...');
            
            // تحديث البيانات المحلية
            this.updateLocalData();
            
            localStorage.setItem('last_data_update', today);
            
            this.logDeveloperEvent('data_update_check', { date: today });
        }
    }
    
    // تحديث البيانات المحلية
    updateLocalData() {
        // هنا يمكن إضافة تحديثات للبيانات من مصادر خارجية
        // حالياً يتم تحديث البيانات المحلية فقط
        
        this.logDeveloperEvent('local_data_updated');
    }
    
    // التحقق من تحديثات الإعدادات
    checkConfigUpdates() {
        // التحقق من إصدار التطبيق
        const savedVersion = this.appConfig.version;
        const currentVersion = '6.0.0';
        
        if (savedVersion !== currentVersion) {
            console.log(`🔄 تحديث الإعدادات: ${savedVersion} → ${currentVersion}`);
            
            // تحديث الإعدادات
            this.appConfig.version = currentVersion;
            this.appConfig.updatedAt = new Date().toISOString();
            this.saveAppConfig();
            
            // إشعار المستخدم
            this.notifyUpdate(currentVersion);
            
            this.logDeveloperEvent('config_updated', {
                from: savedVersion,
                to: currentVersion
            });
        }
    }
    
    // إشعار المستخدم بالتحديث
    notifyUpdate(version) {
        if (window.agricultureAlerts) {
            window.agricultureAlerts.addCustomAlert(
                'تحديث التطبيق',
                `تم تحديث التطبيق إلى الإصدار ${version}`,
                new Date(),
                'update'
            );
        }
        
        // يمكن إضافة إشعارات أخرى هنا
    }
    
    // ⭐ دوال إدارة المستخدم
    
    // تحديث ملف المستخدم
    updateUserProfile(updates) {
        if (!this.userData.profile) {
            this.userData.profile = {};
        }
        
        this.userData.profile = { ...this.userData.profile, ...updates };
        this.saveUserData();
        
        this.logDeveloperEvent('profile_updated', updates);
        return true;
    }
    
    // إضافة نقاط للمستخدم
    addUserPoints(points, reason = '') {
        if (!this.userData.stats) {
            this.userData.stats = { points: 0 };
        }
        
        this.userData.stats.points = (this.userData.stats.points || 0) + points;
        
        // تحديث المستوى
        this.updateUserLevel();
        
        // حفظ التغييرات
        this.saveUserData();
        
        // تسجيل المعاملة
        this.logPointsTransaction(points, reason);
        
        // إشعار الأنظمة الأخرى
        this.notifyPointsUpdate(points, reason);
        
        this.logDeveloperEvent('points_added', { points, reason, total: this.userData.stats.points });
        
        return this.userData.stats.points;
    }
    
    // تحديث مستوى المستخدم
    updateUserLevel() {
        const points = this.userData.stats?.points || 0;
        let level = 1;
        
        if (points >= 1000) level = 5;
        else if (points >= 500) level = 4;
        else if (points >= 250) level = 3;
        else if (points >= 100) level = 2;
        
        if (this.userData.stats.level !== level) {
            this.userData.stats.level = level;
            
            // إشعار ترقية المستوى
            this.notifyLevelUp(level);
            
            this.logDeveloperEvent('level_up', { oldLevel: this.userData.stats.level, newLevel: level });
        }
    }
    
    // إشعار ترقية المستوى
    notifyLevelUp(level) {
        if (window.agricultureAlerts) {
            window.agricultureAlerts.addCustomAlert(
                'ترقية مستوى!',
                `تهانينا! لقد وصلت إلى المستوى ${level}`,
                new Date(),
                'achievement'
            );
        }
    }
    
    // تسجيل معاملة النقاط
    logPointsTransaction(points, reason) {
        try {
            const transaction = {
                timestamp: new Date().toISOString(),
                points: points,
                reason: reason,
                balance: this.userData.stats?.points || 0
            };
            
            const transactions = JSON.parse(localStorage.getItem('points_transactions') || '[]');
            transactions.push(transaction);
            
            // حفظ آخر 100 معاملة
            if (transactions.length > 100) {
                transactions.splice(0, transactions.length - 100);
            }
            
            localStorage.setItem('points_transactions', JSON.stringify(transactions));
        } catch (error) {
            console.error('❌ خطأ في تسجيل معاملة النقاط:', error);
        }
    }
    
    // إشعار تحديث النقاط
    notifyPointsUpdate(points, reason) {
        // إرسال إشعار للأنظمة الأخرى
        if (window.agricultureApp?.pointsSystem) {
            window.agricultureApp.pointsSystem.updateDisplay();
        }
        
        // تحديث الواجهة
        this.updatePointsDisplay();
    }
    
    // تحديث عرض النقاط
    updatePointsDisplay() {
        const pointsElements = document.querySelectorAll('.points-value, .user-points, #userPoints, #totalPoints');
        pointsElements.forEach(el => {
            if (el.id === 'totalPoints') {
                el.textContent = this.userData.stats?.points || 0;
            } else if (el.classList.contains('points-value') || el.id === 'userPoints') {
                el.textContent = this.userData.stats?.points || 0;
            }
        });
    }
    
    // إضافة إنجاز
    addAchievement(title, description, icon = '🏆') {
        if (!this.userData.achievements) {
            this.userData.achievements = [];
        }
        
        const achievement = {
            id: `ach_${Date.now()}`,
            title: title,
            description: description,
            icon: icon,
            earnedAt: new Date().toISOString()
        };
        
        this.userData.achievements.push(achievement);
        this.saveUserData();
        
        // مكافأة نقاط
        this.addUserPoints(10, `إنجاز: ${title}`);
        
        this.logDeveloperEvent('achievement_earned', achievement);
        return achievement.id;
    }
    
    // ⭐ دوال البحث والتصفية
    
    // البحث في البيانات
    searchData(query, category = 'all') {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        // البحث في المحاصيل
        if (category === 'all' || category === 'crops') {
            Object.values(this.categories.crops || {}).flat().forEach(crop => {
                if (crop.toLowerCase().includes(searchTerm)) {
                    results.push({
                        type: 'crop',
                        name: crop,
                        category: this.getCropCategory(crop)
                    });
                }
            });
        }
        
        // البحث في الأمراض
        if (category === 'all' || category === 'diseases') {
            Object.values(this.categories.diseases || {}).flat().forEach(disease => {
                if (disease.toLowerCase().includes(searchTerm)) {
                    results.push({
                        type: 'disease',
                        name: disease
                    });
                }
            });
        }
        
        // البحث في المناطق
        if (category === 'all' || category === 'regions') {
            Object.entries(this.regions || {}).forEach(([country, data]) => {
                if (country.toLowerCase().includes(searchTerm) || 
                    data.name?.toLowerCase().includes(searchTerm)) {
                    results.push({
                        type: 'region',
                        name: data.name || country,
                        country: country
                    });
                }
            });
        }
        
        return results;
    }
    
    // الحصول على فئة المحصول
    getCropCategory(cropName) {
        for (const [category, crops] of Object.entries(this.categories.crops || {})) {
            if (crops.includes(cropName)) {
                return category;
            }
        }
        return 'unknown';
    }
    
    // الحصول على توصيات حسب المنطقة
    getRegionRecommendations(region) {
        const recommendations = [];
        
        // البحث عن المنطقة
        for (const [country, countryData] of Object.entries(this.regions)) {
            if (countryData.governorates && countryData.governorates[region]) {
                const govData = countryData.governorates[region];
                recommendations.push({
                    region: region,
                    country: countryData.name,
                    climate: govData.climate,
                    recommendedCrops: govData.crops || []
                });
            }
        }
        
        return recommendations;
    }
    
    // ⭐ دوال الإعدادات
    
    // تغيير اللغة
    changeLanguage(lang) {
        if (!this.appConfig.settings) {
            this.appConfig.settings = {};
        }
        
        this.appConfig.settings.language = lang;
        this.saveAppConfig();
        
        // تحديث التطبيق
        this.applyLanguageChange(lang);
        
        this.logDeveloperEvent('language_changed', { language: lang });
        return true;
    }
    
    // تطبيق تغيير اللغة
    applyLanguageChange(lang) {
        // هنا يمكن إضافة منطق تغيير اللغة
        // حالياً يتم فقط حفظ الإعداد
        
        if (window.changeLanguage) {
            window.changeLanguage(lang);
        }
    }
    
    // تغيير المظهر
    toggleTheme() {
        if (!this.appConfig.settings) {
            this.appConfig.settings = {};
        }
        
        const currentTheme = this.appConfig.settings.theme || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.appConfig.settings.theme = newTheme;
        this.saveAppConfig();
        
        // تطبيق المظهر
        this.applyTheme(newTheme);
        
        this.logDeveloperEvent('theme_changed', { theme: newTheme });
        return newTheme;
    }
    
    // تطبيق المظهر
    applyTheme(theme) {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        
        if (window.showToast) {
            window.showToast(`تم تغيير المظهر إلى ${theme === 'dark' ? 'الداكن' : 'الفاتح'}`);
        }
    }
    
    // ⭐ دوال الإحصائيات
    
    // الحصول على إحصائيات كاملة
    getCompleteStats() {
        return {
            app: {
                version: this.appConfig.version,
                daysSinceInstall: this.getDaysSinceInstall(),
                totalBackups: this.getBackupCount()
            },
            user: {
                points: this.userData.stats?.points || 0,
                level: this.userData.stats?.level || 1,
                daysActive: this.userData.stats?.daysActive || 1,
                achievements: this.userData.achievements?.length || 0
            },
            data: {
                crops: this.getTotalCropsCount(),
                diseases: this.getTotalDiseasesCount(),
                regions: this.getTotalRegionsCount(),
                soilTypes: Object.keys(this.soilTypes || {}).length
            },
            system: {
                activeSystems: this.getActiveSystems().length,
                lastUpdate: localStorage.getItem('last_data_update'),
                developerLogs: this.devLogs.length
            }
        };
    }
    
    // الحصول على أيام التثبيت
    getDaysSinceInstall() {
        try {
            const installDate = new Date(this.userData.createdAt || new Date().toISOString());
            const today = new Date();
            const diffTime = Math.abs(today - installDate);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        } catch {
            return 1;
        }
    }
    
    // الحصول على عدد النسخ الاحتياطية
    getBackupCount() {
        try {
            const backups = JSON.parse(localStorage.getItem('data_backups') || '[]');
            return backups.length;
        } catch {
            return 0;
        }
    }
    
    // الحصول على عدد المحاصيل الكلي
    getTotalCropsCount() {
        if (!this.categories.crops) return 0;
        return Object.values(this.categories.crops).flat().length;
    }
    
    // الحصول على عدد الأمراض الكلي
    getTotalDiseasesCount() {
        if (!this.categories.diseases) return 0;
        return Object.values(this.categories.diseases).flat().length;
    }
    
    // الحصول على عدد المناطق الكلي
    getTotalRegionsCount() {
        let count = 0;
        Object.values(this.regions || {}).forEach(countryData => {
            if (countryData.governorates) {
                count += Object.keys(countryData.governorates).length;
            } else if (countryData.regions) {
                count += Object.keys(countryData.regions).length;
            }
        });
        return count;
    }
    
    // ⭐ دوال المطور
    
    // تسجيل حدث المطور
    logDeveloperEvent(eventName, data = {}) {
        const log = {
            event: eventName,
            data: data,
            timestamp: new Date().toISOString(),
            system: 'global_data'
        };
        
        this.devLogs.push(log);
        
        // حفظ آخر 100 حدث فقط
        if (this.devLogs.length > 100) {
            this.devLogs.splice(0, this.devLogs.length - 100);
        }
        
        // تخزين في localStorage للمطور
        try {
            const allLogs = JSON.parse(localStorage.getItem('dev_logs_global') || '[]');
            allLogs.push(log);
            localStorage.setItem('dev_logs_global', JSON.stringify(allLogs.slice(-200)));
        } catch (error) {
            console.warn('⚠️ لا يمكن حفظ سجلات المطور:', error);
        }
    }
    
    // الحصول على سجلات المطور
    getDeveloperLogs() {
        return this.devLogs;
    }
    
    // تنظيف سجلات المطور
    clearDeveloperLogs() {
        this.devLogs = [];
        localStorage.removeItem('dev_logs_global');
        this.logDeveloperEvent('dev_logs_cleared');
    }
    
    // تصدير جميع البيانات
    exportAllData() {
        const data = {
            appConfig: this.appConfig,
            userData: this.userData,
            categories: this.categories,
            regions: this.regions,
            soilTypes: this.soilTypes,
            developerLogs: this.devLogs,
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(data, null, 2);
    }
    
    // استيراد البيانات
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.appConfig) this.appConfig = data.appConfig;
            if (data.userData) this.userData = data.userData;
            if (data.categories) this.categories = data.categories;
            if (data.regions) this.regions = data.regions;
            if (data.soilTypes) this.soilTypes = data.soilTypes;
            
            // حفظ جميع البيانات
            this.saveAllData();
            
            this.logDeveloperEvent('data_imported', {
                timestamp: data.exportDate,
                success: true
            });
            
            return true;
        } catch (error) {
            this.logDeveloperEvent('data_import_failed', {
                error: error.message,
                success: false
            });
            
            return false;
        }
    }
    
    // حفظ جميع البيانات
    saveAllData() {
        this.saveAppConfig();
        this.saveUserData();
        this.saveCategories();
        this.saveRegions();
        this.saveSoilTypes();
    }
    
    // إعادة تعيين البيانات
    resetData(type = 'all') {
        switch (type) {
            case 'appConfig':
                this.appConfig = {};
                this.loadAppConfig();
                break;
            case 'userData':
                this.userData = {};
                this.loadUserData();
                break;
            case 'all':
                localStorage.clear();
                this.loadAllData();
                break;
        }
        
        this.logDeveloperEvent('data_reset', { type: type });
        return true;
    }
}

// تصدير الكلاس
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GlobalDataManager;
} else {
    window.GlobalDataManager = GlobalDataManager;
}

// ⭐ تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.globalDataManager = new GlobalDataManager();
        
        // إضافة إلى نظام التطبيق الرئيسي
        if (window.agricultureApp) {
            window.agricultureApp.globalData = window.globalDataManager;
        }
        
        console.log('🌍 مدير البيانات العالمية محمل وجاهز');
        
        // تحديث عرض النقاط
        window.globalDataManager.updatePointsDisplay();
    }, 500);
});

// ⭐ وظائف عامة للوصول من HTML
window.getAppStats = function() {
    if (window.globalDataManager) {
        return window.globalDataManager.getCompleteStats();
    }
    return null;
};

window.searchGlobalData = function(query, category) {
    if (window.globalDataManager) {
        return window.globalDataManager.searchData(query, category);
    }
    return [];
};

// === رسالة بدء التشغيل ===
console.log(`
🌍 **مدير البيانات العالمية**
🛠️ الإصدار: 6.0
📅 تاريخ الإصدار: يناير 2026
⚡ الحالة: جاهز للتشغيل
👨‍💻 دعم لوحة المطور: ✅ كامل

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 الميزات المتوفرة:
1. إدارة إعدادات التطبيق
2. بيانات المستخدم الشخصية
3. فئات المحاصيل والأمراض
4. قاعدة بيانات المناطق
5. أنواع التربة وخصائصها
6. نظام النقاط والمستويات
7. النسخ الاحتياطي التلقائي
8. سجلات تفصيلية للمطور
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 الأوامر المتاحة:
• getAppStats() - إحصائيات التطبيق
• searchGlobalData() - بحث في البيانات
• updateUserProfile() - تحديث الملف الشخصي
• addUserPoints() - إضافة نقاط
• exportAllData() - تصدير جميع البيانات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 البيانات المخزنة:
• المحاصيل: ${Object.values(new GlobalDataManager().categories.crops || {}).flat().length}
• الأمراض: ${Object.values(new GlobalDataManager().categories.diseases || {}).flat().length}
• المناطق: ${Object.keys(new GlobalDataManager().regions || {}).length}
• أنواع التربة: ${Object.keys(new GlobalDataManager().soilTypes || {}).length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تم تطوير النظام بواسطة: محمد مقبل عبدالله سيف
© 2026 المرشد الزراعي الذكي
`);