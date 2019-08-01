import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import './dashboard.css'

class CashOutReview extends Component {
    render() {
        console.log(this.props.cashoutData)
        const list = Object.keys(this.props.cashoutData)
        const renderCashoutRequests = list.map((req, i) => {
                console.log(this.props.cashoutData[req])
                return (
                    <div key={this.props.cashoutData[req].uid}>
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