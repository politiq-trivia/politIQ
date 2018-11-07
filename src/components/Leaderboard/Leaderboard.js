import React from 'react';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import * as routes from '../../constants/routes';

import './leaderboard.css';
import logo from '../logo.png';
import WeeklyLeaderboard from './Weekly';
import MonthlyLeaderboard from './Monthly';
import DemLeaderboard from './Democrats';
import RepLeaderboard from './Republicans';
import IndLeaderboard from './Independent';

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
      <MonthlyLeaderboard />
        <div style={{ display: 'flex', width: "100%", justifyContent: 'space-between'}}>
          <div>
            <DemLeaderboard />
          </div>
          <div>
            <RepLeaderboard />
          </div>
          <div>
            <IndLeaderboard />
          </div>
        </div>
      </Paper>
    )
}

export default Leaderboard;
