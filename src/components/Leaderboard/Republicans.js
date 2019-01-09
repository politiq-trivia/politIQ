import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { db } from '../../firebase';
import moment from 'moment';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import loadingGif from '../../loadingGif.gif';

class RepLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      rankedScores: {},
    }
  }

  componentDidMount = () => {
    this.getRepScores()
  }

  getReps = async (data) => {
    const userScores = []
    await db.getUserByAffiliation('Republican')
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
                if (quizDates[j] > moment().startOf('month').format('YYYY-MM-DD')) {
                  if (data[usernames[i]][quizDates[j]]) {
                    scoreCounter += data[usernames[i]][quizDates[j]]
                  }
                }
              }

              this.getEmailAddress(usernames[i], response.val().displayName, scoreCounter)              

              // userScores.push({
              //   username: response.val().displayName,
              //   score: scoreCounter,
              //   uid: usernames[i]
              // })
              // const rankedScores = userScores.sort(function(a,b){
              //   return a.score - b.score
              // })
              // const rankReverse = rankedScores.reverse()
              // this.setState({
              //   rankedScores: rankReverse,
              //   isLoaded: true,
              // })
            })
        })
      })
  }

  getRepScores = async () => {
    await db.getScores()
      .then(response => {
        const data = response.val()
        this.getReps(data)
      })
  }

  getEmailAddress = async (uid, displayName, score) => {
    let userScores = [];
    await db.getOneUser(uid)
      .then((response) => {
        const userEmail = response.val().email;
        userScores.push({
          username: displayName,
          score,
          uid,
          email: userEmail,
        })
        // sort the user scores 
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

  handleClickUser = (uid) => {
    this.props.history.push(`/profile/${uid}`)
  }

  render() {

    let rankingArray = [];
    if (Array.isArray(this.state.rankedScores)) {
      const ranking = this.state.rankedScores;
      const result = ranking.map((stat, i) => {
        return [stat.username, stat.email, stat.score, stat.uid]
      });
      rankingArray = [...result]
    }

    const renderRepLeaders = rankingArray.map((stat, i) => {
      return (
        <TableRow key={i} onClick={() => this.handleClickUser(stat[3])} hover>
          <TableCell>
            {i + 1}.
          </TableCell>
          <TableCell>
            {stat[0]}
          </TableCell>
          <TableCell>
            {stat[1]}
          </TableCell>
          <TableCell>
            {stat[2]}
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
                <TableCell style={{ width: '10vw'}}>
                  User
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {renderRepLeaders}
            </TableBody>
          </Table>
        )
      }
    }

    return (
      <div>
        <h2>Republicans</h2>
        {isLoading()}
      </div>
    )
  }
}

export default withRouter(RepLeaderboard);
