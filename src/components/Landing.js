import React from 'react';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import bg from './politIQ-bg.png';

import './Static.css';

const LandingPage = () =>
  <Paper className="home-holder">
    <h1 id="main">WELCOME TO POLIT<span id="iq">IQ</span></h1>
    <h2>Where you can answer the question: Are you smarter than a </h2>
    <span id="rep">Republican? </span><span id="dem">Democrat? </span><span id="ind">Independent?</span><br/>

    <img src={bg} id="bg-image"/>

    <Button size="large" variant="contained" color="secondary" className="home-button"><Link to="/signup" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5em' }}>Sign Up and Find Out</Link></Button>
  </Paper>

export default LandingPage;
