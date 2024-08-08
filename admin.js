import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

// Initialize Firebase
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

// Check authentication and load courses
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log('User authenticated:', user.email);
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        if (userDoc.data().role === 'admin') {
          console.log('User is an admin');
          // Load courses and proceed with admin functionalities
          await loadCourses(); // Ensure courses are loaded
        } else {
          console.error('User is not an admin');
          alert('You do not have permission to perform this action.');
          await signOut(auth);
          window.location.replace('login.html');
        }
      } else {
        console.error('User document does not exist');
        await signOut(auth);
        window.location.replace('login.html');
      }
    } catch (userError) {
      console.error('Error fetching user data:', userError);
      await signOut(auth);
      window.location.replace('login.html');
    }
  } else {
    console.error('No user authenticated');
    window.location.replace('login.html');
  }
});

// Logout
document.getElementById('logout-button').addEventListener('click', async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
    window.location.replace('login.html');
  } catch (error) {
    console.error('Error signing out:', error);
  }
});

// Add video field
document.getElementById('add-video').addEventListener('click', () => {
  const videoFields = document.getElementById('video-fields');
  const index = videoFields.children.length;
  const newVideoField = document.createElement('div');
  newVideoField.classList.add('video-field');
  newVideoField.innerHTML = `
    <label for="video-file-${index}">Video File:</label>
    <input type="file" id="video-file-${index}" class="video-file" accept="video/*" required>
    <label for="video-thumb-${index}">Video Thumbnail:</label>
    <input type="file" id="video-thumb-${index}" class="video-thumb" accept="image/*">
    <input type="text" id="video-name-${index}" class="video-name" placeholder="Video Name" required>
  `;
  videoFields.appendChild(newVideoField);
});

// Handle course form submission
document.getElementById('course-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const courseName = document.getElementById('course-name').value;
  const courseDescription = document.getElementById('course-description').value;
  const courseImgFile = document.getElementById('course-img').files[0];
  const videoFiles = document.querySelectorAll('.video-file');
  const videoThumbs = document.querySelectorAll('.video-thumb');
  const videoNames = document.querySelectorAll('.video-name');

  try {
    console.log('Uploading course image:', courseImgFile.name);
    const courseImgRef = ref(storage, `courseImages/${courseImgFile.name}`);
    await uploadBytes(courseImgRef, courseImgFile);
    const courseImgUrl = await getDownloadURL(courseImgRef);
    console.log('Course image uploaded:', courseImgUrl);

    // Create course document
    const newCourseRef = doc(collection(db, 'courses'));
    await setDoc(newCourseRef, {
      name: courseName,
      description: courseDescription,
      image: courseImgUrl,
      videos: []
    });

    // Upload video files
    const videoPromises = Array.from(videoFiles).map(async (file, index) => {
      if (file) {
        console.log('Uploading video file:', file.name);
        const videoRef = ref(storage, `courseVideos/${file.name}`);
        await uploadBytes(videoRef, file);
        const videoUrl = await getDownloadURL(videoRef);
        console.log('Video file uploaded:', videoUrl);

        const thumbFile = videoThumbs[index].files[0];
        let thumbUrl = '';
        if (thumbFile) {
          console.log('Uploading video thumbnail:', thumbFile.name);
          const thumbRef = ref(storage, `courseVideoThumbnails/${thumbFile.name}`);
          await uploadBytes(thumbRef, thumbFile);
          thumbUrl = await getDownloadURL(thumbRef);
          console.log('Video thumbnail uploaded:', thumbUrl);
        }

        await updateDoc(newCourseRef, {
          videos: [
            ...(await getDoc(newCourseRef)).data().videos,
            {
              name: videoNames[index].value,
              url: videoUrl,
              thumbnail: thumbUrl
            }
          ]
        });
      }
    });

    await Promise.all(videoPromises);

    alert('Course added successfully');
    // Reload the course list after adding
    loadCourses(); // Ensure courses are loaded
  } catch (error) {
    console.error('Error adding course:', error);
    alert('Error adding course');
  }
});

// Function to load courses and display them
async function loadCourses() {
  const courseList = document.getElementById('course-list');
  courseList.innerHTML = ''; // Clear the existing list
  try {
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    coursesSnapshot.forEach((doc) => {
      const course = doc.data();
      const courseItem = document.createElement('li');
      courseItem.innerHTML = `
        <h3>${course.name}</h3>
        <p>${course.description}</p>
        <img src="${course.image}" alt="${course.name}" style="max-width: 200px;">
        <button onclick="editCourse('${doc.id}')">Edit</button>
        <button onclick="deleteCourse('${doc.id}')">Delete</button>
      `;
      courseList.appendChild(courseItem);
    });
  } catch (error) {
    console.error('Error loading courses:', error);
  }
}

// Edit course function
window.editCourse = async (courseId) => {
  try {
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    if (!courseDoc.exists()) {
      console.error('Course does not exist');
      return;
    }

    const course = courseDoc.data();
    const courseNameInput = document.getElementById('course-name');
    const courseDescriptionInput = document.getElementById('course-description');
    const courseImgPreview = document.getElementById('course-img-preview');
    
    if (!courseNameInput || !courseDescriptionInput || !courseImgPreview) {
      console.error('Form elements not found');
      return;
    }
    
    // Populate form fields with course data
    courseNameInput.value = course.name;
    courseDescriptionInput.value = course.description;
    if (course.image) {
      courseImgPreview.src = course.image; // Set the existing image URL
      courseImgPreview.style.display = 'block'; // Show the image preview
    } else {
      courseImgPreview.style.display = 'none'; // Hide the preview if no image
    }

    // Store course ID in a hidden input or use another method to track it
    document.getElementById('course-form').dataset.courseId = courseId;
    
    // Optionally, display the form
    document.getElementById('course-form').style.display = 'block';
  } catch (error) {
    console.error('Error loading course data:', error);
  }
};

// Delete course function
window.deleteCourse = async (courseId) => {
  try {
    await deleteDoc(doc(db, 'courses', courseId));
    alert('Course deleted successfully');
    // Reload the course list after deleting
    loadCourses(); // Ensure courses are loaded
  } catch (error) {
    console.error('Error deleting course:', error);
    alert('Error deleting course');
  }
};
