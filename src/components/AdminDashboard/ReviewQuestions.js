import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ADMIN_DASHBOARD } from '../../constants/routes';
import { db } from '../../firebase';
import MediaQuery from 'react-responsive'

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import './dashboard.css';
import loadingGif from '../../loadingGif.gif';

class ReviewQuestions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      selectedQ: {},
      index: 0,
      dateArray: [],
      noQuestionsRemaining: false,
      loaded: false,
    }
  }

  componentDidMount = () => {
    this.getQuestion()
  }

  getQuestion = () => {
    db.getOneQuestion()
      .then(response => {
        if (response.val() === null) {
          this.setState({
            noQuestionsRemaining: true,
          })
        } else {
          const allQuestions = response.val()
          const dates = Object.keys(response.val())
          const selectedDate = dates[0]
          const firstQ = allQuestions[dates[0]]
          this.setState({
            questions: allQuestions,
            selectedQ: firstQ,
            dateArray: dates,
            selectedDate: selectedDate,
            loaded: true,
          })
        }
      })
  }

  rejectQ = () => {
    db.deleteUserQuestion(this.state.selectedDate)
    this.skipQ();
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

  // will need to modify this when I add in contested question
  acceptQ = async () => {
    db.acceptQuestion(this.state.selectedDate, this.state.selectedQ)
    await db.getSubmittedOrContestedScoreByUid(this.state.selectedQ.fromUser)
      .then(response => {
        const data = response.val()
        const scoreArray = Object.keys(data)
        const score = (scoreArray.length * 3) + 3
        db.setSubmittedOrContestedScoreByUid(this.state.selectedQ.fromUser, this.state.selectedDate, score)
      })
    this.skipQ()
  }

  render() {
    let q = {}
    if (this.state.selectedQ) {
      q = this.state.selectedQ
    }
    const question = () => {
      if (this.state.loaded) {
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
            <div className="reviewButtonHolder">
              <Button onClick={this.rejectQ}><span style={{ color: 'red', marginRight: '2vw' }}>Reject</span></Button>
              <Button onClick={this.skipQ}>Skip</Button>
              <Button onClick={this.acceptQ}><span style={{ color: 'purple', marginLeft: '2vw'}}>Accept</span></Button>
            </div>
          </div>
        )
      } else {
        return (
          <img className="gif" src={loadingGif} alt="Loading" />
        )
      }


    }

    return (
      <Paper className="review">
        <MediaQuery minWidth={416}>
          <Link to={ADMIN_DASHBOARD} id="reviewBackButton">
            <Button variant="contained" color="primary">Back to Dashboard</Button>
          </Link>
        </MediaQuery>
        {this.state.noQuestionsRemaining
          ? <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
              <h1 id="noQs">No Questions To Review</h1>
              <MediaQuery maxWidth={415}>
                <Link to={ADMIN_DASHBOARD} id="reviewBackButtonMobile" style={{ textDecoration: 'none'}}>
                  <Button color="primary">Back to Dashboard</Button>
                </Link>
              </MediaQuery>
            </div>
          : <div>
              <h1 id="reviewHeading">User-Submitted Questions</h1>
                  {question()}

            </div>
        }

      </Paper>
    )
  }

}

export default ReviewQuestions;
