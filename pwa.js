// ====== نظام PWA للتطبيق الزراعي ======
// 📱 الإصدار 3.1 | يناير 2026 | معدل ومتكامل

class PWAHandler {
    constructor() {
        this.isPWA = false;
        this.deferredPrompt = null;
        this.isStandalone = false;
        this.hasUpdate = false;
        this.updateAvailable = false;
        
        // ⚙️ إعدادات PWA متوافقة مع المشروع
        this.config = {
            appName: 'المرشد الزراعي الذكي',
            shortName: 'المرشد الزراعي',
            themeColor: '#2E7D32',
            backgroundColor: '#FFFFFF',
            display: 'standalone',
            orientation: 'portrait',
            scope: './',
            startUrl: './index.html',
            icons: [
                {
                    src: './assets/icons/icon-72.png',
                    sizes: '72x72',
                    type: 'image/png'
                },
                {
                    src: './assets/icons/icon-96.png',
                    sizes: '96x96',
                    type: 'image/png'
                },
                {
                    src: './assets/icons/icon-128.png',
                    sizes: '128x128',
                    type: 'image/png'
                },
                {
                    src: './assets/icons/icon-144.png',
                    sizes: '144x144',
                    type: 'image/png'
                },
                {
                    src: './assets/icons/icon-152.png',
                    sizes: '152x152',
                    type: 'image/png'
                },
                {
                    src: './assets/icons/icon-192.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'maskable any'
                },
                {
                    src: './assets/icons/icon-384.png',
                    sizes: '384x384',
                    type: 'image/png'
                },
                {
                    src: './assets/icons/icon-512.png',
                    sizes: '512x512',
                    type: 'image/png'
                }
            ],
            features: [
                'زراعة',
                'نباتات',
                'محاصيل',
                'ذكاء اصطناعي',
                'تشخيص أمراض',
                'تحليل تربة'
            ],
            categories: ['lifestyle', 'education', 'productivity']
        };
        
        this.init();
    }
    
    // 🚀 تهيئة النظام
    async init() {
        console.log('📱 جاري تهيئة نظام PWA للتطبيق الزراعي...');
        
        // 1. التحقق من وضع PWA
        this.checkPWAStatus();
        
        // 2. إعداد Service Worker
        await this.setupServiceWorker();
        
        // 3. إعداد مستمعي الأحداث
        this.setupEventListeners();
        
        // 4. إعداد واجهة التثبيت
        this.setupInstallUI();
        
        // 5. إعداد التحديثات
        this.setupUpdates();
        
        console.log(`✅ نظام PWA جاهز (PWA: ${this.isPWA}, Standalone: ${this.isStandalone})`);
        
        // إظهار رسالة ترحيبية
        if (this.isStandalone) {
            setTimeout(() => {
                this.showToast('👋 مرحباً بك في التطبيق المثبت!', 'success');
            }, 2000);
        }
    }
    
    // 🔍 التحقق من وضع PWA
    checkPWAStatus() {
        try {
            // التحقق من وضع العرض
            this.isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                              window.matchMedia('(display-mode: fullscreen)').matches ||
                              window.matchMedia('(display-mode: minimal-ui)').matches;
            
            // التحقق من وضع PWA
            this.isPWA = this.isStandalone || 
                        (window.navigator.standalone === true) ||
                        document.referrer.includes('android-app://');
            
            console.log('🔍 حالة PWA:', {
                isPWA: this.isPWA,
                isStandalone: this.isStandalone,
                displayMode: this.getDisplayMode(),
                standalone: window.navigator.standalone,
                referrer: document.referrer
            });
            
            // تحديث واجهة المستخدم
            this.updateUIForPWA();
            
        } catch (error) {
            console.warn('⚠️ خطأ في التحقق من حالة PWA:', error);
        }
    }
    
    // 📱 الحصول على وضع العرض
    getDisplayMode() {
        if (window.matchMedia('(display-mode: standalone)').matches) return 'standalone';
        if (window.matchMedia('(display-mode: fullscreen)').matches) return 'fullscreen';
        if (window.matchMedia('(display-mode: minimal-ui)').matches) return 'minimal-ui';
        if (window.matchMedia('(display-mode: browser)').matches) return 'browser';
        return 'unknown';
    }
    
    // ⚙️ إعداد Service Worker
    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                console.log('🛠️ جاري تسجيل Service Worker...');
                
                // تسجيل Service Worker مع المسار الصحيح
                const registration = await navigator.serviceWorker.register('service-worker.js', {
                    scope: './',
                    updateViaCache: 'all'
                });
                
                console.log('✅ Service Worker مسجل:', registration.scope);
                
                // مستمع للتحديثات
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 جاري تحديث Service Worker...');
                    
                    newWorker.addEventListener('statechange', () => {
                        console.log(`📊 حالة Service Worker: ${newWorker.state}`);
                        
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('✨ تحديث Service Worker متاح!');
                            this.showUpdateAvailable();
                        }
                        
                        if (newWorker.state === 'activated') {
                            console.log('🎯 Service Worker مفعّل');
                            this.showToast('✅ التطبيق جاهز للعمل بدون اتصال', 'success');
                        }
                    });
                });
                
                // التحقق من التحديثات
                try {
                    await registration.update();
                } catch (updateError) {
                    console.warn('⚠️ فشل التحقق من تحديثات Service Worker:', updateError);
                }
                
            } catch (error) {
                console.error('❌ فشل تسجيل Service Worker:', error);
                this.showToast('تعذر تسجيل خدمة العمل بدون اتصال', 'error');
            }
        } else {
            console.warn('⚠️ Service Worker غير مدعوم في هذا المتصفح');
        }
    }
    
    // 🎧 إعداد مستمعي الأحداث
    setupEventListeners() {
        // حدث beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('🎯 حدث beforeinstallprompt تم تشغيله');
            
            // منع العرض التلقائي
            e.preventDefault();
            
            // حفظ الحدث للاستخدام لاحقاً
            this.deferredPrompt = e;
            
            // إظهار زر التثبيت
            this.showInstallButton();
            
            // تسجيل الحدث للتحليلات
            this.logInstallEvent('beforeinstallprompt_shown');
        });
        
        // حدث appinstalled
        window.addEventListener('appinstalled', (e) => {
            console.log('🎉 التطبيق مثبت بنجاح!');
            
            // إخفاء زر التثبيت
            this.hideInstallButton();
            
            // تسجيل التثبيت
            this.logInstallEvent('app_installed');
            
            // إظهار رسالة نجاح
            this.showToast('✅ تم تثبيت التطبيق بنجاح!', 'success');
            
            // إضافة نقاط للمستخدم
            this.awardInstallPoints();
            
            // تحديث حالة PWA
            setTimeout(() => this.checkPWAStatus(), 1000);
        });
        
        // مراقبة التغييرات في وضع العرض
        if (window.matchMedia) {
            window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
                console.log('🔄 تغيير في وضع العرض:', e.matches ? 'standalone' : 'browser');
                this.checkPWAStatus();
            });
        }
        
        // مستمع لأحداث Service Worker
        if (navigator.serviceWorker) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                this.handleServiceWorkerMessage(event.data);
            });
        }
        
        // مستمع لحدث التحديث
        document.addEventListener('sw-update-available', () => {
            this.showUpdateAvailable();
        });
        
        // مستمع لحدث الاتصال
        window.addEventListener('online', () => {
            this.handleOnlineStatus();
        });
        
        window.addEventListener('offline', () => {
            this.handleOfflineStatus();
        });
        
        // مستمع لحدث تحميل الصفحة
        window.addEventListener('load', () => {
            this.onPageLoad();
        });
    }
    
    // 🏗️ إعداد واجهة التثبيت
    setupInstallUI() {
        // إنشاء زر التثبيت إذا لم يكن موجوداً
        if (!document.getElementById('pwa-install-button')) {
            this.createInstallButton();
        }
        
        // التحقق من شروط التثبيت
        this.checkInstallCriteria();
    }
    
    // 🎯 إنشاء زر التثبيت
    createInstallButton() {
        const installButton = document.createElement('button');
        installButton.id = 'pwa-install-button';
        installButton.className = 'pwa-install-btn';
        installButton.innerHTML = `
            <i class="fas fa-download"></i>
            <span>تثبيت التطبيق</span>
            <small style="font-size: 0.8em; opacity: 0.8;">للوصول السريع</small>
        `;
        
        installButton.style.cssText = `
            position: fixed;
            bottom: 150px;
            left: 15px;
            background: linear-gradient(135deg, #2E7D32, #4CAF50);
            color: white;
            border: none;
            padding: 12px 18px;
            border-radius: 20px;
            font-family: 'Tajawal', sans-serif;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(46, 125, 50, 0.4);
            z-index: 9999;
            display: none;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            animation: pwaPulse 2s infinite;
            transition: all 0.3s ease;
            min-width: 130px;
        `;
        
        installButton.addEventListener('click', () => this.installApp());
        installButton.addEventListener('mouseenter', () => {
            installButton.style.transform = 'translateY(-2px) scale(1.05)';
            installButton.style.boxShadow = '0 6px 20px rgba(46, 125, 50, 0.6)';
        });
        installButton.addEventListener('mouseleave', () => {
            installButton.style.transform = 'translateY(0) scale(1)';
            installButton.style.boxShadow = '0 4px 15px rgba(46, 125, 50, 0.4)';
        });
        
        document.body.appendChild(installButton);
        
        // إضافة أنيميشن
        if (!document.querySelector('#pwa-pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pwa-pulse-animation';
            style.textContent = `
                @keyframes pwaPulse {
                    0% { box-shadow: 0 4px 15px rgba(46, 125, 50, 0.4); }
                    50% { box-shadow: 0 4px 20px rgba(46, 125, 50, 0.7); }
                    100% { box-shadow: 0 4px 15px rgba(46, 125, 50, 0.4); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 🔍 التحقق من شروط التثبيت
    checkInstallCriteria() {
        // لا تظهر في وضع PWA
        if (this.isStandalone) {
            this.hideInstallButton();
            return;
        }
        
        // تحقق من عدد الزيارات
        const visitCount = parseInt(localStorage.getItem('app_visit_count') || '0');
        const hasSeenInstallPrompt = localStorage.getItem('has_seen_install_prompt');
        const lastInstallPrompt = parseInt(localStorage.getItem('last_install_prompt') || '0');
        const now = Date.now();
        
        // شروط إظهار زر التثبيت:
        // 1. زار التطبيق 3 مرات على الأقل
        // 2. لم ير الزر في آخر 24 ساعة
        // 3. ليس مثبتاً بالفعل
        // 4. حدث beforeinstallprompt متاح
        
        const shouldShow = visitCount >= 3 && 
                          (now - lastInstallPrompt) > (24 * 60 * 60 * 1000) &&
                          this.deferredPrompt &&
                          !this.isStandalone;
        
        if (shouldShow) {
            setTimeout(() => {
                this.showInstallButton();
                localStorage.setItem('last_install_prompt', now.toString());
            }, 3000);
        }
    }
    
    // 👁️ إظهار زر التثبيت
    showInstallButton() {
        const button = document.getElementById('pwa-install-button');
        if (button && !this.isStandalone && this.deferredPrompt) {
            button.style.display = 'flex';
            
            // تسجيل أن المستخدم رأى الزر
            localStorage.setItem('has_seen_install_prompt', 'true');
            
            // إخفاء بعد 30 ثانية إذا لم ينقر
            setTimeout(() => {
                if (button.style.display !== 'none') {
                    this.hideInstallButton();
                }
            }, 30000);
        }
    }
    
    // 🙈 إخفاء زر التثبيت
    hideInstallButton() {
        const button = document.getElementById('pwa-install-button');
        if (button) {
            button.style.display = 'none';
        }
    }
    
    // 📥 تثبيت التطبيق
    async installApp() {
        if (!this.deferredPrompt) {
            this.showToast('تعذر تثبيت التطبيق الآن', 'error');
            return;
        }
        
        try {
            console.log('🚀 بدء عملية التثبيت...');
            
            // إظهار نافذة التثبيت
            this.deferredPrompt.prompt();
            
            // انتظار اختيار المستخدم
            const choiceResult = await this.deferredPrompt.userChoice;
            
            // تسجيل النتيجة
            const outcome = choiceResult.outcome;
            this.logInstallEvent(`install_${outcome}`);
            
            if (outcome === 'accepted') {
                console.log('✅ المستخدم وافق على التثبيت');
                this.showToast('جاري تثبيت التطبيق...', 'success');
            } else {
                console.log('❌ المستخدم رفض التثبيت');
                this.showToast('يمكنك تثبيت التطبيق لاحقاً', 'info');
            }
            
            // مسح الحدث بعد الاستخدام
            this.deferredPrompt = null;
            
            // إخفاء الزر
            this.hideInstallButton();
            
        } catch (error) {
            console.error('❌ فشل عملية التثبيت:', error);
            this.showToast('حدث خطأ أثناء التثبيت', 'error');
        }
    }
    
    // 🔄 إعداد التحديثات
    setupUpdates() {
        // التحقق من التحديثات كل 6 ساعات
        setInterval(() => this.checkForUpdates(), 6 * 60 * 60 * 1000);
        
        // التحقق عند العودة للاتصال
        window.addEventListener('online', () => {
            setTimeout(() => this.checkForUpdates(), 10000);
        });
    }
    
    // 🔍 التحقق من التحديثات
    async checkForUpdates() {
        if (!navigator.onLine) {
            console.log('🌐 لا يوجد اتصال للتحقق من التحديثات');
            return;
        }
        
        try {
            console.log('🔍 جاري التحقق من التحديثات...');
            
            // التحقق من تحديثات Service Worker
            const registration = await navigator.serviceWorker?.ready;
            if (registration) {
                try {
                    await registration.update();
                } catch (swError) {
                    console.warn('⚠️ فشل تحديث Service Worker:', swError);
                }
            }
            
            // التحقق من تحديثات التطبيق (manifest.json)
            try {
                const response = await fetch('./manifest.json', {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache'
                    }
                });
                
                if (response.ok) {
                    const manifest = await response.json();
                    const currentVersion = this.getAppVersion();
                    const latestVersion = manifest.version || '1.0.0';
                    
                    if (this.compareVersions(latestVersion, currentVersion) > 0) {
                        console.log(`🆕 تحديث متاح: ${currentVersion} → ${latestVersion}`);
                        this.showUpdateAvailable(latestVersion);
                    } else {
                        console.log(`✅ التطبيق محدث (${currentVersion})`);
                    }
                }
            } catch (manifestError) {
                console.warn('⚠️ فشل قراءة manifest.json:', manifestError);
            }
            
        } catch (error) {
            console.warn('⚠️ فشل التحقق من التحديثات:', error);
        }
    }
    
    // 📊 الحصول على إصدار التطبيق
    getAppVersion() {
        return localStorage.getItem('app_version') || '1.0.0';
    }
    
    // 🔄 مقارنة الإصدارات
    compareVersions(v1, v2) {
        try {
            const parts1 = v1.split('.').map(Number);
            const parts2 = v2.split('.').map(Number);
            
            for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
                const part1 = parts1[i] || 0;
                const part2 = parts2[i] || 0;
                
                if (part1 > part2) return 1;
                if (part1 < part2) return -1;
            }
            
            return 0;
        } catch (error) {
            return 0;
        }
    }
    
    // 🆕 إظهار تحديث متاح
    showUpdateAvailable(newVersion = null) {
        if (this.updateAvailable) return;
        
        this.updateAvailable = true;
        this.hasUpdate = true;
        
        console.log('🔄 إظهار إشعار التحديث...');
        
        // إنشاء زر التحديث
        this.createUpdateButton(newVersion);
        
        // إظهار إشعار
        this.showToast('🔄 تحديث جديد متاح!', 'info');
        
        // تسجيل الحدث
        this.logUpdateEvent('update_available', { newVersion });
    }
    
    // 🏗️ إنشاء زر التحديث
    createUpdateButton(newVersion) {
        // إزالة الزر القديم إذا كان موجوداً
        const oldButton = document.getElementById('pwa-update-button');
        if (oldButton) oldButton.remove();
        
        const updateButton = document.createElement('button');
        updateButton.id = 'pwa-update-button';
        updateButton.className = 'pwa-update-btn';
        updateButton.innerHTML = `
            <i class="fas fa-sync-alt"></i>
            <span>${newVersion ? `تحديث ${newVersion}` : 'تحديث التطبيق'}</span>
        `;
        
        updateButton.style.cssText = `
            position: fixed;
            bottom: 150px;
            right: 15px;
            background: linear-gradient(135deg, #FF9800, #F57C00);
            color: white;
            border: none;
            padding: 12px 18px;
            border-radius: 20px;
            font-family: 'Tajawal', sans-serif;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
            z-index: 9998;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            animation: pwaPulseOrange 2s infinite;
            transition: all 0.3s ease;
            min-width: 130px;
        `;
        
        updateButton.addEventListener('click', () => this.applyUpdate());
        updateButton.addEventListener('mouseenter', () => {
            updateButton.style.transform = 'translateY(-2px) scale(1.05)';
            updateButton.style.boxShadow = '0 6px 20px rgba(255, 152, 0, 0.6)';
        });
        updateButton.addEventListener('mouseleave', () => {
            updateButton.style.transform = 'translateY(0) scale(1)';
            updateButton.style.boxShadow = '0 4px 15px rgba(255, 152, 0, 0.4)';
        });
        
        document.body.appendChild(updateButton);
        
        // إضافة أنيميشن
        if (!document.querySelector('#pwa-pulse-orange-animation')) {
            const style = document.createElement('style');
            style.id = 'pwa-pulse-orange-animation';
            style.textContent = `
                @keyframes pwaPulseOrange {
                    0% { box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4); }
                    50% { box-shadow: 0 4px 20px rgba(255, 152, 0, 0.7); }
                    100% { box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 🔄 تطبيق التحديث
    async applyUpdate() {
        try {
            console.log('🔄 تطبيق التحديث...');
            
            this.showToast('جاري تطبيق التحديث...', 'info');
            
            // تحديث Service Worker
            const registration = await navigator.serviceWorker?.ready;
            if (registration) {
                try {
                    await registration.update();
                    console.log('✅ Service Worker تم تحديثه');
                } catch (swError) {
                    console.warn('⚠️ فشل تحديث Service Worker:', swError);
                }
            }
            
            // تحديث cache المتصفح
            if (window.caches) {
                try {
                    const cacheNames = await caches.keys();
                    for (const cacheName of cacheNames) {
                        await caches.delete(cacheName);
                    }
                    console.log('✅ تم مسح cache المتصفح');
                } catch (cacheError) {
                    console.warn('⚠️ فشل مسح cache:', cacheError);
                }
            }
            
            // إعادة تحميل الصفحة
            setTimeout(() => {
                localStorage.setItem('force_reload', 'true');
                localStorage.setItem('last_update', new Date().toISOString());
                window.location.reload();
            }, 1500);
            
        } catch (error) {
            console.error('❌ فشل تطبيق التحديث:', error);
            this.showToast('فشل تطبيق التحديث', 'error');
        }
    }
    
    // 🖼️ تحديث واجهة المستخدم لـ PWA
    updateUIForPWA() {
        if (this.isStandalone) {
            // إضافة فئة خاصة لوضع PWA
            document.body.classList.add('pwa-standalone');
            
            // إخفاء عناصر المتصفح
            this.hideBrowserElements();
            
            // تحديث العنوان
            document.title = this.config.appName;
            
            // تحديث شريط الحالة
            this.updateStatusBar();
            
            console.log('🎨 تم تحديث واجهة المستخدم لوضع PWA');
            
        } else {
            document.body.classList.remove('pwa-standalone');
        }
    }
    
    // 🙈 إخفاء عناصر المتصفح
    hideBrowserElements() {
        // يمكن إخفاء عناصر معينة في وضع PWA
        const elementsToHide = [
            '.browser-only',
            'iframe[src*="ads"]',
            '.ads-container'
        ];
        
        elementsToHide.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
            });
        });
    }
    
    // 📱 تحديث شريط الحالة
    updateStatusBar() {
        // إضافة meta tag لشريط الحالة
        let statusBarMeta = document.querySelector('meta[name="theme-color"]');
        
        if (!statusBarMeta) {
            statusBarMeta = document.createElement('meta');
            statusBarMeta.name = 'theme-color';
            document.head.appendChild(statusBarMeta);
        }
        
        statusBarMeta.content = this.config.themeColor;
        
        // تحديث لون شريط الحالة في iOS
        let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        
        if (!appleStatusBar) {
            appleStatusBar = document.createElement('meta');
            appleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
            document.head.appendChild(appleStatusBar);
        }
        
        appleStatusBar.content = 'black-translucent';
    }
    
    // 📨 معالجة رسائل Service Worker
    handleServiceWorkerMessage(data) {
        if (!data || !data.type) return;
        
        console.log('📨 رسالة من Service Worker:', data.type);
        
        switch (data.type) {
            case 'UPDATE_AVAILABLE':
                this.showUpdateAvailable(data.version);
                break;
                
            case 'CACHE_UPDATED':
                console.log('✅ Cache تم تحديثه:', data.cacheName);
                break;
                
            case 'OFFLINE_READY':
                this.showToast('✅ التطبيق جاهز للعمل بدون اتصال', 'success');
                break;
                
            case 'SYNC_COMPLETE':
                console.log('🔄 المزامنة اكتملت:', data.result);
                this.showToast('✅ تم مزامنة البيانات', 'success');
                break;
                
            case 'INSTALLED':
                console.log('📦 Service Worker مثبت:', data.version);
                break;
        }
    }
    
    // 🌐 معالجة حالة الاتصال
    handleOnlineStatus() {
        console.log('🌐 اتصال بالإنترنت');
        
        // إخفاء إشعار عدم الاتصال
        const offlineNotice = document.getElementById('offline-notice');
        if (offlineNotice) {
            offlineNotice.style.display = 'none';
        }
        
        // مزامنة البيانات
        setTimeout(() => this.syncData(), 2000);
    }
    
    handleOfflineStatus() {
        console.log('📴 لا يوجد اتصال بالإنترنت');
        
        // إظهار إشعار عدم الاتصال
        this.showOfflineNotice();
    }
    
    // حدث تحميل الصفحة
    onPageLoad() {
        // زيادة عداد الزيارات
        const visitCount = parseInt(localStorage.getItem('app_visit_count') || '0') + 1;
        localStorage.setItem('app_visit_count', visitCount.toString());
        
        // التحقق من التحميل القسري
        if (localStorage.getItem('force_reload') === 'true') {
            localStorage.removeItem('force_reload');
            this.showToast('✅ تم تحديث التطبيق بنجاح!', 'success');
        }
        
        // التحقق من آخر تحديث
        const lastUpdate = localStorage.getItem('last_update');
        if (lastUpdate) {
            const updateDate = new Date(lastUpdate);
            const now = new Date();
            const diffHours = Math.abs(now - updateDate) / 36e5;
            
            if (diffHours < 24) {
                console.log(`🕐 آخر تحديث كان منذ ${Math.round(diffHours)} ساعة`);
            }
        }
    }
    
    // 📡 مزامنة البيانات
    async syncData() {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                
                // تسجيل المزامنة
                await registration.sync.register('sync-data');
                
                console.log('🔄 تم تسجيل مزامنة البيانات');
                
            } catch (error) {
                console.warn('⚠️ فشل تسجيل المزامنة:', error);
            }
        }
    }
    
    // 📝 إظهار إشعار عدم الاتصال
    showOfflineNotice() {
        let notice = document.getElementById('offline-notice');
        
        if (!notice) {
            notice = document.createElement('div');
            notice.id = 'offline-notice';
            notice.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: #FF9800;
                    color: white;
                    padding: 12px 20px;
                    text-align: center;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    font-family: 'Tajawal', sans-serif;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                ">
                    <i class="fas fa-wifi-slash" style="font-size: 1.2em;"></i>
                    <span>أنت تعمل بدون اتصال - التطبيق يعمل محلياً</span>
                </div>
            `;
            
            document.body.appendChild(notice);
        } else {
            notice.style.display = 'flex';
        }
    }
    
    // 🏆 منح نقاط للتثبيت
    awardInstallPoints() {
        // التحقق من عدم منح النقاط مسبقاً
        const hasAwarded = localStorage.getItem('install_points_awarded');
        if (hasAwarded) {
            console.log('💰 النقاط مُنحت مسبقاً');
            return;
        }
        
        // منح 50 نقطة للتثبيت
        let currentPoints = 0;
        try {
            currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
        } catch (e) {
            currentPoints = 0;
        }
        
        const newPoints = currentPoints + 50;
        
        localStorage.setItem('userPoints', newPoints.toString());
        localStorage.setItem('install_points_awarded', 'true');
        
        console.log(`💰 تم منح 50 نقطة للمستخدم. النقاط الجديدة: ${newPoints}`);
        
        // إظهار إشعار
        this.showToast('🎉 ربحت 50 نقطة لتثبيت التطبيق!', 'success');
        
        // تسجيل الحدث
        this.logInstallEvent('install_points_awarded', { points: 50, totalPoints: newPoints });
        
        // تحديث عرض النقاط في الواجهة
        setTimeout(() => {
            const pointsElements = [
                document.getElementById('userPoints'),
                document.getElementById('sidebarPoints'),
                document.getElementById('totalPoints')
            ];
            
            pointsElements.forEach(el => {
                if (el) {
                    el.textContent = newPoints;
                }
            });
        }, 1000);
    }
    
    // 📊 تسجيل أحداث التثبيت
    logInstallEvent(eventName, extraData = {}) {
        try {
            const eventData = {
                timestamp: new Date().toISOString(),
                event: eventName,
                isPWA: this.isPWA,
                isStandalone: this.isStandalone,
                displayMode: this.getDisplayMode(),
                userAgent: navigator.userAgent.substring(0, 100),
                platform: navigator.platform,
                ...extraData
            };
            
            // حفظ في localStorage
            let logs = [];
            try {
                logs = JSON.parse(localStorage.getItem('pwa_events') || '[]');
            } catch (e) {
                logs = [];
            }
            
            logs.push(eventData);
            
            // الاحتفاظ بآخر 100 حدث فقط
            if (logs.length > 100) {
                logs = logs.slice(-100);
            }
            
            localStorage.setItem('pwa_events', JSON.stringify(logs));
            
            console.log(`📝 حدث PWA: ${eventName}`, eventData);
            
            // إرسال للتحليلات إذا كان هناك اتصال
            if (navigator.onLine) {
                this.sendAnalytics(eventName, eventData);
            }
            
        } catch (error) {
            console.warn('⚠️ فشل تسجيل حدث PWA:', error);
        }
    }
    
    // 📊 تسجيل أحداث التحديث
    logUpdateEvent(eventName, extraData = {}) {
        this.logInstallEvent(eventName, {
            type: 'update',
            ...extraData
        });
    }
    
    // 📡 إرسال التحليلات
    async sendAnalytics(eventName, data) {
        try {
            // هنا يمكن إرسال البيانات لخادم التحليلات
            // حالياً مجرد تسجيل في console
            console.log('📊 تحليلات PWA:', { eventName, ...data });
            
        } catch (error) {
            console.warn('⚠️ فشل إرسال التحليلات:', error);
        }
    }
    
    // 🔔 عرض إشعار
    showToast(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const toast = document.createElement('div');
        toast.className = 'pwa-toast';
        
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
        };
        
        const icons = {
            info: 'fa-info-circle',
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-exclamation-circle'
        };
        
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 14px 20px;
            border-radius: 12px;
            font-family: 'Tajawal', sans-serif;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: pwaSlideIn 0.3s ease;
            max-width: 300px;
            backdrop-filter: blur(10px);
        `;
        
        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}" style="font-size: 1.2em;"></i>
            <span style="flex: 1;">${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // إضافة أنيميشن إذا لم تكن موجودة
        if (!document.querySelector('#pwa-slide-animation')) {
            const style = document.createElement('style');
            style.id = 'pwa-slide-animation';
            style.textContent = `
                @keyframes pwaSlideIn {
                    from { 
                        transform: translateX(100%) translateY(20px); 
                        opacity: 0; 
                    }
                    to { 
                        transform: translateX(0) translateY(0); 
                        opacity: 1; 
                    }
                }
                
                @keyframes pwaSlideOut {
                    from { 
                        transform: translateX(0) translateY(0); 
                        opacity: 1; 
                    }
                    to { 
                        transform: translateX(100%) translateY(20px); 
                        opacity: 0; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // إزالة بعد 4 ثواني
        setTimeout(() => {
            toast.style.animation = 'pwaSlideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }
    
    // 📊 الحصول على إحصائيات PWA
    getStats() {
        try {
            const events = JSON.parse(localStorage.getItem('pwa_events') || '[]');
            const visitCount = parseInt(localStorage.getItem('app_visit_count') || '0');
            const installed = localStorage.getItem('install_points_awarded') ? true : false;
            const lastUpdate = localStorage.getItem('last_update');
            
            return {
                isPWA: this.isPWA,
                isStandalone: this.isStandalone,
                displayMode: this.getDisplayMode(),
                hasUpdate: this.hasUpdate,
                updateAvailable: this.updateAvailable,
                installEvents: events.length,
                visitCount: visitCount,
                installed: installed,
                lastUpdate: lastUpdate,
                version: this.getAppVersion(),
                deferredPrompt: !!this.deferredPrompt
            };
        } catch (error) {
            return {
                error: 'فشل تحميل الإحصائيات',
                details: error.message
            };
        }
    }
    
    // 🧹 إعادة تعيين بيانات PWA
    resetPWA() {
        if (confirm('هل تريد إعادة تعيين جميع بيانات PWA؟\nسيتم حذف الإحصائيات والأحداث.\n(لن يؤثر على بيانات التطبيق الأخرى)')) {
            try {
                localStorage.removeItem('pwa_events');
                localStorage.removeItem('has_seen_install_prompt');
                localStorage.removeItem('last_install_prompt');
                localStorage.removeItem('install_points_awarded');
                localStorage.removeItem('app_visit_count');
                localStorage.removeItem('last_update');
                
                this.showToast('✅ تم إعادة تعيين بيانات PWA', 'success');
                
                console.log('🧹 تم إعادة تعيين بيانات PWA');
                
                // إعادة تحميل بعد 1.5 ثانية
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
            } catch (error) {
                this.showToast('❌ فشل إعادة التعيين', 'error');
                console.error('❌ فشل إعادة تعيين PWA:', error);
            }
        }
    }
    
    // 📋 عرض معلومات التثبيت
    showInstallInfo() {
        const info = this.getStats();
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            backdrop-filter: blur(5px);
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 100%;
                max-height: 85vh;
                overflow-y: auto;
                animation: pwaModalIn 0.3s ease;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <div style="
                    background: linear-gradient(135deg, #2E7D32, #4CAF50);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 20px 20px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-mobile-alt"></i> 
                        <span>معلومات PWA</span>
                    </h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="
                                background: rgba(255,255,255,0.2);
                                border: none;
                                color: white;
                                font-size: 1.5rem;
                                cursor: pointer;
                                padding: 5px 10px;
                                border-radius: 50%;
                                transition: all 0.3s;
                            "
                            onmouseenter="this.style.backgroundColor='rgba(255,255,255,0.3)'; this.style.transform='rotate(90deg)'"
                            onmouseleave="this.style.backgroundColor='rgba(255,255,255,0.2)'; this.style.transform='rotate(0)'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div style="padding: 1.5rem;">
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="color: #2E7D32; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #E8F5E9;">
                            <i class="fas fa-chart-bar"></i> الحالة الحالية
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 1rem;">
                            <div style="
                                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                                padding: 15px;
                                border-radius: 12px;
                                text-align: center;
                                border: 2px solid ${info.isPWA ? '#4CAF50' : '#F5F5F5'};
                            ">
                                <div style="font-size: 0.9rem; color: #666; margin-bottom: 8px;">
                                    <i class="fas fa-mobile"></i> وضع PWA
                                </div>
                                <div style="font-weight: bold; font-size: 1.1rem; color: ${info.isPWA ? '#4CAF50' : '#F44336'}">
                                    ${info.isPWA ? '✅ مفعّل' : '❌ غير مفعّل'}
                                </div>
                            </div>
                            
                            <div style="
                                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                                padding: 15px;
                                border-radius: 12px;
                                text-align: center;
                                border: 2px solid #F5F5F5;
                            ">
                                <div style="font-size: 0.9rem; color: #666; margin-bottom: 8px;">
                                    <i class="fas fa-desktop"></i> وضع العرض
                                </div>
                                <div style="font-weight: bold; font-size: 1.1rem; color: #2196F3">
                                    ${info.displayMode}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="color: #2E7D32; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #E8F5E9;">
                            <i class="fas fa-chart-line"></i> الإحصائيات
                        </h4>
                        <div style="
                            background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
                            padding: 1.2rem;
                            border-radius: 12px;
                            border-right: 4px solid #4CAF50;
                        ">
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                <div>
                                    <div style="color: #666; font-size: 0.9rem;">عدد الزيارات</div>
                                    <div style="font-weight: bold; color: #2E7D32; font-size: 1.2rem;">${info.visitCount}</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-size: 0.9rem;">الأحداث المسجلة</div>
                                    <div style="font-weight: bold; color: #2E7D32; font-size: 1.2rem;">${info.installEvents}</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-size: 0.9rem;">الإصدار</div>
                                    <div style="font-weight: bold; color: #2E7D32; font-size: 1.2rem;">${info.version}</div>
                                </div>
                                <div>
                                    <div style="color: #666; font-size: 0.9rem;">التثبيت</div>
                                    <div style="font-weight: bold; color: ${info.installed ? '#4CAF50' : '#F44336'}; font-size: 1.2rem;">
                                        ${info.installed ? '✅ نعم' : '❌ لا'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 2rem; display: flex; gap: 10px; justify-content: center;">
                        <button onclick="pwaHandler.resetPWA()" style="
                            background: linear-gradient(135deg, #FF9800, #F57C00);
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 25px;
                            cursor: pointer;
                            font-family: 'Tajawal', sans-serif;
                            font-weight: bold;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            transition: all 0.3s;
                            min-width: 140px;
                        " onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 15px rgba(255, 152, 0, 0.4)'"
                         onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                            <i class="fas fa-redo"></i>
                            <span>إعادة تعيين</span>
                        </button>
                        
                        <button onclick="pwaHandler.checkForUpdates()" style="
                            background: linear-gradient(135deg, #2196F3, #0D47A1);
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 25px;
                            cursor: pointer;
                            font-family: 'Tajawal', sans-serif;
                            font-weight: bold;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            transition: all 0.3s;
                            min-width: 140px;
                        " onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 15px rgba(33, 150, 243, 0.4)'"
                         onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                            <i class="fas fa-sync-alt"></i>
                            <span>فحص تحديثات</span>
                        </button>
                    </div>
                    
                    ${info.lastUpdate ? `
                    <div style="text-align: center; margin-top: 1rem;">
                        <small style="color: #666;">
                            <i class="fas fa-clock"></i>
                            آخر تحديث: ${new Date(info.lastUpdate).toLocaleString('ar-SA')}
                        </small>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // إضافة أنيميشن
        if (!document.querySelector('#pwa-modal-animation')) {
            const style = document.createElement('style');
            style.id = 'pwa-modal-animation';
            style.textContent = `
                @keyframes pwaModalIn {
                    from { 
                        opacity: 0; 
                        transform: scale(0.9) translateY(20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: scale(1) translateY(0); 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // إغلاق بالنقر خارج النافذة
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// ====== إنشاء نسخة عالمية ======
let pwaHandlerInstance = null;

function initPWAHandler() {
    if (!pwaHandlerInstance) {
        pwaHandlerInstance = new PWAHandler();
    }
    return pwaHandlerInstance;
}

// ====== واجهة مبسطة للاستخدام ======
window.pwaHandler = {
    init: function() {
        return initPWAHandler();
    },
    
    install: function() {
        const handler = initPWAHandler();
        return handler.installApp();
    },
    
    checkUpdates: function() {
        const handler = initPWAHandler();
        return handler.checkForUpdates();
    },
    
    getStats: function() {
        const handler = initPWAHandler();
        return handler.getStats();
    },
    
    showInfo: function() {
        const handler = initPWAHandler();
        return handler.showInstallInfo();
    },
    
    resetPWA: function() {
        const handler = initPWAHandler();
        return handler.resetPWA();
    },
    
    isPWA: function() {
        const handler = initPWAHandler();
        return handler.isPWA;
    },
    
    isStandalone: function() {
        const handler = initPWAHandler();
        return handler.isStandalone;
    }
};

// ====== تكامل مع النظام الرئيسي ======
if (window.mainBridge) {
    window.mainBridge.pwa = window.pwaHandler;
    console.log('✅ تم ربط نظام PWA بالنظام الرئيسي');
}

// ====== رسالة المطور ======
console.log(`
📱 **نظام PWA للتطبيق الزراعي - الإصدار 3.1**
✅ تم التحديث والتصحيح
✅ متكامل مع المشروع الحالي
✅ دعم Service Worker الصحيح
✅ نظام نقاط للتثبيت
✅ واجهة مستخدم محسنة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ المميزات:
• تثبيت التطبيق على الهاتف (PWA)
• تحديثات تلقائية في الخلفية
• العمل بدون اتصال كامل
• إشعارات التحديثات
• إحصائيات وتحليلات مفصلة
• واجهة تثبيت ذكية
• تكامل مع نظام النقاط
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 أمثلة الاستخدام:
1. pwaHandler.install()
2. pwaHandler.checkUpdates()
3. pwaHandler.getStats()
4. pwaHandler.showInfo()
5. pwaHandler.isPWA()
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 التطبيق يدعم:
• Android (Chrome, Samsung Internet)
• iOS (Safari) - محدود
• Windows (Edge, Chrome)
• macOS (Safari, Chrome)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 المسار: js/core/pwa.js
🔗 متكامل مع: mainBridge, service-worker
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
جميع الحقوق محفوظة © 2026 - المرشد الزراعي الذكي
`);

// ====== تهيئة تلقائية ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 بدء تحميل نظام PWA للتطبيق الزراعي...');
    
    // تهيئة PWA بعد 2 ثانية
    setTimeout(() => {
        try {
            const handler = initPWAHandler();
            console.log('🚀 نظام PWA يعمل بنجاح!');
            
            // إضافة PWA للوحة المطور
            if (window.mainBridge && window.mainBridge.addToDeveloperPanel) {
                window.mainBridge.addToDeveloperPanel('PWA', {
                    title: 'معلومات PWA',
                    icon: 'fas fa-mobile-alt',
                    action: () => handler.showInstallInfo()
                });
            }
            
        } catch (error) {
            console.error('❌ فشل تهيئة نظام PWA:', error);
        }
    }, 2000);
});