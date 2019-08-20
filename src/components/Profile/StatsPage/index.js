import React from 'react';
import PropTypes from 'prop-types';
import UserScoreboard from '../../Leaderboard/UserScoreboard';
import CashOutButton from '../CashOutButton';

const StatsPage = (props) => {
  return (
    <>
      <UserScoreboard uid={props.uid} moneyWon={props.userInfo.moneyWon} />
      <CashOutButton userInfo={props.userInfo} uid={props.uid} />
    </>
  )
}

StatsPage.propTypes = {
  uid: PropTypes.string.isRequired,
  userInfo: PropTypes.object.isRequired,
}

export default StatsPage;