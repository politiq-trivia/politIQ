import React, { Component } from 'react'
import { db } from '../../firebase';
import moment from 'moment';
import { withFirebase } from '../../firebase';
import { getPolitIQ } from '../../utils/calculatePolitIQ';

class UserScoreboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      weeklyScore: 0,
      submittedScore: 0,
      moneyWon: '$0',
      politIQ: 0,
    }
  }
  componentDidMount = () => {
    this.getMyScore()
  }

  componentWillReceiveProps = () => {
    this.getMyScore()
    if (this.props.public) {
      const uid = window.location.href.split('/')[4]
      this.getMyPolitIQ(uid, "month")
    } else {
      const uid = this.props.uid
      this.getMyPolitIQ(uid, 'month')
    }
  }

  getMyScore = async () => {
    if (this.props.uid === null || this.props.uid === undefined || this.props.uid === '') {return;}
    this.listener = await db.getScoresByUid(this.props.uid)
      .then(response => {
        const data = response.val()
        if (data === null) {
          this.setState({
            monthlyScore: 0,
            // allTimeScore: 0,
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

        let weeklyScore = 0;
        // let allTimeScore = 0;
        let submittedScore = 0;

        for (let i = 0; i < quizDates.length; i++) {
          if (quizDates[i] > moment().startOf('week').format('YYYY-MM-DD')) {
            weeklyScore += data[quizDates[i]]
          }
          // allTimeScore += data[quizDates[i]]
        }

        if (submitted !== []) {
          const dates = Object.keys(submitted)
          for (let j = 0; j < dates.length; j++) {
              submittedScore += 1
            }
        }

        this.setState({
          weeklyScore,
          // allTimeScore,
          submittedScore,
        })
      })
  }

  getMyPolitIQ = async (uid, timeframe) => {
    const iq = await getPolitIQ(uid, timeframe)
    this.setState({
      politIQ: iq,
    })
  }

  render() {
    return (
      <div className="small-scoreboardHolder user-scoreboard-public">
        <h2>{this.props.public ? `${this.props.name}'s`: "My"} Scores</h2>
        <div className="userScore politIQ">PolitIQ<span className="score reg-score">{this.state.politIQ}</span></div>
        <div className="small-scoreboard">
          <div className="userScore" style={{ borderLeft: 'none' }}>Weekly Score<span className="score reg-score">{this.state.weeklyScore}</span></div>
          <div className="userScore" id="submittedQScore">Submitted & Contested Q Score<span className="score">{this.state.submittedScore}</span></div>
          <div className="userScore">Money Won<span className="score reg-score">{this.state.moneyWon}</span></div>
        </div>
      </div>
    )
  }


}

export default withFirebase(UserScoreboard);
