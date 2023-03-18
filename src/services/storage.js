import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../assets/js/firebase";

export async function uploadResource(file) {
  const storageRef = ref(storage, file.name);
  console.log({ file });

  // 'file' comes from the Blob or File API
  return uploadBytes(storageRef, file)
    .then((snapshot) => {
      return getDownloadURL(snapshot.ref);
    })
    .then((downloadURL) => {
      console.log("Download URL", downloadURL);
      return downloadURL;
    });
}

export async function getResource(url) {
  // Create a reference from an HTTPS URL
  // Note that in the URL, characters are URL escaped!
  const storageRef = ref(storage, url);
  return await getDownloadURL(storageRef);
}
