/* ============================================
   LANDING PAGE JAVASCRIPT
   Improved Loading Animation - Responsive
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const landingPage = document.getElementById('landingPage');
    const portfolioMain = document.getElementById('portfolioMain');
    const loadingScreen = document.getElementById('loadingScreen');

    // Check if user has already visited
    const hasVisited = sessionStorage.getItem('portfolioVisited');

    // If already visited in this session, skip landing and loading
    if (hasVisited) {
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        if (landingPage) {
            landingPage.style.display = 'none';
            landingPage.classList.add('hidden');
        }
        if (portfolioMain) {
            portfolioMain.classList.add('visible');
        }
    }
});

// Enter portfolio function with loading animation
function enterPortfolio() {
    const landingPage = document.getElementById('landingPage');
    const portfolioMain = document.getElementById('portfolioMain');
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (!landingPage || !portfolioMain) return;
    
    // Mark as visited
    sessionStorage.setItem('portfolioVisited', 'true');
    
    // Show loading screen
    if (loadingScreen) {
        loadingScreen.classList.add('active');
        
        // Get elements
        const codeLines = loadingScreen.querySelectorAll('.code-line');
        const progressBar = loadingScreen.querySelector('.progress-bar');
        const loadingText = loadingScreen.querySelector('.loading-text');
        
        // Loading messages
        const messages = [
            'Initializing...',
            'Loading components...',
            'Preparing UI...',
            'Almost ready...',
            'Welcome!'
        ];
        
        let progress = 0;
        let messageIndex = 0;
        
        // Animate code lines first
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('visible');
            }, index * 300);
        });
        
        // Start progress after code lines start
        setTimeout(() => {
            const progressInterval = setInterval(() => {
                progress += Math.random() * 20 + 10;
                
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);
                    
                    if (progressBar) {
                        progressBar.style.width = '100%';
                    }
                    if (loadingText) {
                        loadingText.textContent = 'Welcome!';
                    }
                    
                    // Transition to portfolio
                    setTimeout(() => {
                        loadingScreen.classList.add('fade-out');
                        
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                            landingPage.style.display = 'none';
                            landingPage.classList.add('hidden');
                            portfolioMain.classList.add('visible');
                            window.scrollTo(0, 0);
                        }, 400);
                    }, 200);
                } else {
                    if (progressBar) {
                        progressBar.style.width = progress + '%';
                    }
                    
                    // Update message based on progress
                    const newIndex = Math.min(
                        Math.floor((progress / 100) * messages.length),
                        messages.length - 1
                    );
                    if (newIndex !== messageIndex && loadingText) {
                        messageIndex = newIndex;
                        loadingText.textContent = messages[messageIndex];
                    }
                }
            }, 120);
        }, 200);
        
    } else {
        // No loading screen, direct transition
        landingPage.style.display = 'none';
        landingPage.classList.add('hidden');
        portfolioMain.classList.add('visible');
        window.scrollTo(0, 0);
    }
}

// Keyboard support - Enter key only
document.addEventListener('keydown', function(e) {
    const landingPage = document.getElementById('landingPage');
    if (landingPage && !landingPage.classList.contains('hidden') && landingPage.style.display !== 'none') {
        if (e.key === 'Enter') {
            e.preventDefault();
            enterPortfolio();
        }
    }
});
