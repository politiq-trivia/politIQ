import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MediaQuery from 'react-responsive';
import { compose } from 'recompose'

import { withAuthorization, withEmailVerification, withAuthentication } from '../Auth/index';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

import * as routes from '../../constants/routes';

import './leaderboard.css';
import WeeklyLeaderboard from './Weekly';
import MonthlyLeaderboard from './Monthly';
import BarChart from './ScoreChart/BarChart';
import HighestScore from './HighestScore';

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  }

  handleChangeIndex = index => {
    this.setState({ value: index });
  }

  userRanking = (ranking) => {
    this.setState({ ranking })
  }
  render() {
    return (
        <Paper className="leaderboard">
          <Helmet>
            <title>Leaderboard | politIQ</title>
          </Helmet>
          <MediaQuery minWidth={416}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: 'auto'}}>
              <Link to={routes.HOME} style={{ textDecoration: 'none', float: 'left', marginTop: 'auto', marginBottom: 'auto'}}>
                <Button variant="contained" color="primary" style={{ width: '17vw' }}>Home</Button>
              </Link>
              <div className="leaderboard-header" style={{ height: '10vh' }}>
                <h1 style={{ margin: 'auto' }}>Leaderboard</h1>
              </div>
              <Link to={routes.QUIZ_ARCHIVE} style={{ textDecoration: 'none', float: 'right', marginTop: 'auto', marginBottom: 'auto'}}>
                <Button variant="contained" color="primary" style={{ width: '17vw' }}>Build Your Score</Button>
              </Link>
            </div>
          </MediaQuery>
          <MediaQuery maxWidth={415}>
            <div className="leaderboard-header">
              <h1 style={{ margin: 'auto' }}>Leaderboard</h1>
            </div>
          </MediaQuery>
          <AppBar position="static" color="default" className="leaderboard-tabs">
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Weekly Leaderboard"/>
              <Tab label="Monthly Leaderboard" />
            </Tabs>
          </AppBar>
          <Paper>
              <Tab onClick={this.handleChange} style={{ display: 'none'}} label="Weekly Leaderboard"></Tab>  
              <Tab onClick={this.handleChange} style={{ display: 'none'}} label="Monthly Leaderboard"></Tab>
            {this.state.value === 0 ? <WeeklyLeaderboard /> : null }
            {this.state.value === 1 ? <MonthlyLeaderboard /> : null }
          </Paper>

          <div style={{ marginTop: '3vh', marginBottom: '5vh', marginLeft: '-2vw'}}>
            <BarChart timeFrame={this.state.value === 0 ? "week" : "month"} />
            <HighestScore timeFrame={this.state.value === 0 ? "week" : "month"}/>
          </div>
          </Paper>
      )
  }
}

const condition = authUser => {
  return !!authUser;
}

export default compose(
  // withEmailVerification,
  withAuthentication,
  withAuthorization(condition)
)(Leaderboard);
