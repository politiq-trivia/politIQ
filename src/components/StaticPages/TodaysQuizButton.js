import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import getMostRecentQuizId from "../../utils/mostRecentQuizId";

import Button from "@material-ui/core/Button";

import { db } from "../../firebase";

import AuthUserContext from "../Auth/AuthUserContext";

class TodaysQuizButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostRecentQuizURL: "",
      noAvailableQuizzes: false
    };
  }

  componentDidMount() {
    this.getMostRecentQuizId();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // see if there have been new scores added since the last time the component was rendered
    if (nextState.mostRecentQuizURL !== this.state.mostRecentQuizURL) {
      return true;
    } else return false;
  }

  componentWillUnmount = () => {
    this.setState({
      undefined
    });
  };

  getMostRecentQuizId = async () => {
    const quizId = await getMostRecentQuizId();
    // need to get scores of the user to see if they've taken the quiz already
    // use context to do this
    let uidScoreDates;
    // we have the context of authuser available
    if (this.context) {
      console.log("context available");
      console.log(this.context);
      await db.getScoresByUid(this.context.uid).then(res => {
        if (!res.val()) {
          uidScoreDates = [];
        } else {
          uidScoreDates = Object.keys(res.val());
        }
      });

      if (quizId === "No Available Quizzes") {
        // there is no quiz returned
        this.setState({
          noAvailableQuizzes: true
        });
        if (this.props.showErrorMessage) {
          this.props.showErrorMessage();
        }
      } else if (
        uidScoreDates.filter(date => date === quizId.substring(5, 50)).length >
        0
      ) {
        // if the user has a score for that quiz already
        this.setState({ noAvailableQuizzes: true });
      } else {
        this.setState({
          mostRecentQuizURL: quizId
        });
      }
    } else {
      console.log("no context available");
      // there is no context available
      const quizId = await getMostRecentQuizId();
      if (quizId === "No Available Quizzes") {
        this.setState({
          noAvailableQuizzes: true
        });
        if (this.props.showErrorMessage) {
          this.props.showErrorMessage();
        }
      } else {
        this.setState({
          mostRecentQuizURL: quizId
        });
      }
    }
  };

  redirectToQuiz = () => {
    this.props.history.push(`/${this.state.mostRecentQuizURL}`);
  };

  render() {
    console.log(this.context);
    const { buttonText, id } = this.props;
    return (
      <Button
        color="primary"
        variant="outlined"
        size="large"
        id={id}
        disabled={
          this.state.mostRecentQuizURL === "" || this.state.noAvailableQuizzes
        }
        onClick={this.redirectToQuiz}
      >
        {buttonText}
      </Button>
    );
  }
}
TodaysQuizButton.contextType = AuthUserContext;

export default withRouter(TodaysQuizButton);
