import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';

import '../AdminDashboard/dashboard.css';
import ScoreCounter from '../AdminDashboard/AdminLeaderboard/ScoreCounter';
import PartyScores from './PartyScores';
import logo from '../logo.png';


const PartyLeaders = () => {
  const [demCount, setDemCount] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [indCount, setIndCount] = useState(0);

  return (
    <Paper className="party-leaders">
      <div style={{ display: 'flex', justifyContent: 'center'}}>
        <img src={logo} style={{ height: '10vh'}} alt="logo" />
        <h1 style={{ marginTop: 'auto', marginBottom: 'auto'}}>Party Leaders</h1>
      </div>
      <ScoreCounter demCount={demCount} repCount={repCount} indCount={indCount} />
      <PartyScores affiliation="Democrat" setCount={setDemCount} />
      <PartyScores affiliation="Republican" setCount={setRepCount} />
      <PartyScores affiliation="Independent" setCount={setIndCount} />
    </Paper>
  )
}

export default PartyLeaders;
