import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyBTahYHkNIvOlv2PwAAd1o4Q-e8xACFhcI",
    authDomain: "panel-481bd.firebaseapp.com",
    projectId: "panel-481bd",
    storageBucket: "panel-481bd.appspot.com",
    messagingSenderId: "529328619298",
    appId: "1:529328619298:web:248714d17f4d19b489af7b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const displayCourses = async () => {
    const courseList = document.getElementById('course-list');
    courseList.innerHTML = '';
    try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const listItem = document.createElement('li');
            listItem.classList.add('course-item');
            listItem.onclick = () => {
                window.location.href = `course-detail.html?id=${doc.id}`;
            };

            listItem.innerHTML = `
          <img src="${data.image}" alt="${data.name}" onerror="this.onerror=null; this.src='default-image.jpg';">
          <span>${data.name}</span>
        `;
            courseList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    displayCourses();
});

