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
      disabled: true,
      loading: true
    };
  }

  componentDidMount() {
    this.getMostRecentQuizId();
  }



  componentWillUnmount = () => {
    this.setState({
      undefined
    });
  };

  getMostRecentQuizId = async () => {
    // get auth user scores and quizzes from context


    //NOT USING CONTEXT ANYMORE, GETTING QUIZ MANUALLY BY DATE

    //first will get last 7 quizzes that are before the current time
    let quizDates;
    let nextUnscoredQuizDate;
    db.getLastNQuizzes(7).then(res => {
      return (res.val());  //resolve Promise
    }).then(quizDates => {
      //next filter the quiz dates after the start of the week
      quizDates = Object.keys(quizDates).filter(quizDate => {
        return (moment(quizDate) > moment().startOf("isoWeek"))
      })
      return (quizDates)
    }).then(async quizDates => {
      db.getLastNScores(this.context.uid, 7).then(res => {
        return (res.val());  //resolve Promise
      }).then(scores => {


        // get quizzes without score
        if (scores !== null) { // if scores is null there are no recorded quizzes
          quizDates = quizDates.filter(quizDate => {
            if (typeof scores[quizDate] === "number") { // score exists
              return (false);
            } else {
              return (true);
            }
          }
          )
        }
        if (quizDates.length === 0) { /// no quizzes available this week
          this.setState({
            disabled: true,
            loading: false,
            todaysQuizNotAvailable: true,
          })
        } else if ((quizDates[quizDates.length - 1].substring(0, 10) !== moment().format("YYYY-MM-DD"))) { // Todays quiz not available but weekly quiz available
          this.setState({
            disabled: false,
            todaysQuizUrl: quizDates[quizDates.length - 1],
            todaysQuizNotAvailable: true,
            loading: false,
          })
        } else if (quizDates.length === 1 && (quizDates[quizDates.length - 1].substring(0, 10) === moment().format("YYYY-MM-DD"))) { // todays quiz available
          this.setState({
            disabled: false,
            todaysQuizUrl: quizDates[quizDates.length - 1],
            todaysQuizNotAvailable: false,
            loading: false,
          })
        }

      })
    })

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

    if (this.state.loading) {
      content = <div><Button
        color="primary"
        variant="contained"
        size="large"
        id="archive-link"
        disabled
      >
        Loading...
    </Button></div>
    }


    return (<div>{content}</div>);
  }
}
TodaysQuizButton.contextType = AuthUserContext;

export default withRouter(TodaysQuizButton);
