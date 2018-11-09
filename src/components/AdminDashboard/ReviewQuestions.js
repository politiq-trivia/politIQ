import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_DASHBOARD } from '../../constants/routes';
import { db } from '../../firebase';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import './dashboard.css';

class ReviewQuestions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      selectedQ: {},
      index: 0,
      noQuestionsRemaining: false,
    }
  }

  componentDidMount = () => {
    this.getQuestion()
  }

  getQuestion = () => {
    db.getOneQuestion()
      .then(response => {
        const allQuestions = response.val()
        console.log(allQuestions)
        if (allQuestions === {}) {
          console.log('empty srponse')
          return;
        } else {
          const dates = Object.keys(response.val())
          const selectedDate = dates[0]
          const firstQ = allQuestions[dates[0]]
          this.setState({
            questions: allQuestions,
            selectedQ: firstQ,
            dateArray: dates,
            selectedDate: selectedDate,
          })
        }
      })
  }

  rejectQ = () => {
    db.deleteUserQuestion(this.state.selectedDate)
    this.skipQ();
    // console.log(this.state.index)
    // console.log(this.state.questions[])
    // if the user clicks on reject q, the question is deleted from the questions to review object in the database
    // if there are more questions remaining, then the next question will be displayed.
    // if there are no questions remaining, the user will see a no questions to review screen
  }

  skipQ = () => {
    let index = this.state.index;
    index++;
    if (index > (this.state.dateArray.length - 1)) {
      this.setState({
        noQuestionsRemaining: true,
      })
      return;
    } else {
      const selectedDate = this.state.dateArray[index];
      const nextQ = this.state.questions[selectedDate]
      this.setState({
        selectedQ: nextQ,
        index: index,
        selectedDate: selectedDate,
      })
    }
  }

  acceptQ = () => {
    console.log('accept clicked')
    // if the user accepts the question, the question will be added into an 'available questions' table in the db
    // this table will be available in the create quiz view for the admin
    // the component will then render a screen that says question accepted
    // the user will be given the option to continue if there are questions remaining, or go back if there are no additional questions to review
  }

  render() {
    let q = {}
    if (this.state.selectedQ) {
      q = this.state.selectedQ
    }
    const question = () => {
      return (
        <div className="questionHolder">
          <h3>{q["q1"]}</h3>
          <div style={{ display: 'flex' }}>
            <FormControlLabel value={q["a1text"]} control={<Radio />} label={q["a1text"]}/>
            {q["a1correct"] ? <p style={{ color: 'green' }}>Correct Answer</p> : null }
          </div>
          <div style={{ display: 'flex' }}>
            <FormControlLabel value={q["a2text"]} control={<Radio />} label={q["a2text"]}/>
            {q["a2correct"] ? <p style={{ color: 'green' }}>Correct Answer</p> : null }
          </div>
          <div style={{ display: 'flex' }}>
            <FormControlLabel value={q["a3text"]} control={<Radio />} label={q["a3text"]}/>
            {q["a3correct"] ? <p style={{ color: 'green' }}>Correct Answer</p> : null }
          </div>
          <div style={{ display: 'flex' }}>
            <FormControlLabel value={q["a4text"]} control={<Radio />} label={q["a4text"]}/>
            {q["a4correct"] ? <p style={{ color: 'green' }}>Correct Answer</p> : null }
          </div>
          <div>
            <p>Sources: <a href={q["source"]}>{q["source"]}</a></p>
          </div>
        </div>
      )

    }

    return (
      <Paper className="review">
        <Link to={ADMIN_DASHBOARD} id="reviewBackButton">
          <Button variant="contained" color="primary">Back to Dashboard</Button>
        </Link>
        {this.state.noQuestionsRemaining
          ? <div>
              <h1 id="noQs">No Questions Remaining</h1>
            </div>
          : <div>
              <h1 id="reviewHeading">User-Submitted Questions</h1>
                  {question()}
              <div className="reviewButtonHolder">
                <Button onClick={this.rejectQ}><span style={{ color: 'red', marginRight: '2vw' }}>Reject</span></Button>
                <Button onClick={this.skipQ}>Skip</Button>
                <Button onClick={this.acceptQ}><span style={{ color: 'purple', marginLeft: '2vw'}}>Accept</span></Button>
              </div>
            </div>
        }

      </Paper>
    )
  }

}

export default ReviewQuestions;
