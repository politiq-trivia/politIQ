import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Close from '@material-ui/icons/Close';
import UserScoreboard from '../../Leaderboard/UserScoreboard';

import { db } from '../../../firebase';

class StatsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
        }
    }

    toggleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen,
        })
    }

    requestCashOut = () => {
        // send object with uid, email address, moneywon, and date of cash out request
        // update user information object to say that a cashout has been requested
        const { email, moneyWon, displayName } = this.props.userInfo
        const date = moment().format('YYYY-MM-DD')
        const uid = this.props.uid
        db.requestCashOut(uid, date, email, displayName, moneyWon)
        
        // TODO: this should also update the localstorage userinfo item, causing
        // the props to be updatd and thus the component to change (button disabled)
    }
    render() {
        return (
            <>
                <UserScoreboard uid={this.props.uid} moneyWon={this.props.userInfo.moneyWon} />
                <Button color="primary" variant="contained" id="cashOut" onClick={this.toggleModal}>Cash Out</Button>
                <Modal
                    aria-labelledby="Cash Out"
                    aria-describedby="Coming soon - cash out and receive your earnings!"
                    open={this.state.modalOpen}
                    onClose={this.toggleModal}
                    className="cashout-modal"
                >
                    <Paper>
                        <Close style={{ float: 'right', padding: '1vh', display: 'block'}} onClick={this.toggleModal}/>
                        <h3>Coming soon!</h3>
                        <p>You have ${this.props.userInfo.moneyWon} available.</p>
                        <Button variant="contained" color="primary" style={{ marginBottom: '5vh' }} onClick={this.requestCashOut}>Click Here to Cash Out</Button>
                    </Paper>
                </Modal>
            </>
        )
    }
}

StatsPage.propTypes = {
    uid: PropTypes.string.isRequired,
    userInfo: PropTypes.object.isRequired,
}

export default StatsPage;