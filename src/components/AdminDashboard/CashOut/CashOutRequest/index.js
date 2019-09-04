import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CashOutRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.cashoutData !== this.props.cashoutData) {
      this.updateNum(nextProps.cashoutData);
      return true;
    }
    if (nextState !== this.state) {
      return true;
    }
    return false;
  }

  updateNum = (data) => {
    if (data === null || data === undefined) return;
    const num = Object.keys(data).length;
    this.setState({ num });
  }

  render() {
    return (
      <div
        className="reviewWidget cashOutWidget"
        onClick={this.props.toggleCashOut}
        onKeyPress={(event) => {
          if (event.keyCode === 13) {
            this.props.toggleCashOut();
          }
        }}
        role="button" tabIndex={0}
      >
        <div className="counterDisplay">{this.state.num}</div>
        <h1>Cash Out Requests</h1>
      </div>
    );
  }
}

CashOutRequest.propTypes = {
  cashoutData: PropTypes.object,
  toggleCashOut: PropTypes.func,
};

export default CashOutRequest;
