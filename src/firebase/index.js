import * as auth from './auth';
import * as db from './db';
import * as firebase from './firebase';
import * as storage from './storage';
import { app, provider } from './firebase';
import FirebaseContext, { withFirebase } from './context';

export {
  app,
  auth,
  db,
  firebase,
  storage,
  provider,
  FirebaseContext,
  withFirebase
};
