import { auth } from './firebaseConfig.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';


document.addEventListener('DOMContentLoaded', () => {
  // Create and style the loading indicator
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

  // Hide page content initially
  document.body.style.visibility = 'hidden';

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const role = user.email === 'muhammadnadeem34949@gmail.com' ? 'admin' : 'user';
      const redirectUrl = role === 'admin' ? 'admin.html' : 'user.html';
      
      // Redirect only if not already on the correct page
      if (window.location.pathname.split('/').pop() !== redirectUrl) {
        window.location.replace(redirectUrl);
      } else {
        // Show content if already on the correct page
        document.body.style.visibility = 'visible';
        loadingIndicator.style.display = 'none';
      }
    } else {
      // User is not authenticated, show content
      document.body.style.visibility = 'visible';
      loadingIndicator.style.display = 'none';
    }
  });
});

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
                <img src="${data.imgUrl}" alt="${data.name}">
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
