import { storage, db } from './firebaseconfig.js';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js';
import { collection, addDoc, updateDoc, doc, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

// Upload file
export const uploadFile = (file, metadata) => {
  const fileRef = ref(storage, `files/${file.name}`);
  const uploadTask = uploadBytesResumable(fileRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        try {
          const docRef = await addDoc(collection(db, 'files'), {
            name: file.name,
            url: downloadURL,
            ...metadata
          });
          resolve(docRef.id);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

// Read file metadata
export const getFileMetadata = async (fileId) => {
  const fileDoc = await getDoc(doc(db, 'files', fileId));
  return fileDoc.exists() ? fileDoc.data() : null;
};

// Update file metadata
export const updateFileMetadata = async (fileId, metadata) => {
  const fileDoc = doc(db, 'files', fileId);
  await updateDoc(fileDoc, metadata);
};

// Delete file
export const deleteFile = async (fileId, fileName) => {
  await deleteDoc(doc(db, 'files', fileId));
  const fileRef = ref(storage, `files/${fileName}`);
  await deleteObject(fileRef);
};
