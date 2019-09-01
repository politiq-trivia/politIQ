import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Checkbox } from '@material-ui/core';

class EditQBankQs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      question: {
        a1correct: false,
        a1text: '',
        a2correct: false,
        a2text: '',
        a3correct: false,
        a3text: '',
        q1: '',
      },
    };
  }

  componentDidMount() {
    const { question } = this.props;
    this.setState({ question });
  }

  handleChange = (event) => {
    const { question } = this.state;
    question[event.target.id] = event.target.value;
    this.setState({ question });
  }

  handleCheck = (event) => {
    const { question } = this.state;
    question[event.target.id] = !question[event.target.id];
    this.setState({ question });
  }

  render() {
    const q = this.state.question;

    return (
      /* eslint-disable dot-notation */
      <div>
        <RadioGroup inputref={null}>
          <h3 style={{ marginBottom: '1vh' }}>Question:</h3>
          <TextField
            margin="normal"
            value={q['q1']}
            fullWidth
            multiline
            onChange={this.handleChange}
            type="text"
            placeholder={q['q1']}
            id="q1"
            name="q1"
            inputref={null}
          />
          <h3 style={{ fontSize: '2vh' }}>Answer Choices:</h3>
          <TextField
            margin="normal"
            value={q['a1text']}
            fullWidth
            multiline
            onChange={this.handleChange}
            type="text"
            placeholder={q['a1text']}
            id="a1text"
            name="a1text"
            inputref={null}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={q['a1correct']}
                onChange={this.handleCheck}
                color="primary"
                id="a1correct"
                style={{ paddingLeft: '0' }}
              />
            }
            label="Correct Answer"
            style={{ marginLeft: '0' }}
          />
          <TextField
            margin="normal"
            value={q['a2text']}
            fullWidth
            multiline
            onChange={this.handleChange}
            type="text"
            placeholder={q['a2text']}
            id="a2text"
            name="a2text"
            inputref={null}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={q['a2correct']}
                onChange={this.handleCheck}
                color="primary"
                id="a2correct"
                style={{ paddingLeft: '0' }}
              />
            }
            label="Correct Answer"
            style={{ marginLeft: '0' }}
          />
          <TextField
            margin="normal"
            value={q['a3text']}
            fullWidth
            multiline
            onChange={this.handleChange}
            type="text"
            placeholder={q['a3text']}
            id="a3text"
            name="a3text"
            inputref={null}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={q['a3correct']}
                onChange={this.handleCheck}
                color="primary"
                id="a3correct"
                style={{ paddingLeft: '0' }}
              />
            }
            label="Correct Answer"
            style={{ marginLeft: '0' }}
          />
          <TextField
            margin="normal"
            value={q['answerExplanation']}
            fullWidth
            multiline
            onChange={this.handleChange}
            type="text"
            placeholder="Answer Explanation"
            id="answerExplanation"
            name="answerExplanation"
            inputref={null}
          />
        </RadioGroup>
        <div className="quizButtonHolder">
          <Button variant="contained" color="primary" onClick={this.props.handleQuit}>Exit Without Saving</Button>
          <Button variant="contained" color="primary" onClick={() => this.props.handleSubmit(this.state.question)}>Save & Add New Question</Button>
          <Button variant="contained" color="primary" onClick={() => this.props.handleReturn(this.state.question)}>Save & Complete Quiz</Button>
        </div>
      </div>
    );
  }
}

EditQBankQs.propTypes = {
  question: PropTypes.object.isRequired,
  handleQuit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleReturn: PropTypes.func.isRequired,
};

export default EditQBankQs;
