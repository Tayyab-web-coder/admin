import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

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
const storage = getStorage(app);

// Check user authentication and role
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && userDoc.data().role === 'admin') {
                // User is an admin, proceed with admin operations
                console.log('User is an admin');
                
                // Handle form submission and file upload
                document.getElementById('course-form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const courseName = document.getElementById('course-name').value;
                    const courseDescription = document.getElementById('course-description').value;
                    const courseImg = document.getElementById('course-img').files[0];

                    if (courseImg) {
                        const storageRef = ref(storage, `courseImages/${courseImg.name}`);
                        const uploadTask = uploadBytesResumable(storageRef, courseImg);

                        uploadTask.on('state_changed', 
                            (snapshot) => {
                                // Handle progress
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                document.getElementById('progress-bar').firstElementChild.style.width = `${progress}%`;
                                document.getElementById('progress-text').innerText = `${Math.round(progress)}%`;
                            }, 
                            (error) => {
                                console.error('Error uploading file:', error);
                            }, 
                            async () => {
                                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                
                                // Save course information to Firestore
                                await setDoc(doc(db, 'courses', courseName), {
                                    name: courseName,
                                    description: courseDescription,
                                    imgUrl: downloadURL,
                                    videos: [] // Handle videos separately
                                });
                                
                                console.log('Course successfully added!');
                                displayCourses(); // Refresh course list
                            }
                        );
                    }
                });

                // Function to display courses
                async function displayCourses() {
                    try {
                        const coursesCollection = collection(db, 'courses');
                        const coursesSnapshot = await getDocs(coursesCollection);
                        const courseList = document.getElementById('course-list');
                        courseList.innerHTML = ''; // Clear existing courses

                        coursesSnapshot.forEach((doc) => {
                            const course = doc.data();
                            const listItem = document.createElement('li');
                            listItem.innerHTML = `
                                <h3>${course.name}</h3>
                                <p>${course.description}</p>
                                <img src="${course.imgUrl}" alt="${course.name}" style="width: 100px;">
                            `;
                            courseList.appendChild(listItem);
                        });
                    } catch (error) {
                        console.error('Error fetching courses:', error);
                    }
                }

                displayCourses(); // Display courses on page load
                
            } else {
                console.error('User is not an admin');
                // Redirect or show an error message if the user is not an admin
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    } else {
        console.error('User is not authenticated');
        // Redirect to login or show an error message if the user is not authenticated
    }
});

// Logout function
function logout() {
    signOut(auth).then(() => {
        console.log('User signed out');
        // Redirect to login or home page after logout
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}
