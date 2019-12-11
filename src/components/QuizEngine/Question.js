import React, { Component } from "react";
import MediaQuery from "react-responsive";
import ReactCountdownClock from "react-countdown-clock";

import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Paper from "@material-ui/core/Paper";

import "./quiz.css";
// import countdownUrl from './sounds/countdown.flac';

class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgColor: "",
      clicked: false
    };
  }

  // countdown = new Audio(countdownUrl)

  componentDidMount = () => {
    // this.playCountdown()
  };

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.qNum !== this.props.qNum ||
      nextProps.selectedValue !== this.props.selectedValue ||
      nextProps.wrong !== this.props.wrong ||
      nextProps.volumeUp !== this.props.volumeUp
    ) {
      return true;
    } else {
      return false;
    }
  }

  componentDidUpdate() {
    // I believe it moves down to myRef when there is an answer chosen,
    // meaning that it moves back up to the top then where is a new question.
    // this is in theory when the countdown should restart?
    if (this.props.myRef.current !== null) {
      window.clearTimeout();
      // this.countdown.src = null;

      window.scrollTo({
        left: 0,
        top: this.props.myRef.current.offsetTop,
        behavior: "smooth"
      });
    } else {
      // this.countdown.src = "/static/media/countdown.f63efcde.flac";
      // this.playCountdown();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  }

  componentWillUnmount = () => {
    // this.countdown.src = null;
    // window.clearTimeout(this.countdownInterval)
  };

  openNewTab = () => {
    const newState = this.props.state;
    newState.contestQuestion = true;
    const newStateJson = JSON.stringify(newState);
    localStorage.setItem("state", newStateJson);
    const url = "quiz/" + this.props.quizID;
    window.open(`/${url}`);
  };

  // playCountdown = () => {
  //     // take the timer duration
  //     const { questionObj } = this.props;
  //     let timerDuration;
  //     if (questionObj["timerDuration"] === null || questionObj["timerDuration"] === undefined) {
  //         timerDuration = 40
  //     } else {
  //         timerDuration = questionObj["timerDuration"]
  //     }
  //     const tenLess = (timerDuration - 10) * 1000;

  //     this.countdownInterval = setTimeout(() => {
  //         if (this.countdown.src.includes("/static/media/countdown.f63efcde.flac") && this.props.volumeUp === true) {
  //             this.countdown.play()
  //         }
  //     }, tenLess)
  // }

  scrollToMyRef = () => window.scrollTo(0, this.props.myRef.offsetTop);

  render() {
    const {
      questionObj,
      qNum,
      handleSubmit,
      selectedValue,
      nextQ,
      correctAnswer,
      wrong,
      clicked
    } = this.props;
    let qtext = questionObj["q1"];
    let a1text = questionObj["a1text"];
    let a2text = questionObj["a2text"];
    let a3text = questionObj["a3text"];
    let answerExplanation = questionObj["answerExplanation"];
    let timerDuration;
    if (
      questionObj["timerDuration"] === null ||
      questionObj["timerDuration"] === undefined
    ) {
      timerDuration = 40;
    } else {
      timerDuration = questionObj["timerDuration"];
    }

    const backgroundColor = num => {
      if (selectedValue === "") return;
      if (selectedValue === num && wrong === false) {
        return "#B6E1BE";
      } else if (selectedValue === num && wrong === true) {
        return "#E1B6B6";
      }
    };

    return (
      <>
        <div style={{ display: "flex" }}>
          <h1>
            {qNum}. {qtext}
          </h1>
        </div>

        <FormControl className="question" style={{ marginBottom: "5vh" }}>
          <RadioGroup aria-label={qtext}>
            <Paper
              style={{ backgroundColor: backgroundColor("1") }}
              id="1"
              onClick={wrong === null ? handleSubmit : null}
              className="answer"
              inputref={this.props.inputref}
            >
              <FormControlLabel
                value={a1text}
                id="1"
                control={
                  <Radio
                    checked={selectedValue === "1"}
                    value="1"
                    aria-label="1"
                    id="1"
                    disabled={wrong !== null}
                  />
                }
                label={a1text}
              />
            </Paper>

            <Paper
              style={{
                marginTop: "2vh",
                backgroundColor: backgroundColor("2")
              }}
              id="2"
              onClick={wrong === null ? handleSubmit : null}
              className="answer"
            >
              <FormControlLabel
                value={a2text}
                id="2"
                control={
                  <Radio
                    checked={selectedValue === "2"}
                    value="2"
                    id="2"
                    aria-label="2"
                    disabled={wrong !== null}
                  />
                }
                label={a2text}
              />
            </Paper>
            <Paper
              style={{
                marginTop: "2vh",
                backgroundColor: backgroundColor("3")
              }}
              id="3"
              onClick={wrong === null ? handleSubmit : null}
              className="answer"
            >
              <FormControlLabel
                value={a3text}
                id="3"
                control={
                  <Radio
                    checked={selectedValue === "3"}
                    value="3"
                    id="3"
                    aria-label="3"
                    disabled={wrong !== null}
                  />
                }
                label={a3text}
              />
            </Paper>
          </RadioGroup>
          <div>
            {wrong === true ? (
              <div
                style={{ marginTop: "3vh" }}
                id="explanation"
                ref={this.props.myRef}
              >
                <h3
                  style={{
                    color: "red",
                    display: "inline",
                    marginRight: "1vw"
                  }}
                >
                  INCORRECT
                </h3>
                <p style={{ display: "inline" }}>
                  The correct answer was{" "}
                  <span style={{ color: "green" }}>{correctAnswer}</span>.
                </p>
                <p>{answerExplanation}</p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={nextQ}
                  style={{ display: "block", marginBottom: "2vh" }}
                >
                  Continue
                </Button>
                <Button variant="contained" onClick={this.props.toggleContest}>
                  Contest This Question
                </Button>
              </div>
            ) : null}
            {wrong === false ? (
              <div
                style={{ marginTop: "3vh" }}
                id="explanation"
                ref={this.props.myRef}
              >
                <h3 style={{ color: "green" }}>CORRECT</h3>
                <p>{answerExplanation}</p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={nextQ}
                  style={{ display: "block", marginBottom: "2vh" }}
                >
                  Continue
                </Button>
              </div>
            ) : null}
          </div>


        </FormControl>
      </>
    );
  }
}

export default Question;
