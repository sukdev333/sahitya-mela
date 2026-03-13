// Language Switcher for SAHITYA MELA

// Default language
let currentLang = localStorage.getItem('preferredLang') || 'bn';
let currentBook = null; // Will be set when a book is loaded

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLang', lang);
    
    // Update UI Buttons
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${lang}`).classList.add('active');
    
    // Reload the book content with the new language
    renderBookContent();
}

function renderBookContent() {
    const readingArea = document.getElementById('reading-area');
    const chapterTitle = document.getElementById('chapter-title');
    
    if (!currentBook) {
        console.warn('No current book loaded');
        return;
    }

    const category = currentBook.category || 'poetry'; // Default to poetry if no category

    if (currentLang === 'en') {
        const engData = getEnglishBookContent(category);
        if (engData && engData.chapters) {
            // Show the first chapter as an example
            const chapter = engData.chapters[0];
            if (readingArea) {
                readingArea.innerHTML = chapter.content;
            }
            if (chapterTitle) {
                chapterTitle.textContent = chapter.title;
            }
        } else {
            console.warn('No English content found for category:', category);
        }
    } else {
        // Fallback to original Bengali content from Firebase or current book
        if (readingArea) {
            readingArea.innerHTML = currentBook.content || '<p>Content loading...</p>';
        }
        if (chapterTitle) {
            chapterTitle.textContent = currentBook.title || 'Loading...';
        }
    }
}

// Function to set the current book being read
function setCurrentBook(book) {
    currentBook = book;
    renderBookContent(); // Render content when book is set
}

// Function to get current language
function getCurrentLanguage() {
    return currentLang;
}

// Initialize language switcher on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial active button based on stored preference
    const activeBtn = document.getElementById(`btn-${currentLang}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // If there's a book already loaded, render it with the current language
    if (currentBook) {
        renderBookContent();
    }
});

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setLanguage,
        renderBookContent,
        setCurrentBook,
        getCurrentLanguage
    };
}
