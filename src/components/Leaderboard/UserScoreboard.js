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
          })
          return;
        }
        const quizDates = Object.keys(data)
        let monthlyScore = 0;
        let allTimeScore = 0;
        for (let i = 0; i < quizDates.length; i++) {
          if (quizDates[i] > moment().startOf('month').format('YYYY-MM-DD')) {
            monthlyScore += data[quizDates[i]]
          }
          allTimeScore += data[quizDates[i]]
        }
        this.setState({
          monthlyScore,
          allTimeScore,
        })
      })
  }

  render() {
    return (
      <div className="small-scoreboardHolder user-scoreboard-public">
        <h2>{this.props.public ? `${this.props.name}'s`: "My"} Scores</h2>
        <div className="small-scoreboard">
          <div id="userScore">Monthly Score<span className="score">{this.state.monthlyScore}</span></div>
          <div id="userScore">All Time Score<span className="score">{this.state.allTimeScore}</span></div>
        </div>
      </div>
    )
  }


}

export default UserScoreboard;
