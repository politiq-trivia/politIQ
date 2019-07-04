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

class DemLeaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      rankedScores: {},
      userScores: [],
    }
  }
  componentDidMount = () => {
    this.getDemScores()
  }

  getDems = async (data) => {
    await db.getUserByAffiliation('Democrat')
      .then(usernames => {
        usernames.forEach(async (user, i) => {
          const userInfo = await db.getDisplayNames(usernames[i])
          userInfo.displayName.then((displayName) => {
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
            if (scoreCounter > 0) {
              this.getEmailAddress(usernames[i], displayName, scoreCounter)
            }
          })
        })
      })
  }

  getDemScores = async () => {
    await db.getScores()
      .then(response => {
        const data = response.val()
        this.getDems(data)
      })
  }

  getEmailAddress = async (uid, displayName, score) => {
    let userScores = this.state.userScores;
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
          userScores,
          rankedScores: rankReverse,
          isLoaded: true,
        })

        return userEmail;
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

    const renderDemLeaders = rankingArray.map((stat, i) => {
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
              {renderDemLeaders}
            </TableBody>
          </Table>
        )
      }
    }

    return (
      <div>
        <h2>Democrats</h2>
        {isLoading()}
      </div>
    )
  }
}

export default withRouter(DemLeaderboard);
