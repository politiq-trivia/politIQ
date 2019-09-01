import React from 'react';

import UserScoreboard from '../../Leaderboard/UserScoreboard';
import CashOutButton from '../CashOutButton';
import AuthUserContext from '../../Auth/AuthUserContext';

const StatsPage = () => {
  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <>
          <UserScoreboard uid={authUser.uid} moneyWon={authUser.moneyWon} />
          <CashOutButton userInfo={authUser} uid={authUser.uid} />
        </>
      )}
    </AuthUserContext.Consumer>
  )
}

export default StatsPage;