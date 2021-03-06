import React from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../../../constants/routes';

const SignInLink = () => <p>
  Already have an account?
  {' '}
  <Link to={routes.SIGN_IN}>Log in here.</Link>
</p>;

export default SignInLink;
