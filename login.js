import { auth } from './firebaseConfig.js';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

const db = getFirestore(auth.app);

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role;
      const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
      window.location.href = redirectUrl;
    } else {
      console.error('No user document found');
      alert('No user document found');
    }
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
  } catch (error) {
    console.error('Login error:', error);
    alert('Error during login: ' + error.message);
  }
});

document.getElementById('google-login').addEventListener('click', async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role;
      const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
      window.location.href = redirectUrl;
    } else {
      console.error('No user document found');
      alert('No user document found');
    }
  } catch (error) {
    console.error('Google login error:', error);
    alert('Error during Google login: ' + error.message);
  }
});

document.getElementById('facebook-login').addEventListener('click', async () => {
  const provider = new FacebookAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role;
      const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
      window.location.href = redirectUrl;
    } else {
      console.error('No user document found');
      alert('No user document found');
    }
  } catch (error) {
    console.error('Facebook login error:', error);
    alert('Error during Facebook login: ' + error.message);
  }
});
