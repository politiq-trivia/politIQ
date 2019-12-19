import React, { useHooks, useEffect, useState, useContext } from 'react';

import PolitIQBar from "./PolitIQBar"
import Button from "@material-ui/core/Button";

import moment from 'moment';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import { NavLink } from 'react-router-dom';

import LoadingGif from '../../6.gif';

import { getPolitIQ } from '../../utils/calculatePolitIQ';
import { QUIZ_ARCHIVE } from '../../constants/routes';
import AuthUserContext from '../Auth/AuthUserContext';
import { useScoresUsers } from "./useScoresUsers"
import PolBarChart from "./barChart"

import Marquee from "./marquee"
import "./leaderboard.css"

const Leaderboard = () => {


    const [showChart, setShowChart] = useState(true)

    const [timeframe, setTimeframe] = useState("Month")
    const authUser = useContext(AuthUserContext)

    const [allRecentScores, politIQs, monthlyScores, weeklyScores, lastWeekScores, lastMonthScores, userRanks, loading] = useScoresUsers() // use a hook to get user scores and data into a data frame



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
                <div className="stat-rank">
                    <p>Rank</p>
                    <h3>N/A</h3>

                </div>
                <div className="stat-month">
                    <p>Score</p>
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
                    <div className="stat-rank">
                        <p>Rank</p>
                        <h3>{userRanks.weekRank}</h3>

                    </div>
                    <div className="stat-month">
                        <p>Score</p>
                        <h3>{allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                            return (userObject.uid == authUser.uid);
                        }).length !== 0 ? (allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                            return (userObject.uid == authUser.uid);
                        })[0].weeklyScore) : 0}</h3>
                    </div>
                    <div className="stat-politIQ">
                        <p>PolitIQ</p>
                        <h3>{allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                            return (userObject.uid == authUser.uid);
                        }).length !== 0 ? (allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                            return (userObject.uid == authUser.uid);
                        })[0].politIQ) : 0}</h3>
                    </div>
                </div>)
            }
            if (timeframe === "Month") {
                return (<div className="leader-user-stats">
                    <div className="stat-rank">
                        <p>Rank</p>
                        <h3>{userRanks.monthRank}</h3>

                    </div>
                    <div className="stat-month">
                        <p>Score</p>
                        <h3>{allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                            return (userObject.uid == authUser.uid);
                        }).length !== 0 ? (allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                            return (userObject.uid == authUser.uid);
                        })[0].monthlyScore) : 0}</h3>
                    </div>
                    <div className="stat-politIQ">
                        <p>PolitIQ</p>
                        <h3>{allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                            return (userObject.uid == authUser.uid);
                        }).length !== 0 ? (allRecentScores.filter(userObject => {   /// filter array for uid that matches user, then find month scored
                            return (userObject.uid == authUser.uid);
                        })[0].politIQ) : 0}</h3>
                    </div>
                </div>)
            }
        }

    }

    const renderLeaders = timeframe => {   // Creates teh leaders object based on 
        if (timeframe === "Month") {
            return (monthlyScores.map((d, i) => {
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
            ))
        }
        if (timeframe === "Week") {
            return (weeklyScores.map((d, i) => {
                return (<div key={i} className="leaderboard-object"  >
                    <p className="leaderboard-num">{i + 1}</p>
                    <div className="content">
                        <PolitIQBar percentage={d.politIQ} />
                        <div className="leader-info">
                            <p>{d.displayName}</p>
                            <p style={{ textAlign: 'center' }}>PolitIQ: <span style={{ fontWeight: 'bold' }}>{d.politIQ}</span></p>
                            <p style={{ textAlign: 'right' }}>Score: <span style={{ fontWeight: 'bold' }}>{d.weeklyScore}</span></p>
                        </div>
                    </div>
                </div>

                )
            }
            ))

        }
    }

    /*  const bannerText = timeframe => {
         if (timeframe === "Month") {
             return (<p>Monthly leader of each party eligible to compete for $50!</p>)
         }
         if (timeframe === "Week") {
             return (<p>Weekly leader receives $5!</p>)
         }
     }
  */


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
                    {loading ? loadingGif : authUserStats()}
                    <div className="leader-link-holder">
                    </div>
                    {showChart ? (loading ? loadingGif : <PolBarChart politIQs={politIQs} />) : (loading ? loadingGif : lastLeaders(timeframe))}
                    <center><p className="weekly" onClick={() => setShowChart(!showChart)}  >
                        {!showChart ? "Show Party Scores" : `Show Last ${timeframe}'s Leaders`}
                    </p></center>

                </div>
                <div className="leaderboard-right">
                    <div className="leaderboard-tabs">
                        <p onClick={() => setTimeframe("Month")} className={timeframe === "Week" ? "weekly" : "weekly selected"}>Top Ten Monthly</p>
                        <p onClick={() => setTimeframe("Week")} className={timeframe === "Week" ? "weekly selected" : "weekly"}>Top Ten Weekly</p>
                    </div>
                    {loading ? loadingGif : renderLeaders(timeframe)}
                </div>
            </div>
        </div>

    )
}


export default Leaderboard;