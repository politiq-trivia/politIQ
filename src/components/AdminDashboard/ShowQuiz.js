import React, { Component } from 'react';
import { db } from '../../firebase';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';
import Close from '@material-ui/icons/Close';

import './quizEngine.css';

class ShowQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizLength: 0,
      quizQs: [],
      quiz: {},
    }
  }
  componentDidMount = () => {
    const quiz = this.props.quiz;
    const quizQs = Object.keys(quiz);
    quizQs.pop()
    const quizLength = quizQs.length;
    this.setState({
      quizLength,
      quizQs,
      quiz
    })
  }

  handleDeleteQuestion = (event) => {
    const id = event.target.parentNode.id;
    console.log(id, 'this is id')
    const date = this.props.quizId;
    const quiz = this.state.quiz;

    console.log(quiz[id] , 'this is quiz[id]')
    delete quiz[id]
    console.log(quiz, 'this is quiz')
    if (id) {
      db.deleteQuestion(date, id)
    }
    this.setState({
      quiz: quiz,
    })
  }

  render() {
    let quizArray = []
    if (this.state.quiz) {
      const quiz = this.state.quiz;
      const result = Object.keys(quiz).map(function(key) {
        return [key, quiz[key]]
      });
      result.pop();
      quizArray = [...result]
    }

    const renderQs = quizArray.map((q, i) => {
      const currentquestion = q[1]["q1"]
      console.log(q[0], 'this is q[0]')
      return (
        <FormControl key={i} id={q[0]} style={{ display: 'block'}}>
          <FormLabel>{i+1}. {q[1]["q1"]}</FormLabel>
          <div style={{ float: 'right', color: 'gray'}}  id={q[0]} onClick={this.handleDeleteQuestion}>
            Remove Question
            <Close
              aria-label="close"
              color="inherit"
              style={{
                height: '2vh'
              }}
            />
          </div>
          <RadioGroup
            aria-label={q[1]["q1"]}
          >
            <div style={{ display: 'flex'}}>
              <FormControlLabel value={q[1]["a1text"]} control={<Radio />} label={q[1]["a1text"]}/>
              {q[1]["a1correct"] ? <p style={{ color: 'green' }}>Correct Answer</p> : null}
            </div>
            <div style={{ display: 'flex'}}>
              <FormControlLabel value={q[1]["a2text"]} control={<Radio />} label={q[1]["a2text"]}/>
              {q[1]["a2correct"] ? <p style={{ color: 'green' }}>Correct Answer</p> : null}
            </div>
            <div style={{ display: 'flex'}}>
              <FormControlLabel value={q[1]["a3text"]} control={<Radio />} label={q[1]["a3text"]}/>
              {q[1]["a3correct"] ? <p style={{ color: 'green' }}>Correct Answer</p> : null}
            </div>
            <div style={{ display: 'flex'}}>
              <FormControlLabel value={q[1]["a4text"]} control={<Radio />} label={q[1]["a4text"]}/>
              {q[1]["a4correct"] ? <p style={{ color: 'green' }}>Correct Answer</p> : null}
            </div>
          </RadioGroup>
        </FormControl>
      )
    })




    return (
      <Paper className="showQuiz">
        <Button onClick={this.props.toggleDashboard} variant="contained" color="primary">
            Back
        </Button>
        <Button variant="contained" color="primary" style={{ float: 'right'}}>
            Edit Quiz
        </Button>
        {this.state.quiz ? <h1>{this.state.quiz['quiz-title']}</h1> : null}
        {renderQs}
      </Paper>
    )
  }
}

export default ShowQuiz;
