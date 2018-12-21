import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// import * as moment from 'moment';

import withAuthorization from '../Auth/withAuthorization';
import { db } from '../../firebase';

import * as routes from '../../constants/routes';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import './Static.css';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mostRecentQuizURL: "",
      noAvailableQuizzes: false,
    };
  }

  componentDidMount() {
   
    db.getScoresByUid(this.props.signedInUser)
      .then(response => {
        const scoreData = response.val()
        this.setState({
          signedInUser: this.props.signedInUser,
          scoreData,
        })
        this.getMostRecentQuizId()
      })
  }

  componentWillUnmount = () => {
    this.setState({
      undefined
    })
  }

  getMostRecentQuizId = async () => {
    await db.getQuizzes()
      .then(response => {
        const data = response.val();
        const dateArray = Object.keys(data);
        let counter = 1;
        let mostRecent = dateArray[dateArray.length-counter]
        if (this.state.scoreData[mostRecent]) {

          while (this.state.scoreData[mostRecent] && counter < dateArray.length) {
            counter++
            mostRecent = dateArray[dateArray.length-counter]
            if (this.state.scoreData[mostRecent] === undefined) {
              break;
            }
          }
          if (counter > dateArray.length) {
            this.setState({
              noAvailableQuizzes: true,
            })
          }
        }

        this.setState({
          mostRecentQuizURL: "quiz/" + mostRecent
        })
      })
      
  }

  redirectToQuiz = () => {
    this.props.history.push(`/${this.state.mostRecentQuizURL}`)
  }

  render() {
    return (
      <Paper className="pageStyle home">
        <Helmet>
          <title>Home | politIQ </title>
        </Helmet>
        <h1>Did you watch today's news? Do you think you know politics?</h1>
        <h1>Click below to find out!</h1>

        { this.state.noAvailableQuizzes ? <p className="home-taken">You've taken all the quizzes we have available! Check back tomorrow for the next challenge.</p> : null }

        <Button color="primary" variant="outlined" size="large" id="today" disabled={this.state.noAvailableQuizzes} onClick={this.redirectToQuiz}>
          Take Today's Quiz
        </Button>

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
