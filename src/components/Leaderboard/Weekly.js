import React, { Component } from 'react';
import moment from 'moment';
import { Link, withRouter } from 'react-router-dom';
import MediaQuery from 'react-responsive';

import { db } from '../../firebase';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import { getPolitIQ } from '../../utils/calculatePolitIQ';
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
      invisibleScore: false,
    }
  }

  componentDidMount = () => {
    this.weeklyLeaders();
    this.getMostRecentQuizId()

    // get the user's score preferences
    const userInfo = JSON.parse(localStorage.getItem('authUser'));
    if (userInfo.invisibleScore && userInfo.invisibleScore === true) {
      this.setState({
        invisibleScore: true,
      })
    }
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
        if (data === null) {
          this.setState({
            isLoaded: true,
          })
          return;
        }
        const usernames = Object.keys(data)
        usernames.forEach((user, i) => {
          db.getDisplayNames(usernames[i])
            .then(response => {
              // handle the empty response
              if (response.val() === null || response.val() === undefined) { return; }
              const userData = response.val();
              // check for the invisible score property and hide that user if it's true
              if (Object.keys(userData).includes("invisibleScore") && userData['invisibleScore'] === true) {
                return;
              } else {
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

                let submittedScoreCounter = 0;
                if (submitted !== undefined) {
                  const dates = Object.keys(submitted)
                  for (let j = 0; j < dates.length; j++) {
                    if (dates[j].slice(10) > moment().startOf('week').format('YYYY-MM-DD')) {
                      submittedScoreCounter += 1
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
                  this.getPolitIQ(usernames[i], 'week')
                    .then(politIQ => {
                      userScores.push({
                        username: newDisplayName(),
                        score: scoreCounter,
                        uid: usernames[i],
                        politIQ: politIQ + submittedScoreCounter,
                      })

                      const rankedScores = userScores.sort(function(a,b){
                        return a.score - b.score
                      })
                      const rankReverse = rankedScores.reverse()
                      this.setState({
                        rankedScores: rankReverse,
                        isLoaded: true,
                      })
                    })
                }
              }

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

  getPolitIQ = async (uid, timeframe) => {
    const politIQ = await getPolitIQ(uid, timeframe)
    return politIQ
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
        return [stat.username, stat.score, stat.uid, stat.politIQ]
      });
      rankingArray = [...result]
    }
    const renderWeeklyLeaders = rankingArray.map((stat, i) => {
      if (i >= 10) {return null;}
      const colorArray = ["#f44336", "#e91e63", "#9c27b0", "#3f51b5", "#2196f3", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800"]
      const random = Math.floor(Math.random() * colorArray.length)
      return (
        <TableRow key={i} hover onClick={() => this.handleClickUser(stat[2])}>
          <TableCell style={{ width: '10%'}} padding="default">
            {i + 1}.
          </TableCell>
          <MediaQuery minWidth={416}>
            <TableCell style={{ width: '10%'}}>
              <Avatar style={{ backgroundColor: colorArray[random]}}>{stat[0][0]}</Avatar>
            </TableCell>
          </MediaQuery>
          <TableCell style={{ width: '40%'}} padding="none">
            {stat[0]}
          </TableCell>
          <TableCell style={{ fontWeight: 'bold' }}>
            {stat[1]}
          </TableCell>
          <TableCell>
            {stat[3]}
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
                <TableCell padding="none" style={{ minWidth: '30px', paddingLeft: '10px'}}>
                  Ranking
                </TableCell>
                <MediaQuery minWidth={416}>
                  <TableCell>
                  </TableCell>
                </MediaQuery>
                <TableCell style={{ minWidth: '50px' }} padding="none">
                  User
                </TableCell>
                <TableCell style={{ minWidth: '30px', fontWeight: 'bold', paddingLeft: '18px'}} padding="none">
                  Score
                </TableCell>
                <TableCell style={{ minWidth: '30px'}} padding="none">
                  PolitIQ
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

    let rank;
    if (this.state.invisibleScore === true) {
      rank = "not set"
    } else {
      rank = this.getUserRank()
    }

    return (
      <div>
        {isLoading()}
        {rank === "not set" 
          ? <>
              <h3 style={{ marginBottom: '2vh' }}>Want to see your score in this ranking? <br />Head over to your settings page and make your scores publicly visible!</h3>
              <Link to='/profile' style={{ textDecoration: 'none'}}>
                <Button variant="contained" color="primary" style={{ marginBottom: '3vh' }}>Settings</Button>
              </Link>
            </>
          
          : <>{rank === 0 || rank === undefined || !localStorage.hasOwnProperty('authUser')
              ? <div style={{ paddingTop: '2vh', paddingBottom: '4vh' }}>  
                <h3 style={{ marginBottom: '2vh' }}>You don't have any scores for this month yet!</h3>
                <Button variant="contained" color="primary" onClick={this.redirect}>Play Now</Button> 
              </div>
              : <UserRank ranking={rank} /> }
            </>
        }
      </div>
    )
  }
}

export default withRouter(WeeklyLeaderboard);
