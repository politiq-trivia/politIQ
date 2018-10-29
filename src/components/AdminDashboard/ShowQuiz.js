import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';

import './quizEngine.css';

class ShowQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizLength: 0,
    }
  }
  componentDidMount = () => {
    this.renderQs()
  }
  renderQs = () => {
    const quiz = this.props.quiz;
    const quizQs = Object.keys(quiz);
    quizQs.pop()
    const quizLength = quizQs.length;
    this.setState({
      quizLength,
    })
  }

  render() {
    const quiz = this.props.quiz;
    const quizQs = Object.keys(quiz);
    const quizLength = quizQs.length - 1;

    if (quizLength !== -1) {
      quizQs.pop();
    }
    let counter = 1;
    const renderQs = quizQs.map((q, i) => {
      let qtext = quiz[counter]["q1"]
      let a1text = quiz[counter]["a1text"]
      let a2text = quiz[counter]["a2text"]
      let a3text = quiz[counter]["a3text"]
      let a4text = quiz[counter]["a4text"]
      let a1correct = quiz[counter]["a1correct"]
      let a2correct = quiz[counter]["a2correct"]
      let a3correct = quiz[counter]["a3correct"]
      let a4correct = quiz[counter]["a4correct"]
      console.log(a1correct, 'this is a1correct')
      counter++;
      return (
        <FormControl key={i} style={{ display: 'block'}}>
          <FormLabel>{i + 1}. {qtext}</FormLabel>
          <RadioGroup
            aria-label={qtext}
          >
            <div style={{ display: 'flex'}}>
              <FormControlLabel value={a1text} control={<Radio />} label={a1text}/>
              {a1correct ? <p style={{ color: 'green'}}>Correct Answer</p> : null}
            </div>
            <div style={{ display: 'flex'}}>
              <FormControlLabel value={a2text} control={<Radio />} label={a2text}/>
              {a2correct ? <p style={{ color: 'green'}}>Correct Answer</p> : null}
            </div>
            <div style={{ display: 'flex'}}>
              <FormControlLabel value={a3text} control={<Radio />} label={a3text}/>
              {a3correct ? <p style={{ color: 'green'}}>Correct Answer</p> : null}
            </div>
            <div style={{ display: 'flex'}}>
              <FormControlLabel value={a4text} control={<Radio />} label={a4text}/>
              {a4correct ? <p style={{ color: 'green'}}>Correct Answer</p> : null}
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
        <h1>{quiz['quiz-title']}</h1>
        {renderQs}
      </Paper>
    )
  }
}

export default ShowQuiz;
