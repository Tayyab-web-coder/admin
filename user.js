import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, collection, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

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
const storage = getStorage(app);

// Update progress
function updateProgress(percent) {
  const progressBar = document.getElementById('progress-bar');
  const statusMessage = document.getElementById('status-message');
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
    progressBar.textContent = `${percent}%`;
  }
  if (statusMessage) {
    statusMessage.textContent = `Loading: ${percent}% complete...`;
  }
}

// Show progress container
function showProgressContainer() {
  const progressContainer = document.getElementById('progress-container');
  if (progressContainer) {
    progressContainer.style.display = 'block';
  }
}

// Hide progress container
function hideProgressContainer() {
  const progressContainer = document.getElementById('progress-container');
  if (progressContainer) {
    progressContainer.style.display = 'none';
  }
}

// Load courses
async function loadCourses() {
  showProgressContainer();
  updateProgress(10);
  try {
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    updateProgress(50);

    coursesSnapshot.forEach((doc) => {
      const data = doc.data();
      const listItem = document.createElement('li');
      listItem.innerHTML = `
      <img src=${data.image}>
        <h4>${data.name}</h4>
        <p>${data.description}</p>
      `;
      document.getElementById('course-list').appendChild(listItem);
    });

    updateProgress(100);
    setTimeout(hideProgressContainer, 500); // Hide progress container after a brief pause
  } catch (error) {
    console.error('Error loading courses:', error);
    updateProgress(0);
    setTimeout(hideProgressContainer, 500); // Hide progress container if there's an error
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log('User is authenticated:', user.email);
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        console.log('User is an admin');
        // Load courses for admin
        loadCourses();
      } else if (userDoc.exists() && userDoc.data().role === 'user') {
        console.log('User is a regular user');
        // Load courses for user
        loadCourses();
      } else {
        console.error('No such user document or invalid role');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    console.error('No user authenticated');
    window.location.replace('login.html');
  }
});

const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', () => {
  signOut(auth).then(() => {
    console.log('User signed out');
    window.location.replace('login.html');
  }).catch((error) => {
    console.error('Error signing out:', error);
  });
});
