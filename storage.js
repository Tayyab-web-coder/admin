import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js';
import { doc, setDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

export const uploadFile = async (file, metadata, db, storage) => {
  const fileRef = ref(storage, `files/${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);

  const fileId = doc(collection(db, 'files')).id;
  await setDoc(doc(db, 'files', fileId), {
    name: file.name,
    url: url,
    description: metadata.description
  });

  return fileId;
};

export const updateFileMetadata = async (fileId, metadata, db) => {
  const fileDocRef = doc(db, 'files', fileId);
  await updateDoc(fileDocRef, metadata);
};

export const deleteFile = async (fileId, fileName, db, storage) => {
  const fileRef = ref(storage, `files/${fileName}`);
  await deleteDoc(doc(db, 'files', fileId));
};
