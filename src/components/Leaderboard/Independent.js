import React, { Component } from 'react';

import { db } from '../../firebase';
import moment from 'moment';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import loadingGif from '../../loadingGif.gif';


class IndLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      rankedScores: {},
    }
  }

  componentDidMount = () => {
    this.getIndScores()
  }

  getInds = async (data) => {
    const userScores = []
    await db.getUserByAffiliation('Independent')
      .then(usernames => {
        usernames.forEach((user, i) => {
          db.getDisplayNames(usernames[i])
            .then(response => {
              let quizDates = []
              const dateObject = data[usernames[i]]
              if (dateObject !== undefined) {
                quizDates = Object.keys(dateObject)
              }
              let scoreCounter = 0;
              for (let j = 0; j < quizDates.length; j++) {
                if (quizDates[j] > moment().subtract(1, 'month').format('YYYY-MM-DD')) {
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

  getIndScores = async () => {
    await db.getScores()
      .then(response => {
        const data = response.val()
        this.getInds(data)
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

    const renderIndLeaders = rankingArray.map((stat, i) => {
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
              {renderIndLeaders}
            </TableBody>
          </Table>
        )
      }
    }

    return (
      <div>
        <h2>Independents</h2>
        {isLoading()}
      </div>
    )
  }
}

export default IndLeaderboard;