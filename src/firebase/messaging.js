import { messaging } from './firebase.js';
import axios from 'axios';

export const getToken = (uid) => {
    messaging.getToken().then(function(currentToken) {
        if(currentToken) {
            sendTokenToServer(uid, currentToken)
        } else {
            // show permission request
            console.log('No Instance ID token available. Request permission to generate another')
            setTokenSentToServer(false)
        }
    }).catch(function(err) {
        console.log('An error occurred while retrieving token.', err);
        // showToken('Error retrieving Instance ID token.', err)
        setTokenSentToServer(false)
    })
} 

export const refreshToken = () => {
    messaging.onTokenRefresh(function() {
        messaging.getToken().then(function(refreshedToken) {
            console.log('Token refreshed')
            // Indicate that new Instance ID token has not yet been sent to the 
            // app server.
            setTokenSentToServer(false);
            // Send Instance Id token to app server
            sendTokenToServer("", refreshedToken)
        }).catch(function(err) {
            console.log('Unable to retrieve refreshed token.', err)
        })
    })
}

const sendTokenToServer = (uid, token) => {
    if (!isTokenSentToServer()) {
        // get the uid
        const userInfo = JSON.parse(localStorage.getItem('authUser'))
        const uid = userInfo.uid
        console.log('Sending token to server ...') 
        // axios.post(`https://politiq.herokapp.com/api/users/subscription/${uid}`, {
            axios.post(`http://localhost:3001/api/users/subscription/${uid}`, {
                token: token
            }).then(response => {
                console.log(response)
            })
    } else {
        console.log('Token already sent to server so won\'t send it again')
    }

}

const isTokenSentToServer = () => {
    return window.localStorage.getItem('sentToServer') === '1';
}

const setTokenSentToServer = (sent) => {
    window.localStorage.setItem('sentToServer', sent ? "1" : "0");
}