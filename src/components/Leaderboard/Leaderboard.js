import React, { Component } from 'react';

import { db } from '../../firebase';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import './leaderboard.css';
import loadingGif from '../../loadingGif.gif';



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
              const sumScores = scores.reduce((a,b) =>  a + b, 0)
              userScores.push({
                username: response.val().username,
                score: sumScores
              })
              return userScores;
            })
        })
      })
    const rankedScores = () => {
      console.log('rankedScores is being called')
      return (
        userScores.sort(function(a,b){
          return a.score > b.score
        })
      )
    }
    this.setState({
      rankedScores: rankedScores(),
      weeklyScoresLoaded: true,
    })
  }

  renderScoreList = () => {
    console.log(typeof(this.state.rankedScores))
    // for(let i = 0; i <  )
    //   console.log(score, 'scoreList is being called')
    //   return(
    //     <TableRow>
    //       <TableCell>
    //         {i}.
    //       </TableCell>
    //       <TableCell>
    //         {score.username}
    //       </TableCell>
    //       <TableCell>
    //         {score.score}
    //       </TableCell>
    //     </TableRow>
    //   )
    // })
  }


  render() {
    // const scoreList = () => {
    //   console.log('scoreList is being called')
    //
    // }

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
              {this.renderScoreList()}
            </TableBody>
          </Table>
        )
      }
    }

    return (
      <Paper className="leaderboard">
        <h1>Leaderboard</h1>

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
