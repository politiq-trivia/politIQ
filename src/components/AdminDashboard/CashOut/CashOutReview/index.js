// CashOut Review Component

import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { db } from '../../../../firebase';
import '../../dashboard.css'

class CashOutReview extends Component {
    
    removeReqFromDb = (uid) => {
        db.removeCashoutRequest(uid)
    }

    refetchAndUpdate = (updatedUserObj) => {
        localStorage.setItem('authUser', JSON.stringify(updatedUserObj));
        this.props.getCashOutRequests()
    }


    acceptRequest = (uid) => {
        this.removeReqFromDb(uid);
        db.acceptCashOut(uid)
            .then(response => {
                const updatedUserObj = response.val()
                this.refetchAndUpdate(updatedUserObj);
            })
    }

    rejectRequest = (uid) => {
        console.log(uid, 'this is uid in reject request')
        this.removeReqFromDb(uid);
        db.rejectCashOut(uid)
            .then(response => {
                const updatedUserObj = response.val()
                this.refetchAndUpdate(updatedUserObj)
            })
    }

    render() {
        let noRequests = false;
        let renderCashoutRequests;
        if (this.props.cashoutData === undefined|| this.props.cashoutData === null) {
            noRequests = true;
        } else {
            const list = Object.keys(this.props.cashoutData)
            renderCashoutRequests = list.map((req, i) => {
                    console.log(this.props.cashoutData[req])
                    return (
                        <div key={i}>
                            <div className="cashout-row">
                                <h4 className="cashout-name" style={{ width: '15%', textAlign: 'left' }}>{this.props.cashoutData[req].displayName}</h4>
                                <p className="cashout-item" style={{ textAlign: 'left', width: '30%' }}>{this.props.cashoutData[req].email}</p>
                                <p className="cashout-item" style={{ width: '15%', textAlign: 'left' }}>${this.props.cashoutData[req].moneyEarned}</p>
                                <div style={{ display: "flex", height: '6vh', marginLeft: 'auto' }}>
                                    <Button variant="contained"style={{ marginRight: '1vw' }} onClick={() => this.rejectRequest(list[i])}>Reject</Button>
                                    <Button color="primary" variant="contained" onClick={() => this.acceptRequest(list[i])}>Accepted & Complete</Button>
                                </div>
                            </div>
                            <hr className="cashout-hr"/>
                        </div>
                    )
                })
        }

        
        return (
            <Paper className="userShow" style={{ marginBottom: '20vh' }}>

                {noRequests 
                    ? <div style={{ height: '25vh', paddingTop: '12vh' }}>
                        <h1>No Cash Out Requests to Display!</h1>
                        <Button variant="contained" color="primary" onClick={this.props.toggleDashboard}>Back to Admin Dashboard</Button>
                      </div>
                    : <>
                        <h1>Cash Out Requests</h1>
                        <p style={{ fontSize: '14px', color: 'grey', width: '65%', marginLeft: 'auto', marginRight: 'auto' }}>Clicking Accepted & Complete will remove the request from this list, so make sure to click <span style={{ fontWeight: 'bold' }}>after</span> completing their request because you won't be able to get it back.</p>
                        <div style={{ display: 'flex' }}>
                            <h4 className="cashout-name" style={{ width: '15%', textAlign: 'left' }}>Name</h4>
                            <h4 className="cashout-name" style={{ width: '30%', textAlign: 'left' }}>Email</h4>
                            <h4 className="cashout-name" style={{ width: '40%', textAlign: 'left' }}>Amount Requested</h4>
                        </div>
                        <hr className="cashout-hr" style={{ border: '1px solid black', marginBottom: '5vh' }}/>
                        {renderCashoutRequests}
                      </>
                    }
            </Paper>
        )
    }
}

export default CashOutReview;