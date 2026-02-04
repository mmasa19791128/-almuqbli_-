// ====== الملف الرئيسي لمرشد المزارع الذكي ======
// 🚀 الإصدار 1.0.2026 | فبراير 2026
// 👨‍💻 المطور: محمد مقبل عبدالله سيف
// 📍 اليمن - تعز - ماوية - ذراح

class SmartFarmerApp {
    constructor() {
        this.appInfo = {
            name: 'مرشد المزارع الذكي',
            version: '1.0.2026',
            developer: 'محمد مقبل عبدالله سيف',
            location: 'اليمن - تعز - ماوية - ذراح',
            contact: 'mmasa197911282025@gmail.com'
        };
        
        this.userPoints = 100;
        this.isDarkMode = false;
        this.currentLanguage = 'ar';
        this.chatHistory = [];
        this.isInitialized = false;
        
        console.log(`🌱 ${this.appInfo.name} - الإصدار ${this.appInfo.version}`);
    }
    
    // ====== التهيئة الرئيسية ======
    async initialize() {
        if (this.isInitialized) return;
        
        console.log('🚀 جاري تهيئة التطبيق...');
        
        try {
            // 1. تحميل الإعدادات
            this.loadSettings();
            
            // 2. تهيئة نظام النقاط
            this.initPointsSystem();
            
            // 3. تهيئة نظام الوضع الداكن
            this.initDarkMode();
            
            // 4. تهيئة نظام اللغة
            this.initLanguageSystem();
            
            // 5. تسجيل Service Worker
            this.registerServiceWorker();
            
            // 6. تهيئة AdMob
            this.initAdMob();
            
            // 7. إعداد الأحداث
            this.setupEventListeners();
            
            // 8. إضافة وظائف الجسر
            this.initBridgeFunctions();
            
            // 9. تهيئة نظام التحديث
            this.initUpdateSystem();
            
            // 10. عرض الإشعار الترحيبي
            setTimeout(() => {
                this.showNotification('مرحباً بك في مرشد المزارع الذكي!', 'success');
            }, 1000);
            
            this.isInitialized = true;
            console.log('✅ التطبيق مهيأ بالكامل');
            
            return true;
            
        } catch (error) {
            console.error('❌ فشل تهيئة التطبيق:', error);
            return false;
        }
    }
    
    // ====== نظام النقاط ======
    initPointsSystem() {
        // تحميل النقاط المحفوظة
        const savedPoints = localStorage.getItem('farmer_points');
        if (savedPoints) {
            this.userPoints = parseInt(savedPoints);
        } else {
            localStorage.setItem('farmer_points', this.userPoints.toString());
        }
        
        // تحديث العرض
        this.updatePointsDisplay();
        
        console.log(`💰 النقاط الحالية: ${this.userPoints}`);
    }
    
    updatePointsDisplay() {
        const pointsElements = document.querySelectorAll('#pointsValue, .points-display span');
        pointsElements.forEach(el => {
            el.textContent = this.userPoints;
        });
    }
    
    addPoints(amount, reason = 'نشاط') {
        this.userPoints += amount;
        localStorage.setItem('farmer_points', this.userPoints.toString());
        
        // تحديث العرض
        this.updatePointsDisplay();
        
        // عرض إشعار النقاط
        this.showPointsNotification(amount, reason);
        
        // تسجيل النشاط
        this.logActivity('points_earned', { amount, reason, total: this.userPoints });
        
        console.log(`➕ ${amount} نقطة (${reason}) - الإجمالي: ${this.userPoints}`);
        
        return this.userPoints;
    }
    
    // ====== نظام الوضع الداكن ======
    initDarkMode() {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            this.toggleDarkMode();
        }
    }
    
    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        
        // تحديث الزر
        const darkModeBtn = document.getElementById('darkModeBtn');
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        if (darkModeBtn) {
            darkModeBtn.innerHTML = this.isDarkMode ? 
                '<i class="fas fa-sun"></i>' : 
                '<i class="fas fa-moon"></i>';
        }
        
        if (darkModeToggle) {
            darkModeToggle.checked = this.isDarkMode;
        }
        
        // حفظ الإعداد
        localStorage.setItem('darkMode', this.isDarkMode);
        
        // إشعار
        this.showNotification(
            this.isDarkMode ? 'تم تفعيل الوضع الداكن' : 'تم إيقاف الوضع الداكن',
            'info'
        );
    }
    
    // ====== نظام اللغة ======
    initLanguageSystem() {
        const savedLanguage = localStorage.getItem('app_language');
        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
            this.updateLanguageDisplay();
        }
    }
    
    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('app_language', lang);
        
        // تحديث أزرار اللغة
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.onclick && btn.onclick.toString().includes(`'${lang}'`)) {
                btn.classList.add('active');
            }
        });
        
        this.showNotification(`تم تغيير اللغة إلى ${this.getLanguageName(lang)}`, 'info');
    }
    
    getLanguageName(lang) {
        const languages = {
            'ar': 'العربية',
            'en': 'English',
            'zh': '中文',
            'hi': 'हिन्दी',
            'ru': 'Русский',
            'fr': 'Français'
        };
        return languages[lang] || lang;
    }
    
    updateLanguageDisplay() {
        // سيتم تطويرها لاحقاً
    }
    
    // ====== Service Worker ======
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => {
                    console.log('✅ Service Worker مسجل بنجاح:', reg.scope);
                })
                .catch(err => {
                    console.error('❌ فشل تسجيل Service Worker:', err);
                });
        }
    }
    
    // ====== AdMob ======
    initAdMob() {
        if (typeof adsbygoogle !== 'undefined') {
            setTimeout(() => {
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                    console.log('✅ AdMob جاهز');
                } catch (error) {
                    console.warn('⚠️ خطأ في تحميل AdMob:', error);
                }
            }, 2000);
        }
    }
    
    // ====== نظام الكاميرا ======
    openCamera(type = 'diagnosis') {
        // هذه الوظيفة موجودة في index.html
        if (typeof window.startCamera === 'function') {
            window.openCamera(type);
            this.addPoints(2, 'فتح الكاميرا');
        } else {
            this.showCameraModal(type);
        }
    }
    
    showCameraModal(type) {
        const title = type === 'soil' ? 'كاميرا تحليل التربة' : 'كاميرا التشخيص';
        
        const modalHTML = `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3><i class="fas fa-camera"></i> ${title}</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <div class="modal-content">
                        <div style="text-align: center; padding: 40px 20px;">
                            <div style="font-size: 80px; color: #2E7D32; margin-bottom: 20px;">
                                📷
                            </div>
                            <h3 style="color: #2E7D32; margin-bottom: 15px;">ميزة الكاميرا</h3>
                            <p>هذه الميزة تتطلب كاميرا جهازك</p>
                            <p>يمكنك استخدام كاميرا التشخيص لفحص النباتات</p>
                            <p>وكاميرا التربة لتحليل نوع التربة</p>
                            
                            <div style="margin-top: 30px;">
                                <button onclick="farmerApp.simulateCameraAnalysis('${type}')" 
                                        style="background: #4CAF50; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; cursor: pointer; margin: 5px;">
                                    <i class="fas fa-play"></i> محاكاة التحليل
                                </button>
                                <button onclick="this.closest('.modal-overlay').remove()" 
                                        style="background: #f44336; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; cursor: pointer; margin: 5px;">
                                    <i class="fas fa-times"></i> إغلاق
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const oldModal = document.querySelector('.modal-overlay');
        if (oldModal) oldModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    simulateCameraAnalysis(type) {
        const result = type === 'soil' ? this.getSoilAnalysis() : this.getDiseaseAnalysis();
        
        const resultHTML = `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3><i class="fas fa-check-circle"></i> نتائج التحليل</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <div class="modal-content">
                        ${result}
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.modal-overlay')?.remove();
        document.body.insertAdjacentHTML('beforeend', resultHTML);
        
        this.addPoints(5, `تحليل ${type === 'soil' ? 'التربة' : 'المرض'}`);
    }
    
    getSoilAnalysis() {
        return `
            <div style="padding: 20px;">
                <h3 style="color: #2E7D32; margin-bottom: 20px;">تحليل التربة</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <h4>خصائص التربة:</h4>
                        <p><strong>النوع:</strong> طميية رملية</p>
                        <p><strong>اللون:</strong> بني فاتح</p>
                        <p><strong>الملمس:</strong> متوسط</p>
                        <p><strong>الرطوبة:</strong> 45%</p>
                    </div>
                    <div>
                        <h4>تحليل كيميائي:</h4>
                        <p><strong>درجة الحموضة:</strong> 6.8 (ممتاز)</p>
                        <p><strong>النيتروجين:</strong> متوسط</p>
                        <p><strong>الفسفور:</strong> منخفض</p>
                        <p><strong>البوتاسيوم:</strong> مرتفع</p>
                    </div>
                </div>
                
                <div style="background: #E8F5E9; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <h4 style="color: #1B5E20;">التوصيات:</h4>
                    <ul>
                        <li>أضف أسمدة فسفورية</li>
                        <li>استخدم سماد عضوي</li>
                        <li>الري المعتدل (مرة كل 3-4 أيام)</li>
                    </ul>
                </div>
                
                <button onclick="this.closest('.modal-overlay').remove()" 
                        style="width: 100%; background: #4CAF50; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-check"></i> فهمت
                </button>
            </div>
        `;
    }
    
    getDiseaseAnalysis() {
        return `
            <div style="padding: 20px;">
                <h3 style="color: #2E7D32; margin-bottom: 20px;">تشخيص المرض</h3>
                
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="display: inline-block; background: #FFEBEE; padding: 15px; border-radius: 10px;">
                        <h2 style="color: #C62828;">البياض الدقيقي</h2>
                        <p style="color: #666;">(Powdery Mildew)</p>
                        <div style="margin-top: 10px;">
                            <span style="background: #C62828; color: white; padding: 5px 15px; border-radius: 20px;">مرض فطري</span>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4>الأعراض:</h4>
                    <ul>
                        <li>بقع بيضاء مسحوقية على الأوراق</li>
                        <li>اصفرار وتجعد الأوراق</li>
                        <li>تباطؤ في نمو النبات</li>
                    </ul>
                </div>
                
                <div style="background: #FFF3E0; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <h4 style="color: #EF6C00;">العلاج:</h4>
                    <ol>
                        <li>رش بمبيد فطري</li>
                        <li>إزالة الأوراق المصابة</li>
                        <li>تحسين التهوية</li>
                        <li>تقليل الرطوبة</li>
                    </ol>
                </div>
                
                <button onclick="this.closest('.modal-overlay').remove()" 
                        style="width: 100%; background: #4CAF50; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-check"></i> فهمت
                </button>
            </div>
        `;
    }
    
    // ====== نظام الدردشة الذكية ======
    openAIchat() {
        // استخدام الدالة الموجودة في index.html
        if (typeof window.sendChatMessage === 'function') {
            const chatModal = document.getElementById('chatModal');
            if (chatModal) {
                chatModal.classList.add('active');
                document.getElementById('chatInput')?.focus();
                this.addPoints(1, 'فتح الدردشة');
            }
        } else {
            this.showChatModal();
        }
    }
    
    showChatModal() {
        const modalHTML = `
            <div class="modal-overlay">
                <div class="modal-container" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-robot"></i> الدردشة الذكية</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <div class="modal-content" style="padding: 0;">
                        <div style="height: 300px; overflow-y: auto; padding: 20px;" id="mainChatMessages">
                            <div style="margin-bottom: 15px; max-width: 85%;">
                                <div style="background: #E8F5E9; padding: 12px; border-radius: 15px; border-bottom-right-radius: 5px;">
                                    مرحباً! أنا المساعد الزراعي الذكي. كيف يمكنني مساعدتك اليوم؟
                                </div>
                                <div style="font-size: 11px; color: #666; margin-top: 5px; text-align: right;">الآن</div>
                            </div>
                        </div>
                        
                        <div style="padding: 20px; border-top: 1px solid #eee;">
                            <div style="display: flex; gap: 10px;">
                                <input type="text" id="mainChatInput" placeholder="اكتب سؤالك هنا..." 
                                       style="flex: 1; padding: 12px; border: 2px solid #ddd; border-radius: 25px; font-family: 'Tajawal';">
                                <button onclick="farmerApp.sendMainChatMessage()" 
                                        style="background: #4CAF50; color: white; border: none; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                            
                            <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                                <button onclick="farmerApp.askQuickQuestion('ما هي أفضل طريقة لري النباتات؟')" 
                                        style="background: #FFF3E0; color: #EF6C00; border: 1px solid #FFB74D; padding: 8px 16px; border-radius: 20px; font-size: 13px; cursor: pointer;">
                                    🚰 طرق الري
                                </button>
                                <button onclick="farmerApp.askQuickQuestion('كيف أتعامل مع الآفات الزراعية؟')" 
                                        style="background: #F3E5F5; color: #7B1FA2; border: 1px solid #CE93D8; padding: 8px 16px; border-radius: 20px; font-size: 13px; cursor: pointer;">
                                    🐛 مكافحة الآفات
                                </button>
                                <button onclick="farmerApp.askQuickQuestion('ما هو أفضل سماد للنباتات؟')" 
                                        style="background: #E8F5E9; color: #2E7D32; border: 1px solid #A5D6A7; padding: 8px 16px; border-radius: 20px; font-size: 13px; cursor: pointer;">
                                    🌱 التسميد
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.modal-overlay')?.remove();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        this.addPoints(1, 'فتح الدردشة');
        
        setTimeout(() => {
            document.getElementById('mainChatInput')?.focus();
        }, 100);
    }
    
    sendMainChatMessage() {
        const input = document.getElementById('mainChatInput');
        const message = input?.value.trim();
        if (!message) return;
        
        const messagesContainer = document.getElementById('mainChatMessages');
        if (!messagesContainer) return;
        
        // إضافة رسالة المستخدم
        messagesContainer.innerHTML += `
            <div style="margin-bottom: 15px; max-width: 85%; margin-left: auto;">
                <div style="background: #2E7D32; color: white; padding: 12px; border-radius: 15px; border-bottom-left-radius: 5px;">
                    ${message}
                </div>
                <div style="font-size: 11px; color: #666; margin-top: 5px; text-align: left;">الآن</div>
            </div>
        `;
        
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // إضافة نقاط
        this.addPoints(1, 'رسالة دردشة');
        
        // محاكاة الرد
        setTimeout(() => {
            const response = this.getChatResponse(message);
            messagesContainer.innerHTML += `
                <div style="margin-bottom: 15px; max-width: 85%;">
                    <div style="background: #E8F5E9; padding: 12px; border-radius: 15px; border-bottom-right-radius: 5px;">
                        ${response}
                    </div>
                    <div style="font-size: 11px; color: #666; margin-top: 5px; text-align: right;">الآن</div>
                </div>
            `;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }
    
    askQuickQuestion(question) {
        const input = document.getElementById('mainChatInput');
        if (input) {
            input.value = question;
            this.sendMainChatMessage();
        }
    }
    
    getChatResponse(question) {
        const q = question.toLowerCase();
        
        if (q.includes('ري') || q.includes('سقي')) {
            return '💧 أفضل وقت للري هو الصباح الباكر. اسقِ النباتات عندما تجف التربة السطحية. تجنب الري المسائي لتقليل الأمراض الفطرية.';
        } else if (q.includes('آفات') || q.includes('حشرات')) {
            return '🐛 للوقاية: نظف المنطقة حول النباتات. للمكافحة: استخدم المبيدات العضوية أولاً. افصل النباتات المصابة عن السليمة.';
        } else if (q.includes('سماد') || q.includes('تسميد')) {
            return '🌱 استخدم السماد العضوي (كمبوست) أولاً. للنباتات المثمرة: سماد غني بالبوتاسيوم. للخضروات الورقية: سماد غني بالنيتروجين.';
        } else if (q.includes('تربة')) {
            return '🪴 التربة الجيدة تحتوي على: 40% رمل + 40% طمي + 20% طين. أضف المواد العضوية لتحسين الخصوبة والتهوية.';
        } else if (q.includes('قمح')) {
            return '🌾 القمح: محصول شتوي، يزرع أكتوبر-نوفمبر، يحتاج 150 يوم، تربة طينية جيدة الصرف.';
        } else if (q.includes('طماطم')) {
            return '🍅 الطماطم: محصول صيفي، يزرع فبراير-مارس، يحتاج 90-120 يوم، شمس كاملة، ري منتظم.';
        } else {
            const responses = [
                'هذا سؤال مثير للاهتمام! يمكنني مساعدتك في مواضيع الزراعة والأمراض النباتية.',
                'يمكنك استخدام كاميرا التشخيص لفحص النباتات، أو تصفح مكتبة المحاصيل.',
                'هل تحتاج مساعدة في موضوع زراعي محدد؟',
                'أنا هنا لمساعدتك في جميع استفساراتك الزراعية.'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }
    
    // ====== وظائف الجسر المدمجة ======
    initBridgeFunctions() {
        // جعل الدوال متاحة عالمياً
        window.farmerApp = this;
        
        // وظائف النقاط
        window.addFarmerPoints = (amount, reason) => this.addPoints(amount, reason);
        window.getFarmerPoints = () => this.userPoints;
        
        // وظائف الكاميرا
        window.openFarmerCamera = (type) => this.openCamera(type);
        
        // وظائف الدردشة
        window.openFarmerChat = () => this.openAIchat();
        
        // وظائف التنقل
        window.openFarmerPage = (page) => this.openPage(page);
        
        // وظائف التحديث
        window.checkForUpdates = () => this.checkUpdatesLocal();
        window.forceUpdateCheck = () => this.forceUpdateCheck();
        window.reloadWithUpdate = () => this.reloadWithUpdate();
        
        console.log('✅ وظائف الجسر جاهزة');
    }
    
    // ====== فتح الصفحات ======
    openPage(page) {
        const pages = {
            crops: 'pages/crops.html',
            diseases: 'pages/diseases.html',
            calendar: 'pages/calendar.html',
            market: 'pages/market.html',
            about: 'pages/about.html',
            developer: 'pages/developer.html',
            privacy: 'pages/privacy.html',
            terms: 'pages/terms.html'
        };
        
        if (pages[page]) {
            window.location.href = pages[page];
            this.addPoints(1, `زيارة ${page}`);
        } else {
            this.showNotification(`صفحة ${page} غير متاحة`, 'warning');
        }
    }
    
    // ====== إشعارات النقاط ======
    showPointsNotification(points, reason) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 80px; right: 20px; background: linear-gradient(135deg, #FF9800, #F57C00); color: white; 
                        padding: 12px 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3); z-index: 9999; 
                        animation: slideIn 0.3s ease; font-family: 'Tajawal'; border-right: 4px solid #FFD700;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-coins" style="font-size: 20px;"></i>
                    <div>
                        <div style="font-weight: bold; font-size: 16px;">🎉 +${points} نقطة</div>
                        <small style="opacity: 0.9; font-size: 12px;">${reason}</small>
                    </div>
                </div>
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // ====== الإشعارات العامة ======
    showNotification(message, type = 'info') {
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            warning: '#FF9800',
            info: '#2196F3'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            font-family: 'Tajawal';
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // ====== تحميل الإعدادات ======
    loadSettings() {
        // الوضع الداكن
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'true') {
            this.isDarkMode = true;
            document.body.classList.add('dark-mode');
        }
        
        // اللغة
        const language = localStorage.getItem('app_language');
        if (language) {
            this.currentLanguage = language;
        }
        
        // النقاط
        const points = localStorage.getItem('farmer_points');
        if (points) {
            this.userPoints = parseInt(points);
        }
        
        console.log('⚙️ تم تحميل الإعدادات');
    }
    
    // ====== إعداد المستمعين ======
    setupEventListeners() {
        // زر الوضع الداكن
        const darkModeBtn = document.getElementById('darkModeBtn');
        if (darkModeBtn) {
            darkModeBtn.addEventListener('click', () => this.toggleDarkMode());
        }
        
        // زر القائمة الجانبية
        const menuBtn = document.querySelector('.menu-btn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                document.getElementById('sideMenu').classList.toggle('active');
            });
        }
        
        // إغلاق القائمة
        const closeMenuBtn = document.querySelector('.close-menu');
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                document.getElementById('sideMenu').classList.remove('active');
            });
        }
        
        // أزرار اللغة
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (lang) {
                    this.changeLanguage(lang);
                }
            });
        });
        
        // عناصر القائمة
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                if (href && href.startsWith('pages/')) {
                    this.openPage(href.replace('pages/', '').replace('.html', ''));
                }
            });
        });
        
        console.log('✅ أحداث التطبيق جاهزة');
    }
    
    // ====== تسجيل الأنشطة ======
    logActivity(type, data) {
        try {
            const activity = {
                type,
                data,
                timestamp: new Date().toISOString(),
                app: this.appInfo.name,
                version: this.appInfo.version
            };
            
            const activities = JSON.parse(localStorage.getItem('farmer_activities') || '[]');
            activities.unshift(activity);
            
            if (activities.length > 100) {
                activities.pop();
            }
            
            localStorage.setItem('farmer_activities', JSON.stringify(activities));
            
        } catch (error) {
            console.warn('⚠️ فشل تسجيل النشاط:', error);
        }
    }
    
    // ====== معلومات النظام ======
    getSystemInfo() {
        return {
            ...this.appInfo,
            points: this.userPoints,
            darkMode: this.isDarkMode,
            language: this.currentLanguage,
            initialized: this.isInitialized,
            timestamp: new Date().toISOString()
        };
    }
    
    // ====== نظام التحديث المحلي ======
    initUpdateSystem() {
        console.log('🚀 بدء نظام التحديث المحلي...');
        
        // إعدادات التحديث المحلية
        this.updateConfig = {
            version: this.appInfo.version, // استخدام نفس إصدار التطبيق
            checkInterval: 60 * 60 * 1000, // كل ساعة
            lastVersionKey: 'last_known_version',
            changelog: {
                '1.0.2026': [
                    '🎯 كاميرا التشخيص المباشرة',
                    '💰 نظام النقاط المتكامل',
                    '🔄 التحديث التلقائي',
                    '📱 واجهة مستخدم محسنة'
                ],
                '1.0.2025': [
                    'الإصدار الأول من التطبيق',
                    'كاميرا التشخيص الأساسية',
                    'نظام النقاط الأولي'
                ]
            }
        };
        
        // إضافة الأنيميشن إذا لم تكن موجودة
        if (!document.querySelector('style[data-update-animations]')) {
            const style = document.createElement('style');
            style.setAttribute('data-update-animations', 'true');
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateY(-100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(-100px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // إضافة معلومات التحديث إلى القائمة الجانبية
        this.addUpdateInfoToMenu();
        
        // التحقق عند التحميل
        setTimeout(() => {
            this.checkUpdatesLocal();
        }, 8000); // بعد 8 ثوانٍ
        
        // التحقق كل ساعة
        this.updateInterval = setInterval(() => this.checkUpdatesLocal(), this.updateConfig.checkInterval);
        
        // التحقق عند العودة للتطبيق
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => this.checkUpdatesLocal(), 5000);
            }
        });
        
        console.log('✅ نظام التحديث المحلي جاهز');
    }
    
    // تحقق من التحديثات (بدون ملف خارجي)
    checkUpdatesLocal() {
        const lastVersion = localStorage.getItem(this.updateConfig.lastVersionKey);
        const currentVersion = this.updateConfig.version;
        
        console.log('🔍 التحقق من التحديثات:', { lastVersion, currentVersion });
        
        // إذا كان هذا أول استخدام أو تغير الإصدار
        if (!lastVersion || lastVersion !== currentVersion) {
            console.log('🆕 إصدار جديد:', currentVersion);
            
            // حفظ الإصدار الجديد
            localStorage.setItem(this.updateConfig.lastVersionKey, currentVersion);
            
            // إذا كان أول استخدام، لا تظهر إشعار
            if (!lastVersion) return;
            
            // إشعار التحديث
            this.showLocalUpdateNotification(currentVersion);
            
            // تحديث Service Worker
            this.updateServiceWorker();
            
            return true;
        }
        
        console.log('✅ التطبيق محدث');
        return false;
    }
    
    // إشعار التحديث المحلي
    showLocalUpdateNotification(version) {
        const changes = this.updateConfig.changelog[version] || ['تحسينات عامة في التطبيق'];
        
        const notification = document.createElement('div');
        notification.id = 'localUpdateNotification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #2E7D32);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 9999;
            animation: slideDown 0.5s ease;
            max-width: 400px;
            font-family: 'Tajawal';
            border-right: 5px solid #FFD700;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                <div style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-rocket fa-2x"></i>
                </div>
                <div>
                    <h3 style="margin: 0; font-size: 18px;">تم تحديث التطبيق! 🎉</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">الإصدار ${version}</p>
                </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; font-size: 16px;"><i class="fas fa-list-check"></i> ما الجديد:</h4>
                <ul style="margin: 0; padding-right: 20px;">
                    ${changes.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}
                </ul>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="window.reloadWithUpdate()" style="
                    background: #FFD700;
                    color: #000;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-family: 'Tajawal';
                    font-weight: bold;
                    flex: 2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                ">
                    <i class="fas fa-sync-alt"></i> تطبيق التحديث الآن
                </button>
                <button onclick="window.closeLocalUpdate()" style="
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid white;
                    padding: 12px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-family: 'Tajawal';
                    flex: 1;
                ">
                    لاحقاً
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // إخفاء بعد 1 دقيقة
        setTimeout(() => {
            if (document.getElementById('localUpdateNotification')) {
                this.closeLocalUpdate();
            }
        }, 60000);
    }
    
    // تحديث Service Worker
    updateServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.update().then(() => {
                    console.log('✅ Service Worker تم تحديثه');
                });
            });
        }
    }
    
    // إعادة التحميل مع التحديث
    reloadWithUpdate() {
        this.showNotification('🔄 جاري تطبيق التحديث...', 'info');
        
        // مسح الكاش
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    caches.delete(cacheName);
                });
                console.log('🗑️ تم مسح الكاش القديم');
            });
        }
        
        // إضافة نقاط للتحديث
        this.addPoints(10, 'تحديث التطبيق');
        
        // إعادة التحميل بعد ثانيتين
        setTimeout(() => {
            window.location.reload(true);
        }, 2000);
    }
    
    // إغلاق إشعار التحديث
    closeLocalUpdate() {
        const notification = document.getElementById('localUpdateNotification');
        if (notification) {
            notification.style.animation = 'slideUp 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }
    }
    
    // ====== ✅ إضافة إلى القائمة الجانبية ======
    addUpdateInfoToMenu() {
        setTimeout(() => {
            const menuItems = document.querySelector('.menu-items');
            if (menuItems && !document.getElementById('update-menu-item')) {
                // إضافة معلومات الإصدار
                const versionItem = document.createElement('li');
                versionItem.id = 'update-menu-item';
                versionItem.innerHTML = `
                    <div class="menu-item" style="cursor: default;">
                        <i class="fas fa-code-branch"></i>
                        <span>الإصدار</span>
                        <span style="margin-right: auto; color: #4CAF50; font-weight: bold;">
                            ${this.updateConfig.version}
                        </span>
                    </div>
                `;
                menuItems.appendChild(versionItem);
                
                // إضافة زر التحقق من التحديثات
                const checkItem = document.createElement('li');
                checkItem.innerHTML = `
                    <a href="#" class="menu-item" onclick="window.forceUpdateCheck(); return false;">
                        <i class="fas fa-sync-alt"></i>
                        <span>التحقق من التحديثات</span>
                    </a>
                `;
                menuItems.appendChild(checkItem);
            }
        }, 1000);
    }
    
    // التحقق القسري من التحديثات
    forceUpdateCheck() {
        this.showNotification('🔍 جاري التحقق من التحديثات...', 'info');
        
        // محاكاة تحديث جديد (للاختبار)
        if (Math.random() > 0.7) { // 30% فرصة لعرض تحديث (للاختبار فقط)
            const testVersion = '1.0.' + (2026 + Math.floor(Math.random() * 3));
            this.showLocalUpdateNotification(testVersion);
        } else {
            this.showNotification('✅ التطبيق محدث بأحدث إصدار', 'success');
        }
        
        // إضافة نقاط للتحقق
        this.addPoints(1, 'فحص التحديثات');
    }
}

// ====== التهيئة التلقائية ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌱 بدء تحميل مرشد المزارع الذكي...');
    
    // انتظار تحميل الصفحة
    setTimeout(() => {
        // إنشاء التطبيق
        window.smartFarmerApp = new SmartFarmerApp();
        
        // التهيئة بعد تأخير بسيط
        setTimeout(() => {
            window.smartFarmerApp.initialize();
        }, 500);
        
    }, 1000);
});

// ====== واجهة مبسطة ======
window.SmartFarmer = {
    init: () => window.smartFarmerApp?.initialize(),
    addPoints: (amount, reason) => window.smartFarmerApp?.addPoints(amount, reason),
    getPoints: () => window.smartFarmerApp?.userPoints || 100,
    openCamera: (type) => window.smartFarmerApp?.openCamera(type),
    openChat: () => window.smartFarmerApp?.openAIchat(),
    openPage: (page) => window.smartFarmerApp?.openPage(page),
    toggleDarkMode: () => window.smartFarmerApp?.toggleDarkMode(),
    getInfo: () => window.smartFarmerApp?.getSystemInfo(),
    showNotification: (msg, type) => window.smartFarmerApp?.showNotification(msg, type),
    checkUpdates: () => window.smartFarmerApp?.checkUpdatesLocal(),
    forceUpdate: () => window.smartFarmerApp?.forceUpdateCheck()
};

console.log('✅ مرشد المزارع الذكي - الملف الرئيسي محمل!');

// دالة مساعدة للوصول السريع
window.closeLocalUpdate = function() {
    window.smartFarmerApp?.closeLocalUpdate();
};