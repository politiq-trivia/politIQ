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

// -------------------------------------------------------------------------

// USERS

// ------------------------------------------------------------------------

// get one user and check if it is the admin
export const checkAdmin = (uid) => {
  const user = db.ref('users').child(uid).once('value', function(snapshot) {
    return snapshot.val().isAdmin;
  });
  return user;
}

// -------------------------------------------------------------------------

// QUIZZES

// --------------------------------------------------------------------------


// Add a quiz
export const addQuiz = (date, title) => {
  var quizzes = db.ref().child('quizzes');
  quizzes.child(date).child('quiz-title').set(title)
}

// add questions to a quiz
export const addQuestion = (date, questionID, qtext, a1text, a1correct, a2text,
  a2correct, a3text, a3correct, a4text, a4correct) => {

  var whichQuiz = db.ref().child('quizzes/' + date + "/" + questionID)
  // whichQuiz.child('qID').set(questionID)
  whichQuiz.child('q1').set(qtext)
  whichQuiz.child('a1text').set(a1text)
  whichQuiz.child('a2text').set(a2text)
  whichQuiz.child('a3text').set(a3text)
  whichQuiz.child('a4text').set(a4text)
  whichQuiz.child('a1correct').set(a1correct)
  whichQuiz.child('a2correct').set(a2correct)
  whichQuiz.child('a3correct').set(a3correct)
  whichQuiz.child('a4correct').set(a4correct)
}

// get a list of all the quizzes
export const getQuizzes = () => {
  const quizzes = db.ref().child('quizzes').once('value')
  return quizzes;
}

// get a specific quiz

export const getQuiz = (date) => {
  const quiz = db.ref().child('quizzes/' + date).once('value')
  return quiz;
}

// delete a question

export const deleteQuestion = (date, qNum) => {
  console.log(date, qNum, "db")
  const question = db.ref().child('quizzes/' + date).child(qNum).remove()
  return question;
}

// delete a quiz

// -----------------------------------------------

// SCORES

// -------------------------------------------------

export const setScore = (uid, date, score) => {
  db.ref().child('scores/' + uid).child(date).set(score);
}

export const getScores = () => {
  const scores = db.ref().child('scores').once('value')
  return scores;
}

export const getDisplayNames = (username) => {
  const displayName = db.ref().child('users/' + username).once('value')
  return displayName;
}
