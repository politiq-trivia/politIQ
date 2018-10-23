import React, { Component } from 'react';

import { db } from '../firebase';


import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  date: '',
  quizTitle: '',
};

class AddQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }
  }

  handleSubmit = () => {
    db.addQuiz(this.state.quizTitle)
  }
  render() {
    return (
      <Paper>
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
          <Button type="submit">Create New Quiz</Button>
        </form>
      </Paper>
    )
  }

}

export default AddQuiz;
