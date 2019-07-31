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
    const calcPolitIQLabelPos = () => {
        if (props.percentage > 23) {
            return true
        } else return false;
    }
    console.log(calcPolitIQLabelPos())
    return <div className="filler" style={{ width: `${props.percentage}%` }}><span className="politIQ-label" style={calcPolitIQLabelPos() === true ? {right: `${100 - props.percentage + 1}%`} : {display: "none"}}>PolitIQ: {props.percentage}</span></div>
}

export default PolitIQBar;