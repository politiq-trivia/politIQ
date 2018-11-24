import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MediaQuery from 'react-responsive';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

import * as routes from '../../constants/routes';

import './leaderboard.css';
import logo from '../logo.png';
import WeeklyLeaderboard from './Weekly';
import MonthlyLeaderboard from './Monthly';
import Scoreboard from './Scoreboard';

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    }
  }

  handleChange = (event, value) => {
    console.log(value, 'value')
    this.setState({ value });
  }

  handleChangeIndex = index => {
    this.setState({ value: index });
  }
  render() {
    return (
      <Paper className="leaderboard">
        <Helmet>
          <title>Leaderboard | politIQ</title>
        </Helmet>
        <MediaQuery minWidth={416}>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', width: 'auto'}}>
            <Link to={routes.HOME} style={{ textDecoration: 'none', float: 'left', marginTop: 'auto', marginBottom: 'auto'}}>
              <Button variant="contained" color="primary">Home</Button>
            </Link>
            <div className="leaderboard-header">
              <img src={logo} alt="politIQ" style={{ height: '10vh'}}/>
              <h1 style={{ marginTop: 'auto', marginBottom: 'auto' }}>Leaderboard</h1>
            </div>
            <Link to={routes.QUIZ_ARCHIVE} style={{ textDecoration: 'none', float: 'right', marginTop: 'auto', marginBottom: 'auto'}}>
              <Button variant="contained" color="primary">Build Your Score</Button>
            </Link>
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={415}>
          <div className="leaderboard-header">
            <img src={logo} alt="politIQ" style={{ height: '10vh'}}/>
            <h1 style={{ marginTop: 'auto', marginBottom: 'auto' }}>Leaderboard</h1>
          </div>
        </MediaQuery>
        <AppBar position="static" color="default" className="leaderboard-tabs">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            fullWidth
          >
            <Tab label="Weekly Leaderboard"/>
            <Tab label="Monthly Leaderboard" />
          </Tabs>
        </AppBar>
        <Paper>
            <Tab onClick={this.handleChange} style={{ display: 'none'}}>Weekly Leaderboard</Tab>
            <Tab onClick={this.handleChange} style={{ display: 'none'}}>Monthly Leaderboard</Tab>
          {this.state.value === 0 ? <WeeklyLeaderboard /> : null }
          {this.state.value === 1 ? <MonthlyLeaderboard /> : null }
        </Paper>
        <div style={{ marginTop: '3vh', marginBottom: '5vh', marginLeft: '-2vw'}}>
          <Scoreboard />
        </div>
        </Paper>
      )
  }
}

export default Leaderboard;
