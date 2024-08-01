import { auth } from './firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

const db = getFirestore(auth.app);

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const role = email === 'muhammadnadeem34949@gmail.com' ? 'admin' : 'user';
    await setDoc(doc(db, 'users', userCredential.user.uid), { role, email });
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    alert('Registration successful. Please log in.');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Registration error:', error);
    alert('Error during registration: ' + error.message);
  }
});
