/* ============================================
   LANDING PAGE JAVASCRIPT
   With Code Loading Animation
   ============================================ */

// Elements
const landingPage = document.getElementById('landingPage');
const portfolioMain = document.getElementById('portfolioMain');
const loadingScreen = document.getElementById('loadingScreen');

// Check if user has already visited
const hasVisited = sessionStorage.getItem('portfolioVisited');

// If already visited in this session, skip landing and loading
if (hasVisited && landingPage && portfolioMain) {
    if (loadingScreen) loadingScreen.style.display = 'none';
    landingPage.classList.add('hidden');
    portfolioMain.classList.add('visible');
}

// Enter portfolio function with loading animation
function enterPortfolio() {
    if (!landingPage || !portfolioMain) return;
    
    // Mark as visited
    sessionStorage.setItem('portfolioVisited', 'true');
    
    // Show loading screen
    if (loadingScreen) {
        loadingScreen.classList.add('active');
        
        // Animate code lines
        const codeLines = loadingScreen.querySelectorAll('.code-line');
        const progressBar = loadingScreen.querySelector('.progress-bar');
        const loadingText = loadingScreen.querySelector('.loading-text');
        
        // Loading messages
        const messages = [
            'Initializing...',
            'Loading components...',
            'Fetching projects...',
            'Preparing UI...',
            'Almost ready...',
            'Welcome!'
        ];
        
        let progress = 0;
        let messageIndex = 0;
        
        // Animate progress
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                // Hide loading, show portfolio
                setTimeout(() => {
                    loadingScreen.classList.add('fade-out');
                    
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        landingPage.classList.add('hidden');
                        portfolioMain.classList.add('visible');
                        window.scrollTo({ top: 0, behavior: 'instant' });
                    }, 500);
                }, 300);
            }
            
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            
            // Update message
            const newMessageIndex = Math.floor((progress / 100) * (messages.length - 1));
            if (newMessageIndex !== messageIndex && loadingText) {
                messageIndex = newMessageIndex;
                loadingText.textContent = messages[messageIndex];
            }
        }, 150);
        
        // Animate code lines sequentially
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('visible');
            }, index * 400);
        });
        
    } else {
        // No loading screen, direct transition
        landingPage.classList.add('hidden');
        portfolioMain.classList.add('visible');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
}

// Keyboard support - Enter key only (no scroll)
window.addEventListener('keydown', (e) => {
    if (landingPage && !landingPage.classList.contains('hidden')) {
        if (e.key === 'Enter') {
            e.preventDefault();
            enterPortfolio();
        }
    }
});
