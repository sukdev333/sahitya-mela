// Mobile Navigation JavaScript for SAHITYA MELA

// Global dark mode toggle function
window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-mode');
    // Save preference to localStorage
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileNav();
});

function initializeMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const darkModeToggle = document.querySelector('#darkModeToggle');
    
    if (!hamburger) {
        console.log('Hamburger not found');
        return;
    }
    
    if (!navMenu) {
        console.log('Nav menu not found');
        return;
    }
    
    console.log('Mobile nav initialized');
    
    // Create mobile menu structure
    createMobileMenu();
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close menu when clicking nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu .nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.querySelector('.mobile-nav-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function createMobileMenu() {
    // Check if mobile menu already exists
    if (document.querySelector('.mobile-nav-menu')) {
        return;
    }
    
    // Create mobile menu
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-nav-menu';
    
    // Get navigation links from desktop menu
    const desktopNavLinks = document.querySelectorAll('.nav-right .nav-link');
    const darkModeToggle = document.querySelector('#darkModeToggle');
    
    // Create mobile menu content
    let menuHTML = '<ul>';
    desktopNavLinks.forEach(link => {
        menuHTML += `<li><a href="${link.href}" class="nav-link">${link.textContent}</a></li>`;
    });
    menuHTML += '</ul>';
    
    // Add dark mode toggle
    if (darkModeToggle) {
        menuHTML += `<button class="mobile-dark-toggle" onclick="toggleDarkMode()">
            <i class="fas fa-moon"></i> Dark Mode
        </button>`;
    }
    
    mobileMenu.innerHTML = menuHTML;
    document.body.appendChild(mobileMenu);
}

function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-nav-menu');
    
    if (!hamburger || !mobileMenu) {
        console.log('Menu elements not found');
        return;
    }
    
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
}

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-nav-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset hamburger animation
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    }
}

// Touch swipe to close menu
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu || !navMenu.classList.contains('active')) return;
    
    const swipeDistance = touchEndX - touchStartX;
    
    // Swipe left to close menu (minimum 50px swipe)
    if (swipeDistance < -50) {
        closeMobileMenu();
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            closeMobileMenu();
        }
    });
});

// Optimize for iOS Safari
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    // Fix viewport height on iOS
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            input.style.fontSize = '16px';
        });
    });
}
