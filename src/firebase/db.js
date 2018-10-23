import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email, affiliation, isAdmin) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    affiliation,
    isAdmin,
    // role,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

// Other Entity APIs ...

// get one user and check if it is the admin
export const checkAdmin = (uid) => {
  const user = db.ref('users').child(uid).once('value', function(snapshot) {
    return snapshot.val().isAdmin;
  });
  return user;
}


// Add a quiz
export const addQuiz = (title) => {
  var ref = db.ref();
  ref.child("quizzes").set(title)
  console.log('addQuiz called')
}
