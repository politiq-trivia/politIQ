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
        console.log(response.val())
        const data = response.val()
        const quizDates = Object.keys(data)
        console.log(quizDates)
        let monthlyScore = 0;
        let allTimeScore = 0;
        for (let i = 0; i < quizDates.length; i++) {
          if (quizDates[i] > moment().startOf('month').format('YYYY-MM-DD')) {
            monthlyScore += data[quizDates[i]]
            console.log(data[quizDates[i]])
          }
          allTimeScore += data[quizDates[i]]
        }
        console.log(monthlyScore, allTimeScore)

        this.setState({
          monthlyScore,
          allTimeScore,
        })
      })
  }

  render() {
    console.log(this.state, 'state')
    return (
      <div className="small-scoreboardHolder">
        <h2>My Scores</h2>
        <div className="small-scoreboard">
          <div id="userScore">Monthly Score<span className="score">{this.state.monthlyScore}</span></div>
          <div id="userScore">All Time Score<span className="score">{this.state.allTimeScore}</span></div>
        </div>
      </div>
    )
  }


}

export default UserScoreboard;
