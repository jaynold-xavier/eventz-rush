import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "../assets/js/firebase";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export async function getCurrentUser() {
  try {
    await waitForAuthInit();
    return await auth.currentUser;
  } catch (err) {
    console.log("Failed to get current user...", err);
    return null;
  }

  async function waitForAuthInit() {
    let unsubscribe;
    await new Promise((resolve) => {
      unsubscribe = auth.onAuthStateChanged((_) => resolve());
    });

    if (unsubscribe) {
      await unsubscribe();
    }
  }
}

export function authenticateWithGoogle() {
  return signInWithPopup(auth, googleProvider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log({ user, token });
      // IdP data available using getAdditionalUserInfo(result)
      return {
        user,
        token,
      };
    })
    .catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log({ email, credential, error });
      return error;
    });
}

export function authenticateWithFacebook() {
  return signInWithPopup(auth, facebookProvider)
    .then((result) => {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;

      // IdP data available using getAdditionalUserInfo(result)
      console.log({ user });
      return {
        user,
        token,
      };
    })
    .catch((error) => {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);

      console.log({ email, credential, error });
      return error;
    });
}

export function signOutOfApp() {
  return signOut(auth)
    .then(() => {
      sessionStorage.removeItem("Auth Token");
      // message.success("Signing out...");
    })
    .catch((error) => {
      console.log("sign out error", { error });
    });
}
