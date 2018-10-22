import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import withAuthorization from './withAuthorization';
import { db } from '../firebase';

import * as routes from '../constants/routes';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
    };
  }

  componentDidMount() {
    db.onceGetUsers().then(snapshot =>
      this.setState({ users: snapshot.val() })
    );
  }

  render() {
    const { users } = this.state;

    return (
      <Paper className="pageStyle home">
        <h1>Did you watch today's news? Do you think you know politics?</h1>
        <h1>Click below to find out!</h1>

        <Button color="primary" variant="outlined" size="large" id="today">Take Today's Quiz</Button>

        <Link to={routes.QUIZ_ARCHIVE} style={{ textDecoration: 'none', color: '#a54ee8' }}>
          <Button color="primary" variant="outlined" id="archive-link">
            Past Quizzes
          </Button>
        </Link>

        <h4>The more you play, the better you score!</h4>

        { !!users && <UserList users={users} /> }
      </Paper>
    );
  }
}

const UserList = ({ users }) =>
  <div>
    <h2>List of Usernames of Users</h2>
    <p>(Saved on Sign Up in Firebase Database)</p>

    {Object.keys(users).map(key =>
      <div key={key}>{users[key].username}</div>
    )}
  </div>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);
