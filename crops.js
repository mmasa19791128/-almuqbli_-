/**
 * Crop API - API لمعلومات المحاصيل الزراعية
 * الإصدار 6.0 - متكامل مع نظام النقاط والإعلانات
 */

class CropAPI {
    constructor() {
        this.baseURL = 'https://api.agriculture-smart.com/v1';
        this.localData = window.agricultureData || {};
        this.apiKey = this.getAPIKey();
        this.cacheDuration = 24 * 60 * 60 * 1000; // 24 ساعة
        this.init();
    }

    /**
     * تهيئة النظام
     */
    init() {
        this.setupCache();
        this.setupOfflineMode();
        console.log('🌱 Crop API جاهز للاستخدام');
    }

    /**
     * الحصول على مفتاح API
     */
    getAPIKey() {
        // استخدام مفتاح API حقيقي مع التشفير
        const encryptedKey = 'QUl6YVN5QnZ1R2stN0ZucGtVdk44VzJkSXR2V19OcWJNSWtZUlNJ';
        return atob(encryptedKey);
    }

    /**
     * إعداد نظام الكاش
     */
    setupCache() {
        this.cache = {
            crops: {},
            search: {},
            details: {}
        };
        
        // تحميل الكاش من localStorage
        this.loadCache();
    }

    /**
     * تحميل الكاش
     */
    loadCache() {
        try {
            const savedCache = localStorage.getItem('cropAPICache');
            if (savedCache) {
                const parsed = JSON.parse(savedCache);
                this.cache = { ...this.cache, ...parsed };
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل الكاش:', error);
        }
    }

    /**
     * حفظ الكاش
     */
    saveCache() {
        try {
            localStorage.setItem('cropAPICache', JSON.stringify(this.cache));
        } catch (error) {
            console.error('❌ خطأ في حفظ الكاش:', error);
        }
    }

    /**
     * إعداد وضع عدم الاتصال
     */
    setupOfflineMode() {
        // استخدام بيانات محلية عندما لا يكون هناك اتصال
        if (!navigator.onLine) {
            console.log('📴 العمل في وضع عدم الاتصال');
            this.useLocalDataOnly = true;
        }
    }

    /**
     * البحث عن محاصيل
     */
    async searchCrops(query, filters = {}) {
        const cacheKey = `search_${query}_${JSON.stringify(filters)}`;
        
        // التحقق من الكاش أولاً
        if (this.cache.search[cacheKey] && 
            Date.now() - this.cache.search[cacheKey].timestamp < this.cacheDuration) {
            console.log('📦 استخدام البيانات من الكاش');
            return this.cache.search[cacheKey].data;
        }

        try {
            let results = [];
            
            if (this.useLocalDataOnly || !navigator.onLine) {
                // استخدام البيانات المحلية
                results = this.searchLocalCrops(query, filters);
            } else {
                // استخدام API الخارجي
                const apiResults = await this.fetchFromAPI('crops/search', {
                    query: query,
                    filters: filters
                });
                
                results = apiResults.crops || [];
                
                // دمج مع البيانات المحلية
                const localResults = this.searchLocalCrops(query, filters);
                results = this.mergeResults(results, localResults);
            }
            
            // حفظ في الكاش
            this.cache.search[cacheKey] = {
                data: results,
                timestamp: Date.now()
            };
            this.saveCache();
            
            // منح نقاط للبحث
            this.awardPoints(1, `بحث عن: ${query}`);
            
            return results;
            
        } catch (error) {
            console.error('❌ خطأ في البحث:', error);
            
            // استخدام البيانات المحلية كحل بديل
            return this.searchLocalCrops(query, filters);
        }
    }

    /**
     * البحث في البيانات المحلية
     */
    searchLocalCrops(query, filters) {
        if (!this.localData.crops) return [];
        
        let results = this.localData.crops.filter(crop => {
            const matchesQuery = crop.name.includes(query) || 
                                crop.type.includes(query) ||
                                (crop.description && crop.description.includes(query));
            
            let matchesFilters = true;
            if (filters.type) {
                matchesFilters = crop.type === filters.type;
            }
            if (filters.season) {
                matchesFilters = matchesFilters && 
                                crop.season && 
                                crop.season.includes(filters.season);
            }
            
            return matchesQuery && matchesFilters;
        });
        
        return results.slice(0, 50); // حد أقصى 50 نتيجة
    }

    /**
     * دمج النتائج
     */
    mergeResults(apiResults, localResults) {
        const merged = [...apiResults];
        const apiIds = new Set(apiResults.map(r => r.id));
        
        localResults.forEach(local => {
            if (!apiIds.has(local.id)) {
                merged.push(local);
            }
        });
        
        // إزالة التكرارات
        return merged.filter((crop, index, self) =>
            index === self.findIndex(c => c.id === crop.id)
        );
    }

    /**
     * الحصول على تفاصيل المحصول
     */
    async getCropDetails(cropId) {
        const cacheKey = `details_${cropId}`;
        
        // التحقق من الكاش أولاً
        if (this.cache.details[cacheKey] && 
            Date.now() - this.cache.details[cacheKey].timestamp < this.cacheDuration) {
            return this.cache.details[cacheKey].data;
        }

        try {
            let details = null;
            
            if (this.useLocalDataOnly || !navigator.onLine) {
                // استخدام البيانات المحلية
                details = this.getLocalCropDetails(cropId);
            } else {
                // استخدام API الخارجي
                details = await this.fetchFromAPI(`crops/${cropId}`);
                
                if (!details) {
                    details = this.getLocalCropDetails(cropId);
                }
            }
            
            if (details) {
                // حفظ في الكاش
                this.cache.details[cacheKey] = {
                    data: details,
                    timestamp: Date.now()
                };
                this.saveCache();
                
                // منح نقاط لعرض التفاصيل
                this.awardPoints(2, `عرض تفاصيل: ${details.name}`);
            }
            
            return details;
            
        } catch (error) {
            console.error('❌ خطأ في الحصول على التفاصيل:', error);
            return this.getLocalCropDetails(cropId);
        }
    }

    /**
     * الحصول على تفاصيل المحصول من البيانات المحلية
     */
    getLocalCropDetails(cropId) {
        if (!this.localData.crops) return null;
        
        const crop = this.localData.crops.find(c => c.id === cropId);
        if (!crop) return null;
        
        // تحسين البيانات المحلية
        return {
            ...crop,
            images: crop.images || [
                'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=' + encodeURIComponent(crop.name)
            ],
            diseases: crop.diseases || [],
            pesticides: crop.pesticides || [],
            fertilizers: crop.fertilizers || []
        };
    }

    /**
     * الحصول على محاصيل الموسم
     */
    async getSeasonalCrops(season = null, region = null) {
        const currentSeason = season || this.getCurrentSeason();
        const userRegion = region || localStorage.getItem('userRegion') || 'وسط';
        
        const cacheKey = `seasonal_${currentSeason}_${userRegion}`;
        
        if (this.cache.crops[cacheKey] && 
            Date.now() - this.cache.crops[cacheKey].timestamp < this.cacheDuration) {
            return this.cache.crops[cacheKey].data;
        }

        try {
            let crops = [];
            
            if (this.useLocalDataOnly || !navigator.onLine) {
                crops = this.getLocalSeasonalCrops(currentSeason);
            } else {
                const response = await this.fetchFromAPI('crops/seasonal', {
                    season: currentSeason,
                    region: userRegion
                });
                
                crops = response.crops || [];
                
                if (crops.length === 0) {
                    crops = this.getLocalSeasonalCrops(currentSeason);
                }
            }
            
            // ترشيح حسب المنطقة
            crops = crops.filter(crop => 
                !crop.regions || 
                crop.regions.includes(userRegion) || 
                crop.regions.includes('all')
            );
            
            // حفظ في الكاش
            this.cache.crops[cacheKey] = {
                data: crops,
                timestamp: Date.now()
            };
            this.saveCache();
            
            return crops;
            
        } catch (error) {
            console.error('❌ خطأ في الحصول على محاصيل الموسم:', error);
            return this.getLocalSeasonalCrops(currentSeason);
        }
    }

    /**
     * الحصول على محاصيل الموسم من البيانات المحلية
     */
    getLocalSeasonalCrops(season) {
        if (!this.localData.crops) return [];
        
        return this.localData.crops.filter(crop => 
            crop.season && crop.season.includes(season)
        );
    }

    /**
     * الحصول على الموسم الحالي
     */
    getCurrentSeason() {
        const month = new Date().getMonth() + 1;
        
        if (month >= 3 && month <= 5) return 'ربيع';
        if (month >= 6 && month <= 8) return 'صيف';
        if (month >= 9 && month <= 11) return 'خريف';
        return 'شتاء';
    }

    /**
     * الحصول على محاصيل مميزة
     */
    async getFeaturedCrops() {
        try {
            let crops = [];
            
            if (navigator.onLine && !this.useLocalDataOnly) {
                crops = await this.fetchFromAPI('crops/featured');
            }
            
            if (!crops || crops.length === 0) {
                crops = this.getLocalFeaturedCrops();
            }
            
            return crops.slice(0, 6); // 6 محاصيل مميزة فقط
            
        } catch (error) {
            console.error('❌ خطأ في الحصول على المحاصيل المميزة:', error);
            return this.getLocalFeaturedCrops();
        }
    }

    /**
     * الحصول على محاصيل مميزة من البيانات المحلية
     */
    getLocalFeaturedCrops() {
        if (!this.localData.crops) return [];
        
        // اختيار عشوائي لبعض المحاصيل
        const shuffled = [...this.localData.crops].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 6);
    }

    /**
     * الحصول على توصيات المحاصيل
     */
    async getCropRecommendations(soilType, waterAvailability, experienceLevel = 'beginner') {
        const cacheKey = `recommendations_${soilType}_${waterAvailability}_${experienceLevel}`;
        
        if (this.cache.crops[cacheKey] && 
            Date.now() - this.cache.crops[cacheKey].timestamp < this.cacheDuration) {
            return this.cache.crops[cacheKey].data;
        }

        try {
            let recommendations = [];
            
            if (navigator.onLine && !this.useLocalDataOnly) {
                recommendations = await this.fetchFromAPI('crops/recommendations', {
                    soil_type: soilType,
                    water_availability: waterAvailability,
                    experience_level: experienceLevel
                });
            }
            
            if (!recommendations || recommendations.length === 0) {
                recommendations = this.getLocalRecommendations(soilType, waterAvailability, experienceLevel);
            }
            
            // حفظ في الكاش
            this.cache.crops[cacheKey] = {
                data: recommendations,
                timestamp: Date.now()
            };
            this.saveCache();
            
            return recommendations;
            
        } catch (error) {
            console.error('❌ خطأ في الحصول على التوصيات:', error);
            return this.getLocalRecommendations(soilType, waterAvailability, experienceLevel);
        }
    }

    /**
     * الحصول على توصيات من البيانات المحلية
     */
    getLocalRecommendations(soilType, waterAvailability, experienceLevel) {
        if (!this.localData.crops) return [];
        
        return this.localData.crops.filter(crop => {
            let suitable = true;
            
            if (crop.soilRequirements) {
                suitable = crop.soilRequirements.includes(soilType);
            }
            
            if (crop.waterNeeds) {
                if (waterAvailability === 'low' && crop.waterNeeds === 'high') {
                    suitable = false;
                }
                if (waterAvailability === 'high' && crop.waterNeeds === 'low') {
                    suitable = true; // يمكن زراعته ولكن مع هدر مائي
                }
            }
            
            if (crop.difficulty) {
                if (experienceLevel === 'beginner' && crop.difficulty === 'hard') {
                    suitable = false;
                }
            }
            
            return suitable;
        }).slice(0, 10); // 10 توصيات كحد أقصى
    }

    /**
     * الحصول على جدول زراعة المحصول
     */
    async getPlantingSchedule(cropId, region = null) {
        const userRegion = region || localStorage.getItem('userRegion') || 'وسط';
        
        try {
            let schedule = null;
            
            if (navigator.onLine && !this.useLocalDataOnly) {
                schedule = await this.fetchFromAPI(`crops/${cropId}/schedule`, {
                    region: userRegion
                });
            }
            
            if (!schedule) {
                schedule = this.generateLocalSchedule(cropId, userRegion);
            }
            
            return schedule;
            
        } catch (error) {
            console.error('❌ خطأ في الحصول على جدول الزراعة:', error);
            return this.generateLocalSchedule(cropId, userRegion);
        }
    }

    /**
     * توليد جدول زراعة محلي
     */
    generateLocalSchedule(cropId, region) {
        const crop = this.getLocalCropDetails(cropId);
        if (!crop) return null;
        
        const today = new Date();
        const plantingDate = new Date(today);
        plantingDate.setDate(today.getDate() + 7); // الزراعة بعد أسبوع
        
        const harvestDate = new Date(plantingDate);
        if (crop.growthPeriod) {
            harvestDate.setDate(plantingDate.getDate() + crop.growthPeriod);
        } else {
            harvestDate.setDate(plantingDate.getDate() + 90); // 90 يوم افتراضي
        }
        
        return {
            crop: crop.name,
            region: region,
            planting_date: plantingDate.toISOString().split('T')[0],
            harvest_date: harvestDate.toISOString().split('T')[0],
            watering_schedule: this.generateWateringSchedule(crop),
            fertilization_schedule: this.generateFertilizationSchedule(crop),
            pest_control_schedule: this.generatePestControlSchedule(crop),
            tasks: this.generateTasks(crop, plantingDate)
        };
    }

    /**
     * توليد جدول الري
     */
    generateWateringSchedule(crop) {
        const schedule = [];
        
        for (let i = 0; i < 12; i++) { // 12 أسبوع
            schedule.push({
                week: i + 1,
                frequency: crop.waterNeeds === 'high' ? 'يومياً' : 
                          crop.waterNeeds === 'medium' ? 'كل يومين' : 'كل 3 أيام',
                amount: crop.waterNeeds === 'high' ? '3-5 لتر/نبات' : 
                       crop.waterNeeds === 'medium' ? '2-3 لتر/نبات' : '1-2 لتر/نبات',
                notes: 'الري في الصباح الباكر'
            });
        }
        
        return schedule;
    }

    /**
     * توليد جدول التسميد
     */
    generateFertilizationSchedule(crop) {
        return [
            {
                stage: 'قبل الزراعة',
                fertilizer: 'سماد عضوي',
                amount: '10-20 طن/هكتار',
                method: 'نثر وخلط مع التربة'
            },
            {
                stage: 'بعد 3 أسابيع',
                fertilizer: 'نيتروجين',
                amount: '50 كجم/هكتار',
                method: 'نثر حول النباتات'
            },
            {
                stage: 'بعد 6 أسابيع',
                fertilizer: 'فسفور وبوتاسيوم',
                amount: '30 كجم/هكتار',
                method: 'نثر مع الري'
            }
        ];
    }

    /**
     * توليد جدول مكافحة الآفات
     */
    generatePestControlSchedule(crop) {
        return [
            {
                stage: 'وقائي',
                treatment: 'رش وقائي',
                pesticide: 'مبيد حشري واسع الطيف',
                frequency: 'كل أسبوعين'
            },
            {
                stage: 'عند ظهور الآفات',
                treatment: 'رش علاجي',
                pesticide: 'مبيد متخصص',
                frequency: 'حسب الحاجة'
            }
        ];
    }

    /**
     * توليد المهام
     */
    generateTasks(crop, startDate) {
        const tasks = [];
        const taskTypes = ['تحضير الأرض', 'الزراعة', 'الري', 'التسميد', 'مكافحة الآفات', 'الحصاد'];
        
        taskTypes.forEach((type, index) => {
            const taskDate = new Date(startDate);
            taskDate.setDate(startDate.getDate() + (index * 14)); // كل أسبوعين مهمة
            
            tasks.push({
                id: `task_${index}`,
                type: type,
                date: taskDate.toISOString().split('T')[0],
                description: `${type} ${crop.name}`,
                completed: false
            });
        });
        
        return tasks;
    }

    /**
     * إرسال طلب إلى API
     */
    async fetchFromAPI(endpoint, data = null) {
        if (!navigator.onLine || this.useLocalDataOnly) {
            throw new Error('No internet connection');
        }
        
        const url = `${this.baseURL}/${endpoint}`;
        const options = {
            method: data ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'X-API-Key': this.apiKey,
                'X-App-Version': '6.0',
                'X-User-ID': localStorage.getItem('userId') || 'guest'
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const result = await response.json();
            
            // تسجيل استخدام API
            this.logAPICall(endpoint, 'success');
            
            return result;
            
        } catch (error) {
            console.error(`❌ API Call Failed: ${endpoint}`, error);
            this.logAPICall(endpoint, 'failed');
            throw error;
        }
    }

    /**
     * تسجيل استدعاءات API
     */
    logAPICall(endpoint, status) {
        const logs = JSON.parse(localStorage.getItem('apiLogs') || '[]');
        
        logs.push({
            endpoint,
            status,
            timestamp: new Date().toISOString(),
            online: navigator.onLine
        });
        
        // حفظ آخر 100 سجل فقط
        if (logs.length > 100) {
            logs.shift();
        }
        
        localStorage.setItem('apiLogs', JSON.stringify(logs));
    }

    /**
     * منح نقاط للمستخدم
     */
    awardPoints(points, reason) {
        const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
        const newPoints = currentPoints + points;
        
        localStorage.setItem('userPoints', newPoints.toString());
        
        // إرسال حدث تحديث النقاط
        window.dispatchEvent(new CustomEvent('pointsUpdated'));
        
        console.log(`🎉 منحت ${points} نقطة لـ: ${reason}`);
    }

    /**
     * الحصول على إحصاءات API
     */
    getStats() {
        const logs = JSON.parse(localStorage.getItem('apiLogs') || '[]');
        const successfulCalls = logs.filter(log => log.status === 'success').length;
        const failedCalls = logs.filter(log => log.status === 'failed').length;
        
        return {
            totalCalls: logs.length,
            successfulCalls,
            failedCalls,
            successRate: logs.length > 0 ? 
                Math.round((successfulCalls / logs.length) * 100) : 0,
            cacheHits: Object.keys(this.cache.search).length + 
                      Object.keys(this.cache.details).length +
                      Object.keys(this.cache.crops).length,
            lastCall: logs[logs.length - 1] || null
        };
    }

    /**
     * مسح الكاش
     */
    clearCache() {
        this.cache = {
            crops: {},
            search: {},
            details: {}
        };
        localStorage.removeItem('cropAPICache');
        console.log('🗑️ تم مسح كاش API');
    }

    /**
     * تصدير بيانات API
     */
    exportData() {
        return {
            cache: this.cache,
            stats: this.getStats(),
            timestamp: new Date().toISOString()
        };
    }
}

// تصدير الكلاس
if (typeof window !== 'undefined') {
    window.CropAPI = CropAPI;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CropAPI;
}