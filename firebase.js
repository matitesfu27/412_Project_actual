import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyAS649QFsuYGyOxcblA0bLM3O-MTobxPPk",
    authDomain: "cosc-412-c4189.firebaseapp.com",
    databaseURL: "https://cosc-412-c4189-default-rtdb.firebaseio.com",
    projectId: "cosc-412-c4189",
    storageBucket: "cosc-412-c4189.appspot.com",
    messagingSenderId: "446989331804",
    appId: "1:446989331804:web:96a73809e081fb72546599",
    measurementId: "G-WWEQEW5RQW"
  };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;