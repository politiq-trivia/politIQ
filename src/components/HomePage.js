import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import * as moment from 'moment';

import withAuthorization from './withAuthorization';
import { db } from '../firebase';

import * as routes from '../constants/routes';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mostRecentQuizURL: ""
    };
  }

  componentDidMount() {
    this.getMostRecentQuizId()

  }

  getMostRecentQuizId = async () => {
    await db.getQuizzes()
      .then(response => {
        const data = response.val();
        const dateArray = Object.keys(data);
        const mostRecent = dateArray[dateArray.length-1]
        this.setState({
          mostRecentQuizURL: "quiz/" + mostRecent
        })
      })
  }

  render() {
    return (
      <Paper className="pageStyle home">
        <h1>Did you watch today's news? Do you think you know politics?</h1>
        <h1>Click below to find out!</h1>

        <Link to={this.state.mostRecentQuizURL} style={{ textDecoration: "none" }}>
          <Button color="primary" variant="outlined" size="large" id="today">
            Take Today's Quiz
          </Button>
        </Link>

        <Link to={routes.QUIZ_ARCHIVE} style={{ textDecoration: 'none', color: '#a54ee8' }}>
          <Button color="primary" variant="outlined" id="archive-link">
            Past Quizzes
          </Button>
        </Link>


        <h4>The more you play, the better you score!</h4>

      </Paper>
    );
  }
}



const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);
