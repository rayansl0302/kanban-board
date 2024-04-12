// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const environment = {
  production: false,
  apiUrl: '',
  firebaseConfig: {
    apiKey: "AIzaSyD61hChp3I23xhrm6PDkMNhjGTKcDeZvE4",
    authDomain: "quadro-kanban.firebaseapp.com",
    projectId: "quadro-kanban",
    storageBucket: "quadro-kanban.appspot.com",
    messagingSenderId: "715933006399",
    appId: "1:715933006399:web:5689ff463f4ae62874168a"
  }
};


// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);
