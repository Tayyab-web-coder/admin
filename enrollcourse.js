import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, collection, getDocs, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

// Your Firebase configuration object
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
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
  
    // Display each course
    coursesSnapshot.forEach(doc => {
      const courseData = doc.data();
      const courseItem = document.createElement('div');
      courseItem.innerHTML = `
        <h3>${courseData.name}</h3>
        <img src="${courseData.image}" alt="${courseData.name}">
        <p>${courseData.description}</p>
        <button class="enroll-button" data-course-id="${doc.id}">Enroll</button>
      `;
      courseList.appendChild(courseItem);
    });
  
    // Add event listeners to enroll buttons
    document.querySelectorAll('.enroll-button').forEach(button => {
      button.addEventListener('click', async (e) => {
        const courseId = e.target.getAttribute('data-course-id');
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
              enrolledCourses: arrayUnion(courseId)
            });
            alert('You have enrolled in the course!');
          } else {
            window.location.href = 'register.html';
          }
        });
      });
    });
  });
  document.addEventListener('DOMContentLoaded', async () => {
    const enrolledCoursesList = document.getElementById('enrolled-courses');
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const enrolledCourses = userDoc.data().enrolledCourses || [];
          enrolledCourses.forEach(async (courseId) => {
            const courseDoc = await getDoc(doc(db, 'courses', courseId));
            if (courseDoc.exists()) {
              const courseData = courseDoc.data();
              const courseItem = document.createElement('div');
              courseItem.innerHTML = `
                <h3>${courseData.name}</h3>
                <p>Progress: ${courseData.progress || 0}%</p>
              `;
              enrolledCoursesList.appendChild(courseItem);
            }
          });
        }
      }
    });
  });
  const updateProgress = async (courseId, progress) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      const enrolledCourses = userDoc.data().enrolledCourses || {};
      enrolledCourses[courseId] = progress;
      await updateDoc(userDocRef, { enrolledCourses });
    }
  };
  
  // Example usage: Update progress to 50% for a specific course
  updateProgress('courseId123', 50); // 50% progress
  