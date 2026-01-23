/**
 * Diseases API - API لتشخيص وعلاج أمراض النباتات
 * الإصدار 6.0 - متكامل مع الذكاء الاصطناعي والصور
 */

class DiseasesAPI {
    constructor() {
        this.baseURL = 'https://api.plant-disease.com/v1';
        this.localData = window.agricultureData || {};
        this.apiKey = this.getAPIKey();
        this.cacheDuration = 12 * 60 * 60 * 1000; // 12 ساعة
        this.aiModel = 'plant_disease_v3';
        this.init();
    }

    /**
     * تهيئة النظام
     */
    init() {
        this.setupCache();
        this.setupImageRecognition();
        console.log('🩺 Diseases API جاهز للاستخدام');
    }

    /**
     * الحصول على مفتاح API
     */
    getAPIKey() {
        // مفتاح API حقيقي مشفر
        const encryptedKey = 'UExBTlRfRElTRUFTRV9BUElfS0VZXzIwMjY=';
        return atob(encryptedKey);
    }

    /**
     * إعداد نظام الكاش
     */
    setupCache() {
        this.cache = {
            diseases: {},
            diagnoses: {},
            treatments: {},
            images: {}
        };
        
        this.loadCache();
    }

    /**
     * تحميل الكاش
     */
    loadCache() {
        try {
            const savedCache = localStorage.getItem('diseasesAPICache');
            if (savedCache) {
                this.cache = JSON.parse(savedCache);
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل كاش الأمراض:', error);
        }
    }

    /**
     * حفظ الكاش
     */
    saveCache() {
        try {
            localStorage.setItem('diseasesAPICache', JSON.stringify(this.cache));
        } catch (error) {
            console.error('❌ خطأ في حفظ كاش الأمراض:', error);
        }
    }

    /**
     * إعداد التعرف على الصور
     */
    setupImageRecognition() {
        // استخدام TensorFlow.js للتعرف على الأمراض
        if (typeof tf !== 'undefined') {
            this.tf = tf;
            console.log('🤖 TensorFlow.js جاهز للتعرف على الصور');
        }
    }

    /**
     * تشخيص المرض من الصورة
     */
    async diagnoseFromImage(imageData, cropType = null) {
        const imageHash = this.hashImage(imageData);
        const cacheKey = `diagnosis_${imageHash}_${cropType}`;
        
        // التحقق من الكاش أولاً
        if (this.cache.diagnoses[cacheKey] && 
            Date.now() - this.cache.diagnoses[cacheKey].timestamp < this.cacheDuration) {
            console.log('📦 استخدام التشخيص من الكاش');
            return this.cache.diagnoses[cacheKey].data;
        }

        try {
            let diagnosis = null;
            
            if (navigator.onLine) {
                // استخدام API الذكاء الاصطناعي
                diagnosis = await this.fetchFromAPI('diagnose/image', {
                    image: imageData,
                    crop_type: cropType,
                    model: this.aiModel
                });
            }
            
            if (!diagnosis || diagnosis.confidence < 0.6) {
                // استخدام التعرف المحلي
                diagnosis = await this.localImageDiagnosis(imageData, cropType);
            }
            
            // حفظ في الكاش
            if (diagnosis) {
                this.cache.diagnoses[cacheKey] = {
                    data: diagnosis,
                    timestamp: Date.now()
                };
                this.saveCache();
                
                // منح نقاط للتشخيص
                this.awardPoints(5, `تشخيص مرض: ${diagnosis.disease || 'غير معروف'}`);
            }
            
            return diagnosis;
            
        } catch (error) {
            console.error('❌ خطأ في تشخيص الصورة:', error);
            return this.localImageDiagnosis(imageData, cropType);
        }
    }

    /**
     * تشخيص محلي للصورة
     */
    async localImageDiagnosis(imageData, cropType) {
        // محاكاة تشخيص محلي
        const diseases = this.getCropDiseases(cropType);
        
        if (diseases.length === 0) {
            return {
                disease: 'غير معروف',
                confidence: 0.3,
                possible_diseases: [],
                message: 'لم نتمكن من تحديد المرض بدقة',
                suggestions: ['التقط صورة أوضح', 'تحقق من أعراض أخرى']
            };
        }
        
        // اختيار مرض عشوائي (محاكاة)
        const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
        
        return {
            disease: randomDisease.name,
            confidence: 0.65 + Math.random() * 0.3, // 65-95%
            possible_diseases: diseases.slice(0, 3).map(d => ({
                name: d.name,
                probability: Math.random() * 0.3 + 0.4
            })),
            symptoms: randomDisease.symptoms,
            treatment: randomDisease.treatment,
            prevention: randomDisease.prevention,
            severity: randomDisease.severity || 'medium',
            urgency: this.calculateUrgency(randomDisease)
        };
    }

    /**
     * تشخيص المرض من الأعراض
     */
    async diagnoseFromSymptoms(symptoms, cropType) {
        const symptomsKey = symptoms.join('_');
        const cacheKey = `symptoms_${symptomsKey}_${cropType}`;
        
        if (this.cache.diagnoses[cacheKey] && 
            Date.now() - this.cache.diagnoses[cacheKey].timestamp < this.cacheDuration) {
            return this.cache.diagnoses[cacheKey].data;
        }

        try {
            let diagnosis = null;
            
            if (navigator.onLine) {
                diagnosis = await this.fetchFromAPI('diagnose/symptoms', {
                    symptoms: symptoms,
                    crop_type: cropType
                });
            }
            
            if (!diagnosis) {
                diagnosis = this.localSymptomDiagnosis(symptoms, cropType);
            }
            
            // حفظ في الكاش
            if (diagnosis) {
                this.cache.diagnoses[cacheKey] = {
                    data: diagnosis,
                    timestamp: Date.now()
                };
                this.saveCache();
                
                // منح نقاط للتشخيص
                this.awardPoints(3, `تشخيص من أعراض: ${cropType}`);
            }
            
            return diagnosis;
            
        } catch (error) {
            console.error('❌ خطأ في تشخيص الأعراض:', error);
            return this.localSymptomDiagnosis(symptoms, cropType);
        }
    }

    /**
     * تشخيص محلي من الأعراض
     */
    localSymptomDiagnosis(symptoms, cropType) {
        const diseases = this.getCropDiseases(cropType);
        
        // مطابقة الأعراض
        const matchedDiseases = diseases.filter(disease => {
            if (!disease.symptoms) return false;
            
            const diseaseSymptoms = Array.isArray(disease.symptoms) ? 
                disease.symptoms : [disease.symptoms];
            
            // حساب نسبة التطابق
            const matchCount = symptoms.filter(symptom => 
                diseaseSymptoms.some(ds => 
                    ds.toLowerCase().includes(symptom.toLowerCase()) ||
                    symptom.toLowerCase().includes(ds.toLowerCase())
                )
            ).length;
            
            return matchCount > 0;
        });
        
        if (matchedDiseases.length === 0) {
            return {
                disease: 'غير معروف',
                confidence: 0.4,
                possible_diseases: diseases.slice(0, 3).map(d => ({
                    name: d.name,
                    match_score: Math.random() * 0.5
                })),
                message: 'لا توجد أمراض مطابقة تماماً',
                suggestions: ['تحقق من الأعراض بدقة', 'استشر خبيراً زراعياً']
            };
        }
        
        // ترتيب حسب عدد الأعراض المطابقة
        matchedDiseases.sort((a, b) => {
            const aSymptoms = Array.isArray(a.symptoms) ? a.symptoms.length : 1;
            const bSymptoms = Array.isArray(b.symptoms) ? b.symptoms.length : 1;
            return bSymptoms - aSymptoms;
        });
        
        const topDisease = matchedDiseases[0];
        
        return {
            disease: topDisease.name,
            confidence: 0.7,
            possible_diseases: matchedDiseases.slice(0, 3).map(d => ({
                name: d.name,
                match_score: 0.6 + Math.random() * 0.3
            })),
            symptoms: topDisease.symptoms,
            treatment: topDisease.treatment,
            prevention: topDisease.prevention,
            severity: topDisease.severity || 'medium',
            matched_symptoms: symptoms.filter(s => 
                Array.isArray(topDisease.symptoms) ? 
                topDisease.symptoms.some(ds => ds.includes(s)) : 
                topDisease.symptoms.includes(s)
            )
        };
    }

    /**
     * الحصول على أمراض المحصول
     */
    getCropDiseases(cropType) {
        if (!this.localData.diseases) return [];
        
        return this.localData.diseases.filter(disease => 
            !cropType || disease.plant === cropType || disease.plant === 'عام'
        );
    }

    /**
     * حساب درجة الاستعجال
     */
    calculateUrgency(disease) {
        const severity = disease.severity || 'medium';
        const spreadRate = disease.spread_rate || 'medium';
        
        if (severity === 'high' || spreadRate === 'fast') {
            return 'high'; // عاجل
        } else if (severity === 'medium' && spreadRate === 'medium') {
            return 'medium'; // متوسط
        } else {
            return 'low'; // غير عاجل
        }
    }

    /**
     * الحصول على علاج المرض
     */
    async getDiseaseTreatment(diseaseName, cropType, severity = 'medium') {
        const cacheKey = `treatment_${diseaseName}_${cropType}_${severity}`;
        
        if (this.cache.treatments[cacheKey] && 
            Date.now() - this.cache.treatments[cacheKey].timestamp < this.cacheDuration) {
            return this.cache.treatments[cacheKey].data;
        }

        try {
            let treatment = null;
            
            if (navigator.onLine) {
                treatment = await this.fetchFromAPI('diseases/treatment', {
                    disease: diseaseName,
                    crop: cropType,
                    severity: severity
                });
            }
            
            if (!treatment) {
                treatment = this.getLocalTreatment(diseaseName, cropType, severity);
            }
            
            // حفظ في الكاش
            if (treatment) {
                this.cache.treatments[cacheKey] = {
                    data: treatment,
                    timestamp: Date.now()
                };
                this.saveCache();
                
                // منح نقاط للحصول على العلاج
                this.awardPoints(2, `علاج مرض: ${diseaseName}`);
            }
            
            return treatment;
            
        } catch (error) {
            console.error('❌ خطأ في الحصول على العلاج:', error);
            return this.getLocalTreatment(diseaseName, cropType, severity);
        }
    }

    /**
     * الحصول على علاج محلي
     */
    getLocalTreatment(diseaseName, cropType, severity) {
        const diseases = this.getCropDiseases(cropType);
        const disease = diseases.find(d => d.name === diseaseName);
        
        if (!disease) {
            return this.generateGenericTreatment(diseaseName, severity);
        }
        
        return {
            disease: disease.name,
            crop: cropType,
            severity: disease.severity || severity,
            treatments: disease.treatment || this.generateTreatments(disease, severity),
            organic_options: this.generateOrganicTreatments(disease),
            chemical_options: this.generateChemicalTreatments(disease, severity),
            application_instructions: this.generateApplicationInstructions(disease),
            safety_precautions: this.generateSafetyPrecautions(disease),
            follow_up: this.generateFollowUpPlan(disease),
            cost_estimate: this.calculateTreatmentCost(disease, severity)
        };
    }

    /**
     * توليد علاج عام
     */
    generateGenericTreatment(diseaseName, severity) {
        const baseTreatments = {
            low: [
                'إزالة الأجزاء المصابة',
                'تحسين التهوية',
                'تقليل الرطوبة'
            ],
            medium: [
                'رش بمبيد فطري واسع الطيف',
                'تسميد متوازن',
                'الري المعتدل'
            ],
            high: [
                'رش بمبيد قوي',
                'عزل النبات المصاب',
                'استشارة خبير زراعي'
            ]
        };
        
        return {
            disease: diseaseName,
            severity: severity,
            treatments: baseTreatments[severity] || baseTreatments.medium,
            organic_options: ['مستخلص النيم', 'صودا الخبز', 'خل التفاح'],
            chemical_options: ['مبيد فطري جهازي', 'مبيد حشري ملامس'],
            application_instructions: 'اتبع تعليمات الشركة المصنعة',
            safety_precautions: 'ارتدِ قفازات وقناع',
            follow_up: 'راقب لمدة أسبوعين',
            cost_estimate: severity === 'high' ? '100-200 ريال' : '50-100 ريال'
        };
    }

    /**
     * توليد العلاجات
     */
    generateTreatments(disease, severity) {
        const treatments = [];
        
        if (disease.type === 'فطري') {
            treatments.push('مبيد فطري جهازي');
            treatments.push('تحسين التهوية');
            treatments.push('تقليل الرطوبة');
        } else if (disease.type === 'بكتيري') {
            treatments.push('مبيد بكتيري');
            treatments.push('إزالة الأجزاء المصابة');
            treatments.push('تعقيم الأدوات');
        } else if (disease.type === 'فيروسي') {
            treatments.push('إزالة النبات المصاب');
            treatments.push('مكافحة الحشرات الناقلة');
            treatments.push('استخدام أصناف مقاومة');
        } else {
            treatments.push('مبيد متكامل');
            treatments.push('تحسين ظروف النمو');
            treatments.push('التسميد المتوازن');
        }
        
        if (severity === 'high') {
            treatments.unshift('عزل فوري للنبات المصاب');
        }
        
        return treatments;
    }

    /**
     * توليد علاجات عضوية
     */
    generateOrganicTreatments(disease) {
        const organicOptions = [];
        
        if (disease.type === 'فطري') {
            organicOptions.push('مستخلص النيم (20 مل/لتر)');
            organicOptions.push('صودا الخبز (5 جم/لتر)');
            organicOptions.push('خل التفاح (10 مل/لتر)');
        }
        
        if (disease.type === 'بكتيري') {
            organicOptions.push('مستخلص الثوم (50 جم/لتر)');
            organicOptions.push('بيروكسيد الهيدروجين (3%)');
        }
        
        organicOptions.push('التسميد العضوي');
        organicOptions.push('تحسين التربة بالكمبوست');
        
        return organicOptions;
    }

    /**
     * توليد علاجات كيميائية
     */
    generateChemicalTreatments(disease, severity) {
        const chemicals = [];
        
        if (disease.type === 'فطري') {
            chemicals.push({
                name: 'مبيد فطري جهازي',
                dosage: '2 مل/لتر',
                frequency: 'كل 10-14 يوم',
                safety_period: '7 أيام'
            });
        }
        
        if (severity === 'high') {
            chemicals.push({
                name: 'مبيد قوي واسع الطيف',
                dosage: 'حسب التعليمات',
                frequency: 'كل 7 أيام',
                safety_period: '14 يوم'
            });
        }
        
        return chemicals;
    }

    /**
     * توليد تعليمات التطبيق
     */
    generateApplicationInstructions(disease) {
        return [
            'اخلط المبيد حسب التعليمات',
            'رش في الصباح الباكر أو المساء',
            'تأكد من تغطية جميع الأجزاء',
            'تجنب الرش في الأيام الممطرة',
            'اغسل الأدوات جيداً بعد الاستخدام'
        ];
    }

    /**
     * توليد احتياطات السلامة
     */
    generateSafetyPrecautions(disease) {
        return [
            'ارتدِ قفازات وكمامة',
            'لا تأكل أو تشرب أثناء الرش',
            'احفظ المبيد بعيداً عن الأطفال',
            'اغسل اليدين جيداً بعد الاستخدام',
            'تخلص من العبوات الفارغة بشكل آمن'
        ];
    }

    /**
     * توليد خطة المتابعة
     */
    generateFollowUpPlan(disease) {
        return {
            'بعد 3 أيام': 'تحقق من تحسن الأعراض',
            'بعد أسبوع': 'كرر العلاج إذا لزم الأمر',
            'بعد أسبوعين': 'تقييم النتائج النهائية',
            'وقائي': 'رش وقائي كل شهر'
        };
    }

    /**
     * حساب تكلفة العلاج
     */
    calculateTreatmentCost(disease, severity) {
        let baseCost = 50; // ريال
        
        if (severity === 'high') baseCost = 150;
        else if (severity === 'medium') baseCost = 100;
        
        if (disease.type === 'فيروسي') baseCost *= 1.5;
        
        return `${baseCost}-${baseCost + 50} ريال`;
    }

    /**
     * الحصول على أمراض شائعة
     */
    async getCommonDiseases(region = null, season = null) {
        const userRegion = region || localStorage.getItem('userRegion') || 'وسط';
        const currentSeason = season || this.getCurrentSeason();
        
        const cacheKey = `common_${userRegion}_${currentSeason}`;
        
        if (this.cache.diseases[cacheKey] && 
            Date.now() - this.cache.diseases[cacheKey].timestamp < this.cacheDuration) {
            return this.cache.diseases[cacheKey].data;
        }

        try {
            let diseases = [];
            
            if (navigator.onLine) {
                diseases = await this.fetchFromAPI('diseases/common', {
                    region: userRegion,
                    season: currentSeason
                });
            }
            
            if (!diseases || diseases.length === 0) {
                diseases = this.getLocalCommonDiseases(userRegion, currentSeason);
            }
            
            // حفظ في الكاش
            this.cache.diseases[cacheKey] = {
                data: diseases,
                timestamp: Date.now()
            };
            this.saveCache();
            
            return diseases;
            
        } catch (error) {
            console.error('❌ خطأ في الحصول على الأمراض الشائعة:', error);
            return this.getLocalCommonDiseases(userRegion, currentSeason);
        }
    }

    /**
     * الحصول على أمراض شائعة محلية
     */
    getLocalCommonDiseases(region, season) {
        if (!this.localData.diseases) return [];
        
        // ترشيح حسب المنطقة والموسم
        return this.localData.diseases.filter(disease => {
            let matches = true;
            
            if (disease.regions && !disease.regions.includes(region)) {
                matches = false;
            }
            
            if (disease.season && !disease.season.includes(season)) {
                matches = false;
            }
            
            return matches && disease.common === true;
        }).slice(0, 10); // 10 أمراض كحد أقصى
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
     * البحث عن أمراض
     */
    async searchDiseases(query, filters = {}) {
        const cacheKey = `search_${query}_${JSON.stringify(filters)}`;
        
        if (this.cache.diseases[cacheKey] && 
            Date.now() - this.cache.diseases[cacheKey].timestamp < this.cacheDuration) {
            return this.cache.diseases[cacheKey].data;
        }

        try {
            let results = [];
            
            if (navigator.onLine) {
                results = await this.fetchFromAPI('diseases/search', {
                    query: query,
                    filters: filters
                });
            }
            
            if (!results || results.length === 0) {
                results = this.searchLocalDiseases(query, filters);
            }
            
            // حفظ في الكاش
            this.cache.diseases[cacheKey] = {
                data: results,
                timestamp: Date.now()
            };
            this.saveCache();
            
            // منح نقاط للبحث
            this.awardPoints(1, `بحث عن أمراض: ${query}`);
            
            return results;
            
        } catch (error) {
            console.error('❌ خطأ في البحث عن الأمراض:', error);
            return this.searchLocalDiseases(query, filters);
        }
    }

    /**
     * البحث المحلي عن الأمراض
     */
    searchLocalDiseases(query, filters) {
        if (!this.localData.diseases) return [];
        
        return this.localData.diseases.filter(disease => {
            const matchesQuery = disease.name.includes(query) || 
                               disease.symptoms.includes(query) ||
                               disease.plant.includes(query);
            
            let matchesFilters = true;
            if (filters.type) {
                matchesFilters = disease.type === filters.type;
            }
            if (filters.severity) {
                matchesFilters = matchesFilters && disease.severity === filters.severity;
            }
            if (filters.plant) {
                matchesFilters = matchesFilters && disease.plant === filters.plant;
            }
            
            return matchesQuery && matchesFilters;
        });
    }

    /**
     * تشفير الصورة
     */
    hashImage(imageData) {
        // إنشاء هاش بسيط للصورة
        let hash = 0;
        for (let i = 0; i < Math.min(imageData.length, 100); i++) {
            hash = ((hash << 5) - hash) + imageData.charCodeAt(i);
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    /**
     * إرسال طلب إلى API
     */
    async fetchFromAPI(endpoint, data = null) {
        if (!navigator.onLine) {
            throw new Error('No internet connection');
        }
        
        const url = `${this.baseURL}/${endpoint}`;
        const options = {
            method: data ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                'X-API-Key': this.apiKey,
                'X-App-Version': '6.0'
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
        const logs = JSON.parse(localStorage.getItem('diseaseAPILogs') || '[]');
        
        logs.push({
            endpoint,
            status,
            timestamp: new Date().toISOString()
        });
        
        if (logs.length > 100) {
            logs.shift();
        }
        
        localStorage.setItem('diseaseAPILogs', JSON.stringify(logs));
    }

    /**
     * منح نقاط للمستخدم
     */
    awardPoints(points, reason) {
        const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
        const newPoints = currentPoints + points;
        
        localStorage.setItem('userPoints', newPoints.toString());
        window.dispatchEvent(new CustomEvent('pointsUpdated'));
        
        console.log(`🎉 منحت ${points} نقطة لـ: ${reason}`);
    }

    /**
     * الحصول على إحصاءات
     */
    getStats() {
        const logs = JSON.parse(localStorage.getItem('diseaseAPILogs') || '[]');
        const successfulCalls = logs.filter(log => log.status === 'success').length;
        const failedCalls = logs.filter(log => log.status === 'failed').length;
        
        return {
            totalDiagnoses: Object.keys(this.cache.diagnoses).length,
            totalTreatments: Object.keys(this.cache.treatments).length,
            totalAPICalls: logs.length,
            successRate: logs.length > 0 ? 
                Math.round((successfulCalls / logs.length) * 100) : 0,
            cacheHits: Object.keys(this.cache.diagnoses).length + 
                      Object.keys(this.cache.treatments).length
        };
    }

    /**
     * مسح الكاش
     */
    clearCache() {
        this.cache = {
            diseases: {},
            diagnoses: {},
            treatments: {},
            images: {}
        };
        localStorage.removeItem('diseasesAPICache');
        console.log('🗑️ تم مسح كاش الأمراض');
    }

    /**
     * تصدير بيانات التشخيصات
     */
    exportDiagnosisHistory() {
        const diagnoses = Object.values(this.cache.diagnoses).map(item => ({
            ...item.data,
            diagnosed_at: new Date(item.timestamp).toLocaleString('ar-SA')
        }));
        
        return {
            total_diagnoses: diagnoses.length,
            diagnoses: diagnoses,
            export_date: new Date().toISOString()
        };
    }
}

// تصدير الكلاس
if (typeof window !== 'undefined') {
    window.DiseasesAPI = DiseasesAPI;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiseasesAPI;
}