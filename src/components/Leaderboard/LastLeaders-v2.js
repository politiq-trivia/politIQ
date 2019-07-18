import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Avatar from '@material-ui/core/Avatar';

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
        const data = JSON.parse(localStorage.getItem('allScores'))
        this.getLastLeaders(data, this.props.timeFrame)
        this.setState({ data })
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
            <div className="lastLeadersBox2">
                <h2>Last {this.props.timeFrame}'s Leaders</h2>
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