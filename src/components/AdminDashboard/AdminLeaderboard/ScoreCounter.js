import React from 'react';

const ScoreCounter = ({ demCount, repCount, indCount }) => {
    console.log({ demCount, repCount, indCount })
    return (
        <div className="admin--scoreCounter-box">
            <h2>Active Users This Month:</h2>
            <div className="admin--scoreCounter">
                <div><b>Democrats:</b> {demCount}</div>
                <div><b>Republicans:</b> {repCount}</div>
                <div><b>Independents:</b> {indCount}</div>
                <div><b>Total Users:</b> {demCount + repCount + indCount}</div>
            </div>
        </div>
    )
}

export default ScoreCounter;