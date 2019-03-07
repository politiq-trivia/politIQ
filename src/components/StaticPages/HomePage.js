import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { compose } from 'recompose';
import axios from 'axios';


import { withAuthorization, withEmailVerification } from '../Auth/index';

import * as routes from '../../constants/routes';
import { urlB64ToUint8Array } from '../../utils/urlB64ToUint8Array';
import { db } from '../../firebase';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TodaysQuizButton from './TodaysQuizButton';

import './Static.css';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noAvailableQuizzes: false,
      open: false,
    };
  }

  componentDidMount() {
    // this.subscribeToPushNotifications()
    this.addToHomeScreen()

    // axios.post(process.env.SERVER_URL + '/subscribe', {pushSubscription: "this is the subscription"})
    // .then(res => {
    //   console.log(res)
    // })
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

  


    const needsToSeePrompt = () => {
      if (navigator.standalone) {
        return false;
      } else if (ver[0] <= 11) {
        return false;
      }
      return ['iPhone', 'iPad', 'iPod'].includes(navigator.platform);
    }

    console.log(needsToSeePrompt())

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

  subscribeToPushNotifications = async () => {
    if(!global.registration) return;

    const key = process.env.REACT_APP_VAPID_KEY


    await global.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(key)
    }).then((pushSubscription) => {
      console.log({pushSubscription})
      console.log('Subscribed')
      console.log(process.env.SERVER_URL)
      axios.post('localhost:3001/subscribe', { pushSubscription: pushSubscription })
        .then(res => {
          console.log(res)
        })
      
      // get the keys, convert them to strings, and store them in firebase
      const p256dhAB = pushSubscription.getKey('p256dh')
      function ab2str(buf) {
        return String.fromCharCode.apply(null, new Int8Array(buf));
      }
      const p256dhStr = ab2str(p256dhAB)
      function ab2str2(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
      }
      const auth = pushSubscription.getKey('auth');
      const authStr = ab2str2(auth)


      const subscriptionObject = {
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: p256dhStr,
          auth: authStr,
        }
      }
      
      // saves it in firebase
      db.subscribeUser(subscriptionObject);    
        
      
    }).catch(err => {
      console.log(err)
      console.log('Did not subscribe')
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
          <title>Home | politIQ </title>
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

      </Paper>
    );
  }
}



const condition = authUser => !!authUser;

export default compose(
  // withEmailVerification,
  withAuthorization(condition),
)(HomePage);
