/* ═══════════════════════════════════════════════════════════════
   AI MATH SOLVER - LOGIN & AUTH SYSTEM
   Version: 2.0 Ultimate Edition
   ═══════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────── 
// USER DATABASE (In-memory storage)
// ─────────────────────────────────────────────────────────────── 

const USERS_DB = {
    'user': { password: '1234', role: 'user', name: 'User' },
    'admin': { password: 'admin123', role: 'admin', name: 'Administrator' },
    'demo': { password: 'demo', role: 'user', name: 'Demo User' }
};

// ─────────────────────────────────────────────────────────────── 
// AUTH STATE MANAGEMENT
// ─────────────────────────────────────────────────────────────── 

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.sessionKey = 'mathSolverSession';
        this.init();
    }

    init() {
        // Check for saved session
        this.checkSavedSession();
        
        // Setup event listeners
        this.setupLoginEvents();
        this.setupLogoutEvents();
        
        // Initialize background animation
        this.initBackground();
    }

    // ─────────────────────────────────────────────────────────────── 
    // SESSION MANAGEMENT
    // ─────────────────────────────────────────────────────────────── 

    checkSavedSession() {
        try {
            const saved = sessionStorage.getItem(this.sessionKey);
            if (saved) {
                const session = JSON.parse(saved);
                if (this.validateSession(session)) {
                    this.currentUser = session;
                    this.redirectToApp();
                }
            }
        } catch (error) {
            console.error('Session check error:', error);
            this.clearSession();
        }
    }

    validateSession(session) {
        // Check if session has required fields
        return session && 
               session.username && 
               session.role &&
               session.timestamp &&
               (Date.now() - session.timestamp < 24 * 60 * 60 * 1000); // 24 hours
    }

    saveSession(user) {
        const session = {
            username: user.username,
            role: user.role,
            name: user.name,
            timestamp: Date.now()
        };
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
        this.currentUser = session;
    }

    clearSession() {
        sessionStorage.removeItem(this.sessionKey);
        this.currentUser = null;
    }

    // ─────────────────────────────────────────────────────────────── 
    // LOGIN FUNCTIONALITY
    // ─────────────────────────────────────────────────────────────── 

    setupLoginEvents() {
        const loginBtn = document.getElementById('loginBtn');
        const usernameInput = document.getElementById('loginUsername');
        const passwordInput = document.getElementById('loginPassword');
        const rememberCheck = document.getElementById('rememberCheck');

        // Login button click
        loginBtn?.addEventListener('click', () => this.handleLogin());

        // Enter key press
        [usernameInput, passwordInput].forEach(input => {
            input?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleLogin();
            });
        });

        // Check for remembered username
        const remembered = localStorage.getItem('rememberedUser');
        if (remembered && usernameInput) {
            usernameInput.value = remembered;
            rememberCheck.checked = true;
        }
    }

    handleLogin() {
        const username = document.getElementById('loginUsername')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;
        const remember = document.getElementById('rememberCheck')?.checked;

        // Validation
        if (!username || !password) {
            this.showNotification('Iltimos, barcha maydonlarni to\'ldiring!', 'error');
            return;
        }

        // Show loading
        this.showLoading('Kirish...');

        // Simulate network delay
        setTimeout(() => {
            const user = USERS_DB[username.toLowerCase()];

            if (user && user.password === password) {
                // Successful login
                this.handleSuccessfulLogin(username, user, remember);
            } else {
                // Failed login
                this.handleFailedLogin();
            }
        }, 1000);
    }

    handleSuccessfulLogin(username, user, remember) {
        // Save session
        this.saveSession({
            username: username,
            role: user.role,
            name: user.name
        });

        // Remember username if checked
        if (remember) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }

        // Show success notification
        this.showNotification(`Xush kelibsiz, ${user.name}! 🎉`, 'success');

        // Hide loading and redirect
        setTimeout(() => {
            this.hideLoading();
            this.redirectToApp();
        }, 800);
    }

    handleFailedLogin() {
        this.hideLoading();
        this.showNotification('Noto\'g\'ri username yoki parol! ❌', 'error');
        
        // Shake animation
        const loginBox = document.querySelector('.login-box');
        loginBox?.classList.add('shake');
        setTimeout(() => loginBox?.classList.remove('shake'), 500);
        
        // Clear password field
        const passwordInput = document.getElementById('loginPassword');
        if (passwordInput) passwordInput.value = '';
        passwordInput?.focus();
    }

    // ─────────────────────────────────────────────────────────────── 
    // LOGOUT FUNCTIONALITY
    // ─────────────────────────────────────────────────────────────── 

    setupLogoutEvents() {
        // Main logout button
        document.getElementById('btnLogout')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Admin logout button
        document.getElementById('btnAdminLogout')?.addEventListener('click', () => {
            this.handleLogout();
        });
    }

    handleLogout() {
        // Show confirmation
        if (!confirm('Haqiqatan ham chiqmoqchimisiz?')) return;

        // Show loading
        this.showLoading('Chiqilmoqda...');

        setTimeout(() => {
            // Clear session
            this.clearSession();

            // Clear any user data
            this.clearUserData();

            // Show notification
            this.showNotification('Muvaffaqiyatli chiqildi! 👋', 'info');

            // Redirect to login
            this.hideLoading();
            this.redirectToLogin();
        }, 500);
    }

    clearUserData() {
        // Clear any cached user data
        sessionStorage.removeItem('userStats');
        sessionStorage.removeItem('userHistory');
    }

    // ─────────────────────────────────────────────────────────────── 
    // PAGE NAVIGATION
    // ─────────────────────────────────────────────────────────────── 

    redirectToApp() {
        if (!this.currentUser) return;

        // Hide login page
        const loginPage = document.getElementById('loginPage');
        loginPage?.classList.add('hidden');

        // Show appropriate page based on role
        if (this.currentUser.role === 'admin') {
            this.showAdminPanel();
        } else {
            this.showMainApp();
        }

        // Update UI with user info
        this.updateUserUI();
    }

    redirectToLogin() {
        // Hide all pages
        document.getElementById('mainApp')?.classList.add('hidden');
        document.getElementById('adminPanel')?.classList.add('hidden');

        // Show login page
        const loginPage = document.getElementById('loginPage');
        loginPage?.classList.remove('hidden');

        // Clear form
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
    }

    showMainApp() {
        const mainApp = document.getElementById('mainApp');
        mainApp?.classList.remove('hidden');
    }

    showAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        adminPanel?.classList.remove('hidden');
    }

    updateUserUI() {
        // Update user avatar
        const userAvatar = document.getElementById('currentUser');
        if (userAvatar && this.currentUser) {
            userAvatar.textContent = this.currentUser.name.charAt(0).toUpperCase();
        }

        // Update welcome message (if exists)
        const welcomeMsg = document.querySelector('.welcome-message');
        if (welcomeMsg && this.currentUser) {
            welcomeMsg.textContent = `Salom, ${this.currentUser.name}!`;
        }
    }

    // ─────────────────────────────────────────────────────────────── 
    // UI HELPERS
    // ─────────────────────────────────────────────────────────────── 

    showLoading(text = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        if (overlay) {
            overlay.classList.remove('hidden');
            if (loadingText) loadingText.textContent = text;
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay?.classList.add('hidden');
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
            <button class="notification-close">×</button>
        `;

        // Add styles
        notification.style.cssText = `
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-left: 4px solid ${this.getNotificationColor(type)};
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            margin-bottom: var(--spacing-sm);
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--spacing-md);
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;

        // Add to container
        container.appendChild(notification);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#43e97b',
            error: '#fa709a',
            warning: '#feca57',
            info: '#4facfe'
        };
        return colors[type] || colors.info;
    }

    // ─────────────────────────────────────────────────────────────── 
    // BACKGROUND ANIMATION
    // ─────────────────────────────────────────────────────────────── 

    initBackground() {
        const canvas = document.getElementById('bgCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Math symbols to animate
        const symbols = ['∑', '∫', '∂', 'π', '∞', '√', '±', '≈', '≠', '≤', '≥', '∝', 'α', 'β', 'γ', 'θ'];
        const particles = [];

        // Create particles
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                speed: 0.2 + Math.random() * 0.5,
                opacity: 0.1 + Math.random() * 0.3,
                size: 20 + Math.random() * 20
            });
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#667eea';

            particles.forEach(p => {
                ctx.globalAlpha = p.opacity;
                ctx.font = `${p.size}px Arial`;
                ctx.fillText(p.symbol, p.x, p.y);

                // Move particle
                p.y -= p.speed;

                // Reset if out of bounds
                if (p.y < -50) {
                    p.y = canvas.height + 50;
                    p.x = Math.random() * canvas.width;
                }
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ─────────────────────────────────────────────────────────────── 
    // PUBLIC API
    // ─────────────────────────────────────────────────────────────── 

    getCurrentUser() {
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
}

// ─────────────────────────────────────────────────────────────── 
// INITIALIZE AUTH SYSTEM
// ─────────────────────────────────────────────────────────────── 

let authSystem;

document.addEventListener('DOMContentLoaded', () => {
    authSystem = new AuthSystem();
    
    // Make it globally accessible
    window.authSystem = authSystem;
    
    console.log('🔐 Auth System initialized');
    console.log('Available users: user/1234, admin/admin123, demo/demo');
});

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-icon {
        font-size: 1.2rem;
        font-weight: bold;
    }
    
    .notification-close {
        background: transparent;
        border: none;
        color: var(--text-muted);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s;
    }
    
    .notification-close:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }
`;
document.head.appendChild(style);