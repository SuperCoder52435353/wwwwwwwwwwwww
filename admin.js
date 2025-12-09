/* ═══════════════════════════════════════════════════════════════
   AI MATH SOLVER - ADMIN CONTROL PANEL
   Version: 2.0 Ultimate Edition
   ═══════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────── 
// ADMIN SYSTEM CLASS
// ─────────────────────────────────────────────────────────────── 

class AdminSystem {
    constructor() {
        this.data = {
            users: [],
            solutions: [],
            chats: [],
            logs: []
        };
        this.selectedUser = null;
        this.init();
    }

    init() {
        // Load mock data
        this.loadMockData();
        
        // Setup event listeners
        this.setupTabSystem();
        this.setupUserManagement();
        this.setupActions();
        this.setupSearch();
        
        // Initial render
        this.updateStats();
        this.renderUsers();
        this.renderSolutions();
        this.renderLogs();
        
        console.log('🛡️ Admin System initialized');
    }

    // ─────────────────────────────────────────────────────────────── 
    // MOCK DATA GENERATION
    // ─────────────────────────────────────────────────────────────── 

    loadMockData() {
        // Generate users
        this.data.users = [
            { id: 1, username: 'user1', name: 'Alisher Karimov', email: 'alisher@mail.uz', role: 'user', status: 'active', joined: '2024-01-15', problems: 45, lastActive: '2 soat oldin' },
            { id: 2, username: 'user2', name: 'Madina Toshmatova', email: 'madina@mail.uz', role: 'user', status: 'active', joined: '2024-02-20', problems: 78, lastActive: '5 daqiqa oldin' },
            { id: 3, username: 'user3', name: 'Bekzod Rahmonov', email: 'bekzod@mail.uz', role: 'user', status: 'inactive', joined: '2024-03-10', problems: 12, lastActive: '3 kun oldin' },
            { id: 4, username: 'demo', name: 'Demo User', email: 'demo@mail.uz', role: 'user', status: 'active', joined: '2024-01-01', problems: 156, lastActive: '1 soat oldin' }
        ];

        // Generate solutions
        this.data.solutions = [
            { id: 1, userId: 1, problem: '2x + 5 = 13', solution: 'x = 4', type: 'algebra', timestamp: Date.now() - 3600000, status: 'solved' },
            { id: 2, userId: 2, problem: 'y = 2x + 3', solution: 'Linear function', type: 'graph', timestamp: Date.now() - 7200000, status: 'solved' },
            { id: 3, userId: 4, problem: '∫x² dx', solution: 'x³/3 + C', type: 'calculus', timestamp: Date.now() - 1800000, status: 'solved' },
            { id: 4, userId: 1, problem: 'a² + b² = c²', solution: 'Pythagoras theorem', type: 'geometry', timestamp: Date.now() - 900000, status: 'solved' }
        ];

        // Generate chat data
        this.data.chats = this.data.users.map(user => ({
            userId: user.id,
            username: user.username,
            name: user.name,
            unread: Math.floor(Math.random() * 5),
            lastMessage: 'Salom, yordam kerakmi?',
            timestamp: Date.now() - Math.random() * 86400000
        }));

        // Generate logs
        this.data.logs = [
            { type: 'login', user: 'user1', action: 'Kirdi', timestamp: Date.now() - 3600000, ip: '192.168.1.1' },
            { type: 'solve', user: 'user2', action: 'Masala yechdi', timestamp: Date.now() - 7200000, ip: '192.168.1.2' },
            { type: 'upload', user: 'demo', action: 'Rasm yukladi', timestamp: Date.now() - 1800000, ip: '192.168.1.3' },
            { type: 'logout', user: 'user3', action: 'Chiqdi', timestamp: Date.now() - 900000, ip: '192.168.1.4' }
        ];
    }

    // ─────────────────────────────────────────────────────────────── 
    // TAB SYSTEM
    // ─────────────────────────────────────────────────────────────── 

    setupTabSystem() {
        const tabBtns = document.querySelectorAll('.admin-tab-btn');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Update buttons
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update content
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.remove('active');
            content.classList.add('hidden');
        });
        
        const targetTab = document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
        targetTab?.classList.remove('hidden');
        targetTab?.classList.add('active');
    }

    // ─────────────────────────────────────────────────────────────── 
    // STATS MANAGEMENT
    // ─────────────────────────────────────────────────────────────── 

    updateStats() {
        // Total users
        document.getElementById('adminUsers').textContent = this.data.users.length;
        
        // Total problems
        const totalProblems = this.data.users.reduce((sum, user) => sum + user.problems, 0);
        document.getElementById('adminProblems').textContent = totalProblems;
        
        // Total images
        document.getElementById('adminImages').textContent = this.data.solutions.length;
        
        // Active chats
        const activeChats = this.data.chats.filter(chat => chat.unread > 0).length;
        document.getElementById('adminChats').textContent = activeChats;
    }

    // ─────────────────────────────────────────────────────────────── 
    // USER MANAGEMENT
    // ─────────────────────────────────────────────────────────────── 

    setupUserManagement() {
        // User list rendering is handled by renderUsers()
    }

    renderUsers() {
        const container = document.getElementById('usersList');
        if (!container) return;

        container.innerHTML = this.data.users.map(user => `
            <div class="user-card" data-user-id="${user.id}">
                <div class="user-avatar-lg">
                    ${user.name.charAt(0).toUpperCase()}
                </div>
                <div class="user-info">
                    <h4>${user.name}</h4>
                    <p>@${user.username} • ${user.email}</p>
                    <div class="user-meta">
                        <span class="badge ${user.status === 'active' ? 'badge-success' : 'badge-inactive'}">
                            ${user.status === 'active' ? '🟢 Active' : '⚪ Inactive'}
                        </span>
                        <span>📊 ${user.problems} masala</span>
                        <span>🕐 ${user.lastActive}</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn-icon-sm" onclick="adminSystem.viewUser(${user.id})" title="Ko'rish">👁️</button>
                    <button class="btn-icon-sm" onclick="adminSystem.editUser(${user.id})" title="Tahrirlash">✏️</button>
                    <button class="btn-icon-sm" onclick="adminSystem.deleteUser(${user.id})" title="O'chirish">🗑️</button>
                </div>
            </div>
        `).join('');

        // Add styles for user cards
        this.addUserCardStyles();
    }

    addUserCardStyles() {
        if (document.getElementById('userCardStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'userCardStyles';
        style.textContent = `
            .user-card {
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                padding: var(--spacing-md);
                background: var(--bg-tertiary);
                border-radius: var(--radius-md);
                border: 1px solid var(--border-color);
                transition: all var(--transition-fast);
            }
            
            .user-card:hover {
                background: var(--bg-secondary);
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
            }
            
            .user-avatar-lg {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary), var(--accent-purple));
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            .user-info {
                flex: 1;
            }
            
            .user-info h4 {
                font-size: 1.1rem;
                margin-bottom: 4px;
            }
            
            .user-info p {
                color: var(--text-muted);
                font-size: 0.9rem;
                margin-bottom: 8px;
            }
            
            .user-meta {
                display: flex;
                gap: var(--spacing-sm);
                flex-wrap: wrap;
                font-size: 0.85rem;
            }
            
            .user-meta span {
                padding: 4px 8px;
                background: var(--bg-primary);
                border-radius: var(--radius-sm);
            }
            
            .badge-success {
                color: var(--accent-green);
            }
            
            .badge-inactive {
                color: var(--text-muted);
            }
            
            .user-actions {
                display: flex;
                gap: var(--spacing-xs);
                flex-shrink: 0;
            }
        `;
        document.head.appendChild(style);
    }

    viewUser(userId) {
        const user = this.data.users.find(u => u.id === userId);
        if (!user) return;
        
        alert(`User Info:\n\nName: ${user.name}\nUsername: ${user.username}\nEmail: ${user.email}\nRole: ${user.role}\nProblems Solved: ${user.problems}\nJoined: ${user.joined}`);
    }

    editUser(userId) {
        const user = this.data.users.find(u => u.id === userId);
        if (!user) return;
        
        const newName = prompt('Yangi ism:', user.name);
        if (newName && newName.trim()) {
            user.name = newName.trim();
            this.renderUsers();
            this.showNotification('Foydalanuvchi yangilandi! ✓', 'success');
        }
    }

    deleteUser(userId) {
        if (!confirm('Haqiqatan ham o\'chirmoqchimisiz?')) return;
        
        this.data.users = this.data.users.filter(u => u.id !== userId);
        this.renderUsers();
        this.updateStats();
        this.showNotification('Foydalanuvchi o\'chirildi!', 'success');
    }

    // ─────────────────────────────────────────────────────────────── 
    // SOLUTIONS MANAGEMENT
    // ─────────────────────────────────────────────────────────────── 

    renderSolutions() {
        const container = document.getElementById('solutionsList');
        if (!container) return;

        container.innerHTML = this.data.solutions.map(sol => {
            const user = this.data.users.find(u => u.id === sol.userId);
            const timeAgo = this.getTimeAgo(sol.timestamp);
            
            return `
                <div class="solution-card">
                    <div class="solution-header">
                        <div class="solution-type type-${sol.type}">${this.getTypeIcon(sol.type)} ${sol.type}</div>
                        <span class="solution-time">${timeAgo}</span>
                    </div>
                    <div class="solution-body">
                        <div class="solution-problem">
                            <strong>Masala:</strong> ${sol.problem}
                        </div>
                        <div class="solution-answer">
                            <strong>Yechim:</strong> ${sol.solution}
                        </div>
                    </div>
                    <div class="solution-footer">
                        <div class="solution-user">
                            <div class="user-avatar-sm">${user?.name.charAt(0).toUpperCase()}</div>
                            <span>${user?.name}</span>
                        </div>
                        <div class="solution-actions">
                            <button class="btn-icon-sm" title="Ko'rish">👁️</button>
                            <button class="btn-icon-sm" title="Export">📥</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.addSolutionCardStyles();
    }

    addSolutionCardStyles() {
        if (document.getElementById('solutionCardStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'solutionCardStyles';
        style.textContent = `
            .solution-card {
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                padding: var(--spacing-md);
                margin-bottom: var(--spacing-sm);
                transition: all var(--transition-fast);
            }
            
            .solution-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
            }
            
            .solution-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-sm);
            }
            
            .solution-type {
                padding: 4px 12px;
                border-radius: var(--radius-sm);
                font-size: 0.85rem;
                font-weight: 600;
            }
            
            .type-algebra { background: rgba(79, 172, 254, 0.2); color: var(--accent-blue); }
            .type-graph { background: rgba(67, 233, 123, 0.2); color: var(--accent-green); }
            .type-calculus { background: rgba(168, 85, 247, 0.2); color: var(--accent-purple); }
            .type-geometry { background: rgba(250, 112, 154, 0.2); color: var(--accent-orange); }
            
            .solution-time {
                color: var(--text-muted);
                font-size: 0.85rem;
            }
            
            .solution-body {
                margin-bottom: var(--spacing-md);
            }
            
            .solution-problem,
            .solution-answer {
                padding: var(--spacing-sm);
                background: var(--bg-secondary);
                border-radius: var(--radius-sm);
                margin-bottom: var(--spacing-xs);
                font-family: 'Courier New', monospace;
            }
            
            .solution-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .solution-user {
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
                font-size: 0.9rem;
            }
            
            .user-avatar-sm {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary), var(--accent-purple));
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 0.9rem;
                font-weight: bold;
            }
            
            .solution-actions {
                display: flex;
                gap: var(--spacing-xs);
            }
        `;
        document.head.appendChild(style);
    }

    getTypeIcon(type) {
        const icons = {
            algebra: '🔢',
            graph: '📊',
            calculus: '∫',
            geometry: '📐'
        };
        return icons[type] || '🧮';
    }

    // ─────────────────────────────────────────────────────────────── 
    // LOGS MANAGEMENT
    // ─────────────────────────────────────────────────────────────── 

    renderLogs() {
        const container = document.getElementById('logsList');
        if (!container) return;

        container.innerHTML = this.data.logs.map(log => {
            const timeAgo = this.getTimeAgo(log.timestamp);
            
            return `
                <div class="log-entry log-${log.type}">
                    <div class="log-icon">${this.getLogIcon(log.type)}</div>
                    <div class="log-content">
                        <div class="log-action">
                            <strong>${log.user}</strong> ${log.action}
                        </div>
                        <div class="log-meta">
                            <span>🕐 ${timeAgo}</span>
                            <span>🌐 ${log.ip}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.addLogStyles();
    }

    addLogStyles() {
        if (document.getElementById('logStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'logStyles';
        style.textContent = `
            .log-entry {
                display: flex;
                gap: var(--spacing-md);
                padding: var(--spacing-md);
                background: var(--bg-tertiary);
                border-radius: var(--radius-md);
                border-left: 3px solid;
                margin-bottom: var(--spacing-xs);
            }
            
            .log-login { border-color: var(--accent-green); }
            .log-logout { border-color: var(--accent-orange); }
            .log-solve { border-color: var(--accent-blue); }
            .log-upload { border-color: var(--accent-purple); }
            
            .log-icon {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--bg-secondary);
                border-radius: 50%;
                font-size: 1.2rem;
                flex-shrink: 0;
            }
            
            .log-content {
                flex: 1;
            }
            
            .log-action {
                margin-bottom: 4px;
            }
            
            .log-meta {
                display: flex;
                gap: var(--spacing-md);
                font-size: 0.85rem;
                color: var(--text-muted);
            }
        `;
        document.head.appendChild(style);
    }

    getLogIcon(type) {
        const icons = {
            login: '🔓',
            logout: '🔒',
            solve: '✓',
            upload: '📤'
        };
        return icons[type] || '📝';
    }

    // ─────────────────────────────────────────────────────────────── 
    // ACTIONS
    // ─────────────────────────────────────────────────────────────── 

    setupActions() {
        // Refresh button
        document.getElementById('btnAdminRefresh')?.addEventListener('click', () => {
            this.refresh();
        });

        // Export button
        document.getElementById('btnAdminExport')?.addEventListener('click', () => {
            this.exportData();
        });

        // Export data button
        document.getElementById('btnExportData')?.addEventListener('click', () => {
            this.exportData();
        });

        // Clear all button
        document.getElementById('btnClearAll')?.addEventListener('click', () => {
            this.clearAllData();
        });
    }

    refresh() {
        this.showNotification('Ma\'lumotlar yangilanmoqda...', 'info');
        
        setTimeout(() => {
            this.loadMockData();
            this.updateStats();
            this.renderUsers();
            this.renderSolutions();
            this.renderLogs();
            this.showNotification('Muvaffaqiyatli yangilandi! ✓', 'success');
        }, 1000);
    }

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `math-solver-data-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Ma\'lumotlar eksport qilindi! 📥', 'success');
    }

    clearAllData() {
        if (!confirm('⚠️ DIQQAT! Barcha ma\'lumotlar o\'chiriladi. Davom etasizmi?')) return;
        if (!confirm('Ishonchingiz komilmi? Bu amalni qaytarib bo\'lmaydi!')) return;
        
        this.data = {
            users: [],
            solutions: [],
            chats: [],
            logs: []
        };
        
        this.updateStats();
        this.renderUsers();
        this.renderSolutions();
        this.renderLogs();
        
        this.showNotification('Barcha ma\'lumotlar o\'chirildi!', 'warning');
    }

    // ─────────────────────────────────────────────────────────────── 
    // SEARCH
    // ─────────────────────────────────────────────────────────────── 

    setupSearch() {
        const searchInput = document.getElementById('searchUsers');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            this.filterUsers(query);
        });
    }

    filterUsers(query) {
        const userCards = document.querySelectorAll('.user-card');
        
        userCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? 'flex' : 'none';
        });
    }

    // ─────────────────────────────────────────────────────────────── 
    // HELPERS
    // ─────────────────────────────────────────────────────────────── 

    getTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return `${seconds} soniya oldin`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)} daqiqa oldin`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} soat oldin`;
        return `${Math.floor(seconds / 86400)} kun oldin`;
    }

    showNotification(message, type = 'info') {
        if (window.authSystem) {
            window.authSystem.showNotification(message, type);
        }
    }
}

// ─────────────────────────────────────────────────────────────── 
// INITIALIZE ADMIN SYSTEM
// ─────────────────────────────────────────────────────────────── 

let adminSystem;

document.addEventListener('DOMContentLoaded', () => {
    adminSystem = new AdminSystem();
    window.adminSystem = adminSystem;
    
    console.log('🛡️ Admin System ready');
});