import React, { Component } from 'react';

import { db } from '../../firebase';


import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './quizEngine.css';
import QuestionForm from './QuestionForm';


const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  date: '',
  quizTitle: '',
  addingQuestion: true,
  questionCounter: 0,
  // questionCounter: 0,
  // q1: {
  //   qtext: "",
  //   a1: {
  //       text: "",
  //       isCorrect: "",
  //   },
  //   a2: {
  //     text: "",
  //     a2isCorrect: "",
  //   },
  //   a3: {
  //     text: "",
  //     a3isCorrect: "",
  //   },
  //   a4: {
  //     text: "",
  //     a4isCorrect: "",
  //   },
  // },
  // questionsToDisplay: [],
};

class AddQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }
  }

  addQuestion = () => {
    // let qCounter = this.state.questionCounter; // grab the qCounter from state and store it
    // qCounter++;                                // increment the local qCounter so I'm not manipulating state directly
    // const objSelect = "q" + qCounter;          // objects in state are defined by a q + number so I make that here
    // const selectedObj = this.state[objSelect]
    // this.setState({
    //   questionCounter: qCounter,               // update the qCounter
    //   questionsToDisplay: [...this.state.questionsToDisplay,selectedObj],
    // })
    // console.log(this.state, 'this is state in the add question method')

  }

  // renderQuestionForms = (event) => {
  //   if (this.state.questionsToDisplay != []) {
  //     this.state.questionsToDisplay.map((q, i) => {
  //       console.log(q, 'this is q')
  //       let qId = `q${i}`
  //       return (
  //         <div key={i}>
  //           <TextField
  //             margin="normal"
  //             fullWidth
  //             value={q.qtext}
  //             type="text"
  //           />
  //         </div>
  //       )
  //     })
  //   }
  // }
  // does .map help with capturing text from fields?

  // SITUATION: I can't capture the text because every time something is typed,
  // the page is re-rendered because setState is called.
  // the renderQuestionForms function is called in the render function.
  // maybe it should go somewhere else? like didComponentUpdate or some shit.


  // renderQuestionForms = (event) => {
  //   // loop through the questionsToDisplay array.
  //   for (let i = 0; i <= this.state.questionCounter; i++) {
  //     const q = this.state.questionsToDisplay[i];
  //     console.log(q, 'this is q')
  //     if (q) {
  //       let qNum = "Question " + (i + 1);
  //       return (
  //         <div className="questionDiv">
  //           <TextField
  //             margin="normal"
  //             fullWidth
  //             value={q.qtext}
  //             onChange={event => this.setState(byPropKey(q.qtext, event.target.value))}
  //             type="text"
  //             placeholder={qNum}
  //           />
  //
  //           <TextField
  //             margin="normal"
  //             fullWidth
  //             value={q.a1.text}
  //             onChange={event => this.setState(byPropKey(q.a1.text, event.target.value))}
  //             type="text"
  //             placeholder="Answer 1"
  //           />
  //           <FormControlLabel
  //             control={
  //               <Checkbox
  //                 checked={q.a1.isCorrect}
  //                 onChange={this.handleCheck(q.a1.isCorrect)}
  //                 color="primary"
  //               />
  //             }
  //             label="Correct Answer"
  //           />
  //           <TextField
  //             margin="normal"
  //             fullWidth
  //             value={q.a2.text}
  //             onChange={event => this.setState(byPropKey(this.state.questionsToDisplay[i].a2.text, event.target.value))}
  //             type="text"
  //             placeholder="Answer 2"
  //           />
  //           <FormControlLabel
  //             control={
  //               <Checkbox
  //                 checked={this.state.questionsToDisplay[i].a2.isCorrect}
  //                 onChange={this.handleCheck(this.state.questionsToDisplay[i].a2.isCorrect)}
  //                 color="primary"
  //               />
  //             }
  //             label="Correct Answer"
  //           />
  //           <TextField
  //             margin="normal"
  //             fullWidth
  //             value={q.a3.text}
  //             onChange={event => this.setState(byPropKey(this.state.questionsToDisplay[i].a3.text, event.target.value))}
  //             type="text"
  //             placeholder="Answer 3"
  //           />
  //           <FormControlLabel
  //             control={
  //               <Checkbox
  //                 checked={this.state.questionsToDisplay[i].a3.isCorrect}
  //                 onChange={this.handleCheck(this.state.questionsToDisplay[i].a3.isCorrect)}
  //                 color="primary"
  //               />
  //             }
  //             label="Correct Answer"
  //           />
  //           <TextField
  //             margin="normal"
  //             fullWidth
  //             value={q.a4.text}
  //             onChange={event => this.setState(byPropKey(this.state.questionsToDisplay[i].a4.text, event.target.value))}
  //             type="text"
  //             placeholder="Answer 4"
  //           />
  //           <FormControlLabel
  //             control={
  //               <Checkbox
  //                 checked={this.state.questionsToDisplay[i].a4.isCorrect}
  //                 onChange={this.handleCheck(this.state.questionsToDisplay[i].a4.isCorrect)}
  //                 color="primary"
  //               />
  //             }
  //             label="Correct Answer"
  //           />
  //         </div>
  //       )
  //     }
  //   }
  // }


  handleCheck = (name) => (event) => {
    this.setState({
      [name]: event.target.checked
    });
  };

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

    // console.log('this is state in the render function', this.state)
    // // this.renderQuestionForms()
    // let questions;
    //
    //   if (this.state.questionsToDisplay != []) {
    //     questions = this.state.questionsToDisplay.map((q, i) => {
    //       console.log(q, 'this is q')
    //       let qId = `q${i}`
    //       return (
    //         <div key={i}>
    //           <TextField
    //             margin="normal"
    //             fullWidth
    //             value={q.qtext}
    //             type="text"
    //             onChange={event => this.setState({...this.state.questionsToDisplay[i], qtext: event.target.value})}
    //           />
    //         </div>
    //       )
    //     })
    //   }




    return (
      <Paper className="quizEngine">
        { this.state.addingQuestion ?
          <QuestionForm quizId={this.state.date} counter={this.state.questionCounter}/>
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
              {/* {questions} */}
              {/* // {this.renderQuestionForms()} */}
              <Button type="submit">Create & Add Questions</Button>
            </form>
          </div>
        }
      </Paper>

    )
  }

}

export default AddQuiz;
