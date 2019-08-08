import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import FormLabel from '@material-ui/core/FormLabel';
import Close from '@material-ui/icons/Close';

import { db } from '../../firebase';

import './quizEngine.css';

class ShowQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizLength: 0,
      quizQs: [],
      quiz: {},
    };
  }

  componentDidMount = () => {
    const { quiz } = this.props;
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
  shouldComponentUpdate(nextProps) {
    if (nextProps.quiz !== this.state.quiz) {
      return true;
    }
    return false;
  }

  handleDeleteQuestion = (event) => {
    const { id } = event.target.parentNode;
    const date = this.props.quizId;
    const { quiz } = this.state;

    delete quiz[id];
    if (id) {
      db.deleteQuestion(date, id);
    }
    this.setState({ quiz });
  }

  render() {
    let quizArray = [];
    if (this.state.quiz) {
      const { quiz } = this.state;
      const result = Object.keys(quiz).map(key => ([key, quiz[key]]));
      result.pop();
      quizArray = [...result];
    }

    const renderQs = quizArray.map((q, i) => { // eslint-disable-line arrow-body-style
      return (
        /* eslint-disable dot-notation */
        <FormControl className="showQuestion" key={i} id={q[0]} style={{ display: 'block' }}>
          <FormLabel>{i + 1}. {q[1]['q1']}</FormLabel>
            <div className="delete-x" id={q[0]} onClick={this.handleDeleteQuestion} role="button" tabIndex={0} onKeyDown={(e) => { if (e.keyCode === 13) { this.handleDeleteQuestion(); } } }>
              <p className="delete-text">Remove Question</p>
              <Close
                aria-label="close"
                color="inherit"
                style={{
                  height: '4vh',
                  float: 'right',
                }}
              />
            </div>

          <RadioGroup
            aria-label={q[1]['q1']}
            inputref={null}
          >
            <div className="show" style={{ display: 'flex' }} inputref={null}>
              <FormControlLabel value={q[1]['a1text']} control={<Radio
                checked={false}
                icon={<RadioButtonUncheckedIcon />}
              />} label={q[1]['a1text']}/>
              {q[1]['a1correct'] ? <p style={{ color: 'green' }}>Correct Answer</p> : null}
            </div>
            <div className="show" style={{ display: 'flex' }}>
              <FormControlLabel value={q[1]['a2text']} control={<Radio
                checked={false}
                icon={<RadioButtonUncheckedIcon />}
              />} label={q[1]['a2text']}/>
              {q[1]['a2correct'] ? <p style={{ color: 'green' }}>Correct Answer</p> : null}
            </div>
            <div className="show" style={{ display: 'flex' }}>
              <FormControlLabel value={q[1]['a3text']} control={<Radio
                checked={false}
                icon={<RadioButtonUncheckedIcon />}
              />} label={q[1]['a3text']}/>
              {q[1]['a3correct'] ? <p style={{ color: 'green' }}>Correct Answer</p> : null}
            </div>
          </RadioGroup>
          <p><span style={{ color: 'green', fontWeight: 'bold' }}>Explanation: </span>{q[1]['answerExplanation']}</p>
        </FormControl>
      );
    });

    return (
      <Paper className="showQuiz">
        <div className="showQuizButtons">
          <Button onClick={this.props.toggleDashboard} variant="contained" color="primary">
              Back
          </Button>
          <Button variant="contained" color="primary" style={{ float: 'right' }} onClick={this.props.toggleEditQuiz}>
              Edit Quiz
          </Button>
        </div>
        {this.state.quiz ? <h1>{this.state.quiz['quiz-title']}</h1> : null}
        {renderQs}
        <div className="showQuizButtons-mobile">
          <Button onClick={this.props.toggleDashboard} color="primary">
              Back
          </Button>
          <Button color="primary" style={{ float: 'right' }} onClick={this.props.toggleEditQuiz}>
              Edit Quiz
          </Button>
        </div>
      </Paper>
    );
  }
}

ShowQuiz.propTypes = {
  quiz: PropTypes.object.isRequired,
  quizId: PropTypes.string.isRequired,
  toggleDashboard: PropTypes.func.isRequired,
  toggleEditQuiz: PropTypes.func.isRequired,
};

export default ShowQuiz;
