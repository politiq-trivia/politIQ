import React from 'react';
import { Link } from 'react-router-dom';

import * as routes from '../constants/routes';

const Navigation = () =>
  <div>
    <ul>
      <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
      <li><Link to={routes.LANDING}>Landing</Link></li>
      <li><Link to={routes.HOME}>Home</Link></li>
      <li><Link to={routes.PROFILE}>Profile</Link></li>
      <li><Link to={routes.PLAY_GAME}>Play Game</Link></li>
      <li><Link to={routes.QUIZ_ARCHIVE}>Quiz Archive</Link></li>
      <li><Link to={routes.LEADERBOARD}>Leaderboard</Link></li>
      <li><Link to={routes.ABOUT}>About</Link></li>
    </ul>
  </div>

  export default Navigation;
