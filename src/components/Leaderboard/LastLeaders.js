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
        for (let n = 0; n < rankReverse.length; n++) {
            const userData = await db.getDisplayNames(rankReverse[n].uid)
            userData.displayName.then(function(name) {
                rankReverse[n].username = name
            })
            this.getPolitIQ(rankReverse[n].uid, timeFrame)
            .then(politIQ => {
                rankReverse[n].politIQ = politIQ + rankReverse[n].submittedScore
            })
        }

        this.setState({
            loaded: true,
            rankReverse,
        })
    }

    getPolitIQ = async (uid, timeframe) => {
        const politIQ = await getPolitIQ(uid, timeframe)
        return politIQ
    }

    handleClickUser = (uid) => {
        this.props.history.push(`/profile/${uid}`)
    }

    renderTable = () => {
        const colorArray = ["#f44336", "#e91e63", "#9c27b0", "#3f51b5", "#2196f3", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800"]
        const data = this.state.rankReverse
        const rows = data.map((d, i) => {
            const random = Math.floor(Math.random() * colorArray.length)
            return (
                <TableRow key={i} hover onClick={() => this.handleClickUser(d.uid)}>
                    <TableCell padding="default">
                        {i + 1}.
                    </TableCell>
                    <TableCell style={{ padding: '0 10px 0 0' }}>
                        {d.username ? <Avatar style={{ backgroundColor: colorArray[random], marginRight:'1%' }}>{d.username.charAt(0)}</Avatar> : null }
                    </TableCell>
                    <TableCell padding="none">
                        {d.username ? d.username : null}
                    </TableCell>
                    <TableCell>
                        {d.score}
                    </TableCell>
                    <TableCell>
                        {d.politIQ}
                    </TableCell>
                </TableRow>
            )
        })

        return rows;
    }

    render() {
        return (
            <Paper className="lastLeadersBox">
                <h2>Last {this.props.timeFrame}'s Leaders</h2>
                {this.state.loaded && !this.state.error
                    ? <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="none" style={{ paddingLeft: '10px', paddingRight: "0", maxWidth: '30px' }}>
                                        Ranking
                                    </TableCell>
                                    <TableCell padding="none">
                                        User
                                    </TableCell>
                                    <TableCell padding="none" />
                                    <TableCell padding="none">
                                        Score
                                    </TableCell>
                                    <TableCell padding="none">
                                        PolitIQ
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rankReverse ? this.renderTable() : null}
                            </TableBody>
                        </Table>
                      </>
                    : null
                }
            </Paper>
        )
    }
}

export default withRouter(LastLeaders);