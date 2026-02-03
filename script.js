// Enhanced JavaScript for RupertG Radio Website

// DOM Elements
const loadingOverlay = document.querySelector('.loading-overlay');
const navLinks = document.querySelectorAll('nav a');
const statNumbers = document.querySelectorAll('.stat-number');
const scheduleItems = document.querySelectorAll('.schedule-item');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeSmoothScrolling();
    initializeStatsAnimation();
    updateScheduleHighlighting();
    updateCurrentYear();
    setupNavigationActiveState();
    setupParallaxEffect();
});

// Smooth Scrolling with enhanced behavior
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animated Stats Counter with Intersection Observer
function initializeStatsAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const targetValue = parseInt(statNumber.getAttribute('data-target') || statNumber.textContent.replace(/[^0-9]/g, ''));
                
                if (!statNumber.dataset.animated) {
                    animateCounter(statNumber, targetValue, 2000);
                    statNumber.dataset.animated = 'true';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

// Counter Animation Function
function animateCounter(element, target, duration) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with commas
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Dynamic Schedule Highlighting
function updateScheduleHighlighting() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    
    scheduleItems.forEach(item => {
        item.classList.remove('now-playing');
        const timeSlot = item.querySelector('.time-slot').textContent;
        const timeRange = timeSlot.split(' - ')[0];
        const [hourStr, minuteStr] = timeRange.split(':');
        const slotHour = parseInt(hourStr);
        const slotMinute = parseInt(minuteStr);
        
        // Check if current time falls within the show's time slot
        if (currentHour === slotHour && currentMinutes >= slotMinute) {
            item.classList.add('now-playing');
        } else if (currentHour > slotHour && currentHour < slotHour + 3) {
            item.classList.add('now-playing');
        }
    });
}

// Update current year in copyright
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Navigation Active State Management
function setupNavigationActiveState() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Update active navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Parallax Effect for Hero Section
function setupParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            const transformValue = scrolled * parallaxSpeed;
            
            // Only apply parallax if not at the top
            if (window.scrollY > 0) {
                hero.style.transform = `translateY(${transformValue}px)`;
            } else {
                hero.style.transform = 'translateY(0)';
            }
        });
    }
}

// Enhanced Loading Animation
window.addEventListener('load', () => {
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, 500);
    }
});

// Accessibility Enhancements
document.addEventListener('keydown', (e) => {
    // Skip to main content on Ctrl+Enter
    if (e.ctrlKey && e.key === 'Enter') {
        const mainContent = document.querySelector('.hero');
        if (mainContent) {
            mainContent.focus();
        }
    }
});

// Performance optimizations
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});

// Add CSS class for resize animation stopper
const style = document.createElement('style');
style.textContent = `
    body.resize-animation-stopper * {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
    }
`;
document.head.appendChild(style);

// Mobile-specific enhancements
if (window.innerWidth <= 768) {
    // Disable parallax on mobile for performance
    window.removeEventListener('scroll', setupParallaxEffect);
    
    // Add touch-friendly interactions
    const cards = document.querySelectorAll('.content-card, .stat-card, .schedule-item');
    cards.forEach(card => {
        card.addEventListener('touchstart', () => {
            card.style.transform = 'translateY(-2px)';
        }, { passive: true });
        
        card.addEventListener('touchend', () => {
            card.style.transform = '';
        }, { passive: true });
    });
}

// Error handling for stream player
window.addEventListener('error', (e) => {
    console.warn('Stream player error:', e.error);
    // Could add fallback UI here if needed
}, true);

// Console cleanup for production
if (window.location.hostname !== 'localhost') {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
}