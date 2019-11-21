import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { db } from "../../firebase";

import Button from "@material-ui/core/Button";
import "./quiz.css";

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
    let quizzes;
    await db.getQuizzes().then(res => {
      quizzes = res.val();
    });

    // get scores
    let uidScoreDates;

    await db.getScoresByUid(this.props.uid).then(res => {
      uidScoreDates = Object.keys(res.val());
      if (!uidScoreDates) uidScoreDates = [];
    });
    ///////// get All dates this month where user score does not exist

    //get this month quiz dates
    const quizDates = Object.keys(quizzes).filter(
      date =>
        date < moment().format("YYYY-MM-DDTHH:mm") &&
        date >
          moment()
            .startOf("month")
            .format("YYYY-MM-DDTHH:mm")
    );

    // which quiz dates this month don't have a score already?
    const availableQuizDates = quizDates.filter(
      date => !(uidScoreDates.indexOf(date) > -1)
    );

    // which is most recent
    const nextAvailableQuizDate = moment(
      new Date(
        Math.max.apply(
          null,
          availableQuizDates.map(date => new Date(date))
        )
      )
    ).format("YYYY-MM-DDTHH:mm");
    console.log(typeof nextAvailableQuizDate);
    console.log(nextAvailableQuizDate.toString());
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
    console.log("changing page with url " + quizDateUrl);

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

export default withRouter(NextAvailableQuizButton);
