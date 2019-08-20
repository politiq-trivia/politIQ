import React, { useState, useEffect } from 'react';
import moment from 'moment';

import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Close from '@material-ui/icons/Close';

import { db } from '../../../firebase';

const CashOutButton = (props) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [cashoutRequested, setCashoutRequested] = useState(false)

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }
    
    const requestCashOut = () => {
        // send object with uid, email address, moneywon, and date of cash out request
        // update user information object to say that a cashout has been requested
        const { email, moneyWon, displayName } = props.userInfo
        const date = moment().format('YYYY-MM-DD')
        const uid = props.uid
        db.requestCashOut(uid, date, email, displayName, moneyWon)
            
        const localStorageUser = JSON.parse(localStorage.getItem('authUser'));
        localStorageUser.cashoutRequested = true;
        localStorage.setItem('authUser', JSON.stringify(localStorageUser));
            
        setCashoutRequested(true);
        setModalOpen(false)
      }

      useEffect(() => {
        if (props.userInfo.cashoutRequested !== null) {
            // user cannot cash out if they have already cashed out or if they have not won any money
            const { cashoutRequested, moneyWon } = props.userInfo;
            let requested;
            if (cashoutRequested === "true" || moneyWon === 0) {
              requested = true;
              setCashoutRequested(requested)
            }
        }
      }, [])

    return (
        <>
    {props.userInfo.moneyWon === 0 ? <p id="cashout-instructions">You haven't been awarded any cash prizes yet! Keep playing for your chance to top the leaderboards!</p> : null}
    <Button color="primary" variant="contained" id="cashOut" onClick={toggleModal} disabled={cashoutRequested}>{cashoutRequested && props.userInfo.moneyWon !== 0 ? 'Cash Out Requested' : 'Cash Out' }</Button>
    <Modal
      aria-labelledby="Cash Out"
      aria-describedby="Coming soon - cash out and receive your earnings!"
      open={modalOpen}
      onClose={toggleModal}
      className="cashout-modal"
    >
      <Paper>
        <Close style={{ float: 'right', padding: '1vh', display: 'block'}} onClick={toggleModal}/>
        <h3>Coming soon!</h3>
        <p>You have ${props.userInfo.moneyWon} available.</p>
        <Button variant="contained" color="primary" style={{ marginBottom: '5vh' }} onClick={requestCashOut} id="cashout-confirm">Click Here to Cash Out</Button>
      </Paper>
    </Modal>
    </>
    )
}

export default CashOutButton;