// this component should have the ability to add and delete questions as well as just editing them.

import React, { Component } from 'react';

import { db } from '../../firebase';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import './quizEngine.css';

class EditQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {},
      quizLength: 0,
      quizQs: [],
    }
  }

  componentDidMount = () => {
    const quiz = this.props.quiz;
    const quizQs = Object.keys(quiz);
    quizQs.pop();
    const quizLength = quizQs.length;
    this.setState({
      quizLength,
      quizQs,
      quiz,
    })
  }

  handleChange = (event) => {
    const quiz = this.state.quiz;
    const id = event.target.id.split(' ')
    quiz[id[0]][id[1]] = event.target.value;
    this.setState({
      quiz: quiz,
    })
  }

  handleCheck = (event) => {
    const quiz = this.state.quiz
    const id = event.target.id.split(' ')
    quiz[id[0]][id[1]] = event.target.checked
    this.setState({
      quiz: quiz
    })
  }

  handleSubmit = () => {
    db.editQuiz(this.props.quizId, this.state.quiz)
    this.props.toggleQuizShow()
  }

  render() {
    let quizArray = []
    if (this.state.quiz) {
      const quiz = this.state.quiz
      const result = Object.keys(quiz).map(function(key) {
        return [key, quiz[key]]
      });
      result.pop();
      quizArray = [...result]
    }

    const renderQs = quizArray.map((q, i) => {
      return (
        <FormControl key={i} id={q[0]} style={{ display: 'block'}}>
            <h3 style={{ marginBottom: '1vh'}}> {q[0]}. Question:   </h3>
            <TextField
              margin="normal"
              value={q[1]["q1"]}
              fullWidth
              onChange={this.handleChange}
              type="text"
              placeholder={q[1]["q1"]}
              id={q[0] + " q1"}
            />
            <h5 style={{ fontSize: '2vh'}}>Answer Choices:</h5>
            <TextField
              margin="normal"
              fullWidth
              value={q[1]["a1text"]}
              onChange={this.handleChange}
              type="text"
              placeholder={q[1]["a1text"]}
              id={q[0] + " a1text"}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={q[1]["a1correct"]}
                  onChange={this.handleCheck}
                  color="primary"
                  id={q[0] + " a1correct"}
                />
              }
              label="Correct Answer"
              labelPlacement="start"
              style={{ marginLeft: '0'}}
            />
            <TextField
              margin="normal"
              fullWidth
              value={q[1]["a2text"]}
              onChange={this.handleChange}
              type="text"
              placeholder={q[1]["a2text"]}
              id={q[0] + " a2text"}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={q[1]["a2correct"]}
                  onChange={this.handleCheck}
                  color="primary"
                  id={q[0] + " a2correct"}
                />
              }
              label="Correct Answer"
              labelPlacement="start"
              style={{ marginLeft: '0'}}
            />
            <TextField
              margin="normal"
              fullWidth
              value={q[1]["a3text"]}
              onChange={this.handleChange}
              type="text"
              placeholder={q[1]["a3text"]}
              id={q[0] + " a3text"}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={q[1]["a3correct"]}
                  onChange={this.handleCheck}
                  color="primary"
                  id={q[0] + " a3correct"}
                />
              }
              label="Correct Answer"
              labelPlacement="start"
              style={{ marginLeft: '0'}}
            />
            <TextField
              margin="normal"
              fullWidth
              value={q[1]["a4text"]}
              onChange={this.handleChange}
              type="text"
              placeholder={q[1]["a4text"]}
              id={q[0] + " a4text"}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={q[1]["a4correct"]}
                  onChange={this.handleCheck}
                  color="primary"
                  id={q[0] + " a4correct"}
                />
              }
              label="Correct Answer"
              labelPlacement="start"
              style={{ marginLeft: '0'}}
            />
        </FormControl>
      )
    })
    return (
      <Paper className="showQuiz">
        <div>
          <Button onClick={this.props.toggleQuizShow} variant="contained" color="primary" style={{ float: 'left'}}>Cancel</Button>
          <Button onClick={this.props.handleDelete} variant="contained" color="primary" style={{ float: 'right'}}>Delete this Quiz</Button>
        </div>
        {this.state.quiz? <h1>{this.state.quiz['quiz-title']}</h1> : null }
        {renderQs}
        <Button variant="contained" color="primary" style={{ float: 'center'}} onClick={this.handleSubmit}>Save Changes</Button>
      </Paper>
    )
  }
}

export default EditQuiz;
