import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email, affiliation, isAdmin) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    affiliation,
    isAdmin,
    // role,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

// Other Entity APIs ...

// get one user
export const checkAdmin = (uid) => {
  let isAdmin;
  const users = db.ref('users')
  users.on("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      isAdmin=childData.isAdmin;
      console.log(childData, 'this is childdata');
      if (isAdmin) {
        console.log('true')
        return true;
      } else {
        console.log('false')
        return false;
      }
    });
  });
}


function gotUsers(users) {
  console.log(users.val());
  console.log('response from getUser ^^')
  const usersObject = users.val();
  console.log(usersObject, 'this is usersObject');
  return usersObject;
}

function errUsers(err) {
  console.error("Error!");
  console.error(err);
}
