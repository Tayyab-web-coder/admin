import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyBTahYHkNIvOlv2PwAAd1o4Q-e8xACFhcI",
  authDomain: "panel-481bd.firebaseapp.com",
  projectId: "panel-481bd",
  storageBucket: "panel-481bd.appspot.com",
  messagingSenderId: "529328619298",
  appId: "1:529328619298:web:248714d17f4d19b489af7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.visibility = 'visible'; // Show content when loaded

  const uploadForm = document.getElementById('upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fileInput = document.getElementById('file');
      const descriptionInput = document.getElementById('file-description');
      const file = fileInput.files[0];
      const description = descriptionInput.value;

      if (file) {
        try {
          const fileId = await uploadFile(file, { description }, db, storage);
          console.log('File uploaded with ID:', fileId);
          fileInput.value = '';
          descriptionInput.value = '';
          displayFiles();
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
    });
  }

  displayFiles();
});

const uploadFile = async (file, metadata, db, storage) => {
  const storageRef = ref(storage, 'files/' + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);
  await uploadTask;
  const url = await getDownloadURL(storageRef);
  const fileRef = doc(collection(db, 'files'));
  await setDoc(fileRef, { url, ...metadata });
  return fileRef.id;
};

const displayFiles = async () => {
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = '';

  try {
    const querySnapshot = await getDocs(collection(db, 'files'));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(data);
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <video src="${data.url}" controls></video>
        <span>${data.description}</span>
        <button onclick="updateMetadata('${doc.id}')">Update</button>
        <button onclick="removeFile('${doc.id}', '${data.url}')">Delete</button>
      `;
      fileList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Failed to fetch files:', error);
  }
};

window.updateMetadata = async (fileId) => {
  const newDescription = prompt('Enter new description:');
  if (newDescription) {
    try {
      await updateFileMetadata(fileId, { description: newDescription }, db);
      console.log('Metadata updated');
      displayFiles();
    } catch (error) {
      console.error('Update failed:', error);
    }
  }
};

window.removeFile = async (fileId, fileUrl) => {
  if (confirm('Are you sure you want to delete this file?')) {
    try {
      await deleteFile(fileId, fileUrl, db, storage);
      console.log('File deleted');
      displayFiles();
    } catch (error) {
      console.error('Deletion failed:', error);
    }
  }
};

const updateFileMetadata = async (fileId, metadata, db) => {
  const fileRef = doc(db, 'files', fileId);
  await updateDoc(fileRef, metadata);
};

const deleteFile = async (fileId, fileUrl, db, storage) => {
  const fileRef = doc(db, 'files', fileId);
  await deleteDoc(fileRef);
  const storageRef = ref(storage, fileUrl);
  await deleteObject(storageRef);
};

window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = 'index.html';
  }).catch((error) => {
    console.error('Sign out error:', error);
  });
};
