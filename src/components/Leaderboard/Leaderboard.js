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
import Toolbar from '@material-ui/core/Toolbar';

import * as routes from '../../constants/routes';

import './leaderboard.css';
import WeeklyLeaderboard from './Weekly';
import MonthlyLeaderboard from './Monthly';
import BarChart from './ScoreChart/BarChart';
import HighestScore from './HighestScore';
import LastLeaderboard from './LastLeaders';
import { getThisMonthScores } from '../../utils/storeScoreData';

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    }
  }

  componentDidMount () {
    this.initLeaderboard()
  }

  initLeaderboard = async () => {
    const data = await getThisMonthScores()
    this.setState({ data })
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
      <>
        <AppBar position="static" className="leaderboard-appbar" style={{ marginTop: '8vh', background: 'linear-gradient(to top, rgba(239,188,77,1) 0%, rgba(239,188,77,1) 24%, rgba(244,207,126,1) 50%, rgba(255,244,219,1) 100%)', color: 'black', position: 'fixed', top: '0', zIndex: '100'}}>
          <Toolbar className="leaderboard-banner-text">
            {this.state.value === 0 
              ? "Monthly leader of each party eligible to compete for $50!"
              : "Weekly leader receives $10!"
            }
          </Toolbar>
        </AppBar>
        <Paper className="leaderboard">
          <Helmet>
            <title>Leaderboard | politIQ trivia</title>
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
                <Button variant="contained" color="primary" style={{ width: '17vw' }}>Keep Playing</Button>
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
              <Tab label="Monthly Leaderboard" />
              <Tab label="Weekly Leaderboard"/>
            </Tabs>
          </AppBar>
          <Paper>
              <Tab onClick={this.handleChange} style={{ display: 'none'}} label="Monthly Leaderboard"></Tab>
              <Tab onClick={this.handleChange} style={{ display: 'none'}} label="Weekly Leaderboard"></Tab>  
            {this.state.value === 0 ? <MonthlyLeaderboard data={this.state.data}/> : null }
            {this.state.value === 1 ? <WeeklyLeaderboard data={this.state.data}/> : null }

          </Paper>

          <div style={{ marginTop: '3vh', marginBottom: '5vh', marginLeft: '-2vw'}}>
            <div className="leaderbox-holder">
              <HighestScore timeFrame={this.state.value === 0 ? "month" : "week"}/>
              <LastLeaderboard timeFrame={this.state.value === 0 ? 'Month' : 'Week' }/>
            </div>
            <BarChart timeFrame={this.state.value === 0 ? "month" : "week"} />
          </div>
          </Paper>
        </>
      )
  }
}

// const condition = authUser => {
//   return !!authUser;
// }

// export default compose(
//   // withEmailVerification,
//   withAuthentication,
//   withAuthorization(condition)
// )(Leaderboard);

export default Leaderboard;
