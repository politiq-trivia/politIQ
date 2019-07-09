import React, { Component } from 'react';

class Leaderboardv2 extends Component {
    render() {
        return (
            <div>
                <div className="leaderboard-left">
                    <div>profile picture</div>
                    <h2>username</h2>
                    <h4>affiliation</h4>
                </div>
                <div className="leaderboard-right">
                    <div>
                        <div>Monthly</div>
                        <div>Weekly</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Leaderboardv2;