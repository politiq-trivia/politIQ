import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';

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
    console.log(this.props, 'this is props')
    const quiz = this.props.quiz;
    const quizQs = Object.keys(quiz);
    quizQs.pop()
    const quizLength = quizQs.length;
    console.log(quizLength)
    this.setState({
      quizLength,
    })
    console.log(quizQs.length)
  }

  render() {
    const quiz = this.props.quiz;
    const quizQs = Object.keys(quiz);
    const quizLength = quizQs.length - 1;
    console.log(quizLength, 'this is quizLength')

    if (quizLength !== -1) {
      quizQs.pop();
    }
    console.log(quiz)
    let counter = 1;
    const renderQs = quizQs.map((q, i) => {
      let qNum = "q" + i
      let qtext = quiz[counter]["q1"]
      let a1text = quiz[counter]["a1text"]
      let a2text = quiz[counter]["a2text"]
      let a3text = quiz[counter]["a3text"]
      let a4text = quiz[counter]["a4text"]
      counter++;
      return (
        <FormControl key={i} style={{ display: 'block'}}>
          <FormLabel>{qtext}</FormLabel>
          <RadioGroup
            aria-label={qtext}
          >
            <FormControlLabel value={a1text} control={<Radio />} label={a1text}/>
            <FormControlLabel value={a2text} control={<Radio />} label={a2text}/>
            <FormControlLabel value={a3text} control={<Radio />} label={a3text}/>
            <FormControlLabel value={a4text} control={<Radio />} label={a4text}/>

          </RadioGroup>
        </FormControl>
      )
    })


    return (
      <Paper style={{ padding: '2vh'}}>
        <Button onClick={this.props.toggleDashboard} variant="contained" color="primary">
            Back
        </Button>
        <h1>{quiz['quiz-title']}</h1>
        {renderQs}
      </Paper>
    )
  }
}

export default ShowQuiz;
