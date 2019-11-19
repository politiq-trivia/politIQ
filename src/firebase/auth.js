import { auth, db } from "./firebase";
// import * as db from './db';

// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password);

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// Sign Out
export const doSignOut = () => {
  auth.signOut().then(() => {
    window.location.replace("/");
  });
};

// Password Reset
export const doPasswordReset = email => auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = password =>
  auth.currentUser.updatePassword(password);

// check if the user is logged in
export const onAuthUserListener = (next, fallback) =>
  auth.onAuthStateChanged(async authUser => {
    if (authUser) {
      let dbUser = {};
      await db
        .ref("users")
        .child(authUser.uid)
        .on("value", function(snapshot) {
          dbUser = snapshot.val();

          if (!dbUser.roles) {
            dbUser.roles = [];
          }

          // merge authUser and db user
          authUser = {
            uid: authUser.uid,
            email: authUser.email,
            emailVerified: authUser.emailVerified,
            providerData: authUser.providerData,
            ...dbUser
          };
          next(authUser);
        });
    } else {
      fallback();
    }
  });

// email verification
export const doSendEmailVerification = () => {
  console.log(
    process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    "EMAIL REDIRECT"
  );
  return auth.currentUser.sendEmailVerification({
    url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT
  });
};

export const deleteUser = (email, password) => {
  console.log(email);
  doSignInWithEmailAndPassword(email, password)
    .then(() => {
      auth.currentUser
        .delete()
        .then(console.log("user deleted").catch(err => console.log(err)));
    })
    .catch(err => console.log(err));
};
