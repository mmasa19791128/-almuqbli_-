// ====== نظام تفاصيل المحاصيل ======
// 🌾 الإصدار 2.1 | يناير 2026 | معدل ومتكامل

class CropsDetails {
    constructor() {
        this.currentCrop = null;
        this.cropHistory = [];
        this.favorites = [];
        this.isInitialized = false;
        this.isLoading = false;
        
        this.init();
    }
    
    async init() {
        // الانتظار حتى تحميل البيانات الرئيسية
        await this.waitForGlobalData();
        
        // تحميل البيانات المحلية
        this.loadFavorites();
        this.loadHistory();
        
        this.isInitialized = true;
        console.log('✅ نظام تفاصيل المحاصيل جاهز');
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
    
    // عرض تفاصيل المحصول
    async showCropDetail(cropId) {
        // إذا كان النظام مشغولاً
        if (this.isLoading) {
            this.showToast('جاري تحميل البيانات...', 'info');
            return;
        }
        
        this.isLoading = true;
        
        try {
            // إذا لم يكن التطبيق جاهزاً، تحويل للصفحة المناسبة
            if (!this.isInitialized) {
                this.redirectToCropPage(cropId);
                return;
            }
            
            const crop = this.getCropById(cropId);
            if (!crop) {
                this.showError('المحصول غير موجود في قاعدة البيانات');
                return;
            }
            
            this.currentCrop = crop;
            this.addToHistory(crop);
            
            // التحقق من الصفحة الحالية
            if (this.isOnCropsPage()) {
                this.createDetailView(crop);
            } else {
                this.redirectToCropPage(cropId);
            }
        } catch (error) {
            console.error('❌ خطأ في عرض تفاصيل المحصول:', error);
            this.showError('حدث خطأ في تحميل بيانات المحصول');
        } finally {
            this.isLoading = false;
        }
    }
    
    // الحصول على المحصول بالمعرف
    getCropById(cropId) {
        // محاولة من البيانات المحلية أولاً
        if (window.agricultureData && window.agricultureData.getCropById) {
            return window.agricultureData.getCropById(cropId);
        }
        
        // البحث في البيانات المحفوظة
        const crops = this.getAllCrops();
        return crops.find(c => c.id == cropId);
    }
    
    // الحصول على جميع المحاصيل
    getAllCrops() {
        if (window.agricultureData && window.agricultureData.crops) {
            return window.agricultureData.crops;
        }
        
        // بيانات افتراضية احتياطية
        return this.getFallbackCrops();
    }
    
    // إنشاء واجهة التفاصيل
    createDetailView(crop) {
        const container = document.createElement('div');
        container.className = 'crop-detail-container';
        container.innerHTML = this.generateDetailHTML(crop);
        
        // البحث عن حاوية العرض
        const displayContainer = this.getDisplayContainer();
        if (displayContainer) {
            this.showLoading();
            
            setTimeout(() => {
                displayContainer.innerHTML = '';
                displayContainer.appendChild(container);
                
                // إضافة الأحداث
                this.attachDetailEvents(crop);
                this.hideLoading();
            }, 100);
        } else {
            console.error('❌ لم يتم العثور على حاوية العرض');
            this.showError('حدث خطأ في عرض البيانات');
        }
    }
    
    // الحصول على حاوية العرض
    getDisplayContainer() {
        // محاولة إيجاد الحاوية المناسبة
        const containers = [
            document.getElementById('mainContent'),
            document.getElementById('cropDetailContainer'),
            document.querySelector('.page.active .page-content'),
            document.querySelector('main'),
            document.querySelector('.app-container')
        ];
        
        return containers.find(container => container !== null);
    }
    
    // عرض شاشة التحميل
    showLoading() {
        const container = this.getDisplayContainer();
        if (!container) return;
        
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'crop-loading';
        loadingDiv.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 3rem; color: #4CAF50; margin-bottom: 1rem; animation: spin 1s linear infinite;">
                    <i class="fas fa-seedling"></i>
                </div>
                <h3 style="color: #2E7D32; margin-bottom: 1rem;">جاري تحميل البيانات...</h3>
                <p style="color: #666;">يرجى الانتظار</p>
            </div>
        `;
        
        // إضافة أنيميشن إذا لم تكن موجودة
        if (!document.querySelector('#crop-animations')) {
            const style = document.createElement('style');
            style.id = 'crop-animations';
            style.textContent = `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        container.innerHTML = '';
        container.appendChild(loadingDiv);
    }
    
    // إخفاء شاشة التحميل
    hideLoading() {
        const loadingDiv = document.querySelector('.crop-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
    
    // توليد HTML للتفاصيل
    generateDetailHTML(crop) {
        // التأكد من وجود جميع البيانات
        const cropData = {
            ...crop,
            name: crop.name || 'محصول غير معروف',
            scientificName: crop.scientificName || '',
            category: crop.category || 'غير محدد',
            season: crop.season || 'غير محدد',
            growthPeriod: crop.growthPeriod || 'غير محدد',
            yield: crop.yield || 'غير محدد',
            description: crop.description || 'لا يوجد وصف مفصل.',
            waterNeeds: crop.waterNeeds || 'غير محدد',
            soilType: crop.soilType || 'غير محدد',
            temperature: crop.temperature || 'غير محدد',
            phRange: crop.phRange || 'غير محدد',
            color: crop.color || '#4CAF50',
            icon: crop.icon || '🌱',
            plantingTime: Array.isArray(crop.plantingTime) ? crop.plantingTime : [],
            harvestTime: Array.isArray(crop.harvestTime) ? crop.harvestTime : [],
            commonDiseases: Array.isArray(crop.commonDiseases) ? crop.commonDiseases : [],
            tips: Array.isArray(crop.tips) ? crop.tips : []
        };
        
        return `
            <div class="crop-detail-header" style="
                background: linear-gradient(135deg, ${cropData.color}, #2E7D32);
                color: white;
                padding: 2rem;
                border-radius: 15px 15px 0 0;
                text-align: center;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem; animation: fadeIn 0.5s ease;">
                    ${cropData.icon}
                </div>
                <h2 style="margin-bottom: 0.5rem;">${cropData.name}</h2>
                ${cropData.scientificName ? `<p style="opacity: 0.9; font-style: italic;">${cropData.scientificName}</p>` : ''}
                
                <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap;">
                    <button class="btn-favorite" data-crop-id="${crop.id}" style="
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
                        font-family: 'Tajawal', sans-serif;
                    ">
                        <i class="fas fa-heart"></i>
                        <span>مفضل</span>
                    </button>
                    
                    <button class="btn-share" style="
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
                        font-family: 'Tajawal', sans-serif;
                    ">
                        <i class="fas fa-share-alt"></i>
                        <span>مشاركة</span>
                    </button>
                    
                    <button class="btn-diseases" style="
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
                        font-family: 'Tajawal', sans-serif;
                    ">
                        <i class="fas fa-stethoscope"></i>
                        <span>الأمراض</span>
                    </button>
                </div>
            </div>
            
            <div class="crop-detail-content" style="padding: 2rem;">
                <!-- معلومات أساسية -->
                <div class="info-grid" style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                ">
                    <div class="info-card" style="
                        background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
                        padding: 1rem;
                        border-radius: 10px;
                        text-align: center;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    ">
                        <div style="color: #666; margin-bottom: 0.5rem; font-size: 0.9rem;">
                            <i class="fas fa-tag"></i> النوع
                        </div>
                        <div style="font-weight: bold; color: #2E7D32; font-size: 1.1rem;">
                            ${cropData.category}
                        </div>
                    </div>
                    
                    <div class="info-card" style="
                        background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
                        padding: 1rem;
                        border-radius: 10px;
                        text-align: center;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    ">
                        <div style="color: #666; margin-bottom: 0.5rem; font-size: 0.9rem;">
                            <i class="fas fa-calendar-alt"></i> الموسم
                        </div>
                        <div style="font-weight: bold; color: #FF9800; font-size: 1.1rem;">
                            ${cropData.season}
                        </div>
                    </div>
                    
                    <div class="info-card" style="
                        background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
                        padding: 1rem;
                        border-radius: 10px;
                        text-align: center;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    ">
                        <div style="color: #666; margin-bottom: 0.5rem; font-size: 0.9rem;">
                            <i class="fas fa-clock"></i> مدة النمو
                        </div>
                        <div style="font-weight: bold; color: #2196F3; font-size: 1.1rem;">
                            ${cropData.growthPeriod}
                        </div>
                    </div>
                    
                    <div class="info-card" style="
                        background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
                        padding: 1rem;
                        border-radius: 10px;
                        text-align: center;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    ">
                        <div style="color: #666; margin-bottom: 0.5rem; font-size: 0.9rem;">
                            <i class="fas fa-chart-line"></i> الإنتاجية
                        </div>
                        <div style="font-weight: bold; color: #9C27B0; font-size: 1.1rem;">
                            ${cropData.yield}
                        </div>
                    </div>
                </div>
                
                <!-- الوصف -->
                <div class="description-section" style="margin-bottom: 2rem;">
                    <h3 style="color: #2E7D32; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-info-circle"></i> الوصف
                    </h3>
                    <div style="
                        background: #f9f9f9;
                        padding: 1.5rem;
                        border-radius: 10px;
                        border-right: 4px solid #2E7D32;
                        line-height: 1.8;
                        color: #555;
                    ">
                        ${cropData.description}
                    </div>
                </div>
                
                <!-- مواعيد الزراعة والحصاد -->
                ${(cropData.plantingTime.length > 0 || cropData.harvestTime.length > 0) ? `
                <div class="timing-section" style="
                    background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin-bottom: 2rem;
                ">
                    <h3 style="color: #2E7D32; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-calendar-alt"></i> المواعيد الزراعية
                    </h3>
                    
                    <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                        ${cropData.plantingTime.length > 0 ? `
                        <div style="flex: 1; min-width: 200px;">
                            <h4 style="color: #4CAF50; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-seedling"></i> مواعيد الزراعة
                            </h4>
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                ${this.generateMonthsList(cropData.plantingTime)}
                            </div>
                        </div>
                        ` : ''}
                        
                        ${cropData.harvestTime.length > 0 ? `
                        <div style="flex: 1; min-width: 200px;">
                            <h4 style="color: #FF9800; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-harvest"></i> مواعيد الحصاد
                            </h4>
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                ${this.generateMonthsList(cropData.harvestTime)}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                ` : ''}
                
                <!-- متطلبات الزراعة -->
                <div class="requirements-section" style="margin-bottom: 2rem;">
                    <h3 style="color: #2E7D32; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-seedling"></i> متطلبات الزراعة
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                        ${cropData.waterNeeds !== 'غير محدد' ? `
                        <div class="requirement-card" style="
                            background: white;
                            padding: 1rem;
                            border-radius: 8px;
                            border-left: 4px solid #4CAF50;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                            transition: transform 0.3s;
                        " onmouseenter="this.style.transform='translateY(-5px)'" onmouseleave="this.style.transform='translateY(0)'">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <i class="fas fa-tint" style="color: #2196F3;"></i>
                                <strong>الري:</strong>
                            </div>
                            <span style="color: #555;">${cropData.waterNeeds}</span>
                        </div>
                        ` : ''}
                        
                        ${cropData.soilType !== 'غير محدد' ? `
                        <div class="requirement-card" style="
                            background: white;
                            padding: 1rem;
                            border-radius: 8px;
                            border-left: 4px solid #2196F3;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                            transition: transform 0.3s;
                        " onmouseenter="this.style.transform='translateY(-5px)'" onmouseleave="this.style.transform='translateY(0)'">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <i class="fas fa-mountain" style="color: #795548;"></i>
                                <strong>نوع التربة:</strong>
                            </div>
                            <span style="color: #555;">${cropData.soilType}</span>
                        </div>
                        ` : ''}
                        
                        ${cropData.temperature !== 'غير محدد' ? `
                        <div class="requirement-card" style="
                            background: white;
                            padding: 1rem;
                            border-radius: 8px;
                            border-left: 4px solid #FF9800;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                            transition: transform 0.3s;
                        " onmouseenter="this.style.transform='translateY(-5px)'" onmouseleave="this.style.transform='translateY(0)'">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <i class="fas fa-thermometer-half" style="color: #F44336;"></i>
                                <strong>درجة الحرارة:</strong>
                            </div>
                            <span style="color: #555;">${cropData.temperature}</span>
                        </div>
                        ` : ''}
                        
                        ${cropData.phRange !== 'غير محدد' ? `
                        <div class="requirement-card" style="
                            background: white;
                            padding: 1rem;
                            border-radius: 8px;
                            border-left: 4px solid #9C27B0;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                            transition: transform 0.3s;
                        " onmouseenter="this.style.transform='translateY(-5px)'" onmouseleave="this.style.transform='translateY(0)'">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <i class="fas fa-flask" style="color: #9C27B0;"></i>
                                <strong>درجة الحموضة:</strong>
                            </div>
                            <span style="color: #555;">${cropData.phRange}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- الأمراض الشائعة -->
                ${this.generateDiseasesSection(crop)}
                
                <!-- نصائح زراعية -->
                ${this.generateTipsSection(crop)}
                
                <!-- زر العودة -->
                <div style="text-align: center; margin-top: 3rem;">
                    <button class="btn-back" style="
                        background: linear-gradient(135deg, #2E7D32, #4CAF50);
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
                        font-family: 'Tajawal', sans-serif;
                        box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
                    " onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(46, 125, 50, 0.4)'" 
                    onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(46, 125, 50, 0.3)'">
                        <i class="fas fa-arrow-right"></i>
                        العودة لقائمة المحاصيل
                    </button>
                </div>
            </div>
        `;
    }
    
    // توليد قائمة الأشهر
    generateMonthsList(months) {
        if (!Array.isArray(months) || months.length === 0) {
            return '<span style="color: #999; padding: 0.5rem 1rem; background: white; border-radius: 20px;">غير محدد</span>';
        }
        
        const allMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                          'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        
        return months.map(month => `
            <span style="
                background: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-weight: bold;
                color: #333;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                transition: all 0.3s;
            " onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 10px rgba(0,0,0,0.2)'"
             onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 5px rgba(0,0,0,0.1)'">
                ${allMonths.includes(month) ? month : month}
            </span>
        `).join('');
    }
    
    // توليد قسم الأمراض
    generateDiseasesSection(crop) {
        const diseases = this.getCropDiseases(crop.id);
        if (diseases.length === 0) {
            return '';
        }
        
        let diseasesHTML = '<div class="diseases-section" style="margin-bottom: 2rem;">';
        diseasesHTML += '<h3 style="color: #F44336; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">';
        diseasesHTML += '<i class="fas fa-stethoscope"></i> الأمراض الشائعة';
        diseasesHTML += ` <span style="background: #F44336; color: white; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem;">${diseases.length}</span>`;
        diseasesHTML += '</h3>';
        diseasesHTML += '<div style="display: flex; gap: 1rem; flex-wrap: wrap;">';
        
        diseases.forEach((disease, index) => {
            diseasesHTML += `
                <div style="
                    background: linear-gradient(135deg, #FFEBEE, #FFCDD2);
                    padding: 1rem;
                    border-radius: 8px;
                    border-left: 4px solid #F44336;
                    flex: 1;
                    min-width: 200px;
                    transition: transform 0.3s;
                    cursor: pointer;
                " onmouseenter="this.style.transform='translateY(-5px)'" 
                 onmouseleave="this.style.transform='translateY(0)'"
                 onclick="window.cropsDetails.showDiseaseModal(${disease.id})">
                    <div style="font-weight: bold; color: #C62828; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-virus"></i> ${disease.name}
                    </div>
                    <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
                        ${disease.description ? disease.description.substring(0, 80) + '...' : 'مرض يصيب المحصول'}
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="background: #FF5722; color: white; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem;">
                            ${disease.severity || 'متوسط'}
                        </span>
                        <span style="color: #666; font-size: 0.8rem;">
                            <i class="fas fa-info-circle"></i> انقر للتفاصيل
                        </span>
                    </div>
                </div>
            `;
        });
        
        diseasesHTML += '</div></div>';
        return diseasesHTML;
    }
    
    // توليد قسم النصائح
    generateTipsSection(crop) {
        if (!crop.tips || crop.tips.length === 0) {
            return '';
        }
        
        let tipsHTML = '<div class="tips-section" style="margin-bottom: 2rem;">';
        tipsHTML += '<h3 style="color: #FF9800; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">';
        tipsHTML += '<i class="fas fa-lightbulb"></i> نصائح زراعية';
        tipsHTML += '</h3>';
        tipsHTML += '<div style="background: linear-gradient(135deg, #FFF3E0, #FFE0B2); padding: 1.5rem; border-radius: 10px;">';
        tipsHTML += '<ol style="padding-right: 1.5rem; margin: 0;">';
        
        crop.tips.forEach((tip, index) => {
            tipsHTML += `
                <li style="
                    margin-bottom: 0.5rem; 
                    color: #555; 
                    padding: 0.5rem;
                    border-radius: 5px;
                    background: ${index % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'transparent'};
                ">
                    ${tip}
                </li>
            `;
        });
        
        tipsHTML += '</ol></div></div>';
        return tipsHTML;
    }
    
    // إرفاق الأحداث
    attachDetailEvents(crop) {
        // زر المفضلة
        const favBtn = document.querySelector('.btn-favorite');
        if (favBtn) {
            favBtn.addEventListener('click', () => this.toggleFavorite(crop.id));
            this.updateFavoriteButton(crop.id, favBtn);
        }
        
        // زر المشاركة
        const shareBtn = document.querySelector('.btn-share');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareCrop(crop));
        }
        
        // زر الأمراض
        const diseasesBtn = document.querySelector('.btn-diseases');
        if (diseasesBtn) {
            diseasesBtn.addEventListener('click', () => this.showAllDiseases(crop.id));
        }
        
        // زر العودة
        const backBtn = document.querySelector('.btn-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goBack());
        }
    }
    
    // الحصول على أمراض المحصول
    getCropDiseases(cropId) {
        if (!this.isInitialized) return [];
        
        // محاولة من نظام الأمراض
        if (window.diseasesDetails && window.diseasesDetails.getCropDiseases) {
            return window.diseasesDetails.getCropDiseases(cropId);
        }
        
        // البحث في البيانات المحلية
        const allDiseases = window.agricultureData ? window.agricultureData.diseases || [] : [];
        return allDiseases.filter(disease => 
            disease.affectedCrops && 
            Array.isArray(disease.affectedCrops) && 
            disease.affectedCrops.includes(parseInt(cropId))
        );
    }
    
    // التبديل بين المفضلة
    toggleFavorite(cropId) {
        const index = this.favorites.indexOf(cropId);
        
        if (index === -1) {
            // إضافة للمفضلة
            this.favorites.push(cropId);
            this.showToast('تم إضافة المحصول للمفضلة', 'success');
        } else {
            // إزالة من المفضلة
            this.favorites.splice(index, 1);
            this.showToast('تم إزالة المحصول من المفضلة', 'info');
        }
        
        // حفظ التفضيلات
        this.saveFavorites();
        
        // تحديث زر المفضلة
        const favBtn = document.querySelector('.btn-favorite');
        if (favBtn) {
            this.updateFavoriteButton(cropId, favBtn);
        }
    }
    
    // تحديث زر المفضلة
    updateFavoriteButton(cropId, button) {
        const isFavorite = this.favorites.includes(cropId);
        
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        
        if (isFavorite) {
            icon.className = 'fas fa-heart';
            icon.style.color = '#F44336';
            text.textContent = 'مفضلة';
            button.style.background = 'rgba(244, 67, 54, 0.2)';
            button.style.borderColor = '#F44336';
        } else {
            icon.className = 'far fa-heart';
            icon.style.color = 'white';
            text.textContent = 'إضافة للمفضلة';
            button.style.background = 'rgba(255,255,255,0.2)';
            button.style.borderColor = 'white';
        }
    }
    
    // مشاركة المحصول
    shareCrop(crop) {
        const shareData = {
            title: `محصول ${crop.name}`,
            text: `تعرف على زراعة ${crop.name} - ${crop.description ? crop.description.substring(0, 100) : 'محصول زراعي مهم'}...`,
            url: `${window.location.origin}${window.location.pathname}#crop=${crop.id}`
        };
        
        if (navigator.share && navigator.share instanceof Function) {
            navigator.share(shareData)
                .then(() => console.log('تمت المشاركة بنجاح'))
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
    
    // عرض نافذة المرض
    showDiseaseModal(diseaseId) {
        const disease = this.getDiseaseById(diseaseId);
        if (!disease) {
            this.showToast('المرض غير موجود', 'error');
            return;
        }
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                animation: fadeIn 0.3s ease;
            ">
                <div style="
                    background: linear-gradient(135deg, #F44336, #D32F2F);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 15px 15px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0;">
                        <i class="fas fa-virus"></i> ${disease.name}
                    </h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="
                                background: none;
                                border: none;
                                color: white;
                                font-size: 1.5rem;
                                cursor: pointer;
                                padding: 5px;
                                transition: transform 0.3s;
                            " 
                            onmouseenter="this.style.transform='rotate(90deg)'"
                            onmouseleave="this.style.transform='rotate(0)'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div style="padding: 1.5rem;">
                    <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">
                        ${disease.description || 'لا يوجد وصف للمرض'}
                    </p>
                    
                    ${disease.symptoms && disease.symptoms.length > 0 ? `
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="color: #F44336; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-exclamation-triangle"></i> الأعراض
                        </h4>
                        <ul style="padding-right: 1.5rem; color: #555;">
                            ${disease.symptoms.map(s => `<li style="margin-bottom: 0.5rem;">${s}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    ${disease.prevention && disease.prevention.length > 0 ? `
                    <div style="margin-bottom: 1.5rem;">
                        <h4 style="color: #4CAF50; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-shield-alt"></i> الوقاية
                        </h4>
                        <ul style="padding-right: 1.5rem; color: #555;">
                            ${disease.prevention.map(p => `<li style="margin-bottom: 0.5rem;">${p}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    ${disease.treatment && disease.treatment.length > 0 ? `
                    <div>
                        <h4 style="color: #2196F3; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-medkit"></i> العلاج
                        </h4>
                        <ul style="padding-right: 1.5rem; color: #555;">
                            ${disease.treatment.map(t => `<li style="margin-bottom: 0.5rem;">${t}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    ${(window.diseasesDetails && window.diseasesDetails.show) ? `
                    <div style="text-align: center; margin-top: 1.5rem;">
                        <button onclick="window.diseasesDetails.show(${disease.id}); this.parentElement.parentElement.parentElement.parentElement.remove()" 
                                style="
                                    background: #F44336;
                                    color: white;
                                    border: none;
                                    padding: 0.75rem 1.5rem;
                                    border-radius: 25px;
                                    cursor: pointer;
                                    font-family: 'Tajawal', sans-serif;
                                ">
                            <i class="fas fa-external-link-alt"></i> عرض التفاصيل الكاملة
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // إغلاق بالنقر خارج النافذة
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // الحصول على المرض بالمعرف
    getDiseaseById(diseaseId) {
        if (window.agricultureData && window.agricultureData.getDiseaseById) {
            return window.agricultureData.getDiseaseById(diseaseId);
        }
        
        const diseases = window.agricultureData ? window.agricultureData.diseases || [] : [];
        return diseases.find(d => d.id == diseaseId);
    }
    
    // عرض جميع أمراض المحصول
    showAllDiseases(cropId) {
        const diseases = this.getCropDiseases(cropId);
        if (diseases.length === 0) {
            this.showToast('لا توجد أمراض مسجلة لهذا المحصول', 'info');
            return;
        }
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 15px;
                max-width: 600px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                animation: fadeIn 0.3s ease;
            ">
                <div style="
                    background: linear-gradient(135deg, #F44336, #D32F2F);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 15px 15px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0;">
                        <i class="fas fa-stethoscope"></i> أمراض المحصول
                    </h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="
                                background: none;
                                border: none;
                                color: white;
                                font-size: 1.5rem;
                                cursor: pointer;
                                padding: 5px;
                            ">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div style="padding: 1.5rem;">
                    <div style="display: grid; gap: 1rem;">
                        ${diseases.map(disease => `
                            <div style="
                                background: #FFEBEE;
                                padding: 1rem;
                                border-radius: 8px;
                                border-left: 4px solid #F44336;
                                cursor: pointer;
                                transition: all 0.3s;
                            " onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 10px rgba(0,0,0,0.1)'"
                             onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                             onclick="window.cropsDetails.showDiseaseModal(${disease.id}); this.parentElement.parentElement.parentElement.remove()">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <div style="font-weight: bold; color: #C62828;">${disease.name}</div>
                                    <span style="background: #FF5722; color: white; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem;">
                                        ${disease.severity || 'متوسط'}
                                    </span>
                                </div>
                                <div style="color: #666; font-size: 0.9rem;">
                                    ${disease.description ? disease.description.substring(0, 120) + '...' : 'مرض يصيب المحصول'}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // العودة للقائمة
    goBack() {
        if (window.mainBridge && window.mainBridge.showPage) {
            window.mainBridge.showPage('crops');
        } else {
            // طريقة بديلة
            const cropsPage = document.getElementById('cropsPage');
            if (cropsPage) {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                cropsPage.classList.add('active');
                
                // تحديث التنقل
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                const cropsNav = document.querySelector('.nav-item[onclick*="crops"]');
                if (cropsNav) cropsNav.classList.add('active');
            } else {
                window.history.back();
            }
        }
    }
    
    // التحقق من وجودنا في صفحة المحاصيل
    isOnCropsPage() {
        const currentPage = document.querySelector('.page.active');
        return currentPage && (
            currentPage.id === 'cropsPage' || 
            currentPage.dataset.page === 'crops' ||
            window.location.hash.includes('crops')
        );
    }
    
    // توجيه لصفحة المحصول
    redirectToCropPage(cropId) {
        if (window.mainBridge && window.mainBridge.showCropDetail) {
            window.mainBridge.showCropDetail(cropId);
        } else {
            window.location.href = `index.html#crops&crop=${cropId}`;
        }
    }
    
    // بيانات افتراضية احتياطية
    getFallbackCrops() {
        return [
            {
                id: 1,
                name: "القمح",
                scientificName: "Triticum aestivum",
                category: "حبوب",
                season: "شتوي",
                growthPeriod: "150-180 يوم",
                yield: "3-5 طن/هكتار",
                description: "القمح من أهم المحاصيل الغذائية في العالم، يستخدم في صناعة الخبز والمعكرونة.",
                waterNeeds: "متوسطة إلى قليلة",
                soilType: "طينية جيدة الصرف",
                temperature: "15-25°C",
                phRange: "6.0-7.5",
                color: "#FFD700",
                icon: "🌾",
                plantingTime: ["نوفمبر", "ديسمبر"],
                harvestTime: ["مايو", "يونيو"],
                tips: [
                    "زراعة البذور على عمق 3-5 سم",
                    "التسميد بالنيتروجين في مراحل النمو الأولى",
                    "مكافحة الحشائش مبكراً"
                ]
            },
            {
                id: 2,
                name: "الطماطم",
                scientificName: "Solanum lycopersicum",
                category: "خضروات",
                season: "صيفي",
                growthPeriod: "90-120 يوم",
                yield: "40-60 طن/هكتار",
                description: "الطماطم من أكثر الخضروات استهلاكاً في العالم، غنية بالفيتامينات.",
                waterNeeds: "مرتفعة",
                soilType: "رملية طينية",
                temperature: "20-30°C",
                phRange: "6.0-6.8",
                color: "#FF6347",
                icon: "🍅",
                plantingTime: ["فبراير", "مارس"],
                harvestTime: ["يونيو", "يوليو"],
                tips: [
                    "تثبيت النباتات لدعم النمو",
                    "الري المنتظم وتجنب الجفاف",
                    "التسميد بالبوتاسيوم لتحسين الثمار"
                ]
            }
        ];
    }
    
    // إضافة للسجل
    addToHistory(crop) {
        if (!crop || !crop.id) return;
        
        // إزالة أي نسخة قديمة
        this.cropHistory = this.cropHistory.filter(item => item.id !== crop.id);
        
        this.cropHistory.unshift({
            id: crop.id,
            name: crop.name,
            timestamp: Date.now(),
            date: new Date().toLocaleString('ar-SA')
        });
        
        if (this.cropHistory.length > 20) {
            this.cropHistory.pop();
        }
        
        this.saveHistory();
    }
    
    // تحميل المفضلة
    loadFavorites() {
        try {
            const saved = localStorage.getItem('favorite_crops');
            if (saved) {
                this.favorites = JSON.parse(saved);
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل المفضلة:', error);
            this.favorites = [];
        }
    }
    
    // حفظ المفضلة
    saveFavorites() {
        try {
            localStorage.setItem('favorite_crops', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('❌ خطأ في حفظ المفضلة:', error);
        }
    }
    
    // تحميل السجل
    loadHistory() {
        try {
            const saved = localStorage.getItem('crop_history');
            if (saved) {
                this.cropHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل السجل:', error);
            this.cropHistory = [];
        }
    }
    
    // حفظ السجل
    saveHistory() {
        try {
            localStorage.setItem('crop_history', JSON.stringify(this.cropHistory));
        } catch (error) {
            console.error('❌ خطأ في حفظ السجل:', error);
        }
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
                        font-family: 'Tajawal', sans-serif;
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
        const existingToasts = document.querySelectorAll('.crop-toast');
        existingToasts.forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = 'crop-toast';
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
            animation: cropSlideIn 0.3s ease;
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
            toast.style.animation = 'cropSlideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    // الحصول على المحاصيل المفضلة
    getFavoriteCrops() {
        if (!this.isInitialized) return [];
        
        return this.favorites
            .map(id => this.getCropById(id))
            .filter(crop => crop !== undefined && crop !== null);
    }
    
    // الحصول على آخر المشاهدات
    getRecentCrops(limit = 5) {
        if (!this.isInitialized) return [];
        
        return this.cropHistory
            .slice(0, limit)
            .map(item => {
                const crop = this.getCropById(item.id);
                if (crop) {
                    return { ...crop, viewedAt: item.date };
                }
                return null;
            })
            .filter(crop => crop !== null);
    }
}

// ====== إنشاء نسخة عالمية ======
let cropsDetailsInstance = null;

function initCropsDetails() {
    if (!cropsDetailsInstance) {
        cropsDetailsInstance = new CropsDetails();
    }
    return cropsDetailsInstance;
}

// ====== واجهة مبسطة للاستخدام ======
window.cropsDetails = {
    // عرض تفاصيل المحصول
    show: function(cropId) {
        const instance = initCropsDetails();
        return instance.showCropDetail(cropId);
    },
    
    // الحصول على المفضلة
    getFavorites: function() {
        const instance = initCropsDetails();
        return instance.getFavoriteCrops();
    },
    
    // الحصول على آخر المشاهدات
    getRecent: function(limit = 5) {
        const instance = initCropsDetails();
        return instance.getRecentCrops(limit);
    },
    
    // حفظ/إزالة من المفضلة
    toggleFavorite: function(cropId) {
        const instance = initCropsDetails();
        return instance.toggleFavorite(cropId);
    },
    
    // الحصول على أمراض المحصول
    getCropDiseases: function(cropId) {
        const instance = initCropsDetails();
        return instance.getCropDiseases(cropId);
    },
    
    // عرض نافذة المرض
    showDiseaseModal: function(diseaseId) {
        const instance = initCropsDetails();
        return instance.showDiseaseModal(diseaseId);
    },
    
    // عرض جميع الأمراض
    showAllDiseases: function(cropId) {
        const instance = initCropsDetails();
        return instance.showAllDiseases(cropId);
    },
    
    // الحصول على السجل
    getHistory: function() {
        const instance = initCropsDetails();
        return instance.cropHistory || [];
    },
    
    // مسح المفضلة
    clearFavorites: function() {
        const instance = initCropsDetails();
        instance.favorites = [];
        instance.saveFavorites();
        return true;
    },
    
    // التهيئة
    init: function() {
        return initCropsDetails();
    },
    
    // حالة النظام
    isReady: function() {
        return cropsDetailsInstance && cropsDetailsInstance.isInitialized;
    }
};

// ====== تهيئة تلقائية ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌱 نظام تفاصيل المحاصيل جاهز للاستخدام');
    
    // إضافة CSS للأنيميشن
    if (!document.querySelector('#crop-animations-global')) {
        const style = document.createElement('style');
        style.id = 'crop-animations-global';
        style.textContent = `
            @keyframes cropSlideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes cropSlideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100px); opacity: 0; }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
            
            .crop-detail-container {
                animation: fadeIn 0.5s ease;
            }
        `;
        document.head.appendChild(style);
    }
});

// ====== تكامل مع النظام الرئيسي ======
if (window.mainBridge) {
    window.mainBridge.crops = window.cropsDetails;
    console.log('✅ تم ربط نظام المحاصيل بالنظام الرئيسي');
}

// ====== رسالة المطور ======
console.log(`
🌱 **نظام تفاصيل المحاصيل - الإصدار 2.1**
✅ تم التحديث والتصحيح
✅ متكامل مع النظام الرئيسي
✅ دعم البيانات الاحتياطية
✅ تحسين الأداء والاستقرار
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ المميزات:
• عرض تفاصيل كاملة للمحاصيل
• نظام المفضلة والتاريخ
• مشاركة المحاصيل بسهولة
• عرض الأمراض والعلاجات
• واجهة تفاعلية جميلة
• عمل بدون اتصال
• تكامل مع نظام الأمراض
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 أمثلة الاستخدام:
1. cropsDetails.show(1)
2. cropsDetails.getFavorites()
3. cropsDetails.getRecent(5)
4. cropsDetails.toggleFavorite(1)
5. cropsDetails.getCropDiseases(1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 المسار: js/data/crops.js
🔗 متكامل مع: agricultureData, diseasesDetails, mainBridge
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
جميع الحقوق محفوظة © 2026 - المرشد الزراعي الذكي
`);