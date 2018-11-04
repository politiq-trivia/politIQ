import React, { Component } from 'react';
import loadingGif from '../loadingGif.gif';
import { Link } from 'react-router-dom';
import AuthUserContext from './AuthUserContext';


import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

import { db } from '../firebase';
import * as routes from '../constants/routes';

import './quiz.css';


class Quiz extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionsArray: [],
      selectedQuizId: "",
      selectedQuiz: {},
      playing: false,
      currentQ: 0,
      selectedValue: '',
      score: 0,
      wrong: false,
      correctAnswer: '',
    }
  }

  componentDidMount = () => {
    const url = window.location.href;
    const date = url.split('/')[4];
    this.setState({
      selectedQuizId: date
    })
    this.getQuiz(date)
  }

  getQuiz = (date) => {
    db.getQuiz(date)
      .then(response => {
        const quiz = response.val();
        const quizQs = Object.keys(quiz);
        quizQs.pop();
        const qArray = []
        for (let i = 1; i <= quizQs.length; i++) {
          qArray.push(quiz[i])
        }
        this.setState({
          selectedQuiz: quiz,
          questionsArray: qArray,
          quizLength: qArray.length,
        })
      })
  }

  nextQ = () => {
    const qNum = this.state.currentQ + 1;
    this.setState({
      currentQ: qNum,
      playing: true,
      selectedValue: "",
      wrong: false,
      correctAnswer: '',
    })
  }

  renderQ = (qNum, uid) => {
    if (qNum > 0 && this.state.selectedQuiz[qNum]) {
      const questionObj = this.state.selectedQuiz[qNum]
      let qtext = questionObj["q1"]
      let a1text = questionObj["a1text"];
      let a2text = questionObj["a2text"];
      let a3text = questionObj["a3text"];
      let a4text = questionObj["a4text"];
      return (
        <FormControl className="question">
          <h1>{qNum}. {qtext}</h1>
          <RadioGroup aria-label={qtext}>
            <FormControlLabel value={a1text} control={
              <Radio
                onChange={this.handleChange}
                checked={this.state.selectedValue === "1"}
                value="1"
                aria-label="1"
              />
            } label={a1text}/>
            <FormControlLabel value={a2text} control={
              <Radio
                onChange={this.handleChange}
                checked={this.state.selectedValue === "2"}
                value="2"
                aria-label="2"
              />
            } label={a2text}/>
            <FormControlLabel value={a3text} control={
              <Radio
                onChange={this.handleChange}
                checked={this.state.selectedValue === "3"}
                value="3"
                aria-label="3"
              />
            } label={a3text}/>
            <FormControlLabel value={a4text} control={
              <Radio
                onChange={this.handleChange}
                checked={this.state.selectedValue === "4"}
                value="4"
                aria-label="4"
              />
            } label={a4text}/>
          </RadioGroup>
          <div>
          {this.state.wrong
            ? <div>
                <Button variant="contained" color="primary" onClick={this.nextQ}>Continue</Button>
                <p>INCORRECT - The correct answer was <span style={{ color: 'green' }}>{this.state.correctAnswer}</span>.</p>
              </div>
            : <Button variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
          }
          </div>

        </FormControl>
      )
    } else if (!this.state.selectedQuiz[qNum]) {
      return (
        <div>
          {this.finishQuiz(uid)}
        </div>
      )

    }
  }

  checkCorrect = () => {
    const selected = this.state.selectedValue;
    const question = this.state.questionsArray[this.state.currentQ - 1];
    const str = "a" + selected + "correct"
    const isCorrect = question[str]
    let correctAnswer;
    if (isCorrect) {
      const score = this.state.score + 1;
      this.setState({
        score: score,
      })
      this.nextQ();
    } else {
      for (let i = 1; i <= 4; i++) {
        const str2 = "a" + i + "correct"
        if (question[str2]) {
          const correct = "a" + i + "text"
          correctAnswer = question[correct];
        }
      }
      this.setState({
        wrong: true,
        correctAnswer: correctAnswer,
      })
    }
  }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value });
  }

  handleSubmit = () => {
    this.checkCorrect()
  }

  finishQuiz = (uid) => {
    this.submitScore(this.state.score, uid)
    return (
      <div>
        <div>Your score: {this.state.score} out of {this.state.quizLength} points.</div>
        <Link to={routes.QUIZ_ARCHIVE} style={{textDecoration: "none"}}><Button color="primary" variant="contained">Take Another Quiz</Button></Link>
        <Link to={routes.LEADERBOARD} style={{textDecoration: "none"}}><Button color="primary" variant="contained">View Leaderboard</Button></Link>
        <Link to={routes.HOME} style={{textDecoration: "none"}}><Button color="primary" variant="contained">Back to Dashboard</Button></Link>
      </div>
    )
  }

  submitScore = (score, uid) => {
    db.setScore(uid, this.state.selectedQuizId, score)
  }

  render() {
    const isLoading = (authUser) => {
      console.log(authUser)
      if (this.state.questionsArray.length === 0) {
        return (
          <img src={loadingGif} alt="loading gif"/>
        )
      } else {
        const userID = authUser.uid
        return (
          <div>
          {this.state.playing
            ? <div>
                {this.renderQ(this.state.currentQ, userID)}
              </div>
            : <div>
                <h1>Are you ready?</h1>
                <Button onClick={this.nextQ} variant="contained" color="primary">Begin</Button>
              </div>
          }
          </div>
        )
      }
    }
    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <Paper className="quiz-body">
            {isLoading(authUser)}
          </Paper>
        }
      </AuthUserContext.Consumer>
    )
  }
}

export default Quiz;
