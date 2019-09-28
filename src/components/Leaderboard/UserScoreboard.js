import React, { Component } from 'react'
import { db } from '../../firebase';
import moment from 'moment';
import MediaQuery from 'react-responsive';
import { withFirebase } from '../../firebase';
import { getPolitIQ } from '../../utils/calculatePolitIQ';

class UserScoreboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      weeklyScore: 0,
      monthlyScore: 0,
      submittedScore: 0,
      recentSubmittedScores: 0,
      moneyWon: '$0',
      politIQ: 0,
    }
  }
  componentDidMount = () => {
    this.getMyScore()
  }

  componentWillReceiveProps = () => {
    this.getMyScore()
    if (this.props.moneyWon !== undefined) {
      this.setState({
        moneyWon: '$' + this.props.moneyWon
      })
    }
    if (this.props.public) {
      const uid = window.location.href.split('/')[4]
      this.getMyPolitIQ(uid, "month")
    } else {
      const uid = this.props.uid
      this.getMyPolitIQ(uid, 'month')
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.moneyWon !== prevProps.moneyWon) {
      if (this.props.moneyWon !== undefined) {
        this.setState({
          moneyWon: '$' + this.props.moneyWon
        })
      } else {
        this.setState({
          moneyWon: '$0'
        })
      }
      return true;
    } else {
      return false;
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
            submittedScore: 0,
          })
          return;
        }

        let submitted = [];
        let recentSubmittedScores = 0;
        const quizDates = Object.keys(data)
        if (quizDates[quizDates.length -1] === 'submitted') {
          submitted = data["submitted"]
          quizDates.pop()
        }

        let weeklyScore = 0;
        let monthlyScore = 0;
        let submittedScore = 0;

        for (let i = 0; i < quizDates.length; i++) {
          if (quizDates[i] > moment().startOf('week').format('YYYY-MM-DD')) {
            weeklyScore += data[quizDates[i]]
          }
        }

        for (let i = 0; i < quizDates.length; i++) {
          if (quizDates[i] > moment().startOf('month').format('YYYY-MM-DDTHH:mm')) {
            monthlyScore += data[quizDates[i]]
          }
        }

        if (submitted !== []) {
          const dates = Object.keys(submitted)
          const recentDates = dates.filter(date => date > moment().startOf('month').format('YYYY-MM-DDTHH:mm'))
          let recentScores = [];
          for (let i = 0; i < recentDates.length; i++) {
            const score = submitted[recentDates[i]]
            recentScores.push(score)
          }
          const scores = Object.values(submitted)
          if (scores.length !== 0) {
            submittedScore = scores.reduce((a, b) => a + b)
          }
          if (recentScores.length !== 0) {
            recentSubmittedScores = recentScores.reduce((a, b) => a + b)
          }
        }

        this.setState({
          weeklyScore,
          monthlyScore,
          submittedScore,
          recentSubmittedScores,
        })
      })
  }

  getMyPolitIQ = async (uid, timeframe) => {
    let iq = await getPolitIQ(uid, timeframe)
    if (isNaN(iq)) {
      this.setState({
        politIQ: 0
      })
    } else {
      this.setState({
        politIQ: iq,
      })
    }
  }

  render() {
    return (
      <div className="small-scoreboardHolder user-scoreboard-public">
        <h2>{this.props.public ? `${this.props.name}'s`: "My"} Scores</h2>
        <div className="userScore politIQ">PolitIQ<span className="s reg-score politIQ-score">{this.state.politIQ + this.state.recentSubmittedScores}</span></div>
        <MediaQuery minWidth={416}>
          <div className="small-scoreboard">
            <div className="userScore" style={{ borderLeft: 'none'}}>Monthly Score<span className="s reg-score">{this.state.monthlyScore}</span></div>

            <div className="userScore" style={{ borderLeft: 'none' }}>Weekly Score<span className="s reg-score">{this.state.weeklyScore}</span></div>
            <div className="userScore" id="submittedQScore">Submitted & Contested Q Score<span className="s">{this.state.submittedScore}</span></div>
          </div>
          <div className="small-scoreboard" style={{ justifyContent: 'center' }}>
            <div className="userScore second-row">Money Won<span className="s reg-score">{this.state.moneyWon}</span></div>
            <div className="userScore second-row">Lifetime Earnings<span className="s reg-score">{this.state.moneyWon}</span></div>
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={415}>
          <div className="small-scoreboard">
            <div className="userScore" style={{ borderLeft: 'none', margin: '0' }}>Monthly Score<span className="s reg-score">{this.state.monthlyScore}</span></div>

            <div className="userScore" style={{ borderLeft: 'none', margin: '0' }}>Weekly Score<span className="s reg-score">{this.state.weeklyScore}</span></div>
            <div className="userScore second-row" id="submittedQScore">Submitted & Contested Q Score<span className="s">{this.state.submittedScore}</span></div>
            <div className="userScore second-row">Money Won<span className="s reg-score">{this.state.moneyWon}</span></div>
            <div className="userScore">Lifetime Earnings<span className="s reg-score">{this.state.moneyWon}</span></div>
          </div>
        </MediaQuery>
      </div>
    )
  }


}

export default withFirebase(UserScoreboard);
