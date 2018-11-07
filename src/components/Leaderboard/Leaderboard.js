import React from 'react';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import * as routes from '../../constants/routes';

import './leaderboard.css';
import logo from '../logo.png';
import WeeklyLeaderboard from './Weekly';



const Leaderboard = () => {
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

export default Leaderboard;
