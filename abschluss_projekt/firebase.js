// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHIF8JAnNg-d-wYu6kkLv5Ty3c-b-WGAs",
    authDomain: "abschlusspruefung-2022.firebaseapp.com",
    projectId: "abschlusspruefung-2022",
    storageBucket: "abschlusspruefung-2022.appspot.com",
    messagingSenderId: "150215737685",
    appId: "1:150215737685:web:25ce8976059d709b4eafdc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app