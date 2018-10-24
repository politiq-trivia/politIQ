import { storage } from './firebase';

console.log(storage, 'this is storage from storage.js')

// reference to firebase storage
export const imageRef = storage.ref('images');
console.log(imageRef, 'this is imageRef')

// var storageRef = storage.ref();
