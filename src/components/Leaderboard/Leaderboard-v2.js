import React, { Component } from 'react';
import VerifiedUser from '@material-ui/icons/VerifiedUser';

import './leaderboard2.css';

class Leaderboardv2 extends Component {
    render() {
        return (
            <div className="leaderboard-holder">
                <div className="leaderboard-left">
                    <div className="leader-user-info">
                        <VerifiedUser size={40}/>
                        <h2>username</h2>
                        <h4>affiliation</h4>
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
                    <div className="politIQ-circle">
                    </div>
                    <p>View last month's leaders --></p>
                </div>
                <div className="leaderboard-right">
                    <div className="leaderboard-tabs">
                        <div><p className="monthly">Monthly</p></div>
                        <div><p className="weekly">Weekly</p></div>
                    </div>
                    <div className="leaderboard-object">
                        <p className="leaderboard-num">1</p>
                        <div className="content">
                            <div className="politiq-bar"></div>

                            <div className="leader-info">
                                <p>Hannah Werman</p>
                                <p className="score">50</p>
                            </div>
                        </div>
                    </div>
                    <div className="leaderboard-object">
                        <p className="leaderboard-num">1</p>
                        <div className="content">
                            <div className="politiq-bar"></div>

                            <div className="leader-info">
                                <p>Hannah Werman</p>
                                <p className="score">50</p>
                            </div>
                        </div>
                    </div>
                    <div className="leaderboard-object">
                        <p className="leaderboard-num">1</p>
                        <div className="content">
                            <div className="politiq-bar"></div>

                            <div className="leader-info">
                                <p>Hannah Werman</p>
                                <p className="score">50</p>
                            </div>
                        </div>
                    </div>
                    <div className="leaderboard-object">
                        <p className="leaderboard-num">1</p>
                        <div className="content">
                            <div className="politiq-bar"></div>

                            <div className="leader-info">
                                <p>Hannah Werman</p>
                                <p className="score">50</p>
                            </div>
                        </div>
                    </div>
                    <div className="leaderboard-object">
                        <p className="leaderboard-num">1</p>
                        <div className="content">
                            <div className="politiq-bar"></div>

                            <div className="leader-info">
                                <p>Hannah Werman</p>
                                <p className="score">50</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Leaderboardv2;