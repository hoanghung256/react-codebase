import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

function getFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyA7Ua2i0af4fSOOvf8W9M6nZh8QkPp7P9o",
        authDomain: "ntervu-4abd6.firebaseapp.com",
        projectId: "ntervu-4abd6",
        storageBucket: "ntervu-4abd6.firebasestorage.app",
        messagingSenderId: "504877747235",
        appId: "1:504877747235:web:bfd5898ac1b063e1b87596",
        measurementId: "G-RSZ088B9ME",
    };
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const storage = getStorage(app);
    return { app, storage };
}

/**
 * Get a download URL later if you only stored the path.
 * @param {string} path
 * @returns {Promise<string>}
 */
export async function getFileDownloadURL(path) {
    const { storage } = getFirebase();
    return getDownloadURL(ref(storage, path));
}
