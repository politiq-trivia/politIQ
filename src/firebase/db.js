import { db } from "./firebase";

// User API

export const doCreateUser = (
  id,
  displayName,
  email,
  affiliation,
  isAdmin,
  bio,
  roles
) =>
  db.ref(`users/${id}`).set({
    displayName,
    email,
    affiliation,
    isAdmin,
    bio,
    roles
  });

export const onceGetUsers = () => {
  const users = db.ref("users").once("value");
  return users;
};

// delete the user and the stored score data
export const deleteUser = uid => {
  db.ref("users")
    .child(uid)
    .remove();
  db.ref("scores")
    .child(uid)
    .remove();
};

// push notification subscription - not currently used
export const subscribeUser = subscription => {
  db.ref()
    .child("subscriptions")
    .push({
      endpoint: subscription.endpoint
    })
    .child("keys")
    .set({
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    });
};

// Other Entity APIs ...

// -------------------------------------------------------------------------

// USERS

// ------------------------------------------------------------------------

// get one user and check if it is the admin
export const checkAdmin = uid => {
  console.log(uid, "uid in checkAdmin");

  const user = db
    .ref("users")
    .child(uid)
    .once("value", function(snapshot) {
      return snapshot.val().isAdmin;
    });
  return user;
};

export const lastActive = (uid, date) => {
  db.ref("users")
    .child(uid)
    .child("lastActive")
    .set(date);
};

export const getOneUser = uid => {
  const user = db
    .ref("users")
    .child(uid)
    .once("value");
  return user;
};

export const editUser = (uid, updates) => {
  const user = db
    .ref("users")
    .child(uid)
    .update(updates);
  return user;
};

// admin route - when user wins a competition, admin adds
// money won to their money earned & lifetime earnings (TO DO)
export const awardMoney = (uid, amount, lifetimeAmount) => {
  db.ref("users")
    .child(uid)
    .child("moneyWon")
    .set(amount);
  db.ref("users")
    .child(uid)
    .child("lifetimeEarnings")
    .set(lifetimeAmount);
};

// notify admin that they'd like a cashout
export const requestCashOut = (uid, date, email, displayName, moneyEarned) => {
  db.ref("cashOut")
    .child(uid)
    .child("moneyEarned")
    .set(moneyEarned);
  db.ref("cashOut")
    .child(uid)
    .child("date")
    .set(date);
  db.ref("cashOut")
    .child(uid)
    .child("email")
    .set(email);
  db.ref("cashOut")
    .child(uid)
    .child("displayName")
    .set(displayName);
  db.ref("users")
    .child(uid)
    .child("cashoutRequested")
    .set("true");
};

// get all the cashout requests
export const getAllCashoutRequests = () => {
  const cashOutReqs = db.ref("cashOut").once("value");
  return cashOutReqs;
};

// remove a cashout request from db - regardless of whether it was accepted or rejected
// because that's irrelevant here.
export const removeCashoutRequest = uid => {
  db.ref("cashOut")
    .child(uid)
    .remove();
};

// reset the user's money won and change their cashoutrequested status back to false
// then, send the updated users object back to the frontend
export const acceptCashOut = uid => {
  db.ref("users")
    .child(uid)
    .child("moneyWon")
    .set(0);
  db.ref("users")
    .child(uid)
    .child("cashoutRequested")
    .set("false");

  const updatedUserObj = db
    .ref("users")
    .child(uid)
    .once("value");
  return updatedUserObj;
};

export const cashoutNotification = (date, updateObject) => {
  db.ref("winners")
    .child(date)
    .set(updateObject);
};

// change the users cashoutrequest status to false
export const rejectCashOut = uid => {
  db.ref("users")
    .child(uid)
    .child("cashoutRequested")
    .set("false");
  const updatedUserObj = db
    .ref("users")
    .child(uid)
    .once("value");
  return updatedUserObj;
};

export const getAffiliation = uid => {
  const affiliation = db
    .ref("users")
    .child(uid)
    .child("affiliation")
    .once("value", function(snapshot) {
      return snapshot.val();
    });
  return affiliation;
};

export const addMailchimpId = (uid, mailchimpId, freq) => {
  db.ref("users")
    .child(uid)
    .child("mailchimpId")
    .child(freq)
    .set(mailchimpId);
};

// update game sound settings
export const soundSettings = (uid, soundPref) => {
  db.ref("users")
    .child(uid)
    .child("soundsOn")
    .set(soundPref);
};

// update score visibility settings
export const scoreVisibility = (uid, invisibleScore) => {
  db.ref("users")
    .child(uid)
    .child("invisibleScore")
    .set(invisibleScore);
};

// -------------------------------------------------------------------------

// QUIZZES

// --------------------------------------------------------------------------

// Add a quiz
export const addQuiz = (date, title) => {
  var quizzes = db.ref().child("quizzes");
  quizzes
    .child(date)
    .child("quiz-title")
    .set(title);
};

// add questions to a quiz
export const addQuestion = (
  date,
  questionID,
  qtext,
  a1text,
  a1correct,
  a2text,
  a2correct,
  a3text,
  a3correct,
  answerExplanation,
  timerDuration
) => {
  var whichQuiz = db.ref().child("quizzes/" + date + "/" + questionID);
  // whichQuiz.child('qID').set(questionID)
  whichQuiz.child("q1").set(qtext);
  whichQuiz.child("a1text").set(a1text);
  whichQuiz.child("a2text").set(a2text);
  whichQuiz.child("a3text").set(a3text);
  whichQuiz.child("a1correct").set(a1correct);
  whichQuiz.child("a2correct").set(a2correct);
  whichQuiz.child("a3correct").set(a3correct);
  whichQuiz.child("answerExplanation").set(answerExplanation);
  whichQuiz.child("timerDuration").set(timerDuration);
};

// get a list of all the quizzes
export const getQuizzes = () => {
  const quizzes = db
    .ref()
    .child("quizzes")
    .once("value");
  return quizzes;
};

// get a specific quiz

export const getQuiz = date => {
  const quiz = db
    .ref()
    .child("quizzes/" + date)
    .once("value");
  return quiz;
};

// delete a question

export const deleteQuestion = (date, qNum) => {
  const question = db
    .ref()
    .child("quizzes/" + date)
    .child(qNum)
    .remove();
  return question;
};

// delete a quiz

export const deleteQuiz = date => {
  db.ref()
    .child("quizzes/" + date)
    .remove();
  db.ref()
    .child("scores")
    .once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        const dates = Object.keys(childData);
        if (dates.includes(date)) {
          db.ref()
            .child("scores")
            .child(childKey)
            .child(date)
            .remove();
        }
      });
    });
};

// edit quiz

export const editQuiz = (date, updates) => {
  const quiz = db
    .ref()
    .child("quizzes/" + date)
    .update(updates);
  return quiz;
};

// add quiz to RSS feed
export const addToRSS = (date, title) => {
  db.ref()
    .child("rssQuiz")
    .child(date)
    .set(title);
};

// -----------------------------------------------

// SCORES

// -------------------------------------------------

export const setScore = (uid, date, score) => {
  db.ref()
    .child("scores/" + uid)
    .child(date)
    .set(score);
};

export const getScores = () => {
  const scores = db
    .ref()
    .child("scores")
    .once("value");
  return scores;
};

export const checkQuizScore = (uid, date) => {
  const scores = db
    .ref()
    .child("scores/" + uid + "/" + date)
    .once("value");
  return scores;
};

export const resetScores = (uid, date) => {
  db.ref()
    .child("scores")
    .child(uid)
    .child(date)
    .remove();
};

export const getDisplayNames = username => {
  const displayName = db
    .ref()
    .child("users/" + username)
    .child("displayName")
    .once("value")
    .then(function(snapshot) {
      const snap = snapshot.val();
      return snap;
    });
  const invisibleScore = db
    .ref()
    .child("users/" + username)
    .child("invisibleScore")
    .once("value")
    .then(function(snapshot) {
      const snap = snapshot.val();
      return snap;
    });
  const userData = { displayName, invisibleScore };
  return userData;
};

export const getDisplayNames2 = async username => {
  let displayName;
  let invisibleScore;
  await db
    .ref()
    .child("users/" + username)
    .child("displayName")
    .once("value")
    .then(res => (displayName = res.val()));
  await db
    .ref()
    .child("users/" + username)
    .child("invisibleScore")
    .once("value")
    .then(res => (invisibleScore = res.val()));
  const userData = { displayName, invisibleScore };
  return userData;
};

export const getOnlyDisplayNames = username => {
  const displayName = db
    .ref()
    .child("users/" + username)
    .child("displayName")
    .once("value")
    .then(function(snapshot) {
      const snap = snapshot.val();
      return snap;
    });
  return displayName;
};

// if I move this logic to the frontend, it ends up being three fewer db calls.
// this function returns all users in that party, regardless of whether they have scores.
export const getUserByAffiliation = affiliation => {
  let partyUids = [];
  const users = db
    .ref()
    .child("users/")
    .once("value")
    .then(function(snapshot) {
      const snap = snapshot.val();
      const data = Object.values(snap);
      const uids = Object.keys(snap);
      for (let i = 0; i < data.length; i++) {
        if (data[i].affiliation === affiliation) {
          partyUids.push(uids[i]);
        }
      }
      return partyUids;
    });
  return users;
};

export const getScoresByUid = uid => {
  const scores = db
    .ref()
    .child("scores/")
    .child(uid)
    .once("value");
  return scores;
};

// separate score holder for points the user earns by getting or submitting scores
export const getSubmittedOrContestedScoreByUid = uid => {
  const score = db
    .ref()
    .child("/scores/")
    .child(uid)
    .child("submitted")
    .once("value");
  return score;
};

export const setSubmittedOrContestedScoreByUid = (uid, date, score) => {
  db.ref()
    .child("/scores/")
    .child(uid)
    .child("submitted")
    .child(date)
    .set(score);
};

// ----------------------------------------------------------

// USER SUBMITTED QUESTIONS

// ----------------------------------------------------------

// save a user-submitted question
export const submitQuestion = (
  uid,
  date,
  qtext,
  a1text,
  a1correct,
  a2text,
  a2correct,
  a3text,
  a3correct,
  source,
  email,
  displayName
) => {
  const question = db
    .ref()
    .child("q4review")
    .child(date);
  question.child("q1").set(qtext);
  question.child("a1text").set(a1text);
  question.child("a2text").set(a2text);
  question.child("a3text").set(a3text);
  question.child("a1correct").set(a1correct);
  question.child("a2correct").set(a2correct);
  question.child("a3correct").set(a3correct);
  question.child("source").set(source);
  question.child("fromUser").set(uid);
  question.child("userEmail").set(email);
  question.child("displayName").set(displayName);
};

// retrieve one user submitted question from the db for review
export const getOneQuestion = () => {
  const question = db
    .ref()
    .child("q4review")
    .once("value");
  return question;
};

// deleteUserQuestion
export const deleteUserQuestion = date => {
  db.ref()
    .child("q4review")
    .child(date)
    .remove();
};

// move question from q4review to qBank
export const acceptQuestion = (date, selectedQ) => {
  deleteUserQuestion(date);
  const question = db
    .ref()
    .child("qbank")
    .child(date);
  question.child("q1").set(selectedQ.q1);
  question.child("a1text").set(selectedQ.a1text);
  question.child("a2text").set(selectedQ.a2text);
  question.child("a3text").set(selectedQ.a3text);
  question.child("a1correct").set(selectedQ.a1correct);
  question.child("a2correct").set(selectedQ.a2correct);
  question.child("a3correct").set(selectedQ.a3correct);
};

export const getQBank = () => {
  const questions = db
    .ref()
    .child("qbank")
    .once("value");
  return questions;
};

export const removeFromQBank = date => {
  db.ref()
    .child("qbank")
    .child(date)
    .remove();
};

// --------------------------------------------------------

// CONTESTED QUESTIONS

// --------------------------------------------------------

export const contestQuestion = (date, qID, uid, issue, source, email) => {
  const contested = db
    .ref("contestedQ")
    .child(date)
    .child(qID)
    .child(uid);
  contested.child("issue").set(issue);
  contested.child("source").set(source);
  contested.child("userEmail").set(email);
  contested.child("uid").set(uid);
};

export const getContestedQuiz = () => {
  const quiz = db
    .ref()
    .child("contestedQ")
    .once("value");
  return quiz;
};

export const deleteContest = (date, qID, uid) => {
  db.ref("contestedQ")
    .child(date)
    .child(qID)
    .child(uid)
    .remove();
};

export const acceptContest = (date, qID, uid, issue, source) => {
  const accepted = db
    .ref("acceptedContests")
    .child(date)
    .child(qID)
    .child(uid);
  accepted.child("issue").set(issue);
  accepted.child("source").set(source);

  db.ref("contestedQ")
    .child(date)
    .child(qID)
    .child(uid)
    .remove();
};

// ----------------------------------------------------------

// COMMENTS

// ----------------------------------------------------------

export const getComments = uid => {
  const commentsObj = db
    .ref()
    .child("comments")
    .child(uid)
    .once("value");
  return commentsObj;
};

export const addComment = (profileID, commentObj) => {
  const comment = db
    .ref()
    .child("comments")
    .child(profileID)
    .child(commentObj.date);
  comment.child("text").set(commentObj.text);
  comment.child("user").set(commentObj.user);
  comment.child("uid").set(commentObj.uid);
  comment.child("date").set(commentObj.date);
};

export const deleteComment = (profileID, date) => {
  db.ref()
    .child("comments")
    .child(profileID)
    .child(date)
    .remove();
};
