import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { db } from '../../firebase';

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
  showErrorModal: false,
};

class AddQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.getQBankQs();
  }

  getQBankQs = () => {
    db.getQBank()
      .then((response) => {
        if (response.val() === null) {
          this.setState({
            qBankEmpty: true,
          });
        }
      });
  }

  setToNow = () => {
    const date = moment().format('YYYY-MM-DDTHH:mm');
    this.setState({
      date,
    });
  }

  incrementCounter = () => {
    let counter = this.state.questionCounter;
    counter += 1;
    this.setState({
      questionCounter: counter,
    });
  }

  toggleQuestionBank = () => {
    this.setState({
      addingQuestion: true,
      selectingMethod: false,
      fromQBank: true,
    });
  }

  toggleNewQ = () => {
    this.setState({
      addingQuestion: true,
      selectingMethod: false,
      fromQBank: false,
    });
  }

  goBack = () => {
    this.setState({
      addingQuestion: true,
      selectingMethod: true,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const counter = this.state.questionCounter + 1;
    db.addQuiz(this.state.date, this.state.quizTitle);
    if (this.state.qBankEmpty) {
      this.setState({
        addingQuestion: true,
        selectingMethod: false,
        questionCounter: counter,
      });
    } else {
      this.setState({
        addingQuestion: true,
        questionCounter: counter,
        selectingMethod: true,
      });
    }
  }

  addToRss = (date, title) => {
    // once a quiz is created and has questions in it, post the name and the date of the
    // quiz to the rss feed
    db.addToRSS(date, title);
  }

  render() {
    return (
      <div>
          <Paper className="quizEngine">
              { this.state.addingQuestion
                ? <div> {this.state.selectingMethod
                  ? <div>
                      <h1 id="newQ">Add Question</h1>
                      <div className="selectMethodHolder">
                        <Button onClick={this.toggleQuestionBank} color="primary" variant="contained" style={{ fontSize: '2.5vh' }}>From Question Bank</Button>
                        <Button onClick={this.toggleNewQ} color="primary" variant="contained" style={{ fontSize: '2.5vh' }}>Create New Question</Button>
                      </div>
                    </div>
                  : <div> {this.state.fromQBank
                    ? <QuestionBankSelect
                      toggleAddQuiz={this.props.toggleAddQuiz}
                      counter={this.state.questionCounter}
                      incrementCounter={this.incrementCounter}
                      quizId={this.state.date}
                      goBack={this.goBack}
                      addToRss={this.addToRss}
                      title={this.state.quizTitle}
                    />
                    : <QuestionForm
                        quizId={this.state.date}
                        counter={this.state.questionCounter}
                        incrementCounter={this.incrementCounter}
                        toggleAddQuiz={this.props.toggleAddQuiz}
                        goBack={this.goBack}
                        addToRss={this.addToRss}
                        title={this.state.quizTitle}
                      />
                  }</div>
                } </div>
                : <div>
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
                      type="datetime-local"
                      value={`${this.state.date}`}
                      onChange={event => this.setState(byPropKey('date', event.target.value))}
                    />
                    <Button onClick={this.setToNow} variant="contained" color="primary">Set To Now</Button>
                    <div className="quizButtonHolder">
                      <Button onClick={this.props.toggleAddQuiz} variant="contained">Go Back</Button>
                      <Button disabled={this.state.date === '' || this.state.quizTitle === ''} type="submit" variant="contained">Create & Add Questions</Button>
                    </div>
                  </form>
                </div>
              }
            </Paper>
      </div>
    );
  }
}

AddQuiz.propTypes = {
  toggleAddQuiz: PropTypes.func.isRequired,
};

export default AddQuiz;
