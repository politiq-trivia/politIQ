import React from 'react';

import Paper from '@material-ui/core/Paper';

import '../AdminDashboard/dashboard.css';
import PartyScores from './PartyScores';
import logo from '../logo.png';


const PartyLeaders = () => {
  return (
    <Paper className="party-leaders">
      <div style={{ display: 'flex', justifyContent: 'center'}}>
        <img src={logo} style={{ height: '10vh'}} alt="logo" />
        <h1 style={{ marginTop: 'auto', marginBottom: 'auto'}}>Party Leaders</h1>
      </div>
      <PartyScores affiliation="Democrat" />
      <PartyScores affiliation="Republican" />
      <PartyScores affiliation="Independent" />
    </Paper>
  )
}

export default PartyLeaders;
