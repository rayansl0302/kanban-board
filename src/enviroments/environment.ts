// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const environment = {
  production: false,
  apiUrl: '',
  firebaseConfig: {
    apiKey: "AIzaSyBD-sy5Yk-vV35xreHuKpNqsIPW4UkApes",
    authDomain: "kaban-board-c0294.firebaseapp.com",
    projectId: "kaban-board-c0294",
    storageBucket: "kaban-board-c0294.appspot.com",
    messagingSenderId: "874273593596",
    appId: "1:874273593596:web:59ce3c94eb2f593f751f79"
  }
};


// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);
