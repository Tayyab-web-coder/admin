document.addEventListener('DOMContentLoaded', () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBTahYHkNIvOlv2PwAAd1o4Q-e8xACFhcI",
    authDomain: "panel-481bd.firebaseapp.com",
    projectId: "panel-481bd",
    storageBucket: "panel-481bd.appspot.com",
    messagingSenderId: "529328619298",
    appId: "1:529328619298:web:248714d17f4d19b489af7b"
  };
    // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  console.log('Firebase initialized');

  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = signupForm['signup-email'].value;
      const password = signupForm['signup-password'].value;

      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        console.log('User created:', cred.user.uid);
        await db.collection('users').doc(cred.user.uid).set({
          email: email,
          role: 'user'
        });
        console.log('User document created');
        signupForm.reset();
        alert('Signup successful. Please log in.');
      } catch (err) {
        console.error('Error during signup:', err);
        alert('Error during signup: ' + err.message);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm['login-email'].value;
      const password = loginForm['login-password'].value;

      try {
        const cred = await auth.signInWithEmailAndPassword(email, password);
        console.log('User signed in:', cred.user.uid);
        const doc = await db.collection('users').doc(cred.user.uid).get();
        if (doc.exists) {
          const role = doc.data().role;
          console.log('User role:', role);
          if (role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'user.html';
          }
        } else {
          console.error('No such user!');
          alert('No such user!');
        }
      } catch (err) {
        console.error('Error during login:', err);
        alert('Error during login: ' + err.message);
      }
    });
  }
});
