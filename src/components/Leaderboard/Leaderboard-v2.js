import React, { Component } from 'react';
import moment from 'moment';
import MediaQuery from 'react-responsive';
import VerifiedUser from '@material-ui/icons/VerifiedUser';

import { getPolitIQ } from '../../utils/calculatePolitIQ';
import { getThisMonthScores } from '../../utils/storeScoreData';
import { db } from '../../firebase';
import PolitIQBar from './PolitIQBar';
import BarChart from './ScoreChart/BarChart.1';
import LastLeaders from './LastLeaders-v2';
import './leaderboard2.css';

class Leaderboardv2 extends Component {
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
        }
    }

    componentDidMount() {
        if (localStorage.hasOwnProperty('authUser')) {
            const userInfo = JSON.parse(localStorage.getItem('authUser'))
            this.getMyPolitIQ(userInfo.uid, 'month')
            this.setState({
                displayName: userInfo.displayName,
                uid: userInfo.uid,
                affiliation: userInfo.affiliation,
                invisibleScore: userInfo.invisibleScore,
            })
        }

        this.initLeaderboard()
    }

    initLeaderboard = async () => {
        const data = await getThisMonthScores()
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
              if (invisibleScore) { return; }
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
        if (localStorage.hasOwnProperty('authUser')) {
          const scores = this.state.rankedScores
          const uid = JSON.parse(localStorage.getItem('authUser')).uid
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
                <div className="leaderboard-object" key={i}>
                <p className="leaderboard-num">{i + 1}</p>
                <div className="content">
                    <PolitIQBar percentage={stat[3]}/>
                    <div className="leader-info">
                        <p>{stat[0]}</p>
                        <p className="score">{stat[1]}</p>
                    </div>
                </div>
            </div>
            )
        })

        let rank;
        if (this.state.rankedScores && !this.state.invisibleScore) {
          rank = this.getUserRank()
        } else {
          rank = "--"
        }

        return (
            <div className="leaderboard-holder">
                <div className="leaderboard-left">
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
                          <p className="leader-see-more" onClick={this.showLastLeaders}>Past leaders --></p>
                        </div>
                      </>
                    : <>
                        {this.state.showLastLeaders 
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
                                <p className="leader-see-more" onClick={this.showLastLeaders}>&lt;-- Past leaders</p>
                                <p className="leader-see-more" onClick={this.showPartyLeaders}>Party leaders --></p>
                              </div>
                          </>
                        }
                      </>
                  }

                  </MediaQuery>

                    <MediaQuery minWidth={416}>
                      {this.state.viewLastMonth
                        ? <>
                            <BarChart timeFrame={this.state.weekly ? "week" : "month" }/>
                            <p onClick={this.toggleLastMonth}>View past leaders --></p>

                          </>
                        : <>
                            <LastLeaders timeFrame={this.state.weekly ? "Week" : "Month" }/>
                            <p onClick={this.toggleLastMonth}>View party leaders --></p>
                          </>
                      }
                    </MediaQuery>
                </div>
                <div className="leaderboard-right">
                    <div className="leaderboard-tabs">
                        <p onClick={this.toggleWeekly} className={this.state.weekly ? "weekly" : "weekly selected" }>Monthly</p>
                        <p onClick={this.toggleWeekly} className={this.state.weekly ? "weekly selected" : "weekly" }>Weekly</p>
                    </div>
                    {renderMonthlyLeaders}
                    {this.state.isLoaded
                      ? <div className="pagination">
                          <p className={this.state.n - 5 < 0 ? "p-item p-disabled" : "p-item"} onClick={this.state.n - 5 < 0 ? null : this.pageDown}> &lt;&lt; Prev</p>
                          <p className={this.state.n + 5 >= this.state.nMax ? "p-item p-disabled" : "p-item"} onClick={this.state.n + 5 >= this.state.nMax ? null : this.pageUp}>Next >></p>
                        </div>
                      : null
                    }
                </div>
            </div>
        )
    }
}

export default Leaderboardv2;