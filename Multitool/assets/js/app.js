// Main application JavaScript with performance optimizations
class MultiToolApp {
    constructor() {
        this.currentTool = null;
        this.preferences = this.loadPreferences();
        this.history = this.loadHistory();
        this.init();
        this.setupEventListeners();
        this.setupLazyLoading();
        this.setupPerformanceOptimizations();
    }

    init() {
        // Initialize theme
        this.initTheme();
        
        // Initialize navigation
        this.initNavigation();
        
        // Initialize accessibility features
        this.initAccessibility();
        
        // Initialize PWA features
        this.initPWA();
        
        console.log('Multi-Tool App initialized');
    }

    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeToggle(savedTheme);
        
        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeToggle(newTheme);
            
            // Update aria-pressed for accessibility
            themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
        });
    }

    updateThemeToggle(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.setAttribute('aria-pressed', theme === 'dark');
        }
    }

    initNavigation() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        mobileMenuToggle?.addEventListener('click', () => {
            const isExpanded = navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update focus for accessibility
                    target.focus();
                }
            });
        });

        // Update breadcrumbs based on current page
        this.updateBreadcrumbs();
    }

    updateBreadcrumbs() {
        const breadcrumb = document.querySelector('.breadcrumb');
        const currentPath = window.location.pathname;
        
        // This would be expanded based on your routing system
        if (currentPath !== '/') {
            const pathSegments = currentPath.split('/').filter(segment => segment);
            // Add breadcrumb items based on path segments
        }
    }

    initAccessibility() {
        // Keyboard navigation support
        document.addEventListener('keydown', (e) => {
            // Escape key closes mobile menu
            if (e.key === 'Escape') {
                const navMenu = document.querySelector('.nav-menu');
                const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
                
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    mobileMenuToggle.focus();
                }
            }
        });

        // Focus management for modal dialogs and dropdowns
        this.setupFocusTrap();
        
        // Announce dynamic content changes to screen readers
        this.setupLiveRegions();
    }

    setupFocusTrap() {
        // Implementation for focus trapping in modals
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal.active');
                if (modal) {
                    const focusableContent = modal.querySelectorAll(focusableElements);
                    const firstFocusable = focusableContent[0];
                    const lastFocusable = focusableContent[focusableContent.length - 1];

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
            }
        });
    }

    setupLiveRegions() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    initPWA() {
        // Handle PWA install prompt
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton();
        });

        // Handle PWA installation
        const installButton = document.getElementById('install-button');
        installButton?.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to install prompt: ${outcome}`);
                deferredPrompt = null;
                this.hideInstallButton();
            }
        });

        // Handle app installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.announce('App installed successfully');
        });
    }

    showInstallButton() {
        const installButton = document.getElementById('install-button');
        if (installButton) {
            installButton.style.display = 'block';
        }
    }

    hideInstallButton() {
        const installButton = document.getElementById('install-button');
        if (installButton) {
            installButton.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Performance monitoring
        window.addEventListener('load', () => {
            this.measurePerformance();
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.announce('Connection restored');
            document.body.classList.remove('offline');
        });

        window.addEventListener('offline', () => {
            this.announce('Connection lost. Working offline');
            document.body.classList.add('offline');
        });

        // Handle visibility change for performance optimization
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause non-essential operations
                this.pauseAnimations();
            } else {
                // Resume operations
                this.resumeAnimations();
            }
        });
    }

    setupLazyLoading() {
        // Intersection Observer for lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Lazy load components
        this.setupComponentLazyLoading();
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.setAttribute('data-loaded', 'true');
            
            img.addEventListener('load', () => {
                img.classList.remove('lazy-placeholder');
            });
        }
    }

    setupComponentLazyLoading() {
        // Lazy load heavy components when they come into view
        const componentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const component = entry.target;
                    const componentType = component.getAttribute('data-component');
                    
                    this.loadComponent(componentType, component);
                    componentObserver.unobserve(component);
                }
            });
        });

        document.querySelectorAll('[data-component]').forEach(component => {
            componentObserver.observe(component);
        });
    }

    async loadComponent(type, container) {
        try {
            const module = await import(`./components/${type}.js`);
            const Component = module.default;
            new Component(container);
        } catch (error) {
            console.error(`Failed to load component ${type}:`, error);
        }
    }

    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup resource hints
        this.setupResourceHints();
        
        // Optimize images
        this.optimizeImages();
        
        // Setup critical CSS inlining
        this.setupCriticalCSS();
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/assets/css/main.css',
            '/assets/js/utils.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    setupResourceHints() {
        // DNS prefetch for external domains
        const externalDomains = [
            'https://fonts.googleapis.com',
            'https://api.yourdomain.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    }

    optimizeImages() {
        // Implement responsive images with srcset
        document.querySelectorAll('img[data-responsive]').forEach(img => {
            const baseSrc = img.getAttribute('data-src');
            const sizes = img.getAttribute('data-sizes') || '(max-width: 768px) 100vw, 50vw';
            
            if (baseSrc) {
                const srcset = this.generateSrcSet(baseSrc);
                img.setAttribute('srcset', srcset);
                img.setAttribute('sizes', sizes);
            }
        });
    }

    generateSrcSet(baseSrc) {
        const widths = [320, 640, 768, 1024, 1280, 1920];
        return widths.map(width => 
            `${baseSrc}?w=${width} ${width}w`
        ).join(', ');
    }

    setupCriticalCSS() {
        // Load non-critical CSS asynchronously
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][media="print"]');
        
        nonCriticalCSS.forEach(link => {
            link.addEventListener('load', () => {
                link.media = 'all';
            });
        });
    }

    measurePerformance() {
        // Measure and report performance metrics
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');
            
            const metrics = {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
                firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime
            };
            
            console.log('Performance Metrics:', metrics);
            
            // Report to analytics (implement your analytics service)
            this.reportPerformanceMetrics(metrics);
        }
    }

    reportPerformanceMetrics(metrics) {
        // Send metrics to your analytics service
        // Example: analytics.track('performance', metrics);
    }

    pauseAnimations() {
        document.body.classList.add('animations-paused');
    }

    resumeAnimations() {
        document.body.classList.remove('animations-paused');
    }
}

// Complete Multi-Tool Application with all features
class MultiToolApp {
    constructor() {
        this.currentTool = null;
        this.preferences = this.loadPreferences();
        this.history = this.loadHistory();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTools();
        this.setupKeyboardShortcuts();
        this.setupAnalytics();
        this.setupPWA();
        this.initializeUI();
        console.log('Multi-Tool App initialized with all features');
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Install app button
        document.getElementById('install-app')?.addEventListener('click', () => {
            this.installApp();
        });

        // Preferences
        document.getElementById('save-history')?.addEventListener('change', (e) => {
            this.updatePreference('saveHistory', e.target.checked);
        });

        document.getElementById('auto-save')?.addEventListener('change', (e) => {
            this.updatePreference('autoSave', e.target.checked);
        });

        document.getElementById('show-shortcuts')?.addEventListener('change', (e) => {
            this.updatePreference('showShortcuts', e.target.checked);
        });

        // History management
        document.getElementById('clear-history')?.addEventListener('click', () => {
            this.clearHistory();
        });

        // Online/offline status
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('Working offline', 'warning');
        });
    }

    initializeTools() {
        this.initQRGenerator();
        this.initJSONFormatter();
        this.initSIPCalculator();
        this.initWordCounter();
        this.initPDFConverter();
    }

    // QR Code Generator
    initQRGenerator() {
        const generateBtn = document.getElementById('generate-qr');
        const downloadBtn = document.getElementById('download-qr');
        const textInput = document.getElementById('qr-text');
        const sizeSelect = document.getElementById('qr-size');
        const colorInput = document.getElementById('qr-color');
        const bgColorInput = document.getElementById('qr-bg-color');
        const resultDiv = document.getElementById('qr-result');

        let currentQRDataURL = null;

        generateBtn?.addEventListener('click', async () => {
            const text = textInput.value.trim();
            if (!text) {
                this.showNotification('Please enter text or URL', 'error');
                return;
            }

            try {
                this.setLoading(generateBtn, true);
                
                const size = parseInt(sizeSelect.value);
                const color = colorInput.value;
                const bgColor = bgColorInput.value;

                const canvas = document.createElement('canvas');
                await QRCode.toCanvas(canvas, text, {
                    width: size,
                    color: {
                        dark: color,
                        light: bgColor
                    },
                    errorCorrectionLevel: 'M'
                });

                resultDiv.innerHTML = '';
                resultDiv.appendChild(canvas);
                
                currentQRDataURL = canvas.toDataURL('image/png');
                downloadBtn.disabled = false;

                // Track event
                this.trackEvent('qr_generated', {
                    text_length: text.length,
                    size: size,
                    custom_colors: color !== '#000000' || bgColor !== '#ffffff'
                });

                // Save to history
                this.saveToHistory('QR Generator', {
                    text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
                    size: size
                });

                this.showNotification('QR Code generated successfully!', 'success');
            } catch (error) {
                console.error('QR generation error:', error);
                this.showNotification('Failed to generate QR code', 'error');
            } finally {
                this.setLoading(generateBtn, false);
            }
        });

        downloadBtn?.addEventListener('click', () => {
            if (currentQRDataURL) {
                const link = document.createElement('a');
                link.download = 'qrcode.png';
                link.href = currentQRDataURL;
                link.click();
                
                this.trackEvent('qr_downloaded');
                this.showNotification('QR Code downloaded!', 'success');
            }
        });

        // Auto-save functionality
        if (this.preferences.autoSave) {
            textInput?.addEventListener('input', () => {
                localStorage.setItem('qr-text', textInput.value);
            });
            
            const savedText = localStorage.getItem('qr-text');
            if (savedText) textInput.value = savedText;
        }
    }

    // JSON Formatter
    initJSONFormatter() {
        const formatBtn = document.getElementById('format-json');
        const minifyBtn = document.getElementById('minify-json');
        const validateBtn = document.getElementById('validate-json');
        const copyBtn = document.getElementById('copy-json');
        const inputTextarea = document.getElementById('json-input');
        const outputTextarea = document.getElementById('json-output');
        const statusDiv = document.getElementById('json-status');

        const processJSON = (action) => {
            const input = inputTextarea.value.trim();
            if (!input) {
                this.showNotification('Please enter JSON data', 'error');
                return;
            }

            try {
                const parsed = JSON.parse(input);
                let result = '';
                let statusMessage = '';
                let statusClass = 'success';

                switch (action) {
                    case 'format':
                        result = JSON.stringify(parsed, null, 2);
                        statusMessage = '✅ JSON formatted successfully';
                        break;
                    case 'minify':
                        result = JSON.stringify(parsed);
                        statusMessage = `✅ JSON minified (${input.length} → ${result.length} characters)`;
                        break;
                    case 'validate':
                        result = input;
                        statusMessage = '✅ Valid JSON';
                        break;
                }

                outputTextarea.value = result;
                statusDiv.textContent = statusMessage;
                statusDiv.className = `status-area ${statusClass}`;

                // Track event
                this.trackEvent('json_processed', {
                    action: action,
                    input_size: input.length,
                    output_size: result.length
                });

                // Save to history
                this.saveToHistory('JSON Formatter', {
                    action: action,
                    preview: input.substring(0, 50) + '...'
                });

            } catch (error) {
                statusDiv.textContent = `❌ Invalid JSON: ${error.message}`;
                statusDiv.className = 'status-area error';
                outputTextarea.value = '';
                this.showNotification('Invalid JSON format', 'error');
            }
        };

        formatBtn?.addEventListener('click', () => processJSON('format'));
        minifyBtn?.addEventListener('click', () => processJSON('minify'));
        validateBtn?.addEventListener('click', () => processJSON('validate'));

        copyBtn?.addEventListener('click', async () => {
            const output = outputTextarea.value;
            if (!output) {
                this.showNotification('No output to copy', 'error');
                return;
            }

            try {
                await navigator.clipboard.writeText(output);
                this.showNotification('Copied to clipboard!', 'success');
                this.trackEvent('json_copied');
            } catch (error) {
                this.showNotification('Failed to copy', 'error');
            }
        });

        // Auto-save
        if (this.preferences.autoSave) {
            inputTextarea?.addEventListener('input', () => {
                localStorage.setItem('json-input', inputTextarea.value);
            });
            
            const savedInput = localStorage.getItem('json-input');
            if (savedInput) inputTextarea.value = savedInput;
        }
    }

    // SIP Calculator
    initSIPCalculator() {
        const calculateBtn = document.getElementById('calculate-sip');
        const amountInput = document.getElementById('sip-amount');
        const rateInput = document.getElementById('sip-rate');
        const yearsInput = document.getElementById('sip-years');
        const goalInput = document.getElementById('sip-goal');
        
        let sipChart = null;

        calculateBtn?.addEventListener('click', () => {
            const monthlyAmount = parseFloat(amountInput.value);
            const annualRate = parseFloat(rateInput.value);
            const years = parseInt(yearsInput.value);
            const targetGoal = parseFloat(goalInput.value) || null;

            if (!monthlyAmount || !annualRate || !years) {
                this.showNotification('Please fill all required fields', 'error');
                return;
            }

            try {
                this.setLoading(calculateBtn, true);

                const monthlyRate = annualRate / 12 / 100;
                const totalMonths = years * 12;
                
                // SIP calculation formula
                const maturityAmount = monthlyAmount * 
                    (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
                    (1 + monthlyRate));
                
                const totalInvestment = monthlyAmount * totalMonths;
                const totalReturns = maturityAmount - totalInvestment;

                // Update result cards
                document.getElementById('total-investment').textContent = 
                    `₹${totalInvestment.toLocaleString('en-IN')}`;
                document.getElementById('total-returns').textContent = 
                    `₹${totalReturns.toLocaleString('en-IN')}`;
                document.getElementById('maturity-amount').textContent = 
                    `₹${maturityAmount.toLocaleString('en-IN')}`;

                // Create chart data
                const chartData = this.generateSIPChartData(monthlyAmount, monthlyRate, totalMonths);
                this.renderSIPChart(chartData);

                // Goal analysis
                if (targetGoal && targetGoal > maturityAmount) {
                    const requiredAmount = Math.ceil((targetGoal * monthlyRate) / 
                        (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
                        (1 + monthlyRate)));
                    
                    this.showNotification(
                        `To reach ₹${targetGoal.toLocaleString('en-IN')}, invest ₹${requiredAmount.toLocaleString('en-IN')} monthly`, 
                        'warning'
                    );
                }

                // Track event
                this.trackEvent('sip_calculated', {
                    monthly_amount: monthlyAmount,
                    annual_rate: annualRate,
                    years: years,
                    maturity_amount: Math.round(maturityAmount)
                });

                // Save to history
                this.saveToHistory('SIP Calculator', {
                    amount: `₹${monthlyAmount.toLocaleString('en-IN')}`,
                    years: years,
                    maturity: `₹${Math.round(maturityAmount).toLocaleString('en-IN')}`
                });

                this.showNotification('SIP calculation completed!', 'success');
            } catch (error) {
                console.error('SIP calculation error:', error);
                this.showNotification('Calculation failed', 'error');
            } finally {
                this.setLoading(calculateBtn, false);
            }
        });
    }

    generateSIPChartData(monthlyAmount, monthlyRate, totalMonths) {
        const data = [];
        let investedAmount = 0;
        let currentValue = 0;

        for (let month = 1; month <= totalMonths; month++) {
            investedAmount += monthlyAmount;
            currentValue = monthlyAmount * 
                (((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * 
                (1 + monthlyRate));
            
            if (month % 12 === 0 || month === totalMonths) {
                data.push({
                    year: Math.ceil(month / 12),
                    invested: investedAmount,
                    value: currentValue
                });
            }
        }
        return data;
    }

    renderSIPChart(data) {
        const ctx = document.getElementById('sip-chart');
        if (!ctx) return;

        if (window.sipChart) {
            window.sipChart.destroy();
        }

        window.sipChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => `Year ${d.year}`),
                datasets: [
                    {
                        label: 'Invested Amount',
                        data: data.map(d => d.invested),
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Maturity Value',
                        data: data.map(d => d.value),
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                }
            }
        });
    }

    // Word Counter Pro
    initWordCounter() {
        const textInput = document.getElementById('text-input');
        
        textInput?.addEventListener('input', () => {
            this.updateWordCountStats(textInput.value);
        });

        // Auto-save
        if (this.preferences.autoSave) {
            textInput?.addEventListener('input', () => {
                localStorage.setItem('word-counter-text', textInput.value);
            });
            
            const savedText = localStorage.getItem('word-counter-text');
            if (savedText) {
                textInput.value = savedText;
                this.updateWordCountStats(savedText);
            }
        }
    }

    updateWordCountStats(text) {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const characters = text.length;
        const charactersNoSpace = text.replace(/\s/g, '').length;
        const paragraphs = text.trim() ? text.split(/\n\s*\n/).length : 0;
        const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
        const readingTime = Math.ceil(words / 200); // Average reading speed

        // Update basic stats
        document.getElementById('word-count').textContent = words.toLocaleString();
        document.getElementById('char-count').textContent = characters.toLocaleString();
        document.getElementById('char-no-space').textContent = charactersNoSpace.toLocaleString();
        document.getElementById('paragraph-count').textContent = paragraphs.toLocaleString();
        document.getElementById('sentence-count').textContent = sentences.toLocaleString();
        document.getElementById('reading-time').textContent = `${readingTime} min`;

        // Readability analysis
        const readabilityScore = this.calculateReadabilityScore(text, words, sentences);
        this.updateReadabilityDisplay(readabilityScore);

        // Keyword density
        this.updateKeywordDensity(text);

        // Social media limits
        this.updateSocialMediaLimits(characters);

        // Track usage
        if (words > 0) {
            this.trackEvent('word_count_used', {
                word_count: words,
                character_count: characters
            });
        }
    }

    calculateReadabilityScore(text, words, sentences) {
        if (words === 0 || sentences === 0) return 0;
        
        const syllables = this.countSyllables(text);
        
        // Flesch Reading Ease Score
        const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
        return Math.max(0, Math.min(100, Math.round(score)));
    }

    countSyllables(text) {
        const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
        return words.reduce((total, word) => {
            const syllableCount = word.match(/[aeiouy]+/g)?.length || 1;
            return total + Math.max(1, syllableCount);
        }, 0);
    }

    updateReadabilityDisplay(score) {
        const scoreElement = document.querySelector('.score-display .score');
        const gradeElement = document.querySelector('.score-display .grade');
        
        if (scoreElement) scoreElement.textContent = score;
        
        let grade = 'Graduate';
        if (score >= 90) grade = '5th Grade';
        else if (score >= 80) grade = '6th Grade';
        else if (score >= 70) grade = '7th Grade';
        else if (score >= 60) grade = '8th-9th Grade';
        else if (score >= 50) grade = '10th-12th Grade';
        else if (score >= 30) grade = 'College Level';
        
        if (gradeElement) gradeElement.textContent = `Grade: ${grade}`;
    }

    updateKeywordDensity(text) {
        const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        const wordCount = {};
        
        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
        
        const sortedWords = Object.entries(wordCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        const keywordContainer = document.getElementById('keyword-density');
        if (keywordContainer) {
            keywordContainer.innerHTML = sortedWords.map(([word, count]) => {
                const density = ((count / words.length) * 100).toFixed(1);
                return `
                    <div class="keyword-item">
                        <span class="keyword">${word}</span>
                        <span class="count">${count}</span>
                        <span class="density">${density}%</span>
                    </div>
                `;
            }).join('');
        }
    }

    updateSocialMediaLimits(characters) {
        const limits = {
            twitter: { limit: 280, name: 'Twitter' },
            facebook: { limit: 63206, name: 'Facebook' },
            instagram: { limit: 2200, name: 'Instagram' },
            linkedin: { limit: 3000, name: 'LinkedIn' }
        };

        const socialContainer = document.getElementById('social-limits');
        if (socialContainer) {
            socialContainer.innerHTML = Object.entries(limits).map(([platform, data]) => {
                const remaining = data.limit - characters;
                const percentage = (characters / data.limit) * 100;
                const status = remaining >= 0 ? 'good' : 'over';
                
                return `
                    <div class="social-limit ${status}">
                        <div class="platform">${data.name}</div>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${Math.min(percentage, 100)}%"></div>
                        </div>
                        <div class="remaining">${remaining >= 0 ? remaining : 'Over by ' + Math.abs(remaining)}</div>
                    </div>
                `;
            }).join('');
        }
    }

    // PDF to Word Converter
    initPDFConverter() {
        const dropZone = document.getElementById('pdf-drop-zone');
        const fileInput = document.getElementById('pdf-file-input');
        const convertBtn = document.getElementById('convert-pdf-btn');

        // Drag and drop functionality
        dropZone?.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone?.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone?.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handlePDFFile(files[0]);
            }
        });

        fileInput?.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handlePDFFile(e.target.files[0]);
            }
        });

        convertBtn?.addEventListener('click', () => {
            fileInput?.click();
        });
    }

    async handlePDFFile(file) {
        if (file.type !== 'application/pdf') {
            this.showNotification('Please select a PDF file', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            this.showNotification('File size must be less than 10MB', 'error');
            return;
        }

        try {
            this.showProgress('Converting PDF...', 0);
            const text = await this.extractTextFromPDF(file);
            this.showProgress('Generating Word document...', 50);
            await this.generateWordDocument(text, file.name);
            this.showProgress('Complete!', 100);
            
            setTimeout(() => this.hideProgress(), 2000);
            
            this.trackEvent('pdf_converted', {
                file_size: file.size,
                file_name: file.name
            });

            this.saveToHistory('PDF Converter', {
                file: file.name,
                size: this.formatFileSize(file.size),
                converted: new Date().toLocaleString()
            });

        } catch (error) {
            console.error('PDF conversion error:', error);
            this.showNotification('Conversion failed. Please try again.', 'error');
            this.hideProgress();
        }
    }

    async extractTextFromPDF(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const typedArray = new Uint8Array(e.target.result);
                    const pdf = await pdfjsLib.getDocument(typedArray).promise;
                    let fullText = '';

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n\n';
                        
                        // Update progress
                        const progress = (i / pdf.numPages) * 40; // 40% for extraction
                        this.updateProgress(progress);
                    }

                    resolve(fullText);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    async generateWordDocument(text, originalFileName) {
        // Create a simple Word document structure
        const docContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Converted Document</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
                    h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
                    p { margin-bottom: 15px; }
                </style>
            </head>
            <body>
                <h1>Converted from: ${originalFileName}</h1>
                <div>${text.split('\n').map(line => `<p>${line}</p>`).join('')}</div>
            </body>
            </html>
        `;

        // Create and download the file
        const blob = new Blob([docContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = originalFileName.replace('.pdf', '.doc');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Document downloaded successfully!', 'success');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Utility methods
    showProgress(message, progress) {
        const progressContainer = document.getElementById('progress-container');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');

        if (progressContainer) {
            progressContainer.style.display = 'block';
            progressText.textContent = message;
            progressBar.style.width = progress + '%';
        }
    }

    updateProgress(progress) {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }

    hideProgress() {
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.style.display = 'none';
        }
    }

    setLoading(button, loading) {
        if (button) {
            button.disabled = loading;
            button.textContent = loading ? 'Processing...' : button.dataset.originalText || 'Process';
            if (!loading && button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
            } else if (loading && !button.dataset.originalText) {
                button.dataset.originalText = button.textContent;
            }
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    trackEvent(eventName, data = {}) {
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent(eventName, data);
        }
    }

    // Preferences and History
    loadPreferences() {
        return JSON.parse(localStorage.getItem('multiToolPreferences') || '{}');
    }

    savePreferences() {
        localStorage.setItem('multiToolPreferences', JSON.stringify(this.preferences));
    }

    updatePreference(key, value) {
        this.preferences[key] = value;
        this.savePreferences();
    }

    loadHistory() {
        return JSON.parse(localStorage.getItem('multiToolHistory') || '[]');
    }

    saveToHistory(tool, data) {
        if (!this.preferences.saveHistory) return;
        
        const historyItem = {
            id: Date.now(),
            tool: tool,
            data: data,
            timestamp: new Date().toISOString()
        };
        
        this.history.unshift(historyItem);
        this.history = this.history.slice(0, 100); // Keep last 100 items
        localStorage.setItem('multiToolHistory', JSON.stringify(this.history));
        
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyContainer = document.getElementById('history-list');
        if (!historyContainer) return;
        
        historyContainer.innerHTML = this.history.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-tool">${item.tool}</div>
                <div class="history-data">${JSON.stringify(item.data)}</div>
                <div class="history-time">${new Date(item.timestamp).toLocaleString()}</div>
                <button class="history-delete" onclick="app.deleteHistoryItem(${item.id})">×</button>
            </div>
        `).join('');
    }

    deleteHistoryItem(id) {
        this.history = this.history.filter(item => item.id !== id);
        localStorage.setItem('multiToolHistory', JSON.stringify(this.history));
        this.updateHistoryDisplay();
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('multiToolHistory');
        this.updateHistoryDisplay();
        this.showNotification('History cleared', 'success');
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MultiToolApp();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiToolApp;
}