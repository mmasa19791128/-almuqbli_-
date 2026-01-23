// ============================================
// js/core/app.js - الإصدار الآمن (بدون تضارب)
// ============================================

// منع التحميل المزدوج
if (typeof window.APP_EXTRA_INITIALIZED !== 'undefined') {
    console.warn('⚠️ AppExtra already loaded, skipping...');
} else {
    window.APP_EXTRA_INITIALIZED = true;

    console.log('🚀 js/core/app.js loading...');

    // ====== ميزات إضافية آمنة فقط ======
    class AppExtraFeatures {
        constructor() {
            this.version = '1.3.0';
            this.features = {
                lazyLoad: true,
                performance: true,
                analytics: true,
                backup: true,
                pointsBridge: true,
                offlineSupport: true
            };
        }
        
        // 1. جسر بين الإعلانات والنقاط (مهم جداً)
        initAdPointsBridge() {
            if (!this.features.pointsBridge) return;
            
            console.log('💰 جاري إعداد جسر الإعلانات والنقاط...');
            
            // مستمع لأحداث نظام الإعلانات
            document.addEventListener('pointsAdded', (event) => {
                const { points, totalPoints } = event.detail || {};
                if (points && totalPoints) {
                    console.log(`💰 Ad Points: +${points} points`);
                    
                    // تحديث جميع عناصر النقاط في الواجهة
                    this.updateAllPointsUI(totalPoints);
                    
                    // إشعار للمستخدم
                    if (window.showToast) {
                        window.showToast(`🎉 ربحت ${points} نقطة!`, 'success');
                    }
                }
            });
            
            // مستمع لإعلانات المكافآت
            document.addEventListener('rewardEarned', (event) => {
                const { points } = event.detail || {};
                if (points) {
                    console.log(`🎬 Video Reward: +${points} points`);
                }
            });
            
            // مستمع لأخطاء الإعلانات
            document.addEventListener('adError', (event) => {
                console.error('❌ Ad Error:', event.detail);
                if (window.showToast) {
                    window.showToast('حدث خطأ في الإعلان', 'error');
                }
            });
            
            console.log('✅ Ad-Points bridge activated');
        }
        
        // تحديث جميع عناصر النقاط في الواجهة
        updateAllPointsUI(totalPoints) {
            // تحديث جميع عناصر النقاط
            const pointsElements = document.querySelectorAll('.points-value, #userPoints, #sidebarPoints, #totalPoints');
            pointsElements.forEach(el => {
                if (el) el.textContent = totalPoints;
            });
            
            // إظهار عداد النقاط إذا كان مخفياً
            const pointsCounter = document.getElementById('pointsCounter');
            if (pointsCounter) {
                pointsCounter.style.display = 'flex';
                
                // تأثير مرئي
                pointsCounter.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    pointsCounter.style.animation = '';
                }, 500);
            }
            
            // تحديث نقاط القائمة الجانبية
            const sidebarPoints = document.getElementById('sidebarPoints');
            if (sidebarPoints) sidebarPoints.textContent = totalPoints;
        }
        
        // 2. نظام النسخ الاحتياطي التلقائي
        initBackupSystem() {
            if (!this.features.backup) return;
            
            // نسخ احتياطي كل ساعة
            setInterval(() => {
                const userData = {
                    points: localStorage.getItem('userPoints'),
                    settings: {
                        theme: localStorage.getItem('theme'),
                        language: localStorage.getItem('language'),
                        notifications: localStorage.getItem('notifications')
                    },
                    activities: JSON.parse(localStorage.getItem('pointsActivities') || '[]'),
                    timestamp: new Date().toISOString()
                };
                
                // حفظ نسخة احتياطية
                const backupKey = `app_backup_${Date.now()}`;
                localStorage.setItem(backupKey, JSON.stringify(userData));
                
                // الاحتفاظ بآخر 5 نسخ فقط
                this.cleanOldBackups();
                
            }, 60 * 60 * 1000); // كل ساعة
            
            console.log('✅ Auto-backup system activated (every hour)');
        }
        
        // تنظيف النسخ القديمة
        cleanOldBackups() {
            const backupKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('app_backup_')) {
                    backupKeys.push(key);
                }
            }
            
            // احذف النسخ القديمة إذا كان هناك أكثر من 5
            if (backupKeys.length > 5) {
                backupKeys.sort().slice(0, backupKeys.length - 5).forEach(key => {
                    localStorage.removeItem(key);
                });
            }
        }
        
        // 3. إحصائيات الاستخدام المجهولة
        initAnalytics() {
            if (!this.features.analytics) return;
            
            // تسجيل زيارات الصفحات
            const trackPageView = (pageName) => {
                try {
                    const stats = JSON.parse(localStorage.getItem('app_analytics') || '{"pageViews": {}, "totalViews": 0}');
                    stats.pageViews[pageName] = (stats.pageViews[pageName] || 0) + 1;
                    stats.totalViews++;
                    stats.lastVisit = new Date().toISOString();
                    localStorage.setItem('app_analytics', JSON.stringify(stats));
                    
                } catch (error) {
                    console.warn('⚠️ فشل تسجيل إحصائيات:', error);
                }
            };
            
            // مستمع لتغيير الصفحات
            document.addEventListener('pageChanged', (e) => {
                if (e.detail && e.detail.page) {
                    trackPageView(e.detail.page);
                }
            });
            
            console.log('✅ Anonymous analytics activated');
        }
        
        // 4. وضع عدم الاتصال المحسن
        initOfflineSupport() {
            if (!this.features.offlineSupport) return;
            
            // مستمع للاتصال
            window.addEventListener('offline', () => {
                this.showOfflineNotification();
                
                // حفظ حالة عدم الاتصال
                localStorage.setItem('last_offline', new Date().toISOString());
            });
            
            window.addEventListener('online', () => {
                this.hideOfflineNotification();
                
                // مكافأة العودة للاتصال (1 نقطة)
                setTimeout(() => {
                    const lastOffline = localStorage.getItem('last_offline');
                    if (lastOffline) {
                        const offlineTime = new Date(lastOffline);
                        const now = new Date();
                        const hoursDiff = (now - offlineTime) / (1000 * 60 * 60);
                        
                        if (hoursDiff > 1) { // إذا كان غير متصل لأكثر من ساعة
                            this.addConnectionBonus();
                        }
                    }
                }, 2000);
            });
            
            console.log('✅ Enhanced offline support activated');
        }
        
        // إشعار عدم الاتصال
        showOfflineNotification() {
            const existing = document.getElementById('offline-notification');
            if (existing) return;
            
            const notification = document.createElement('div');
            notification.id = 'offline-notification';
            notification.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                left: 20px;
                background: #FF9800;
                color: white;
                padding: 12px;
                border-radius: 10px;
                text-align: center;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                animation: slideUp 0.3s ease;
            `;
            notification.innerHTML = `
                <i class="fas fa-wifi-slash"></i>
                أنت غير متصل بالإنترنت - بعض الميزات قد لا تعمل
            `;
            
            document.body.appendChild(notification);
        }
        
        hideOfflineNotification() {
            const notification = document.getElementById('offline-notification');
            if (notification) {
                notification.style.animation = 'slideDown 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }
        
        // مكافأة العودة للاتصال
        addConnectionBonus() {
            const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
            const newPoints = currentPoints + 1;
            localStorage.setItem('userPoints', newPoints.toString());
            
            // تحديث الواجهة
            this.updateAllPointsUI(newPoints.toString());
            
            // إشعار
            if (window.showToast) {
                window.showToast('🎁 مكافأة العودة للاتصال: +1 نقطة', 'success');
            }
            
            // تسجيل النشاط
            this.logActivity('مكافأة العودة للاتصال', 1);
        }
        
        // 5. تسجيل النشاطات
        logActivity(activity, points) {
            try {
                const activities = JSON.parse(localStorage.getItem('pointsActivities') || '[]');
                activities.unshift({
                    activity,
                    points,
                    timestamp: new Date().toISOString()
                });
                
                // الاحتفاظ بآخر 50 نشاط فقط
                if (activities.length > 50) {
                    activities.pop();
                }
                
                localStorage.setItem('pointsActivities', JSON.stringify(activities));
                
            } catch (error) {
                console.warn('⚠️ فشل تسجيل النشاط:', error);
            }
        }
        
        // 6. تحسينات الأداء
        initPerformance() {
            if (!this.features.performance) return;
            
            // تحميل كسول للصور
            this.initLazyLoad();
            
            // إدارة الذاكرة
            this.manageMemory();
            
            console.log('✅ Performance optimizations activated');
        }
        
        initLazyLoad() {
            const lazyImages = document.querySelectorAll('img[data-src]');
            if (lazyImages.length === 0) return;
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
        
        manageMemory() {
            // تنظيف الصور القديمة من الذاكرة
            window.addEventListener('beforeunload', () => {
                document.querySelectorAll('img').forEach(img => {
                    img.src = '';
                });
            });
        }
        
        // 7. تهيئة جميع الميزات
        init() {
            console.log(`🚀 AppExtra v${this.version} initializing...`);
            
            try {
                // تفعيل الميزات بالتسلسل
                this.initAdPointsBridge();    // 🔥 الأهم
                this.initBackupSystem();      // 🔄 النسخ الاحتياطي
                this.initAnalytics();         // 📊 الإحصائيات
                this.initOfflineSupport();    // 📶 وضع عدم الاتصال
                this.initPerformance();       // ⚡ الأداء
                
                console.log('✅ AppExtra initialized successfully');
                
                // إرسال حدث نجاح التحميل
                setTimeout(() => {
                    const event = new CustomEvent('appExtraLoaded', {
                        detail: { version: this.version, time: new Date().toISOString() }
                    });
                    document.dispatchEvent(event);
                }, 1000);
                
                return this;
                
            } catch (error) {
                console.error('❌ Error initializing AppExtra:', error);
                return this;
            }
        }
    }

    // ====== وظائف مساعدة عالمية آمنة ======
    window.appHelpers = {
        // نسخ للنصوص
        copyToClipboard: (text) => {
            navigator.clipboard.writeText(text).then(() => {
                console.log('📋 Text copied:', text);
                if (window.showToast) {
                    window.showToast('تم نسخ النص', 'success');
                }
            }).catch(err => {
                console.error('❌ Failed to copy:', err);
            });
        },
        
        // مشاركة التطبيق
        shareApp: () => {
            if (navigator.share) {
                navigator.share({
                    title: 'المرشد الزراعي الذكي',
                    text: 'تطبيق زراعي متكامل مع الذكاء الاصطناعي والإعلانات الحقيقية',
                    url: window.location.href
                }).catch(err => {
                    console.log('❌ Share cancelled:', err);
                });
            } else {
                // Fallback: نسخ الرابط
                navigator.clipboard.writeText(window.location.href);
                if (window.showToast) {
                    window.showToast('📋 تم نسخ رابط التطبيق', 'success');
                }
            }
        },
        
        // فحص تحديثات Service Worker
        checkForUpdates: () => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration().then(reg => {
                    if (reg) {
                        reg.update();
                        console.log('🔄 Checking for updates...');
                        if (window.showToast) {
                            window.showToast('جاري التحقق من التحديثات...', 'info');
                        }
                    }
                });
            }
        },
        
        // تحويل التاريخ العربي
        formatArabicDate: (date) => {
            const d = new Date(date);
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return d.toLocaleDateString('ar-SA', options);
        }
    };

    // ====== التهيئة التلقائية الآمنة ======
    // انتظر حتى يكون كل شيء جاهزاً
    setTimeout(() => {
        // التحقق من عدم وجود تضارب
        if (typeof window.AppExtra !== 'undefined') {
            console.warn('⚠️ AppExtra already exists, skipping initialization');
            return;
        }
        
        // إنشاء وتفعيل الميزات الإضافية
        window.AppExtra = new AppExtraFeatures().init();
        
        console.log('✅ js/core/app.js loaded successfully');
        
    }, 3000); // تأخير 3 ثواني بعد تحميل كل شيء

    // ====== رسالة نجاح التحميل ======
    console.log(`
    🎯 **AppExtra Features Loaded**
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ✅ Ad-Points Bridge      - ربط الإعلانات بالنقاط
    ✅ Auto Backup System    - نسخ احتياطي تلقائي
    ✅ Anonymous Analytics   - إحصائيات مجهولة
    ✅ Offline Support       - دعم عدم الاتصال
    ✅ Performance           - تحسينات الأداء
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📱 Ready for AdMob Integration
    💰 Points System: Active
    📊 Analytics: Anonymous
    🔐 Secure & Safe
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);

    // ====== CSS للأنيميشن ======
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateY(100px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100px); opacity: 0; }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
}