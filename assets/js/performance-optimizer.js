// Performance Optimization for SAHITYA MELA

// Image lazy loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        'assets/css/style.css',
        'assets/css/dark-mode.css',
        'assets/css/responsive.css'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.endsWith('.css') ? 'style' : 'script';
        document.head.appendChild(link);
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize localStorage operations
function optimizeLocalStorage() {
    // Check localStorage availability
    if (!window.localStorage) {
        console.warn('LocalStorage not available');
        return false;
    }

    // Clear old data periodically
    const lastCleanup = localStorage.getItem('lastCleanup');
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (!lastCleanup || (now - parseInt(lastCleanup)) > oneWeek) {
        cleanupOldData();
        localStorage.setItem('lastCleanup', now.toString());
    }

    return true;
}

function cleanupOldData() {
    try {
        // Remove temporary data older than 24 hours
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('temp_')) {
                const data = JSON.parse(localStorage.getItem(key));
                if (data.timestamp && (Date.now() - data.timestamp) > 86400000) {
                    localStorage.removeItem(key);
                }
            }
        });
    } catch (error) {
        console.error('Error cleaning up localStorage:', error);
    }
}

// Optimize CSS animations
function optimizeAnimations() {
    // Reduce animations on low-end devices
    const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                          navigator.deviceMemory <= 2;

    if (isLowEndDevice) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
        document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }

    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.body.classList.add('paused-animations');
        } else {
            document.body.classList.remove('paused-animations');
        }
    });
}

// Memory usage optimization
function optimizeMemoryUsage() {
    // Clean up event listeners on page unload
    window.addEventListener('beforeunload', () => {
        // Remove all custom event listeners
        document.querySelectorAll('[data-listener]').forEach(element => {
            element.removeEventListener(element.dataset.listener, element.handler);
        });
    });

    // Limit the number of books loaded at once
    const maxBooksInMemory = 50;
    if (window.SahityaMela && window.SahityaMela.getStoredBooks) {
        const originalGetBooks = window.SahityaMela.getStoredBooks;
        window.SahityaMela.getStoredBooks = function(limit = maxBooksInMemory) {
            const books = originalGetBooks();
            return books.slice(0, limit);
        };
    }
}

// Network optimization
function optimizeNetworkRequests() {
    // Cache API responses
    const cache = new Map();
    const originalFetch = window.fetch;
    
    window.fetch = function(url, options = {}) {
        if (options.method === 'GET' || !options.method) {
            const cacheKey = url + JSON.stringify(options);
            if (cache.has(cacheKey)) {
                return Promise.resolve(cache.get(cacheKey).clone());
            }
            
            return originalFetch(url, options).then(response => {
                if (response.ok) {
                    cache.set(cacheKey, response.clone());
                }
                return response;
            });
        }
        
        return originalFetch(url, options);
    };
}

// Initialize all optimizations
function initializePerformanceOptimizations() {
    // Run optimizations after DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
        runOptimizations();
    }
}

function runOptimizations() {
    try {
        initializeLazyLoading();
        preloadCriticalResources();
        optimizeLocalStorage();
        optimizeAnimations();
        optimizeMemoryUsage();
        optimizeNetworkRequests();
        
        console.log('Performance optimizations initialized');
    } catch (error) {
        console.error('Error initializing performance optimizations:', error);
    }
}

// Export functions
window.PerformanceOptimizer = {
    debounce,
    initializeLazyLoading,
    optimizeLocalStorage,
    cleanupOldData
};

// Auto-initialize
initializePerformanceOptimizations();
