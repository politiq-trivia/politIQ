// CashOut Review Component

import React, { useState } from 'react';
import MediaQuery from 'react-responsive';
import moment from 'moment';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';

import { db } from '../../../../firebase';
import '../../dashboard.css'

const CashOutReview = (props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState(null)

    const removeReqFromDb = (uid) => {
        db.removeCashoutRequest(uid)
    }

    const refetchAndUpdate = (updatedUserObj) => {
        localStorage.setItem('authUser', JSON.stringify(updatedUserObj));
        props.getCashOutRequests()
    }


    const acceptRequest = (uid) => {
        db.acceptCashOut(uid)
            .then(response => {
                const updatedUserObj = response.val()
                refetchAndUpdate(updatedUserObj);

                const date = moment().format('YYYY-MM-DDTHH:mm');
                const updateInfo = props.cashoutData[uid]
                updateInfo.uid = uid
                db.cashoutNotification(date, updateInfo)
            })
        
        removeReqFromDb(uid);
    }

    const rejectRequest = (uid) => {
        removeReqFromDb(uid);
        db.rejectCashOut(uid)
            .then(response => {
                const updatedUserObj = response.val();
                updatedUserObj.uid = uid;
                refetchAndUpdate(updatedUserObj);
            })
    }

    const toggleModalOpen = (modalData) => {
        setModalOpen(!modalOpen)
        if (modalData) {
            setData(modalData)
        } else {
            setData(null)
        }
    }

    let noRequests = false;
    let renderCashoutRequests;
    if (props.cashoutData === undefined|| props.cashoutData === null) {
        noRequests = true;
    } else {
        const list = Object.keys(props.cashoutData)
        renderCashoutRequests = list.map((req, i) => {
            return (
                <div key={i} id="cashout-holder">
                    <div className="cashout-row">
                        <div className="cashout-info">
                            <h4 className="cashout-name cashout-name-table" id="cashout-data">{props.cashoutData[req].displayName}</h4>
                            <MediaQuery minWidth={416}>
                                <p className="cashout-name cashout-email-table">{props.cashoutData[req].email}</p>
                            </MediaQuery>
                            <MediaQuery maxWidth={415}>
                                <p 
                                    className="cashout-name cashout-email-table cashout-email-table-small" 
                                    onClick={() => toggleModalOpen({
                                        name: props.cashoutData[req].displayName,
                                        email: props.cashoutData[req].email,
                                        amount: props.cashoutData[req].moneyEarned,
                                    })}
                                >
                                    View
                                </p>
                            </MediaQuery>
                            <p className="cashout-name cashout-amount-table">${props.cashoutData[req].moneyEarned}</p>
                            <MediaQuery maxWidth={415}>
                                <div className="cashout-buttons">
                                    <Button color="primary" variant="contained" onClick={() => acceptRequest(list[i])} id="accept-request"><Check /></Button>
                                    <Button variant="contained" onClick={() => rejectRequest(list[i])}><Close /></Button>
                                </div>
                            </MediaQuery>
                        </div>
                        <MediaQuery minWidth={416}>
                            <div className="cashout-buttons">
                                <Button variant="contained"style={{ marginRight: '1vw' }} onClick={() => rejectRequest(list[i])}>Reject</Button>
                                <Button color="primary" variant="contained" onClick={() => acceptRequest(list[i])} id="accept-request">Accepted & Complete</Button>
                            </div>
                        </MediaQuery>
                    </div>

                    <hr className="cashout-hr"/>
                </div>
            )
        })
    }

    console.log(props.cashoutData, 'cashout')

    return (
        <Paper className="userShow cashout">
            {noRequests 
                ? <div style={{ height: '25vh', paddingTop: '12vh' }}>
                    <h1>No Cash Out Requests to Display!</h1>
                    <Button variant="contained" color="primary" onClick={props.toggleDashboard}>Back to Admin Dashboard</Button>
                  </div>
                : <>
                    <h1>Cash Out Requests</h1>
                    <p id="cashout-directions">Clicking Accepted & Complete will remove the request from this list, so make sure to click <span style={{ fontWeight: 'bold' }}>after</span> completing their request because you won't be able to get it back.</p>
                    <div style={{ display: 'flex' }}>
                        <h4 className="cashout-name">Name</h4>
                        <h4 className="cashout-email">Email</h4>
                        <h4 className="cashout-moneywon">Amount</h4>
                    </div>
                    <hr className="cashout-hr cashout-hr-header"/>
                    <div id="all-requests">
                        {renderCashoutRequests}
                    </div>
                  </>
            }
            <MediaQuery maxWidth={415}>
                    <Modal
                        aria-labelledby="user information"
                        aria-describedby="user information for cashout"
                        open={modalOpen}
                        onClose={setModalOpen}
                        className="cashout-modal"
                    >
                        <Paper className="cashout-modal-paper">
                            <Close style={{ float: 'right', marginTop: '10px' }} onClick={toggleModalOpen}/>
                            <h3>Cashout Request</h3>
                            <p><span style={{ fontWeight: 'bold' }}>Name: </span>{data ? data.name : null}</p>
                            <p><span style={{ fontWeight: 'bold' }}>Email: </span>{data ? data.email : null}</p>
                            <p><span style={{ fontWeight: 'bold' }}>Amount: </span>${data ? data.amount : null}</p>
                        </Paper>
                    </Modal>
            </MediaQuery>
        </Paper>
    )
}

export default CashOutReview;