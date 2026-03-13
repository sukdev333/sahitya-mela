// Global Error Handler for SAHITYA MELA

// Global error handling
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    handleError(event.error, 'JavaScript Error');
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    handleError(event.reason, 'Promise Rejection');
});

// Custom error handler
function handleError(error, type = 'Error') {
    // Specific check for Firebase Cloud Connection
    if (error.code && error.code.startsWith('auth/')) {
        type = 'Authentication Error';
        // Provide more specific Firebase auth error messages
        switch (error.code) {
            case 'auth/user-not-found':
                error.message = 'No user found with this email address.';
                break;
            case 'auth/wrong-password':
                error.message = 'Incorrect password. Please try again.';
                break;
            case 'auth/email-already-in-use':
                error.message = 'This email address is already in use.';
                break;
            case 'auth/weak-password':
                error.message = 'Password should be at least 6 characters long.';
                break;
            case 'auth/invalid-email':
                error.message = 'Please enter a valid email address.';
                break;
            case 'auth/too-many-requests':
                error.message = 'Too many failed attempts. Please try again later.';
                break;
        }
    } else if (error.code && error.code.includes('permission-denied')) {
        type = 'Security Error';
        error.message = "You don't have permission to perform this action.";
    } else if (error.code && error.code.includes('unavailable')) {
        type = 'Network Error';
        error.message = "Service temporarily unavailable. Please check your internet connection.";
    } else if (error.code && error.code.includes('timeout')) {
        type = 'Network Error';
        error.message = "Request timed out. Please check your internet connection and try again.";
    }

    const errorInfo = {
        type: type,
        message: error.message || error,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        code: error.code || null
    };
    
    // Log to console
    console.error(`${type}:`, errorInfo);
    
    // Store error for debugging (in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        storeErrorForDebugging(errorInfo);
    }
    
    // Show user-friendly error message
    showUserFriendlyError(error, type);
}

function storeErrorForDebugging(errorInfo) {
    try {
        const errors = JSON.parse(localStorage.getItem('sahityaMelaErrors') || '[]');
        errors.unshift(errorInfo);
        
        // Keep only last 10 errors
        if (errors.length > 10) {
            errors.splice(10);
        }
        
        localStorage.setItem('sahityaMelaErrors', JSON.stringify(errors));
    } catch (e) {
        console.warn('Could not store error for debugging:', e);
    }
}

function showUserFriendlyError(error, type) {
    // Don't show error notifications for minor issues
    const minorErrors = [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'Script error'
    ];
    
    if (minorErrors.some(minor => error.message && error.message.includes(minor))) {
        return;
    }
    
    // Prepare user-friendly message based on error type
    let userMessage = 'Something went wrong. Please refresh the page if the problem persists.';
    
    switch (type) {
        case 'Authentication Error':
            userMessage = 'Authentication failed. Please check your login credentials and try again.';
            break;
        case 'Security Error':
            userMessage = 'Access denied. You don\'t have permission to perform this action.';
            break;
        case 'Network Error':
            userMessage = 'Network error. Please check your internet connection and try again.';
            break;
        case 'Promise Rejection':
            userMessage = 'Network error. Please check your internet connection and try again.';
            break;
        case 'JavaScript Error':
            userMessage = 'An unexpected error occurred. Please refresh the page.';
            break;
    }
    
    // Show notification for significant errors
    if (window.SahityaMela && window.SahityaMela.showNotification) {
        window.SahityaMela.showNotification(userMessage, 'error');
    } else if (typeof showNotification === 'function') {
        showNotification(userMessage, 'error');
    } else {
        // Fallback to alert
        console.warn('No notification system available, showing alert:', userMessage);
        alert(userMessage);
    }
}

// Function to check for missing dependencies
function checkDependencies() {
    const requiredGlobals = ['SahityaMela', 'AdminAuth'];
    const missing = [];
    
    requiredGlobals.forEach(global => {
        if (!window[global]) {
            missing.push(global);
        }
    });
    
    if (missing.length > 0) {
        console.warn('Missing required globals:', missing);
        return false;
    }
    
    return true;
}

// Function to validate critical DOM elements
function validateCriticalElements(requiredElements) {
    const missing = [];
    
    requiredElements.forEach(selector => {
        if (!document.querySelector(selector)) {
            missing.push(selector);
        }
    });
    
    if (missing.length > 0) {
        console.warn('Missing critical DOM elements:', missing);
        return false;
    }
    
    return true;
}

// Safe function execution wrapper
function safeExecute(fn, context = null, ...args) {
    try {
        return fn.apply(context, args);
    } catch (error) {
        handleError(error, 'Safe Execute');
        return null;
    }
}

// Safe async function execution wrapper
async function safeExecuteAsync(fn, context = null, ...args) {
    try {
        return await fn.apply(context, args);
    } catch (error) {
        handleError(error, 'Safe Execute Async');
        return null;
    }
}

// Network error handler
function handleNetworkError(response, url) {
    const error = new Error(`Network error: ${response.status} ${response.statusText}`);
    error.url = url;
    error.status = response.status;
    handleError(error, 'Network Error');
}

// LocalStorage error handler
function safeLocalStorageOperation(operation, key, value = null) {
    try {
        switch (operation) {
            case 'get':
                return localStorage.getItem(key);
            case 'set':
                localStorage.setItem(key, value);
                return true;
            case 'remove':
                localStorage.removeItem(key);
                return true;
            default:
                throw new Error(`Unknown localStorage operation: ${operation}`);
        }
    } catch (error) {
        console.warn(`LocalStorage ${operation} failed for key "${key}":`, error);
        return operation === 'get' ? null : false;
    }
}

// Export functions
window.ErrorHandler = {
    handleError,
    checkDependencies,
    validateCriticalElements,
    safeExecute,
    safeExecuteAsync,
    handleNetworkError,
    safeLocalStorageOperation
};

console.log('Error handler initialized');
