// نظام عرض المحاصيل الزراعية الشامل
class CropsSystem {
    constructor() {
        this.database = new CropsDatabase();
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.savedCrops = JSON.parse(localStorage.getItem('savedCrops') || '[]');
        
        console.log('🌱 نظام المحاصيل الزراعية تم تحميله بنجاح!');
    }
    
    // تهيئة النظام
    init() {
        this.setupEventListeners();
        this.loadAllCrops();
        this.updateStats();
    }
    
    // إعداد مستمعي الأحداث
    setupEventListeners() {
        // البحث
        const searchInput = document.getElementById('cropsSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value;
                this.searchCrops();
            });
        }
        
        // التصفية حسب التصنيف
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });
    }
    
    // تحميل جميع المحاصيل
    loadAllCrops() {
        const crops = this.database.getAllCrops();
        this.displayCrops(crops);
    }
    
    // عرض المحاصيل
    displayCrops(crops) {
        const container = document.getElementById('cropsContainer');
        if (!container) return;
        
        if (crops.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-seedling"></i>
                    <h3>لا توجد محاصيل</h3>
                    <p>لم يتم العثور على محاصيل تطابق معايير البحث</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = crops.map(crop => this.createCropCard(crop)).join('');
        
        // إضافة مستمعي الأحداث للبطاقات
        this.addCardEventListeners();
    }
    
    // إنشاء بطاقة محصول
    createCropCard(crop) {
        const isSaved = this.savedCrops.includes(crop.id);
        
        return `
            <div class="crop-card" data-crop-id="${crop.id}">
                <div class="crop-card-header">
                    <div class="crop-icon">${crop.icon}</div>
                    <div class="crop-category ${crop.category}">
                        ${this.getCategoryArabic(crop.category)}
                    </div>
                    <button class="save-btn ${isSaved ? 'saved' : ''}" 
                            onclick="cropsSystem.toggleSave('${crop.id}')">
                        <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
                    </button>
                </div>
                
                <div class="crop-image">
                    <img src="${crop.image}" alt="${crop.name}" 
                         onerror="this.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'">
                </div>
                
                <div class="crop-card-body">
                    <h3 class="crop-name">
                        ${crop.name}
                        <small>(${crop.scientificName})</small>
                    </h3>
                    
                    <p class="crop-description">${crop.description}</p>
                    
                    <div class="crop-quick-info">
                        <div class="info-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>الموسم: ${crop.agriculturalInfo.plantingSeason.join('، ')}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span>المدة: ${crop.agriculturalInfo.growthPeriod}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-thermometer-half"></i>
                            <span>الحرارة: ${crop.agriculturalInfo.temperatureRange}</span>
                        </div>
                    </div>
                    
                    <div class="crop-card-footer">
                        <button class="btn btn-primary" onclick="cropsSystem.viewDetails('${crop.id}')">
                            <i class="fas fa-info-circle"></i> التفاصيل الكاملة
                        </button>
                        <button class="btn btn-secondary" onclick="cropsSystem.quickInfo('${crop.id}')">
                            <i class="fas fa-leaf"></i> المعلومات الغذائية
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // الحصول على التصنيف بالعربية
    getCategoryArabic(category) {
        const categories = {
            'grains': 'حبوب',
            'vegetables': 'خضروات',
            'fruits': 'فواكه',
            'tubers': 'درنات',
            'herbs': 'أعشاب',
            'legumes': 'بقوليات'
        };
        return categories[category] || category;
    }
    
    // البحث عن المحاصيل
    searchCrops() {
        let results;
        
        if (this.currentCategory === 'all') {
            results = this.database.searchCrops(this.currentSearch);
        } else {
            results = this.database.getCropsByCategory(this.currentCategory)
                .filter(crop => 
                    crop.name.toLowerCase().includes(this.currentSearch.toLowerCase()) ||
                    crop.description.includes(this.currentSearch)
                );
        }
        
        this.displayCrops(results);
        this.updateStats(results.length);
    }
    
    // التصفية حسب التصنيف
    filterByCategory(category) {
        this.currentCategory = category;
        
        // تحديث الأزرار النشطة
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        if (category === 'all') {
            if (this.currentSearch) {
                this.searchCrops();
            } else {
                this.loadAllCrops();
            }
        } else {
            const crops = this.database.getCropsByCategory(category);
            if (this.currentSearch) {
                const filtered = crops.filter(crop => 
                    crop.name.toLowerCase().includes(this.currentSearch.toLowerCase()) ||
                    crop.description.includes(this.currentSearch)
                );
                this.displayCrops(filtered);
            } else {
                this.displayCrops(crops);
            }
        }
    }
    
    // حفظ/إلغاء حفظ المحصول
    toggleSave(cropId) {
        const index = this.savedCrops.indexOf(cropId);
        
        if (index === -1) {
            this.savedCrops.push(cropId);
            localStorage.setItem('savedCrops', JSON.stringify(this.savedCrops));
            
            this.showNotification('تم حفظ المحصول في المفضلة', 'success');
        } else {
            this.savedCrops.splice(index, 1);
            localStorage.setItem('savedCrops', JSON.stringify(this.savedCrops));
            
            this.showNotification('تم إزالة المحصول من المفضلة', 'info');
        }
        
        // تحديث الزر
        const btn = document.querySelector(`[onclick*="${cropId}"]`);
        if (btn) {
            const icon = btn.querySelector('i');
            if (index === -1) {
                btn.classList.add('saved');
                icon.className = 'fas fa-bookmark';
            } else {
                btn.classList.remove('saved');
                icon.className = 'far fa-bookmark';
            }
        }
    }
    
    // عرض التفاصيل الكاملة
    viewDetails(cropId) {
        const crop = this.database.getCropDetails(cropId);
        if (!crop) return;
        
        this.showCropModal(crop);
    }
    
    // عرض المعلومات الغذائية السريعة
    quickInfo(cropId) {
        const crop = this.database.getCropDetails(cropId);
        if (!crop) return;
        
        this.showNutritionModal(crop);
    }
    
    // عرض تفاصيل المحصول في نافذة منبثقة
    showCropModal(crop) {
        const modalHTML = `
            <div class="crop-detail-modal">
                <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${crop.name} <small>(${crop.scientificName})</small></h2>
                        <button class="close-btn" onclick="this.closest('.crop-detail-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="crop-main-info">
                            <div class="crop-image-large">
                                <img src="${crop.image}" alt="${crop.name}">
                            </div>
                            <div class="crop-basic-info">
                                <h3><i class="fas fa-info-circle"></i> معلومات أساسية</h3>
                                <p>${crop.description}</p>
                                
                                <div class="info-grid">
                                    <div class="info-item">
                                        <i class="fas fa-layer-group"></i>
                                        <strong>العائلة:</strong> ${crop.family}
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-tag"></i>
                                        <strong>التصنيف:</strong> ${this.getCategoryArabic(crop.category)}
                                    </div>
                                    <div class="info-item">
                                        <i class="fas fa-globe"></i>
                                        <strong>المناطق:</strong> ${crop.suitableRegions.join('، ')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="modal-sections">
                            <!-- المعلومات الزراعية -->
                            <div class="modal-section">
                                <h3><i class="fas fa-tractor"></i> المعلومات الزراعية</h3>
                                <div class="section-grid">
                                    <div class="section-item">
                                        <i class="fas fa-calendar-alt"></i>
                                        <div>
                                            <strong>مواسم الزراعة:</strong><br>
                                            ${crop.agriculturalInfo.plantingSeason.join('، ')}
                                        </div>
                                    </div>
                                    <div class="section-item">
                                        <i class="fas fa-clock"></i>
                                        <div>
                                            <strong>مدة النمو:</strong><br>
                                            ${crop.agriculturalInfo.growthPeriod}
                                        </div>
                                    </div>
                                    <div class="section-item">
                                        <i class="fas fa-thermometer-half"></i>
                                        <div>
                                            <strong>درجة الحرارة:</strong><br>
                                            ${crop.agriculturalInfo.temperatureRange}
                                        </div>
                                    </div>
                                    <div class="section-item">
                                        <i class="fas fa-tint"></i>
                                        <div>
                                            <strong>احتياجات المياه:</strong><br>
                                            ${crop.agriculturalInfo.waterNeeds}
                                        </div>
                                    </div>
                                    <div class="section-item">
                                        <i class="fas fa-mountain"></i>
                                        <div>
                                            <strong>نوع التربة:</strong><br>
                                            ${crop.agriculturalInfo.soilType}
                                        </div>
                                    </div>
                                    <div class="section-item">
                                        <i class="fas fa-flask"></i>
                                        <div>
                                            <strong>درجة الحموضة:</strong><br>
                                            ${crop.agriculturalInfo.phRange}
                                        </div>
                                    </div>
                                </div>
                                
                                <h4><i class="fas fa-seedling"></i> طرق الزراعة</h4>
                                <p>طريقة الزراعة: ${crop.agriculturalInfo.plantingMethod}</p>
                                <p>المسافات: ${crop.agriculturalInfo.spacing}</p>
                                <p>الإنتاجية: ${crop.agriculturalInfo.yield}</p>
                                
                                <h4><i class="fas fa-vial"></i> التسميد</h4>
                                <p>النيتروجين: ${crop.agriculturalInfo.fertilizer.nitrogen}</p>
                                <p>الفوسفور: ${crop.agriculturalInfo.fertilizer.phosphorus}</p>
                                <p>البوتاسيوم: ${crop.agriculturalInfo.fertilizer.potassium}</p>
                            </div>
                            
                            <!-- الفوائد الصحية -->
                            <div class="modal-section">
                                <h3><i class="fas fa-heart"></i> الفوائد الصحية</h3>
                                <ul class="benefits-list">
                                    ${crop.healthBenefits.map(benefit => `
                                        <li><i class="fas fa-check-circle"></i> ${benefit}</li>
                                    `).join('')}
                                </ul>
                            </div>
                            
                            <!-- القيمة الغذائية -->
                            <div class="modal-section">
                                <h3><i class="fas fa-apple-alt"></i> القيمة الغذائية (لكل 100 جرام)</h3>
                                <div class="nutrition-grid">
                                    <div class="nutrition-item">
                                        <div class="nutrition-value">${crop.nutritionalValue.calories}</div>
                                        <div class="nutrition-label">سعرة حرارية</div>
                                    </div>
                                    <div class="nutrition-item">
                                        <div class="nutrition-value">${crop.nutritionalValue.protein}</div>
                                        <div class="nutrition-label">بروتين</div>
                                    </div>
                                    <div class="nutrition-item">
                                        <div class="nutrition-value">${crop.nutritionalValue.carbohydrates}</div>
                                        <div class="nutrition-label">كربوهيدرات</div>
                                    </div>
                                    <div class="nutrition-item">
                                        <div class="nutrition-value">${crop.nutritionalValue.fiber}</div>
                                        <div class="nutrition-label">ألياف</div>
                                    </div>
                                    <div class="nutrition-item">
                                        <div class="nutrition-value">${crop.nutritionalValue.fat}</div>
                                        <div class="nutrition-label">دهون</div>
                                    </div>
                                </div>
                                
                                <h4><i class="fas fa-capsules"></i> الفيتامينات والمعادن</h4>
                                <div class="vitamins-minerals">
                                    <div class="vitamins">
                                        <strong>الفيتامينات:</strong><br>
                                        ${crop.nutritionalValue.vitamins.join('، ')}
                                    </div>
                                    <div class="minerals">
                                        <strong>المعادن:</strong><br>
                                        ${crop.nutritionalValue.minerals.join('، ')}
                                    </div>
                                </div>
                            </div>
                            
                            <!-- الآفات والأمراض -->
                            <div class="modal-section">
                                <h3><i class="fas fa-bug"></i> الآفات والأمراض الشائعة</h3>
                                <div class="pests-diseases">
                                    <div class="pests">
                                        <h4><i class="fas fa-bug"></i> الآفات:</h4>
                                        <ul>
                                            ${crop.commonPests.map(pest => `<li>${pest}</li>`).join('')}
                                        </ul>
                                    </div>
                                    <div class="diseases">
                                        <h4><i class="fas fa-virus"></i> الأمراض:</h4>
                                        <ul>
                                            ${crop.commonDiseases.map(disease => `<li>${disease}</li>`).join('')}
                                        </ul>
                                    </div>
                                </div>
                                
                                <h4><i class="fas fa-lightbulb"></i> نصائح للزراعة</h4>
                                <ul class="tips-list">
                                    ${crop.growingTips.map(tip => `
                                        <li><i class="fas fa-leaf"></i> ${tip}</li>
                                    `).join('')}
                                </ul>
                            </div>
                            
                            <!-- الاستخدامات والقيمة الاقتصادية -->
                            <div class="modal-section">
                                <h3><i class="fas fa-chart-line"></i> القيمة الاقتصادية</h3>
                                <div class="economic-info">
                                    <div class="economic-item">
                                        <i class="fas fa-globe"></i>
                                        <div>
                                            <strong>الإنتاج العالمي:</strong><br>
                                            ${crop.economicValue.globalProduction}
                                        </div>
                                    </div>
                                    <div class="economic-item">
                                        <i class="fas fa-flag"></i>
                                        <div>
                                            <strong>أكبر المنتجين:</strong><br>
                                            ${crop.economicValue.topProducers.join('، ')}
                                        </div>
                                    </div>
                                    <div class="economic-item">
                                        <i class="fas fa-money-bill-wave"></i>
                                        <div>
                                            <strong>القيمة السوقية:</strong><br>
                                            ${crop.economicValue.marketValue}
                                        </div>
                                    </div>
                                </div>
                                
                                <h4><i class="fas fa-industry"></i> الاستخدامات</h4>
                                <div class="uses-grid">
                                    ${crop.uses.map(use => `
                                        <div class="use-item">
                                            <i class="fas fa-check"></i> ${use}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="cropsSystem.printCropInfo('${crop.id}')">
                            <i class="fas fa-print"></i> طباعة المعلومات
                        </button>
                        <button class="btn btn-secondary" onclick="cropsSystem.shareCrop('${crop.id}')">
                            <i class="fas fa-share-alt"></i> مشاركة
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // عرض المعلومات الغذائية في نافذة منبثقة
    showNutritionModal(crop) {
        const modalHTML = `
            <div class="nutrition-modal">
                <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${crop.name} - القيمة الغذائية</h2>
                        <button class="close-btn" onclick="this.closest('.nutrition-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="nutrition-summary">
                            <div class="nutrition-icon">${crop.icon}</div>
                            <div class="nutrition-title">
                                <h3>القيمة الغذائية لكل 100 جرام</h3>
                                <p>${crop.description}</p>
                            </div>
                        </div>
                        
                        <div class="nutrition-details">
                            <div class="nutrition-card">
                                <div class="nutrition-value large">${crop.nutritionalValue.calories}</div>
                                <div class="nutrition-label">سعرة حرارية</div>
                            </div>
                            
                            <div class="nutrition-cards">
                                <div class="nutrition-card">
                                    <div class="nutrition-value">${crop.nutritionalValue.protein}</div>
                                    <div class="nutrition-label">بروتين</div>
                                    <div class="nutrition-percent">${this.calculatePercent(crop.nutritionalValue.protein, 'protein')}</div>
                                </div>
                                
                                <div class="nutrition-card">
                                    <div class="nutrition-value">${crop.nutritionalValue.carbohydrates}</div>
                                    <div class="nutrition-label">كربوهيدرات</div>
                                    <div class="nutrition-percent">${this.calculatePercent(crop.nutritionalValue.carbohydrates, 'carbs')}</div>
                                </div>
                                
                                <div class="nutrition-card">
                                    <div class="nutrition-value">${crop.nutritionalValue.fiber}</div>
                                    <div class="nutrition-label">ألياف</div>
                                    <div class="nutrition-percent">${this.calculatePercent(crop.nutritionalValue.fiber, 'fiber')}</div>
                                </div>
                                
                                <div class="nutrition-card">
                                    <div class="nutrition-value">${crop.nutritionalValue.fat}</div>
                                    <div class="nutrition-label">دهون</div>
                                    <div class="nutrition-percent">${this.calculatePercent(crop.nutritionalValue.fat, 'fat')}</div>
                                </div>
                            </div>
                            
                            <div class="nutrition-sections">
                                <div class="section">
                                    <h4><i class="fas fa-capsules"></i> الفيتامينات</h4>
                                    <div class="vitamins-list">
                                        ${crop.nutritionalValue.vitamins.map(vitamin => `
                                            <span class="vitamin-tag">${vitamin}</span>
                                        `).join('')}
                                    </div>
                                </div>
                                
                                <div class="section">
                                    <h4><i class="fas fa-gem"></i> المعادن</h4>
                                    <div class="minerals-list">
                                        ${crop.nutritionalValue.minerals.map(mineral => `
                                            <span class="mineral-tag">${mineral}</span>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="health-benefits">
                                <h4><i class="fas fa-heartbeat"></i> أهم الفوائد الصحية</h4>
                                <ul>
                                    ${crop.healthBenefits.slice(0, 3).map(benefit => `
                                        <li><i class="fas fa-check"></i> ${benefit}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="btn btn-primary" onclick="cropsSystem.viewDetails('${crop.id}')">
                            <i class="fas fa-info-circle"></i> التفاصيل الكاملة
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // حساب النسبة المئوية
    calculatePercent(value, type) {
        const dailyValues = {
            protein: '50g',
            carbs: '300g',
            fiber: '25g',
            fat: '70g'
        };
        
        const num = parseFloat(value);
        const daily = parseFloat(dailyValues[type]);
        
        if (!isNaN(num) && !isNaN(daily)) {
            const percent = (num / daily) * 100;
            return `${percent.toFixed(1)}%`;
        }
        
        return '';
    }
    
    // طباعة معلومات المحصول
    printCropInfo(cropId) {
        const crop = this.database.getCropDetails(cropId);
        if (!crop) return;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${crop.name} - معلومات المحصول</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .section { margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                        th { background-color: #4CAF50; color: white; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>${crop.name} (${crop.scientificName})</h1>
                        <p>${crop.description}</p>
                    </div>
                    
                    <div class="section">
                        <h2>المعلومات الأساسية</h2>
                        <p><strong>العائلة:</strong> ${crop.family}</p>
                        <p><strong>التصنيف:</strong> ${this.getCategoryArabic(crop.category)}</p>
                        <p><strong>المناطق المناسبة:</strong> ${crop.suitableRegions.join('، ')}</p>
                    </div>
                    
                    <div class="section">
                        <h2>المعلومات الزراعية</h2>
                        <table>
                            <tr><th>العنصر</th><th>القيمة</th></tr>
                            <tr><td>مواسم الزراعة</td><td>${crop.agriculturalInfo.plantingSeason.join('، ')}</td></tr>
                            <tr><td>مدة النمو</td><td>${crop.agriculturalInfo.growthPeriod}</td></tr>
                            <tr><td>درجة الحرارة</td><td>${crop.agriculturalInfo.temperatureRange}</td></tr>
                            <tr><td>احتياجات المياه</td><td>${crop.agriculturalInfo.waterNeeds}</td></tr>
                            <tr><td>نوع التربة</td><td>${crop.agriculturalInfo.soilType}</td></tr>
                            <tr><td>الإنتاجية</td><td>${crop.agriculturalInfo.yield}</td></tr>
                        </table>
                    </div>
                    
                    <div class="section">
                        <h2>القيمة الغذائية (لكل 100 جرام)</h2>
                        <table>
                            <tr><th>العنصر</th><th>القيمة</th></tr>
                            <tr><td>السعرات الحرارية</td><td>${crop.nutritionalValue.calories}</td></tr>
                            <tr><td>البروتين</td><td>${crop.nutritionalValue.protein}</td></tr>
                            <tr><td>الكربوهيدرات</td><td>${crop.nutritionalValue.carbohydrates}</td></tr>
                            <tr><td>الألياف</td><td>${crop.nutritionalValue.fiber}</td></tr>
                            <tr><td>الدهون</td><td>${crop.nutritionalValue.fat}</td></tr>
                        </table>
                    </div>
                    
                    <div class="section">
                        <h2>الفوائد الصحية</h2>
                        <ul>
                            ${crop.healthBenefits.map(benefit => `<li>${benefit}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="section">
                        <h2>نصائح للزراعة</h2>
                        <ul>
                            ${crop.growingTips.map(tip => `<li>${tip}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <p style="margin-top: 30px; text-align: center; color: #666;">
                        تم إنشاء هذا التقرير بواسطة نظام المرشد الزراعي الذكي
                    </p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
    
    // مشاركة المحصول
    shareCrop(cropId) {
        const crop = this.database.getCropDetails(cropId);
        if (!crop) return;
        
        const text = `تفضل بمشاهدة معلومات محصول ${crop.name} في نظام المرشد الزراعي الذكي`;
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: crop.name,
                text: text,
                url: url
            }).catch(console.error);
        } else {
            // بديل للمتصفحات التي لا تدعم Web Share API
            prompt('انسخ الرابط للمشاركة:', url);
        }
    }
    
    // تحديث الإحصائيات
    updateStats(count = null) {
        const totalCrops = this.database.getAllCrops().length;
        
        if (count !== null) {
            document.getElementById('cropsCount').textContent = count;
        } else {
            document.getElementById('cropsCount').textContent = totalCrops;
        }
        
        // تحديث إحصائيات التصنيفات
        const categories = ['grains', 'vegetables', 'fruits', 'tubers'];
        categories.forEach(category => {
            const count = this.database.getCropsByCategory(category).length;
            const element = document.getElementById(`${category}Count`);
            if (element) {
                element.textContent = count;
            }
        });
    }
    
    // إضافة مستمعي الأحداث للبطاقات
    addCardEventListeners() {
        document.querySelectorAll('.crop-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.save-btn') && 
                    !e.target.closest('.btn-primary') && 
                    !e.target.closest('.btn-secondary')) {
                    const cropId = card.dataset.cropId;
                    this.viewDetails(cropId);
                }
            });
        });
    }
    
    // إظهار إشعار
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.cropsSystem = new CropsSystem();
    cropsSystem.init();
});

// تصدير النظام
window.CropsSystem = CropsSystem;