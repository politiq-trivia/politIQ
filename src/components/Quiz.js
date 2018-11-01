// this component will:
// 1. grab the date id from the url
// 2. render a screen that first says are you ready to play today's quiz? or nah, idk
// 3. grab that quiz from the db
// 4. save all the questions in state
// 5. display the questions on the screen one at a time
// 6. store the user's answers in state
// 7. want to show them right away if they got the question right or wrong?

import React, { Component } from 'react';
import loadingGif from '../loadingGif.gif';
import { Link } from 'react-router-dom';

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
        })
      })
  }

  nextQ = () => {
    const qNum = this.state.currentQ + 1;
    this.setState({
      currentQ: qNum,
      playing: true,
    })
  }

  renderQ = (qNum) => {
    if (qNum > 0 && this.state.selectedQuiz[qNum]) {
      console.log(qNum, 'this qnum')
      const questionObj = this.state.selectedQuiz[qNum]
      console.log(questionObj, 'this is question')
      let qtext = questionObj["q1"]
      let a1text = questionObj["a1text"];
      let a2text = questionObj["a2text"];
      let a3text = questionObj["a3text"];
      let a4text = questionObj["a4text"];
      return (
        <FormControl className="question">
          <h1>{qNum}. {qtext}</h1>
          <RadioGroup aria-label={qtext}>
            <FormControlLabel value={a1text} control={<Radio/>} label={a1text}/>
            <FormControlLabel value={a2text} control={<Radio/>} label={a2text}/>
            <FormControlLabel value={a3text} control={<Radio/>} label={a3text}/>
            <FormControlLabel value={a4text} control={<Radio/>} label={a4text}/>
          </RadioGroup>

          <Button variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
        </FormControl>
      )
    } else if (!this.state.selectedQuiz[qNum]) {
      return (
        <div>
          {this.finishQuiz()}
        </div>
      )

    }
  }

  handleSubmit = () => {
    this.nextQ()
  }

  finishQuiz = () => {
    return (
      <div>
        <div>Heres your score: SCORE</div>
        <Link to={routes.QUIZ_ARCHIVE} style={{textDecoration: "none"}}><Button color="primary" variant="contained">Take Another Quiz</Button></Link>
        <Link to={routes.LEADERBOARD} style={{textDecoration: "none"}}><Button color="primary" variant="contained">View Leaderboard</Button></Link>
        <Link to={routes.HOME} style={{textDecoration: "none"}}><Button color="primary" variant="contained">Back to Dashboard</Button></Link>
      </div>
    )
  }

  render() {
    console.log(this.state , 'state')
    const isLoading = () => {
      if (this.state.questionsArray.length === 0) {
        return (
          <img src={loadingGif} alt="loading gif"/>
        )
      } else {
        return (
          <div>
          {this.state.playing
            ? <div>
                {this.renderQ(this.state.currentQ)}
              </div>
            : <div>
                <h1>let's play</h1>
                <Button onClick={this.nextQ} variant="contained" color="primary">Begin</Button>
              </div>
          }
          </div>
        )
      }
    }
    return (
      <Paper className="quiz-body">
        {isLoading()}
      </Paper>
    )
  }
}

export default Quiz;
