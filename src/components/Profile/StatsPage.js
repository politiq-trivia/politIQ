import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Close from '@material-ui/icons/Close';
import UserScoreboard from '../Leaderboard/UserScoreboard';

import { db } from '../../firebase';

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
        console.log('cash out request clicked')
        db.requestCashOut(this.props.uid, this.props.moneyWon)
    }
    render() {
        return (
            <>
                <UserScoreboard uid={this.props.uid} moneyWon={this.props.moneyWon} />
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
                        <p>You have ${this.props.moneyWon} available.</p>
                        <Button variant="contained" color="primary" style={{ marginBottom: '5vh' }} onClick={this.requestCashOut}>Click Here to Cash Out</Button>
                    </Paper>
                </Modal>
            </>
        )
    }
}

export default StatsPage;