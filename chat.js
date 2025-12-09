/* ═══════════════════════════════════════════════════════════════
   AI MATH SOLVER - CROSS-DEVICE CHAT SYSTEM
   Version: 2.0 Ultimate Edition
   ═══════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────── 
// CHAT SYSTEM CLASS
// ─────────────────────────────────────────────────────────────── 

class ChatSystem {
    constructor() {
        this.conversations = {};
        this.currentConversation = null;
        this.unreadCounts = {};
        this.syncInterval = null;
        this.init();
    }

    init() {
        // Load saved conversations
        this.loadConversations();
        
        // Setup event listeners
        this.setupUserChatModal();
        this.setupAdminChatInterface();
        this.setupChatButtons();
        
        // Start sync (simulated real-time)
        this.startSync();
        
        console.log('💬 Chat System initialized');
    }

    // ─────────────────────────────────────────────────────────────── 
    // DATA MANAGEMENT
    // ─────────────────────────────────────────────────────────────── 

    loadConversations() {
        try {
            const saved = sessionStorage.getItem('chatConversations');
            if (saved) {
                this.conversations = JSON.parse(saved);
            } else {
                // Initialize with demo data
                this.initializeDemoChats();
            }
            this.updateUnreadCounts();
        } catch (error) {
            console.error('Error loading conversations:', error);
            this.conversations = {};
        }
    }

    saveConversations() {
        try {
            sessionStorage.setItem('chatConversations', JSON.stringify(this.conversations));
        } catch (error) {
            console.error('Error saving conversations:', error);
        }
    }

    initializeDemoChats() {
        const demoUsers = [
            { id: 'user1', name: 'Alisher Karimov' },
            { id: 'user2', name: 'Madina Toshmatova' },
            { id: 'demo', name: 'Demo User' }
        ];

        demoUsers.forEach(user => {
            this.conversations[user.id] = {
                userId: user.id,
                userName: user.name,
                messages: [
                    {
                        id: Date.now() + Math.random(),
                        sender: 'admin',
                        text: 'Assalomu alaykum! Sizga qanday yordam bera olaman?',
                        timestamp: Date.now() - 86400000, // 1 day ago
                        read: true
                    }
                ],
                lastActivity: Date.now() - 86400000
            };
        });
        
        this.saveConversations();
    }

    // ─────────────────────────────────────────────────────────────── 
    // USER CHAT MODAL (For regular users)
    // ─────────────────────────────────────────────────────────────── 

    setupUserChatModal() {
        const btnAdminChat = document.getElementById('btnAdminChat');
        const chatModal = document.getElementById('chatModal');
        const btnCloseChat = document.getElementById('btnCloseChat');
        const btnSendChat = document.getElementById('btnSendChat');
        const chatInput = document.getElementById('chatInput');

        // Open chat modal
        btnAdminChat?.addEventListener('click', () => {
            this.openUserChat();
        });

        // Close chat modal
        btnCloseChat?.addEventListener('click', () => {
            this.closeUserChat();
        });

        // Close on outside click
        chatModal?.addEventListener('click', (e) => {
            if (e.target === chatModal) {
                this.closeUserChat();
            }
        });

        // Send message
        btnSendChat?.addEventListener('click', () => {
            this.sendUserMessage();
        });

        // Send on Enter key
        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendUserMessage();
            }
        });
    }

    openUserChat() {
        const modal = document.getElementById('chatModal');
        modal?.classList.remove('hidden');
        
        // Load user's conversation
        const currentUser = window.authSystem?.getCurrentUser();
        if (currentUser) {
            this.currentConversation = currentUser.username;
            this.renderUserMessages();
            this.markAsRead(currentUser.username);
        }
        
        // Focus input
        setTimeout(() => {
            document.getElementById('chatInput')?.focus();
        }, 100);
    }

    closeUserChat() {
        const modal = document.getElementById('chatModal');
        modal?.classList.add('hidden');
        this.currentConversation = null;
    }

    renderUserMessages() {
        const container = document.getElementById('userChatMessages');
        if (!container) return;

        const currentUser = window.authSystem?.getCurrentUser();
        if (!currentUser) return;

        const conversation = this.conversations[currentUser.username] || {
            messages: []
        };

        if (conversation.messages.length === 0) {
            container.innerHTML = `
                <div class="empty-chat-msg">
                    <div class="chat-icon">💬</div>
                    <p>Admin bilan suhbatni boshlang</p>
                </div>
            `;
        } else {
            container.innerHTML = conversation.messages.map(msg => `
                <div class="chat-message ${msg.sender === 'admin' ? 'admin-message' : 'user-message'}">
                    <div class="message-avatar">
                        ${msg.sender === 'admin' ? '🛡️' : currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="message-content">
                        <div class="message-text">${this.escapeHtml(msg.text)}</div>
                        <div class="message-time">${this.formatTime(msg.timestamp)}</div>
                    </div>
                </div>
            `).join('');

            // Scroll to bottom
            container.scrollTop = container.scrollHeight;
        }

        this.addChatMessageStyles();
    }

    sendUserMessage() {
        const input = document.getElementById('chatInput');
        const text = input?.value.trim();
        
        if (!text) return;

        const currentUser = window.authSystem?.getCurrentUser();
        if (!currentUser) return;

        // Create or get conversation
        if (!this.conversations[currentUser.username]) {
            this.conversations[currentUser.username] = {
                userId: currentUser.username,
                userName: currentUser.name,
                messages: [],
                lastActivity: Date.now()
            };
        }

        // Add message
        const message = {
            id: Date.now() + Math.random(),
            sender: 'user',
            text: text,
            timestamp: Date.now(),
            read: false
        };

        this.conversations[currentUser.username].messages.push(message);
        this.conversations[currentUser.username].lastActivity = Date.now();

        // Save and render
        this.saveConversations();
        this.renderUserMessages();
        this.updateAdminChatList();

        // Clear input
        input.value = '';

        // Simulate admin response (for demo)
        this.simulateAdminResponse(currentUser.username);
    }

    simulateAdminResponse(userId) {
        const responses = [
            'Xabaringiz qabul qilindi. Tez orada javob beramiz! 👍',
            'Sizga yordam berishga tayyormiz. Iltimos, kutib turing...',
            'Rahmat! Admin tez orada javob beradi.',
            'Savolingiz ko\'rib chiqilmoqda... ⏳'
        ];

        setTimeout(() => {
            const conversation = this.conversations[userId];
            if (conversation) {
                conversation.messages.push({
                    id: Date.now() + Math.random(),
                    sender: 'admin',
                    text: responses[Math.floor(Math.random() * responses.length)],
                    timestamp: Date.now(),
                    read: false
                });
                
                this.saveConversations();
                
                // Update if user is viewing this chat
                if (this.currentConversation === userId) {
                    this.renderUserMessages();
                } else {
                    this.updateUnreadCounts();
                    this.updateBadges();
                }
            }
        }, 2000 + Math.random() * 3000);
    }

    // ─────────────────────────────────────────────────────────────── 
    // ADMIN CHAT INTERFACE (For admin panel)
    // ─────────────────────────────────────────────────────────────── 

    setupAdminChatInterface() {
        // Admin chat interface is in admin panel
        // It will be rendered when admin switches to chat tab
    }

    updateAdminChatList() {
        const container = document.getElementById('chatUsersList');
        if (!container) return;

        const conversations = Object.values(this.conversations)
            .sort((a, b) => b.lastActivity - a.lastActivity);

        if (conversations.length === 0) {
            container.innerHTML = `
                <div class="empty-msg">
                    <span>💬</span>
                    <p>Hali xabarlar yo'q</p>
                </div>
            `;
            return;
        }

        container.innerHTML = conversations.map(conv => {
            const unread = this.getUnreadCount(conv.userId, 'admin');
            const lastMsg = conv.messages[conv.messages.length - 1];
            
            return `
                <div class="chat-user-item ${this.currentConversation === conv.userId ? 'active' : ''}" 
                     data-user-id="${conv.userId}"
                     onclick="chatSystem.selectAdminConversation('${conv.userId}')">
                    <div class="chat-user-avatar">
                        ${conv.userName.charAt(0).toUpperCase()}
                    </div>
                    <div class="chat-user-info">
                        <div class="chat-user-name">
                            ${conv.userName}
                            ${unread > 0 ? `<span class="unread-badge">${unread}</span>` : ''}
                        </div>
                        <div class="chat-user-preview">
                            ${lastMsg ? this.truncate(lastMsg.text, 30) : 'Xabar yo\'q'}
                        </div>
                    </div>
                    <div class="chat-user-time">
                        ${this.getRelativeTime(conv.lastActivity)}
                    </div>
                </div>
            `;
        }).join('');

        this.addChatUserStyles();
    }

    selectAdminConversation(userId) {
        this.currentConversation = userId;
        this.markAsRead(userId, 'admin');
        this.renderAdminMessages(userId);
        this.updateAdminChatList();
        this.updateBadges();
    }

    renderAdminMessages(userId) {
        const container = document.getElementById('chatMessagesArea');
        if (!container) return;

        const conversation = this.conversations[userId];
        if (!conversation) return;

        container.innerHTML = `
            <div class="admin-chat-header">
                <div class="chat-user-avatar-lg">
                    ${conversation.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h4>${conversation.userName}</h4>
                    <p class="text-muted">@${conversation.userId}</p>
                </div>
            </div>
            <div class="admin-chat-messages" id="adminChatMessages">
                ${conversation.messages.map(msg => `
                    <div class="admin-chat-message ${msg.sender === 'admin' ? 'sent' : 'received'}">
                        <div class="message-bubble">
                            <div class="message-text">${this.escapeHtml(msg.text)}</div>
                            <div class="message-time">${this.formatTime(msg.timestamp)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="admin-chat-input">
                <input type="text" id="adminChatInput" placeholder="Xabar yozing..." />
                <button id="btnSendAdminChat" class="btn-send">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>
        `;

        // Scroll to bottom
        setTimeout(() => {
            const msgContainer = document.getElementById('adminChatMessages');
            if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
        }, 100);

        // Setup send button
        document.getElementById('btnSendAdminChat')?.addEventListener('click', () => {
            this.sendAdminMessage(userId);
        });

        document.getElementById('adminChatInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendAdminMessage(userId);
            }
        });

        this.addAdminChatStyles();
    }

    sendAdminMessage(userId) {
        const input = document.getElementById('adminChatInput');
        const text = input?.value.trim();
        
        if (!text) return;

        const conversation = this.conversations[userId];
        if (!conversation) return;

        // Add message
        conversation.messages.push({
            id: Date.now() + Math.random(),
            sender: 'admin',
            text: text,
            timestamp: Date.now(),
            read: false
        });

        conversation.lastActivity = Date.now();

        // Save and render
        this.saveConversations();
        this.renderAdminMessages(userId);
        this.updateAdminChatList();

        // Clear input
        input.value = '';
    }

    // ─────────────────────────────────────────────────────────────── 
    // CHAT BUTTONS & BADGES
    // ─────────────────────────────────────────────────────────────── 

    setupChatButtons() {
        // Update badges periodically
        setInterval(() => {
            this.updateBadges();
        }, 5000);
        
        this.updateBadges();
    }

    updateBadges() {
        const currentUser = window.authSystem?.getCurrentUser();
        if (!currentUser) return;

        if (currentUser.role === 'admin') {
            // Admin sees total unread from all users
            const totalUnread = Object.keys(this.conversations).reduce((sum, userId) => {
                return sum + this.getUnreadCount(userId, 'admin');
            }, 0);
            
            const badge = document.getElementById('chatBadge');
            if (badge) {
                if (totalUnread > 0) {
                    badge.textContent = totalUnread;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }
        } else {
            // User sees unread from admin
            const unread = this.getUnreadCount(currentUser.username, 'user');
            const badge = document.getElementById('chatBadge');
            
            if (badge) {
                if (unread > 0) {
                    badge.textContent = unread;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }
        }
    }

    // ─────────────────────────────────────────────────────────────── 
    // UNREAD MANAGEMENT
    // ─────────────────────────────────────────────────────────────── 

    updateUnreadCounts() {
        this.unreadCounts = {};
        
        Object.keys(this.conversations).forEach(userId => {
            const conv = this.conversations[userId];
            
            // Count unread for admin
            const adminUnread = conv.messages.filter(msg => 
                msg.sender === 'user' && !msg.read
            ).length;
            
            // Count unread for user
            const userUnread = conv.messages.filter(msg => 
                msg.sender === 'admin' && !msg.read
            ).length;
            
            this.unreadCounts[userId] = {
                admin: adminUnread,
                user: userUnread
            };
        });
    }

    getUnreadCount(userId, viewer) {
        this.updateUnreadCounts();
        return this.unreadCounts[userId]?.[viewer] || 0;
    }

    markAsRead(userId, viewer = 'user') {
        const conversation = this.conversations[userId];
        if (!conversation) return;

        conversation.messages.forEach(msg => {
            if (viewer === 'admin' && msg.sender === 'user') {
                msg.read = true;
            } else if (viewer === 'user' && msg.sender === 'admin') {
                msg.read = true;
            }
        });

        this.saveConversations();
        this.updateUnreadCounts();
    }

    // ─────────────────────────────────────────────────────────────── 
    // SYNC (Simulated real-time)
    // ─────────────────────────────────────────────────────────────── 

    startSync() {
        // Check for updates every 3 seconds
        this.syncInterval = setInterval(() => {
            this.checkForUpdates();
        }, 3000);
    }

    stopSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    checkForUpdates() {
        // In real app, this would check server for new messages
        // For demo, we just update UI
        this.updateBadges();
        
        const currentUser = window.authSystem?.getCurrentUser();
        if (currentUser?.role === 'admin' && this.currentConversation) {
            this.updateAdminChatList();
        }
    }

    // ─────────────────────────────────────────────────────────────── 
    // HELPER FUNCTIONS
    // ─────────────────────────────────────────────────────────────── 

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    getRelativeTime(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return 'Hozir';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}d`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}s`;
        return `${Math.floor(seconds / 86400)}k`;
    }

    truncate(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ─────────────────────────────────────────────────────────────── 
    // STYLES
    // ─────────────────────────────────────────────────────────────── 

    addChatMessageStyles() {
        if (document.getElementById('chatMessageStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'chatMessageStyles';
        style.textContent = `
            .empty-chat-msg {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 300px;
                color: var(--text-muted);
            }
            
            .chat-icon {
                font-size: 4rem;
                opacity: 0.3;
                margin-bottom: var(--spacing-md);
            }
            
            .chat-message {
                display: flex;
                gap: var(--spacing-sm);
                margin-bottom: var(--spacing-md);
            }
            
            .chat-message.admin-message {
                flex-direction: row;
            }
            
            .chat-message.user-message {
                flex-direction: row-reverse;
            }
            
            .message-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary), var(--accent-purple));
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                color: white;
                flex-shrink: 0;
            }
            
            .message-content {
                max-width: 70%;
            }
            
            .message-text {
                padding: var(--spacing-sm) var(--spacing-md);
                border-radius: var(--radius-md);
                word-wrap: break-word;
            }
            
            .admin-message .message-text {
                background: var(--bg-tertiary);
                border-bottom-left-radius: 4px;
            }
            
            .user-message .message-text {
                background: linear-gradient(135deg, var(--primary), var(--accent-purple));
                color: white;
                border-bottom-right-radius: 4px;
            }
            
            .message-time {
                font-size: 0.75rem;
                color: var(--text-muted);
                margin-top: 4px;
                padding: 0 var(--spacing-sm);
            }
            
            .user-message .message-time {
                text-align: right;
            }
        `;
        document.head.appendChild(style);
    }

    addChatUserStyles() {
        if (document.getElementById('chatUserStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'chatUserStyles';
        style.textContent = `
            .chat-user-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-md);
                cursor: pointer;
                border-radius: var(--radius-sm);
                transition: all var(--transition-fast);
                margin-bottom: var(--spacing-xs);
            }
            
            .chat-user-item:hover {
                background: var(--bg-secondary);
            }
            
            .chat-user-item.active {
                background: var(--primary);
                color: white;
            }
            
            .chat-user-avatar {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary), var(--accent-purple));
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            .chat-user-info {
                flex: 1;
                min-width: 0;
            }
            
            .chat-user-name {
                font-weight: 600;
                margin-bottom: 4px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .unread-badge {
                background: var(--accent-orange);
                color: white;
                font-size: 0.7rem;
                padding: 2px 6px;
                border-radius: 10px;
                font-weight: bold;
            }
            
            .chat-user-preview {
                font-size: 0.85rem;
                color: var(--text-muted);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            
            .chat-user-item.active .chat-user-preview {
                color: rgba(255, 255, 255, 0.8);
            }
            
            .chat-user-time {
                font-size: 0.75rem;
                color: var(--text-muted);
                flex-shrink: 0;
            }
            
            .chat-user-item.active .chat-user-time {
                color: rgba(255, 255, 255, 0.8);
            }
        `;
        document.head.appendChild(style);
    }

    addAdminChatStyles() {
        if (document.getElementById('adminChatStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'adminChatStyles';
        style.textContent = `
            .admin-chat-header {
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                padding: var(--spacing-lg);
                background: var(--bg-secondary);
                border-bottom: 1px solid var(--border-color);
            }
            
            .chat-user-avatar-lg {
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
            }
            
            .admin-chat-messages {
                padding: var(--spacing-lg);
                height: 400px;
                overflow-y: auto;
                background: var(--bg-primary);
            }
            
            .admin-chat-message {
                display: flex;
                margin-bottom: var(--spacing-md);
            }
            
            .admin-chat-message.sent {
                justify-content: flex-end;
            }
            
            .admin-chat-message.received {
                justify-content: flex-start;
            }
            
            .message-bubble {
                max-width: 70%;
                padding: var(--spacing-sm) var(--spacing-md);
                border-radius: var(--radius-md);
            }
            
            .admin-chat-message.sent .message-bubble {
                background: linear-gradient(135deg, var(--primary), var(--accent-purple));
                color: white;
                border-bottom-right-radius: 4px;
            }
            
            .admin-chat-message.received .message-bubble {
                background: var(--bg-tertiary);
                border-bottom-left-radius: 4px;
            }
            
            .admin-chat-input {
                display: flex;
                gap: var(--spacing-sm);
                padding: var(--spacing-md);
                background: var(--bg-secondary);
                border-top: 1px solid var(--border-color);
            }
            
            .admin-chat-input input {
                flex: 1;
                padding: var(--spacing-sm) var(--spacing-md);
                background: var(--bg-tertiary);
                border: 2px solid var(--border-color);
                border-radius: var(--radius-md);
                color: var(--text-primary);
                font-size: 1rem;
            }
            
            .admin-chat-input input:focus {
                outline: none;
                border-color: var(--primary);
            }
        `;
        document.head.appendChild(style);
    }
}

// ─────────────────────────────────────────────────────────────── 
// INITIALIZE CHAT SYSTEM
// ─────────────────────────────────────────────────────────────── 

let chatSystem;

document.addEventListener('DOMContentLoaded', () => {
    chatSystem = new ChatSystem();
    window.chatSystem = chatSystem;
    
    console.log('💬 Chat System ready');
});