import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';

import { db } from '../../firebase';

import { HOME } from '../../constants/routes'

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormHelperText from '@material-ui/core/FormHelperText';
import './form.css';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class QuestionSubmitForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: '',
      qtext: '',
      a1text: '',
      a1correct: false,
      a2text: '',
      a2correct: false,
      a3text: '',
      a3correct: false,
      a4text: '',
      a4correct: false,
      source: '',
      done: false,
      tooltipOpen: false,
      atLeastOneChecked: false,
    }
  }

  componentDidMount = () => {
    this.setState({
      uid: this.props.signedInUser
    })
  }

  handleTooltipClose = () => {
    this.setState({
      tooltipOpen: false
    })
  }

  handleTooltipOpen = () => {
    this.setState({
      tooltipOpen: true
    })
  }

  handleCheck = (event) => {
    const newState = {
      a1correct: this.state.a1correct,
      a2correct: this.state.a2correct,
      a3correct: this.state.a3correct,
      a4correct: this.state.a4correct,
    }

    const id = event.target.id + "correct"
    newState[id] = event.target.checked

    if (newState.a1correct === true || newState.a2correct === true || newState.a3correct === true || newState.a4correct === true) {
      this.setState({
        atLeastOneChecked: true,
        [id]: event.target.checked
      })
    } else {
      this.setState({
        atLeastOneChecked: false,
        [id]: event.target.checked
      })
    }
  }

  handleSubmit = () => {
    const date = moment().format()
    db.submitQuestion(
      this.state.uid,
      date,
      this.state.qtext,
      this.state.a1text,
      this.state.a1correct,
      this.state.a2text,
      this.state.a2correct,
      this.state.a3text,
      this.state.a3correct,
      this.state.a4text,
      this.state.a4correct,
      this.state.source
    )
    this.setState({
      done: true,
    })
  }

  submitAnother = () => {
    this.setState({
      qtext: '',
      a1text: '',
      a1correct: false,
      a2text: '',
      a2correct: false,
      a3text: '',
      a3correct: false,
      a4text: '',
      a4correct: false,
      source: '',
      done: false,
      tooltipOpen: false,
    })
  }



  render() {
    const isDisabled = () => {
      if (
        this.state.qtext === "" ||
        this.state.a1text === "" ||
        this.state.sources === "" ||
        this.state.atLeastOneChecked === false
      ) {
        return true;
      } else {
        return false;
      }
    }

    return (
      <Paper className="pageStyle submitForm">
        <Helmet>
          <title>Submit Question</title>
        </Helmet>
        { this.state.done
          ? <div className="afterSubmit">
              <h2>Thank you for your submission.</h2>
              <Button variant="contained" color="primary" className="submittedButtons" onClick={this.submitAnother}>Submit another question</Button>
              <Link to={HOME} style={{ textDecoration: 'none' }}>
                <Button variant="contained" color="primary" className="submittedButtons">Done</Button>
              </Link>
            </div>
          : <div>
              <div className="formHeader">
                <Link to={HOME} style={{ textDecoration: 'none', marginLeft: '0'}} id="form-back">
                  <Button color="primary" variant="contained">Back</Button>
                </Link>
                <h1 style={{ marginLeft: '-3vw' }}>Submit a Question</h1>
              </div>
              <h3 style={{ marginTop: '5vh' }}>Did you find a piece of news that everyone should know about?</h3>
              <p> Add <span style={{ fontWeight: 'bold'}}>3 points</span> to your score by dropping it below. We'll review it and add it to the quiz if it's accepted. <br/><br/>Make sure to verify your information with reliable sources!"</p>
            <form>
              <TextField
                margin="normal"
                fullWidth
                value={this.state.qtext}
                onChange={event => this.setState(byPropKey('qtext', event.target.value))}
                type="text"
                placeholder="Question"
                id="standard-required"
              />
              <FormHelperText htmlFor="standard-required" style={{ color: 'red', marginBottom: '1vh' }}>Required *</FormHelperText>
              <TextField
                margin="normal"
                fullWidth
                value={this.state.a1text}
                onChange={event => this.setState(byPropKey('a1text', event.target.value))}
                type="text"
                placeholder="Answer 1"
                id="standard-required"
              />
              <FormHelperText htmlFor="standard-required" style={{ color: 'red', marginBottom: '1vh' }}>Required *</FormHelperText>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.a1correct}
                    onChange={this.handleCheck}
                    color="primary"
                    id="a1"
                  />
                }
                label="Correct Answer"
                labelPlacement="start"
                style={{ marginLeft: '0' }}
              />
              <TextField
                margin="normal"
                fullWidth
                value={this.state.a2text}
                onChange={event => this.setState(byPropKey('a2text', event.target.value))}
                type="text"
                placeholder="Answer 2"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.a2correct}
                    onChange={this.handleCheck}
                    color="primary"
                    id="a2"
                  />
                }
                label="Correct Answer"
                labelPlacement="start"
                style={{ marginLeft: '0' }}
              />
              <TextField
                margin="normal"
                fullWidth
                value={this.state.a3text}
                onChange={event => this.setState(byPropKey('a3text', event.target.value))}
                type="text"
                placeholder="Answer 3"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.a3correct}
                    onChange={this.handleCheck}
                    color="primary"
                    id="a3"
                  />
                }
                label="Correct Answer"
                labelPlacement="start"
                style={{ marginLeft: '0' }}
              />
              <TextField
                margin="normal"
                fullWidth
                value={this.state.a4text}
                onChange={event => this.setState(byPropKey('a4text', event.target.value))}
                type="text"
                placeholder="Answer 4"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.a4correct}
                    onChange={this.handleCheck}
                    color="primary"
                    id="a4"
                  />
                }
                label="Correct Answer"
                labelPlacement="start"
                style={{ marginLeft: '0' }}
              />
              <TextField
                margin="normal"
                fullWidth
                value={this.state.source}
                onChange={event => this.setState(byPropKey('source', event.target.value))}
                type="text"
                placeholder="Please provide a link to a source verifying that this information is correct."
                style={{ marginTop: '5vh'}}
                id="standard-required"
              />
              <FormHelperText htmlFor="standard-required" style={{ color: 'red', marginBottom: '1vh' }}>Required *</FormHelperText>
            </form>
            <Button onClick={this.handleSubmit} disabled={isDisabled()} color="primary" variant="contained" id="form-submit">Submit</Button>
          </div>
        }
      </Paper>
    )
  }
}

export default QuestionSubmitForm;
