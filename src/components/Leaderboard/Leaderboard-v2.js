import React, { Component } from 'react';
import moment from 'moment';
import VerifiedUser from '@material-ui/icons/VerifiedUser';

import { getPolitIQ } from '../../utils/calculatePolitIQ';
import { getThisMonthScores } from '../../utils/storeScoreData';
import { db } from '../../firebase';
import PolitIQBar from './PolitIQBar';
import PolitIQCircle from './PolitIQCircle';
import './leaderboard2.css';

class Leaderboardv2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayName: "",
            affiliation: "",
            uid: "",
            politIQ: "",
            weekly: true,
        }
    }

    componentDidMount() {
        if (localStorage.hasOwnProperty('authUser')) {
            const userInfo = JSON.parse(localStorage.getItem('authUser'))
            console.log(userInfo)
            this.getMyPolitIQ(userInfo.uid, 'month')
            this.setState({
                displayName: userInfo.displayName,
                uid: userInfo.uid,
                affiliation: userInfo.affiliation
            })
        }

        this.initLeaderboard()
    }

    initLeaderboard = async () => {
        const data = await getThisMonthScores()
        this.monthlyLeaders(data)
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

    monthlyLeaders = async (data) => {
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
                  if (quizDates[j] > moment().startOf('month').format('YYYY-MM-DD')) {
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
                    if (dates[j] > moment().startOf('month').format('YYYY-MM-DDTHH:mm')) {
                      submittedScoreCounter += 1
                    }
                  }
                }
                      
                if (scoreCounter > 0) {
                  this.getPolitIQ(user, 'month')
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

    toggleWeekly = (event) => {
        event.preventDefault()
        console.log('toggle weekly calle')
        this.setState({ 
            weekly: !this.state.weekly
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

        const renderMonthlyLeaders = rankingArray.map((stat, i) => {
            if (i >= 5) { return null; }
            console.log(stat, 'stat in leaders')
            return (
                <div className="leaderboard-object">
                <p className="leaderboard-num">{i + 1}</p>
                <div className="content">
                    {/* <div className="politiq-bar"></div> */}
                    <PolitIQBar percentage={stat[3]}/>
                    <div className="leader-info">
                        <p>{stat[0]}</p>
                        <p className="score">{stat[1]}</p>
                    </div>
                </div>
            </div>
            )
        })
        return (
            <div className="leaderboard-holder">
                <div className="leaderboard-left">
                    <div className="leader-user-info">
                        <VerifiedUser size={40}/>
                        <h2>{this.state.displayName}</h2>
                        <h4>{this.state.affiliation}</h4>
                    </div>
                    <div className="leader-user-stats">
                        <div className="stat-rank">
                            <p>Rank</p>
                            <h3>540</h3>
                        </div>
                        <div className="stat-month">
                            <p>This Month</p>
                            <h3>17</h3>
                        </div>
                    </div>
                    {/* <div className="politIQ-circle">
                    </div> */}
                    <PolitIQCircle percentage={this.state.politIQ} />
                    <p>View last month's leaders --></p>
                </div>
                <div className="leaderboard-right">
                    <div className="leaderboard-tabs" onClick={(event) =>this.toggleWeekly(event)}>
                        {/* <a onClick={this.toggleWeekly} className="selected">Weekly</a> */}
                        {/* <a onClick={this.toggleWeekly}>Monthly</a> */}
                        <div onClick={(event) =>this.toggleWeekly(event)} className={this.state.weekly === false ? "weekly selected" : "weekly" }><p>Monthly</p></div>
                        <div onClick={(event) => this.toggleWeekly(event)} className={this.state.weekly === true ? "weekly selected" : "weekly"}><p>Weekly</p></div>
                    </div>
                    {renderMonthlyLeaders}
                </div>
            </div>
        )
    }
}

export default Leaderboardv2;