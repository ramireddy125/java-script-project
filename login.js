// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCPt9X0jAvUdFC_bpaNv19YQvMirlxcbKI",
    authDomain: "login-b1490.firebaseapp.com",
    projectId: "login-b1490",
    storageBucket: "login-b1490.appspot.com",
    messagingSenderId: "226667299476",
    appId: "1:226667299476:web:d553098e33521b3273aa81",
    databaseURL: "https://login-b1490-default-rtdb.firebaseio.com/" // Add the real-time database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Switch Login and Sign Up forms
const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');
document.getElementById('showSignUpForm').addEventListener('click', () => {
    loginForm.style.display = 'none';
    signUpForm.style.display = 'block';
});
document.getElementById('showLoginForm').addEventListener('click', () => {
    signUpForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Handle sign up
document.getElementById('createAccountButton').addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Storing user details in Firebase Database
            const user = userCredential.user;
            set(ref(database, 'users/' + user.uid), {
                email: email
            });
            alert("Account created successfully! Please log in.");
            window.location.href = "index.html";  
        })
        .catch((error) => {
            const errorMessage = error.message;
            document.getElementById('signupError').textContent = errorMessage;
        });
});

// Handle login
document.getElementById('loginButton').addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login successful!");
            window.location.href = "recipe.html"; 
        })
        .catch((error) => {
            const errorMessage = error.message;
            document.getElementById('loginError').textContent = "Invalid details. Please sign up or try again.";
        });
});
console.log("firebaseConfig", auth)