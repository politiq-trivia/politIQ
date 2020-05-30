import { auth, db } from "./firebase";
import { storage } from "../firebase";
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
        .on("value", function (snapshot) {
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
  // first reauthenticate the user
  doSignInWithEmailAndPassword(email, password)
    .then(res => {
      var user = auth.currentUser;
      const uid = res.user.uid;

      //then

      //delete user in database
      db.ref("scores")
        .child(uid)
        .remove()
        .then(res => console.log(res))
        .catch(error => console.log(error));
      db.ref("users")
        .child(uid)
        .remove()
        .then(res => console.log(res))
        .catch(error => console.log(error));

      // and delete image reference if they have one
      storage.imageRef
        .child(this.props.authUser.uid + ".jpg")
        .delete()
        .then(res => console.log(res))
        .catch(err => console.log(err));

      // and delete user in authentification database
      user
        .delete()
        .then(res => {
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};
