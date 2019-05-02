import React, { PureComponent } from 'react';
import loadingGif from '../../loadingGif.gif';
import { Helmet } from 'react-helmet';
import AuthUserContext from '../Auth/AuthUserContext';
import MediaQuery from 'react-responsive';
// import { Prompt } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import ContestAQuestion from './ContestAQuestion';

import { db } from '../../firebase';

import Question from './Question';
import FinishQuiz from './FinishQuiz';
import ReactCountdownClock from 'react-countdown-clock';

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
      finished: true,
      firstRender: true,
      contestQuestion: false,
      stopRendering: false,
      uid: "",
      clicked: false,
    }
    this.myRef=React.createRef();
  }



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
  }

  componentWillUnmount = () => {
    window.clearTimeout(this.timer)
    // maybe should also store the score so the user can't take the quiz again ? 
  }

  getUser = () => {
    if(localStorage.hasOwnProperty('authUser')) {
      const userInfo = JSON.parse(localStorage.authUser)
      const uid = userInfo.uid
      const email = userInfo.email
      this.setState({uid, email})
    }
  }

  getQuiz = async(date) => {
    await db.getQuiz(date)
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
    console.log('check correct called', value)
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
        const score = this.state.score + 1;
        this.setState({
          score: score,
          wrong: false,
          correctAnswer,
          clicked: true,
        })
      // otherwise, if the user answers wrong or doesn't answer
      } else if (isCorrect === false || isCorrect === undefined) {

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
      console.log('handle submit else called')
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

  render() {
    const quizHeader = this.state.selectedQuizId.slice(0, 10);
    return (
      <AuthUserContext.Consumer>
        {authUser =>
          <Paper className="quiz-body">
            <Helmet>
              <title>Play | politIQ</title>
            </Helmet>

            {/* <Prompt 
              message={`Are you sure you want to leave? Your score will be saved as ${this.state.score} and you will not be able to retake this quiz.`}
            /> */}

            { this.state.questionsArray.length === 0 
              ? <img src={loadingGif} alt="loading gif" className="quiz-loading-gif"/>
              : <div style={{ height: '100%'}}>
                  <div className="quiz-header">
                    <h3>{this.state.selectedQuiz["quiz-title"]} ({quizHeader})</h3>
                    {this.state.currentQ <= this.state.quizLength ? 
                      <>
                        <MediaQuery minWidth={416}>
                          <h5>Question {this.state.currentQ} of {this.state.quizLength}</h5> 
                        </MediaQuery>
                        <MediaQuery maxWidth={415}>
                          <h5>{this.state.currentQ} of {this.state.quizLength}</h5>
                        </MediaQuery>
                      </>
                      : null }
                  </div>
                  <MediaQuery minWidth={416}>
                    <div style={{ float: 'right' }} className={this.state.clicked ? 'dontShowClock' : 'showClock'}>
                      <ReactCountdownClock key={this.state.currentQ} seconds={40} size={50} color="#a54ee8" alpha={0.9} onComplete={this.state.selectedValue === '' ? () => this.checkCorrect() : null}/>
                    </div>
                  </MediaQuery>



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
                </div>

            }
          </Paper>
        }
      </AuthUserContext.Consumer>
    )
  }
}

export default Quiz;
