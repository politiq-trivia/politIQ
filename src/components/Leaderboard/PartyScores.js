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

class PartyScores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      rankedScores: {},
      userScores: [],
    }
  }
  componentDidMount = () => {
    this.getDemScores(this.props.affiliation)
  }

  getDemScores = async (affiliation) => {
    const scores = JSON.parse(localStorage.getItem('allScores')).data
    // uid array represents the users who have score data
    let uidArray = [];
    for (let i = 0; i < scores.length; i++) {
      uidArray.push(scores[i].user)
    }

    this.getDems(scores, uidArray, affiliation)
  }

  // move the sort user by affiliation logic into a util so it can be reusable
  getDems = async (data, uidArray, affiliation) => {
    await db.getUserByAffiliation(affiliation)
      .then(usernames => {
        // usernames and score objects of all the democrats
        let demsWithScores = [];
        let demScores = [];

        uidArray.forEach(async (user, i) => {
          if (usernames.indexOf(user) !== -1) {
            demsWithScores.push(data[i])
          } 
        })

        // calculate the scores of all the dems and store them in a demScore array
        for (let k = 0; k < demsWithScores.length; k++) {
          const quizDates = Object.keys(demsWithScores[k].data)

          if (quizDates[quizDates.length - 1] === 'submitted') {
            quizDates.pop();
          }

          let scoreCounter = 0;
          for (let j = 0; j < quizDates.length; j++) {
            if (quizDates[j] > moment().startOf('month').format('YYYY-MM-DDTHH:mm')) {
              if (demsWithScores[k].data[quizDates[j]]) {
                scoreCounter += demsWithScores[k].data[quizDates[j]]
              }
            }
          }

          if (scoreCounter > 0) {
            demScores.push({
              uid: demsWithScores[k].user,
              score: scoreCounter
            })
          }
        }

        // rank that array and return the top 3
        const rankedScores = demScores.sort(function(a,b) {
          return a.score - b.score
        })

        const rankReverse = rankedScores.reverse().slice(0,3)
        // get the information for those top 3 people.
        this.getUserInfo(rankReverse)

        this.props.setCount(demScores.length);
      })
  }

  getUserInfo = async (rankReverse) => {
    for (let n = 0; n < rankReverse.length; n++) {
      await db.getOneUser(rankReverse[n].uid)
        .then(response => {
          const data = response.val()
          if (data === undefined || data === null) { return; }
          rankReverse[n].displayName = data.displayName
          rankReverse[n].email = data.email
        })
    }

    this.setState({
      rankedScores: rankReverse,
      isLoaded: true,
    })
  }

  handleClickUser = (uid) => {
    this.props.history.push(`/profile/${uid}`)
  }

  render() {
    let renderDemLeaders;

    if (Array.isArray(this.state.rankedScores)) {
      renderDemLeaders = this.state.rankedScores.map((stat, i) => {
        return (
          <TableRow key={i} onClick={() => this.handleClickUser(stat.uid)} hover>
            <TableCell>
              {i + 1}.
            </TableCell>
            <TableCell>
              {stat.displayName}
            </TableCell>
            <TableCell>
              {stat.email}
            </TableCell>
            <TableCell>
              {stat.score}
            </TableCell>
          </TableRow>
        )
      }) 
    }

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
        <h2>{this.props.affiliation} Leaders</h2>
        {isLoading()}
      </div>
    )
  }
}

export default withRouter(PartyScores);
