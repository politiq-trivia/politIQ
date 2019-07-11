import React from 'react';
import './leaderboard2.css';

const PolitIQBar = (props) => {
    return (
        <div className="score-bar">
            <Filler percentage={props.percentage}/>
        </div>
    )
}

const Filler = (props) => {
    return <div className="filler" style={{ width: `${props.percentage}%` }}/>
}

export default PolitIQBar;