// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBWaNjgvH0Hq5DEY8LA5cyOMrSt3pqMEE",
  authDomain: "instagram-dev-93ee3.firebaseapp.com",
  databaseURL: "https://instagram-dev-93ee3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "instagram-dev-93ee3",
  storageBucket: "instagram-dev-93ee3.appspot.com",
  messagingSenderId: "385790117787",
  appId: "1:385790117787:web:254d115b93458ab2a4433e"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp