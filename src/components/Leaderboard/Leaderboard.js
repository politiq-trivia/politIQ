import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { db } from '../../firebase';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import * as routes from '../../constants/routes';

import './leaderboard.css';
import loadingGif from '../../loadingGif.gif';
import logo from '../logo.png';
import WeeklyLeaderboard from './Weekly';



class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rankedScores: {},
      weeklyScoresLoaded: false,
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
        usernames.map((user, i) => {
          db.getDisplayNames(usernames[i])
            .then(response => {
              const scores = Object.values(data[usernames[i]])
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
                weeklyScoresLoaded: true,
              })
            })
        })
      })
  }


  render() {
    console.log(moment().subtract(7, 'days').format('YYYY-MM-DD'))

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
      if (!this.state.weeklyScoresLoaded) {
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
      <Paper className="leaderboard">
        <div style={{ display: 'flex', justifyContent: 'space-evenly', width: 'auto'}}>
          <Link to={routes.HOME} style={{ textDecoration: 'none', float: 'left'}}>
            <Button variant="contained" color="primary">Home</Button>
          </Link>
          <div style={{ marginLeft: '6vw'}}>
            <h1>Leaderboard</h1>
            <img src={logo} alt="politIQ" style={{ height: '10vh'}}/>
          </div>
          <Link to={routes.QUIZ_ARCHIVE} style={{ textDecoration: 'none', float: 'right'}}>
            <Button variant="contained" color="primary">Build Your Score</Button>
          </Link>
        </div>
        <WeeklyLeaderboard />
        <h2>Weekly</h2>
        {isLoading()}
        <h2>Monthly</h2>
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
          </TableBody>
        </Table>
        <div style={{ display: 'flex', width: "100%", justifyContent: 'space-between'}}>
          <div>
            <h2>Democrats</h2>
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
              </TableBody>
            </Table>
          </div>
          <div>
            <h2>Republicans</h2>
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
              </TableBody>
            </Table>
          </div>
          <div>
            <h2>Independent</h2>
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
              </TableBody>
            </Table>
          </div>
        </div>
      </Paper>
    )
  }
}

export default Leaderboard;
