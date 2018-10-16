import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: "AIzaSyC0YbDHa0-H96NiIZJJ0zEWreBmdGrf7Vg",
  authDomain: "politiq-fc0e3.firebaseapp.com",
  databaseURL: "https://politiq-fc0e3.firebaseio.com",
  projectId: "politiq-fc0e3",
  storageBucket: "politiq-fc0e3.appspot.com",
  messagingSenderId: "56223684739"
};

if(!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
  db,
  auth,
}
