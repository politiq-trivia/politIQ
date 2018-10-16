import React from 'react';
import { Link } from 'react-router-dom';

import AuthUserContext from './AuthUserContext';
import SignOutButton from './SignOut';
import * as routes from '../constants/routes';

const Navigation = ({ authUser }) =>
<AuthUserContext.Consumer>
  {authUser => authUser
    ? <NavigationAuth />
    : <NavigationNonAuth />
  }
</AuthUserContext.Consumer>

const NavigationAuth = () =>
  <div>
    <ul>
      <li><Link to={routes.LANDING}>Landing</Link></li>
      <li><Link to={routes.HOME}>Home</Link></li>
      <li><Link to={routes.PROFILE}>Profile</Link></li>
      <li><Link to={routes.PLAY_GAME}>Play Game</Link></li>
      <li><Link to={routes.QUIZ_ARCHIVE}>Quiz Archive</Link></li>
      <li><Link to={routes.LEADERBOARD}>Leaderboard</Link></li>
      <li><Link to={routes.ABOUT}>About</Link></li>
      <li><SignOutButton /></li>
    </ul>
  </div>

const NavigationNonAuth = () =>
  <div>
    <ul>
      <li><Link to={routes.LANDING}>Landing</Link></li>
      <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
      <li><Link to={routes.ABOUT}>About</Link></li>
      <li><Link to={routes.PLAY_GAME}>Play Game</Link></li>
    </ul>
  </div>

  export default Navigation;
