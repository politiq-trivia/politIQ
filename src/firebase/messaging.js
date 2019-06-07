import { messaging } from './firebase.js';
import axios from 'axios';

export const getToken = (uid) => {
    messaging.getToken().then(function(currentToken) {
        if(currentToken) {
            axios.post(`https://politiq.herokapp.com/api/users/subscription/${uid}`, {
            // axios.post(`http://localhost:3001/api/users/subscription/${uid}`, {
                token: currentToken
            }).then(response => {
                console.log(response)
            })
        } else {
            // show permission request
            console.log('No Instance ID token available. Request permission to generate another')
            // update UI for permission required
            // setTokenSentToServer(false)
        }
    }).catch(function(err) {
        console.log('An error occurred while retrieving token.', err);
        // showToken('Error retrieving Instance ID token.', err)
        // setTokenSentToServer(false)
    })
} 

export const refreshToken = () => {
    messaging.onTokenRefresh(function() {
        messaging.getToken().then(function(refreshedToken) {
            console.log('Token refreshed')
            // Indicate that new Instance ID token has not yet been sent to the 
            // app server.
            // setTokenSentToServer(false);
            // Send Instance Id token to app server
            // sendTokenToServer(refreshedToken)
        }).catch(function(err) {
            console.log('Unable to retrieve refreshed token.', err)
            // showToken('Unable to ')
        })
    })
}
