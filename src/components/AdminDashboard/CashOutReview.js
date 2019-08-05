import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import './dashboard.css'

class CashOutReview extends Component {

    // reject cashout request
    // delete the cashout request from the db (if they've requested zero dollars or it's a fluke)
    // set the users status back to cashout requested: false
    // refetch all the cashout requests and update the ui (function should be passed as a prop from admin dashboard)

    // accept cashout request
    // delete the cashout request from the db 
    // set the users status back to cashout requested: false
    // set the users moneyEarned to 0 but don't touch their lifetime earnings - since their lifetime earnings are irrelevant here
    // and thus aren't even passed to this component

    acceptRequest = () => {
        
    }

    render() {
        console.log(this.props.cashoutData)
        const list = Object.keys(this.props.cashoutData)
        const renderCashoutRequests = list.map((req, i) => {
                console.log(this.props.cashoutData[req])
                return (
                    <div key={i}>
                        <div className="cashout-row">
                            <h4 className="cashout-name" style={{ width: '15%', textAlign: 'left' }}>{this.props.cashoutData[req].displayName}</h4>
                            <p className="cashout-item" style={{ textAlign: 'left', width: '30%' }}>{this.props.cashoutData[req].email}</p>
                            <p className="cashout-item" style={{ width: '15%', textAlign: 'left' }}>${this.props.cashoutData[req].moneyEarned}</p>
                            <div style={{ display: "flex", height: '6vh', marginLeft: 'auto' }}>
                                <Button variant="contained"style={{ marginRight: '1vw' }}>Reject</Button>
                                <Button color="primary" variant="contained">Accepted & Complete</Button>
                            </div>
                        </div>
                        <hr className="cashout-hr"/>
                    </div>
                )
            })
        
        return (
            <Paper className="userShow" style={{ marginBottom: '20vh' }}>
                <h1>Cash Out Requests</h1>
                <p style={{ fontSize: '14px', color: 'grey', width: '65%', marginLeft: 'auto', marginRight: 'auto' }}>Clicking Accepted & Complete will remove the request from this list, so make sure to click <span style={{ fontWeight: 'bold' }}>after</span> completing their request because you won't be able to get it back.</p>
                <div style={{ display: 'flex' }}>
                    <h4 className="cashout-name" style={{ width: '15%', textAlign: 'left' }}>Name</h4>
                    <h4 className="cashout-name" style={{ width: '30%', textAlign: 'left' }}>Email</h4>
                    <h4 className="cashout-name" style={{ width: '40%', textAlign: 'left' }}>Amount Requested</h4>
                </div>
                <hr className="cashout-hr" style={{ border: '1px solid black', marginBottom: '5vh' }}/>
                {renderCashoutRequests}
            </Paper>
        )
    }
}

export default CashOutReview;