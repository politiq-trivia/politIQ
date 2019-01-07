import { auth } from './firebase'; 
import * as db from './db';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// Sign Out
export const doSignOut = () =>
  auth.signOut();

// Password Reset
export const doPasswordReset = (email) =>
  auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = (password) =>
  auth.currentUser.updatePassword(password);

// check if the user is logged in
export const onAuthUserListener = (next, fallback) =>
  auth.onAuthStateChanged(authUser => {
    if (authUser) {
      // db.ref(`users`).child(authUser.uid)
      // .once('value')
      db.getOneUser(authUser.uid)
      .then(snapshot => {
        const dbUser = snapshot.val();
        if (snapshot.val() === null) {
          return;
        }
        // default empty roles
        if (!dbUser.roles) {
          dbUser.roles = [];
        }

        // merge authUser and db user 
        authUser = {
          uid: authUser.uid,
          email: authUser.email,
          emailVerified: authUser.emailVerified,
          providerData: authUser.providerData,
          ...dbUser,
        };
        next(authUser);
      })
    } else {
      fallback()
    }
  })

// email verification
export const doSendEmailVerification = () => {
  console.log(process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT, 'EMAIL REDIRECT')
  return auth.currentUser.sendEmailVerification({
    url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
  });
}