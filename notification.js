/**
 * نظام الإشعارات المتقدم
 */

const notificationSystem = {
    container: null,
    notifications: [],
    position: 'top-right',
    
    /**
     * تهيئة النظام
     */
    init(position = 'top-right') {
        this.position = position;
        
        // إنشاء حاوية الإشعارات
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            ${position.includes('top') ? 'top: 20px;' : 'bottom: 20px;'}
            ${position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
            z-index: 10000;
            display: flex;
            flex-direction: ${position.includes('top') ? 'column' : 'column-reverse'};
            gap: 10px;
            max-width: 350px;
        `;
        
        document.body.appendChild(this.container);
        console.log('✅ نظام الإشعارات جاهز');
    },
    
    /**
     * عرض إشعار
     * @param {string} message - نص الرسالة
     * @param {string} type - النوع (success, error, info, warning)
     * @param {number} duration - المدة بالمللي ثانية
     * @returns {string} معرف الإشعار
     */
    show(message, type = 'info', duration = 3000) {
        if (!this.container) this.init();
        
        const id = 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        // تحديد الألوان والأيقونات
        const config = {
            success: { 
                bg: '#4CAF50', 
                icon: 'fas fa-check-circle',
                title: 'نجاح'
            },
            error: { 
                bg: '#f44336', 
                icon: 'fas fa-exclamation-circle',
                title: 'خطأ'
            },
            info: { 
                bg: '#2196F3', 
                icon: 'fas fa-info-circle',
                title: 'معلومة'
            },
            warning: { 
                bg: '#FF9800', 
                icon: 'fas fa-exclamation-triangle',
                title: 'تحذير'
            }
        }[type] || config.info;
        
        // إنشاء الإشعار
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${config.bg};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            animation: notificationSlideIn 0.3s ease;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            max-width: 100%;
            word-break: break-word;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 20px; margin-top: 2px;">
                <i class="${config.icon}"></i>
            </div>
            <div style="flex: 1;">
                <div style="font-weight: bold; margin-bottom: 5px; font-size: 14px;">
                    ${config.title}
                </div>
                <div style="font-size: 13px; line-height: 1.4;">
                    ${message}
                </div>
            </div>
            <button onclick="notificationSystem.close('${id}')" 
                    style="background: none; border: none; color: white; cursor: pointer; padding: 0; margin-left: 10px;">
                <i class="fas fa-times"></i>
            </button>
            <div class="notification-progress" style="
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255,255,255,0.5);
                width: 100%;
                transform-origin: left;
                animation: notificationProgress ${duration}ms linear;
            "></div>
        `;
        
        // إضافة أنيميشن إذا لم تكن موجودة
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes notificationSlideIn {
                    from { 
                        opacity: 0; 
                        transform: translateX(${this.position.includes('right') ? '100px' : '-100px'});
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0); 
                    }
                }
                @keyframes notificationProgress {
                    from { transform: scaleX(1); }
                    to { transform: scaleX(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // إضافة الإشعار
        if (this.position.includes('top')) {
            this.container.insertBefore(notification, this.container.firstChild);
        } else {
            this.container.appendChild(notification);
        }
        
        this.notifications.push({ id, element: notification });
        
        // إزالة تلقائية بعد المدة
        if (duration > 0) {
            setTimeout(() => this.close(id), duration);
        }
        
        return id;
    },
    
    /**
     * إغلاق إشعار
     * @param {string} id - معرف الإشعار
     */
    close(id) {
        const notification = document.getElementById(id);
        if (notification) {
            notification.style.animation = 'notificationSlideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                this.notifications = this.notifications.filter(n => n.id !== id);
            }, 300);
        }
    },
    
    /**
     * إغلاق جميع الإشعارات
     */
    closeAll() {
        this.notifications.forEach(n => this.close(n.id));
    },
    
    /**
     * عرض إشعار نجاح
     */
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    },
    
    /**
     * عرض إشعار خطأ
     */
    error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    },
    
    /**
     * عرض إشعار معلومات
     */
    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    },
    
    /**
     * عرض إشعار تحذير
     */
    warning(message, duration = 3500) {
        return this.show(message, 'warning', duration);
    }
};

// دالة مختصرة للاستخدام السريع
function showNotification(message, type = 'info', duration = 3000) {
    return notificationSystem.show(message, type, duration);
}

// جعل النظام متاحاً عالمياً
if (typeof window !== 'undefined') {
    window.notificationSystem = notificationSystem;
    window.showNotification = showNotification;
    console.log('✅ نظام الإشعارات جاهز');
}

export { notificationSystem, showNotification };