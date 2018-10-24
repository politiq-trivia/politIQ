import { db } from './firebase';

// User API

export const doCreateUser = (id, displayName, email, affiliation, isAdmin) =>
  db.ref(`users/${id}`).set({
    displayName,
    email,
    affiliation,
    isAdmin,
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
export const addQuiz = (date, title) => {
  var quizzes = db.ref().child('quizzes');
  quizzes.child(date).set(title)
  console.log('addQuiz called')
}

// to store the questions, what if I grab them in an array of objects on the front end,
// and then loop through that array on this end.
// each quiz has multiple questions.
// each question has multiple answers
// answers are going to be objects with value and isCorrect properties
