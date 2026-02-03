/* ============================================
   LANDING PAGE JAVASCRIPT
   ============================================ */

// Elements
const landingPage = document.getElementById('landingPage');
const portfolioMain = document.getElementById('portfolioMain');

// Check if user has already visited
const hasVisited = sessionStorage.getItem('portfolioVisited');

// If already visited in this session, skip landing
if (hasVisited && landingPage && portfolioMain) {
    landingPage.classList.add('hidden');
    portfolioMain.classList.add('visible');
}

// Enter portfolio function
function enterPortfolio() {
    if (!landingPage || !portfolioMain) return;
    
    // Mark as visited
    sessionStorage.setItem('portfolioVisited', 'true');
    
    // Hide landing page
    landingPage.classList.add('hidden');
    
    // Show portfolio immediately
    portfolioMain.classList.add('visible');
    
    // Smooth scroll to top of portfolio
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
}

// Allow scroll to bypass landing page
let scrollThreshold = 100;
let scrolled = 0;

window.addEventListener('wheel', (e) => {
    if (landingPage && !landingPage.classList.contains('hidden')) {
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
    if (landingPage && !landingPage.classList.contains('hidden')) {
        const touchDiff = touchStartY - e.touches[0].clientY;
        if (touchDiff > 50) {
            enterPortfolio();
        }
    }
});

// Keyboard support
window.addEventListener('keydown', (e) => {
    if (landingPage && !landingPage.classList.contains('hidden')) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            enterPortfolio();
        }
    }
});

// Add click anywhere to enter (except button which has its own handler)
if (landingPage) {
    landingPage.addEventListener('click', (e) => {
        if (!e.target.closest('.landing-cta')) {
            enterPortfolio();
        }
    });
}
