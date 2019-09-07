import React, { Component } from 'react';
import moment from 'moment';
import MediaQuery from 'react-responsive';
import Helmet from 'react-helmet';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import { getPolitIQ } from '../../utils/calculatePolitIQ';
import { getThisMonthScores } from '../../utils/storeScoreData';
import { db } from '../../firebase';
import PolitIQBar from './PolitIQBar';
import BarChart from './ScoreChart/BarChart.1';
import LastLeaders from './LastLeaders';
import { QUIZ_ARCHIVE } from '../../constants/routes';
import AuthUserContext from '../Auth/AuthUserContext';
import './leaderboard2.css';

class LeaderboardWithContext extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayName: "",
            affiliation: "",
            uid: "",
            politIQ: "",
            weekly: false,
            viewLastMonth: true,
            showPartyLeaders: false,
            showLastLeaders: false,
            showUserScores: true,
            n: 0,
            isLoaded: false,
            noScores: false,
        }
    }

    componentDidMount() {
        if (this.props.authUser) {
            const userInfo = this.props.authUser
            this.getMyPolitIQ(userInfo.uid, 'month')
            this.setState({
                displayName: userInfo.displayName,
                uid: userInfo.uid,
                affiliation: userInfo.affiliation,
                invisibleScore: userInfo.invisibleScore,
            })
        } else {
          this.setState({
            showPartyLeaders: true,
            showLastLeaders: false,
            showUserScores: false,
          })
        }

        this.initLeaderboard()
    }

    initLeaderboard = async () => {
        const data = await getThisMonthScores()
        if (data.length === 0) {
          this.setState({
            noScores: true,
            isLoaded: true,
          });
          return;
        }
        this.monthlyLeaders(data, 'month')
        this.setState({ data })

      }

    getMyPolitIQ = async (uid, timeframe) => {
        let iq = await getPolitIQ(uid, timeframe)
        if (isNaN(iq)) {
          this.setState({
            politIQ: 0
          })
        } else {
          this.setState({
            politIQ: iq,
          })
        }
    }

    monthlyLeaders = async (data, timeframe) => {
        const userScores = []
    
        // handle an empty response
        if (data === null || data === undefined) {
          window.clearTimeout(this.timeout)
          this.setState({
            isLoaded: true,
          })
          return;
        }
        
        let usernames = [];
        for (let k = 0; k < data.length; k++) {
          usernames.push(data[k].user)
        }
    
        // check if that user wants their score included in the leaderboard
        usernames.forEach(async (user, i) => {
          const userData = await db.getDisplayNames(usernames[i])
          userData.displayName.then((displayName) => {
            userData.invisibleScore.then((invisibleScore) => {
              const quizDates = Object.keys(data[i].data)
    
                let submitted;
                if(quizDates[quizDates.length - 1] === 'submitted') {
                  submitted = data[i].data["submitted"]
                  quizDates.pop()
                }
                let lastMonth = []
                let scoreCounter = 0;
                for (let j = 0; j < quizDates.length; j++) {
                  if (quizDates[j] > moment().startOf(timeframe).format('YYYY-MM-DD')) {
                    lastMonth.push(quizDates[j])
                    if (data[i].data[quizDates[j]]) {
                      scoreCounter += data[i].data[quizDates[j]]
                    }
                  }
                }
    
                let submittedScoreCounter = 0
                if (submitted !== undefined) {
                  const dates = Object.keys(submitted)
                  for (let j = 0; j < dates.length; j++) {
                    if (dates[j] > moment().startOf(timeframe).format('YYYY-MM-DDTHH:mm')) {
                      submittedScoreCounter += 1
                    }
                  }
                }

                if (invisibleScore) { 
                  console.log(userData, 'this one is not being shown')
                  this.setState({
                    userScore: scoreCounter,
                  })
                  return; 
                }
                      
                if (scoreCounter > 0) {
                  this.getPolitIQ(user, timeframe)
                    .then(politIQ => {
                      userScores.push({
                        username: displayName,
                        score: scoreCounter,
                        uid: user,
                        politIQ: politIQ + submittedScoreCounter
                      })
    
                      const rankedScores = userScores.sort(function(a,b){
                        return a.score - b.score
                      })
    
                      const rankReverse = rankedScores.reverse()
                        this.setState({
                          rankedScores: rankReverse,
                          isLoaded: true,
                          nMax: rankReverse.length
                        })
                        window.clearTimeout(this.timeout)
                    })
                }
            })
          })
        }
      );
    }

    getPolitIQ = async (uid, timeframe) => {
        const politIQ = await getPolitIQ(uid, timeframe)
        return politIQ
    }

    getUserRank = () => {
      if (this.state.isLoaded) {
        if (this.props.authUser) {
          const scores = this.state.rankedScores
          const uid = this.props.authUser.uid
          let ranking = "--"
          let score = "--"
          for (let i = 0; i < scores.length; i++) {
            if (uid === scores[i].uid) {
              ranking = i + 1;
              score = scores[i].score
            }
          }
          return {ranking, score};
        }
      }
    }

    toggleWeekly = (event) => {
        event.preventDefault()
        if (this.state.weekly) {
          this.monthlyLeaders(this.state.data, "month")
        } else {
          this.monthlyLeaders(this.state.data, "week")
        }
        this.setState({ 
            weekly: !this.state.weekly,
            n: 0,
        })
    }

    toggleLastMonth = (event) => {
      event.preventDefault()
      this.setState({
        viewLastMonth: !this.state.viewLastMonth,
      })
    }

    showPartyLeaders = () => {
      this.setState({
        showPartyLeaders: true,
        showLastLeaders: false,
        showUserScores: false,
      })
    }

    showLastLeaders = () => {
      // for mobile - since we have three views instead of just two
      this.setState({
        showLastLeaders: true,
        showPartyLeaders: false,
        showUserScores: false,
      })
    }

    showUserScores = () => {
      this.setState({
        showLastLeaders: false,
        showPartyLeaders: false,
        showUserScores: true,
      })
    }

    pageUp = () => {
      this.setState({
        n: this.state.n + 5,
      })
    }

    pageDown = () => {
      this.setState({
        n: this.state.n - 5,
      })
    }

    handleClickUser = (uid) => {
      this.props.history.push(`/profile/${uid}`)
    }
    
    render() {
        let rankingArray = [];
        if (Array.isArray(this.state.rankedScores)) {
          const ranking = this.state.rankedScores;
          const result = ranking.map((stat, i) => {
            return [stat.username, stat.score, stat.uid, stat.politIQ]
          });
          rankingArray = [...result]
        }

        let n = this.state.n;

        const renderMonthlyLeaders = rankingArray.map((stat, i) => {
            if (i < n || i >= n + 5) { return null; }
            return (
                <div className="leaderboard-object" key={i} onClick={() => this.handleClickUser(stat[2]) }>
                  <p className="leaderboard-num">{i + 1}</p>
                  <div className="content">
                      <PolitIQBar percentage={stat[3]}/>
                      <div className="leader-info">
                          <p>{stat[0]}</p>
                          <p style={{ textAlign: 'center' }}>PolitIQ: <span style={{ fontWeight: 'bold' }}>{stat[3]}</span></p>
                          <p style={{ textAlign: 'right' }}>Score: <span style={{ fontWeight: 'bold' }}>{stat[1]}</span></p>
                      </div>
                    </div>
                </div>
            )
        })

        let rank;
        if (this.state.rankedScores && !this.state.invisibleScore) {
          rank = this.getUserRank()
        } else if (this.state.invisibleScore) {
          rank = {
            score: this.state.userScore,
            ranking: "--",
          }
        } else {
          rank = "--"
        }

        return (
          <>
            <Helmet>
              <title>Leaderboard | politIQ trivia</title>
            </Helmet>
            <div className="banner">
              {this.state.weekly 
                ? <p>Weekly leader receives $5!</p>
                : <p>Monthly leader of each party eligible to compete for $50!</p>
              }
            </div>
            <div className="leaderboard-holder">
                <div className="leaderboard-left">
                  {this.state.uid !== "" ? 
                    <>
                      <MediaQuery minWidth={416}>
                        <div className="leader-user-info">
                          <VerifiedUser size={40}/>
                          <h2>{this.state.displayName}</h2>
                          <h4>{this.state.affiliation}</h4>
                        </div>
                        <div className="leader-user-stats">
                          <div className="stat-rank">
                            <p>Rank</p>
                            <h3>{rank !== "--" ? rank.ranking : "--" }</h3>
                          </div>
                          <div className="stat-month">
                            <p>Score</p>
                            <h3>{rank !== "--" ? rank.score : "--"}</h3>
                          </div>
                          <div className="stat-politIQ">
                            <p>PolitIQ</p>
                            <h3>{this.state.politIQ}</h3>
                          </div>
                        </div>
                      </MediaQuery>

                      <MediaQuery maxWidth={415}>

                      {this.state.showPartyLeaders 
                        ? <>
                            <BarChart timeFrame={this.state.weekly ? "week" : "month" }/>
                            <div className="leader-link-holder">
                              <p className="leader-see-more" onClick={this.showUserScores} style={{ marginLeft: '4vw', textAlign: 'left' }}>&lt;-- Your scores</p>
                              {!this.state.noScores ? <p className="leader-see-more" onClick={this.showLastLeaders}>Past leaders --></p> : null }
                            </div>
                          </>
                        : <>
                            {this.state.showLastLeaders && !this.state.noScores
                              ? <>
                                  <LastLeaders timeFrame={this.state.weekly ? "Week" : "Month" }/>
                                  <div className="leader-link-holder">
                                    <p className="leader-see-more" onClick={this.showPartyLeaders} style={{ marginLeft: '4vw', textAlign: 'left' }}>&lt;-- Party leaders</p>
                                    <p className="leader-see-more" onClick={this.showUserScores}>Your scores --></p>
                                  </div>
                                </>
                            : <>
                                <div className="leader-user-info">
                                    <VerifiedUser size={40}/>
                                    <h2>{this.state.displayName}</h2>
                                    <h4>{this.state.affiliation}</h4>
                                  </div>
                                  <div className="leader-user-stats">
                                    <div className="stat-rank">
                                      <p>Rank</p>
                                      <h3>{rank !== "--" ? rank.ranking : "--"}</h3>
                                    </div>
                                    <div className="stat-month">
                                      <p>Score</p>
                                      <h3>{rank !== "--" ? rank.score : "--"}</h3>
                                    </div>
                                    <div className="stat-politIQ">
                                      <p>PolitIQ</p>
                                      <h3>{this.state.politIQ}</h3>
                                    </div>
                                  </div>

                                  <div className="leader-link-holder">
                                    {!this.state.noScores ? <p className="leader-see-more" onClick={this.showLastLeaders}>&lt;-- Past leaders</p> : null }
                                    <p className="leader-see-more" onClick={this.showPartyLeaders}>Party leaders --></p>
                                  </div>
                              </>
                            }
                          </>
                      }

                      </MediaQuery>

                        <MediaQuery minWidth={416}>
                          {this.state.showLastLeaders && !this.state.noScores
                            ? <>
                                <LastLeaders timeFrame={this.state.weekly ? "Week" : "Month" }/>
                                <p onClick={this.showPartyLeaders}>View party scores --></p>
                              </>
                            : <>
                                <BarChart timeFrame={this.state.weekly ? "week" : "month" }/>
                                {!this.state.noScores ? <p onClick={this.showLastLeaders}>View past leaders --></p> : null }
                              </>
                          }
                        </MediaQuery>
                      </>

                    : <>
                        <h1>PolitIQ Leaders</h1> 

                        <MediaQuery minWidth={416}>
                          <BarChart timeFrame={this.state.weekly ? "week" : "month" }/>
                          <LastLeaders timeFrame={this.state.weekly ? "Week" : "Month"} nonLoggedIn={true}/>
                        </MediaQuery>
                        <MediaQuery maxWidth={415}>
                          {!this.state.showLastLeaders 
                            ? <>
                                <BarChart timeFrame={this.state.weekly ? "week" : "month" } />
                                <p onClick={this.showLastLeaders}>View past leaders --></p>
                              </>
                            : <>
                                <LastLeaders timeFrame={this.state.weekly ? "Week" : "Month" }/>
                                <p onClick={this.showPartyLeaders}>View party scores --></p>

                            
                              </>
                          }


                        </MediaQuery>

                      </>
                  }
                </div>
                <div className="leaderboard-right">
                  <div className="leaderboard-tabs">
                    <p onClick={this.toggleWeekly} className={this.state.weekly ? "weekly" : "weekly selected" }>Monthly</p>
                    <p onClick={this.toggleWeekly} className={this.state.weekly ? "weekly selected" : "weekly" }>Weekly</p>
                  </div>
                    {this.state.noScores
                      ? <div style={{ textAlign: 'center', paddingTop: '2vh' }}>
                          <h2 id="noScores">No Scores Available for this {this.state.weekly ? 'Week' : 'Month' } Yet!</h2>
                          <LastLeaders timeFrame={this.state.weekly ? 'Week' : 'Month' } noScores={this.state.noScores} />
                          <Link to={QUIZ_ARCHIVE} style={{ textDecoration: 'none' }}><Button variant="contained" color="primary" style={{ marginTop: '3vh', marginBottom: '3vh' }}>View Past Quizzes</Button></Link>
                        </div>
                      : <>

                          {renderMonthlyLeaders}
                          {this.state.isLoaded
                            ? <div className="pagination">
                                <p className={this.state.n - 5 < 0 ? "p-item p-disabled" : "p-item"} onClick={this.state.n - 5 < 0 ? null : this.pageDown}> &lt;&lt; Prev</p>
                                <p className={this.state.n + 5 >= this.state.nMax ? "p-item p-disabled" : "p-item"} onClick={this.state.n + 5 >= this.state.nMax ? null : this.pageUp}>Next >></p>
                              </div>
                            : null
                          }
                        </>
                    }

                </div>
            </div>
          </>
        )
    }
}

const Leaderboardv2 = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <LeaderboardWithContext authUser={authUser} />
    )}
  </AuthUserContext.Consumer>
)

export default Leaderboardv2;