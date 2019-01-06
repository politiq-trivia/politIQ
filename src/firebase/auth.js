import { auth, db } from './firebase'; 

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

export const onAuthUserListener = (next, fallback) =>
  auth.onAuthStateChanged(authUser => {
    if (authUser) {
      db.ref(`users/${authUser.uid}`)
      .once('value')
      .then(snapshot => {
        const dbUser = snapshot.val();

        // default empty roles
        if (!dbUser.roles) {
          dbUser.roles = [];
        }

        // merge authUser and db user 
        authUser = {
          uid: authUser.uid,
          email: authUser.email,
          ...dbUser,
        };

        next(authUser);
      })
    } else {
      fallback()
    }
  })