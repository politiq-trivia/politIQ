import React from 'react';

const UserRank = (props) => (
    <div style={{ paddingTop: '2vh', paddingBottom: '1vh' }}>
        <h1>Your Rank: {props.ranking}</h1>
    </div>
)

export default UserRank;