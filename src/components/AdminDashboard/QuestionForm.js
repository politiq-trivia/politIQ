import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import { db } from '../../firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class QuestionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qtext: "",
      a1text: "",
      a1correct: false,
      a2text: "",
      a2correct: false,
      a3text: "",
      a3correct: false,
      answerExplanation: "",
      counter: 0,
      atLeastOneChecked: false,
      timerDuration: 40,
      atLeastOneSaved: false,
    }
  }

  componentDidMount = () => {
    this.setState({
      counter: this.props.counter,
    })
  }

  componentWillUnmount() {
    // remove the quiz if the user has not saved any questions.
    // empty quizzes cause bugs later on in the game.
    if (this.state.atLeastOneSaved === false) {
      db.deleteQuiz(this.props.quizId)
    }
  }

  handleCheck = (event) => {
    const newState = {
      a1correct: this.state.a1correct,
      a2correct: this.state.a2correct,
      a3correct: this.state.a3correct,
      a4correct: this.state.a4correct,
    }

    const id = event.target.id + "correct"
    newState[id] = event.target.checked

    if (newState.a1correct === true || newState.a2correct === true || newState.a3correct === true || newState.a4correct === true) {
      this.setState({
        atLeastOneChecked: true,
        [id]: event.target.checked
      })
    } else {
      this.setState({
        atLeastOneChecked: false,
        [id]: event.target.checked
      })
    }
  }

  handleDurationChange = input => {
    this.setState({
      timerDuration: input
    })
  }

  saveData = () => {
    // when I click submit, I want to take all the information from state
    // PLUS the quiz id from props and make a firebase db write with that info.
    db.addQuestion(
      this.props.quizId,
      this.state.counter,
      this.state.qtext,
      this.state.a1text,
      this.state.a1correct,
      this.state.a2text,
      this.state.a2correct,
      this.state.a3text,
      this.state.a3correct,
      this.state.answerExplanation,
      this.state.timerDuration,
    )

    this.setState({
      atLeastOneSaved: true,
    })
  }

  // submits the data to the firebase db, resets the form so that the user can
  // add another question
  handleSubmit = async () => {
    await this.saveData()
    let counter = this.state.counter + 1;
    this.setState({
      counter: counter,
      qtext: "",
      a1text: "",
      a2text: "",
      a3text: "",
      a1correct: false,
      a2correct: false,
      a3correct: false,
      answerExplanation: "",
      timerDuration: 40,
      atLeastOneSaved: true,
    })
  }

  // submits the data to the firebase db and then returns the user to the admin dashboard
  handleReturn = async () => {
    await this.saveData();
    // this.setState()
    // const newUnixDate = parseInt((new Date(this.props.quizId).getTime() / 1000).toFixed(0) + '000')
    // if (newUnixDate < Date.now()) {
    //   this.sendNotification()
    // } else {
    //   this.sendDelayedNotification(newUnixDate)
    // }
    this.props.toggleAddQuiz()

    // save to RSS
    this.props.addToRss(this.props.quizId, this.props.title)
  }

  handleQuit = () => {
    // if the user hasn't saved any quizzes
    this.props.toggleAddQuiz()
  }

  // sendNotification = () => {
  //   global.registration.showNotification('New! New! New!', {
  //     body: "Take the latest quiz now!",
  //     icon: '../logo.png',
  //     vibrate: [100, 50, 100],
  //     data: {
  //       primaryKey: this.props.quizId
  //     },
  //   })
  // }

  // sendDelayedNotification = (date) => {
  //   const quizId = this.props.quizId
  //   schedule.scheduleJob(date, () => {
  //     global.registration.showNotification('New quiz!', {
  //       body: 'Take the latest politIQ quiz now!',
  //       icon: '../logo.png',
  //       vibrate: [100, 50, 100],
  //       data: {
  //         primaryKey: quizId,
  //         dateOfArrival: date
  //       }
  //     })
  //   })
  // }

  render() {
    const qNum = "Question " + this.state.counter;
    return (
      <div>
        <Button onClick={this.props.goBack} color="primary" variant="contained" style={{ float: 'left'}}>Back</Button>
        <h2 style={{ textAlign: 'center'}}>New Question</h2>
        <form onSubmit={this.handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            value={this.state.qtext}
            onChange={event => this.setState(byPropKey('qtext', event.target.value))}
            type="text"
            placeholder={qNum}
          />
          <h3>Answer Choices</h3>
          <TextField
            margin="normal"
            fullWidth
            value={this.state.a1text}
            onChange={event => this.setState(byPropKey('a1text', event.target.value))}
            type="text"
            placeholder="Answer 1"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.a1correct}
                onChange={this.handleCheck}
                color="primary"
                id="a1"
              />
            }
            label="Correct Answer"
            labelPlacement="start"
            style={{ marginLeft: '0'}}
          />
          <TextField
            margin="normal"
            fullWidth
            value={this.state.a2text}
            onChange={event => this.setState(byPropKey('a2text', event.target.value))}
            type="text"
            placeholder="Answer 2"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.a2correct}
                onChange={this.handleCheck}
                color="primary"
                id="a2"
              />
            }
            label="Correct Answer"
            labelPlacement="start"
            style={{ marginLeft: '0'}}
          />
          <TextField
            margin="normal"
            fullWidth
            value={this.state.a3text}
            onChange={event => this.setState(byPropKey('a3text', event.target.value))}
            type="text"
            placeholder="Answer 3"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.a3correct}
                onChange={this.handleCheck}
                color="primary"
                id="a3"
              />
            }
            label="Correct Answer"
            labelPlacement="start"
            style={{ marginLeft: '0'}}
          />
          <TextField 
            margin="normal"
            fullWidth
            multiline 
            value={this.state.answerExplanation}
            onChange={event => this.setState(byPropKey('answerExplanation', event.target.value))}
            type="text"
            placeholder="Correct Answer Explanation"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="timer-duration">Timer Duration (seconds)</InputLabel>
            <Select
              native
              autoWidth={true}
              value={this.state.timerDuration}
              onChange={event => this.handleDurationChange(event.target.value)}
              inputProps={{
                name: 'timerDuration',
                id: 'timer-duration'
              }}
            >
              <option value="30">30</option> 
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
              
            </Select>
          </FormControl>
          <div className="quizButtonHolder">
            <Button color="primary" variant="contained" onClick={this.handleQuit}>
              Exit Without Saving
            </Button>
            <Button onClick={this.handleSubmit} color="primary" variant="contained" disabled={ this.state.atLeastOneChecked === true && this.state.qtext !== "" && this.state.a1text !== "" ? false : true }>
              Save & Add New Question
            </Button>
            <Button color="primary" variant="contained" onClick={this.handleReturn} disabled={ this.state.atLeastOneChecked === true && this.state.qtext !== "" && this.state.a1text !== "" ? false : true }>
              Save & Complete Quiz
            </Button>

          </div>
        </form>
      </div>
    )
  }
}

export default QuestionForm;
