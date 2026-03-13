// Library Page JavaScript - Cloud-Enabled with Firebase

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 1. Firebase Configuration (Same as your Admin config)
const firebaseConfig = {
    apiKey: "AIzaSyCftWFc6WvMbaY_iwF6DUawi7Qvf0SRKYc",
    authDomain: "sahitya-mela.firebaseapp.com",
    projectId: "sahitya-mela",
    databaseURL: "https://sahitya-mela-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let currentBooks = [];
let currentPage = 1;
let booksPerPage = 12;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', function() {
    initializeLibrary();
});

function initializeLibrary() {
    setupSearchAndFilters();
    loadBooks();
}

function setupSearchAndFilters() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', performSearch);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', performSearch);
    }
}

// Search and filter functions now work with Firebase data
function performSearch() {
    const searchQuery = document.getElementById('searchInput')?.value || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    const sortBy = document.getElementById('sortFilter')?.value || 'newest';
    
    // Filter books based on search criteria
    let filteredBooks = currentBooks.filter(book => {
        const matchesSearch = !searchQuery || 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = !category || category === 'all' || book.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    // Sort books
    switch (sortBy) {
        case 'newest':
            filteredBooks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            break;
        case 'oldest':
            filteredBooks.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
            break;
        case 'title':
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'author':
            filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
            break;
        case 'views':
            filteredBooks.sort((a, b) => (b.views || 0) - (a.views || 0));
            break;
    }
    
    currentBooks = filteredBooks;
    currentPage = 1;
    displayBooks();
    updatePagination();
}

// 2. Updated loadBooks to fetch from Cloud
function loadBooks() {
    console.log('=== FETCHING LIVE LIBRARY DATA ===');
    
    const booksRef = ref(database, 'books');
    
    // This "listens" to the database. If you add a book in Admin, 
    // this page updates instantly without a refresh!
    onValue(booksRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
            // Convert Firebase Object to Array
            currentBooks = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
            console.log(`Loaded ${currentBooks.length} books from Cloud.`);
        } else {
            console.log('No books found in Cloud Database.');
            currentBooks = [];
        }
        
        // HIDE THE LOADER
        const loader = document.getElementById('loader-wrapper');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500); // Wait for the fade-out transition
        }
        
        displayBooks();
        updatePagination();
    });
}

function displayBooks() {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) {
        console.log('ERROR: booksGrid element not found!');
        return;
    }
    
    console.log('=== DISPLAY BOOKS DEBUG ===');
    console.log('Current books:', currentBooks.length);
    console.log('Current page:', currentPage);
    console.log('Books per page:', booksPerPage);
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToShow = currentBooks.slice(startIndex, endIndex);
    
    console.log('Books to show:', booksToShow.length);
    console.log('Start index:', startIndex, 'End index:', endIndex);
    
    // Clear grid
    booksGrid.innerHTML = '';
    
    if (booksToShow.length === 0) {
        booksGrid.innerHTML = '<div class="no-books">No books found. Try adjusting your search or filters.</div>';
        return;
    }
    
    // Create book cards
    booksToShow.forEach((book, index) => {
        const bookCard = createBookCard(book, startIndex + index);
        booksGrid.appendChild(bookCard);
    });
    
    console.log('Books displayed successfully');
}

