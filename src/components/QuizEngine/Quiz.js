import React, { PureComponent } from 'react';
import loadingGif from '../../loadingGif.gif';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AuthUserContext from '../Auth/AuthUserContext';


import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import LinearProgress from '@material-ui/core/LinearProgress';
import ContestAQuestion from './ContestAQuestion';

import { db } from '../../firebase';
import * as routes from '../../constants/routes';

import './quiz.css';


class Quiz extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      questionsArray: [],
      selectedQuizId: "",
      selectedQuiz: {},
      playing: false,
      currentQ: 1,
      selectedValue: '',
      score: 0,
      wrong: false,
      correctAnswer: '',
      completed: 0,
      finished: false,
      firstRender: true,
      contestQuestion: false,
    }
  }



  componentDidMount = () => {
    const url = window.location.href;
    const date = url.split('/')[4];
    this.setState({
      selectedQuizId: date
    })
    this.getQuiz(date)
    this.timer = window.setTimeout(() => {
      this.progressBar = window.setInterval(() => {
        this.progress(30)
      }, 500)
    }, 3000)
  }

  componentWillUnmount = () => {
    window.clearTimeout(this.timer)
    window.clearInterval(this.progressBar)
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
    clearTimeout(this.timer)
    clearInterval(this.progressBar)
    const qNum = this.state.currentQ + 1;
    this.setState({
      currentQ: qNum,
      playing: true,
      selectedValue: "",
      wrong: false,
      correctAnswer: '',
    })
    if (this.state.selectedQuiz[qNum]) {
      this.setState({
        completed: 0,
      })
      this.timer = window.setTimeout(() => {
        this.handleSubmit()
      }, 30000)
      this.progressBar = window.setInterval(() => {
        this.progress(30)
      }, 500)
    }
  }

  toggleContest = () => {
    this.setState({
      contestQuestion: !this.state.contestQuestion,
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
        <FormControl className="question" style={{ marginBottom: '5vh'}}>
          <h1>{qNum}. {qtext}</h1>
          <RadioGroup aria-label={qtext}>
            <FormControlLabel value={a1text} control={
              <Radio
                onChange={this.handleSubmit}
                checked={this.state.selectedValue === "1"}
                value="1"
                aria-label="1"
              />
            } label={a1text}/>
            <FormControlLabel value={a2text} control={
              <Radio
                onChange={this.handleSubmit}
                checked={this.state.selectedValue === "2"}
                value="2"
                aria-label="2"
              />
            } label={a2text}/>
            <FormControlLabel value={a3text} control={
              <Radio
                onChange={this.handleSubmit}
                checked={this.state.selectedValue === "3"}
                value="3"
                aria-label="3"
              />
            } label={a3text}/>
            <FormControlLabel value={a4text} control={
              <Radio
                onChange={this.handleSubmit}
                checked={this.state.selectedValue === "4"}
                value="4"
                aria-label="4"
              />
            } label={a4text}/>
          </RadioGroup>
          <div>
          {this.state.wrong
            ? <div style={{ marginTop: '3vh'}}>
                <Button variant="contained" color="primary" onClick={this.nextQ}>Continue</Button>
                <p>INCORRECT - The correct answer was <span style={{ color: 'green' }}>{this.state.correctAnswer}</span>.</p>
              </div>
            : null
          }
          </div>

        </FormControl>
      )
    } else if (this.state.finished === true && this.state.contestQuestion === true) {
      return (
        <ContestAQuestion quiz={this.state.selectedQuiz} quizID={this.state.selectedQuizId} uid={uid} back={this.toggleContest}/>
      )
    } else if (!this.state.selectedQuiz[qNum]) {
      this.setState({
        finished: true,
      })
      return (
        <div>
          {this.finishQuiz(uid)}
        </div>
      )
    }

  }

  checkCorrect = (value) => {
    window.clearTimeout(this.timer)
    window.clearInterval(this.progressBar)
    const selected = value;
    const question = this.state.questionsArray[this.state.currentQ - 1];
    const str = "a" + selected + "correct"
    const isCorrect = question[str]
    let correctAnswer;
    if (isCorrect) {
      const score = this.state.score + 1;
      this.setState({
        score: score,
      })
      this.timer = window.setTimeout(() => {
        this.nextQ();
      }, 1000)
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
        completed: 0,
      })
      this.timer = window.setTimeout(() => {
        this.nextQ()
      }, 15000)
      this.progressBar = window.setInterval(() => {
        this.progress(15)
      }, 500)
    }
  }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value });
  }

  handleSubmit = (event) => {
    if (event !== undefined) {
      const value = event.target.value
      this.setState({ selectedValue: value });
      this.checkCorrect(value)
    } else {
      this.checkCorrect()
    }
  }

  finishQuiz = (uid) => {
    this.submitScore(this.state.score, uid)
    return (
      <div className="finish-quiz">
        <div style={{ marginTop: '2vh'}}>Your score: {this.state.score} out of {this.state.quizLength} points.</div>
        <Link to={routes.QUIZ_ARCHIVE} style={{textDecoration: "none"}}><Button color="primary" variant="contained">Take Another Quiz</Button></Link>
        <Button color="primary" variant="contained" onClick={this.toggleContest}>Contest a Question</Button>
        <Link to={routes.LEADERBOARD} style={{textDecoration: "none"}}><Button color="primary" variant="contained">View Leaderboard</Button></Link>
        <Link to={routes.HOME} style={{textDecoration: "none"}}><Button color="primary" variant="contained">Back to Dashboard</Button></Link>
      </div>
    )
  }

  submitScore = (score, uid) => {
    db.setScore(uid, this.state.selectedQuizId, score)
  }

  progress = (num) => {
    let { completed } = this.state;
    if (completed === 100) {
      this.setState({ completed: 0 });
    } else if (completed === 0) {
      completed += (100/num)
    } else {
      completed = completed + ((100 / num) / 2)
    }
    this.setState({ completed: completed });
  };

  cancelTimeout = () => {
    if (this.state.firstRender === true) {
      this.setState({
        firstRender: false,
      })
    }
  }

  render() {
    const isLoading = (authUser) => {
      if (this.state.questionsArray.length === 0) {
        return (
          <img src={loadingGif} alt="loading gif" className="quiz-loading-gif"/>
        )
      } else {
        const userID = authUser.uid
        if (this.state.currentQ === 1 && this.state.firstRender === true) {
          this.timer = window.setTimeout(() => {
            this.handleSubmit()
          }, 30000)
          this.cancelTimeout()
        }
        return (
          <div style={{ height: '100%'}}>
            <div className="quiz-header">
              <h3>{this.state.selectedQuiz["quiz-title"]} ({this.state.selectedQuizId})</h3>
              {this.state.currentQ <= this.state.quizLength ? <h5>Question {this.state.currentQ} of {this.state.quizLength}</h5> : null }
            </div>
            {this.renderQ(this.state.currentQ, userID)}
          </div>
        )
      }
    }
    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <Paper className="quiz-body">
            <Helmet>
              <title>Play | politIQ</title>
            </Helmet>
            {isLoading(authUser)}
            <LinearProgress className="progressBar-mobile"variant="determinate" value={this.state.completed} />
            {this.state.finished
              ? null
              : <LinearProgress className="progressBar-full"variant="determinate" value={this.state.completed} />
            }
          </Paper>
        }
      </AuthUserContext.Consumer>
    )
  }
}

export default Quiz;
