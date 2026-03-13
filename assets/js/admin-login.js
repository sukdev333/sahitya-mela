// Admin Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
});

function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Auto-redirect if session is active
    if (AdminAuth.isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // UI Feedback: Disable button during attempt
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerText = 'Authenticating...';

    // AUTHENTICATION LOGIC
    // Transition Tip: Replace this block with Firebase signInWithEmailAndPassword later
    if (authenticateUser(email, password)) {
        const sessionData = {
            user: email,
            loginTime: Date.now(),
            rememberMe: rememberMe
        };
        
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('adminUser', JSON.stringify(sessionData));
        
        AdminAuth.showNotification('Welcome back, Admin!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1200);
    } else {
        AdminAuth.showNotification('Access Denied: Invalid credentials', 'error');
        submitBtn.disabled = false;
        submitBtn.innerText = 'Login';
    }
}

function authenticateUser(user, pass) {
    // Keep this as a temporary bridge until your Firebase is connected
    const ADMIN_EMAIL = 'sahityamela64@gmail.com';
    const ADMIN_PASS = 'Sahitya@mela#';
    
    return (user === ADMIN_EMAIL || user === 'admin') && pass === ADMIN_PASS;
}

// Global Auth Object
window.AdminAuth = {
    isLoggedIn: function() {
        const data = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
        if (!data) return false;
        
        const session = JSON.parse(data);
        const expiry = 24 * 60 * 60 * 1000; // 24 Hours
        return (Date.now() - session.loginTime) < expiry;
    },

    logout: function() {
        localStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminUser');
        window.location.href = 'login.html';
    },

    showNotification: function(message, type) {
        const color = type === 'success' ? '#4CAF50' : '#f44336';
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; 
            background: ${color}; color: white; 
            padding: 15px 25px; border-radius: 8px; 
            z-index: 9999; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            font-family: sans-serif; transition: all 0.5s ease;
        `;
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};
