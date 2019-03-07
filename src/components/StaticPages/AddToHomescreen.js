import React from 'react';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import { HOME, LANDING } from '../../constants/routes';

import shareIcon from './share-ios7.png';
import addToHomescreen from './addToHomescreen.png';


const AddToHomescreen = () => {
    return (
        <Paper className="home" style={{ marginBottom: '4vh' }}>
            <h1>Add politIQ to your homescreen</h1>
            <div style={{ display: 'flex', justifyContent: 'center', height: '32px' }}>
                <p style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '1vw' }}>Tap the</p> 
                <img src={shareIcon} style={{ height: '28px', width: 'auto' }} alt="share icon"/>
            </div>
            <p style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: '0' }}>button and then click 'Add to Homescreen' for quick access to the latest quizzes.</p>
            <img src={addToHomescreen} style={{ marginBottom: '3vh' }} alt="add to homescreen" />

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
        </Paper>
    )
}

export default AddToHomescreen;