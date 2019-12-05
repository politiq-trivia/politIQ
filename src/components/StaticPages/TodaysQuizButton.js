import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";

import Button from "@material-ui/core/Button";

import { db } from "../../firebase";

import AuthUserContext from "../Auth/AuthUserContext";

class TodaysQuizButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todaysQuizUrl: "",
      todaysQuizNotAvailable: false
    };
  }

  componentDidMount() {
    this.getMostRecentQuizId();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // see if there have been new scores added since the last time the component was rendered
    if (nextState.todaysQuizUrl !== this.state.todaysQuizUrl) {
      return true;
    } else return false;
  }

  componentWillUnmount = () => {
    this.setState({
      undefined
    });
  };

  getMostRecentQuizId = async () => {
    // get auth user scores and quizzes from context

    // get scores
    let uidScoreDates;

    await db.getScoresByUid(this.context.uid).then(res => {
      if (res.val() === null) {
        uidScoreDates = [];
      } else {
        uidScoreDates = Object.keys(res.val());
      }
    });

    //get quiz dates
    const quizDates = Object.keys(this.props.quizContext);

    const mostRecentQuizDate = quizDates.slice(-1)[0]; // get last element in array (most recent quiz date)
    // which quiz dates this month don't have a score already?
    let availableQuizDates = quizDates.filter(
      date => !(uidScoreDates.indexOf(date) > -1)
    );

    // if most recent quiz is taken set todaysQuizNotAvailable true
    if (!availableQuizDates.includes(mostRecentQuizDate)) {
      this.setState({ todaysQuizNotAvailable: true });
    }
    // find next available quiz
    // we need to fix date strings to have time zone at the end because safari is amazing!
    availableQuizDates = availableQuizDates.map(date => {
      if (date.length < 13) {
        date = date + "T00:00:00"; //ISO 8601!!!!
        return moment(date);
      } else {
        date = date + ":00"; //ISO 8601!!!!
        return moment(date);
      }
    });

    // which is most recent
    const nextAvailableQuizDate = moment(
      new Date(Math.max.apply(null, availableQuizDates))
    ).format("YYYY-MM-DDTHH:mm");

    this.setState({
      todaysQuizUrl: nextAvailableQuizDate
    });
  };

  redirectToTodaysQuiz = () => {
    this.props.history.push(`/quiz/${this.state.todaysQuizUrl}`);
  };

  render() {
    console.log(this.state.todaysQuizNotAvailable);
    let buttonText = this.state.todaysQuizNotAvailable
      ? "Next Available Quiz"
      : "Today's Quiz";
    console.log(this.context);
    return (
      <Button
        color="primary"
        variant="contained"
        size="large"
        id="archive-link"
        onClick={this.redirectToTodaysQuiz}
      >
        {buttonText}
      </Button>
    );
  }
}
TodaysQuizButton.contextType = AuthUserContext;

export default withRouter(TodaysQuizButton);
