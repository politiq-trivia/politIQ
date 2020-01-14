import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";

import Button from "@material-ui/core/Button";

import { db } from "../../firebase";

import AuthUserContext from "../Auth/AuthUserContext";

import loading from "../../6.gif"
class TodaysQuizButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todaysQuizUrl: "",
      todaysQuizNotAvailable: false,
      disabled: false,
      loading: true
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

    let mostRecentQuizDate = quizDates.slice(-1)[0]; // get last element in array (most recent quiz date)

    // which quiz dates this month don't have a score already?
    let availableQuizDates = quizDates.filter(
      date => !(uidScoreDates.indexOf(date) > -1)
    );


    // Fix available quiz dates and most recent quiz date format
    availableQuizDates = availableQuizDates.map(date => {
      if (date.length < 13) {
        date = date + "T00:00:00"; //ISO 8601!!!!
        return (date);
      } else {
        date = date + ":00"; //ISO 8601!!!!
        return (date);
      }
    });


    if (mostRecentQuizDate.length < 13) {
      mostRecentQuizDate = mostRecentQuizDate + "T00:00:00"; //ISO 8601!!!!
      mostRecentQuizDate = (mostRecentQuizDate);
    } else {
      mostRecentQuizDate = mostRecentQuizDate + ":00"; //ISO 8601!!!!
      mostRecentQuizDate = (mostRecentQuizDate);
    }



    // Get rid of available quiz dates in the future
    availableQuizDates = availableQuizDates.filter(date => moment(date) < moment())


    // if most recent quiz is not available set todaysQuizNotAvailable to true
    if (!availableQuizDates.includes(mostRecentQuizDate)) {
      this.setState({ todaysQuizNotAvailable: true });
    }

    // map availableQuizDates to moment objects
    availableQuizDates = availableQuizDates.map(date => {
      return (moment(date));
    })

    // which is most recent
    const nextAvailableQuizDate = moment(
      new Date(Math.max.apply(null, availableQuizDates))
    );

    if (nextAvailableQuizDate < moment().startOf('isoWeek')) {
      this.setState({ disabled: true })
    }
    this.setState({
      todaysQuizUrl: nextAvailableQuizDate.format("YYYY-MM-DDTHH:mm"),
      loading: false
    });


  };



  redirectToTodaysQuiz = () => {
    this.props.history.push(`/quiz/${this.state.todaysQuizUrl}`);
  };

  render() {

    let buttonText = this.state.todaysQuizNotAvailable
      ? "Next Weekly Quiz"
      : "Today's Quiz";

    let content = (<Button
      color="primary"
      variant="contained"
      size="large"
      id="archive-link"
      onClick={this.redirectToTodaysQuiz}
    >
      {buttonText}
    </Button>)
    if (this.state.disabled) {
      content = <Button
        color="primary"
        variant="contained"
        size="large"
        id="archive-link"
        disabled
      >
        {buttonText}
      </Button>
    }


    return (<div>{content}</div>);
  }
}
TodaysQuizButton.contextType = AuthUserContext;

export default withRouter(TodaysQuizButton);
