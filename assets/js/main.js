// Main JavaScript for Sahitya Mela Website - Cloud-Enabled with Firebase

import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Sample book data (kept as fallback)
const sampleBooks = [
    {
        id: 1,
        title: "Rabindranath's Poetry Collection",
        author: "Rabindranath Tagore",
        category: "poetry",
        description: "A selected collection of immortal poems by Rabindranath Tagore.",
        cover: "assets/images/books/rabindranath-poetry.jpg",
        content: "Here will be the complete content of the book...",
        publishDate: "2024-01-15",
        views: 1250
    },
    {
        id: 2,
        title: "Modern Bengali Stories",
        author: "Various Authors",
        category: "story",
        description: "A collection of the best short stories from modern Bengali literature.",
        cover: "assets/images/books/modern-stories.jpg",
        content: "Here will be the complete content of the book...",
        publishDate: "2024-02-10",
        views: 890
    },
    {
        id: 3,
        title: "Travel Stories of Bengal",
        author: "Syed Mujtaba Ali",
        category: "travel",
        description: "Travel experiences described by the famous writer Syed Mujtaba Ali.",
        cover: "assets/images/books/travel-stories.jpg",
        content: "Here will be the complete content of the book...",
        publishDate: "2024-01-28",
        views: 675
    },
    {
        id: 4,
        title: "History of Bengali Language",
        author: "Dr. Muhammad Shahidullah",
        category: "linguistics",
        description: "Research on the origin and development of the Bengali language.",
        cover: "assets/images/books/bengali-linguistics.jpg",
        content: "Here will be the complete content of the book...",
        publishDate: "2024-03-05",
        views: 420
    },
    {
        id: 5,
        title: "Nazrul's Rebellious Poetry",
        author: "Kazi Nazrul Islam",
        category: "poetry",
        description: "Poems of rebellious spirit by the national poet Kazi Nazrul Islam.",
        cover: "assets/images/books/nazrul-poetry.jpg",
        content: "Here will be the complete content of the book...",
        publishDate: "2024-02-20",
        views: 980
    },
    {
        id: 6,
        title: "Pather Panchali",
        author: "Bibhutibhushan Bandyopadhyay",
        category: "novel",
        description: "The immortal novel Pather Panchali from Bengali literature.",
        cover: "assets/images/books/pather-panchali.jpg",
        content: "Here will be the complete content of the book...",
        publishDate: "2024-01-10",
        views: 1580
    }
];

// Sample messages data
const sampleMessages = [
    {
        id: 1,
        name: "Rahim Uddin",
        email: "rahim@email.com",
        subject: "New Writing Submission",
        message: "I have a poem that I would like to publish in Sahitya Mela.",
        date: "2024-03-10",
        read: false
    },
    {
        id: 2,
        name: "Fatema Khatun",
        email: "fatema@email.com",
        subject: "About the Website",
        message: "Your website has turned out very beautiful. Congratulations.",
        date: "2024-03-09",
        read: true
    }
];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Prevent flickering during page load
    document.body.classList.add('no-animation');
    
    // Initialize website after a brief delay to ensure smooth loading
    setTimeout(() => {
        document.body.classList.remove('no-animation');
        initializeWebsite();
    }, 100);
});

function initializeWebsite() {
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize local storage
    initializeLocalStorage();
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}


// Create Book Card
function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    
    // Get cover image from photos structure
    let coverImage = 'assets/images/default-book.jpg';
    
    if (book.photos && book.photos.mainCover) {
        coverImage = book.photos.mainCover;
    } else if (book.cover) {
        coverImage = book.cover;
    }
    
    bookCard.innerHTML = `
        <img src="${coverImage}" alt="${book.title}" class="book-cover" onerror="this.src='assets/images/default-book.jpg'">
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">Author: ${book.author}</p>
            <p class="book-description">${book.description.substring(0, 100)}...</p>
            <span class="book-category">${getCategoryName(book.category)}</span>
        </div>
    `;
    
    bookCard.addEventListener('click', function() {
        console.log('Book card clicked. Book ID:', book.id, 'Book Title:', book.title);
        openBookReader(book.id);
    });
    
    return bookCard;
}

// Get Category Name in Bengali
function getCategoryName(category) {
    const categories = {
        'poetry': 'Poetry',
        'novel': 'Novel',
        'short-story': 'Short Story',
        'essay': 'Essay',
        'drama': 'Drama',
        'other': 'Other',
        'story': 'Story',
        'travel': 'Travel',
        'review': 'Book Review',
        'astrology': 'Astrology',
        'linguistics': 'Linguistics'
    };
    return categories[category] || category;
}

// Open Book Reader
function openBookReader(bookId) {
    console.log('Opening book reader for book ID:', bookId);
    
    // Store the book ID and redirect to reader page
    localStorage.setItem('currentBookId', bookId);
    console.log('Book ID stored in localStorage:', bookId);
    
    // Verify it was stored
    const storedId = localStorage.getItem('currentBookId');
    console.log('Verified stored ID:', storedId);
    
    console.log('Redirecting to book-reader.html...');
    window.location.href = 'book-reader.html';
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Local Storage Functions
function initializeLocalStorage() {
    // Initialize with sample data if no data exists
    // DISABLED: Don't auto-add sample books
    // if (!localStorage.getItem('sahityaMelaBooks')) {
    //     localStorage.setItem('sahityaMelaBooks', JSON.stringify(sampleBooks));
    // }
    
    if (!localStorage.getItem('sahityaMelaMessages')) {
        localStorage.setItem('sahityaMelaMessages', JSON.stringify(sampleMessages));
    }
}

// New Cloud-Sync version of getStoredBooks
async function getStoredBooks() {
    const dbRef = ref(getDatabase());
    try {
        const snapshot = await get(child(dbRef, `books`));
        if (snapshot.exists()) {
            const data = snapshot.val();
            // Convert the Firebase object into an array for your existing search/filter logic
            return Object.keys(data).map(key => ({ id: key, ...data[key] }));
        } else {
            console.log('No books found in Firebase, using sample data as fallback');
            return sampleBooks;
        }
    } catch (error) {
        console.error("Firebase Read Error:", error);
        console.log('Using sample data as fallback');
        return sampleBooks;
    }
}

function getStoredMessages() {
    const messages = localStorage.getItem('sahityaMelaMessages');
    return messages ? JSON.parse(messages) : [];
}

function saveBook(book) {
    const books = getStoredBooks();
    book.id = Date.now(); // Simple ID generation
    book.publishDate = new Date().toISOString().split('T')[0];
    book.views = 0;
    books.unshift(book); // Add to beginning
    localStorage.setItem('sahityaMelaBooks', JSON.stringify(books));
    return book;
}

function updateBook(bookId, updatedBook) {
    const books = getStoredBooks();
    const index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
        books[index] = { ...books[index], ...updatedBook };
        localStorage.setItem('sahityaMelaBooks', JSON.stringify(books));
        return books[index];
    }
    return null;
}

function deleteBook(bookId) {
    const books = getStoredBooks();
    const filteredBooks = books.filter(book => book.id !== bookId);
    localStorage.setItem('sahityaMelaBooks', JSON.stringify(filteredBooks));
    return true;
}

function saveMessage(message) {
    const messages = getStoredMessages();
    message.id = Date.now();
    message.date = new Date().toISOString().split('T')[0];
    message.read = false;
    messages.unshift(message);
    localStorage.setItem('sahityaMelaMessages', JSON.stringify(messages));
    return message;
}

function markMessageAsRead(messageId) {
    const messages = getStoredMessages();
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
        message.read = true;
        localStorage.setItem('sahityaMelaMessages', JSON.stringify(messages));
    }
}

// Search and Filter Functions
async function searchBooks(query, category = '', sortBy = 'newest') {
    let books = await getStoredBooks();
    
    // Filter by search query
    if (query) {
        books = books.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()) ||
            book.description.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    // Filter by category
    if (category) {
        books = books.filter(book => book.category === category);
    }
    
    // Sort books
    switch (sortBy) {
        case 'oldest':
            books.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
            break;
        case 'title':
            books.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'author':
            books.sort((a, b) => a.author.localeCompare(b.author));
            break;
        case 'newest':
        default:
            books.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
            break;
    }
    
    return books;
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Form validation
function validateForm(formData, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
            errors.push(`Please fill in the ${field} field`);
        }
    });
    
    // Email validation
    if (formData.email && !isValidEmail(formData.email)) {
        errors.push('Please provide a valid email address');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Export functions for use in other files
window.SahityaMela = {
    getStoredBooks,
    getStoredMessages,
    saveBook,
    updateBook,
    deleteBook,
    saveMessage,
    markMessageAsRead,
    searchBooks,
    getCategoryName,
    formatDate,
    showNotification,
    validateForm,
    openBookReader,
    createBookCard
};
