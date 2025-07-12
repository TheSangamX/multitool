// Utility functions for performance and SEO optimization
export class SEOUtils {
    static updateMetaTags(data) {
        // Update page title
        if (data.title) {
            document.title = data.title;
            this.updateMetaProperty('og:title', data.title);
            this.updateMetaProperty('twitter:title', data.title);
        }

        // Update description
        if (data.description) {
            this.updateMetaContent('description', data.description);
            this.updateMetaProperty('og:description', data.description);
            this.updateMetaProperty('twitter:description', data.description);
        }

        // Update canonical URL
        if (data.canonical) {
            this.updateCanonicalURL(data.canonical);
            this.updateMetaProperty('og:url', data.canonical);
        }

        // Update structured data
        if (data.structuredData) {
            this.updateStructuredData(data.structuredData);
        }
    }

    static updateMetaContent(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    static updateMetaProperty(property, content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    static updateCanonicalURL(url) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = url;
    }

    static updateStructuredData(data) {
        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(data);
    }

    static generateBreadcrumbStructuredData(breadcrumbs) {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": crumb.url
            }))
        };
    }
}

export class PerformanceUtils {
    static measureCLS() {
        // Measure Cumulative Layout Shift
        let clsValue = 0;
        let clsEntries = [];

        const observer = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsEntries.push(entry);
                    clsValue += entry.value;
                }
            }
        });

        observer.observe({ type: 'layout-shift', buffered: true });
        return clsValue;
    }

    static measureLCP() {
        // Measure Largest Contentful Paint
        return new Promise((resolve) => {
            const observer = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                resolve(lastEntry.startTime);
            });

            observer.observe({ type: 'largest-contentful-paint', buffered: true });
        });
    }

    static measureFID() {
        // Measure First Input Delay
        return new Promise((resolve) => {
            const observer = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    resolve(entry.processingStart - entry.startTime);
                }
            });

            observer.observe({ type: 'first-input', buffered: true });
        });
    }

    static optimizeImages() {
        // Implement WebP support detection and fallback
        const supportsWebP = this.checkWebPSupport();
        
        document.querySelectorAll('img[data-webp]').forEach(img => {
            if (supportsWebP) {
                img.src = img.getAttribute('data-webp');
            } else {
                img.src = img.getAttribute('data-fallback') || img.src;
            }
        });
    }

    static checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    static preloadCriticalResources(resources) {
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.url;
            link.as = resource.type;
            if (resource.crossorigin) {
                link.crossOrigin = resource.crossorigin;
            }
            document.head.appendChild(link);
        });
    }

    static setupIntersectionObserver(callback, options = {}) {
        const defaultOptions = {
            rootMargin: '0px',
            threshold: 0.1
        };

        return new IntersectionObserver(callback, { ...defaultOptions, ...options });
    }
}

export class AccessibilityUtils {
    static announceToScreenReader(message, priority = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    static trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });

        firstFocusable.focus();
    }

    static setupSkipLinks() {
        const skipLinks = document.querySelectorAll('.skip-link');
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        });
    }

    static checkColorContrast(foreground, background) {
        // Simple color contrast checker
        const getLuminance = (color) => {
            const rgb = color.match(/\d+/g);
            const [r, g, b] = rgb.map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        const l1 = getLuminance(foreground);
        const l2 = getLuminance(background);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        
        return {
            ratio,
            AA: ratio >= 4.5,
            AAA: ratio >= 7
        };
    }
}

export class PWAUtils {
    static async registerServiceWorker(swPath = '/sw.js') {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register(swPath);
                console.log('Service Worker registered:', registration);
                return registration;
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    static async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }

    static showNotification(title, options = {}) {
        if ('serviceWorker' in navigator && 'Notification' in window) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    icon: '/assets/icons/icon-192x192.png',
                    badge: '/assets/icons/badge-72x72.png',
                    ...options
                });
            });
        }
    }

    static async checkForUpdates() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                registration.update();
            }
        }
    }
}