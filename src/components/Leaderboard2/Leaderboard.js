import React, { useState, useContext, useEffect } from 'react';

import PolitIQBar from "./PolitIQBar"

import VerifiedUser from '@material-ui/icons/VerifiedUser';
import { NavLink } from 'react-router-dom';

import LoadingGif from '../../6.gif';

import AuthUserContext from '../Auth/AuthUserContext';
import PolBarChart from "./barChart"

import useLeaderboard from '../../hooks/useLeaderboard'

import Marquee from "./marquee"
import "./leaderboard.css"
import { db } from '../../firebase';
var flattenObject = function (ob) {
    var toReturn = {};

    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object') {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}
const Leaderboard = () => {
    const [showChart, setShowChart] = useState(true)
    const [timeframe, setTimeframe] = useState("Month")
    const [authUserScore, setAuthUserScore] = useState(null)

    const authUser = useContext(AuthUserContext)

    const { politIQs, affiliationScores, monthlyScores, weeklyScores, lastWeekScores, lastMonthScores } = useLeaderboard()

    useEffect(() => {
        if (authUser) {
            const getAuthUserScore = async () => {
                db.getScoresByUid(authUser.uid).then(res => { return res.val() }).then(val => {

                    setAuthUserScore(Object.values(flattenObject(val)).reduce((a, b) => a + b, 0))
                })
            }
            getAuthUserScore()
        }

    }, authUser)


    const lastLeaders = (timeframe) => {
        if (timeframe === "Month") {
            return (
                <div className={"lastLeadersBox2"} >
                    <h2>Last {timeframe}'s Leaders</h2>

                    <div className="lastLeadersHeader">
                        <p>Rank</p>
                        <p>Username</p>
                        <p>Score</p>
                    </div>
                    {lastMonthScores.map((d, i) => {
                        return (
                            <NavLink style={{ textDecoration: 'none', color: 'white' }} to={`/profile/${d.uid}`}>
                                <div key={i} className="leader-row">
                                    <p>
                                        {i + 1}.
                                    </p>
                                    <p>
                                        {d.displayName}
                                    </p>
                                    <p>
                                        {d.lastMonthScore}
                                    </p>
                                </div>
                            </NavLink>
                        )

                    }
                    )
                    }
                </div >
            )
        }
        if (timeframe === "Week") {
            return (
                <div className={"lastLeadersBox2"} >
                    <h2>Last {timeframe}'s Leaders</h2>

                    <div className="lastLeadersHeader">
                        <p>Rank</p>
                        <p>Username</p>
                        <p>Score</p>
                    </div>
                    {lastWeekScores.map((d, i) => {
                        return (
                            <NavLink style={{ textDecoration: 'none', color: 'white' }} to={`/profile/${d.uid}`}>
                                <div key={i} className="leader-row">
                                    <p>
                                        {i + 1}.
                                    </p>
                                    <p>
                                        {d.displayName}
                                    </p>
                                    <p>
                                        {d.lastWeekScore}
                                    </p>
                                </div>
                            </NavLink>
                        )

                    }
                    )
                    }
                </div >
            )
        }

    }

    const authUserStats = () => {
        if (authUser === null) {
            return (<div className="leader-user-stats">
                <div className="stat-month">
                    <p>All-time Score</p>
                    <h3>N/A</h3>
                </div>
                <div className="stat-politIQ">
                    <p>PolitIQ</p>
                    <h3>N/A</h3>
                </div>
            </div>)
        } else {
            if (timeframe === "Week") {
                return (<div className="leader-user-stats">
                    <div className="stat-month">
                        <p>All-time Score</p>
                        <h3>{authUserScore}</h3>
                    </div>
                    <div className="stat-politIQ">
                        <p>PolitIQ</p>
                        <h3>{politIQs && politIQs[authUser.uid]}</h3>
                    </div>
                </div>)
            }
            if (timeframe === "Month") {
                return (<div className="leader-user-stats">
                    <div className="stat-month">
                        <p>All-time Score</p>
                        <h3>{authUserScore}</h3>
                    </div>
                    <div className="stat-politIQ">
                        <p>PolitIQ</p>
                        <h3>{politIQs && politIQs[authUser.uid]}</h3>
                    </div>
                </div>)
            }
        }

    }

    const renderLeaders = timeframe => {   // Creates teh leaders object based on 
        if (timeframe === "Month") {
            var scoreTotal = monthlyScores.reduce(function (prev, cur) { // total weekly score
                return prev + cur.monthlyScore;
            }, 0);
            if (scoreTotal === 0) { return <div className="container" style={{ marginTop: "20px" }}><center>No Monthly Scores Available Yet</center></div> } else {  // if there are no scores avaialble 
                return (monthlyScores.map((d, i) => {
                    if (d.monthlyScore === 0) {
                        return (<div></div>)
                    } else {
                        return (<div key={i} className="leaderboard-object"  >
                            <p className="leaderboard-num">{i + 1}</p>

                            <div className="content">
                                <NavLink style={{ textDecoration: 'none' }} to={`/profile/${d.uid}`}>

                                    <PolitIQBar percentage={d.politIQ} />
                                    <div className="leader-info">
                                        <p>{d.displayName}</p>
                                        <p style={{ textAlign: 'center' }}>PolitIQ: <span style={{ fontWeight: 'bold' }}>{d.politIQ}</span></p>
                                        <p style={{ textAlign: 'right' }}>Score: <span style={{ fontWeight: 'bold' }}>{d.monthlyScore}</span></p>
                                    </div>
                                </NavLink>

                            </div>

                        </div>
                        )
                    }
                }
                ))
            }

        }
        if (timeframe === "Week") {
            var scoreTotal = weeklyScores.reduce(function (prev, cur) { // total weekly score
                return prev + cur.weeklyScore;
            }, 0);
            if (scoreTotal === 0) { return <div className="container" style={{ marginTop: "20px" }}><center>No Weekly Scores Available Yet</center></div> } else {
                return (weeklyScores.map((d, i) => {
                    if (d.weeklyScore === 0) {
                        return (<div></div>)
                    } else {
                        return (<div key={i} className="leaderboard-object"  >
                            <p className="leaderboard-num">{i + 1}</p>
                            <div className="content">
                                <NavLink style={{ textDecoration: 'none' }} to={`/profile/${d.uid}`}>

                                    <PolitIQBar percentage={d.politIQ} />
                                    <div className="leader-info">
                                        <p>{d.displayName}</p>
                                        <p style={{ textAlign: 'center' }}>PolitIQ: <span style={{ fontWeight: 'bold' }}>{d.politIQ}</span></p>
                                        <p style={{ textAlign: 'right' }}>Score: <span style={{ fontWeight: 'bold' }}>{d.weeklyScore}</span></p>
                                    </div>
                                </NavLink>
                            </div>
                        </div>

                        )
                    }
                }
                ))
            }

        }
    }

    const loadingGif = <center style={{ height: "150px" }}><img src={LoadingGif} alt="loading" style={{ maxWidth: '100%' }} /></center>


    return (
        <div>
            <NavLink style={{ textDecoration: 'none', color: "#554E3F" }} to={`/sponsor`}>
                <Marquee />
            </NavLink>
            <div className="leaderboard-holder">
                <div className="leaderboard-left">
                    <div className="leader-user-info">
                        <VerifiedUser size={40} />
                        <h2>{authUser ? (authUser.displayName) : "Sign up and find your PolitIQ!"}</h2>
                        <h4>{authUser ? (authUser.affiliation) : ""}</h4>
                    </div>
                    {authUserStats()}
                    <div className="leader-link-holder">
                    </div>
                    {showChart && affiliationScores ? <PolBarChart politIQs={affiliationScores} /> : lastMonthScores && lastWeekScores && lastLeaders(timeframe)}
                    <center><p className="weekly" onClick={() => setShowChart(!showChart)}  >
                        {!showChart ? "Show Party Scores" : `Show Last ${timeframe}'s Leaders`}
                    </p></center>

                </div>
                <div className="leaderboard-right">
                    <div className="leaderboard-tabs">
                        <p onClick={() => setTimeframe("Month")} className={timeframe === "Week" ? "weekly" : "weekly selected"}>Top Ten Monthly</p>
                        <p onClick={() => setTimeframe("Week")} className={timeframe === "Week" ? "weekly selected" : "weekly"}>Top Ten Weekly</p>
                    </div>
                    {monthlyScores && weeklyScores && renderLeaders(timeframe)}
                </div>
            </div>
        </div>

    )
}


export default Leaderboard;