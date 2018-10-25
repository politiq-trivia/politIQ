import React, { Component } from 'react';

import { db } from '../../firebase';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import './quizEngine.css';
import QuestionForm from './QuestionForm';


const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  date: '',
  quizTitle: '',
  addingQuestion: false,
  questionCounter: 0,
};

class AddQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    let counter = this.state.questionCounter + 1;
    db.addQuiz(this.state.date, this.state.quizTitle)
    this.setState({
      addingQuestion: true,
      questionCounter: counter,
    })
  }


  render() {
    return (
      <Paper className="quizEngine">
        { this.state.addingQuestion ?
          <QuestionForm quizId={this.state.date} counter={this.state.questionCounter} toggleAddQuiz={this.props.toggleAddQuiz}/>
        :
          <div>
            <h1>Create New Quiz</h1>
            <form onSubmit={this.handleSubmit}>
              <TextField
                margin="normal"
                fullWidth
                value={this.state.quizTitle}
                onChange={event => this.setState(byPropKey('quizTitle', event.target.value))}
                type="text"
                placeholder="Quiz Title"
              />
              <TextField
                id="date"
                margin="normal"
                fullWidth
                type="date"
                onChange={event => this.setState(byPropKey('date', event.target.value))}
              />
              <div className="quizButtonHolder">
                <Button onClick={this.props.toggleAddQuiz} variant="contained">Go Back</Button>
                <Button disabled={this.state.date === "" || this.state.quizTitle === "" ? true : false} type="submit" variant="contained">Create & Add Questions</Button>
              </div>
            </form>
          </div>
        }
      </Paper>

    )
  }

}

export default AddQuiz;
