import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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

const loadCourseDetails = async (courseId) => {
    try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId));
        if (courseDoc.exists()) {
            const courseData = courseDoc.data();
            document.getElementById('course-img').src = courseData.imgUrl;
            document.getElementById('course-name').textContent = courseData.name;
            document.getElementById('course-description').textContent = courseData.description;
        } else {
            console.log('No such document!');
        }
    } catch (error) {
        console.error('Error getting course:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    if (courseId) {
        loadCourseDetails(courseId);
    }

    document.getElementById('enroll-button').addEventListener('click', () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is authenticated, redirect to enrolled page
                window.location.href = `enrolled.html?id=${courseId}`;
            } else {
                // User is not authenticated, redirect to register page
                window.location.href = 'register.html';
            }
        });
    });
});
