import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const auth = getAuth();

// The "Gatekeeper" - Runs on every admin page load
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in!
        console.log("Welcome Admin:", user.email);
        // You can put code here to show the dashboard menu
        document.body.classList.remove("loading"); 
    } else {
        // Not logged in? Kick them to the login page immediately
        window.location.href = "login.html";
    }
});
