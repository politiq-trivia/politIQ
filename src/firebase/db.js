import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email, affiliation) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    affiliation,
    // role,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

// Other Entity APIs ...
