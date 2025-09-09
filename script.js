// DOM Elements
const ageModal = document.getElementById('ageModal');
const gameModal = document.getElementById('gameModal');
const ageConfirm = document.getElementById('ageConfirm');
const ageDecline = document.getElementById('ageDecline');
const closeGame = document.getElementById('closeGame');
const gameFrame = document.getElementById('gameFrame');
const gameCards = document.querySelectorAll('.game-card');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Age verification check
const isAgeVerified = localStorage.getItem('ageVerified');

// Show age modal if not verified
if (!isAgeVerified) {
    showAgeModal();
}

// Age verification handlers
ageConfirm.addEventListener('click', () => {
    localStorage.setItem('ageVerified', 'true');
    hideAgeModal();
});

ageDecline.addEventListener('click', () => {
    alert('You must be 18 or older to access this site.');
    window.location.href = 'https://www.google.com';
});

// Game card handlers
gameCards.forEach(card => {
    const playBtn = card.querySelector('.play-btn');
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const gameUrl = card.getAttribute('data-game');
        openGame(gameUrl);
    });
    
    // Add click handler to entire card
    card.addEventListener('click', () => {
        const gameUrl = card.getAttribute('data-game');
        openGame(gameUrl);
    });
});

// Close game modal
closeGame.addEventListener('click', closeGameModal);

// Close modal when clicking outside
gameModal.addEventListener('click', (e) => {
    if (e.target === gameModal) {
        closeGameModal();
    }
});

ageModal.addEventListener('click', (e) => {
    if (e.target === ageModal) {
        // Don't allow closing age modal by clicking outside
        return;
    }
});

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Keyboard event handlers
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (gameModal.classList.contains('show')) {
            closeGameModal();
        }
    }
});

// Functions
function showAgeModal() {
    ageModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideAgeModal() {
    ageModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openGame(gameUrl) {
    // Check age verification again
    if (!localStorage.getItem('ageVerified')) {
        showAgeModal();
        return;
    }
    
    // Add parameters to help with iframe compatibility
    const enhancedUrl = gameUrl + (gameUrl.includes('?') ? '&' : '?') + 'iframe=1&embedded=1';
    gameFrame.src = enhancedUrl;
    gameModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Add loading spinner
    const gameContainer = document.getElementById('gameContainer');
    const existingSpinner = gameContainer.querySelector('.loading');
    
    if (!existingSpinner) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = '<div class="spinner"></div>';
        gameContainer.appendChild(loadingDiv);
        
        // Remove spinner after iframe loads
        gameFrame.onload = () => {
            setTimeout(() => {
                const spinner = gameContainer.querySelector('.loading');
                if (spinner) {
                    spinner.remove();
                }
            }, 1000);
        };
        
        // Handle iframe errors
        gameFrame.onerror = () => {
            const spinner = gameContainer.querySelector('.loading');
            if (spinner) {
                spinner.remove();
            }
            console.warn('Game iframe encountered an error, but this is normal for cross-origin content');
        };
    }
}

function closeGameModal() {
    gameModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Clear iframe src to stop the game
    setTimeout(() => {
        gameFrame.src = '';
    }, 300);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.game-card, .feature-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Particle effect for hero section (optional enhancement)
function createParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '2px';
    particle.style.height = '2px';
    particle.style.background = '#00d4ff';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = window.innerHeight + 'px';
    particle.style.zIndex = '1';
    
    const hero = document.querySelector('.hero');
    hero.appendChild(particle);
    
    const animation = particle.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: `translateY(-${window.innerHeight + 100}px) scale(0)`, opacity: 0 }
    ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'linear'
    });
    
    animation.onfinish = () => {
        particle.remove();
    };
}

// Create particles periodically
setInterval(createParticle, 300);

// Responsive menu handling
function handleResize() {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

window.addEventListener('resize', handleResize);

// Add CSS for mobile menu
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            right: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: blur(10px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 50px;
            transition: right 0.3s ease;
        }
        
        .nav-menu.active {
            right: 0;
        }
        
        .nav-menu a {
            font-size: 1.5rem;
            margin: 20px 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
document.head.appendChild(style);

// Console easter egg
console.log(`
╔═══════════════════════════════════════╗
║              CyberSlots               ║
║         Welcome to the Future!        ║
║                                       ║
║  Games are for entertainment only     ║
║  Play responsibly - 18+ only          ║
╚═══════════════════════════════════════╝
`);

// Performance optimization: Lazy load game iframes
const gameObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const card = entry.target;
            // Preload game data when card comes into view
            const gameUrl = card.getAttribute('data-game');
            if (gameUrl) {
                // You could implement preloading logic here
                console.log(`Game card in view: ${card.querySelector('h3').textContent}`);
            }
        }
    });
}, {
    threshold: 0.5
});

gameCards.forEach(card => {
    gameObserver.observe(card);
});

// Add error handling for iframe loading
gameFrame.addEventListener('error', () => {
    console.error('Failed to load game');
    const gameContainer = document.getElementById('gameContainer');
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #ff0080;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
            <h3>Game Loading Error</h3>
            <p>Please try again later or contact support.</p>
        </div>
    `;
    gameContainer.appendChild(errorDiv);
});

// Track game plays (for analytics - you can integrate with your preferred analytics service)
function trackGamePlay(gameName) {
    console.log(`Game played: ${gameName}`);
    // Example: gtag('event', 'game_play', { 'game_name': gameName });
}