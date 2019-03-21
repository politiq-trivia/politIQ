import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom'

import { db } from '../../firebase';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import UserRank from './UserRank';
import getMostRecentQuizId from '../../utils/mostRecentQuizId';
import loadingGif from '../../loadingGif.gif';
import './leaderboard.css';

class WeeklyLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      rankedScores: {},
      mostRecentQuizId: '',
    }
  }

  componentDidMount = () => {
    this.weeklyLeaders();
    this.getMostRecentQuizId()
  }

  getMostRecentQuizId = async () => {
    const quizId = await getMostRecentQuizId()
    this.setState({
      mostRecentQuizId: quizId
    })
  }

  weeklyLeaders = async () => {
    const userScores = []
    await db.getScores()
      .then(response => {
        const data = response.val()
        const usernames = Object.keys(data)
        usernames.forEach((user, i) => {
          db.getDisplayNames(usernames[i])
            .then(response => {
              // get all the scores within the last week from this data array
              const quizDates = Object.keys(data[usernames[i]])
              let submitted;
              if(quizDates[quizDates.length - 1] === 'submitted') {
                submitted = data["submitted"]
                quizDates.pop()
              }
              const lastWeek = []
              let scoreCounter = 0;
              for (let j = 0; j < quizDates.length; j++) {
                if (quizDates[j] > moment().startOf('week').format('YYYY-MM-DD')) {
                  lastWeek.push(quizDates[j])
                  if (data[usernames[i]][quizDates[j]]) {
                    scoreCounter += data[usernames[i]][quizDates[j]]
                  }
                }
              }
              if (submitted !== undefined) {
                const dates = Object.keys(submitted)
                for (let j = 0; j < dates.length; j++) {
                  if (dates[j].slice(10) > moment().startOf('week').format('YYYY-MM-DD')) {
                    scoreCounter += 1
                  }
                }
              }
              const newDisplayName = () => {
                if (response.val() === null) {
                  return ''
                } else {
                  return response.val().displayName
                }
              }
              if (scoreCounter > 0) {
                userScores.push({
                  username: newDisplayName(),
                  score: scoreCounter,
                  uid: usernames[i]
                })
              }

              const rankedScores = userScores.sort(function(a,b){
                return a.score - b.score
              })
              const rankReverse = rankedScores.reverse()
              this.setState({
                rankedScores: rankReverse,
                isLoaded: true,
              })
            })
        })
      })
  }

  getUserRank = () => {
    if(this.state.isLoaded) {
      if (localStorage.hasOwnProperty('authUser')) {
        const scores = this.state.rankedScores
        const uid = JSON.parse(localStorage.getItem('authUser')).uid
        let ranking;
        for (let i = 0; i < scores.length; i++) {
          if (uid === scores[i].uid) {
            ranking = i + 1;
          }
        }
        return ranking;
      }
    }
  }

  handleClickUser = (uid) => {
    this.props.history.push(`/profile/${uid}`)
  }

  redirect = () => {
    this.props.history.push(this.state.mostRecentQuizId)
  }

  render() {
    let rankingArray = [];
    if (Array.isArray(this.state.rankedScores)) {
      const ranking = this.state.rankedScores;
      const result = ranking.map((stat, i) => {
        return [stat.username, stat.score, stat.uid]
      });
      rankingArray = [...result]
    }
    const renderWeeklyLeaders = rankingArray.map((stat, i) => {
      if (i >= 10) {return null;}
      return (
        <TableRow key={i} hover onClick={() => this.handleClickUser(stat[2])}>
          <TableCell style={{ width: '30%'}} padding="default">
            {i + 1}.
          </TableCell>
          <TableCell style={{ width: '40%'}} padding="none">
            {stat[0]}
          </TableCell>
          <TableCell>
            {stat[1]}
          </TableCell>
        </TableRow>
      )
    })

    const isLoading = () => {
      if (!this.state.isLoaded) {
        return (
          <img src={loadingGif} alt="loadingGif" className="leaderboard-mobile-loading"/>
        )
      } else {
        return (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: '30px'}} padding="default">
                  Ranking
                </TableCell>
                <TableCell style={{ minWidth: '50px' }} padding="none">
                  User
                </TableCell>
                <TableCell style={{ minWidth: '30px'}} padding="default">
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderWeeklyLeaders}
            </TableBody>
          </Table>
        )
      }
    }

    const rank = this.getUserRank()

    return (
      <div>
        {isLoading()}
        {rank === 0 || rank === undefined || !localStorage.hasOwnProperty('authUser') 
          ? <div style={{ paddingTop: '2vh', paddingBottom: '4vh' }}>  
              <h3 style={{ marginBottom: '2vh' }}>You don't have any scores for this week yet!</h3>
              <Button variant="contained" color="primary" onClick={this.redirect}>Play Now</Button> 
            </div>
          : <UserRank ranking={rank} /> 
        }
      </div>
    )
  }
}

export default withRouter(WeeklyLeaderboard);
