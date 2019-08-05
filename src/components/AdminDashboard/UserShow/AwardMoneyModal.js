import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

import { db } from '../../../firebase'

import './users.css';

class AwardMoneyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            amount: "",
        }
    }

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleSave = () => {
        console.log(this.state.amount)
        const uid = this.props.user.uid
        // amount = moneyWon (leaving as is)
        const amount = parseInt(this.props.user.moneyWon) + parseInt(this.state.amount)
        // lifetimeAmount = the user's lifetime earnings
        const lifetimeAmount = parseInt(this.props.user.lifetimeEarnings) + parseInt(this.state.amount)
        console.log({uid, amount, lifetimeAmount})
        db.awardMoney(uid, amount, lifetimeAmount)
        this.props.toggleAwardMoneyModal()
    }

    render() {
        console.log(this.props)
        return (
            <Dialog 
                aria-labelledby="award money modal"
                aria-describedby="award money"
                className="awardMoneyModal"
                open={this.state.open}
            >
                <Close style={{ marginLeft: 'auto', marginRight: '1vw', marginTop: '1vh'}} onClick={this.props.toggleAwardMoneyModal}/>
                <h3 className="awardText">Award {this.props.user.username}</h3>
                <InputLabel htmlFor="adornment-amount" className="awardLabel">Amount</InputLabel>
                <Input
                    id="adornment-amount"
                    value={this.state.amount} 
                    onChange={this.handleChange('amount')} 
                    margin="normal" 
                    type="number" 
                    className="awardInput"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                />
                <Button className="awardButton" color="primary" variant="contained" onClick={this.handleSave}>Save</Button>
            </Dialog>
        )
    }
}

export default AwardMoneyModal;