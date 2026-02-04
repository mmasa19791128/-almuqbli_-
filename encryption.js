// ====== نظام التشفير المتقدم للتطبيق الزراعي ======
// 🔐 الإصدار 3.0 | يناير 2026

class AdvancedEncryption {
    constructor() {
        // 🔒 توليد سر فريد لكل مستخدم
        this.userSecret = this.generateUniqueSecret();
        
        // 🔑 مفاتيح API المشفرة (يتم فكها عند التشغيل)
        this.encryptedKeys = {
            google_ai: "R01PR0dMRV9BSSUzQTB4MTIzNDU2Nzg5MGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVoxMjM0NTY3ODkw",
            deepseek_ai: "REVFUFNFRUtfQUklM0EweDEyMzQ1Njc4OTBhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMTIzNDU2Nzg5MA=="
        };
        
        // 📊 سجل التشفير
        this.encryptionLog = [];
        
        console.log("🔐 نظام التشفير المتقدم جاهز");
        this.initialize();
    }
    
    // 🔧 التهيئة
    initialize() {
        // تحميل سجل التشفير من التخزين
        this.loadEncryptionLog();
        
        // اختبار النظام
        this.testEncryptionSystem();
        
        // تسجيل عملية التهيئة
        this.logEncryption("SYSTEM_INIT", "تم تهيئة نظام التشفير");
    }
    
    // 🎯 توليد سر فريد للمستخدم
    generateUniqueSecret() {
        // دمج معلومات الجهاز لإنشاء سر فريد
        const deviceFingerprint = [
            navigator.userAgent.substring(0, 30),
            navigator.hardwareConcurrency || "2",
            navigator.deviceMemory || "4",
            screen.width + "x" + screen.height,
            new Date().getTimezoneOffset()
        ].join("|");
        
        // تحويل إلى هاش آمن
        let hash = 5381;
        for (let i = 0; i < deviceFingerprint.length; i++) {
            hash = (hash * 33) ^ deviceFingerprint.charCodeAt(i);
        }
        
        // إضافة معرف فريد للبرنامج
        const uniqueSeed = (hash >>> 0).toString(36) + "_AGRICULTURE_2026";
        
        return "FARM_SECURE_" + btoa(uniqueSeed).substring(0, 32);
    }
    
    // 🔐 التشفير المتقدم (مستوى 1 - للبيانات العادية)
    encryptLevel1(data) {
        if (!data || typeof data !== 'string') return "";
        
        try {
            // 1. إضافة الملح (salt)
            const salt = Date.now().toString(36);
            const saltedData = salt + "::" + data + "::" + this.userSecret.substring(0, 8);
            
            // 2. قلب النص
            const reversedData = saltedData.split('').reverse().join('');
            
            // 3. تحويل لـ Base64
            const base64Encoded = btoa(encodeURIComponent(reversedData));
            
            // 4. إضافة التوقيع
            const signature = this.generateSignature(base64Encoded);
            const finalEncrypted = signature + ":" + base64Encoded + ":" + salt;
            
            this.logEncryption("ENCRYPT_L1", `تم تشفير ${data.length} حرف`);
            return finalEncrypted;
            
        } catch (error) {
            console.error("❌ خطأ في التشفير المستوى 1:", error);
            return "";
        }
    }
    
    // 🔓 فك التشفير (مستوى 1)
    decryptLevel1(encryptedData) {
        if (!encryptedData || typeof encryptedData !== 'string') return "";
        
        try {
            // 1. فصل الأجزاء
            const parts = encryptedData.split(':');
            if (parts.length < 3) {
                throw new Error("بيانات مشفرة غير صالحة");
            }
            
            const signature = parts[0];
            const base64Data = parts[1];
            const salt = parts[2];
            
            // 2. التحقق من التوقيع
            const expectedSignature = this.generateSignature(base64Data);
            if (signature !== expectedSignature) {
                throw new Error("التوقيع غير صالح");
            }
            
            // 3. فك Base64
            const decodedData = decodeURIComponent(atob(base64Data));
            
            // 4. إعادة النص الأصلي
            const originalReversed = decodedData.split('').reverse().join('');
            
            // 5. إزالة الملح والسر
            const partsWithoutSalt = originalReversed.split('::');
            if (partsWithoutSalt.length < 3) {
                throw new Error("بيانات مشفرة تالفة");
            }
            
            // استخراج البيانات الأصلية (الجزء الأوسط)
            const finalData = partsWithoutSalt[1];
            
            this.logEncryption("DECRYPT_L1", `تم فك تشفير ${finalData.length} حرف`);
            return finalData;
            
        } catch (error) {
            console.error("❌ خطأ في فك التشفير المستوى 1:", error);
            return "";
        }
    }
    
    // 🔐🔐 التشفير القوي (مستوى 2 - لبيانات حساسة)
    encryptLevel2(data) {
        if (!data || typeof data !== 'string') return "";
        
        try {
            // 1. إنشاء مفتاح تشفير عشوائي
            const encryptionKey = this.generateRandomKey();
            
            // 2. تشفير XOR مع المفتاح
            let encrypted = "";
            for (let i = 0; i < data.length; i++) {
                const charCode = data.charCodeAt(i);
                const keyChar = encryptionKey.charCodeAt(i % encryptionKey.length);
                const encryptedChar = charCode ^ keyChar;
                encrypted += String.fromCharCode(encryptedChar);
            }
            
            // 3. تشفير المفتاح
            const encryptedKey = this.encryptLevel1(encryptionKey);
            
            // 4. تحويل لـ Base64
            const base64Encrypted = btoa(encodeURIComponent(encrypted));
            
            // 5. إضافة رأس التشفير
            const header = "ENC2_" + Date.now().toString(36);
            const finalEncrypted = header + "|" + encryptedKey + "|" + base64Encrypted;
            
            this.logEncryption("ENCRYPT_L2", `تم تشفير بيانات حساسة (${data.length} حرف)`);
            return finalEncrypted;
            
        } catch (error) {
            console.error("❌ خطأ في التشفير المستوى 2:", error);
            return this.encryptLevel1(data); // التراجع للمستوى 1
        }
    }
    
    // 🔓🔓 فك التشفير القوي (مستوى 2)
    decryptLevel2(encryptedData) {
        if (!encryptedData || typeof encryptedData !== 'string') return "";
        
        try {
            // 1. فصل الأجزاء
            const parts = encryptedData.split('|');
            if (parts.length < 3 || !parts[0].startsWith("ENC2_")) {
                throw new Error("بيانات مشفرة غير صالحة للمستوى 2");
            }
            
            const encryptedKey = parts[1];
            const base64Data = parts[2];
            
            // 2. فك تشفير المفتاح
            const encryptionKey = this.decryptLevel1(encryptedKey);
            if (!encryptionKey) {
                throw new Error("فشل فك تشفير المفتاح");
            }
            
            // 3. فك Base64
            const encodedData = decodeURIComponent(atob(base64Data));
            
            // 4. فك تشفير XOR مع المفتاح
            let decrypted = "";
            for (let i = 0; i < encodedData.length; i++) {
                const charCode = encodedData.charCodeAt(i);
                const keyChar = encryptionKey.charCodeAt(i % encryptionKey.length);
                const decryptedChar = charCode ^ keyChar;
                decrypted += String.fromCharCode(decryptedChar);
            }
            
            this.logEncryption("DECRYPT_L2", `تم فك تشفير بيانات حساسة (${decrypted.length} حرف)`);
            return decrypted;
            
        } catch (error) {
            console.error("❌ خطأ في فك التشفير المستوى 2:", error);
            return this.decryptLevel1(encryptedData); // المحاولة بالمستوى 1
        }
    }
    
    // 🔑 فك مفاتيح API المشفرة
    getAPIKey(provider) {
        try {
            const encryptedKey = this.encryptedKeys[provider];
            if (!encryptedKey) {
                console.warn(`⚠️ مفتاح ${provider} غير موجود`);
                return "";
            }
            
            // فك التشفير من Base64
            const decoded = decodeURIComponent(atob(encryptedKey));
            
            // استخراج المفتاح الحقيقي (بعد : )
            const parts = decoded.split(":");
            if (parts.length > 1) {
                const apiKey = parts[1];
                
                this.logEncryption("API_KEY_ACCESS", `تم فك مفتاح ${provider.substring(0, 3)}***`);
                return apiKey;
            }
            
            return decoded;
            
        } catch (error) {
            console.error(`❌ فشل فك مفتاح ${provider}:`, error);
            return "";
        }
    }
    
    // 📊 الحصول على جميع المفاتيح
    getAllAPIKeys() {
        const keys = {};
        
        for (const [provider, encrypted] of Object.entries(this.encryptedKeys)) {
            try {
                const decrypted = this.getAPIKey(provider);
                if (decrypted) {
                    keys[provider] = {
                        available: true,
                        preview: decrypted.substring(0, 4) + "..." + decrypted.substring(decrypted.length - 4),
                        length: decrypted.length
                    };
                } else {
                    keys[provider] = { available: false };
                }
            } catch (error) {
                keys[provider] = { available: false, error: error.message };
            }
        }
        
        return keys;
    }
    
    // 💾 حفظ مفتاح يدوي (للمستخدم)
    saveUserKey(key, type = 'custom', level = 'L2') {
        if (!key || key.trim() === "") {
            console.error("❌ المفتاح فارغ");
            return false;
        }
        
        try {
            let encrypted;
            
            // اختيار مستوى التشفير حسب نوع المفتاح
            if (type.includes('google') || type.includes('gemini')) {
                encrypted = this.encryptLevel2(key); // Google AI - تشفير قوي
            } else if (type.includes('deepseek') || type.includes('openai')) {
                encrypted = this.encryptLevel2(key); // DeepSeek - تشفير قوي
            } else if (level === 'L2') {
                encrypted = this.encryptLevel2(key); // بيانات حساسة
            } else {
                encrypted = this.encryptLevel1(key); // بيانات عادية
            }
            
            // حفظ في localStorage
            localStorage.setItem(`encrypted_${type}_key`, encrypted);
            localStorage.setItem(`key_${type}_date`, new Date().toISOString());
            localStorage.setItem(`key_${type}_level`, level);
            
            // تسجيل العملية
            this.logEncryption("SAVE_USER_KEY", `تم حفظ مفتاح ${type} (مستوى ${level})`);
            
            console.log(`✅ تم حفظ مفتاح ${type} مشفر`);
            return true;
            
        } catch (error) {
            console.error(`❌ فشل حفظ مفتاح ${type}:`, error);
            return false;
        }
    }
    
    // 📂 استرجاع مفتاح المستخدم
    getUserKey(type = 'custom') {
        try {
            const encrypted = localStorage.getItem(`encrypted_${type}_key`);
            const level = localStorage.getItem(`key_${type}_level`) || 'L1';
            
            if (!encrypted) return "";
            
            let decrypted;
            if (level === 'L2') {
                decrypted = this.decryptLevel2(encrypted);
            } else {
                decrypted = this.decryptLevel1(encrypted);
            }
            
            this.logEncryption("GET_USER_KEY", `تم استرجاع مفتاح ${type}`);
            return decrypted;
            
        } catch (error) {
            console.error(`❌ فشل استرجاع مفتاح ${type}:`, error);
            return "";
        }
    }
    
    // 🗑️ حذف مفتاح المستخدم
    deleteUserKey(type = 'custom') {
        try {
            localStorage.removeItem(`encrypted_${type}_key`);
            localStorage.removeItem(`key_${type}_date`);
            localStorage.removeItem(`key_${type}_level`);
            
            this.logEncryption("DELETE_USER_KEY", `تم حذف مفتاح ${type}`);
            console.log(`🗑️ تم حذف مفتاح ${type}`);
            return true;
            
        } catch (error) {
            console.error(`❌ فشل حذف مفتاح ${type}:`, error);
            return false;
        }
    }
    
    // 📝 تسجيل عمليات التشفير
    logEncryption(operation, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            operation: operation,
            details: details,
            userSecretPreview: this.userSecret.substring(0, 8) + "..."
        };
        
        this.encryptionLog.push(logEntry);
        
        // حفظ آخر 50 عملية فقط
        if (this.encryptionLog.length > 50) {
            this.encryptionLog = this.encryptionLog.slice(-50);
        }
        
        // حفظ في localStorage
        this.saveEncryptionLog();
    }
    
    // 💾 حفظ سجل التشفير
    saveEncryptionLog() {
        try {
            const logToSave = JSON.stringify(this.encryptionLog);
            localStorage.setItem('encryption_log', logToSave);
        } catch (error) {
            console.warn("⚠️ فشل حفظ سجل التشفير:", error);
        }
    }
    
    // 📂 تحميل سجل التشفير
    loadEncryptionLog() {
        try {
            const savedLog = localStorage.getItem('encryption_log');
            if (savedLog) {
                this.encryptionLog = JSON.parse(savedLog);
            }
        } catch (error) {
            console.warn("⚠️ فشل تحميل سجل التشفير:", error);
            this.encryptionLog = [];
        }
    }
    
    // 🧪 اختبار نظام التشفير
    testEncryptionSystem() {
        console.log("🧪 اختبار نظام التشفير...");
        
        const testData = "اختبار نظام التشفير الزراعي 2026";
        
        // اختبار المستوى 1
        const encryptedL1 = this.encryptLevel1(testData);
        const decryptedL1 = this.decryptLevel1(encryptedL1);
        
        // اختبار المستوى 2
        const encryptedL2 = this.encryptLevel2(testData);
        const decryptedL2 = this.decryptLevel2(encryptedL2);
        
        // اختبار المفاتيح
        const apiKeys = this.getAllAPIKeys();
        
        const testResults = {
            level1: decryptedL1 === testData ? "✅" : "❌",
            level2: decryptedL2 === testData ? "✅" : "❌",
            google_ai: apiKeys.google_ai?.available ? "✅" : "❌",
            deepseek_ai: apiKeys.deepseek_ai?.available ? "✅" : "❌",
            userSecret: this.userSecret ? "✅" : "❌"
        };
        
        console.log("📊 نتائج اختبار التشفير:", testResults);
        
        if (testResults.level1 === "✅" && testResults.level2 === "✅") {
            console.log("🎉 نظام التشفير يعمل بشكل صحيح!");
        } else {
            console.warn("⚠️ هناك مشاكل في نظام التشفير");
        }
    }
    
    // 🛠️ أدوات مساعدة
    generateSignature(data) {
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = ((hash << 5) - hash) + data.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36).substring(0, 12).toUpperCase();
    }
    
    generateRandomKey() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let key = "";
        for (let i = 0; i < 32; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key + Date.now().toString(36);
    }
    
    // 📊 معلومات النظام
    getSystemInfo() {
        return {
            version: "3.0",
            developer: "محمد مقبل عبدالله سيف",
            year: 2026,
            userSecretExists: !!this.userSecret,
            encryptionLogSize: this.encryptionLog.length,
            hasGoogleKey: !!this.getAPIKey('google_ai'),
            hasDeepSeekKey: !!this.getAPIKey('deepseek_ai'),
            lastOperation: this.encryptionLog[this.encryptionLog.length - 1] || null
        };
    }
    
    // 🔧 إعادة تعيين النظام (بحذر)
    resetSystem() {
        if (confirm("⚠️ هل تريد إعادة تعيين نظام التشفير؟\nسيتم حذف جميع المفاتيح المحفوظة!")) {
            try {
                // حذف جميع المفاتيح المحفوظة
                const keysToDelete = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.includes('encrypted_') || key.includes('key_')) {
                        keysToDelete.push(key);
                    }
                }
                
                keysToDelete.forEach(key => localStorage.removeItem(key));
                
                // إعادة تعيين السجل
                this.encryptionLog = [];
                localStorage.removeItem('encryption_log');
                
                // إعادة توليد السر
                this.userSecret = this.generateUniqueSecret();
                
                this.logEncryption("SYSTEM_RESET", "تم إعادة تعيين النظام");
                
                console.log("🔄 تم إعادة تعيين نظام التشفير");
                alert("✅ تم إعادة تعيين نظام التشفير بنجاح");
                
                return true;
                
            } catch (error) {
                console.error("❌ فشل إعادة تعيين النظام:", error);
                return false;
            }
        }
        return false;
    }
}

// ====== إنشاء النسخة العالمية ======
let encryptionInstance = null;

function initializeEncryption() {
    if (!encryptionInstance) {
        encryptionInstance = new AdvancedEncryption();
    }
    return encryptionInstance;
}

// ====== واجهة مبسطة للاستخدام ======
window.FarmCrypto = {
    // 🔐 التشفير الأساسي
    encrypt: function(text) {
        const instance = initializeEncryption();
        return instance.encryptLevel1(text);
    },
    
    decrypt: function(encrypted) {
        const instance = initializeEncryption();
        return instance.decryptLevel1(encrypted);
    },
    
    // 🔐🔐 التشفير المتقدم
    encryptSecure: function(text) {
        const instance = initializeEncryption();
        return instance.encryptLevel2(text);
    },
    
    decryptSecure: function(encrypted) {
        const instance = initializeEncryption();
        return instance.decryptLevel2(encrypted);
    },
    
    // 🔑 إدارة المفاتيح
    saveKey: function(key, type) {
        const instance = initializeEncryption();
        return instance.saveUserKey(key, type);
    },
    
    getKey: function(type) {
        const instance = initializeEncryption();
        return instance.getUserKey(type);
    },
    
    deleteKey: function(type) {
        const instance = initializeEncryption();
        return instance.deleteUserKey(type);
    },
    
    hasKey: function(type = 'custom') {
        const instance = initializeEncryption();
        return !!instance.getUserKey(type);
    },
    
    // 📊 معلومات النظام
    getAPIKeys: function() {
        const instance = initializeEncryption();
        return instance.getAllAPIKeys();
    },
    
    getSystemInfo: function() {
        const instance = initializeEncryption();
        return instance.getSystemInfo();
    },
    
    // 🔧 التحكم
    reset: function() {
        const instance = initializeEncryption();
        return instance.resetSystem();
    },
    
    test: function() {
        const instance = initializeEncryption();
        return instance.testEncryptionSystem();
    }
};

// ====== التهيئة التلقائية ======
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 جاري تهيئة نظام التشفير...");
    
    setTimeout(() => {
        const crypto = initializeEncryption();
        const info = crypto.getSystemInfo();
        
        console.log(`
🔐 **نظام التشفير الزراعي - الإصدار ${info.version}**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👨‍💻 المبرمج: ${info.developer}
📅 السنة: ${info.year}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔑 مفاتيح API:
• Google AI: ${info.hasGoogleKey ? '✅ متاح' : '❌ غير متاح'}
• DeepSeek AI: ${info.hasDeepSeekKey ? '✅ متاح' : '❌ غير متاح'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 استخدم: FarmCrypto.encrypt("نصك")
        `);
        
        // تسجيل تهيئة النظام
        crypto.logEncryption("APP_START", "تم بدء التطبيق");
        
    }, 1500);
});

// ====== إضافة واجهة خاصة للمطور ======
if (typeof window.mainBridge !== 'undefined' && window.mainBridge.showDeveloperDashboard) {
    // إضافة أدوات التشفير للوحة المطور
    window.mainBridge.cryptoTools = {
        encryptText: function(text) {
            return window.FarmCrypto.encrypt(text);
        },
        
        decryptText: function(encrypted) {
            return window.FarmCrypto.decrypt(encrypted);
        },
        
        viewKeys: function() {
            return window.FarmCrypto.getAPIKeys();
        },
        
        getSystemInfo: function() {
            return window.FarmCrypto.getSystemInfo();
        },
        
        saveCustomKey: function() {
            const key = prompt("🔑 أدخل المفتاح الحقيقي:");
            const type = prompt("📝 نوع المفتاح (google_ai, deepseek_ai, custom):", "custom");
            
            if (key && type) {
                const saved = window.FarmCrypto.saveKey(key, type);
                alert(saved ? "✅ تم حفظ المفتاح" : "❌ فشل حفظ المفتاح");
                return saved;
            }
            return false;
        }
    };
    
    console.log("🔧 أدوات التشفير مضافة للوحة المطور");
}

// ====== رسالة المطور ======
console.log(`
🌱 **مرحباً بك في نظام التشفير الزراعي**
تم التطوير بواسطة: محمد مقبل عبدالله سيف
الإصدار: 3.0 | يناير 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
جميع الحقوق محفوظة © 2026
`);