import React, { Component } from 'react'
import { db } from '../../firebase';
import moment from 'moment';

class UserScoreboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }
  componentDidMount = () => {
    this.getMyScore()
  }

  getMyScore = async () => {
    await db.getScoresByUid(this.props.uid)
      .then(response => {
        const data = response.val()
        if (data === null) {
          this.setState({
            monthlyScore: 0,
            allTimeScore: 0,
            submittedScore: 0,
          })
          return;
        }

        let submitted = [];
        const quizDates = Object.keys(data)
        if (quizDates[quizDates.length -1] === 'submitted') {
          submitted = data["submitted"]
          quizDates.pop()
        }

        let monthlyScore = 0;
        let allTimeScore = 0;
        let submittedScore = 0;

        for (let i = 0; i < quizDates.length; i++) {
          if (quizDates[i] > moment().startOf('month').format('YYYY-MM-DD')) {
            monthlyScore += data[quizDates[i]]
          }
          allTimeScore += data[quizDates[i]]
        }

        if (submitted !== []) {
          const dates = Object.keys(submitted)
          for (let j = 0; j < dates.length; j++) {
              submittedScore += 1
            }
        }

        this.setState({
          monthlyScore,
          allTimeScore,
          submittedScore,
        })
      })
  }
  

  render() {
    return (
      <div className="small-scoreboardHolder user-scoreboard-public">
        <h2>{this.props.public ? `${this.props.name}'s`: "My"} Scores</h2>
        <div className="small-scoreboard">
          <div id="userScore">Monthly Score<span className="score" style={{ marginTop: '1.3vh' }}>{this.state.monthlyScore}</span></div>
          <div id="userScore">All Time Score<span className="score" style={{ marginTop: '1.3vh' }}>{this.state.allTimeScore}</span></div>
          <div id="userScore" style={{ fontSize: '14px' }}>Submitted & Contested Question Score<span className="score">{this.state.submittedScore}</span></div>
        </div>
      </div>
    )
  }


}

export default UserScoreboard;