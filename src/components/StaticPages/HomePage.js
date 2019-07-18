import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import MediaQuery from 'react-responsive';

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton
} from 'react-share';

import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';


import { withAuthorization, withEmailVerification } from '../Auth/index';

import * as routes from '../../constants/routes';


import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TodaysQuizButton from './TodaysQuizButton';

import './Static.css';

const getHref = () => {
  return (window.location.href).toString();
}

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noAvailableQuizzes: false,
      open: false,
    };
  }

  componentDidMount() {
    this.addToHomeScreen()
  }

  addToHomeScreen = () => {
    // check if the user is running on ios and see if they're running higher than 11.3 (the highest version that supports pwas)
    function iOSversion() {
      if (/iP(hone|od|ad)/.test(navigator.platform)) {
        // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
      }
    }

    let ver = iOSversion();
    if (ver === undefined) return;
  


    const needsToSeePrompt = () => {
      if (navigator.standalone) {
        return false;
      } else if (ver[0] <= 11) {
        return false;
      }
      return ['iPhone', 'iPad', 'iPod'].includes(navigator.platform);
    }

    if (needsToSeePrompt()) {
      this.setState({
        open: true,
      })
    }
  }
  
  showErrorMessage = () => {
    this.setState({
      noAvailableQuizzes: true,
    })
  }

  handleClose = () => {
    this.setState({
      open: false,
    })
  }

  handleAddToHomescreen = () => {
    this.props.history.push('/add-to-homescreen')
    // redirect to another view with instructions with how to add 
    // then close the modal and set in localstorage that i've alrady done it
  }

  render() {
    return (
      <Paper className="pageStyle home">
        <Helmet>
          <title>Home | politIQ trivia</title>
        </Helmet>
        <Snackbar 
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.open}
          autoHideDuration={60000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          // message={<span id="message-id">Add politIQ to your homescreen</span>}
          action={[
            <>
            <Button size="small" color="primary" style={{ fontSize: '0.777rem' }} onClick={this.handleAddToHomescreen} key="add-to-homescreen">
              Add politIQ to your homescreen
            </Button>
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
            </>
          ]}
        />
        <h1>Did you pay attention to today's news and think you know politics?</h1>
        <h1>Prove it!</h1>

        { this.state.noAvailableQuizzes ? <p className="home-taken">You've taken all the quizzes we have available! Check back tomorrow for the next challenge.</p> : null }

        <TodaysQuizButton buttonText="Take Today's Quiz" id="today" disabled={this.state.noAvailableQuizzes} showErrorMessage={this.showErrorMessage} signedInUser={this.props.signedInUser}/>

        <Link to={routes.QUIZ_ARCHIVE} style={{ textDecoration: 'none', color: '#a54ee8' }}>
          <Button color="primary" variant="outlined" id="archive-link">
            Past Quizzes
          </Button>
        </Link>


        <h4>The more you play, the better you score!</h4>
        <h4 style={{ marginTop: '0' }}>Don't forget to submit your own questions for a chance to win points!</h4>

        <MediaQuery maxWidth={415}>
          <hr />
          <h5>Share Your Score on Social Media:</h5>
          <div className="mobile-socials" style={{ display: 'flex', marginTop: '1vh' }}>

            <FacebookShareButton url={ getHref() } className="shareable" quote="Check out my politIQ:">
              <FacebookIcon round={true} size={32} />
            </FacebookShareButton>
            <LinkedinShareButton url={ getHref() } className="shareable" title="Check out my politIQ" description="Are you smarter than a Republican? Democrat? Independent? Find out!">
              <LinkedinIcon round={true} size={32}/>
            </LinkedinShareButton>
            <TwitterShareButton url={ getHref() } title="Check out my politIQ:" className="shareable" >
              <TwitterIcon round={true} size={32} />
            </TwitterShareButton>
            <WhatsappShareButton url={ getHref() } className="shareable" title="Check out my politIQ:">
              <WhatsappIcon round={true} size={32} />
            </WhatsappShareButton>
            <EmailShareButton url={ getHref() } className="shareable" subject="Check out my politIQ:" body="Are you smarter than a Republican? Democrat? Independent? Find out!">
              <EmailIcon round={true} size={32} />
            </EmailShareButton>

          </div>
        </MediaQuery>

        <hr />
        <iframe 
          title="may gameshow" 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/qudMpap0YoQ" 
          frameBorder="0" 
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '5vh' }}
        >
        </iframe>

      </Paper>
    );
  }
}



const condition = authUser => !!authUser;

export default compose(
  // withEmailVerification,
  withAuthorization(condition),
)(HomePage);
