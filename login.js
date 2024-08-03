import { auth, db } from './firebaseConfig.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
import { getDoc, doc } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'loading';
  loadingIndicator.style.position = 'fixed';
  loadingIndicator.style.top = '0';
  loadingIndicator.style.left = '0';
  loadingIndicator.style.width = '100%';
  loadingIndicator.style.height = '100%';
  loadingIndicator.style.backgroundColor = 'white';
  loadingIndicator.style.color = 'black';
  loadingIndicator.style.display = 'flex';
  loadingIndicator.style.justifyContent = 'center';
  loadingIndicator.style.alignItems = 'center';
  loadingIndicator.style.zIndex = '9999';
  loadingIndicator.innerText = 'Loading...';
  document.body.appendChild(loadingIndicator);

  loadingIndicator.style.display = 'block';

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
          if (window.location.pathname.split('/').pop() !== redirectUrl) {
            window.location.replace(redirectUrl); // Use replace to avoid history stack issues
          }
        } else {
          console.error('No user document found');
          window.location.replace('register.html');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        window.location.replace('index.html');
      }
    } else {
      document.body.style.visibility = 'visible';
      loadingIndicator.style.display = 'none';
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
        window.location.replace(redirectUrl); // Use replace to avoid history stack issues
      } else {
        console.error('No user document found');
        alert('No user document found');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error during login: ' + error.message);
      window.location.href='register.html'
    }
  });

  document.getElementById('google-login').addEventListener('click', async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
        window.location.replace(redirectUrl); // Use replace to avoid history stack issues
      } else {
        console.error('No user document found');
        alert('No user document found');
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('Error during Google login: ' + error.message);
    }
  });

  document.getElementById('facebook-login').addEventListener('click', async (e) => {
    e.preventDefault();
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
        window.location.replace(redirectUrl); // Use replace to avoid history stack issues
      } else {
        console.error('No user document found');
        alert('No user document found');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      alert('Error during Facebook login: ' + error.message);
    }
  });
});
