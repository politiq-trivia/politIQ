import React, { PureComponent } from 'react';
import loadingGif from '../../loadingGif.gif';
import { Helmet } from 'react-helmet';
import AuthUserContext from '../Auth/AuthUserContext';


import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import ContestAQuestion from './ContestAQuestion';

import { db } from '../../firebase';

import Question from './Question';
import FinishQuiz from './FinishQuiz';

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
      wrong: null,
      correctAnswer: '',
      completed: 0,
      finished: false,
      firstRender: true,
      contestQuestion: false,
      stopRendering: false,
      uid: ""
    }
  }

  componentDidMount = () => {
    const url = window.location.href;
    const date = url.split('/')[4];

    if(localStorage.hasOwnProperty('authUser')) {
      const userInfo = JSON.parse(localStorage.authUser)
      const uid = userInfo.uid
      this.setState({uid})
    }

    if (localStorage.hasOwnProperty('state')) {
      const newState = JSON.parse(localStorage.state) 
      console.log(newState, 'this is newState')
      this.setState(newState);
      this.renderQ(0, newState.uid)
      return;
    } else {
      this.setState({
        selectedQuizId: date,
        contestQuestion: false,
      })
      this.getQuiz(date)
      this.timer = window.setTimeout(() => {
        this.progressBar = window.setInterval(() => {
          this.progress(60)
        }, 500)
      }, 500)
    }
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

    if (this.state.selectedQuiz[qNum]) {
      this.setState({
        currentQ: qNum,
        playing: true,
        selectedValue: "",
        wrong: null,
        correctAnswer: '',
        completed: 0,
        contestQuestion: false,
      })
      this.timer = window.setTimeout(() => {
        this.handleSubmit()
      }, 60000)
      this.progressBar = window.setInterval(() => {
        this.progress(60)
      }, 500)
    } else {     
        this.setState({
          currentQ: qNum,
          playing: true,
          selectedValue: "",
          wrong: null,
          correctAnswer: '',
          finished: true,
        })   
        this.submitScore(this.state.score, this.state.uid)   
    }
  }

  toggleContest = () => {
    this.setState({
      contestQuestion: !this.state.contestQuestion,
    })
    this.renderQ()
  }

  closeContest = () => {
    this.setState({
      contestQuestion: false,
    })
    this.nextQ()
  }

  renderQ = (qNum, uid) => {
    if (qNum > 0 && this.state.selectedQuiz[qNum] && this.state.contestQuestion === false) {
      return (
        <Question 
          questionObj={this.state.selectedQuiz[qNum]} 
          qNum={qNum} 
          handleSubmit={this.handleSubmit} 
          selectedValue={this.state.selectedValue} 
          nextQ={this.nextQ} 
          correctAnswer={this.state.correctAnswer} 
          wrong={this.state.wrong}
          quizID={this.state.selectedQuizId}
          state={this.state}
        />
      )
    } else if (this.state.finished === true && this.state.contestQuestion === true) {
      return (
        <ContestAQuestion 
          quiz={this.state.selectedQuiz} 
          quizID={this.state.selectedQuizId} 
          uid={uid} 
          back={this.toggleContest}
          atEndOfQuiz={true}
        />
      )
    }
  }

  checkCorrect = (value) => {
    // if the user has not selected a value and the quiz is finished, return 
    if (value === undefined && this.state.finished) {
      return;
    } else {
      // stop the timers
      window.clearTimeout(this.timer)
      window.clearInterval(this.progressBar)
      const selected = value;
      const question = this.state.questionsArray[this.state.currentQ - 1];
      const str = "a" + selected + "correct"
      const isCorrect = question[str]
      let correctAnswer;
      // loop through the question to find the correct answer 
      for (let i = 1; i <= 3; i++) {
        const str2 = "a" + i + "correct"
        // capture the correct answer in a scoped variable
        if (question[str2]) {
          const correct = "a" + i + "text"
          correctAnswer = question[correct];
        }
      }
      // if the answer is correct, add a point and then render the next question after a slight delay
      if (isCorrect) {
        const score = this.state.score + 1;
        this.setState({
          score: score,
          wrong: false,
          correctAnswer,
        })
        // this.timer = window.setTimeout(() => {
        //   this.nextQ();
        // }, 1000)
      // otherwise, if the user answers wrong or doesn't answer
      } else if (isCorrect === false || isCorrect === undefined) {

        // toggle the answer show (in theory)
        this.setState({
          wrong: true,
          correctAnswer: correctAnswer,
          completed: 0,
        })
      }
    }
  }

  handleChange = (event) => {
    this.setState({ selectedValue: event.target.value });
  }

  handleSubmit = (event) => {
    if (event !== undefined && (event.target.tagName === "DIV" || event.target.tagName === "LABEL" || event.target.tagName === "INPUT")) {
      const value = event.target.id
      this.setState({ selectedValue: value });
      this.checkCorrect(value)
    } else if (event !== undefined && (event.target.tagName === "SPAN")) {
      const value = event.target.parentNode.id;
      this.setState({ selectedValue: value });
      this.checkCorrect(value)
    } else {
      this.checkCorrect()
    }
  }

  submitScore = (score, uid) => {
    const scoreObj = {
      date: this.state.selectedQuizId,
      score,
    }
    if (uid === "") {
      this.props.storeScore(scoreObj)
    } else {
      db.setScore(uid, this.state.selectedQuizId, score)
    }
  }

  // progress method controls the timer bar at the bottom of the page
  progress = (num) => {
    // not sure if this line is necessary
    if (this.state.stopRendering) {return;}
    // is it completed
    let { completed } = this.state;
    if (completed === 100) {
      this.setState({ completed: 0 });
      this.checkCorrect()
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
    if (this.state.currentQ === 1 && this.state.firstRender === true) {
      this.timer = window.setTimeout(() => {
        this.handleSubmit()
      }, 60000)
      this.cancelTimeout()
    }

    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <Paper className="quiz-body">
            <Helmet>
              <title>Play | politIQ</title>
            </Helmet>

            { this.state.questionsArray.length === 0 
              ? <img src={loadingGif} alt="loading gif" className="quiz-loading-gif"/>
              : <div style={{ height: '100%'}}>
                  <div className="quiz-header">
                    <h3>{this.state.selectedQuiz["quiz-title"]} ({this.state.selectedQuizId})</h3>
                    {this.state.currentQ <= this.state.quizLength ? <h5>Question {this.state.currentQ} of {this.state.quizLength}</h5> : null }
                  </div>
                  

                  {this.state.finished 
                    ? <FinishQuiz 
                        uid={ authUser ? authUser.uid : ""} 
                        score={this.state.score} 
                        quizLength={this.state.quizLength}
                        toggleContest={this.toggleContest}
                      />
                    : <div>
                        {authUser 
                          ? this.renderQ(this.state.currentQ, authUser.uid)
                          : this.renderQ(this.state.currentQ, "")
                        }
                      </div>
                  }
                  {this.state.contestQuestion && authUser
                    ? <ContestAQuestion 
                        quiz={this.state.selectedQuiz} 
                        quizID={this.state.selectedQuizId} 
                        uid={authUser.uid} 
                        back={this.toggleContest}
                        currentQ={this.state.finished ? null : this.state.currentQ}
                        atEndOfQuiz={this.state.finished}
                        toggleContest={this.closeContest}
                        state={this.state}
                      />
                    : null
                  }
                </div>
            }
            
            <LinearProgress className="progressBar-mobile"variant="determinate" value={this.state.completed} />
            {this.state.finished
              ? null
              : <div>
                  {this.state.wrong ? null : <LinearProgress className="progressBar-full"variant="determinate" value={this.state.completed} /> }
                </div>
            }
          </Paper>
        }
      </AuthUserContext.Consumer>
    )
  }
}

export default Quiz;
