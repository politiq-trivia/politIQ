import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { db } from '../../firebase';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import EditQBankQs from './EditQBankQ';

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

  saveData = (q) => {
    db.removeFromQBank(this.state.selectedQ)
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
        q["answerExplanation"]
    )
  }

  // submits the data and prompts you toa dd another question
  handleSubmit = (q) => {
    this.props.incrementCounter()
    this.saveData(q)
    this.props.goBack()
  }

  // submits the data to the db and then returns the user to the admin dashboard
  handleReturn = (q) => {
    this.saveData(q)
    this.props.toggleAddQuiz()
    this.props.addToRss(this.props.quizId, this.props.title)
  }

  renderQ = () => {
    if (this.state.selectedQ) {
      return (
        <EditQBankQs question={this.state.qBank[this.state.selectedQ]} handleSubmit={this.handleSubmit} handleReturn={this.handleReturn} handleQuit={this.handleQuit}/>
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

QuizBankSelect.propTypes = {
  toggleAddQuiz: PropTypes.func.isRequired,
}

export default QuizBankSelect;
