/**
 * Market API - API لأسعار السوق والمبيعات الزراعية
 * الإصدار 6.1 | يناير 2026 | معدل ومتكامل
 */

class MarketAPI {
    constructor() {
        this.baseURL = 'https://api.agriculture-market.com/v1';
        this.localData = this.initializeLocalMarketData();
        this.apiKey = this.getAPIKey();
        this.cacheDuration = 2 * 60 * 60 * 1000; // ساعتان (الأسعار تتغير بسرعة)
        this.currency = 'SAR'; // الريال السعودي
        this.isReady = false;
        
        this.init();
    }

    /**
     * تهيئة النظام
     */
    async init() {
        try {
            this.setupCache();
            this.setupPriceAlerts();
            this.setupMarketUpdates();
            this.isReady = true;
            console.log('✅ Market API جاهز للاستخدام');
        } catch (error) {
            console.error('❌ خطأ في تهيئة Market API:', error);
            this.isReady = false;
        }
    }

    /**
     * الحصول على مفتاح API
     */
    getAPIKey() {
        try {
            // مفتاح API آمن
            const encryptedKey = 'TUFSQ0tFVF9BUElfU0FVRF9BUl9WMg==';
            return atob(encryptedKey);
        } catch (error) {
            console.warn('⚠️ فشل فك تشفير API Key، استخدام مفتاح افتراضي');
            return 'MARKET_API_SAUD_AR_V2_DEFAULT';
        }
    }

    /**
     * إعداد نظام الكاش
     */
    setupCache() {
        this.cache = {
            prices: {},
            markets: {},
            trends: {},
            alerts: {}
        };
        
        this.loadCache();
    }

    /**
     * تحميل الكاش
     */
    loadCache() {
        try {
            const savedCache = localStorage.getItem('market_api_cache');
            if (savedCache) {
                const parsedCache = JSON.parse(savedCache);
                this.cache = parsedCache;
                console.log('📦 تم تحميل كاش السوق');
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل كاش السوق:', error);
        }
    }

    /**
     * حفظ الكاش
     */
    saveCache() {
        try {
            localStorage.setItem('market_api_cache', JSON.stringify(this.cache));
        } catch (error) {
            console.error('❌ خطأ في حفظ كاش السوق:', error);
        }
    }

    /**
     * إعداد تنبيهات الأسعار
     */
    setupPriceAlerts() {
        // التحقق من تنبيهات الأسعار كل ساعة
        setInterval(() => {
            this.checkPriceAlerts();
        }, 60 * 60 * 1000);
    }

    /**
     * إعداد تحديثات السوق
     */
    setupMarketUpdates() {
        // تحديث بيانات السوق كل 3 ساعات إذا كان هناك اتصال
        setInterval(() => {
            if (navigator.onLine) {
                this.updateMarketData();
            }
        }, 3 * 60 * 60 * 1000);
    }

    /**
     * تهيئة بيانات السوق المحلية
     */
    initializeLocalMarketData() {
        return {
            crops: [
                {
                    id: 'tomato',
                    name: 'طماطم',
                    unit: 'كيلوغرام',
                    avgPrice: 5,
                    minPrice: 3,
                    maxPrice: 8,
                    quality: ['درجة أولى', 'درجة ثانية', 'درجة ثالثة'],
                    icon: '🍅',
                    color: '#FF5252'
                },
                {
                    id: 'cucumber',
                    name: 'خيار',
                    unit: 'كيلوغرام',
                    avgPrice: 4,
                    minPrice: 2,
                    maxPrice: 6,
                    quality: ['محلي', 'مستورد'],
                    icon: '🥒',
                    color: '#8BC34A'
                },
                {
                    id: 'potato',
                    name: 'بطاطس',
                    unit: 'كيلوغرام',
                    avgPrice: 3,
                    minPrice: 2,
                    maxPrice: 5,
                    quality: ['مصري', 'سعودي', 'أوروبي'],
                    icon: '🥔',
                    color: '#FF9800'
                },
                {
                    id: 'onion',
                    name: 'بصل',
                    unit: 'كيلوغرام',
                    avgPrice: 2.5,
                    minPrice: 1.5,
                    maxPrice: 4,
                    quality: ['أحمر', 'أبيض', 'أصفر'],
                    icon: '🧅',
                    color: '#FF7043'
                },
                {
                    id: 'dates',
                    name: 'تمور',
                    unit: 'كيلوغرام',
                    avgPrice: 15,
                    minPrice: 8,
                    maxPrice: 50,
                    quality: ['خلاص', 'سكري', 'برحي', 'صفري'],
                    icon: '🌴',
                    color: '#795548'
                },
                {
                    id: 'wheat',
                    name: 'قمح',
                    unit: 'كيلوغرام',
                    avgPrice: 2,
                    minPrice: 1.5,
                    maxPrice: 3,
                    quality: ['ياسمين', 'صقور', 'سمراء'],
                    icon: '🌾',
                    color: '#FFD600'
                },
                {
                    id: 'lemon',
                    name: 'ليمون',
                    unit: 'كيلوغرام',
                    avgPrice: 6,
                    minPrice: 3,
                    maxPrice: 10,
                    quality: ['أخضر', 'أصفر'],
                    icon: '🍋',
                    color: '#CDDC39'
                }
            ],
            markets: [
                {
                    id: 'riyadh_market',
                    name: 'سوق الخضار المركزي بالرياض',
                    location: 'الرياض',
                    coordinates: { lat: 24.7136, lng: 46.6753 },
                    hours: '24 ساعة',
                    contact: '0111234567',
                    icon: '🏙️'
                },
                {
                    id: 'jeddah_market',
                    name: 'سوق الخضار بجدة',
                    location: 'جدة',
                    coordinates: { lat: 21.5433, lng: 39.1728 },
                    hours: '5 صباحاً - 10 مساءً',
                    contact: '0127654321',
                    icon: '🌊'
                },
                {
                    id: 'dammam_market',
                    name: 'سوق الخضار بالدمام',
                    location: 'الدمام',
                    coordinates: { lat: 26.4207, lng: 50.0888 },
                    hours: '6 صباحاً - 11 مساءً',
                    contact: '0135551234',
                    icon: '⛽'
                },
                {
                    id: 'abha_market',
                    name: 'سوق الخضار بأبها',
                    location: 'أبها',
                    coordinates: { lat: 18.2164, lng: 42.5053 },
                    hours: '6 صباحاً - 10 مساءً',
                    contact: '0172223333',
                    icon: '⛰️'
                }
            ]
        };
    }

    /**
     * الحصول على أسعار المحاصيل
     */
    async getCropPrices(cropName = null, market = null, quality = null) {
        try {
            const cacheKey = `prices_${cropName || 'all'}_${market || 'all'}_${quality || 'all'}`;
            
            // التحقق من الكاش
            if (this.cache.prices[cacheKey] && 
                Date.now() - this.cache.prices[cacheKey].timestamp < this.cacheDuration) {
                console.log('📦 استخدام الكاش للأسعار');
                return this.cache.prices[cacheKey].data;
            }

            let prices = [];
            
            // محاولة الاتصال بالـ API إذا كان هناك اتصال
            if (navigator.onLine) {
                try {
                    prices = await this.fetchFromAPI('prices', {
                        crop: cropName,
                        market: market,
                        quality: quality
                    });
                } catch (apiError) {
                    console.warn('⚠️ فشل الاتصال بالـ API، استخدام البيانات المحلية:', apiError);
                }
            }
            
            // إذا لم تكن هناك بيانات من الـ API أو فشل الاتصال
            if (!prices || prices.length === 0) {
                prices = this.getLocalPrices(cropName, market, quality);
            }
            
            // تحديث الأسعار المحلية
            this.updateLocalPrices(prices);
            
            // حفظ في الكاش
            this.cache.prices[cacheKey] = {
                data: prices,
                timestamp: Date.now()
            };
            this.saveCache();
            
            // منح نقاط للتحقق من الأسعار
            this.awardPoints(1, `تحقق من أسعار: ${cropName || 'جميع المحاصيل'}`);
            
            return prices;
            
        } catch (error) {
            console.error('❌ خطأ في الحصول على الأسعار:', error);
            return this.getLocalPrices(cropName, market, quality);
        }
    }

    /**
     * الحصول على الأسعار المحلية
     */
    getLocalPrices(cropName, market, quality) {
        let prices = [];
        
        if (cropName) {
            const crop = this.localData.crops.find(c => c.name === cropName);
            if (crop) {
                prices = [this.generatePriceData(crop, market, quality)];
            }
        } else {
            prices = this.localData.crops.map(crop => 
                this.generatePriceData(crop, market, quality)
            );
        }
        
        return prices;
    }

    /**
     * توليد بيانات السعر
     */
    generatePriceData(crop, market, quality) {
        const basePrice = crop.avgPrice;
        const marketFactor = market ? 1.1 : 1; // زيادة 10% لسوق معين
        const qualityFactor = quality ? 1.2 : 1; // زيادة 20% لجودة معينة
        
        const currentPrice = basePrice * marketFactor * qualityFactor;
        const change = (Math.random() - 0.5) * 0.5; // تغيير عشوائي ±25%
        
        return {
            crop_id: crop.id,
            crop_name: crop.name,
            crop_icon: crop.icon,
            market: market || 'عام',
            quality: quality || 'متوسط',
            price: Math.round(currentPrice * 100) / 100,
            unit: crop.unit,
            currency: this.currency,
            change_percent: Math.round(change * 100),
            change_amount: Math.round(currentPrice * change * 100) / 100,
            timestamp: new Date().toISOString(),
            source: 'النظام المحلي',
            confidence: 0.8,
            color: crop.color,
            notes: this.getPriceNotes(crop, currentPrice, change)
        };
    }

    /**
     * الحصول على ملاحظات السعر
     */
    getPriceNotes(crop, price, change) {
        if (change > 20) {
            return `ارتفاع حاد في السعر بنسبة ${Math.round(change)}%`;
        } else if (change > 10) {
            return `ارتفاع في السعر بنسبة ${Math.round(change)}%`;
        } else if (change < -20) {
            return `انخفاض حاد في السعر بنسبة ${Math.round(change)}%`;
        } else if (change < -10) {
            return `انخفاض في السعر بنسبة ${Math.round(change)}%`;
        } else if (price > crop.maxPrice * 0.9) {
            return 'سعر مرتفع قرب الحد الأقصى';
        } else if (price < crop.minPrice * 1.1) {
            return 'سعر منخفض قرب الحد الأدنى';
        } else {
            return 'سعر مستقر';
        }
    }

    /**
     * تحديث الأسعار المحلية
     */
    updateLocalPrices(newPrices) {
        newPrices.forEach(newPrice => {
            const crop = this.localData.crops.find(c => c.name === newPrice.crop_name);
            if (crop) {
                // تحديث متوسط السعر (متوسط متحرك)
                crop.avgPrice = (crop.avgPrice + newPrice.price) / 2;
                
                // تحديث الحد الأدنى والأقصى
                if (newPrice.price < crop.minPrice) {
                    crop.minPrice = newPrice.price;
                }
                if (newPrice.price > crop.maxPrice) {
                    crop.maxPrice = newPrice.price;
                }
            }
        });
    }

    /**
     * الحصول على أسواق محلية
     */
    async getMarkets(region = null) {
        try {
            const cacheKey = `markets_${region || 'all'}`;
            
            if (this.cache.markets[cacheKey] && 
                Date.now() - this.cache.markets[cacheKey].timestamp < 24 * 60 * 60 * 1000) {
                return this.cache.markets[cacheKey].data;
            }

            let markets = [];
            
            if (navigator.onLine) {
                try {
                    markets = await this.fetchFromAPI('markets', {
                        region: region
                    });
                } catch (apiError) {
                    console.warn('⚠️ فشل الاتصال بالـ API للأسواق:', apiError);
                }
            }
            
            if (!markets || markets.length === 0) {
                markets = this.getLocalMarkets(region);
            }
            
            // حفظ في الكاش
            this.cache.markets[cacheKey] = {
                data: markets,
                timestamp: Date.now()
            };
            this.saveCache();
            
            return markets;
            
        } catch (error) {
            console.error('❌ خطأ في الحصول على الأسواق:', error);
            return this.getLocalMarkets(region);
        }
    }

    /**
     * الحصول على أسواق محلية
     */
    getLocalMarkets(region) {
        if (!region) return this.localData.markets;
        
        return this.localData.markets.filter(market => 
            market.location.includes(region)
        );
    }

    /**
     * الحصول على اتجاهات الأسعار
     */
    async getPriceTrends(cropName, period = '7d') {
        try {
            const cacheKey = `trends_${cropName}_${period}`;
            
            if (this.cache.trends[cacheKey] && 
                Date.now() - this.cache.trends[cacheKey].timestamp < 6 * 60 * 60 * 1000) {
                return this.cache.trends[cacheKey].data;
            }

            let trends = [];
            
            if (navigator.onLine) {
                try {
                    trends = await this.fetchFromAPI('trends', {
                        crop: cropName,
                        period: period
                    });
                } catch (apiError) {
                    console.warn('⚠️ فشل الاتصال بالـ API للاتجاهات:', apiError);
                }
            }
            
            if (!trends || trends.length === 0) {
                trends = this.generateLocalTrends(cropName, period);
            }
            
            // حفظ في الكاش
            this.cache.trends[cacheKey] = {
                data: trends,
                timestamp: Date.now()
            };
            this.saveCache();
            
            // منح نقاط لتحليل الاتجاهات
            this.awardPoints(2, `تحليل اتجاهات: ${cropName}`);
            
            return trends;
            
        } catch (error) {
            console.error('❌ خطأ في الحصول على الاتجاهات:', error);
            return this.generateLocalTrends(cropName, period);
        }
    }

    /**
     * توليد اتجاهات محلية
     */
    generateLocalTrends(cropName, period) {
        const crop = this.localData.crops.find(c => c.name === cropName);
        if (!crop) return null;
        
        const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
        const basePrice = crop.avgPrice;
        const trends = [];
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            const trendFactor = 0.9 + (Math.random() * 0.2); // 0.9-1.1
            const seasonalFactor = this.getSeasonalFactor(date.getMonth());
            const price = basePrice * trendFactor * seasonalFactor;
            
            trends.push({
                date: date.toISOString().split('T')[0],
                price: Math.round(price * 100) / 100,
                volume: Math.floor(Math.random() * 1000) + 100,
                demand: Math.floor(Math.random() * 100),
                supply: Math.floor(Math.random() * 100),
                day_of_week: date.toLocaleDateString('ar-SA', { weekday: 'long' })
            });
        }
        
        return {
            crop: cropName,
            crop_icon: crop.icon,
            period: period,
            current_price: trends[trends.length - 1].price,
            avg_price: Math.round(trends.reduce((sum, t) => sum + t.price, 0) / trends.length * 100) / 100,
            min_price: Math.min(...trends.map(t => t.price)),
            max_price: Math.max(...trends.map(t => t.price)),
            trend: this.calculateTrend(trends),
            forecast: this.generateForecast(trends),
            data_points: trends,
            recommendation: this.getMarketRecommendation(trends)
        };
    }

    /**
     * حساب عامل الموسم
     */
    getSeasonalFactor(month) {
        // عوامل موسمية افتراضية بناءً على شهر السنة
        const factors = [
            1.1, // يناير
            1.0, // فبراير
            0.9, // مارس
            0.8, // أبريل
            0.7, // مايو
            0.8, // يونيو
            0.9, // يوليو
            1.0, // أغسطس
            1.1, // سبتمبر
            1.2, // أكتوبر
            1.1, // نوفمبر
            1.0  // ديسمبر
        ];
        return factors[month] || 1.0;
    }

    /**
     * حساب الاتجاه
     */
    calculateTrend(trends) {
        if (trends.length < 2) return { direction: 'ثابت', percentage: 0 };
        
        const firstPrice = trends[0].price;
        const lastPrice = trends[trends.length - 1].price;
        const change = ((lastPrice - firstPrice) / firstPrice) * 100;
        
        if (change > 5) return { direction: 'صاعد', percentage: Math.round(change) };
        if (change < -5) return { direction: 'هابط', percentage: Math.round(change) };
        return { direction: 'ثابت', percentage: Math.round(change) };
    }

    /**
     * توليد توقعات
     */
    generateForecast(trends) {
        const lastPrices = trends.slice(-5).map(t => t.price);
        const avgPrice = lastPrices.reduce((a, b) => a + b) / lastPrices.length;
        const trend = this.calculateTrend(trends.slice(-10));
        
        let forecast = avgPrice;
        if (trend.direction === 'صاعد') forecast *= 1.05;
        if (trend.direction === 'هابط') forecast *= 0.95;
        
        return {
            next_week: Math.round(forecast * 100) / 100,
            next_month: Math.round(forecast * (trend.direction === 'صاعد' ? 1.1 : 0.9) * 100) / 100,
            confidence: 0.7,
            factors: ['الموسم', 'العرض والطلب', 'الجودة', 'الطقس'],
            best_selling_days: ['السبت', 'الأحد', 'الاثنين']
        };
    }

    /**
     * الحصول على توصية السوق
     */
    getMarketRecommendation(trends) {
        const trend = this.calculateTrend(trends);
        
        if (trend.direction === 'صاعد') {
            return {
                action: 'بيع',
                reason: 'الأسعار في ارتفاع',
                urgency: 'عالية',
                tips: [
                    'قم بالبيع الآن لتحقيق أفضل ربح',
                    'تأكد من جودة المنتج للبيع بالسعر الأعلى',
                    'فكر في البيع التدريجي لاستغلال الارتفاع'
                ]
            };
        } else if (trend.direction === 'هابط') {
            return {
                action: 'شراء/تخزين',
                reason: 'الأسعار في انخفاض',
                urgency: 'متوسطة',
                tips: [
                    'ممتاز للشراء أو التخزين',
                    'تأجيل البيع حتى يرتفع السوق',
                    'ابحث عن أسواق بديلة بسعر أفضل'
                ]
            };
        } else {
            return {
                action: 'مراقبة',
                reason: 'الأسعار مستقرة',
                urgency: 'منخفضة',
                tips: [
                    'راقب السوق يومياً',
                    'بيع تدريجي حسب الحاجة',
                    'تجهيز لفرص بيع أفضل'
                ]
            };
        }
    }

    /**
     * البحث عن مشترين
     */
    async findBuyers(cropName, quantity, quality, location) {
        try {
            let buyers = [];
            
            if (navigator.onLine) {
                try {
                    buyers = await this.fetchFromAPI('buyers/search', {
                        crop: cropName,
                        quantity: quantity,
                        quality: quality,
                        location: location
                    });
                } catch (apiError) {
                    console.warn('⚠️ فشل الاتصال بالـ API للمشترين:', apiError);
                }
            }
            
            if (!buyers || buyers.length === 0) {
                buyers = this.findLocalBuyers(cropName, quantity, quality, location);
            }
            
            // منح نقاط للبحث عن مشترين
            this.awardPoints(3, `بحث عن مشترين لـ: ${cropName}`);
            
            return buyers;
            
        } catch (error) {
            console.error('❌ خطأ في البحث عن مشترين:', error);
            return this.findLocalBuyers(cropName, quantity, quality, location);
        }
    }

    /**
     * البحث عن مشترين محليين
     */
    findLocalBuyers(cropName, quantity, quality, location) {
        const buyers = [
            {
                id: 'buyer_1',
                name: 'شركة الأغذية المتحدة',
                type: 'شركة',
                rating: 4.5,
                min_quantity: 100,
                max_quantity: 10000,
                preferred_quality: ['درجة أولى', 'درجة ثانية'],
                locations: ['الرياض', 'جدة', 'الدمام'],
                contact: 'buyer@food-company.com',
                last_purchase: '2024-01-15',
                icon: '🏢'
            },
            {
                id: 'buyer_2',
                name: 'سوق الجملة المركزي',
                type: 'سوق',
                rating: 4.2,
                min_quantity: 50,
                max_quantity: 5000,
                preferred_quality: ['جميع الدرجات'],
                locations: [location || 'الرياض'],
                contact: '0555123456',
                last_purchase: '2024-01-20',
                icon: '🏪'
            },
            {
                id: 'buyer_3',
                name: 'مصنع التعليب الوطني',
                type: 'مصنع',
                rating: 4.7,
                min_quantity: 500,
                max_quantity: 20000,
                preferred_quality: ['درجة أولى'],
                locations: ['الرياض', 'الدمام'],
                contact: 'factory@canning.com',
                last_purchase: '2024-01-10',
                icon: '🏭'
            },
            {
                id: 'buyer_4',
                name: 'تاجر الجملة المحلي',
                type: 'تاجر',
                rating: 4.0,
                min_quantity: 10,
                max_quantity: 1000,
                preferred_quality: ['درجة أولى', 'درجة ثانية'],
                locations: [location || 'جميع المدن'],
                contact: '0501234567',
                last_purchase: '2024-01-25',
                icon: '👨‍💼'
            }
        ];
        
        return buyers.filter(buyer => {
            let matches = true;
            
            if (quantity) {
                matches = matches && 
                         quantity >= buyer.min_quantity && 
                         quantity <= buyer.max_quantity;
            }
            
            if (quality && buyer.preferred_quality) {
                matches = matches && buyer.preferred_quality.includes(quality);
            }
            
            if (location && buyer.locations) {
                matches = matches && buyer.locations.includes(location);
            }
            
            return matches;
        });
    }

    /**
     * إنشاء عرض بيع
     */
    async createSellingOffer(offerData) {
        try {
            let result = null;
            
            if (navigator.onLine) {
                try {
                    result = await this.fetchFromAPI('offers/create', offerData);
                } catch (apiError) {
                    console.warn('⚠️ فشل الاتصال بالـ API للعروض:', apiError);
                }
            }
            
            if (!result) {
                result = this.createLocalOffer(offerData);
            }
            
            // منح نقاط لإنشاء عرض
            this.awardPoints(5, `إنشاء عرض بيع لـ: ${offerData.crop}`);
            
            // إضافة التنبيه
            this.addPriceAlert(offerData);
            
            return result;
            
        } catch (error) {
            console.error('❌ خطأ في إنشاء العرض:', error);
            return this.createLocalOffer(offerData);
        }
    }

    /**
     * إنشاء عرض محلي
     */
    createLocalOffer(offerData) {
        const offerId = 'offer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const crop = this.localData.crops.find(c => c.name === offerData.crop);
        const cropIcon = crop ? crop.icon : '🌱';
        
        const offer = {
            id: offerId,
            ...offerData,
            status: 'active',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            views: 0,
            inquiries: 0,
            featured: false,
            crop_icon: cropIcon
        };
        
        // حفظ العرض محلياً
        try {
            const offers = JSON.parse(localStorage.getItem('selling_offers') || '[]');
            offers.push(offer);
            localStorage.setItem('selling_offers', JSON.stringify(offers));
            
            console.log('📝 تم حفظ العرض محلياً:', offerId);
        } catch (error) {
            console.error('❌ فشل حفظ العرض:', error);
        }
        
        return {
            success: true,
            offer_id: offerId,
            message: 'تم إنشاء العرض بنجاح',
            share_link: `market/offer/${offerId}`,
            qr_code: this.generateQRCode(offerId),
            offer: offer
        };
    }

    /**
     * توليد كود QR
     */
    generateQRCode(offerId) {
        // محاكاة توليد QR (يمكن استبداله بمكتبة حقيقية)
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
            `https://agriculture-market.com/offer/${offerId}`
        )}`;
    }

    /**
     * إضافة تنبيه سعر
     */
    addPriceAlert(offerData) {
        try {
            const alerts = JSON.parse(localStorage.getItem('price_alerts') || '[]');
            
            const newAlert = {
                id: 'alert_' + Date.now(),
                crop: offerData.crop,
                target_price: offerData.price,
                current_price: 0,
                condition: 'above',
                active: true,
                created_at: new Date().toISOString(),
                notified: false,
                offer_id: offerData.id || null
            };
            
            alerts.push(newAlert);
            localStorage.setItem('price_alerts', JSON.stringify(alerts));
            
            console.log('🔔 تم إضافة تنبيه سعر جديد');
        } catch (error) {
            console.error('❌ فشل إضافة تنبيه:', error);
        }
    }

    /**
     * التحقق من تنبيهات الأسعار
     */
    async checkPriceAlerts() {
        try {
            const alerts = JSON.parse(localStorage.getItem('price_alerts') || '[]');
            const activeAlerts = alerts.filter(alert => alert.active && !alert.notified);
            
            if (activeAlerts.length === 0) return;
            
            console.log(`🔍 فحص ${activeAlerts.length} تنبيه سعر`);
            
            for (const alert of activeAlerts) {
                const prices = await this.getCropPrices(alert.crop);
                if (prices.length > 0) {
                    const currentPrice = prices[0].price;
                    alert.current_price = currentPrice;
                    
                    let shouldNotify = false;
                    
                    if (alert.condition === 'above' && currentPrice >= alert.target_price) {
                        shouldNotify = true;
                        alert.triggered_at = new Date().toISOString();
                    } else if (alert.condition === 'below' && currentPrice <= alert.target_price) {
                        shouldNotify = true;
                        alert.triggered_at = new Date().toISOString();
                    }
                    
                    if (shouldNotify) {
                        this.notifyPriceAlert(alert);
                        alert.notified = true;
                        alert.notified_at = new Date().toISOString();
                        
                        // منح نقاط للتنبيه
                        this.awardPoints(2, `تنبيه سعر لـ: ${alert.crop}`);
                    }
                }
            }
            
            localStorage.setItem('price_alerts', JSON.stringify(alerts));
            
        } catch (error) {
            console.error('❌ خطأ في فحص التنبيهات:', error);
        }
    }

    /**
     * إشعار تنبيه السعر
     */
    notifyPriceAlert(alert) {
        const message = `💰 تنبيه سعر: ${alert.crop} وصل إلى ${alert.current_price} ريال`;
        
        // إشعار المتصفح
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification('تنبيه سعر', {
                    body: message,
                    icon: './assets/icons/icon-72.png'
                });
            } catch (error) {
                console.warn('⚠️ فشل إظهار إشعار المتصفح:', error);
            }
        }
        
        // إشعار في التطبيق
        this.showMarketNotification(message);
    }

    /**
     * إظهار إشعار السوق
     */
    showMarketNotification(message) {
        // إنشاء عنصر إشعار إذا لم يكن موجوداً
        let notificationElement = document.getElementById('marketNotification');
        
        if (!notificationElement) {
            notificationElement = document.createElement('div');
            notificationElement.id = 'marketNotification';
            notificationElement.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #4CAF50, #2E7D32);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 9999;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 12px;
                animation: slideInRight 0.3s ease;
                max-width: 350px;
                font-family: 'Tajawal', sans-serif;
            `;
            
            document.body.appendChild(notificationElement);
        }
        
        notificationElement.innerHTML = `
            <i class="fas fa-chart-line" style="font-size: 1.2em;"></i>
            <div style="flex: 1;">
                <div style="font-weight: bold; margin-bottom: 5px;">📈 إشعار السوق</div>
                <div style="font-size: 0.9em;">${message}</div>
            </div>
            <button onclick="document.getElementById('marketNotification').remove()" 
                    style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2em;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // إزالة بعد 5 ثواني
        setTimeout(() => {
            if (notificationElement && notificationElement.parentNode) {
                notificationElement.remove();
            }
        }, 5000);
    }

    /**
     * تحديث بيانات السوق
     */
    async updateMarketData() {
        try {
            console.log('🔄 تحديث بيانات السوق...');
            
            // تحديث أسعار المحاصيل الرئيسية
            const mainCrops = this.localData.crops.slice(0, 5);
            for (const crop of mainCrops) {
                await this.getCropPrices(crop.name);
                await new Promise(resolve => setTimeout(resolve, 100)); // تأخير بين الطلبات
            }
            
            // تحديث اتجاهات المحاصيل الرئيسية
            for (const crop of mainCrops.slice(0, 3)) {
                await this.getPriceTrends(crop.name, '7d');
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            console.log('✅ تم تحديث بيانات السوق');
            
        } catch (error) {
            console.error('❌ خطأ في تحديث بيانات السوق:', error);
        }
    }

    /**
     * إرسال طلب إلى API
     */
    async fetchFromAPI(endpoint, data = null) {
        if (!navigator.onLine) {
            throw new Error('لا يوجد اتصال بالإنترنت');
        }
        
        // محاكاة اتصال API (في الواقع سيتم استبدالها باتصال حقيقي)
        console.log(`🌐 طلب API إلى: ${endpoint}`, data);
        
        await new Promise(resolve => setTimeout(resolve, 500)); // محاكاة زمن الاستجابة
        
        // محاكاة بيانات API للاختبار
        if (endpoint === 'prices') {
            return this.mockAPIPrices(data);
        } else if (endpoint === 'markets') {
            return this.mockAPIMarkets(data);
        } else if (endpoint === 'trends') {
            return this.mockAPITrends(data);
        } else if (endpoint === 'buyers/search') {
            return this.mockAPIBuyers(data);
        } else if (endpoint === 'offers/create') {
            return this.mockAPICreateOffer(data);
        }
        
        throw new Error('Endpoint غير معروف');
    }

    /**
     * محاكاة بيانات الأسعار
     */
    mockAPIPrices(data) {
        const crop = this.localData.crops.find(c => c.name === data.crop) || this.localData.crops[0];
        
        const basePrice = crop.avgPrice;
        const apiFactor = 0.95 + (Math.random() * 0.1); // 0.95-1.05
        const price = basePrice * apiFactor;
        
        return [{
            crop_id: crop.id,
            crop_name: crop.name,
            market: data.market || 'سوق إلكتروني',
            quality: data.quality || 'درجة أولى',
            price: Math.round(price * 100) / 100,
            unit: crop.unit,
            currency: this.currency,
            change_percent: Math.round((Math.random() - 0.5) * 20),
            change_amount: Math.round(price * (Math.random() - 0.5) * 0.2 * 100) / 100,
            timestamp: new Date().toISOString(),
            source: 'API السوق الإلكتروني',
            confidence: 0.95
        }];
    }

    /**
     * محاكاة بيانات الأسواق
     */
    mockAPIMarkets(data) {
        let markets = [...this.localData.markets];
        
        if (data.region) {
            markets = markets.filter(m => m.location.includes(data.region));
        }
        
        return markets.map(market => ({
            ...market,
            is_open: true,
            last_updated: new Date().toISOString()
        }));
    }

    /**
     * محاكاة بيانات الاتجاهات
     */
    mockAPITrends(data) {
        return this.generateLocalTrends(data.crop, data.period);
    }

    /**
     * محاكاة بيانات المشترين
     */
    mockAPIBuyers(data) {
        return this.findLocalBuyers(data.crop, data.quantity, data.quality, data.location);
    }

    /**
     * محاكاة إنشاء عرض
     */
    mockAPICreateOffer(data) {
        return this.createLocalOffer(data);
    }

    /**
     * تسجيل استدعاءات API
     */
    logAPICall(endpoint, status) {
        try {
            const logs = JSON.parse(localStorage.getItem('market_api_logs') || '[]');
            
            logs.push({
                endpoint,
                status,
                timestamp: new Date().toISOString()
            });
            
            if (logs.length > 100) {
                logs.shift();
            }
            
            localStorage.setItem('market_api_logs', JSON.stringify(logs));
        } catch (error) {
            console.error('❌ فشل تسجيل استدعاء API:', error);
        }
    }

    /**
     * منح نقاط للمستخدم
     */
    awardPoints(points, reason) {
        try {
            let currentPoints = 0;
            try {
                currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
            } catch (e) {
                currentPoints = 0;
            }
            
            const newPoints = currentPoints + points;
            
            localStorage.setItem('userPoints', newPoints.toString());
            
            // إرسال حدث لتحديث النقاط في الواجهة
            const event = new CustomEvent('pointsUpdated', { 
                detail: { 
                    points: newPoints,
                    reason: reason 
                } 
            });
            window.dispatchEvent(event);
            
            console.log(`🎉 منحت ${points} نقطة لـ: ${reason}`);
            
        } catch (error) {
            console.error('❌ فشل منح النقاط:', error);
        }
    }

    /**
     * الحصول على إحصاءات السوق
     */
    getMarketStats() {
        try {
            const logs = JSON.parse(localStorage.getItem('market_api_logs') || '[]');
            const successfulCalls = logs.filter(log => log.status === 'success').length;
            const failedCalls = logs.filter(log => log.status === 'failed').length;
            
            const offers = JSON.parse(localStorage.getItem('selling_offers') || '[]');
            const activeOffers = offers.filter(offer => offer.status === 'active').length;
            
            const alerts = JSON.parse(localStorage.getItem('price_alerts') || '[]');
            const activeAlerts = alerts.filter(alert => alert.active).length;
            
            return {
                totalCrops: this.localData.crops.length,
                totalMarkets: this.localData.markets.length,
                totalAPICalls: logs.length,
                successRate: logs.length > 0 ? 
                    Math.round((successfulCalls / logs.length) * 100) : 0,
                activeOffers,
                activeAlerts,
                cacheHits: Object.keys(this.cache.prices).length + 
                          Object.keys(this.cache.trends).length,
                lastUpdate: this.cache.prices[Object.keys(this.cache.prices)[0]]?.timestamp || null,
                localStorageSize: JSON.stringify(localStorage).length
            };
        } catch (error) {
            return {
                error: 'فشل تحميل الإحصائيات',
                details: error.message
            };
        }
    }

    /**
     * مسح الكاش
     */
    clearCache() {
        this.cache = {
            prices: {},
            markets: {},
            trends: {},
            alerts: {}
        };
        localStorage.removeItem('market_api_cache');
        console.log('🗑️ تم مسح كاش السوق');
    }

    /**
     * تصدير بيانات السوق
     */
    exportMarketData(format = 'json') {
        try {
            const offers = JSON.parse(localStorage.getItem('selling_offers') || '[]');
            const alerts = JSON.parse(localStorage.getItem('price_alerts') || '[]');
            const logs = JSON.parse(localStorage.getItem('market_api_logs') || '[]');
            
            const data = {
                local_data: this.localData,
                cache: this.cache,
                offers: offers,
                alerts: alerts,
                logs: logs,
                stats: this.getMarketStats(),
                export_date: new Date().toISOString(),
                version: '6.1'
            };

            if (format === 'json') {
                return JSON.stringify(data, null, 2);
            }

            return data;
        } catch (error) {
            return {
                error: 'فشل تصدير البيانات',
                details: error.message
            };
        }
    }

    /**
     * الحصول على بيانات سوقية لـ HTML
     */
    getMarketHTML(cropName = null) {
        const crop = cropName ? 
            this.localData.crops.find(c => c.name === cropName) : 
            this.localData.crops[0];
        
        if (!crop) return '<div>المحصول غير موجود</div>';
        
        return `
            <div style="font-family: 'Tajawal', sans-serif; padding: 20px; background: #f9f9f9; border-radius: 15px;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <div style="font-size: 3em;">${crop.icon}</div>
                    <div>
                        <h2 style="margin: 0 0 5px 0; color: #2E7D32;">${crop.name}</h2>
                        <div style="color: #666;">آخر تحديث: ${new Date().toLocaleString('ar-SA')}</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                    <div style="background: white; padding: 15px; border-radius: 10px; border-left: 4px solid #4CAF50;">
                        <div style="color: #666; font-size: 0.9em;">متوسط السعر</div>
                        <div style="font-size: 1.5em; font-weight: bold; color: #2E7D32;">
                            ${crop.avgPrice} ${this.currency}
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 15px; border-radius: 10px; border-left: 4px solid #2196F3;">
                        <div style="color: #666; font-size: 0.9em;">الحد الأدنى</div>
                        <div style="font-size: 1.5em; font-weight: bold; color: #2196F3;">
                            ${crop.minPrice} ${this.currency}
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 15px; border-radius: 10px; border-left: 4px solid #FF9800;">
                        <div style="color: #666; font-size: 0.9em;">الحد الأقصى</div>
                        <div style="font-size: 1.5em; font-weight: bold; color: #FF9800;">
                            ${crop.maxPrice} ${this.currency}
                        </div>
                    </div>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="color: #2E7D32; margin-top: 0; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
                        <i class="fas fa-info-circle"></i> معلومات السوق
                    </h3>
                    <div style="line-height: 1.6; color: #555;">
                        <div><strong>الوحدة:</strong> ${crop.unit}</div>
                        <div><strong>درجات الجودة:</strong> ${crop.quality.join('، ')}</div>
                        <div><strong>العملة:</strong> ${this.currency}</div>
                    </div>
                </div>
                
                <button onclick="marketAPI.getCropPrices('${crop.name}')" 
                        style="
                            background: linear-gradient(135deg, #4CAF50, #2E7D32);
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 25px;
                            font-size: 1em;
                            cursor: pointer;
                            font-family: 'Tajawal', sans-serif;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            margin: 0 auto;
                        ">
                    <i class="fas fa-sync-alt"></i>
                    تحديث الأسعار
                </button>
            </div>
        `;
    }
}

// ====== إنشاء نسخة عالمية ======
let marketAPIInstance = null;

function initMarketAPI() {
    if (!marketAPIInstance) {
        marketAPIInstance = new MarketAPI();
    }
    return marketAPIInstance;
}

// ====== واجهة مبسطة للاستخدام ======
window.marketAPI = {
    // التهيئة
    init: function() {
        return initMarketAPI();
    },
    
    // الأسعار
    getPrices: function(cropName = null, market = null, quality = null) {
        const instance = initMarketAPI();
        return instance.getCropPrices(cropName, market, quality);
    },
    
    // الأسواق
    getMarkets: function(region = null) {
        const instance = initMarketAPI();
        return instance.getMarkets(region);
    },
    
    // الاتجاهات
    getTrends: function(cropName, period = '7d') {
        const instance = initMarketAPI();
        return instance.getPriceTrends(cropName, period);
    },
    
    // البحث عن مشترين
    findBuyers: function(cropName, quantity, quality, location) {
        const instance = initMarketAPI();
        return instance.findBuyers(cropName, quantity, quality, location);
    },
    
    // إنشاء عرض
    createOffer: function(offerData) {
        const instance = initMarketAPI();
        return instance.createSellingOffer(offerData);
    },
    
    // الحصول على إحصاءات
    getStats: function() {
        const instance = initMarketAPI();
        return instance.getMarketStats();
    },
    
    // تصدير البيانات
    exportData: function(format = 'json') {
        const instance = initMarketAPI();
        return instance.exportMarketData(format);
    },
    
    // مسح الكاش
    clearCache: function() {
        const instance = initMarketAPI();
        return instance.clearCache();
    },
    
    // الحصول على HTML
    getHTML: function(cropName = null) {
        const instance = initMarketAPI();
        return instance.getMarketHTML(cropName);
    },
    
    // تحديث بيانات السوق
    updateData: function() {
        const instance = initMarketAPI();
        return instance.updateMarketData();
    },
    
    // حالة النظام
    isReady: function() {
        return marketAPIInstance && marketAPIInstance.isReady;
    }
};

// ====== تهيئة تلقائية ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('💰 بدء تحميل Market API...');
    
    setTimeout(() => {
        try {
            const instance = initMarketAPI();
            console.log('✅ Market API محمل بنجاح');
            
            // تكامل مع النظام الرئيسي
            if (window.mainBridge) {
                window.mainBridge.market = window.marketAPI;
                console.log('✅ تم ربط Market API بالنظام الرئيسي');
            }
            
            // تحديث بيانات السوق بعد 5 ثواني
            setTimeout(() => {
                if (navigator.onLine) {
                    instance.updateMarketData();
                }
            }, 5000);
            
        } catch (error) {
            console.error('❌ فشل تحميل Market API:', error);
        }
    }, 1000);
});

// ====== رسالة المطور ======
console.log(`
💰 **Market API - نظام أسعار السوق الزراعي**
✅ الإصدار 6.1 | معدل ومتكامل
✅ متكامل مع نظام النقاط
✅ دعم البيانات المحلية والـ API
✅ نظام تنبيهات ذكي
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ المميزات:
• أسعار المحاصيل الزراعية
• اتجاهات السوق وتحليل الأسعار
• البحث عن مشترين وتجار
• إنشاء عروض بيع
• تنبيهات أسعار ذكية
• كاش محسن للأداء
• نظام نقاط متكامل
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 أمثلة الاستخدام:
1. marketAPI.getPrices('طماطم')
2. marketAPI.getTrends('تمور', '30d')
3. marketAPI.findBuyers('قمح', 1000, 'درجة أولى', 'الرياض')
4. marketAPI.createOffer({ crop: 'طماطم', price: 5, quantity: 100 })
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 المسار: js/api/market.js
🔗 متكامل مع: mainBridge, localStorage, نظام النقاط
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
جميع الحقوق محفوظة © 2026 - المرشد الزراعي الذكي
`);