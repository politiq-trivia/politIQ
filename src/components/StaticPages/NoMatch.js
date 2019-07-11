import React from 'react';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { HOME, LANDING } from '../../constants/routes';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import bg from './politiq-bg2.jpg';


const NoMatch = () => {
    console.log(window.location.pathname)
    const noMoreQuizzes = window.location.pathname === '/No%20Available%20Quizzes'
    console.log(noMoreQuizzes)
    return (
        <Paper className="home-holder">
            {noMoreQuizzes 
                ? <h2>Uh oh! You've already taken all the quizzes for this month!</h2>
                : <h2>Uh oh! The page you're looking for does not exist.</h2>
            }
            <MediaQuery minWidth={416}>
                <Link to={localStorage.hasOwnProperty('authUser') ? HOME : LANDING} style={{ textDecoration: 'none', display: 'block' }}>
                    <h3 className="noMatch-link">Click here to return to the home page</h3>
                </Link>
            </MediaQuery>
            <MediaQuery maxWidth={415}>
                <Link to={localStorage.hasOwnProperty('authUser') ? HOME : LANDING} style={{ textDecoration: 'none', display: 'block'}}>
                    <Button color="primary" variant="contained">Return to Home Page</Button>
                </Link>
            </MediaQuery>
            <img src={bg} id="bg-image" style={{ marginTop: '5.5vh' }} alt="democrats and republicans face off" />
        </Paper>
    )
}

export default NoMatch;