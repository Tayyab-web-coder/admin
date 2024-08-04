import { auth, db } from './firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('register-form');

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      const role = email === 'muhammadnadeem34949@gmail.com' ? 'admin' : 'user';

      // Store user role and email in Firestore
      await setDoc(doc(db, 'users', userId), { role, email });

      // Redirect to login page after successful registration
      alert('Signup successful. Please log in.');
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Signup error:', error);
      alert('Error during signup: ' + error.message);
    }
  });
});
