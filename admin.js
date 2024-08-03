import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

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

window.removeFile = async (fileId, fileName) => {
    try {
        await deleteDoc(doc(db, 'files', fileId));
        const fileRef = ref(storage, `files/${fileName}`);
        await deleteObject(fileRef);
        displayFiles();
    } catch (error) {
        console.error('Error removing file:', error);
        alert('Error removing file. Please check the console for details.');
    }
};

const displayFiles = async () => {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    try {
        const querySnapshot = await getDocs(collection(db, 'files'));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <video src="${data.url}" controls>${data.name}</video>
                <span>${data.description}</span>
                <button onclick="updateMetadata('${doc.id}')">Update</button>
                <button onclick="removeFile('${doc.id}', '${data.name}')">Delete</button>
            `;
            fileList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching files:', error);
    }
};

window.updateMetadata = async (fileId) => {
    const newDescription = prompt('Enter new description:');
    if (newDescription) {
        try {
            await updateDoc(doc(db, 'files', fileId), { description: newDescription });
            displayFiles();
        } catch (error) {
            console.error('Error updating metadata:', error);
            alert('Error updating metadata. Please check the console for details.');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fileInput = document.getElementById('file');
        const descriptionInput = document.getElementById('file-description');
        const file = fileInput.files[0];
        const description = descriptionInput.value;

        if (file) {
            try {
                const fileRef = ref(storage, `files/${file.name}`);
                const uploadTask = uploadBytesResumable(fileRef, file);

                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        document.getElementById('progress-bar').children[0].style.width = progress + '%';
                        document.getElementById('progress-text').textContent = Math.round(progress) + '%';
                    },
                    (error) => {
                        console.error('Upload failed:', error.message);
                        alert('Upload failed. Please check the console for details.');
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            await setDoc(doc(db, 'files', file.name), {
                                name: file.name,
                                url: downloadURL,
                                description: description,
                            });
                            fileInput.value = '';
                            descriptionInput.value = '';
                            document.getElementById('progress-bar').children[0].style.width = '0%';
                            document.getElementById('progress-text').textContent = '0%';
                            displayFiles();
                        } catch (error) {
                            console.error('Error setting document:', error.message);
                            alert('Error setting document. Please check the console for details.');
                        }
                    }
                );
            } catch (error) {
                console.error('Upload failed:', error.message);
                alert('Upload failed. Please check the console for details.');
            }
        }
    });

    displayFiles();
});

window.logout = async () => {
    try {
        await signOut(auth);
        window.location.href = 'login.html'; 
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please check the console for details.');
    }
};
