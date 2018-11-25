import React from 'react';

import Paper from '@material-ui/core/Paper';

import './leaderboard.css';
import DemLeaderboard from './Democrats';
import RepLeaderboard from './Republicans';
import IndLeaderboard from './Independent';
import logo from '../logo.png';


const PartyLeaders = () => {
  return (
    <Paper className="leaderboard" style={{ marginTop: '3vh', paddingLeft: '2vw', paddingRight: '2vw', marginBottom: '25vh', paddingBottom: '2vh', width: '90vw'}}>
      <div style={{ display: 'flex', justifyContent: 'center'}}>
        <img src={logo} style={{ height: '10vh'}} alt="logo" />
        <h1 style={{ marginTop: 'auto', marginBottom: 'auto'}}>Party Leaders</h1>
      </div>
      <DemLeaderboard />
      <RepLeaderboard />
      <IndLeaderboard />
    </Paper>
  )
}

export default PartyLeaders;
