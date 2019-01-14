import React, { Component } from 'react';

import { db } from '../../firebase';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';

class QuizBankSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedQ: "",
      qBank: {},
      counter: 0,
    }
  }

  componentDidMount = () => {
    this.getQBankQs()
    this.setState({
      counter: this.props.counter,
      // qBank: this.props.qBank
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


  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleQuit = () => {
    this.props.toggleAddQuiz()
  }

  saveData = () => {
    db.removeFromQBank(this.state.selectedQ)
    // const qId = this.state.selectedQ.substring(0,10)
    const q = this.state.qBank[this.state.selectedQ]
    db.addQuestion(
        this.props.quizId,
        this.state.counter,
        q["q1"],
        q["a1text"],
        q["a1correct"],
        q["a2text"],
        q["a2correct"],
        q["a3text"],
        q["a3correct"],
        q["a4text"],
        q["a4correct"],
    )
  }

  // submits the data and prompts you toa dd another question
  handleSubmit = () => {
    this.props.incrementCounter()
    this.saveData()
    this.props.goBack()
  }

  // submits the data to the db and then returns the user to the admin dashboard
  handleReturn = () => {
    this.saveData()
    this.props.toggleAddQuiz()
  }

  renderQ = () => {
    const q = this.state.qBank[this.state.selectedQ]
    if (this.state.selectedQ) {
      return (
        <div>
          <RadioGroup inputref={null}>
            <div style={{ display: 'flex'}}>
              <FormControlLabel value={q["a1text"]} control={<Radio />} label={q["a1text"]}/>
              {q["a1correct"] ? <p style={{ color: 'green'}}>Correct Answer</p> : null }
            </div>
            <div style={{ display: 'flex'}}>
              <FormControlLabel value={q["a2text"]} control={<Radio />} label={q["a2text"]}/>
              {q["a2correct"] ? <p style={{ color: 'green'}}>Correct Answer</p> : null }
            </div>
            <div style={{ display: 'flex'}}>
              <FormControlLabel value={q["a3text"]} control={<Radio />} label={q["a3text"]}/>
              {q["a3correct"] ? <p style={{ color: 'green'}}>Correct Answer</p> : null }
            </div>
            <div style={{ display: 'flex'}}>
              <FormControlLabel value={q["a4text"]} control={<Radio />} label={q["a4text"]}/>
              {q["a4correct"] ? <p style={{ color: 'green'}}>Correct Answer</p> : null }
            </div>
          </RadioGroup>
          <div className="quizButtonHolder">
            <Button variant="contained" color="primary" onClick={this.handleQuit}>Exit Without Saving</Button>
            <Button variant="contained" color="primary" onClick={this.handleSubmit}>Save & Add New Question</Button>
            <Button variant="contained" color="primary" onClick={this.handleReturn}>Save & Complete Quiz</Button>
          </div>
        </div>
      )
    }

  }

  render() {
    const qArray = Object.keys(this.state.qBank)
    const menuItems = qArray.map((q, i) => {
      return (
        <MenuItem key={i} value={qArray[i]}>{this.state.qBank[q]["q1"]}</MenuItem>
      )
    })

    console.log(this.state, 'state in question bank select')
    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.props.goBack} style={{ float: 'left'}}>Back</Button>
        <h2 style={{ textAlign: 'center' }}>Select a User-Submitted Question</h2>
        <Select
          fullWidth
          value={this.state.selectedQ}
          onChange={this.handleChange}
          inputProps={{
            name: 'selectedQ'
          }}
          style={{ paddingTop: '2vh', marginBottom: '2vh'}}
        >
          {menuItems}
        </Select>
        {this.renderQ()}
      </div>
    )
  }
}

export default QuizBankSelect;
