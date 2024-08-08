import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyBTahYHkNIvOlv2PwAAd1o4Q-e8xACFhcI",
    authDomain: "panel-481bd.firebaseapp.com",
    projectId: "panel-481bd",
    storageBucket: "panel-481bd.appspot.com",
    messagingSenderId: "529328619298",
    appId: "1:529328619298:web:248714d17f4d19b489af7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');

  if (courseId) {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        const courseData = courseDoc.data();
        document.getElementById('course-img').src = courseData.image;
        document.getElementById('course-name').textContent = courseData.name;
        document.getElementById('course-description').textContent = courseData.description;
      } else {
        console.log('Course not found.');
      }
    } catch (error) {
      console.error('Error getting course:', error);
    }
  }

  const enrollButton = document.getElementById('enroll-button');
  enrollButton.addEventListener('click', () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already authenticated, redirect to course page
        window.location.href = `course-page.html?id=${courseId}`;
      } else {
        // Store the course ID in sessionStorage before redirecting to the register page
        sessionStorage.setItem('pendingCourseId', courseId);
        window.location.href = 'register.html';
      }
    });
  });
});
