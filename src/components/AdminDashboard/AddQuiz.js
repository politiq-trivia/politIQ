import React, { Component } from 'react';

import { db } from '../../firebase';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import './quizEngine.css';
import QuestionForm from './QuestionForm';
import QuestionBankSelect from './QuestionBankSelect';


const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  date: '', // this is the quiz ID
  quizTitle: '',
  addingQuestion: false,
  questionCounter: 0,
  fromQBank: false,
  selectingMethod: false,
  qBankEmpty: false,
};

class AddQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE }
  }

  componentDidMount = () => {
    this.getQBankQs()
  }

  incrementCounter = () => {
    let counter = this.state.questionCounter;
    counter++
    this.setState({
      questionCounter: counter,
    })
  }

  getQBankQs = () => {
    db.getQBank()
      .then(response => {
        if (response.val() !== null) {
          this.setState({
            qBank: response.val()
          })
        } else {
          this.setState({
            qBankEmpty: true,
          })
        }
      })
  }

  toggleQuestionBank = () => {
    this.setState({
      addingQuestion: true,
      selectingMethod: false,
      fromQBank: true,
    })
  }

  toggleNewQ = () => {
    this.setState({
      addingQuestion: true,
      selectingMethod: false,
      fromQBank: false,
    })
  }

  goBack = () => {
    this.setState({
      addingQuestion: true,
      selectingMethod: true,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    let counter = this.state.questionCounter + 1;
    db.addQuiz(this.state.date, this.state.quizTitle)
    if (this.state.qBankEmpty) {
      this.setState({
        addingQuestion: true,
        selectingMethod: false,
        questionCounter: counter,
      })
    } else {
      this.setState({
        addingQuestion: true,
        questionCounter: counter,
        selectingMethod: true,
      })
    }
  }

  // create option (select) to add from questionBank or create a new question
  // if the user selects add from questionBank, create a second dropdown of potential questions
  // option to add from questionbank will only show up if there are questions in the questionbank
  // when the user selects a question from the dropdown, they can preview the question to make sure it is ok
  // then, they can click add to quiz, and that question is added to that quiz and removed from the qbank.
  // ^^ same as add question form - save and add another, or save and complete quiz.
  render() {
    return (
      <Paper className="quizEngine">
        { this.state.addingQuestion
          ? <div> {this.state.selectingMethod
            ? <div>
                <h1 id="newQ">Add Question</h1>
                <div className="selectMethodHolder">
                  <Button onClick={this.toggleQuestionBank} color="primary" variant="contained" style={{ fontSize: '2.5vh'}}>From Question Bank</Button>
                  <Button onClick={this.toggleNewQ} color="primary" variant="contained" style={{ fontSize: '2.5vh'}}>Create New Question</Button>
                </div>
              </div>
            : <div> {this.state.fromQBank
                ?  <QuestionBankSelect toggleAddQuiz={this.props.toggleAddQuiz} counter={this.state.questionCounter} incrementCounter={this.incrementCounter} qBank={this.state.qBank} quizId={this.state.date} goBack={this.goBack}/>
                :  <QuestionForm quizId={this.state.date} counter={this.state.questionCounter} incrementCounter={this.incrementCounter} toggleAddQuiz={this.props.toggleAddQuiz} goBack={this.goBack}/>
            }</div>
          } </div>
        :
          <div>
            <h1 id="newQuiz">Create New Quiz</h1>
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
