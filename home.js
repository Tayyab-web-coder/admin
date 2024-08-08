import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBTahYHkNIvOlv2PwAAd1o4Q-e8xACFhcI",
  authDomain: "panel-481bd.firebaseapp.com",
  projectId: "panel-481bd",
  storageBucket: "panel-481bd.appspot.com",
  messagingSenderId: "529328619298",
  appId: "1:529328619298:web:248714d17f4d19b489af7b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
  const courseList = document.getElementById('course-list');

  // Load and display courses
  try {
    const querySnapshot = await getDocs(collection(db, 'courses'));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const listItem = document.createElement('li');
      listItem.classList.add('course-item');
      listItem.innerHTML = `
        <img src="${data.image}" alt="${data.name}" onerror="this.onerror=null; this.src='default-image.jpg';">
        <span>${data.name}</span>
      `;
      courseList.appendChild(listItem);

      listItem.addEventListener('click', () => {
        window.location.href = `course-detail.html?id=${doc.id}`;
      });
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
  }

  // Auth State Check and Redirection Logic
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is logged in:', user.email);
      // Redirect authenticated users to the user page
      window.location.href = 'user.html';
    } else {
      console.log('No user is logged in.');
      // Allow unauthenticated users to stay on the home page
      // You can also add a timeout to show a message or automatically redirect to the login page
    }
  });
});
