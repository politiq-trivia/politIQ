import React from 'react';
import Button from '@material-ui/core/Button';
import UserScoreboard from '../Leaderboard/UserScoreboard';

const StatsPage = (props) => {
    return (
        <>
            {/* <h1 id="settings-heading">Quiz Stats</h1> */}
            <UserScoreboard uid={props.uid} moneyWon={props.moneyWon} />
            <Button color="primary" variant="contained" id="cashOut">Cash Out</Button>
        </>
    )
}

export default StatsPage;