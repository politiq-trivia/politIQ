import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    RadioGroup,
    FormControlLabel,
    Button,
    TextField,
    Checkbox,
    FormControl,
    Select,
    InputLabel
} from '@material-ui/core';

class EditQBankQs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {
                a1correct: false,
                a1text: "",
                a2correct: false,
                a2text: "",
                a3correct: false,
                a3text: "",
                q1: "",
                answerExplanation: "",
                timerDuration: 40,
            },
        }
    }

    componentDidMount () {
        const question = this.props.question;
        question.timerDuration = 40;
        this.setState({
            question,
        });
    }

  handleChange = (event) => {
    const { question } = this.state;
    question[event.target.id] = event.target.value;
    this.setState({ question });
  }

    handleCheck = (event) => {
        const question = this.state.question
        question[event.target.id] = !question[event.target.id]
        this.setState({
            question,
        });
    }

    handleDurationChange = (input) => {
        this.setState({
            question: {
                ...this.state.question,
                timerDuration: input,
            }
        });
    }

    isDisabled = () => {
        // checks if there are values for all the required question fields to prevent questions from being saved without
        // all the required information
        // should run on render
        const q = this.state.question;
        const oneSelected = () => {
            if (!q['a1corrext'] && !q['a2correct'] && !q['a3correct']) {
                return false;
            }
            return true;
        }
        if(q['q1'] === '' || q['a1text'] === '' || q['a2text'] === '' || q['a3text'] === '' || q['answerExplanation'] === '' || !oneSelected) {
            return true;
        }
        return false;
    }

  render() {
    const q = this.state.question;

        return (
            <div>
            <RadioGroup inputref={null}>
                <h3 style={{ marginBottom: '1vh'}}>Question:</h3>
                <TextField 
                    margin="normal"
                    value={q["q1"]}
                    fullWidth
                    multiline
                    onChange={this.handleChange}
                    type="text"
                    placeholder={q["q1"]}
                    id="q1"
                    name="q1"
                    inputref={null}
                />
                <h3 style={{ fontSize: '2vh' }}>Answer Choices:</h3>
                <TextField 
                    margin="normal"
                    value={q["a1text"]}
                    fullWidth
                    multiline
                    onChange={this.handleChange}
                    type="text"
                    placeholder={q["a1text"]}
                    id="a1text"
                    name="a1text"
                    inputref={null} 
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={q["a1correct"]}
                            onChange={this.handleCheck}
                            color="primary"
                            id="a1correct"
                            style={{ paddingLeft: '0'}}
                        />
                    }
                    label="Correct Answer"
                    style={{ marginLeft: '0'}}
                />
                <TextField
                    margin="normal"
                    value={q["a2text"]}
                    fullWidth
                    multiline
                    onChange={this.handleChange}
                    type="text"
                    placeholder={q["a2text"]}
                    id="a2text"
                    name="a2text"
                    inputref={null}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={q["a2correct"]}
                            onChange={this.handleCheck}
                            color="primary"
                            id="a2correct"
                            style={{ paddingLeft: '0'}}
                        />
                    }
                    label="Correct Answer"
                    style={{ marginLeft: '0'}}
                />
                <TextField  
                    margin="normal"
                    value={q["a3text"]}
                    fullWidth
                    multiline
                    onChange={this.handleChange}
                    type="text"
                    placeholder={q["a3text"]}
                    id="a3text"
                    name="a3text"
                    inputref={null}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={q["a3correct"]}
                            onChange={this.handleCheck}
                            color="primary"
                            id="a3correct"
                            style={{ paddingLeft: '0'}}
                        />
                    }
                    label="Correct Answer"
                    style={{ marginLeft: '0'}}
                />
                <TextField 
                    margin="normal"
                    value={q["answerExplanation"]}
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
            <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="timer-duration">Timer Duration (seconds)</InputLabel>
                <Select
                    native
                    autoWidth={true}
                    value={this.state.timerDuration}
                    onChange={event => this.handleDurationChange(event.target.value)}
                    inputProps={{
                        name: 'timerDuration',
                        id: 'timer-duration'
                    }}
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
            <div className="quizButtonHolder">
              <Button variant="contained" color="primary" onClick={this.props.handleQuit}>Exit Without Saving</Button>
              <Button variant="contained" color="primary" disabled={this.isDisabled()} onClick={() => this.props.handleSubmit(this.state.question)}>Save & Add New Question</Button>
              <Button variant="contained" color="primary" disabled={this.isDisabled()} onClick={() => this.props.handleReturn(this.state.question)}>Save & Complete Quiz</Button>
            </div>
          </div>
        )
    }
}

EditQBankQs.propTypes = {
  question: PropTypes.object.isRequired,
  handleQuit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleReturn: PropTypes.func.isRequired,
};

export default EditQBankQs;
