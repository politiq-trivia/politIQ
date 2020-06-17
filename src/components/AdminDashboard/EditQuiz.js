// this component should have the ability to add and delete questions as well as just editing them.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import { Select } from '@material-ui/core';

import DeleteModal from './DeleteModal';
import { db } from '../../firebase';
import './quizEngine.css';


class EditQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quiz: {},
      quizLength: 0,
      quizQs: [],
    };
  }

  componentDidMount = () => {
    const { quiz } = this.props;
    if (quiz === {} || quiz === undefined || quiz === null) {
      return;
    }

    const quizQs = Object.keys(quiz);
    quizQs.pop();
    const quizLength = quizQs.length;
    this.setState({
      quizLength,
      quizQs,
      quiz,
    });
  }

  // since this component is rendered by the Admin Dashboard, we need to
  // check if the quiz updated and then update the UI accordingly
  // to prevent errors
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.quiz !== this.state.quiz || nextState !== this.state) {
      return true;
    }
    return false;
  }

  handleChange = (event) => {
    const { quiz } = this.state;
    if (event.target.id === 'quiz-title') {
      quiz['quiz-title'] = event.target.value;
      this.setState({
        quiz,
      });
    } else {
      const id = event.target.id.split(' ');
      quiz[id[0]][id[1]] = event.target.value;
      this.setState({ quiz });
    }
  }

  handleDurationChange = (event) => {
    const { quiz } = this.state;
    // this is the question number.
    // don't need any other logic here because this is only for duration
    const { id } = event.target;

    quiz[id]['timerDuration'] = event.target.value; // eslint-disable-line dot-notation

    this.setState({ quiz });
  }

  handleCheck = (event) => {
    const { quiz } = this.state;
    const id = event.target.id.split(' ');
    quiz[id[0]][id[1]] = event.target.checked;
    this.setState({ quiz });
  }

  handleSubmit = () => {
    db.editQuiz(this.props.quizId, this.state.quiz);
    this.props.toggleQuizShow();
  }

  render() {
    let quizArray = [];
    if (this.state.quiz && this.state.quiz !== {}) {
      const { quiz } = this.state;
      const result = Object.keys(quiz).map((key) => ([key, quiz[key]]));
      result.pop();
      quizArray = [...result];
    }

    /* eslint-disable dot-notation */
    const renderQs = quizArray.map((q, i) => {
      let timerDuration;
      if (q[1]['timerDuration']) {
        timerDuration = q[1]['timerDuration'];
      } else {
        timerDuration = 40;
      }
      return (
        <FormControl key={i} id={q[0]} style={{ display: 'block' }}>
          <h3 style={{ marginBottom: '1vh' }}> {q[0]}. Question:   </h3>
          <TextField
            margin="normal"
            value={q[1]['q1']}
            fullWidth
            onChange={this.handleChange}
            type="text"
            placeholder={q[1]['q1']}
            id={q[0] + ' q1'} // eslint-disable-line prefer-template
            inputref={null}
          />
          <h5 style={{ fontSize: '2vh' }}>Answer Choices:</h5>
          <TextField
            margin="normal"
            fullWidth
            value={q[1]['a1text']}
            onChange={this.handleChange}
            type="text"
            placeholder={q[1]['a1text']}
            id={q[0] + ' a1text'} // eslint-disable-line prefer-template
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={q[1]['a1correct']}
                onChange={this.handleCheck}
                color="primary"
                id={q[0] + ' a1correct'} // eslint-disable-line prefer-template
              />
            }
            label="Correct Answer"
            labelPlacement="start"
            style={{ marginLeft: '0' }}
          />
          <TextField
            margin="normal"
            fullWidth
            value={q[1]['a2text']}
            onChange={this.handleChange}
            type="text"
            placeholder={q[1]['a2text']}
            id={q[0] + ' a2text'} // eslint-disable-line prefer-template
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={q[1]['a2correct']}
                onChange={this.handleCheck}
                color="primary"
                id={q[0] + ' a2correct'} // eslint-disable-line prefer-template
              />
            }
            label="Correct Answer"
            labelPlacement="start"
            style={{ marginLeft: '0' }}
          />
          <TextField
            margin="normal"
            fullWidth
            value={q[1]['a3text']}
            onChange={this.handleChange}
            type="text"
            placeholder={q[1]['a3text']}
            id={q[0] + ' a3text'} // eslint-disable-line prefer-template
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={q[1]['a3correct']}
                onChange={this.handleCheck}
                color="primary"
                id={q[0] + ' a3correct'} // eslint-disable-line prefer-template
              />
            }
            label="Correct Answer"
            labelPlacement="start"
            style={{ marginLeft: '0' }}
          />
          <TextField
            margin="normal"
            fullWidth
            value={q[1]['answerExplanation']}
            onChange={this.handleChange}
            type="text"
            placeholder={q[1]['answerExplanation']}
            id={q[0] + ' answerExplanation'} // eslint-disable-line prefer-template
          />
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="timer-duration">Timer Duration(seconds)</InputLabel>
            <Select
              native
              authWidth={true}
              inputProps={{
                name: 'timerDuration',
                id: q[0],
              }}
              value={timerDuration}
              onChange={(event) => this.handleDurationChange(event)}
            >
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
            </Select>
          </FormControl>
          <h5 style={{ fontSize: '2vh' }}>Source:</h5>
          <TextField
            margin="normal"
            fullWidth
            value={q[1]['questionSource']}
            onChange={this.handleChange}
            type="text"
            placeholder="Url source for question"
            id={q[0] + ' questionSource'}
          />
        </FormControl>
      );
    });
    return (
      <Paper className="showQuiz">
        {this.props.showDeleteModal
          ? <DeleteModal
            fromEditQuiz="true"
            selected={[this.props.quizId]}
            deleteQuiz={this.props.deleteQuiz}
            toggleDeleteModal={this.props.toggleDeleteModal}
            toggleDashboard={this.props.toggleDashboard}
          />
          : null
        }
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5vh' }}>
          <Button
            onClick={this.props.toggleQuizShow}
            variant="contained"
            color="primary"
            style={{ float: 'left' }}
          >
            Cancel
          </Button>
          <div>
            <h1 style={{ display: 'inline' }}>Quiz Title: </h1>
            {this.state.quiz
              ? <TextField
                value={this.state.quiz['quiz-title']}
                style={{ marginTop: 'auto', marginBottom: 'auto' }}
                onChange={this.handleChange}
                margin="normal"
                type="text"
                id={'quiz-title'}
              ></TextField>
              : null
            }
          </div>
          <Button
            onClick={this.props.toggleDeleteModal}
            variant="contained"
            color="primary"
            style={{ float: 'right' }}
            className="edit-delete-quiz-button"
          >
            Delete this Quiz
          </Button>
        </div>

        {renderQs}
        <Button
          onClick={this.props.toggleDeleteModal}
          color="primary"
          style={{ float: 'right' }}
          className="edit-delete-quiz-button-mobile"
        >
          Delete this Quiz
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ float: 'center' }}
          onClick={this.handleSubmit}
        >
          Save Changes
        </Button>
      </Paper>
    );
  }
}

EditQuiz.propTypes = {
  quiz: PropTypes.object.isRequired,
  quizId: PropTypes.string.isRequired,
  toggleQuizShow: PropTypes.func.isRequired,
  showDeleteModal: PropTypes.bool.isRequired,
  deleteQuiz: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
  toggleDashboard: PropTypes.func.isRequired,
};

export default EditQuiz;
