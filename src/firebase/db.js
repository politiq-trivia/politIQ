import { db } from './firebase';

// User API

export const doCreateUser = (id, displayName, email, affiliation, isAdmin, bio) =>
  db.ref(`users/${id}`).set({
    displayName,
    email,
    affiliation,
    isAdmin,
    bio,
  });

export const onceGetUsers = () => {
  const users = db.ref('users').once('value');
  return users;
}

// delete the user and the stored score data
export const deleteUser = (uid) => {
  db.ref('users').child(uid).remove()
  db.ref('scores').child(uid).remove()
}

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

export const lastActive = (uid, date) => {
  db.ref('users').child(uid).child('lastActive').set(date)
}

export const getOneUser = (uid) => {
  const user = db.ref('users').child(uid).once('value')
  return user;
}

export const editUser = (uid, updates) => {
  const user = db.ref('users').child(uid).update(updates)
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
  const question = db.ref().child('quizzes/' + date).child(qNum).remove()
  return question;
}

// delete a quiz

export const deleteQuiz = (date) => {
  const quiz = db.ref().child('quizzes/' + date).remove()
  return quiz;
}

// edit quiz

export const editQuiz = (date, updates) => {
  const quiz = db.ref().child('quizzes/' + date).update(updates)
  return quiz;
}

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

export const getUserByAffiliation = (affiliation) => {
  let partyUids = []
  const users = db.ref().child('users/').once('value').then(function(snapshot) {
    const snap = snapshot.val()
    const data = Object.values(snap)
    const uids = Object.keys(snap)
    for (let i = 0; i < data.length; i++) {
      if (data[i].affiliation === affiliation) {
        partyUids.push(uids[i])
      }
    }
    return partyUids;
  })
  return users;
}

// ----------------------------------------------------------

// USER SUBMITTED QUESTIONS

// ----------------------------------------------------------

// save a user-submitted question
export const submitQuestion = (uid, date, qtext, a1text, a1correct, a2text, a2correct, a3text, a3correct, a4text, a4correct, source) => {
  const question = db.ref().child('q4review').child(date)
  question.child('q1').set(qtext)
  question.child('a1text').set(a1text)
  question.child('a2text').set(a2text)
  question.child('a3text').set(a3text)
  question.child('a4text').set(a4text)
  question.child('a1correct').set(a1correct)
  question.child('a2correct').set(a2correct)
  question.child('a3correct').set(a3correct)
  question.child('a4correct').set(a4correct)
  question.child('source').set(source)
  question.child('fromUser').set(uid)
}

// retrieve one user submitted question from the db for review
export const getOneQuestion = () => {
  const question = db.ref().child('q4review').once('value');
  return question;
}

// deleteUserQuestion
export const deleteUserQuestion = (date) => {
  db.ref().child('q4review').child(date).remove();
}

// move question from q4review to qBank
export const acceptQuestion = (date, selectedQ) => {
  deleteUserQuestion(date)
  const question = db.ref().child('qbank').child(date);
  question.child('q1').set(selectedQ.q1)
  question.child('a1text').set(selectedQ.a1text)
  question.child('a2text').set(selectedQ.a2text)
  question.child('a3text').set(selectedQ.a3text)
  question.child('a4text').set(selectedQ.a4text)
  question.child('a1correct').set(selectedQ.a1correct)
  question.child('a2correct').set(selectedQ.a2correct)
  question.child('a3correct').set(selectedQ.a3correct)
  question.child('a4correct').set(selectedQ.a4correct)
}

export const getQBank = () => {
  const questions = db.ref().child('qbank').once('value');
  return questions;
}

export const removeFromQBank = (date) => {
  db.ref().child('qbank').child(date).remove()
}
