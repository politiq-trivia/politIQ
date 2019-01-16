import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Auth/index';

import * as routes from '../../constants/routes';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TodaysQuizButton from './TodaysQuizButton';

import './Static.css';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noAvailableQuizzes: false,
    };
  }
  
  showErrorMessage = () => {
    this.setState({
      noAvailableQuizzes: true,
    })
  }

  render() {
    return (
      <Paper className="pageStyle home">
        <Helmet>
          <title>Home | politIQ </title>
        </Helmet>
        <h1>Did you pay attention to today's news and think you know politics?</h1>
        <h1>Prove it!</h1>

        { this.state.noAvailableQuizzes ? <p className="home-taken">You've taken all the quizzes we have available! Check back tomorrow for the next challenge.</p> : null }

        <TodaysQuizButton buttonText="Take Today's Quiz" id="today" disabled={this.state.noAvailableQuizzes} showErrorMessage={this.showErrorMessage} signedInUser={this.props.signedInUser}/>

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



const condition = authUser => !!authUser;

export default compose(
  // withEmailVerification,
  withAuthorization(condition),
)(HomePage);
