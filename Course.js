import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, doc, getDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

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

const loadCourseVideos = async (courseId) => {
    const videoList = document.getElementById('video-list');
    videoList.innerHTML = '';
    try {
        const querySnapshot = await getDocs(collection(db, 'courses', courseId, 'videos'));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const listItem = document.createElement('li');
            listItem.classList.add('video-item');
            listItem.onclick = () => {
                // Redirect to video page or play video inline
            };
            listItem.innerHTML = `
                <img src="${data.thumbnailUrl}" alt="${data.name}">
                <span>${data.name}</span>
            `;
            videoList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');

    if (courseId) {
        loadCourseVideos(courseId);
    }
});
