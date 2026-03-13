import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 1. Create a variable to hold the image data globally
let mainCoverBase64 = "";

// 2. Update your preview function to save the data
function previewMainCover(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('mainCoverPreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            mainCoverBase64 = e.target.result; // Store the real data here
            preview.src = mainCoverBase64;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Make the function globally available
window.previewMainCover = previewMainCover;

// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCftWFc6WvMbaY_iwF6DUawi7Qvf0SRKYc",
    authDomain: "sahitya-mela.firebaseapp.com",
    projectId: "sahitya-mela",
    storageBucket: "sahitya-mela.firebasestorage.app",
    messagingSenderId: "283544938564",
    appId: "1:283544938564:web:b9bba32cca9e52e6aab411",
    databaseURL: "https://sahitya-mela-default-rtdb.firebaseio.com"
};

// 2. Initialize
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// 3. Security: Check Login Status
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

// 4. Handle Form Submission
document.getElementById('addBookForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const bookData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        category: document.getElementById('bookCategory').value,
        description: document.getElementById('bookDescription').value,
        content: document.getElementById('bookContent').value,
        publishDate: new Date().toISOString().split('T')[0],
        views: 0,
        
        // FIX: Use the data string, NOT the file input value
        cover: mainCoverBase64 || document.getElementById('bookCoverUrl').value || '../assets/images/default-book.svg',
        
        timestamp: Date.now()
    };

    console.log("Saving to Firebase:", bookData);

    try {
        // Push to Firebase 'books' collection
        await push(ref(database, 'books'), bookData);
        
        showSuccessMessage("Book Published to Cloud! 🚀");
        form.reset();
        
        // Reset the Base64 variable after successful submission
        mainCoverBase64 = "";
        
        setTimeout(() => {
            window.location.href = 'books.html';
        }, 2000);
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// 5. Success Message UI
function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: #4CAF50; color: white;
        padding: 15px 25px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000; font-family: sans-serif;
        display: flex; align-items: center; gap: 10px;
    `;
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// 6. Global Functions for HTML Buttons
window.logout = function() {
    if (confirm('Logout?')) {
        signOut(auth).then(() => {
            localStorage.removeItem('adminUser');
            window.location.href = 'login.html';
        });
    }
};

window.resetForm = function() {
    if (confirm('Reset form? All progress will be lost.')) {
        document.getElementById('addBookForm').reset();
    }
};

// Initialize sample data on load
initializeSampleData();
