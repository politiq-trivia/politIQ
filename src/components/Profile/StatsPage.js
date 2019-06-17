import React from 'react';
import UserScoreboard from '../Leaderboard/UserScoreboard';

const StatsPage = (props) => {
    return (
        <>
            <h1 id="settings-heading">Quiz Stats</h1>
            <UserScoreboard uid={props.uid} moneyWon={props.moneyWon} />
        </>
    )
}

export default StatsPage;