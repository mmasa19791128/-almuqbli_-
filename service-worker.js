// ====== Service Worker للتطبيق الزراعي ======
// 🛠️ الإصدار 5.0 | يعمل 100% Online & Offline
// ⚡ متكامل مع النظام عبر الإنترنت

const CACHE_NAME = 'agriculture-app-v7-online';
const APP_VERSION = '7.0.0';
const ONLINE_CACHE_NAME = 'online-cache-v1';

// ⭐ جميع الأصول عبر الإنترنت التي سيتم تخزينها للعمل Offline
const ONLINE_ASSETS = [
  // ====== الأيقونات عبر الإنترنت ======
  'https://img.icons8.com/color/72/leaf--v1.png',
  'https://img.icons8.com/color/96/leaf--v1.png',
  'https://img.icons8.com/color/128/leaf--v1.png',
  'https://img.icons8.com/color/144/leaf--v1.png',
  'https://img.icons8.com/color/152/leaf--v1.png',
  'https://img.icons8.com/color/192/leaf--v1.png',
  'https://img.icons8.com/color/384/leaf--v1.png',
  'https://img.icons8.com/color/512/leaf--v1.png',
  'https://img.icons8.com/color/180/leaf--v1.png',
  
  // أيقونات الاختصارات
  'https://img.icons8.com/color/96/stethoscope.png',
  'https://img.icons8.com/color/96/test-tube.png',
  'https://img.icons8.com/color/96/leaf--v1.png',
  
  // ====== الخطوط والأيقونات ======
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap&subset=arabic',
  
  // ====== صور المحاصيل الأساسية ======
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&fit=crop&auto=format', // طماطم
  'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&fit=crop&auto=format', // بطاطس
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&fit=crop&auto=format', // قمح
  'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&fit=crop&auto=format', // ذرة
  'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=200&fit=crop&auto=format', // عنب
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&fit=crop&auto=format', // أرز
  
  // ====== لقطة الشاشة ======
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=720&h=1280&fit=crop&auto=format',
];

// الملفات المحلية للتخزين المسبق
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  
  // CSS
  './css/main.css',
  './css/variables.css',
  './css/mobile.css',
  
  // JavaScript الأساسية
  './js/main.js',
  './js/i18n.js',
  './js/core/app.js',
  './js/core/pwa.js',
  './js/data/global.js',
  './js/data/crops.js',
  './js/data/diseases.js',
  './assets/assets-manager.js',
  
  // نظام الأصول عبر الإنترنت
  './assets/assets-manager.js',
];

// === تثبيت Service Worker ===
self.addEventListener('install', event => {
  console.log('🚀 تثبيت Service Worker - الإصدار 7.0 (Online+Offline)');
  
  event.waitUntil(
    Promise.all([
      // 1. تخزين الملفات المحلية
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('📦 جاري تخزين الملفات المحلية...');
          return cache.addAll(PRECACHE_ASSETS)
            .then(() => {
              console.log(`✅ تم تخزين ${PRECACHE_ASSETS.length} ملف محلي`);
            });
        }),
      
      // 2. تخزين الأصول عبر الإنترنت
      caches.open(ONLINE_CACHE_NAME)
        .then(cache => {
          console.log('🌐 جاري تخزين الأصول عبر الإنترنت...');
          // استخدام cache.addAll مع معالجة الأخطاء
          const cachePromises = ONLINE_ASSETS.map(url => {
            return cache.add(url).catch(error => {
              console.warn(`⚠️ فشل تخزين: ${url}`, error);
            });
          });
          
          return Promise.all(cachePromises)
            .then(() => {
              console.log(`✅ تم تخزين ${ONLINE_ASSETS.length} أصل عبر الإنترنت`);
            });
        })
    ])
    .then(() => {
      console.log('🎉 جميع عمليات التخزين اكتملت');
      console.log(`📊 الإحصائيات: ${PRECACHE_ASSETS.length + ONLINE_ASSETS.length} أصل مخزن`);
      return self.skipWaiting();
    })
    .catch(error => {
      console.error('❌ فشل التثبيت:', error);
    })
  );
});

// === تفعيل Service Worker ===
self.addEventListener('activate', event => {
  console.log('⚡ Service Worker مفعل - التحكم في جميع العملاء');
  
  event.waitUntil(
    Promise.all([
      // تنظيف caches القديمة
      caches.keys()
        .then(cacheNames => {
          const deletions = cacheNames.map(cacheName => {
            // حذف جميع caches القديمة
            if (cacheName !== CACHE_NAME && cacheName !== ONLINE_CACHE_NAME) {
              console.log(`🗑️ حذف cache قديم: ${cacheName}`);
              return caches.delete(cacheName);
            }
          });
          return Promise.all(deletions);
        })
        .then(() => {
          console.log('✅ تم تنظيف التخزين القديم');
        }),
      
      // التحكم في جميع العملاء
      self.clients.claim()
    ])
    .then(() => {
      console.log('🌱 Service Worker جاهز للعمل Online و Offline');
      
      // إرسال إشعار للعملاء
      sendMessageToAllClients({
        type: 'service_worker_ready',
        version: APP_VERSION,
        offlineSupport: true,
        onlineAssets: ONLINE_ASSETS.length,
        timestamp: new Date().toISOString()
      });
    })
  );
});

// === اعتراض الطلبات ===
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // تجاهل طلبات POST وغير GET
  if (request.method !== 'GET') return;
  
  // استراتيجية Cache First مع تحديث في الخلفية
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // 1. محاولة الحصول من cache أولاً
        if (cachedResponse) {
          // تحديث cache في الخلفية
          event.waitUntil(
            updateCacheInBackground(request)
          );
          return cachedResponse;
        }
        
        // 2. إذا لم يكن في cache، حمله من الشبكة
        return fetch(request)
          .then(networkResponse => {
            // 3. تخزين في cache إذا كان ناجحاً وقابلاً للتخزين
            if (isCacheable(request, networkResponse)) {
              cacheResponse(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(error => {
            console.log('🌐 فشل التحميل من الشبكة:', url.pathname);
            
            // 4. البحث عن بديل مناسب
            return findSuitableFallback(request, url);
          });
      })
  );
});

// === تحديث cache في الخلفية ===
function updateCacheInBackground(request) {
  return fetch(request)
    .then(response => {
      if (isCacheable(request, response)) {
        return cacheResponse(request, response);
      }
    })
    .catch(() => {
      // تجاهل الأخطاء في التحديث الخلفي
    });
}

// === البحث عن بديل مناسب ===
function findSuitableFallback(request, url) {
  // أولاً: البحث في cache
  return caches.match(request)
    .then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      
      // ثانياً: البحث عن بديل عبر الإنترنت مخزن
      return findOnlineAssetFallback(url);
    })
    .then(fallbackResponse => {
      if (fallbackResponse) return fallbackResponse;
      
      // ثالثاً: إرجاع رد افتراضي
      return createOfflineResponse(request, url);
    });
}

// === البحث عن أصول عبر الإنترنت مخزنة ===
function findOnlineAssetFallback(url) {
  const urlString = url.toString();
  
  // البحث في cache عبر الإنترنت
  return caches.open(ONLINE_CACHE_NAME)
    .then(cache => cache.keys())
    .then(keys => {
      // البحث عن أقرب تطابق
      for (const key of keys) {
        const keyUrl = key.url;
        
        // إذا كان نفس الرابط
        if (keyUrl === urlString) {
          return caches.match(key);
        }
        
        // إذا كان من Icons8
        if (urlString.includes('icons8.com') && keyUrl.includes('icons8.com')) {
          // محاولة إيجاد أي أيقونة كبديل
          return caches.match('https://img.icons8.com/color/96/leaf--v1.png');
        }
        
        // إذا كان من Unsplash
        if (urlString.includes('unsplash.com') && keyUrl.includes('unsplash.com')) {
          // محاولة إيجاد أي صورة زراعية كبديل
          return caches.match('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&fit=crop');
        }
      }
      
      return null;
    });
}

// === إنشاء رد وضع عدم الاتصال ===
function createOfflineResponse(request, url) {
  const acceptHeader = request.headers.get('Accept') || '';
  
  // للصور
  if (acceptHeader.includes('image') || url.pathname.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
    return createImageFallback();
  }
  
  // للـ CSS
  if (acceptHeader.includes('text/css') || url.pathname.match(/\.css$/i)) {
    return new Response('/* CSS بديل - وضع عدم الاتصال */', {
      headers: { 'Content-Type': 'text/css' }
    });
  }
  
  // للـ JavaScript
  if (acceptHeader.includes('application/javascript') || url.pathname.match(/\.js$/i)) {
    return new Response('// JavaScript بديل - وضع عدم الاتصال', {
      headers: { 'Content-Type': 'application/javascript' }
    });
  }
  
  // للصفحات HTML
  if (acceptHeader.includes('text/html')) {
    return createOfflineHTMLPage();
  }
  
  // رد افتراضي
  return new Response('⚠️ وضع عدم الاتصال - المحتوى غير متوفر حالياً', {
    headers: { 'Content-Type': 'text/plain' }
  });
}

// === إنشاء صورة بديلة ===
function createImageFallback() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#E8F5E9"/>
      <circle cx="100" cy="100" r="60" fill="#C8E6C9"/>
      <path d="M100 40 L120 100 L180 100 L130 140 L150 200 L100 160 L50 200 L70 140 L20 100 L80 100 Z" 
            fill="#4CAF50"/>
      <text x="100" y="190" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">
        غير متصل
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' }
  });
}

// === إنشاء صفحة HTML للوضع عدم الاتصال ===
function createOfflineHTMLPage() {
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>غير متصل - المرشد الزراعي</title>
        <style>
            body {
                font-family: 'Tajawal', sans-serif;
                background: linear-gradient(135deg, #4CAF50, #2E7D32);
                color: white;
                text-align: center;
                padding: 50px 20px;
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .offline-container {
                background: rgba(0,0,0,0.7);
                padding: 40px;
                border-radius: 20px;
                max-width: 500px;
                margin: 0 auto;
            }
            h1 { color: #FFD700; margin-bottom: 20px; }
            .icon { font-size: 80px; margin-bottom: 20px; color: #FFD700; }
            .features { text-align: right; margin-top: 20px; }
            .feature { margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="offline-container">
            <div class="icon">📶</div>
            <h1>أنت غير متصل بالإنترنت</h1>
            <p>لا تقلق! يمكنك الاستمرار في استخدام:</p>
            <div class="features">
                <div class="feature">✅ المكتبة المحلية للمحاصيل</div>
                <div class="feature">✅ نظام النقاط والمكافآت</div>
                <div class="feature">✅ الإعدادات والتقويم الزراعي</div>
                <div class="feature">✅ معظم الميزات الأساسية</div>
            </div>
            <p style="margin-top: 20px; font-size: 14px; color: #FFD700;">
                بعض الميزات تحتاج إلى اتصال بالإنترنت
            </p>
        </div>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: { 
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}

// === التحقق مما إذا كان الملف قابلاً للتخزين ===
function isCacheable(request, response) {
  if (!response || response.status !== 200) return false;
  
  // لا تخزن ملفات كبيرة جداً
  const contentLength = response.headers.get('Content-Length');
  if (contentLength && parseInt(contentLength) > 5242880) { // 5MB
    return false;
  }
  
  const url = new URL(request.url);
  
  // أنواع الملفات القابلة للتخزين
  const contentType = response.headers.get('content-type') || '';
  const cacheableTypes = [
    'text/html',
    'text/css',
    'application/javascript',
    'application/json',
    'image/',
    'font/',
    'manifest+json'
  ];
  
  return cacheableTypes.some(type => contentType.includes(type));
}

// === تخزين الاستجابة في cache ===
function cacheResponse(request, response) {
  const cacheName = request.url.includes('icons8.com') || 
                    request.url.includes('unsplash.com') ||
                    request.url.includes('fonts.googleapis.com') ||
                    request.url.includes('cdnjs.cloudflare.com')
                    ? ONLINE_CACHE_NAME : CACHE_NAME;
  
  return caches.open(cacheName)
    .then(cache => cache.put(request, response))
    .catch(error => {
      console.warn('⚠️ فشل التخزين في cache:', error);
    });
}

// === إرسال رسالة لجميع العملاء ===
function sendMessageToAllClients(message) {
  self.clients.matchAll()
    .then(clients => {
      clients.forEach(client => {
        try {
          client.postMessage(message);
        } catch (error) {
          console.warn('⚠️ فشل إرسال الرسالة للعميل:', error);
        }
      });
    });
}

// === رسالة بدء التشغيل ===
console.log(`
🌱 **Service Worker للتطبيق الزراعي**
🛠️ الإصدار: ${APP_VERSION}
📦 Local Cache: ${CACHE_NAME}
🌐 Online Cache: ${ONLINE_CACHE_NAME}
✅ جاهز للعمل بدون اتصال
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 إحصائيات التخزين:
• الملفات المحلية: ${PRECACHE_ASSETS.length} ملف
• الأصول عبر الإنترنت: ${ONLINE_ASSETS.length} أصل
• الإجمالي: ${PRECACHE_ASSETS.length + ONLINE_ASSETS.length} أصل مخزن
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 الميزات المتوفرة:
1. تخزين الأيقونات عبر الإنترنت
2. تخزين الخطوط والصور
3. ردود افتراضية عند عدم الاتصال
4. تحديث تلقائي في الخلفية
5. عمل كامل Online و Offline
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
تم تطوير الخدمة بواسطة: محمد مقبل عبدالله سيف
© 2026 المرشد الزراعي الذكي
`);