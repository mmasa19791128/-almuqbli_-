// ====== نظام التنسيق والتنسيقات ======
// 🎨 الإصدار 4.0 | يناير 2026
// 🌱 متكامل مع المشروع الزراعي الذكي

class Formatters {
    constructor() {
        this.locale = 'ar-SA';
        this.currency = 'SAR';
        this.agricultureUnits = this.loadAgricultureUnits();
        this.cache = new Map();
        this.init();
    }
    
    async init() {
        console.log('🎨 نظام التنسيق الزراعي جاهز - الإصدار 4.0');
        
        // ⭐ ربط مع أنظمة المشروع
        this.setupProjectIntegration();
        
        // تحميل الإعدادات
        await this.loadSettings();
        
        // تسجيل في نظام الإحصائيات
        this.logEvent('system_initialized');
    }
    
    // ⭐ ربط مع أنظمة المشروع
    setupProjectIntegration() {
        // ربط مع نظام النقاط
        if (window.pointsSystem) {
            this.pointsSystem = window.pointsSystem;
            console.log('✅ تم ربط نظام التنسيق مع نظام النقاط');
        }
        
        // ربط مع نظام المساعدات
        if (window.helpers) {
            this.helpers = window.helpers;
            console.log('✅ تم ربط نظام التنسيق مع نظام المساعدات');
        }
        
        // ربط مع الجسر الرئيسي
        if (window.mainBridge) {
            this.mainBridge = window.mainBridge;
            window.mainBridge.formatters = this;
            console.log('✅ تم ربط نظام التنسيق مع الجسر الرئيسي');
        }
        
        // إعداد الترجمة
        this.setupTranslation();
        
        // حقن أنماط CSS
        this.injectFormatterStyles();
    }
    
    // ⭐ تحميل وحدات الزراعة
    loadAgricultureUnits() {
        return {
            // المساحة
            area: {
                'hectare': { name: 'هكتار', symbol: 'هكتار', conversion: 1 },
                'acre': { name: 'فدان', symbol: 'فدان', conversion: 2.471 },
                'm2': { name: 'متر مربع', symbol: 'م²', conversion: 10000 },
                'dunam': { name: 'دونم', symbol: 'دونم', conversion: 10 }
            },
            
            // الوزن
            weight: {
                'kg': { name: 'كيلوجرام', symbol: 'كجم', conversion: 1 },
                'ton': { name: 'طن', symbol: 'طن', conversion: 0.001 },
                'quintal': { name: 'قنطار', symbol: 'قنطار', conversion: 0.01 },
                'gram': { name: 'جرام', symbol: 'جم', conversion: 1000 }
            },
            
            // الحجم
            volume: {
                'liter': { name: 'لتر', symbol: 'لتر', conversion: 1 },
                'm3': { name: 'متر مكعب', symbol: 'م³', conversion: 0.001 },
                'gallon': { name: 'جالون', symbol: 'جالون', conversion: 0.264 }
            },
            
            // الطول
            length: {
                'meter': { name: 'متر', symbol: 'م', conversion: 1 },
                'cm': { name: 'سنتيمتر', symbol: 'سم', conversion: 100 },
                'km': { name: 'كيلومتر', symbol: 'كم', conversion: 0.001 }
            },
            
            // الوقت الزراعي
            time: {
                'day': { name: 'يوم', symbol: 'يوم', conversion: 1 },
                'week': { name: 'أسبوع', symbol: 'أسبوع', conversion: 1/7 },
                'month': { name: 'شهر', symbol: 'شهر', conversion: 1/30 },
                'season': { name: 'موسم', symbol: 'موسم', conversion: 1/120 }
            }
        };
    }
    
    // ⭐ إعداد الترجمة
    setupTranslation() {
        this.translations = {
            date: {
                today: 'اليوم',
                yesterday: 'الأمس',
                tomorrow: 'غداً',
                justNow: 'الآن',
                minutesAgo: 'دقائق مضت',
                hoursAgo: 'ساعات مضت',
                daysAgo: 'أيام مضت',
                weeksAgo: 'أسابيع مضت',
                monthsAgo: 'أشهر مضت',
                yearsAgo: 'سنوات مضت'
            },
            units: {
                perHectare: 'لكل هكتار',
                perAcre: 'لكل فدان',
                perMonth: 'شهرياً',
                perSeason: 'موسمياً',
                perYear: 'سنوياً'
            },
            agriculture: {
                planting: 'زراعة',
                harvesting: 'حصاد',
                irrigation: 'ري',
                fertilization: 'تسميد',
                growth: 'نمو',
                maturity: 'نضج'
            }
        };
        
        // تحميل الترجمات المخصصة
        this.loadCustomTranslations();
    }
    
    // ⭐ تحميل الترجمات المخصصة
    loadCustomTranslations() {
        try {
            const customTranslations = JSON.parse(localStorage.getItem('formatter_translations') || '{}');
            if (Object.keys(customTranslations).length > 0) {
                this.translations = { ...this.translations, ...customTranslations };
            }
        } catch (error) {
            console.warn('⚠️ فشل تحميل الترجمات المخصصة:', error);
        }
    }
    
    // ⭐ تحميل الإعدادات
    async loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('formatter_settings') || '{}');
            
            this.locale = settings.locale || 'ar-SA';
            this.currency = settings.currency || 'SAR';
            this.decimalPlaces = settings.decimalPlaces || 2;
            this.dateFormat = settings.dateFormat || 'short';
            this.numberFormat = settings.numberFormat || 'standard';
            this.unitSystem = settings.unitSystem || 'metric';
            
            console.log('✅ تم تحميل إعدادات التنسيق');
            
        } catch (error) {
            console.warn('⚠️ فشل تحميل الإعدادات:', error);
            this.setDefaultSettings();
        }
    }
    
    // ⭐ الإعدادات الافتراضية
    setDefaultSettings() {
        this.locale = 'ar-SA';
        this.currency = 'SAR';
        this.decimalPlaces = 2;
        this.dateFormat = 'short';
        this.numberFormat = 'standard';
        this.unitSystem = 'metric';
    }
    
    // ⭐ حقن أنماط CSS
    injectFormatterStyles() {
        if (document.getElementById('formatter-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'formatter-styles';
        style.textContent = `
            .formatted-number {
                font-family: 'Tajawal', sans-serif;
                direction: ltr;
                unicode-bidi: embed;
            }
            
            .formatted-currency {
                color: #2E7D32;
                font-weight: bold;
            }
            
            .formatted-percentage {
                padding: 2px 8px;
                border-radius: 12px;
                font-weight: bold;
                display: inline-block;
                min-width: 60px;
                text-align: center;
            }
            
            .formatted-percentage.high {
                background: #E8F5E9;
                color: #2E7D32;
                border: 1px solid #4CAF50;
            }
            
            .formatted-percentage.medium {
                background: #FFF3E0;
                color: #EF6C00;
                border: 1px solid #FF9800;
            }
            
            .formatted-percentage.low {
                background: #FFEBEE;
                color: #C62828;
                border: 1px solid #F44336;
            }
            
            .formatted-date {
                direction: rtl;
                font-family: 'Tajawal', sans-serif;
            }
            
            .formatted-date.recent {
                color: #2196F3;
                font-weight: bold;
            }
            
            .formatted-date.past {
                color: #757575;
                opacity: 0.8;
            }
            
            .formatted-date.future {
                color: #4CAF50;
                font-weight: bold;
            }
            
            .formatted-unit {
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }
            
            .formatted-unit-value {
                font-weight: bold;
            }
            
            .formatted-unit-symbol {
                font-size: 0.9em;
                color: #757575;
            }
            
            .formatted-status {
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 0.85rem;
                font-weight: bold;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            
            .formatted-status-icon {
                font-size: 1.1rem;
            }
            
            .agriculture-formatted {
                background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
                border: 1px solid #4CAF50;
                border-radius: 8px;
                padding: 8px 12px;
                margin: 4px 0;
            }
            
            .agriculture-formatted .label {
                color: #2E7D32;
                font-weight: bold;
                font-size: 0.9rem;
            }
            
            .agriculture-formatted .value {
                color: #1B5E20;
                font-size: 1.1rem;
                font-weight: bold;
            }
            
            .formatted-coordinates {
                font-family: monospace;
                background: #F5F5F5;
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid #E0E0E0;
            }
            
            .formatted-tooltip {
                position: relative;
                cursor: help;
                border-bottom: 1px dashed #2196F3;
            }
            
            .formatted-tooltip:hover::after {
                content: attr(data-tooltip);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.85rem;
                white-space: nowrap;
                z-index: 1000;
                margin-bottom: 5px;
            }
            
            .formatted-highlight {
                background: linear-gradient(120deg, #FFEB3B 0%, #FFEB3B 100%);
                background-repeat: no-repeat;
                background-size: 100% 0.4em;
                background-position: 0 88%;
                transition: background-size 0.25s ease;
            }
            
            .formatted-highlight:hover {
                background-size: 100% 88%;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // 📅 تنسيق التاريخ (مُحسّن)
    formatDate(date, format = 'short', options = {}) {
        const cacheKey = `date_${date}_${format}_${JSON.stringify(options)}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        if (!date) {
            const result = this.getDefaultText('date_not_available');
            this.cache.set(cacheKey, result);
            return result;
        }
        
        const dateObj = this.parseDate(date);
        
        if (!dateObj || isNaN(dateObj.getTime())) {
            const result = this.getDefaultText('invalid_date');
            this.cache.set(cacheKey, result);
            return result;
        }
        
        const now = new Date();
        const diffTime = Math.abs(now - dateObj);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // تنسيقات الوقت النسبي
        if (options.relative) {
            const result = this.formatRelativeDate(dateObj, now);
            this.cache.set(cacheKey, result);
            return result;
        }
        
        const formats = {
            'short': { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            },
            'long': { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            },
            'time': { 
                hour: '2-digit', 
                minute: '2-digit',
                second: options.showSeconds ? '2-digit' : undefined,
                hour12: options.hour12 !== false
            },
            'full': { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: options.hour12 !== false
            },
            'iso': {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            },
            'agriculture': {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short'
            }
        };
        
        const formatOptions = formats[format] || formats.short;
        
        try {
            let result;
            
            if (format === 'agriculture') {
                result = this.formatAgricultureDate(dateObj, options);
            } else {
                result = dateObj.toLocaleDateString(this.locale, formatOptions);
            }
            
            // إضافة فئة CSS حسب الوقت
            let cssClass = 'formatted-date';
            if (diffDays === 0) {
                cssClass += ' recent';
            } else if (dateObj < now) {
                cssClass += ' past';
            } else {
                cssClass += ' future';
            }
            
            const formattedResult = `<span class="${cssClass}" data-timestamp="${dateObj.getTime()}" title="${dateObj.toISOString()}">${result}</span>`;
            
            this.cache.set(cacheKey, formattedResult);
            return formattedResult;
            
        } catch (error) {
            console.warn('⚠️ فشل تنسيق التاريخ:', error);
            const fallback = dateObj.toLocaleDateString();
            this.cache.set(cacheKey, fallback);
            return fallback;
        }
    }
    
    // ⭐ تنسيق التاريخ النسبي
    formatRelativeDate(date, now) {
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffSec < 60) {
            return this.translations.date.justNow;
        } else if (diffMin < 60) {
            return `${diffMin} ${this.translations.date.minutesAgo}`;
        } else if (diffHour < 24) {
            return `${diffHour} ${this.translations.date.hoursAgo}`;
        } else if (diffDay === 1) {
            return this.translations.date.yesterday;
        } else if (diffDay < 7) {
            return `${diffDay} ${this.translations.date.daysAgo}`;
        } else if (diffDay < 30) {
            const weeks = Math.floor(diffDay / 7);
            return `${weeks} ${this.translations.date.weeksAgo}`;
        } else {
            const months = Math.floor(diffDay / 30);
            return `${months} ${this.translations.date.monthsAgo}`;
        }
    }
    
    // ⭐ تنسيق التاريخ الزراعي
    formatAgricultureDate(date, options = {}) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        const hijriYear = year - 622;
        
        const seasons = {
            1: '🌨️ شتاء',
            2: '🌨️ شتاء',
            3: '🌸 ربيع',
            4: '🌸 ربيع',
            5: '🌸 ربيع',
            6: '☀️ صيف',
            7: '☀️ صيف',
            8: '☀️ صيف',
            9: '🍂 خريف',
            10: '🍂 خريف',
            11: '🍂 خريف',
            12: '🌨️ شتاء'
        };
        
        const season = seasons[month] || 'غير محدد';
        
        if (options.showHijri) {
            return `${day}/${month}/${year} (${hijriYear} هـ) - ${season}`;
        }
        
        return `${day}/${month}/${year} - ${season}`;
    }
    
    // ⭐ تحليل التاريخ
    parseDate(date) {
        if (date instanceof Date) return date;
        
        if (typeof date === 'string') {
            // محاولة تحليل تنسيقات مختلفة
            const parsed = new Date(date);
            if (!isNaN(parsed.getTime())) return parsed;
            
            // محاولة تنسيق dd/mm/yyyy
            const parts = date.split(/[/-]/);
            if (parts.length === 3) {
                return new Date(parts[2], parts[1] - 1, parts[0]);
            }
        }
        
        if (typeof date === 'number') {
            return new Date(date);
        }
        
        return null;
    }
    
    // 💰 تنسيق الأرقام والعملات (مُحسّن)
    formatNumber(number, type = 'number', options = {}) {
        const cacheKey = `number_${number}_${type}_${JSON.stringify(options)}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        if (number === null || number === undefined) {
            const result = this.getDefaultText('not_available');
            this.cache.set(cacheKey, result);
            return result;
        }
        
        const num = parseFloat(number);
        if (isNaN(num)) {
            const result = this.getDefaultText('invalid_number');
            this.cache.set(cacheKey, result);
            return result;
        }
        
        const formats = {
            'number': {
                style: 'decimal',
                minimumFractionDigits: options.minDecimals || 0,
                maximumFractionDigits: options.maxDecimals || this.decimalPlaces,
                useGrouping: options.useGrouping !== false
            },
            'currency': {
                style: 'currency',
                currency: options.currency || this.currency,
                minimumFractionDigits: options.minDecimals || 2,
                maximumFractionDigits: options.maxDecimals || 2,
                useGrouping: options.useGrouping !== false
            },
            'percent': {
                style: 'percent',
                minimumFractionDigits: options.minDecimals || 1,
                maximumFractionDigits: options.maxDecimals || 2
            },
            'decimal': {
                style: 'decimal',
                minimumFractionDigits: options.minDecimals || 2,
                maximumFractionDigits: options.maxDecimals || 4,
                useGrouping: options.useGrouping !== false
            },
            'scientific': {
                style: 'decimal',
                minimumFractionDigits: 1,
                maximumFractionDigits: 4,
                notation: 'scientific'
            }
        };
        
        const formatOptions = formats[type] || formats.number;
        
        try {
            let result = num.toLocaleString(this.locale, formatOptions);
            
            // إضافة فئة CSS
            let cssClass = `formatted-number ${type === 'currency' ? 'formatted-currency' : ''}`;
            
            if (type === 'percent') {
                const percentValue = parseFloat(result.replace(/[^\d.-]/g, ''));
                let level = 'medium';
                if (percentValue >= 80) level = 'high';
                else if (percentValue <= 30) level = 'low';
                
                cssClass += ` formatted-percentage ${level}`;
                result = `<span class="${cssClass}" data-value="${percentValue}">${result}</span>`;
            } else {
                result = `<span class="${cssClass}" data-value="${num}">${result}</span>`;
            }
            
            // إضافة أداة تلميح إذا كانت هناك معلومات إضافية
            if (options.tooltip) {
                result = `<span class="formatted-tooltip" data-tooltip="${options.tooltip}">${result}</span>`;
            }
            
            this.cache.set(cacheKey, result);
            return result;
            
        } catch (error) {
            console.warn('⚠️ فشل تنسيق الرقم:', error);
            const fallback = num.toString();
            this.cache.set(cacheKey, fallback);
            return fallback;
        }
    }
    
    // 📏 تنسيق الوحدات الزراعية (مُحسّن)
    formatUnit(value, unitType, unitName, options = {}) {
        const cacheKey = `unit_${value}_${unitType}_${unitName}_${JSON.stringify(options)}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        
        if (value === null || value === undefined) {
            const result = this.getDefaultText('not_available');
            this.cache.set(cacheKey, result);
            return result;
        }
        
        const num = parseFloat(value);
        if (isNaN(num)) {
            const result = this.getDefaultText('invalid_value');
            this.cache.set(cacheKey, result);
            return result;
        }
        
        // الحصول على معلومات الوحدة
        const unitCategory = this.agricultureUnits[unitType];
        if (!unitCategory) {
            const result = `${this.formatNumber(num)} ${unitName}`;
            this.cache.set(cacheKey, result);
            return result;
        }
        
        const unitInfo = unitCategory[unitName] || { name: unitName, symbol: unitName, conversion: 1 };
        
        // التحويل إذا لزم الأمر
        let displayValue = num;
        let displayUnit = unitInfo;
        
        if (options.convertTo && unitCategory[options.convertTo]) {
            const targetUnit = unitCategory[options.convertTo];
            displayValue = num * (unitInfo.conversion / targetUnit.conversion);
            displayUnit = targetUnit;
        }
        
        // التنسيق
        const formattedValue = this.formatNumber(displayValue, 'decimal', {
            minDecimals: options.minDecimals || 0,
            maxDecimals: options.maxDecimals || 2
        });
        
        const perUnit = options.perUnit ? ` ${this.translations.units[options.perUnit] || options.perUnit}` : '';
        
        const result = `
            <span class="formatted-unit agriculture-formatted" data-original-value="${num}" data-original-unit="${unitName}">
                <span class="formatted-unit-value">${formattedValue}</span>
                <span class="formatted-unit-symbol">${displayUnit.symbol}${perUnit}</span>
                ${options.showName ? `<span class="unit-name">${displayUnit.name}</span>` : ''}
            </span>
        `;
        
        this.cache.set(cacheKey, result);
        return result;
    }
    
    // ⭐ تنسيق الوحدة الزراعية باختصار
    formatAgricultureUnit(value, unitType, unitName) {
        return this.formatUnit(value, unitType, unitName, {
            minDecimals: 0,
            maxDecimals: 1,
            showName: false
        });
    }
    
    // ⏰ تنسيق الوقت المتبقي (مُحسّن)
    formatTimeRemaining(seconds, options = {}) {
        if (seconds <= 0) {
            return options.expiredText || '⏰ انتهى الوقت';
        }
        
        const units = [
            { value: 31536000, singular: 'سنة', plural: 'سنوات', icon: '📅' },
            { value: 2592000, singular: 'شهر', plural: 'أشهر', icon: '📆' },
            { value: 604800, singular: 'أسبوع', plural: 'أسابيع', icon: '🗓️' },
            { value: 86400, singular: 'يوم', plural: 'أيام', icon: '🌞' },
            { value: 3600, singular: 'ساعة', plural: 'ساعات', icon: '⏰' },
            { value: 60, singular: 'دقيقة', plural: 'دقائق', icon: '⏱️' },
            { value: 1, singular: 'ثانية', plural: 'ثواني', icon: '⚡' }
        ];
        
        let remaining = seconds;
        const parts = [];
        
        for (const unit of units) {
            if (remaining >= unit.value) {
                const count = Math.floor(remaining / unit.value);
                remaining %= unit.value;
                
                const unitName = count === 1 ? unit.singular : unit.plural;
                const icon = options.showIcons ? `${unit.icon} ` : '';
                parts.push(`${icon}${count} ${unitName}`);
                
                // إظهار عدد محدد من الأجزاء
                if (parts.length === (options.maxParts || 2)) break;
            }
        }
        
        let result = parts.join(' و ') || '⚡ بضع ثواني';
        
        if (options.showProgress) {
            const percentage = Math.min(100, (seconds / (options.total || seconds)) * 100);
            const progressBar = this.createProgressBar(percentage, 100, { height: '4px', width: '100px' });
            result += `<br>${progressBar}`;
        }
        
        return result;
    }
    
    // 🌡️ تنسيق درجة الحرارة (مُحسّن)
    formatTemperature(celsius, options = {}) {
        if (celsius === null || celsius === undefined) {
            return this.getDefaultText('not_available');
        }
        
        const temp = parseFloat(celsius);
        if (isNaN(temp)) {
            return this.getDefaultText('invalid_temperature');
        }
        
        const unit = options.unit || 'C';
        let displayTemp = temp;
        let unitSymbol = '°C';
        
        if (unit === 'F') {
            displayTemp = (temp * 9/5) + 32;
            unitSymbol = '°F';
        } else if (unit === 'K') {
            displayTemp = temp + 273.15;
            unitSymbol = 'K';
        }
        
        const formattedTemp = this.formatNumber(displayTemp, 'decimal', {
            minDecimals: options.minDecimals || 1,
            maxDecimals: options.maxDecimals || 1
        });
        
        // تحديد اللون حسب درجة الحرارة
        let color = '#2196F3'; // أزرق (بارد)
        if (temp >= 30) color = '#F44336'; // أحمر (حار)
        else if (temp >= 20) color = '#4CAF50'; // أخضر (معتدل)
        
        return `
            <span class="formatted-temperature" style="color: ${color}; font-weight: bold;">
                🌡️ ${formattedTemp}${unitSymbol}
            </span>
        `;
    }
    
    // 📊 تنسيق النسبة المئوية مع تقدم (مُحسّن)
    formatPercentage(value, total = 100, options = {}) {
        if (value === null || total === null) {
            return this.createPercentageDisplay(0, options);
        }
        
        const percentage = total > 0 ? (value / total) * 100 : 0;
        return this.createPercentageDisplay(percentage, options);
    }
    
    // ⭐ إنشاء عرض النسبة المئوية
    createPercentageDisplay(percentage, options = {}) {
        const formattedPercentage = this.formatNumber(percentage, 'percent', {
            minDecimals: options.minDecimals || 1,
            maxDecimals: options.maxDecimals || 2
        });
        
        let color = '#4CAF50'; // أخضر
        let level = 'high';
        
        if (percentage < 50) {
            color = '#F44336'; // أحمر
            level = 'low';
        } else if (percentage < 75) {
            color = '#FF9800'; // برتقالي
            level = 'medium';
        }
        
        let display = formattedPercentage;
        
        if (options.showProgressBar) {
            const progressBar = this.createProgressBar(percentage, 100, {
                height: options.barHeight || '8px',
                width: options.barWidth || '100px',
                showLabel: options.showLabel !== false,
                label: formattedPercentage
            });
            display = progressBar;
        } else if (options.showCircle) {
            const circleProgress = this.createCircleProgress(percentage, {
                size: options.size || '40px',
                color: options.color || color,
                backgroundColor: options.backgroundColor || '#E0E0E0'
            });
            display = circleProgress;
        }
        
        return {
            value: formattedPercentage,
            numeric: percentage,
            color: color,
            level: level,
            display: display,
            html: display
        };
    }
    
    // ⭐ إنشاء شريط تقدم
    createProgressBar(value, max, options = {}) {
        const percentage = Math.min(100, (value / max) * 100);
        const height = options.height || '6px';
        const width = options.width || '100%';
        
        let color = '#4CAF50';
        if (percentage < 50) color = '#F44336';
        else if (percentage < 75) color = '#FF9800';
        
        const bar = `
            <div style="
                width: ${width};
                background: #E0E0E0;
                border-radius: 10px;
                overflow: hidden;
                margin: 4px 0;
                position: relative;
            ">
                <div style="
                    width: ${percentage}%;
                    height: ${height};
                    background: ${color};
                    border-radius: 10px;
                    transition: width 0.3s ease;
                "></div>
                ${options.showLabel ? `
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: ${percentage > 50 ? 'white' : '#333'};
                        font-size: 0.8rem;
                        font-weight: bold;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                    ">
                        ${options.label || `${Math.round(percentage)}%`}
                    </div>
                ` : ''}
            </div>
        `;
        
        return bar;
    }
    
    // ⭐ إنشاء دائرة تقدم
    createCircleProgress(percentage, options = {}) {
        const size = options.size || '60px';
        const strokeWidth = parseInt(size) / 10;
        const radius = (parseInt(size) - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        
        let color = options.color || '#4CAF50';
        if (percentage < 50) color = '#F44336';
        else if (percentage < 75) color = '#FF9800';
        
        return `
            <div style="
                position: relative;
                width: ${size};
                height: ${size};
                display: inline-flex;
                align-items: center;
                justify-content: center;
            ">
                <svg width="${size}" height="${size}" style="transform: rotate(-90deg);">
                    <circle
                        cx="${parseInt(size) / 2}"
                        cy="${parseInt(size) / 2}"
                        r="${radius}"
                        stroke="${options.backgroundColor || '#E0E0E0'}"
                        stroke-width="${strokeWidth}"
                        fill="none"
                    />
                    <circle
                        cx="${parseInt(size) / 2}"
                        cy="${parseInt(size) / 2}"
                        r="${radius}"
                        stroke="${color}"
                        stroke-width="${strokeWidth}"
                        fill="none"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${offset}"
                        stroke-linecap="round"
                        style="transition: stroke-dashoffset 0.5s ease;"
                    />
                </svg>
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: ${parseInt(size) / 4}px;
                    font-weight: bold;
                    color: ${color};
                ">
                    ${Math.round(percentage)}%
                </div>
            </div>
        `;
    }
    
    // 🎨 تنسيق الألوان (مُحسّن)
    formatColor(hexColor, options = {}) {
        if (!hexColor) {
            return `rgba(46, 125, 50, ${options.opacity || 1})`; // لون زراعي افتراضي
        }
        
        // تحقق من تنسيق HEX
        let hex = hexColor;
        if (!hex.startsWith('#')) {
            hex = `#${hex}`;
        }
        
        // تحويل HEX إلى RGB
        let r, g, b;
        
        if (hex.length === 4) { // #RGB
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) { // #RRGGBB
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        } else {
            // تنسيق غير صالح، استخدام اللون الافتراضي
            return `rgba(46, 125, 50, ${options.opacity || 1})`;
        }
        
        const opacity = options.opacity || 1;
        
        if (opacity < 1) {
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // 🔢 تنسيق الأرقام الكبيرة (مُحسّن)
    formatLargeNumber(num, options = {}) {
        if (num === null || num === undefined) return '0';
        
        const number = parseFloat(num);
        if (isNaN(number)) return '0';
        
        const suffixes = [
            { value: 1e12, suffix: 'T', name: 'تريليون' },
            { value: 1e9, suffix: 'B', name: 'مليار' },
            { value: 1e6, suffix: 'M', name: 'مليون' },
            { value: 1e3, suffix: 'K', name: 'ألف' }
        ];
        
        for (const suffix of suffixes) {
            if (Math.abs(number) >= suffix.value) {
                const formatted = (number / suffix.value).toFixed(options.decimals || 1);
                const suffixText = options.useArabicNames ? suffix.name : suffix.suffix;
                return `${formatted}${suffixText}`;
            }
        }
        
        return this.formatNumber(number, 'number', {
            minDecimals: 0,
            maxDecimals: options.decimals || 0
        });
    }
    
    // 📱 تنسيق حجم الملف (مُحسّن)
    formatFileSize(bytes, options = {}) {
        if (bytes === 0) return '0 بايت';
        
        const units = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت', 'تيرابايت'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        
        const size = (bytes / Math.pow(1024, i)).toFixed(options.decimals || 2);
        const unit = options.useArabicNames ? units[i] : ['B', 'KB', 'MB', 'GB', 'TB'][i];
        
        return `${size} ${unit}`;
    }
    
    // ⏱️ تنسيق المدة الزمنية (مُحسّن)
    formatDuration(seconds, options = {}) {
        if (!seconds && seconds !== 0) return '00:00';
        
        const secs = Math.abs(parseFloat(seconds));
        
        const hours = Math.floor(secs / 3600);
        const minutes = Math.floor((secs % 3600) / 60);
        const remainingSeconds = Math.floor(secs % 60);
        
        const parts = [];
        
        if (hours > 0 || options.alwaysShowHours) {
            parts.push(hours.toString().padStart(2, '0'));
        }
        
        parts.push(minutes.toString().padStart(2, '0'));
        parts.push(remainingSeconds.toString().padStart(2, '0'));
        
        let result = parts.join(':');
        
        if (seconds < 0) {
            result = `-${result}`;
        }
        
        if (options.showUnits) {
            const unitParts = [];
            if (hours > 0) unitParts.push(`${hours} ساعة`);
            if (minutes > 0) unitParts.push(`${minutes} دقيقة`);
            if (remainingSeconds > 0) unitParts.push(`${remainingSeconds} ثانية`);
            
            result += ` (${unitParts.join(' و ')})`;
        }
        
        return result;
    }
    
    // 📍 تنسيق الإحداثيات الزراعية (مُحسّن)
    formatCoordinates(lat, lng, options = {}) {
        if (!lat || !lng) return this.getDefaultText('not_available');
        
        const formatCoordinate = (coord, isLat) => {
            const absolute = Math.abs(coord);
            const degrees = Math.floor(absolute);
            const minutes = Math.floor((absolute - degrees) * 60);
            const seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(options.secondsDecimals || 1);
            
            const direction = isLat ? 
                (coord >= 0 ? 'شمال' : 'جنوب') : 
                (coord >= 0 ? 'شرق' : 'غرب');
            
            return `${degrees}°${minutes}'${seconds}" ${direction}`;
        };
        
        const latFormatted = formatCoordinate(lat, true);
        const lngFormatted = formatCoordinate(lng, false);
        
        let result = `${latFormatted} - ${lngFormatted}`;
        
        if (options.showMapLink) {
            const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
            result = `<a href="${mapsUrl}" target="_blank" class="formatted-coordinates" title="فتح في خرائط جوجل">${result}</a>`;
        } else {
            result = `<span class="formatted-coordinates">${result}</span>`;
        }
        
        return result;
    }
    
    // 💬 تنسيق النصوص الزراعية (مُحسّن)
    formatText(text, options = {}) {
        if (!text) return this.getDefaultText('empty_text');
        
        const maxLength = options.maxLength || 100;
        const ellipsis = options.ellipsis || '...';
        
        if (text.length <= maxLength) {
            return this.enhanceText(text, options);
        }
        
        // البحث عن آخر مسافة قبل الحد الأقصى
        let truncated = text.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        
        if (lastSpace > maxLength * 0.7) { // إذا كانت المسافة قريبة من النهاية
            truncated = text.substring(0, lastSpace);
        }
        
        const result = this.enhanceText(truncated + ellipsis, options);
        
        if (options.showFullOnHover) {
            return `<span class="formatted-tooltip" data-tooltip="${text.replace(/"/g, '&quot;')}">${result}</span>`;
        }
        
        return result;
    }
    
    // ⭐ تحسين النص
    enhanceText(text, options = {}) {
        let enhanced = text;
        
        // تحويل الهاشتاجات
        if (options.formatHashtags) {
            enhanced = enhanced.replace(/#(\w+[\u0600-\u06FF\w]*)/g, 
                '<span class="hashtag" style="color: #2196F3; cursor: pointer;" onclick="window.formatters.handleHashtagClick(\'$1\')">#$1</span>');
        }
        
        // تحويل المرفعات
        if (options.formatMentions) {
            enhanced = enhanced.replace(/@(\w+)/g, 
                '<span class="mention" style="color: #4CAF50; font-weight: bold;">@$1</span>');
        }
        
        // إبراز الكلمات المهمة
        if (options.highlightKeywords && options.keywords) {
            options.keywords.forEach(keyword => {
                const regex = new RegExp(`(${keyword})`, 'gi');
                enhanced = enhanced.replace(regex, '<span class="formatted-highlight">$1</span>');
            });
        }
        
        // الحفاظ على فواصل الأسطر
        if (options.preserveLineBreaks) {
            enhanced = enhanced.replace(/\n/g, '<br>');
        }
        
        return enhanced;
    }
    
    // 🏷️ معالجة الهاشتاجات
    handleHashtagClick(tag) {
        console.log('🏷️ تم النقر على الهاشتاج:', tag);
        
        if (this.mainBridge) {
            this.mainBridge.searchHashtag(tag);
        }
        
        // إضافة نقاط
        if (window.pointsSystem) {
            window.pointsSystem.addPoints('hashtag_click', 1);
        }
        
        // تسجيل الحدث
        this.logEvent('hashtag_clicked', { tag });
    }
    
    // 📞 تنسيق أرقام الهواتف (مُحسّن)
    formatPhoneNumber(phone, options = {}) {
        if (!phone) return '';
        
        // إزالة كل ما ليس رقماً
        const cleaned = phone.replace(/\D/g, '');
        
        let formatted = phone;
        
        if (cleaned.length === 9 && cleaned.startsWith('5')) {
            // تنسيق: 5X XXX XXXX
            formatted = cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
        } else if (cleaned.length === 10 && cleaned.startsWith('05')) {
            // تنسيق: 05X XXX XXXX
            formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        } else if (cleaned.length === 12 && cleaned.startsWith('966')) {
            // تنسيق: +966 5X XXX XXXX
            formatted = `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
        }
        
        if (options.makeCallable) {
            return `<a href="tel:${cleaned}" style="color: #4CAF50; text-decoration: none;">${formatted}</a>`;
        }
        
        return formatted;
    }
    
    // 🔗 تنسيق الروابط الزراعية (مُحسّن)
    formatLink(url, options = {}) {
        if (!url) return this.getDefaultText('no_link');
        
        let displayText = options.text;
        
        if (!displayText) {
            // إنشاء نص عرض ذكي من الرابط
            displayText = url
                .replace(/^https?:\/\//, '')
                .replace(/^www\./, '')
                .replace(/\/$/, '');
            
            if (displayText.length > (options.maxTextLength || 40)) {
                displayText = displayText.substring(0, options.maxTextLength || 40) + '...';
            }
        }
        
        const icon = options.icon ? `${options.icon} ` : '🔗 ';
        const className = options.className || '';
        const style = options.style || 'color: #2196F3; text-decoration: none;';
        
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" 
                class="${className}" style="${style}"
                title="${options.title || url}">
                ${icon}${displayText}
            </a>`;
    }
    
    // ⭐ تنسيق التقييم الزراعي
    formatAgricultureRating(rating, max = 5, options = {}) {
        if (!rating && rating !== 0) return 'غير مقيم';
        
        const normalizedRating = Math.min(Math.max(rating, 0), max);
        const fullStars = Math.floor(normalizedRating);
        const hasHalfStar = normalizedRating % 1 >= 0.5;
        const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        // نجوم كاملة
        stars += '★'.repeat(fullStars);
        
        // نصف نجمة
        if (hasHalfStar) {
            stars += '⭐';
        }
        
        // نجوم فارغة
        stars += '☆'.repeat(emptyStars);
        
        const numericRating = this.formatNumber(normalizedRating, 'decimal', {
            minDecimals: 1,
            maxDecimals: 2
        });
        
        let result = `${stars} (${numericRating}/${max})`;
        
        if (options.showText) {
            let text = 'ضعيف';
            if (normalizedRating >= 4) text = 'ممتاز';
            else if (normalizedRating >= 3) text = 'جيد';
            else if (normalizedRating >= 2) text = 'متوسط';
            
            result += ` - ${text}`;
        }
        
        return result;
    }
    
    // 🎯 تنسيق النقاط الزراعية (مُحسّن)
    formatPoints(points, options = {}) {
        if (!points && points !== 0) return '0 نقطة';
        
        const num = parseInt(points);
        if (isNaN(num)) return '0 نقطة';
        
        const formatted = this.formatLargeNumber(num, {
            decimals: options.decimals || 0,
            useArabicNames: options.useArabicNames !== false
        });
        
        let suffix = 'نقطة';
        if (options.customSuffix) {
            suffix = options.customSuffix;
        } else if (num === 1) {
            suffix = 'نقطة';
        } else if (num === 2) {
            suffix = 'نقطتين';
        } else if (num >= 3 && num <= 10) {
            suffix = 'نقاط';
        } else {
            suffix = 'نقطة';
        }
        
        let result = `${formatted} ${suffix}`;
        
        if (options.showIcon) {
            const icon = options.icon || '💰';
            result = `${icon} ${result}`;
        }
        
        if (options.highlight && num > 0) {
            result = `<span style="color: #FFD700; font-weight: bold;">${result}</span>`;
        }
        
        return result;
    }
    
    // 📦 تنسيق الحالة الزراعية (مُحسّن)
    formatAgricultureStatus(status, options = {}) {
        const statuses = {
            // حالات المحاصيل
            'planting': { 
                text: 'قيد الزراعة', 
                color: '#4CAF50', 
                icon: '🌱',
                bgColor: '#E8F5E9'
            },
            'growing': { 
                text: 'قيد النمو', 
                color: '#8BC34A', 
                icon: '🌿',
                bgColor: '#F1F8E9'
            },
            'maturing': { 
                text: 'قيد النضج', 
                color: '#FF9800', 
                icon: '🌾',
                bgColor: '#FFF3E0'
            },
            'harvesting': { 
                text: 'قيد الحصاد', 
                color: '#795548', 
                icon: '👨‍🌾',
                bgColor: '#EFEBE9'
            },
            'harvested': { 
                text: 'تم الحصاد', 
                color: '#2E7D32', 
                icon: '✅',
                bgColor: '#E8F5E9'
            },
            'failed': { 
                text: 'فاشل', 
                color: '#F44336', 
                icon: '❌',
                bgColor: '#FFEBEE'
            },
            
            // حالات الري
            'irrigation_needed': { 
                text: 'بحاجة للري', 
                color: '#2196F3', 
                icon: '💧',
                bgColor: '#E3F2FD'
            },
            'irrigated': { 
                text: 'مروي', 
                color: '#03A9F4', 
                icon: '✅',
                bgColor: '#E1F5FE'
            },
            
            // حالات التسميد
            'fertilization_needed': { 
                text: 'بحاجة للتسميد', 
                color: '#FF9800', 
                icon: '🌱',
                bgColor: '#FFF3E0'
            },
            'fertilized': { 
                text: 'مسمد', 
                color: '#FFB300', 
                icon: '✅',
                bgColor: '#FFF8E1'
            },
            
            // حالات عامة
            'pending': { 
                text: 'قيد الانتظار', 
                color: '#FF9800', 
                icon: '⏳',
                bgColor: '#FFF3E0'
            },
            'processing': { 
                text: 'قيد المعالجة', 
                color: '#2196F3', 
                icon: '⚙️',
                bgColor: '#E3F2FD'
            },
            'completed': { 
                text: 'مكتمل', 
                color: '#4CAF50', 
                icon: '✅',
                bgColor: '#E8F5E9'
            },
            'cancelled': { 
                text: 'ملغي', 
                color: '#F44336', 
                icon: '❌',
                bgColor: '#FFEBEE'
            }
        };
        
        const statusInfo = statuses[status] || { 
            text: status, 
            color: '#757575', 
            icon: '❓',
            bgColor: '#F5F5F5'
        };
        
        if (options.returnObject) {
            return statusInfo;
        }
        
        const html = `
            <span class="formatted-status" style="
                background: ${this.formatColor(statusInfo.bgColor, 0.2)};
                color: ${statusInfo.color};
                border: 1px solid ${this.formatColor(statusInfo.color, 0.3)};
            ">
                <span class="formatted-status-icon">${statusInfo.icon}</span>
                <span>${statusInfo.text}</span>
            </span>
        `;
        
        return {
            text: statusInfo.text,
            color: statusInfo.color,
            icon: statusInfo.icon,
            html: html
        };
    }
    
    // ⭐ تنسيق بيانات المحصول
    formatCropData(crop, options = {}) {
        if (!crop) return this.getDefaultText('no_crop_data');
        
        const html = `
            <div class="agriculture-formatted" style="padding: 15px; margin: 10px 0;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                    <div style="
                        width: 40px;
                        height: 40px;
                        background: ${this.formatColor('#8BC34A', 0.2)};
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                    ">
                        ${crop.icon || '🌱'}
                    </div>
                    <div>
                        <h4 style="margin: 0; color: #2E7D32;">${crop.name}</h4>
                        <small style="color: #757575;">${crop.scientificName || ''}</small>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 15px;">
                    ${crop.season ? `
                        <div>
                            <div class="label">الموسم</div>
                            <div class="value">${crop.season}</div>
                        </div>
                    ` : ''}
                    
                    ${crop.duration ? `
                        <div>
                            <div class="label">مدة النمو</div>
                            <div class="value">${this.formatDuration(crop.duration * 24 * 60 * 60, { showUnits: true })}</div>
                        </div>
                    ` : ''}
                    
                    ${crop.waterNeeds ? `
                        <div>
                            <div class="label">احتياجات المياه</div>
                            <div class="value">${this.formatUnit(crop.waterNeeds, 'volume', 'liter', { perUnit: 'perHectare' })}</div>
                        </div>
                    ` : ''}
                    
                    ${crop.yield ? `
                        <div>
                            <div class="label">الإنتاجية</div>
                            <div class="value">${this.formatUnit(crop.yield, 'weight', 'kg', { perUnit: 'perHectare' })}</div>
                        </div>
                    ` : ''}
                </div>
                
                ${crop.description ? `
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0,0,0,0.1);">
                        <div class="label">الوصف</div>
                        <div style="color: #424242; line-height: 1.6; font-size: 0.95rem;">
                            ${this.formatText(crop.description, { maxLength: 200, preserveLineBreaks: true })}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        return html;
    }
    
    // ⭐ تنسيق بيانات التربة
    formatSoilData(soil, options = {}) {
        if (!soil) return this.getDefaultText('no_soil_data');
        
        const phLevel = soil.ph || 7;
        let phStatus = 'محايد';
        let phColor = '#4CAF50';
        
        if (phLevel < 6.5) {
            phStatus = 'حمضي';
            phColor = '#F44336';
        } else if (phLevel > 7.5) {
            phStatus = 'قلوي';
            phColor = '#2196F3';
        }
        
        const html = `
            <div class="agriculture-formatted" style="padding: 15px; margin: 10px 0;">
                <h4 style="margin: 0 0 15px 0; color: #5D4037; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-mountain"></i> بيانات التربة
                </h4>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                    <div>
                        <div class="label">نوع التربة</div>
                        <div class="value" style="color: #5D4037;">${soil.type || 'غير محدد'}</div>
                    </div>
                    
                    <div>
                        <div class="label">درجة الحموضة (pH)</div>
                        <div class="value" style="color: ${phColor};">
                            ${this.formatNumber(phLevel, 'decimal', { minDecimals: 1, maxDecimals: 2 })} 
                            <small style="color: ${phColor};">(${phStatus})</small>
                        </div>
                    </div>
                    
                    ${soil.moisture !== undefined ? `
                        <div>
                            <div class="label">الرطوبة</div>
                            <div class="value">
                                ${this.formatPercentage(soil.moisture, 100, { 
                                    showProgressBar: true,
                                    barWidth: '100px',
                                    barHeight: '6px'
                                }).html}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${soil.temperature !== undefined ? `
                        <div>
                            <div class="label">حرارة التربة</div>
                            <div class="value">
                                ${this.formatTemperature(soil.temperature)}
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                ${soil.nutrients ? `
                    <div style="margin-top: 15px;">
                        <div class="label" style="margin-bottom: 8px;">المغذيات</div>
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            ${Object.entries(soil.nutrients).map(([nutrient, value]) => `
                                <div style="
                                    background: ${this.formatColor('#8BC34A', 0.1)};
                                    padding: 8px 12px;
                                    border-radius: 8px;
                                    border: 1px solid ${this.formatColor('#8BC34A', 0.3)};
                                    min-width: 100px;
                                ">
                                    <div style="font-size: 0.85rem; color: #2E7D32;">${nutrient}</div>
                                    <div style="font-weight: bold; color: #1B5E20;">
                                        ${this.formatNumber(value, 'decimal', { minDecimals: 1, maxDecimals: 2 })} mg/kg
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        return html;
    }
    
    // ⭐ الحصول على نص افتراضي
    getDefaultText(type) {
        const defaults = {
            'not_available': '<span style="color: #9E9E9E; font-style: italic;">غير متوفر</span>',
            'invalid_date': '<span style="color: #F44336;">تاريخ غير صالح</span>',
            'invalid_number': '<span style="color: #F44336;">رقم غير صالح</span>',
            'invalid_temperature': '<span style="color: #F44336;">درجة حرارة غير صالحة</span>',
            'invalid_value': '<span style="color: #F44336;">قيمة غير صالحة</span>',
            'empty_text': '<span style="color: #9E9E9E; font-style: italic;">لا يوجد نص</span>',
            'no_link': '<span style="color: #9E9E9E; font-style: italic;">لا يوجد رابط</span>',
            'no_crop_data': '<span style="color: #9E9E9E; font-style: italic;">لا توجد بيانات للمحصول</span>',
            'no_soil_data': '<span style="color: #9E9E9E; font-style: italic;">لا توجد بيانات للتربة</span>',
            'date_not_available': '<span style="color: #9E9E9E; font-style: italic;">تاريخ غير متوفر</span>'
        };
        
        return defaults[type] || defaults['not_available'];
    }
    
    // ⭐ تسجيل حدث
    logEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            data,
            timestamp: new Date().toISOString(),
            module: 'formatters'
        };
        
        if (window.helpers && window.helpers.logEvent) {
            window.helpers.logEvent(eventName, data);
        }
        
        console.log(`📝 حدث نظام التنسيق: ${eventName}`, data);
    }
    
    // ⭐ تحديث الإعدادات
    updateSettings(settings) {
        try {
            Object.assign(this, settings);
            localStorage.setItem('formatter_settings', JSON.stringify(settings));
            
            // مسح الذاكرة المؤقتة
            this.cache.clear();
            
            console.log('✅ تم تحديث إعدادات التنسيق');
            
            // تسجيل الحدث
            this.logEvent('settings_updated', { settings });
            
            return true;
        } catch (error) {
            console.error('❌ فشل تحديث الإعدادات:', error);
            return false;
        }
    }
    
    // ⭐ تصدير الإعدادات
    exportSettings() {
        const settings = {
            locale: this.locale,
            currency: this.currency,
            decimalPlaces: this.decimalPlaces,
            dateFormat: this.dateFormat,
            numberFormat: this.numberFormat,
            unitSystem: this.unitSystem,
            translations: this.translations,
            exportDate: new Date().toISOString(),
            version: '4.0'
        };
        
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `formatter-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return settings;
    }
    
    // ⭐ استيراد الإعدادات
    async importSettings(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const settings = JSON.parse(event.target.result);
                    
                    // التحقق من الإصدار
                    if (!settings.version || settings.version < '4.0') {
                        throw new Error('إعدادات قديمة. يلزم الإصدار 4.0 أو أحدث');
                    }
                    
                    // تطبيق الإعدادات
                    this.updateSettings(settings);
                    
                    console.log('✅ تم استيراد إعدادات التنسيق');
                    resolve(true);
                    
                } catch (error) {
                    console.error('❌ فشل استيراد الإعدادات:', error);
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('فشل قراءة الملف'));
            reader.readAsText(file);
        });
    }
}

// ====== إنشاء نسخة عالمية ======
let formattersInstance = null;

function initFormatters() {
    if (!formattersInstance) {
        formattersInstance = new Formatters();
        
        // ⭐ ربط مع الجسر الرئيسي
        if (window.mainBridge) {
            window.mainBridge.formatters = formattersInstance;
            console.log('✅ تم ربط نظام التنسيق مع الجسر الرئيسي');
        }
    }
    return formattersInstance;
}

// ====== واجهة مبسطة للاستخدام ======
window.formatters = {
    init: function() {
        return initFormatters();
    },
    
    // التواريخ
    date: function(date, format, options) {
        const formatter = initFormatters();
        return formatter.formatDate(date, format, options);
    },
    
    relativeDate: function(date, options) {
        const formatter = initFormatters();
        return formatter.formatDate(date, 'short', { ...options, relative: true });
    },
    
    agricultureDate: function(date, options) {
        const formatter = initFormatters();
        return formatter.formatAgricultureDate(date, options);
    },
    
    // الأرقام
    number: function(num, type, options) {
        const formatter = initFormatters();
        return formatter.formatNumber(num, type, options);
    },
    
    currency: function(amount, options) {
        const formatter = initFormatters();
        return formatter.formatNumber(amount, 'currency', options);
    },
    
    percentage: function(value, total, options) {
        const formatter = initFormatters();
        return formatter.formatPercentage(value, total, options);
    },
    
    largeNumber: function(num, options) {
        const formatter = initFormatters();
        return formatter.formatLargeNumber(num, options);
    },
    
    // الوحدات
    unit: function(value, unitType, unitName, options) {
        const formatter = initFormatters();
        return formatter.formatUnit(value, unitType, unitName, options);
    },
    
    agricultureUnit: function(value, unitType, unitName) {
        const formatter = initFormatters();
        return formatter.formatAgricultureUnit(value, unitType, unitName);
    },
    
    // الوقت
    timeRemaining: function(seconds, options) {
        const formatter = initFormatters();
        return formatter.formatTimeRemaining(seconds, options);
    },
    
    duration: function(seconds, options) {
        const formatter = initFormatters();
        return formatter.formatDuration(seconds, options);
    },
    
    // القياسات
    temperature: function(celsius, options) {
        const formatter = initFormatters();
        return formatter.formatTemperature(celsius, options);
    },
    
    fileSize: function(bytes, options) {
        const formatter = initFormatters();
        return formatter.formatFileSize(bytes, options);
    },
    
    coordinates: function(lat, lng, options) {
        const formatter = initFormatters();
        return formatter.formatCoordinates(lat, lng, options);
    },
    
    // النصوص
    text: function(text, options) {
        const formatter = initFormatters();
        return formatter.formatText(text, options);
    },
    
    link: function(url, options) {
        const formatter = initFormatters();
        return formatter.formatLink(url, options);
    },
    
    phone: function(number, options) {
        const formatter = initFormatters();
        return formatter.formatPhoneNumber(number, options);
    },
    
    // الزراعة
    cropData: function(crop, options) {
        const formatter = initFormatters();
        return formatter.formatCropData(crop, options);
    },
    
    soilData: function(soil, options) {
        const formatter = initFormatters();
        return formatter.formatSoilData(soil, options);
    },
    
    agricultureStatus: function(status, options) {
        const formatter = initFormatters();
        return formatter.formatAgricultureStatus(status, options);
    },
    
    agricultureRating: function(rating, max, options) {
        const formatter = initFormatters();
        return formatter.formatAgricultureRating(rating, max, options);
    },
    
    // النقاط والحالات
    points: function(points, options) {
        const formatter = initFormatters();
        return formatter.formatPoints(points, options);
    },
    
    status: function(status, options) {
        const formatter = initFormatters();
        return formatter.formatAgricultureStatus(status, options);
    },
    
    // الأدوات
    color: function(hex, options) {
        const formatter = initFormatters();
        return formatter.formatColor(hex, options);
    },
    
    progressBar: function(value, max, options) {
        const formatter = initFormatters();
        return formatter.createProgressBar(value, max, options);
    },
    
    circleProgress: function(percentage, options) {
        const formatter = initFormatters();
        return formatter.createCircleProgress(percentage, options);
    },
    
    // الإعدادات
    updateSettings: function(settings) {
        const formatter = initFormatters();
        return formatter.updateSettings(settings);
    },
    
    exportSettings: function() {
        const formatter = initFormatters();
        return formatter.exportSettings();
    },
    
    importSettings: async function(file) {
        const formatter = initFormatters();
        return await formatter.importSettings(file);
    },
    
    // ⭐ دوال سريعة للجسر الرئيسي
    formatQuick: function(value, type, options) {
        const formatter = initFormatters();
        
        switch (type) {
            case 'date':
                return formatter.formatDate(value, options?.format, options);
            case 'number':
                return formatter.formatNumber(value, options?.subType, options);
            case 'currency':
                return formatter.formatNumber(value, 'currency', options);
            case 'percent':
                return formatter.formatPercentage(value, options?.total, options);
            case 'unit':
                return formatter.formatAgricultureUnit(value, options?.unitType, options?.unitName);
            case 'points':
                return formatter.formatPoints(value, options);
            case 'status':
                return formatter.formatAgricultureStatus(value, options);
            default:
                return value;
        }
    },
    
    // ⭐ تحسين النص الزراعي
    enhanceAgricultureText: function(text) {
        const formatter = initFormatters();
        return formatter.enhanceText(text, {
            formatHashtags: true,
            formatMentions: true,
            preserveLineBreaks: true,
            highlightKeywords: true,
            keywords: ['زراعة', 'ماء', 'تربة', 'محصول', 'سماد', 'ري']
        });
    },
    
    // ⭐ معالجة الهاشتاجات
    handleHashtagClick: function(tag) {
        const formatter = initFormatters();
        return formatter.handleHashtagClick(tag);
    },
    
    // ⭐ تنسيق الصفحة تلقائياً
    autoFormatPage: function() {
        const formatter = initFormatters();
        
        // تنسيق التواريخ
        document.querySelectorAll('[data-format-date]').forEach(element => {
            const date = element.getAttribute('data-format-date');
            const format = element.getAttribute('data-format-type') || 'short';
            element.innerHTML = formatter.formatDate(date, format);
        });
        
        // تنسيق الأرقام
        document.querySelectorAll('[data-format-number]').forEach(element => {
            const number = element.getAttribute('data-format-number');
            const type = element.getAttribute('data-format-type') || 'number';
            element.innerHTML = formatter.formatNumber(number, type);
        });
        
        // تنسيق النقاط
        document.querySelectorAll('[data-format-points]').forEach(element => {
            const points = element.getAttribute('data-format-points');
            element.innerHTML = formatter.formatPoints(points, { showIcon: true });
        });
        
        console.log('✅ تم تنسيق الصفحة تلقائياً');
    }
};

// ====== تهيئة تلقائية ======
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة متأخرة لضمان تحميل جميع الأنظمة
    setTimeout(() => {
        initFormatters();
        console.log('🎨 نظام التنسيق الزراعي جاهز - الإصدار 4.0');
        
        // ⭐ إضافة إلى لوحة المطور إذا كانت موجودة
        if (window.developerDashboard) {
            window.developerDashboard.registerModule('formatters', {
                name: 'نظام التنسيق',
                version: '4.0',
                instance: formattersInstance,
                methods: ['exportSettings', 'updateSettings']
            });
        }
        
        // ⭐ تنسيق عناصر الصفحة تلقائياً
        setTimeout(() => {
            window.formatters.autoFormatPage();
        }, 2000);
        
    }, 1000);
});

// ====== رسالة المطور ======
console.log(`
🎨 **نظام التنسيق والتنسيقات - الإصدار 4.0**
🌱 **مخصص للتطبيق الزراعي الذكي**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ المميزات الجديدة:
• تنسيقات زراعية متخصصة (محاصيل، تربة، ري)
• وحدات قياس زراعية متكاملة
• دعم كامل للغة العربية والتقويم الهجري
• أدوات عرض مرئية (أشرطة تقدم، دوائر، ألوان)
• تكامل مع أنظمة المشروع (النقاط، المساعدات)
• تنسيق تلقائي للعناصر في الصفحة
• إدارة إعدادات متقدمة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 أمثلة الاستخدام:
1. window.formatters.date(new Date(), 'agriculture')
2. window.formatters.cropData(crop) - تنسيق بيانات محصول
3. window.formatters.soilData(soil) - تنسيق بيانات تربة
4. window.formatters.agricultureUnit(1500, 'weight', 'kg')
5. window.formatters.agricultureStatus('growing')
6. window.formatters.agricultureRating(4.5, 5)
7. window.formatters.enhanceAgricultureText('نص زراعي')
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌱 التنسيقات الزراعية المتخصصة:
• تنسيق بيانات المحاصيل (cropData)
• تنسيق بيانات التربة (soilData)
• تنسيق الحالات الزراعية (agricultureStatus)
• تنسيق التقييمات الزراعية (agricultureRating)
• تنسيق الوحدات الزراعية (agricultureUnit)
• تنسيق التواريخ الزراعية (agricultureDate)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 الأنظمة المتكاملة:
• نظام النقاط والمكافآت
• نظام المساعدات والدوال المساعدة
• الجسر الرئيسي للتطبيق
• لوحة تحكم المطور
• نظام الترجمة واللغات
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 أدوات العرض:
• أشرطة تقدم متحركة
• دوائر تقدم دائرية
• ألوان متدرجة زراعية
• أيقونات وزخارف زراعية
• تلميحات وأدوات مساعدة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ الموقع في المشروع: js/utils/formatters.js
🔗 متكامل مع: main.js, helpers.js, points.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تم التطوير بواسطة: المرشد الزراعي الذكي
© 2026 جميع الحقوق محفوظة
`);

// ⭐ تصدير للاستخدام في الوحدات الأخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Formatters, formatters: window.formatters };
}