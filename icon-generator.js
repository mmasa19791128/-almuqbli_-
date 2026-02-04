// ====== مولد الأيقونات الأوتوماتيكي ======
// 🎨 الإصدار 2.0 | توليد وحفظ تلقائي

class AutoIconGenerator {
    constructor() {
        this.colors = {
            primary: '#2E7D32',
            primaryDark: '#1B5E20',
            primaryLight: '#4CAF50',
            secondary: '#FF9800',
            background: '#FFFFFF',
            text: '#212121'
        };
        
        this.requiredIcons = [
            { name: 'icon-72.png', size: 72, type: 'leaf' },
            { name: 'icon-96.png', size: 96, type: 'leaf' },
            { name: 'icon-128.png', size: 128, type: 'leaf' },
            { name: 'icon-144.png', size: 144, type: 'leaf' },
            { name: 'icon-152.png', size: 152, type: 'leaf' },
            { name: 'icon-192.png', size: 192, type: 'leaf' },
            { name: 'icon-384.png', size: 384, type: 'leaf' },
            { name: 'icon-512.png', size: 512, type: 'leaf' },
            { name: 'apple-touch-icon.png', size: 180, type: 'leaf' },
            { name: 'favicon.ico', size: 32, type: 'leaf' },
            { name: 'diagnosis-icon.png', size: 96, type: 'diagnosis' },
            { name: 'soil-icon.png', size: 96, type: 'soil' },
            { name: 'crops-icon.png', size: 96, type: 'crops' }
        ];
    }
    
    // ✅ التحقق من وجود الأيقونات
    async checkIconsExist() {
        const missingIcons = [];
        
        for (const icon of this.requiredIcons) {
            try {
                const response = await fetch(`assets/icons/${icon.name}`);
                if (!response.ok) {
                    missingIcons.push(icon);
                }
            } catch (error) {
                missingIcons.push(icon);
            }
        }
        
        return missingIcons;
    }
    
    // ✅ إنشاء أيقونة وتخزينها في IndexedDB
    async generateAndStoreIcon(icon) {
        return new Promise((resolve) => {
            // إنشاء canvas
            const canvas = document.createElement('canvas');
            canvas.width = icon.size;
            canvas.height = icon.size;
            const ctx = canvas.getContext('2d');
            
            // إنشاء الأيقونة
            this.drawIcon(ctx, icon.size, icon.type);
            
            // تحويل إلى Blob
            canvas.toBlob(async (blob) => {
                try {
                    // تخزين في IndexedDB
                    await this.storeIconInDB(icon.name, blob);
                    
                    // حفظ في localStorage كـ Base64 (للاستخدام الفوري)
                    canvas.toBlob((base64Blob) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            localStorage.setItem(`icon_${icon.name}`, reader.result);
                            resolve(true);
                        };
                        reader.readAsDataURL(base64Blob);
                    });
                    
                } catch (error) {
                    console.error(`❌ فشل حفظ ${icon.name}:`, error);
                    resolve(false);
                }
            }, 'image/png');
        });
    }
    
    // ✅ رسم الأيقونة
    drawIcon(ctx, size, type) {
        // تنظيف Canvas
        ctx.clearRect(0, 0, size, size);
        
        // خلفية دائرية
        const center = size / 2;
        const radius = size * 0.45;
        
        // خلفية متدرجة
        const gradient = ctx.createRadialGradient(
            center, center, 0,
            center, center, radius
        );
        
        gradient.addColorStop(0, this.colors.primaryLight);
        gradient.addColorStop(1, this.colors.primaryDark);
        
        // رسم الخلفية
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // رسم الرمز حسب النوع
        this.drawIconSymbol(ctx, center, size, type);
        
        // إضافة الحدود
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.lineWidth = Math.max(2, size * 0.02);
        ctx.strokeStyle = this.colors.background;
        ctx.stroke();
    }
    
    // ✅ رسم رمز الأيقونة
    drawIconSymbol(ctx, center, size, type) {
        ctx.save();
        ctx.translate(center, center);
        
        // حجم الرمز النسبي
        const iconSize = size * 0.4;
        ctx.lineWidth = Math.max(2, size * 0.03);
        ctx.strokeStyle = this.colors.background;
        ctx.fillStyle = this.colors.background;
        
        switch(type) {
            case 'leaf':
                this.drawLeaf(ctx, iconSize);
                break;
            case 'ai':
                this.drawAI(ctx, iconSize);
                break;
            case 'diagnosis':
                this.drawDiagnosis(ctx, iconSize);
                break;
            case 'soil':
                this.drawSoil(ctx, iconSize);
                break;
            case 'crops':
                this.drawCrops(ctx, iconSize);
                break;
            default:
                this.drawDefault(ctx, iconSize);
        }
        
        ctx.restore();
    }
    
    // ✅ رسم ورقة نبات (نفس الكود السابق مع تحسينات)
    drawLeaf(ctx, size) {
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.4);
        ctx.bezierCurveTo(size * 0.5, -size * 0.6, size * 0.6, size * 0.2, 0, size * 0.4);
        ctx.bezierCurveTo(-size * 0.6, size * 0.2, -size * 0.5, -size * 0.6, 0, -size * 0.4);
        ctx.closePath();
        ctx.fill();
        
        // عروق الورقة
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.3);
        ctx.lineTo(0, size * 0.3);
        ctx.moveTo(-size * 0.2, -size * 0.1);
        ctx.lineTo(size * 0.2, -size * 0.1);
        ctx.moveTo(-size * 0.15, size * 0.1);
        ctx.lineTo(size * 0.15, size * 0.1);
        ctx.stroke();
    }
    
    drawAI(ctx, size) {
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-size * 0.25, 0);
        ctx.bezierCurveTo(-size * 0.35, -size * 0.2, -size * 0.2, -size * 0.35, 0, -size * 0.25);
        ctx.moveTo(size * 0.25, 0);
        ctx.bezierCurveTo(size * 0.35, -size * 0.2, size * 0.2, -size * 0.35, 0, -size * 0.25);
        ctx.moveTo(-size * 0.15, size * 0.1);
        ctx.lineTo(size * 0.15, size * 0.1);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(-size * 0.1, -size * 0.1, size * 0.03, 0, Math.PI * 2);
        ctx.arc(size * 0.1, -size * 0.1, size * 0.03, 0, Math.PI * 2);
        ctx.arc(0, size * 0.05, size * 0.03, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawDiagnosis(ctx, size) {
        ctx.beginPath();
        ctx.arc(0, -size * 0.1, size * 0.25, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-size * 0.15, size * 0.2);
        ctx.lineTo(size * 0.15, size * 0.2);
        ctx.lineTo(size * 0.1, size * 0.35);
        ctx.lineTo(-size * 0.1, size * 0.35);
        ctx.closePath();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.35);
        ctx.lineTo(0, size * 0.2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-size * 0.1, -size * 0.1);
        ctx.lineTo(size * 0.1, -size * 0.1);
        ctx.moveTo(0, -size * 0.2);
        ctx.lineTo(0, 0);
        ctx.stroke();
    }
    
    drawSoil(ctx, size) {
        ctx.beginPath();
        ctx.moveTo(-size * 0.4, -size * 0.1);
        ctx.bezierCurveTo(-size * 0.2, -size * 0.3, size * 0.2, size * 0.1, size * 0.4, -size * 0.05);
        ctx.lineTo(size * 0.4, size * 0.3);
        ctx.lineTo(-size * 0.4, size * 0.3);
        ctx.closePath();
        
        ctx.fillStyle = 'rgba(139, 69, 19, 0.8)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(101, 67, 33, 1)';
        ctx.stroke();
        
        ctx.fillStyle = this.colors.background;
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * size * 0.8 - size * 0.4;
            const y = Math.random() * size * 0.3 - size * 0.05;
            const particleSize = Math.random() * size * 0.05 + size * 0.02;
            
            ctx.beginPath();
            ctx.arc(x, y, particleSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    drawCrops(ctx, size) {
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.35);
        ctx.lineTo(0, size * 0.35);
        ctx.stroke();
        
        const leaves = [
            { angle: -Math.PI/4, size: size * 0.25 },
            { angle: 0, size: size * 0.3 },
            { angle: Math.PI/4, size: size * 0.25 }
        ];
        
        leaves.forEach(leaf => {
            ctx.save();
            ctx.rotate(leaf.angle);
            ctx.beginPath();
            ctx.moveTo(0, -size * 0.2);
            ctx.bezierCurveTo(leaf.size * 0.5, -size * 0.3, leaf.size * 0.6, size * 0.1, 0, size * 0.2);
            ctx.bezierCurveTo(-leaf.size * 0.6, size * 0.1, -leaf.size * 0.5, -size * 0.3, 0, -size * 0.2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });
        
        ctx.beginPath();
        ctx.arc(0, -size * 0.4, size * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
    }
    
    drawDefault(ctx, size) {
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        ctx.stroke();
        
        this.drawLeaf(ctx, size * 0.6);
        
        ctx.beginPath();
        ctx.moveTo(-size * 0.1, size * 0.15);
        ctx.lineTo(0, size * 0.25);
        ctx.lineTo(size * 0.1, size * 0.15);
        ctx.stroke();
    }
    
    // ✅ تخزين الأيقونة في IndexedDB
    async storeIconInDB(name, blob) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('AgricultureAppIcons', 1);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('icons')) {
                    db.createObjectStore('icons', { keyPath: 'name' });
                }
            };
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction('icons', 'readwrite');
                const store = transaction.objectStore('icons');
                
                const iconData = {
                    name: name,
                    blob: blob,
                    created: new Date().toISOString(),
                    size: blob.size,
                    type: blob.type
                };
                
                const putRequest = store.put(iconData);
                
                putRequest.onsuccess = () => {
                    console.log(`✅ تم حفظ ${name} في IndexedDB`);
                    resolve(true);
                };
                
                putRequest.onerror = () => {
                    console.error(`❌ فشل حفظ ${name} في IndexedDB`);
                    reject(new Error(`فشل حفظ ${name}`));
                };
            };
            
            request.onerror = () => {
                reject(new Error('فشل فتح قاعدة البيانات'));
            };
        });
    }
    
    // ✅ جلب أيقونة من IndexedDB
    async getIconFromDB(name) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('AgricultureAppIcons', 1);
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction('icons', 'readonly');
                const store = transaction.objectStore('icons');
                const getRequest = store.get(name);
                
                getRequest.onsuccess = () => {
                    if (getRequest.result) {
                        resolve(getRequest.result.blob);
                    } else {
                        resolve(null);
                    }
                };
                
                getRequest.onerror = () => {
                    reject(new Error(`فشل جلب ${name}`));
                };
            };
            
            request.onerror = () => {
                reject(new Error('فشل فتح قاعدة البيانات'));
            };
        });
    }
    
    // ✅ إنشاء أيقونة Favicon ديناميكية
    createDynamicFavicon() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        this.drawIcon(ctx, 32, 'leaf');
        
        // تحويل إلى URL واستخدامه كـ favicon
        const faviconUrl = canvas.toDataURL('image/png');
        const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
        favicon.type = 'image/x-icon';
        favicon.rel = 'shortcut icon';
        favicon.href = faviconUrl;
        document.head.appendChild(favicon);
        
        console.log('✅ تم إنشاء favicon ديناميكي');
    }
    
    // ✅ تحديث رابط الأيقونة في الصفحة
    updateIconLink(iconName, dataUrl) {
        const iconPath = `assets/icons/${iconName}`;
        
        // تحديث أي عناصر تستخدم هذه الأيقونة
        document.querySelectorAll(`[href*="${iconPath}"], [src*="${iconPath}"]`).forEach(el => {
            if (el.tagName === 'LINK') {
                // حفظ في localStorage لاستخدامها في المستقبل
                localStorage.setItem(`dynamic_icon_${iconName}`, dataUrl);
            } else if (el.tagName === 'IMG') {
                el.src = dataUrl;
            }
        });
    }
    
    // ✅ تنفيذ العملية الكاملة
    async generateAllIconsAuto() {
        console.log('🎨 بدء إنشاء الأيقونات الديناميكية...');
        
        try {
            // 1. التحقق من الأيقونات المفقودة
            const missingIcons = await this.checkIconsExist();
            
            if (missingIcons.length === 0) {
                console.log('✅ جميع الأيقونات موجودة بالفعل');
                return true;
            }
            
            console.log(`📦 الأيقونات المطلوبة: ${missingIcons.length} أيقونة`);
            
            // 2. إنشاء كل أيقونة مفقودة
            for (const icon of missingIcons) {
                console.log(`⚡ جاري إنشاء ${icon.name}...`);
                await this.generateAndStoreIcon(icon);
                
                // إذا كانت أيقونة Favicon، أنشئها مباشرة
                if (icon.name === 'favicon.ico' || icon.name === 'icon-192.png') {
                    const canvas = document.createElement('canvas');
                    canvas.width = icon.size;
                    canvas.height = icon.size;
                    const ctx = canvas.getContext('2d');
                    this.drawIcon(ctx, icon.size, icon.type);
                    
                    const dataUrl = canvas.toDataURL('image/png');
                    
                    // تحديث Favicon مباشرة
                    if (icon.name === 'favicon.ico') {
                        this.createDynamicFavicon();
                    }
                    
                    // تحديث أيقونة PWA الرئيسية
                    if (icon.name === 'icon-192.png') {
                        document.querySelectorAll('link[rel="apple-touch-icon"], link[rel="icon"]')
                            .forEach(link => {
                                if (link.sizes && link.sizes.value === '192x192') {
                                    const newLink = link.cloneNode();
                                    newLink.href = dataUrl;
                                    link.parentNode.replaceChild(newLink, link);
                                }
                            });
                    }
                }
            }
            
            console.log('🎉 تم إنشاء جميع الأيقونات بنجاح!');
            
            // 3. إعادة تحميل manifest إذا تم التحديث
            const manifestLink = document.querySelector('link[rel="manifest"]');
            if (manifestLink) {
                const manifestUrl = manifestLink.href;
                manifestLink.href = '';
                setTimeout(() => {
                    manifestLink.href = manifestUrl;
                    console.log('🔄 تم تحديث manifest');
                }, 100);
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ فشل إنشاء الأيقونات:', error);
            return false;
        }
    }
    
    // ✅ بدء التشغيل التلقائي
    async init() {
        // الانتظار حتى يصبح التطبيق جاهزاً
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        // الانتظار 2 ثانية لضمان تحميل الصفحة
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // تشغيل مولد الأيقونات
        return await this.generateAllIconsAuto();
    }
}

// ====== الاستخدام التلقائي ======
// يتم تشغيله تلقائياً عند تحميل التطبيق

// إنشاء كائن المولد
const iconGenerator = new AutoIconGenerator();

// بدء التشغيل (مع تأخير لتجناب إبطاء تحميل الصفحة)
setTimeout(async () => {
    const success = await iconGenerator.init();
    
    if (success) {
        console.log('🚀 مولد الأيقونات اكتمل بنجاح');
        
        // إرسال إشعار إلى Service Worker
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'icons_generated',
                timestamp: new Date().toISOString()
            });
        }
        
        // تحديث الصفحة إذا كانت أيقونات جديدة
        if (performance.getEntriesByType('navigation')[0].type === 'reload') {
            // إعادة تحميل إذا كانت أيقونات جديدة
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }
}, 3000);

// ✅ تصدير للاستخدام في ملفات أخرى
window.AgricultureIconGenerator = iconGenerator;