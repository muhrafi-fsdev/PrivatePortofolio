/* ============================================
   LANDING PAGE JAVASCRIPT
   ============================================ */

// Check if user has already visited
const hasVisited = sessionStorage.getItem('portfolioVisited');

// Elements
const landingPage = document.getElementById('landingPage');
const portfolioMain = document.getElementById('portfolioMain');

// If already visited in this session, skip landing
if (hasVisited) {
    landingPage.classList.add('hidden');
    portfolioMain.classList.add('visible');
}

// Enter portfolio function
function enterPortfolio() {
    // Mark as visited
    sessionStorage.setItem('portfolioVisited', 'true');
    
    // Hide landing page
    landingPage.classList.add('hidden');
    
    // Show portfolio with delay
    setTimeout(() => {
        portfolioMain.classList.add('visible');
    }, 300);
    
    // Smooth scroll to top of portfolio
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
}

// Allow scroll to bypass landing page
let scrollThreshold = 100;
let scrolled = 0;

window.addEventListener('wheel', (e) => {
    if (!landingPage.classList.contains('hidden')) {
        scrolled += Math.abs(e.deltaY);
        if (scrolled > scrollThreshold) {
            enterPortfolio();
        }
    }
});

// Touch scroll for mobile
let touchStartY = 0;

window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    if (!landingPage.classList.contains('hidden')) {
        const touchDiff = touchStartY - e.touches[0].clientY;
        if (touchDiff > 50) {
            enterPortfolio();
        }
    }
});

// Keyboard support
window.addEventListener('keydown', (e) => {
    if (!landingPage.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            enterPortfolio();
        }
    }
});

// Add click anywhere to enter (except button which has its own handler)
landingPage.addEventListener('click', (e) => {
    if (e.target === landingPage || e.target.closest('.landing-content') && !e.target.closest('.landing-cta')) {
        // Don't trigger on the button
        if (!e.target.closest('.landing-cta')) {
            enterPortfolio();
        }
    }
});
