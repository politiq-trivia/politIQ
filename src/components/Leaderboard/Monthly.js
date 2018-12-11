import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import moment from 'moment';

import { db } from '../../firebase';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import loadingGif from '../../loadingGif.gif';
import './leaderboard.css';

class MonthlyLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      rankedScores: {},
    }
  }

  componentDidMount = () => {
    this.monthlyLeaders();
  }

  monthlyLeaders = async () => {
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
                submitted = data[usernames[i]]["submitted"]
                quizDates.pop()
              }
              let scoreCounter = 0;
              for (let j = 0; j < quizDates.length; j++) {
                if (quizDates[j] > moment().startOf('month').format('YYYY-MM-DD')) {
                  if (data[usernames[i]][quizDates[j]]) {
                    scoreCounter += data[usernames[i]][quizDates[j]]
                  }
                }
              }
              if (submitted !== undefined) {
                const dates = Object.keys(submitted)
                for (let j = 0; j < dates.length; j++) {
                  if (dates[j].slice(10) > moment().startOf('month').format('YYYY-MM-DD')) {
                    scoreCounter += 1
                  }
                }
              }
              userScores.push({
                username: response.val().displayName,
                score: scoreCounter,
                uid: usernames[i]
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

  handleClickUser = (uid) => {
    this.props.history.push(`/profile/${uid}`)
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

    const renderMonthlyLeaders = rankingArray.map((stat, i) => {
      if (i > 5) { return null; }
      return (
        <TableRow key={i} onClick={() => this.handleClickUser(stat[2])}>
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
                <TableCell style={{ minWidth: '50px'}} padding="none">
                  User
                </TableCell>
                <TableCell style={{ minWidth: '30px'}} padding="default">
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderMonthlyLeaders}
            </TableBody>
          </Table>
        )
      }
    }

    return (
      <div>
        {isLoading()}
      </div>
    )
  }
}

export default withRouter(MonthlyLeaderboard);
