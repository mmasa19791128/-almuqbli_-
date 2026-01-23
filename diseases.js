// ====== نظام تفاصيل الأمراض الزراعية ======
// 🦠 الإصدار 2.1 | يناير 2026 | معدل ومتكامل

class DiseasesDetails {
    constructor() {
        this.currentDisease = null;
        this.diseaseHistory = [];
        this.bookmarkedDiseases = [];
        this.treatmentHistory = [];
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        // الانتظار حتى تحميل البيانات الرئيسية
        await this.waitForGlobalData();
        
        // تحميل البيانات المحلية
        this.loadBookmarks();
        this.loadHistory();
        this.loadTreatmentHistory();
        
        this.isInitialized = true;
        console.log('✅ نظام تفاصيل الأمراض جاهز');
    }
    
    // الانتظار حتى تحميل البيانات
    waitForGlobalData() {
        return new Promise((resolve) => {
            const checkData = () => {
                if (window.agricultureData && window.agricultureData.isReady) {
                    resolve();
                } else {
                    setTimeout(checkData, 100);
                }
            };
            checkData();
        });
    }
    
    // عرض تفاصيل المرض
    showDiseaseDetail(diseaseId) {
        // إذا لم يكن التطبيق جاهزاً، قم بتحميل الصفحة المناسبة
        if (!this.isInitialized) {
            this.redirectToDiseasePage(diseaseId);
            return;
        }
        
        const disease = this.getDiseaseById(diseaseId);
        if (!disease) {
            this.showError('المرض غير موجود في قاعدة البيانات');
            return;
        }
        
        this.currentDisease = disease;
        this.addToHistory(disease);
        
        // التحقق من الصفحة الحالية
        if (this.isOnDiseasesPage()) {
            this.createDiseaseDetailView(disease);
        } else {
            this.redirectToDiseasePage(diseaseId);
        }
    }
    
    // الحصول على المرض بالمعرف
    getDiseaseById(diseaseId) {
        // محاولة من البيانات المحلية أولاً
        if (window.agricultureData && window.agricultureData.getDiseaseById) {
            return window.agricultureData.getDiseaseById(diseaseId);
        }
        
        // البحث في البيانات المحفوظة
        const diseases = this.getAllDiseases();
        return diseases.find(d => d.id == diseaseId);
    }
    
    // الحصول على جميع الأمراض
    getAllDiseases() {
        if (window.agricultureData && window.agricultureData.diseases) {
            return window.agricultureData.diseases;
        }
        
        // بيانات افتراضية احتياطية
        return this.getFallbackDiseases();
    }
    
    // إنشاء واجهة التفاصيل
    createDiseaseDetailView(disease) {
        const container = document.createElement('div');
        container.className = 'disease-detail-container';
        container.innerHTML = this.generateDiseaseDetailHTML(disease);
        
        // البحث عن حاوية العرض
        const displayContainer = this.getDisplayContainer();
        if (displayContainer) {
            displayContainer.innerHTML = '';
            displayContainer.appendChild(container);
            
            // إضافة الأحداث
            this.attachDiseaseEvents(disease);
        } else {
            console.error('❌ لم يتم العثور على حاوية العرض');
        }
    }
    
    // الحصول على حاوية العرض
    getDisplayContainer() {
        // محاولة إيجاد الحاوية المناسبة
        const containers = [
            document.getElementById('mainContent'),
            document.getElementById('diseaseDetailContainer'),
            document.querySelector('.page.active .page-content'),
            document.querySelector('main')
        ];
        
        return containers.find(container => container !== null);
    }
    
    // توليد HTML للتفاصيل
    generateDiseaseDetailHTML(disease) {
        const affectedCrops = this.getAffectedCrops(disease.affectedCrops || []);
        const severityColor = this.getSeverityColor(disease.severity);
        
        // التأكد من وجود بيانات العلاج
        const treatments = Array.isArray(disease.treatment) ? disease.treatment : 
                          disease.treatment ? [disease.treatment] : ['لم يتم تحديد علاج'];
        
        // التأكد من وجود بيانات الأعراض
        const symptoms = Array.isArray(disease.symptoms) ? disease.symptoms : 
                        disease.symptoms ? [disease.symptoms] : ['لم يتم تحديد أعراض'];
        
        // التأكد من وجود بيانات الأسباب
        const causes = Array.isArray(disease.causes) ? disease.causes : 
                      disease.causes ? [disease.causes] : ['لم يتم تحديد أسباب'];
        
        // التأكد من وجود بيانات الوقاية
        const prevention = Array.isArray(disease.prevention) ? disease.prevention : 
                          disease.prevention ? [disease.prevention] : ['لم يتم تحديد طرق وقائية'];
        
        return `
            <div class="disease-detail-header" style="
                background: linear-gradient(135deg, ${severityColor}, #D32F2F);
                color: white;
                padding: 2rem;
                border-radius: 15px 15px 0 0;
            ">
                <div style="text-align: center; margin-bottom: 1rem;">
                    <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">
                        ${this.getDiseaseIcon(disease.severity)}
                    </div>
                    <h2 style="margin-bottom: 0.5rem;">${disease.name || 'مرض غير معروف'}</h2>
                    <p style="opacity: 0.9; font-style: italic;">${disease.scientificName || ''}</p>
                </div>
                
                <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
                    <button class="btn-bookmark" data-disease-id="${disease.id}" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 0.5rem 1.5rem;
                        border-radius: 25px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        transition: all 0.3s;
                    ">
                        <i class="fas fa-bookmark"></i>
                        <span>حفظ</span>
                    </button>
                    
                    <button class="btn-share-disease" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 0.5rem 1.5rem;
                        border-radius: 25px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        transition: all 0.3s;
                    ">
                        <i class="fas fa-share-alt"></i>
                        <span>مشاركة</span>
                    </button>
                    
                    <div class="severity-badge" style="
                        background: rgba(255,255,255,0.3);
                        padding: 0.5rem 1.5rem;
                        border-radius: 25px;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    ">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>خطورة: ${disease.severity || 'غير محددة'}</span>
                    </div>
                </div>
            </div>
            
            <div class="disease-detail-content" style="padding: 2rem;">
                <!-- المحاصيل المصابة -->
                ${affectedCrops.length > 0 ? `
                <div class="affected-crops-section" style="margin-bottom: 2rem;">
                    <h3 style="color: #D32F2F; margin-bottom: 1rem;">
                        <i class="fas fa-leaf"></i> المحاصيل المصابة
                    </h3>
                    <div class="crops-grid" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 1rem;
                    ">
                        ${affectedCrops.map(crop => `
                            <div class="crop-item" style="
                                background: #FFEBEE;
                                padding: 1rem;
                                border-radius: 8px;
                                border-left: 4px solid #D32F2F;
                                cursor: pointer;
                                transition: all 0.3s;
                            " onclick="window.diseasesDetails.showCropDetail(${crop.id})">
                                <div style="text-align: center;">
                                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${crop.icon || '🌱'}</div>
                                    <div style="font-weight: bold; color: #C62828;">${crop.name}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <!-- الوصف -->
                ${disease.description ? `
                <div class="description-section" style="margin-bottom: 2rem;">
                    <h3 style="color: #D32F2F; margin-bottom: 1rem;">
                        <i class="fas fa-info-circle"></i> الوصف
                    </h3>
                    <div style="
                        background: #F5F5F5;
                        padding: 1.5rem;
                        border-radius: 10px;
                        border-right: 4px solid #D32F2F;
                    ">
                        <p style="line-height: 1.6; color: #555; margin: 0;">${disease.description}</p>
                    </div>
                </div>
                ` : ''}
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                    <!-- الأعراض -->
                    <div class="symptoms-section">
                        <h3 style="color: #F44336; margin-bottom: 1rem;">
                            <i class="fas fa-exclamation-triangle"></i> الأعراض
                        </h3>
                        <div style="
                            background: #FFEBEE;
                            padding: 1.5rem;
                            border-radius: 10px;
                            height: 100%;
                        ">
                            <ul style="padding-right: 1.5rem; margin: 0;">
                                ${symptoms.map(symptom => `
                                    <li style="margin-bottom: 0.75rem; color: #555; display: flex; align-items: flex-start; gap: 0.5rem;">
                                        <i class="fas fa-circle" style="color: #F44336; font-size: 0.6rem; margin-top: 0.5rem;"></i>
                                        <span>${symptom}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <!-- الأسباب -->
                    <div class="causes-section">
                        <h3 style="color: #FF9800; margin-bottom: 1rem;">
                            <i class="fas fa-search"></i> الأسباب
                        </h3>
                        <div style="
                            background: #FFF3E0;
                            padding: 1.5rem;
                            border-radius: 10px;
                            height: 100%;
                        ">
                            <ul style="padding-right: 1.5rem; margin: 0;">
                                ${causes.map(cause => `
                                    <li style="margin-bottom: 0.75rem; color: #555; display: flex; align-items: flex-start; gap: 0.5rem;">
                                        <i class="fas fa-circle" style="color: #FF9800; font-size: 0.6rem; margin-top: 0.5rem;"></i>
                                        <span>${cause}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- العلاج -->
                <div class="treatment-section" style="margin: 2rem 0;">
                    <h3 style="color: #4CAF50; margin-bottom: 1rem;">
                        <i class="fas fa-medkit"></i> العلاج
                    </h3>
                    
                    <div style="
                        background: #E8F5E9;
                        padding: 1.5rem;
                        border-radius: 10px;
                        border-right: 4px solid #4CAF50;
                    ">
                        <h4 style="color: #2E7D32; margin-bottom: 1rem;">العلاج:</h4>
                        <ul style="padding-right: 1.5rem; margin-bottom: 1.5rem;">
                            ${treatments.map(t => `
                                <li style="margin-bottom: 0.75rem; color: #555;">${t}</li>
                            `).join('')}
                        </ul>
                        
                        ${disease.organicTreatment ? `
                            <h4 style="color: #2E7D32; margin-bottom: 1rem;">العلاج العضوي:</h4>
                            <ul style="padding-right: 1.5rem;">
                                ${(Array.isArray(disease.organicTreatment) ? disease.organicTreatment : [disease.organicTreatment])
                                  .map(ot => `
                                    <li style="margin-bottom: 0.75rem; color: #555;">${ot}</li>
                                `).join('')}
                            </ul>
                        ` : ''}
                    </div>
                </div>
                
                <!-- الوقاية -->
                <div class="prevention-section" style="margin-bottom: 2rem;">
                    <h3 style="color: #2196F3; margin-bottom: 1rem;">
                        <i class="fas fa-shield-alt"></i> الوقاية
                    </h3>
                    
                    <div style="
                        background: #E3F2FD;
                        padding: 1.5rem;
                        border-radius: 10px;
                        border-right: 4px solid #2196F3;
                    ">
                        <div class="prevention-grid" style="
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                            gap: 1rem;
                        ">
                            ${prevention.map((prevention, index) => `
                                <div class="prevention-item" style="
                                    background: white;
                                    padding: 1rem;
                                    border-radius: 8px;
                                    border-top: 3px solid #2196F3;
                                ">
                                    <div style="
                                        width: 30px;
                                        height: 30px;
                                        background: #2196F3;
                                        color: white;
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        margin-bottom: 0.5rem;
                                        font-weight: bold;
                                    ">
                                        ${index + 1}
                                    </div>
                                    <p style="margin: 0; color: #555;">${prevention}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- معلومات إضافية -->
                <div class="additional-info" style="
                    background: #F5F5F5;
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin-bottom: 2rem;
                ">
                    <h3 style="color: #9C27B0; margin-bottom: 1rem;">
                        <i class="fas fa-chart-line"></i> معلومات إضافية
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        ${disease.season ? `
                        <div class="info-item">
                            <div style="color: #666; margin-bottom: 0.5rem;">الموسم</div>
                            <div style="font-weight: bold; color: #9C27B0;">${disease.season}</div>
                        </div>
                        ` : ''}
                        
                        ${disease.temperatureRange ? `
                        <div class="info-item">
                            <div style="color: #666; margin-bottom: 0.5rem;">درجة الحرارة</div>
                            <div style="font-weight: bold; color: #9C27B0;">${disease.temperatureRange}</div>
                        </div>
                        ` : ''}
                        
                        ${disease.humidity ? `
                        <div class="info-item">
                            <div style="color: #666; margin-bottom: 0.5rem;">الرطوبة</div>
                            <div style="font-weight: bold; color: #9C27B0;">${disease.humidity}</div>
                        </div>
                        ` : ''}
                        
                        <div class="info-item">
                            <div style="color: #666; margin-bottom: 0.5rem;">نوع المسبب</div>
                            <div style="font-weight: bold; color: #9C27B0;">${disease.scientificName ? this.getPathogenType(disease.scientificName) : 'غير معروف'}</div>
                        </div>
                    </div>
                </div>
                
                <!-- زر العودة -->
                <div style="text-align: center; margin-top: 3rem;">
                    <button class="btn-back-diseases" style="
                        background: #2E7D32;
                        color: white;
                        border: none;
                        padding: 1rem 3rem;
                        border-radius: 25px;
                        font-size: 1.1rem;
                        cursor: pointer;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        transition: all 0.3s;
                    ">
                        <i class="fas fa-arrow-right"></i>
                        العودة للأمراض
                    </button>
                </div>
            </div>
        `;
    }
    
    // الحصول على المحاصيل المصابة
    getAffectedCrops(cropIds) {
        if (!cropIds || !Array.isArray(cropIds) || cropIds.length === 0) {
            return [];
        }
        
        if (!window.agricultureData) {
            return cropIds.map(id => ({ id: id, name: `محصول ${id}`, icon: '🌱' }));
        }
        
        return cropIds
            .map(id => {
                const crop = window.agricultureData.getCropById ? 
                    window.agricultureData.getCropById(id) : 
                    null;
                
                if (crop) {
                    return crop;
                } else {
                    return { id: id, name: `محصول ${id}`, icon: '🌱' };
                }
            })
            .filter(crop => crop !== undefined && crop !== null);
    }
    
    // الحصول على لون الخطورة
    getSeverityColor(severity) {
        const colors = {
            'مرتفع جداً': '#D32F2F',
            'مرتفع': '#F44336',
            'متوسط': '#FF9800',
            'منخفض': '#4CAF50',
            'قليل': '#2196F3',
            'عالية': '#D32F2F',
            'متوسطة': '#FF9800',
            'منخفضة': '#4CAF50'
        };
        
        return colors[severity] || '#757575';
    }
    
    // الحصول على أيقونة المرض
    getDiseaseIcon(severity) {
        const icons = {
            'مرتفع جداً': '🦠',
            'مرتفع': '💀',
            'متوسط': '⚠️',
            'منخفض': '🤒',
            'قليل': '🤧',
            'عالية': '🦠',
            'متوسطة': '⚠️',
            'منخفضة': '🤒'
        };
        
        return icons[severity] || '🦠';
    }
    
    // الحصول على نوع المسبب
    getPathogenType(scientificName) {
        if (!scientificName) return 'غير معروف';
        
        const types = {
            'Puccinia': 'فطر',
            'Xanthomonas': 'بكتيريا',
            'Fusarium': 'فطر',
            'Phytophthora': 'فطر مائي',
            'Spodoptera': 'حشرة',
            'fungus': 'فطر',
            'bacteria': 'بكتيريا',
            'virus': 'فيروس',
            'insect': 'حشرة'
        };
        
        const lowerName = scientificName.toLowerCase();
        for (const [key, type] of Object.entries(types)) {
            if (lowerName.includes(key.toLowerCase())) {
                return type;
            }
        }
        
        return 'ممرض نباتي';
    }
    
    // إرفاق الأحداث
    attachDiseaseEvents(disease) {
        // زر الحفظ
        const bookmarkBtn = document.querySelector('.btn-bookmark');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => this.toggleBookmark(disease.id));
            this.updateBookmarkButton(disease.id, bookmarkBtn);
        }
        
        // زر المشاركة
        const shareBtn = document.querySelector('.btn-share-disease');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareDisease(disease));
        }
        
        // زر العودة
        const backBtn = document.querySelector('.btn-back-diseases');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goBackToDiseases());
        }
        
        // زر تسجيل العلاج (يتم إضافته فقط إذا كان هناك محاصيل مصابة)
        if (disease.affectedCrops && disease.affectedCrops.length > 0) {
            const recordBtn = document.createElement('button');
            recordBtn.innerHTML = '<i class="fas fa-plus"></i> تسجيل حالة علاج';
            recordBtn.style.cssText = `
                position: fixed;
                bottom: 100px;
                left: 20px;
                background: #4CAF50;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 999;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: 'Tajawal', sans-serif;
                transition: all 0.3s;
            `;
            
            recordBtn.addEventListener('mouseenter', () => {
                recordBtn.style.transform = 'translateY(-2px)';
                recordBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
            });
            
            recordBtn.addEventListener('mouseleave', () => {
                recordBtn.style.transform = 'translateY(0)';
                recordBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            });
            
            recordBtn.addEventListener('click', () => this.showTreatmentForm(disease));
            document.body.appendChild(recordBtn);
        }
    }
    
    // التبديل بين المحفوظات
    toggleBookmark(diseaseId) {
        const index = this.bookmarkedDiseases.indexOf(diseaseId);
        
        if (index === -1) {
            // إضافة للمحفوظات
            this.bookmarkedDiseases.push(diseaseId);
            this.showToast('تم إضافة المرض للمحفوظات', 'success');
        } else {
            // إزالة من المحفوظات
            this.bookmarkedDiseases.splice(index, 1);
            this.showToast('تم إزالة المرض من المحفوظات', 'info');
        }
        
        // حفظ المحفوظات
        this.saveBookmarks();
        
        // تحديث الزر
        const bookmarkBtn = document.querySelector('.btn-bookmark');
        if (bookmarkBtn) {
            this.updateBookmarkButton(diseaseId, bookmarkBtn);
        }
    }
    
    // تحديث زر الحفظ
    updateBookmarkButton(diseaseId, button) {
        const isBookmarked = this.bookmarkedDiseases.includes(diseaseId);
        
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        
        if (isBookmarked) {
            icon.className = 'fas fa-bookmark';
            icon.style.color = '#FFD700';
            text.textContent = 'محفوظ';
            button.style.background = 'rgba(255, 215, 0, 0.2)';
            button.style.borderColor = '#FFD700';
        } else {
            icon.className = 'far fa-bookmark';
            icon.style.color = 'white';
            text.textContent = 'حفظ';
            button.style.background = 'rgba(255,255,255,0.2)';
            button.style.borderColor = 'white';
        }
    }
    
    // مشاركة المرض
    shareDisease(disease) {
        const shareData = {
            title: `مرض ${disease.name}`,
            text: `تعرف على مرض ${disease.name} وأعراضه وعلاجه - ${disease.description ? disease.description.substring(0, 100) + '...' : 'مرض نباتي'}`,
            url: `${window.location.origin}${window.location.pathname}#disease=${disease.id}`
        };
        
        if (navigator.share && navigator.share instanceof Function) {
            navigator.share(shareData)
                .then(() => console.log('تمت مشاركة المرض بنجاح'))
                .catch(error => {
                    console.log('فشلت المشاركة:', error);
                    this.copyToClipboard(shareData.url);
                });
        } else {
            this.copyToClipboard(shareData.url);
        }
    }
    
    // نسخ للنص للحافظة
    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => this.showToast('تم نسخ الرابط للحافظة', 'info'))
            .catch(() => {
                // طريقة بديلة للنسخ
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showToast('تم نسخ الرابط للحافظة', 'info');
            });
    }
    
    // عرض تفاصيل المحصول
    showCropDetail(cropId) {
        if (window.mainBridge && window.mainBridge.showCropDetail) {
            window.mainBridge.showCropDetail(cropId);
        } else if (window.cropsDetails && window.cropsDetails.show) {
            window.cropsDetails.show(cropId);
        } else {
            window.location.href = `index.html#crops&crop=${cropId}`;
        }
    }
    
    // العودة للأمراض
    goBackToDiseases() {
        if (window.mainBridge && window.mainBridge.showPage) {
            window.mainBridge.showPage('diseases');
        } else {
            window.history.back();
        }
    }
    
    // التحقق من وجودنا في صفحة الأمراض
    isOnDiseasesPage() {
        const currentPage = document.querySelector('.page.active');
        return currentPage && (
            currentPage.id === 'diseasesPage' || 
            currentPage.dataset.page === 'diseases' ||
            window.location.hash.includes('diseases')
        );
    }
    
    // توجيه لصفحة المرض
    redirectToDiseasePage(diseaseId) {
        if (window.mainBridge && window.mainBridge.showDiseaseDetail) {
            window.mainBridge.showDiseaseDetail(diseaseId);
        } else {
            window.location.href = `index.html#diseases&disease=${diseaseId}`;
        }
    }
    
    // حفظ العلاج
    saveTreatment(diseaseId) {
        const cropSelect = document.getElementById('treatedCrop');
        const treatmentText = document.getElementById('treatmentUsed');
        const resultRadio = document.querySelector('input[name="result"]:checked');
        const notesText = document.getElementById('treatmentNotes');
        
        if (!cropSelect || !treatmentText || !resultRadio) {
            this.showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        const cropId = cropSelect.value;
        const treatment = treatmentText.value;
        const result = resultRadio.value;
        const notes = notesText ? notesText.value : '';
        
        if (!cropId || !treatment.trim() || !result) {
            this.showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        const treatmentRecord = {
            id: Date.now(),
            diseaseId: diseaseId,
            cropId: parseInt(cropId),
            treatment: treatment.trim(),
            result: result,
            notes: notes.trim(),
            date: new Date().toISOString(),
            location: localStorage.getItem('user_location') || 'غير محدد'
        };
        
        this.treatmentHistory.unshift(treatmentRecord);
        this.saveTreatmentHistory();
        
        this.showToast('تم حفظ سجل العلاج بنجاح', 'success');
        
        // إغلاق النموذج
        const modal = document.querySelector('div[style*="position: fixed; top: 0; left: 0"]');
        if (modal) modal.remove();
    }
    
    // إضافة للسجل
    addToHistory(disease) {
        if (!disease || !disease.id) return;
        
        // إزالة أي نسخة قديمة
        this.diseaseHistory = this.diseaseHistory.filter(item => item.id !== disease.id);
        
        this.diseaseHistory.unshift({
            id: disease.id,
            name: disease.name,
            timestamp: Date.now(),
            date: new Date().toLocaleString('ar-SA')
        });
        
        if (this.diseaseHistory.length > 50) {
            this.diseaseHistory.pop();
        }
        
        this.saveHistory();
    }
    
    // بيانات افتراضية احتياطية
    getFallbackDiseases() {
        return [
            {
                id: 1,
                name: "صدأ القمح",
                scientificName: "Puccinia graminis",
                description: "مرض فطري يصيب نبات القمح ويسبب ظهور بقع صفراء وبرتقالية على الأوراق.",
                severity: "مرتفع",
                symptoms: ["بقع صفراء على الأوراق", "تساقط الأوراق المبكر", "ضعف النمو"],
                causes: ["رطوبة عالية", "درجات حرارة معتدلة", "كثافة زراعة عالية"],
                treatment: ["مبيدات فطرية نظامية", "رش الكبريت المطهر", "استخدام أصناف مقاومة"],
                prevention: ["تناوب المحاصيل", "زراعة أصناف مقاومة", "الرش الوقائي"],
                affectedCrops: [1, 2],
                season: "الربيع",
                temperatureRange: "15-25°C"
            },
            {
                id: 2,
                name: "لفحة الطماطم",
                scientificName: "Phytophthora infestans",
                description: "مرض فطري مدمر يصيب الطماطم والبطاطس.",
                severity: "مرتفع جداً",
                symptoms: ["بقع داكنة على الأوراق", "عفن الساق", "تلف الثمار"],
                causes: ["رطوبة عالية", "أمطار متكررة", "تهوية ضعيفة"],
                treatment: ["مبيدات نحاسية", "مبيدات فطرية كيميائية", "إزالة النباتات المصابة"],
                prevention: ["الصرف الجيد", "تباعد النباتات", "الري بالتنقيط"],
                affectedCrops: [3, 4],
                season: "الصيف",
                temperatureRange: "18-28°C"
            }
        ];
    }
    
    // تحميل المحفوظات
    loadBookmarks() {
        try {
            const saved = localStorage.getItem('bookmarked_diseases');
            if (saved) {
                this.bookmarkedDiseases = JSON.parse(saved);
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل المحفوظات:', error);
            this.bookmarkedDiseases = [];
        }
    }
    
    // حفظ المحفوظات
    saveBookmarks() {
        try {
            localStorage.setItem('bookmarked_diseases', JSON.stringify(this.bookmarkedDiseases));
        } catch (error) {
            console.error('❌ خطأ في حفظ المحفوظات:', error);
        }
    }
    
    // تحميل السجل
    loadHistory() {
        try {
            const saved = localStorage.getItem('disease_history');
            if (saved) {
                this.diseaseHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل السجل:', error);
            this.diseaseHistory = [];
        }
    }
    
    // حفظ السجل
    saveHistory() {
        try {
            localStorage.setItem('disease_history', JSON.stringify(this.diseaseHistory));
        } catch (error) {
            console.error('❌ خطأ في حفظ السجل:', error);
        }
    }
    
    // تحميل سجل العلاج
    loadTreatmentHistory() {
        try {
            const saved = localStorage.getItem('treatment_history');
            if (saved) {
                this.treatmentHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل سجل العلاج:', error);
            this.treatmentHistory = [];
        }
    }
    
    // حفظ سجل العلاج
    saveTreatmentHistory() {
        try {
            localStorage.setItem('treatment_history', JSON.stringify(this.treatmentHistory));
        } catch (error) {
            console.error('❌ خطأ في حفظ سجل العلاج:', error);
        }
    }
    
    // الحصول على الأمراض المحفوظة
    getBookmarkedDiseases() {
        if (!this.isInitialized) return [];
        
        return this.bookmarkedDiseases
            .map(id => this.getDiseaseById(id))
            .filter(disease => disease !== undefined && disease !== null);
    }
    
    // الحصول على آخر المشاهدات
    getRecentDiseases(limit = 10) {
        if (!this.isInitialized) return [];
        
        return this.diseaseHistory
            .slice(0, limit)
            .map(item => {
                const disease = this.getDiseaseById(item.id);
                if (disease) {
                    return { ...disease, viewedAt: item.date };
                }
                return null;
            })
            .filter(disease => disease !== null);
    }
    
    // البحث عن أمراض المحصول
    searchDiseasesByCrop(cropId) {
        if (!this.isInitialized) return [];
        
        const diseases = this.getAllDiseases();
        return diseases.filter(disease => 
            disease.affectedCrops && 
            Array.isArray(disease.affectedCrops) && 
            disease.affectedCrops.includes(parseInt(cropId))
        );
    }
    
    // عرض رسالة خطأ
    showError(message) {
        const container = this.getDisplayContainer();
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; color: #FF9800; margin-bottom: 1rem;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 style="color: #F44336; margin-bottom: 1rem;">حدث خطأ</h3>
                    <p style="color: #666;">${message}</p>
                    <button onclick="window.location.reload()" style="
                        background: #2E7D32;
                        color: white;
                        border: none;
                        padding: 0.75rem 2rem;
                        border-radius: 25px;
                        margin-top: 1rem;
                        cursor: pointer;
                    ">
                        إعادة تحميل
                    </button>
                </div>
            `;
        }
    }
    
    // عرض إشعار
    showToast(message, type = 'info') {
        // إزالة أي إشعارات سابقة
        const existingToasts = document.querySelectorAll('.disease-toast');
        existingToasts.forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = 'disease-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: diseaseSlideIn 0.3s ease;
            font-family: 'Tajawal', sans-serif;
            max-width: 300px;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'diseaseSlideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// ====== إنشاء نسخة عالمية ======
let diseasesDetailsInstance = null;

function initDiseasesDetails() {
    if (!diseasesDetailsInstance) {
        diseasesDetailsInstance = new DiseasesDetails();
    }
    return diseasesDetailsInstance;
}

// ====== واجهة مبسطة للاستخدام ======
window.diseasesDetails = {
    // عرض تفاصيل المرض
    show: function(diseaseId) {
        const instance = initDiseasesDetails();
        return instance.showDiseaseDetail(diseaseId);
    },
    
    // الحصول على المحفوظات
    getBookmarks: function() {
        const instance = initDiseasesDetails();
        return instance.getBookmarkedDiseases();
    },
    
    // الحصول على آخر المشاهدات
    getRecent: function(limit = 10) {
        const instance = initDiseasesDetails();
        return instance.getRecentDiseases(limit);
    },
    
    // الحصول على أمراض المحصول
    getCropDiseases: function(cropId) {
        const instance = initDiseasesDetails();
        return instance.searchDiseasesByCrop(cropId);
    },
    
    // حفظ/إزالة من المحفوظات
    toggleBookmark: function(diseaseId) {
        const instance = initDiseasesDetails();
        return instance.toggleBookmark(diseaseId);
    },
    
    // حفظ العلاج
    saveTreatment: function(diseaseId) {
        const instance = initDiseasesDetails();
        return instance.saveTreatment(diseaseId);
    },
    
    // فتح نموذج تسجيل العلاج
    showTreatmentForm: function(diseaseId) {
        const instance = initDiseasesDetails();
        const disease = instance.getDiseaseById(diseaseId);
        if (disease) {
            instance.showTreatmentForm(disease);
        }
    },
    
    // الحصول على التاريخ
    getHistory: function() {
        const instance = initDiseasesDetails();
        return instance.diseaseHistory || [];
    },
    
    // مسح المحفوظات
    clearBookmarks: function() {
        const instance = initDiseasesDetails();
        instance.bookmarkedDiseases = [];
        instance.saveBookmarks();
        return true;
    },
    
    // التهيئة
    init: function() {
        return initDiseasesDetails();
    },
    
    // حالة النظام
    isReady: function() {
        return diseasesDetailsInstance && diseasesDetailsInstance.isInitialized;
    }
};

// ====== تهيئة تلقائية ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🦠 نظام تفاصيل الأمراض جاهز للاستخدام');
    
    // إضافة أنيميشن إذا لم تكن موجودة
    if (!document.querySelector('#disease-animations')) {
        const style = document.createElement('style');
        style.id = 'disease-animations';
        style.textContent = `
            @keyframes diseaseSlideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes diseaseSlideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100px); opacity: 0; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            
            .disease-detail-container {
                animation: fadeIn 0.3s ease;
            }
            
            .btn-bookmark:hover, .btn-share-disease:hover, .btn-back-diseases:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            }
        `;
        document.head.appendChild(style);
    }
});

// ====== تكامل مع النظام الرئيسي ======
if (window.mainBridge) {
    window.mainBridge.diseases = window.diseasesDetails;
    console.log('✅ تم ربط نظام الأمراض بالنظام الرئيسي');
}

// ====== رسالة المطور ======
console.log(`
🦠 **نظام تفاصيل الأمراض الزراعية - الإصدار 2.1**
✅ تم التحديث والتصحيح
✅ متكامل مع النظام الرئيسي
✅ دعم البيانات الاحتياطية
✅ تحسين الأداء والاستقرار
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ المميزات:
• عرض تفاصيل كاملة للأمراض
• نظام المحفوظات والتاريخ
• تسجيل حالات العلاج
• مشاركة المعلومات
• البحث عن أمراض المحاصيل
• واجهة تفاعلية متكاملة
• تخزين محلي آمن
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 أمثلة الاستخدام:
1. diseasesDetails.show(1)
2. diseasesDetails.getBookmarks()
3. diseasesDetails.getCropDiseases(1)
4. diseasesDetails.toggleBookmark(1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 المسار: js/data/diseases.js
🔗 متكامل مع: agricultureData, mainBridge
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
جميع الحقوق محفوظة © 2026 - المرشد الزراعي الذكي
`);