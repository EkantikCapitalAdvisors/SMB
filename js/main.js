/**
 * EKANTIK CAPITAL ADVISORS - FOUNDING MEMBER LANDING PAGE
 * JavaScript functionality for interactivity and form handling
 */

// =====================================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// =====================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 120; // Account for sticky header
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =====================================================
// STICKY CTA VISIBILITY
// =====================================================
const stickyCta = document.querySelector('.sticky-cta');
const finalCtaSection = document.querySelector('#apply');

function toggleStickyCta() {
    if (!stickyCta || !finalCtaSection) return;
    
    const scrollPosition = window.scrollY + window.innerHeight;
    const finalCtaPosition = finalCtaSection.offsetTop;
    
    if (scrollPosition >= finalCtaPosition) {
        stickyCta.classList.add('hidden');
    } else if (window.scrollY > 800) {
        stickyCta.classList.remove('hidden');
    } else {
        stickyCta.classList.add('hidden');
    }
}

window.addEventListener('scroll', toggleStickyCta);
window.addEventListener('load', toggleStickyCta);

// =====================================================
// MOBILE MENU TOGGLE
// =====================================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        if (navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.backgroundColor = 'var(--color-dark-tertiary)';
            navMenu.style.padding = 'var(--spacing-md)';
            navMenu.style.borderRadius = '0 0 var(--radius-lg) var(--radius-lg)';
            navMenu.style.boxShadow = 'var(--shadow-lg)';
            navMenu.style.zIndex = '1000';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            if (window.innerWidth <= 968) {
                navMenu.style.display = 'none';
            }
        }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 968) {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'row';
            navMenu.style.position = 'static';
            navMenu.style.backgroundColor = 'transparent';
        } else {
            navMenu.style.display = 'none';
        }
    });
}

// =====================================================
// FAQ ACCORDION
// =====================================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// =====================================================
// FORM HANDLING
// =====================================================
const applicationForm = document.getElementById('applicationForm');

if (applicationForm) {
    applicationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            revenue: document.getElementById('revenue').value,
            priority: document.getElementById('priority').value,
            notes: document.getElementById('notes').value,
            timestamp: new Date().toISOString()
        };
        
        // Log form data to console (for development/testing)
        console.log('Application submitted:', formData);
        
        // Show success message
        showFormMessage('success', 'Application submitted successfully! We\'ll review your information and contact you within 2 business days.');
        
        // Reset form
        applicationForm.reset();
        
        // In a production environment, you would send this data to a server:
        // try {
        //     const response = await fetch('/api/applications', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(formData)
        //     });
        //     
        //     if (response.ok) {
        //         showFormMessage('success', 'Application submitted successfully!');
        //         applicationForm.reset();
        //     } else {
        //         throw new Error('Submission failed');
        //     }
        // } catch (error) {
        //     showFormMessage('error', 'There was an error submitting your application. Please try again.');
        // }
    });
}

function showFormMessage(type, message) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.style.cssText = `
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        margin-top: var(--spacing-md);
        text-align: center;
        font-weight: var(--font-weight-semibold);
        animation: fadeIn 0.3s ease;
    `;
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = 'rgba(76, 175, 80, 0.15)';
        messageDiv.style.border = '2px solid var(--color-accent-green)';
        messageDiv.style.color = 'var(--color-accent-green)';
        messageDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    } else {
        messageDiv.style.backgroundColor = 'rgba(231, 76, 60, 0.15)';
        messageDiv.style.border = '2px solid var(--color-accent-red)';
        messageDiv.style.color = 'var(--color-accent-red)';
        messageDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    }
    
    // Insert message after form
    applicationForm.parentNode.insertBefore(messageDiv, applicationForm.nextSibling);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// =====================================================
// FORM VALIDATION
// =====================================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\(\)\+]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Real-time validation
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

if (emailInput) {
    emailInput.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = 'var(--color-accent-red)';
            showInputError(this, 'Please enter a valid email address');
        } else {
            this.style.borderColor = 'var(--color-gold)';
            removeInputError(this);
        }
    });
}

if (phoneInput) {
    phoneInput.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            this.style.borderColor = 'var(--color-accent-red)';
            showInputError(this, 'Please enter a valid phone number');
        } else {
            this.style.borderColor = 'var(--color-gold)';
            removeInputError(this);
        }
    });
}

function showInputError(input, message) {
    removeInputError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.style.cssText = `
        color: var(--color-accent-red);
        font-size: 0.85rem;
        margin-top: var(--spacing-xs);
    `;
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
}

function removeInputError(input) {
    const existingError = input.parentNode.querySelector('.input-error');
    if (existingError) {
        existingError.remove();
    }
}

// =====================================================
// INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
// =====================================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(`
    .cost-card,
    .pillar-card,
    .benefit-card,
    .strategy-card,
    .term-card,
    .why-card,
    .timeline-item,
    .cred-card
`);

animateElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// =====================================================
// NAVBAR SCROLL EFFECT
// =====================================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
    }
    
    lastScroll = currentScroll;
});

// =====================================================
// LOADING STATE
// =====================================================
window.addEventListener('load', () => {
    // Remove loading class if exists
    document.body.classList.remove('loading');
    
    // Initialize any third-party scripts here
    console.log('Ekantik Capital Advisors Landing Page Loaded');
});

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Debounce function to limit function calls
 */
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

/**
 * Track scroll depth for analytics
 */
let maxScrollDepth = 0;

const trackScrollDepth = debounce(() => {
    const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = Math.round(scrollPercentage);
        // In production, send to analytics:
        // gtag('event', 'scroll_depth', { value: maxScrollDepth });
        console.log('Max scroll depth:', maxScrollDepth + '%');
    }
}, 500);

window.addEventListener('scroll', trackScrollDepth);

/**
 * Track CTA button clicks
 */
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        const buttonLocation = this.closest('section')?.id || 'unknown';
        
        console.log('CTA clicked:', {
            text: buttonText,
            location: buttonLocation,
            timestamp: new Date().toISOString()
        });
        
        // In production, send to analytics:
        // gtag('event', 'cta_click', {
        //     button_text: buttonText,
        //     button_location: buttonLocation
        // });
    });
});

/**
 * Track FAQ interactions
 */
faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const questionText = question.textContent.trim();
        console.log('FAQ opened:', {
            question: questionText,
            index: index,
            timestamp: new Date().toISOString()
        });
        
        // In production, send to analytics:
        // gtag('event', 'faq_interaction', {
        //     question: questionText,
        //     index: index
        // });
    });
});

// =====================================================
// ERROR HANDLING
// =====================================================
window.addEventListener('error', (e) => {
    console.error('Page error:', e.error);
    // In production, send errors to monitoring service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, send errors to monitoring service
});

// =====================================================
// PRINT PREPARATION
// =====================================================
window.addEventListener('beforeprint', () => {
    // Expand all FAQ items for printing
    faqItems.forEach(item => item.classList.add('active'));
});

window.addEventListener('afterprint', () => {
    // Collapse FAQ items after printing
    faqItems.forEach(item => item.classList.remove('active'));
});

// =====================================================
// PERFORMANCE MONITORING
// =====================================================
if ('PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Monitor First Input Delay (FID)
    const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
            console.log('FID:', entry.processingStart - entry.startTime);
        });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
}

// =====================================================
// ACCESSIBILITY ENHANCEMENTS
// =====================================================

// Add keyboard navigation for FAQ
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.setAttribute('role', 'button');
    question.setAttribute('aria-expanded', 'false');
    
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
        }
    });
    
    // Update aria-expanded when toggled
    const observer = new MutationObserver(() => {
        const isActive = item.classList.contains('active');
        question.setAttribute('aria-expanded', isActive.toString());
    });
    
    observer.observe(item, { attributes: true, attributeFilter: ['class'] });
});

// Trap focus in mobile menu when open
if (mobileMenuToggle && navMenu) {
    const focusableElements = navMenu.querySelectorAll('a, button');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
        
        if (e.key === 'Escape' && navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
            mobileMenuToggle.focus();
        }
    });
}

// =====================================================
// CONSOLE BRANDING
// =====================================================
console.log('%c Ekantik Capital Advisors ', 'background: linear-gradient(135deg, #f5a623 0%, #d4a017 100%); color: #0a0e1a; font-size: 16px; font-weight: bold; padding: 10px 20px;');
console.log('%c Guardrailed Buy, Borrow & Die ', 'color: #d4a017; font-size: 12px; font-weight: bold;');
console.log('%c Founding Member Cohort Now Open ', 'color: #b8c1d9; font-size: 11px;');

// =====================================================
// EXPORT FOR TESTING
// =====================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePhone,
        debounce
    };
}