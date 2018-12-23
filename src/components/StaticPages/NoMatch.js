import React from 'react';
import { Link } from 'react-router-dom';
import { LANDING } from '../../constants/routes';

import Paper from '@material-ui/core/Paper';

import bg from './politIQ-bg.png';

const NoMatch = () => {
    return (
        <Paper className="home-holder">
            <h2>Uh oh! The page you're looking for does not exist.</h2>
            <Link to={LANDING} style={{ textDecoration: 'none', display: 'block' }}><h3 className="noMatch-link">Click here to return to the home page</h3></Link>
            <img src={bg} style={{ marginBottom: '10vh', marginTop: '5.5vh' }} alt="democrats and republicans face off" />
        </Paper>
    )
}

export default NoMatch;