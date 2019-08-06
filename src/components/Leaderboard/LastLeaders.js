import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { db } from '../../firebase';
import { getPolitIQ } from '../../utils/calculatePolitIQ';
import LoadingGif from '../../6.gif';
import './leaderboard2.css';

class LastLeaders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            error: false,
        }
    }

    componentDidMount () {
        this.init()
    }

    componentDidUpdate (prevProps, prevState) {
        if(prevProps.timeFrame !== this.props.timeFrame) {
            this.setState({
                loaded: false,
            })
            this.getLastLeaders(this.state.data, this.props.timeFrame)
            return true;
        } else return false;
    }

    init = async () => {
        let data = {}
        if (localStorage.hasOwnProperty('allScores')) {
            data = JSON.parse(localStorage.getItem('allScores'))
        } else {
            let lastMonthScores = []
            await db.getScores()
                .then(response => {
                    const scoreData = response.val()

                    if (scoreData === null) {
                        return 'No scores available'
                    }

                    const usernames = Object.keys(scoreData)
                    usernames.forEach((user,i) => {
                        const dates = Object.keys(scoreData[usernames[i]])

                        for (let j = 0; j < dates.length; j ++) {
                            if (dates[j] <= moment().startOf('month').format('YYYY-MM-DDTHH:mm') && dates[j] >= moment().startOf('month').subtract(1, 'month').format('YYYY-MM-DDTHH:mm') && dates[j] !== 'submitted') {
                                lastMonthScores.push({user, data: scoreData[usernames[i]]})
                                return;
                            }
                        }
                    })
                }).then(() => {
                    data = {
                        data: lastMonthScores,
                    }
                })
        }
        this.getLastLeaders(data, this.props.timeFrame)
        this.setState({ data })
    }

    getLastLeaders = async (data, timeFrame) => {
        let userScores = [];
        if (data === null || data === undefined) {
            this.setState({
                loaded: true,
                error: true
            })
            return;
        }

        for (let i = 0; i < data.data.length; i++) {
            const quizDates = Object.keys(data.data[i].data)
            let submitted;

            if (quizDates[quizDates.length - 1] === 'submitted') {
                submitted = data.data[i].data['submitted']
                quizDates.pop()
            }
            
            let month = []
            let scoreCounter = 0;
            for (let j = 0; j < quizDates.length; j++) {
                if (quizDates[j] < moment().startOf(timeFrame).format('YYYY-MM-DDTHH:mm') && quizDates[j] > moment().startOf(timeFrame).subtract(1, timeFrame).format('YYYY-MM-DDTHH:mm')) {
                    month.push(quizDates[j])
                    if (data.data[i].data[quizDates[j]]) {
                        scoreCounter += data.data[i].data[quizDates[j]]
                    }
                }
            }

            let submittedScoreCounter = 0;
            if (submitted !== undefined) {
                const dates = Object.keys(submitted)
                for (let k = 0; k < dates.length; k++) {
                    if (dates[k] > moment().startOf(timeFrame).format('YYYY-MM-DDTHH:mm') && dates[k] > moment().startOf(timeFrame).subtract(1, timeFrame).format('YYYY-MM-DDTHH:mm')) {
                        submittedScoreCounter += 1
                    }
                }
            }

            // if the score is greater than zero, then put them in the ranking process along with ONLY
            // their uid for now - can get the rest later once we have the top 3 leaders
            if (scoreCounter > 0) {
                userScores.push({
                    uid: data.data[i].user,
                    score: scoreCounter,
                    submittedScore: submittedScoreCounter,
                })
            }
        }

        const rankedScores = userScores.sort(function(a,b) {
            return a.score - b.score
        })

        const rankReverse = rankedScores.reverse().slice(0,3)

        // get the displaynames and politIQs for the top 3
        const updatedRanks = await this.getUserInfo(rankReverse, timeFrame)

        for (let n = 0; n < rankReverse.length; n++) {
            await this.getPolitIQ(rankReverse[n].uid, timeFrame)
            .then(politIQ => {
                rankReverse[n].politIQ = politIQ + rankReverse[n].submittedScore
            })
        }


        this.setState({
            loaded: true,
            rankReverse: updatedRanks
        })

    }

    getPolitIQ = async (uid, timeframe) => {
        const politIQ = await getPolitIQ(uid, timeframe)
        return politIQ
    }

    getUserInfo = async (array, timeFrame) => {
        for (let n = 0; n < array.length; n++) {
            const displayName = await db.getOnlyDisplayNames(array[n].uid)
            array[n].username = displayName
        }

        return array;
    } 

    handleClickUser = (uid) => {
        this.props.history.push(`/profile/${uid}`)
    }
    renderTable = () => {
        const data = this.state.rankReverse
        const rows = data.map((d, i) => {
            return (
                <div key={i} onClick={() => this.handleClickUser(d.uid)} className="leader-row">
                    <p>
                        {i + 1}.
                    </p>
                    <p>
                        {d.username}
                    </p>
                    <p>
                        {d.score}
                    </p>
                </div>
            )
        })

        return rows;
    }

    render() {
        return (
            <div className={this.props.nonLoggedIn? "lastLeadersBox2 non-logged" : "lastLeadersBox2"}>
                {this.props.noScores ? <h2 style={{ color: 'gray' }} >Last {this.props.timeFrame}'s Leaders</h2> : <h2>Last {this.props.timeFrame}'s Leaders</h2> }
                {this.state.loaded && !this.state.error
                    ? <>
                        <div className="lastLeadersHeader">
                            <p>Rank</p>
                            <p>Username</p>
                            <p>Score</p>
                        </div>
                        {this.renderTable()}
                      </>
                    : <img src={LoadingGif} alt="loading" style={{ maxWidth: '100%' }}/>
                }
            </div>
        )
    }
}

export default withRouter(LastLeaders);