import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../assets/js/firebase";

export async function uploadResource(file) {
  const storageRef = ref(storage, file.name);

  // 'file' comes from the Blob or File API
  return uploadBytes(storageRef, file)
    .then((snapshot) => {
      return getDownloadURL(snapshot.ref);
    })
    .then((downloadURL) => {
      return downloadURL;
    });
}

export async function downloadResource(fileName) {
  const storageRef = ref(storage, fileName);

  return getDownloadURL(storageRef).then((url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  });
}
