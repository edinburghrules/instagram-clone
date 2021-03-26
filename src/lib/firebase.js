import Firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyDIVvCeU67YmjwbjBSIz1yJJcag-0jd1EA",
  authDomain: "insta-clone-15a51.firebaseapp.com",
  projectId: "insta-clone-15a51",
  storageBucket: "insta-clone-15a51.appspot.com",
  messagingSenderId: "935610574272",
  appId: "1:935610574272:web:c47590b412fa5061625425",
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

export { firebase, FieldValue };
