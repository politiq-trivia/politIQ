import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { db } from "../../firebase";

import QuizContext from "./quizContext";

import Button from "@material-ui/core/Button";
import "./quiz.css";
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};
class NextAvailableQuizButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextQuizDate: "",
      disabled: false
    };
    this.getNextQuiz = this.getNextQuiz.bind(this);
  }

  getNextQuiz = async () => {
    // get quizzes
    const quizzes = this.context; //provided by App.js

    /*     await db.getQuizzes().then(res => {
      quizzes = res.val();
    }); */

    // get scores
    let uidScoreDates;

    await db.getScoresByUid(this.props.uid).then(res => {
      uidScoreDates = Object.keys(res.val());
      if (!uidScoreDates) uidScoreDates = [];
    });
    ///////// get All dates this month where user score does not exist

    //get this month quiz dates
    const quizDates = Object.keys(quizzes);

    // which quiz dates this month don't have a score already?
    let availableQuizDates = quizDates.filter(
      date => !(uidScoreDates.indexOf(date) > -1)
    );

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
    console.log(nextAvailableQuizDate);
    return nextAvailableQuizDate;
  };

  handleClick = async () => {
    //get next quiz in this month with no score
    let quizDateUrl;
    let quizDate;
    await this.getNextQuiz(this.props.date).then(res => {
      quizDate = res;
      quizDateUrl = "quiz/" + res;
    });
    // redirect if all quizzes finished
    if (quizDate === "Invalid date") {
      this.props.history.push("/quiz-archive");
    }
    // redirect if new quiz available

    this.props.renderNextQuiz(quizDate);
  };

  render() {
    return (
      <>
        {this.state.disabled ? (
          <Button variant="contained" disabled={true}>
            No More Quizzes Available
          </Button>
        ) : (
          <Button
            variant="contained"
            id={this.state.disabled ? "keep-playing disabled" : "keep-playing"}
            onClick={this.handleClick}
            disabled={this.state.disabled}
          >
            {this.props.text !== undefined ? this.props.text : "Keep Playing"}
          </Button>
        )}
      </>
    );
  }
}
//defined the context, which contains all the quizzes
NextAvailableQuizButton.contextType = QuizContext;

export default NextAvailableQuizButton;
