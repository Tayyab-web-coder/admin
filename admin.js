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
    if (user && user.email === 'muhammadnadeem34949@gmail.com') {
        // User is an admin, proceed with admin operations
        console.log('User is an admin');
        
        // Handle form submission and file upload
        document.getElementById('course-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const courseName = document.getElementById('course-name').value;
            const courseDescription = document.getElementById('course-description').value;
            const courseImg = document.getElementById('course-img').files[0];
            const videoFiles = Array.from(document.querySelectorAll('.video-file')).map(input => input.files[0]);
            const videoThumbnails = Array.from(document.querySelectorAll('.video-thumb')).map(input => input.files[0]);

            console.log('Submitting form', { courseName, courseDescription, courseImg, videoFiles, videoThumbnails });

            // Handle course image upload
            let courseImgUrl = '';
            if (courseImg) {
                const storageRefImg = ref(storage, `courseImages/${courseImg.name}`);
                const uploadTaskImg = uploadBytesResumable(storageRefImg, courseImg);

                await new Promise((resolve, reject) => {
                    uploadTaskImg.on('state_changed', 
                        (snapshot) => {
                            // Handle progress
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            document.getElementById('progress-bar').firstElementChild.style.width = `${progress}%`;
                            document.getElementById('progress-text').innerText = `${Math.round(progress)}%`;
                            console.log('Uploading image', progress);
                        }, 
                        (error) => {
                            console.error('Error uploading image:', error);
                            reject(error);
                        }, 
                        async () => {
                            courseImgUrl = await getDownloadURL(uploadTaskImg.snapshot.ref);
                            console.log('Image uploaded', courseImgUrl);
                            resolve();
                        }
                    );
                });
            }

            // Handle videos upload
            const videoUrls = [];
            for (let i = 0; i < videoFiles.length; i++) {
                if (videoFiles[i]) {
                    const storageRefVideo = ref(storage, `courseVideos/${videoFiles[i].name}`);
                    const uploadTaskVideo = uploadBytesResumable(storageRefVideo, videoFiles[i]);

                    await new Promise((resolve, reject) => {
                        uploadTaskVideo.on('state_changed', 
                            (snapshot) => {
                                // Handle progress
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Uploading video', progress);
                            }, 
                            (error) => {
                                console.error('Error uploading video:', error);
                                reject(error);
                            }, 
                            async () => {
                                const videoURL = await getDownloadURL(uploadTaskVideo.snapshot.ref);
                                console.log('Video uploaded', videoURL);
                                const videoThumbnailUrl = await new Promise((resolve, reject) => {
                                    if (videoThumbnails[i]) {
                                        const storageRefThumb = ref(storage, `courseVideoThumbnails/${videoThumbnails[i].name}`);
                                        const uploadTaskThumb = uploadBytesResumable(storageRefThumb, videoThumbnails[i]);

                                        uploadTaskThumb.on('state_changed', 
                                            (snapshot) => {
                                                // Handle progress
                                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                                console.log('Uploading thumbnail', progress);
                                            }, 
                                            (error) => {
                                                console.error('Error uploading thumbnail:', error);
                                                reject(error);
                                            }, 
                                            async () => {
                                                const thumbURL = await getDownloadURL(uploadTaskThumb.snapshot.ref);
                                                console.log('Thumbnail uploaded', thumbURL);
                                                resolve(thumbURL);
                                            }
                                        );
                                    } else {
                                        resolve('');
                                    }
                                });

                                videoUrls.push({
                                    url: videoURL,
                                    thumbnail: videoThumbnailUrl
                                });
                                resolve();
                            }
                        );
                    });
                }
            }

            // Save course information to Firestore
            await setDoc(doc(db, 'courses', courseName), {
                name: courseName,
                description: courseDescription,
                imgUrl: courseImgUrl,
                videos: videoUrls
            });

            console.log('Course successfully added!');
            displayCourses(); // Refresh course list
        });

        // Function to handle adding another video
        document.getElementById('add-video').addEventListener('click', () => {
            const videoFieldsContainer = document.getElementById('video-fields');
            const index = videoFieldsContainer.children.length;
            const videoFieldHtml = `
                <div class="video-field">
                    <label for="video-name-${index}">Video Name:</label>
                    <input type="text" id="video-name-${index}" name="video-name" required>
                    <label for="video-file-${index}">Video File:</label>
                    <input type="file" id="video-file-${index}" class="video-file" name="video-file" required>
                    <label for="video-thumb-${index}">Video Thumbnail:</label>
                    <input type="file" id="video-thumb-${index}" class="video-thumb" name="video-thumb">
                </div>
            `;
            videoFieldsContainer.insertAdjacentHTML('beforeend', videoFieldHtml);
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
                        <h4>Videos:</h4>
                        <ul>
                            ${course.videos.map(video => `
                                <li>
                                    <p>Video URL: <a href="${video.url}" target="_blank">${video.url}</a></p>
                                    ${video.thumbnail ? `<img src="${video.thumbnail}" alt="Thumbnail" style="width: 100px;">` : ''}
                                </li>
                            `).join('')}
                        </ul>
                    `;
                    courseList.appendChild(listItem);
                });
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        }

        displayCourses(); // Display courses on page load
        
    } else {
        console.error('User is not authenticated or not an admin');
        // Redirect to login or show an error message if the user is not authenticated or not an admin
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
