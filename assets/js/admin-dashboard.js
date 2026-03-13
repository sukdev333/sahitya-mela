// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Check if user is logged in
    if (!AdminAuth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    loadDashboardStats();
    loadRecentBooks();
    loadRecentMessages();
}

function loadDashboardStats() {
    const books = SahityaMela.getStoredBooks();
    const messages = SahityaMela.getStoredMessages();
    
    // Calculate stats
    const totalBooks = books.length;
    const totalCategories = 7; // Fixed number of categories
    const unreadMessages = messages.filter(msg => !msg.read).length;
    const totalViews = books.reduce((sum, book) => sum + (book.views || 0), 0);
    
    // Update stats display
    document.getElementById('totalBooks').textContent = totalBooks;
    document.getElementById('totalCategories').textContent = totalCategories;
    document.getElementById('totalMessages').textContent = unreadMessages;
    document.getElementById('totalViews').textContent = totalViews;
}

function loadRecentBooks() {
    const books = SahityaMela.getStoredBooks();
    const recentBooks = books.slice(0, 5); // Get 5 most recent books
    const container = document.getElementById('recentBooks');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (recentBooks.length === 0) {
        container.innerHTML = `
            <div class="no-items">
                <p>এখনও কোনো বই যোগ করা হয়নি।</p>
                <a href="add-book.html" class="btn btn-primary">প্রথম বই যোগ করুন</a>
            </div>
        `;
        return;
    }
    
    recentBooks.forEach(book => {
        const bookItem = createRecentBookItem(book);
        container.appendChild(bookItem);
    });
}

function createRecentBookItem(book) {
    const item = document.createElement('div');
    item.className = 'recent-item';
    item.innerHTML = `
        <img src="${book.cover}" alt="${book.title}" onerror="this.src='../assets/images/default-book.jpg'">
        <div class="recent-item-info">
            <h4>${book.title}</h4>
            <p>লেখক: ${book.author}</p>
            <p>বিভাগ: ${SahityaMela.getCategoryName(book.category)}</p>
            <p>প্রকাশিত: ${SahityaMela.formatDate(book.publishDate)}</p>
        </div>
        <div class="recent-item-actions">
            <button onclick="editBook(${book.id})" class="btn btn-small btn-secondary">সম্পাদনা</button>
            <button onclick="deleteBook(${book.id})" class="btn btn-small" style="background: #dc3545; color: white;">মুছুন</button>
        </div>
    `;
    return item;
}

function loadRecentMessages() {
    const messages = SahityaMela.getStoredMessages();
    const recentMessages = messages.slice(0, 5); // Get 5 most recent messages
    const container = document.getElementById('recentMessages');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (recentMessages.length === 0) {
        container.innerHTML = `
            <div class="no-items">
                <p>কোনো নতুন বার্তা নেই।</p>
            </div>
        `;
        return;
    }
    
    recentMessages.forEach(message => {
        const messageItem = createRecentMessageItem(message);
        container.appendChild(messageItem);
    });
}

function createRecentMessageItem(message) {
    const item = document.createElement('div');
    item.className = `recent-item ${!message.read ? 'unread' : ''}`;
    item.innerHTML = `
        <div class="message-icon">
            <i class="fas fa-envelope${message.read ? '-open' : ''}"></i>
        </div>
        <div class="recent-item-info">
            <h4>${message.name}</h4>
            <p><strong>বিষয়:</strong> ${message.subject || 'বিষয় নেই'}</p>
            <p>${message.message.substring(0, 100)}...</p>
            <p><small>তারিখ: ${SahityaMela.formatDate(message.date)}</small></p>
        </div>
        <div class="recent-item-actions">
            <button onclick="viewMessage(${message.id})" class="btn btn-small btn-primary">দেখুন</button>
            ${!message.read ? `<button onclick="markAsRead(${message.id})" class="btn btn-small btn-secondary">পঠিত</button>` : ''}
        </div>
    `;
    return item;
}

function editBook(bookId) {
    // Store book ID for editing and redirect
    localStorage.setItem('editBookId', bookId);
    window.location.href = 'edit-book.html';
}

function deleteBook(bookId) {
    if (confirm('আপনি কি নিশ্চিত যে এই বইটি মুছে ফেলতে চান?')) {
        SahityaMela.deleteBook(bookId);
        AdminAuth.showNotification('বইটি সফলভাবে মুছে ফেলা হয়েছে।', 'success');
        
        // Reload dashboard
        setTimeout(() => {
            loadDashboardStats();
            loadRecentBooks();
        }, 1000);
    }
}

function viewMessage(messageId) {
    // Store message ID and redirect
    localStorage.setItem('viewMessageId', messageId);
    window.location.href = 'view-message.html';
}

function markAsRead(messageId) {
    SahityaMela.markMessageAsRead(messageId);
    AdminAuth.showNotification('বার্তাটি পঠিত হিসেবে চিহ্নিত করা হয়েছে।', 'success');
    
    // Reload messages
    setTimeout(() => {
        loadDashboardStats();
        loadRecentMessages();
    }, 1000);
}

function logout() {
    if (confirm('আপনি কি লগআউট করতে চান?')) {
        AdminAuth.logout();
    }
}

// Add dashboard-specific styles
const dashboardStyles = `
    .no-items {
        text-align: center;
        padding: 2rem;
        color: var(--text-light);
        background: var(--light-gray);
        border-radius: 10px;
    }
    
    .no-items p {
        margin-bottom: 1rem;
    }
    
    .recent-item.unread {
        background: #fff3cd;
        border-left: 4px solid var(--primary-color);
    }
    
    .message-icon {
        width: 60px;
        height: 60px;
        background: var(--primary-color);
        color: var(--white);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        flex-shrink: 0;
    }
    
    .recent-item-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    @media (max-width: 768px) {
        .recent-item {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
        }
        
        .recent-item-actions {
            justify-content: center;
        }
    }
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = dashboardStyles;
document.head.appendChild(styleSheet);
