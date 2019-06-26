import React, { Component } from 'react';
import loadingGif from '../../loadingGif.gif';
import { Helmet } from 'react-helmet';
import AuthUserContext from '../Auth/AuthUserContext';
import MediaQuery from 'react-responsive';
import { Prompt } from 'react-router-dom';
import ReactCountdownClock from 'react-countdown-clock';

import Paper from '@material-ui/core/Paper';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeOff from '@material-ui/icons/VolumeOff';

import { db } from '../../firebase';
import { trackEvent } from '../../utils/googleAnalytics';

import Question from './Question';
import FinishQuiz from './FinishQuiz';
import ContestAQuestion from './ContestAQuestion'; 

import './quiz.css';
import errorUrl from './sounds/error.wav';
import wrongUrl from './sounds/wrong.wav';
import correctUrl from './sounds/correct.wav';

class Quiz extends Component {
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
      finished: true,
      firstRender: true,
      contestQuestion: false,
      stopRendering: false,
      uid: "",
      clicked: false,
      volumeUp: true,
    }
    this.myRef=React.createRef();
  }

  error = new Audio(errorUrl)
  correct = new Audio(correctUrl)
  // wrong = new Audio(wrongUrl)

  componentDidMount = () => {
    const url = window.location.href;
    const date = url.split('/')[4];

    this.getUser();

    // I think this was for checking if the user is contesting the question
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
    }

    trackEvent('Quizzes', 'Quiz loaded', 'QUIZ_LOADED')
  }

  // if the user changed their game settings and then went back to take the quiz, check to make sure the settings are right
  // shouldComponentUpdate = (nextProps, nextState) => {
  //   const volumeUp = JSON.parse(localStorage.getItem('authUser')).soundsOn
  //   if (volumeUp !== this.state.volumeUp) {
  //     return true;
  //   } else return false;
  // }

  componentWillUnmount = () => {
    window.clearTimeout(this.timer)
    window.clearTimeout(this.sadTrombone)
    // maybe should also store the score so the user can't take the quiz again ? 
    if (this.state.finished === false) {
      trackEvent('Quizzes', 'Quiz forfeited', 'QUIZ_FORFEIT')
      this.submitScore(this.state.score, this.state.uid)
    }
  }

  getUser = () => {
    if(localStorage.hasOwnProperty('authUser')) {
      const userInfo = JSON.parse(localStorage.authUser)
      const uid = userInfo.uid
      const email = userInfo.email
      if (userInfo.hasOwnProperty('soundsOn')) {
        if (userInfo.soundsOn === false) {
          this.setState({
            uid,
            email,
            volumeUp: false
          })
        } 
      } else {
        this.setState({
          uid, 
          email,
          volumeUp: true,
        })
      }
    }
  }

  getQuiz = async(date) => {
    await db.getQuiz(date)
      .then(response => {
        if (response.val() === null || response.val() === undefined) {
          console.error('no quiz')
          return;
        }
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
          selectedQuizId: date,
          completed: 0,
          finished: false,
          clicked: false,
          currentQ: 1,
          score: 0,
        })
      })
  }

  getNextQuiz = (date) => {
    this.getQuiz(date);
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
        clicked: false,
      })
      this.submitScore(this.state.score, this.state.uid)
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
    window.scrollTo(0,0);
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
          currentQ={this.state.currentQ}
          checkCorrect={this.checkCorrect}
          clicked={this.state.clicked}
          myRef={this.myRef}
          volumeUp={this.state.volumeUp}
        />
      )
    } else if (this.state.finished === true && this.state.contestQuestion === true) {
      return (
        <ContestAQuestion 
          quiz={this.state.selectedQuiz} 
          quizID={this.state.selectedQuizId} 
          uid={uid} 
          email={this.state.email}
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
      // window.clearInterval(this.progressBar)
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
        this.correct.volume = 0.5
        if (this.state.volumeUp === true) {
          this.correct.play()
        }
        const score = this.state.score + 1;
        this.setState({
          score: score,
          wrong: false,
          correctAnswer,
          clicked: true,
        })
      // otherwise, if the user answers wrong or doesn't answer
      } else if (isCorrect === false || isCorrect === undefined) {
        // if (window.navigator.vibrate) {
        //   window.navigator.vibrate([200, 50, 200, 50, 200])
        // }
        // play the buzzer sound if the user gets the answer wrong
        if (isCorrect === false) {
          this.error.volume = 0.5
          if (this.state.volumeUp === true) {
            this.error.play()
          }
        } else if (isCorrect === undefined) {
          // play the sad trombone sound if the user runs out of time
          this.error.volume = 0.5
          if (this.state.volumeUp === true) {
            // add one more second after when the timer ends and when the trombone plays
            this.error.play()
            // this.sadTrombone = setTimeout(() => {
              this.error.onended = function() {
                let wrong = new Audio(wrongUrl)
                wrong.play()
              }
            // }, 1000)
          }
        }

        // toggle the answer show (in theory)
        this.setState({
          wrong: true,
          correctAnswer: correctAnswer,
          completed: 0,
          clicked: true,
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

  toggleVolume = () => {
    this.setState({
      volumeUp: !this.state.volumeUp
    })

    // set the local storage 
    const userInfo = JSON.parse(localStorage.getItem('authUser'))
    userInfo.soundsOn = !this.state.volumeUp
    localStorage.setItem('authUser', JSON.stringify(userInfo))

    // also change the database?
    db.soundSettings(this.state.uid, !this.state.volumeUp)
  }

  render() {
    const quizHeader = this.state.selectedQuizId.slice(0, 10);

    // for variable question durations
    let timerDuration;
    if (this.state.selectedQuiz[this.state.currentQ] !== undefined) {
      const question = this.state.selectedQuiz[this.state.currentQ]
      if (question.timerDuration === null || question.timerDuration === undefined) {
        timerDuration = 40
      } else {
        const duration = this.state.selectedQuiz[this.state.currentQ]["timerDuration"]
        timerDuration = duration
      }
    } 

    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <Paper className="quiz-body">
            <Helmet>
              <title>Play | politIQ trivia</title>
            </Helmet>

            <Prompt 
              when={this.state.selectedQuiz !== {} && this.state.finished === false}
              message={`Are you sure you want to leave? Your score will be saved as ${this.state.score} and you will not be able to retake this quiz.`}
            />

            { this.state.questionsArray.length === 0 
              ? <img src={loadingGif} alt="loading gif" className="quiz-loading-gif"/>
              : <div style={{ height: '100%'}}>
                  <div className="quiz-header">
                    <h3>{this.state.selectedQuiz["quiz-title"]} ({quizHeader})</h3>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {this.state.currentQ <= this.state.quizLength ? 
                          <>
                            <MediaQuery minWidth={416}>
                              <h5 style={{ marginBottom: '8px'}}>Question {this.state.currentQ} of {this.state.quizLength}</h5> 
                            </MediaQuery>
                            <MediaQuery maxWidth={415}>
                              <h5 style={{ marginBottom: '3px' }}>{this.state.currentQ} of {this.state.quizLength}</h5>
                            </MediaQuery>
                          </>
                        : null }
                        {this.state.finished 
                          ? null 
                          : <>
                              {this.state.volumeUp === true ?  <VolumeUp onClick={this.toggleVolume} id="volume"/> : <VolumeOff color="primary" onClick={this.toggleVolume} id="volume"/>}
                            </>
                        }
                      </div>
                  </div>
                  <MediaQuery minWidth={416}>
                    <div style={{ float: 'right' }} className={this.state.clicked ? 'dontShowClock' : 'showClock'}>
                      <ReactCountdownClock key={this.state.currentQ} seconds={timerDuration} size={50} color="#a54ee8" alpha={0.9} onComplete={this.state.selectedValue === '' ? () => this.checkCorrect() : null}/>
                    </div>
                  </MediaQuery>

                  {this.state.contestQuestion && authUser
                    ? <ContestAQuestion 
                        quiz={this.state.selectedQuiz} 
                        quizID={this.state.selectedQuizId} 
                        uid={authUser.uid} 
                        email={this.state.email}
                        back={this.toggleContest}
                        currentQ={this.state.finished ? null : this.state.currentQ}
                        atEndOfQuiz={this.state.finished}
                        toggleContest={this.closeContest}
                        state={this.state}
                      />
                    : null
                  }

                  {this.state.finished 
                    ? <FinishQuiz 
                        uid={ authUser ? authUser.uid : ""} 
                        score={this.state.score} 
                        quizLength={this.state.quizLength}
                        toggleContest={this.toggleContest}
                        getNextQuiz={this.getNextQuiz}
                      />
                    : <div>
                        {authUser 
                          ? this.renderQ(this.state.currentQ, authUser.uid)
                          : this.renderQ(this.state.currentQ, "")
                        }
                      </div>
                  }

                </div>

            }
          </Paper>
        }
      </AuthUserContext.Consumer>
    )
  }
}

export default Quiz;
