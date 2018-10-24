// the user should be able to click an 'add quiz button that populates a form'
// maybe this form should be it's own component that handles its own state.
// when the component is rendered, it gets passed a prop from the parent saying which one it is
// then, when the quiz is submitted, the component makes a db call and stores itself underneath the quiz reference in firebase.
// that way, then you can add as many questions as you want.
// these need to be stateful components because they need to grab data.

// the only problem will be submitting the form as a whole.
// maybe on component dismount, it submits the data. or something like that.
// somehow the submit button will need to communicate with all the components.
// not sure if this is possible but I don't have a better idea.

// WHAT IF they are sequential. so you create the quiz. and then you create the questions until you are done.
// to do that, I'll first have the add quiz component create the quiz and store the id
// then, that add quiz component will render each of the add question forms and it will individually add questions to the quiz.
// at each point, it will have a button that gives the user the option to be done, and go back to the dashboard.

// clicking submit and add another question submits it and then clears the form.

// ----------------------------

import React, { Component } from 'react';

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
    }
  }

  handleCheck = (event) => {
    console.log('handle check called')
    console.log(event.target, 'this is e.target from handlecheck')
    const id = event.target.id + "correct"
    this.setState({
      [id]: event.target.checked
    })
  }

  handleSubmit = (event) => {

  }

  render() {
    console.log(this.state, 'state')
    const qNum = "Question " + this.props.counter;

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
          <Button color="primary" variant="contained">
            Exit Without Saving
          </Button>
          <Button onClick={this.handleSubmit} color="primary" variant="contained">
            Save & Add New Question
          </Button>
          <Button color="primary" variant="contained">
            Save & Complete Quiz
          </Button>

        </div>
      </form>
    )
  }
}

export default QuestionForm;
