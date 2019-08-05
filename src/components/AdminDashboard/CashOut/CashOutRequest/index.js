import React, { Component } from 'react';

class CashOutRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            num: 0
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        if (nextProps.cashoutData !== this.props.cashoutData) {
            this.updateNum(nextProps.cashoutData)
            return true;
        } else if (nextState !== this.state) {
            return true;
        } else return false;
    }

    updateNum = (data) => {
        if (data === null || data === undefined) return;
        const num = Object.keys(data).length
        this.setState({ num })
    }

    render() {
        return (
            <div className="reviewWidget cashOutWidget" onClick={this.props.toggleCashOut}>
                <div className="counterDisplay">{this.state.num}</div>
                <h1>Cash Out Requests</h1>
            </div>
        )
    }
}

export default CashOutRequest;