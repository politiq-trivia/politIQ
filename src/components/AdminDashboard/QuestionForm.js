import React, { Component } from 'react';

import { db } from '../../firebase';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

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
      a4text: "",
      a4correct: false,
      counter: 0,
    }
  }

  componentDidMount = () => {
    this.setState({
      counter: this.props.counter,
    })
  }

  handleCheck = (event) => {
    const id = event.target.id + "correct"
    this.setState({
      [id]: event.target.checked
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
      this.state.a4text,
      this.state.a4correct,
    )
  }

  // submits the data to the firebase db, resets the form so that the user can
  // add another question
  handleSubmit = () => {
    this.saveData()
    let counter = this.state.counter + 1;
    this.setState({
      counter: counter,
      qtext: "",
      a1text: "",
      a2text: "",
      a3text: "",
      a4text: "",
      a1correct: false,
      a2correct: false,
      a3correct: false,
      a4correct: false,
    })
    console.log('this is state after you submit (should be empty)', this.state)
  }

  // submits the data to the firebase db and then returns the user to the admin dashboard
  handleReturn = () => {
    this.saveData();
    this.props.toggleAddQuiz()
  }

  handleQuit = () => {
    this.props.toggleAddQuiz()
  }

  render() {
    const qNum = "Question " + this.state.counter;

    return (
      <form onSubmit={this.handleSubmit} className="quizEngine">
        <h2>New Question</h2>
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
          value={this.state.a4text}
          onChange={event => this.setState(byPropKey('a4text', event.target.value))}
          type="text"
          placeholder="Answer 4"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.a4correct}
              onChange={this.handleCheck}
              color="primary"
              id="a4"
            />
          }
          label="Correct Answer"
          labelPlacement="start"
          style={{ marginLeft: '0'}}
        />
        <div className="quizButtonHolder">
          <Button color="primary" variant="contained" onClick={this.handleQuit}>
            Exit Without Saving
          </Button>
          <Button onClick={this.handleSubmit} color="primary" variant="contained">
            Save & Add New Question
          </Button>
          <Button color="primary" variant="contained" onClick={this.handleReturn}>
            Save & Complete Quiz
          </Button>

        </div>
      </form>
    )
  }
}

export default QuestionForm;
