import React, { Component } from 'react';
import moment from 'moment';

import { db } from '../../firebase';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import loadingGif from '../../loadingGif.gif';
import './leaderboard.css';

class WeeklyLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      rankedScores: {},
    }
  }

  componentDidMount = () => {
    this.weeklyLeaders();
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
              const lastWeek = []
              let scoreCounter = 0;
              for (let j = 0; j < quizDates.length; j++) {
                if (quizDates[j] > moment().subtract(1, 'week').format('YYYY-MM-DD')) {
                  lastWeek.push(quizDates[j])
                  if (data[usernames[i]][quizDates[j]]) {
                    scoreCounter += data[usernames[i]][quizDates[j]]
                  }
                }
              }
              userScores.push({
                username: response.val().displayName,
                score: scoreCounter,
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
        })
      })
  }

  render() {
    let rankingArray = [];
    if (Array.isArray(this.state.rankedScores)) {
      const ranking = this.state.rankedScores;
      const result = ranking.map((stat, i) => {
        return [stat.username, stat.score]
      });
      rankingArray = [...result]
    }

    const renderWeeklyLeaders = rankingArray.map((stat, i) => {
      return (
        <TableRow key={i}>
          <TableCell>
            {i + 1}.
          </TableCell>
          <TableCell>
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
          <img src={loadingGif} alt="loadingGif"/>
        )
      } else {
        return (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Ranking
                </TableCell>
                <TableCell>
                  User
                </TableCell>
                <TableCell>
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

    return (
      <div>
        <h2>Weekly</h2>
        {isLoading()}
      </div>
    )
  }
}

export default WeeklyLeaderboard;
