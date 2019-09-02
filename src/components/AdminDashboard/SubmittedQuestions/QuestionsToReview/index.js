import React, { Component } from 'react';
import { db } from '../../../../firebase';
import { Link } from 'react-router-dom';

import { REVIEW } from '../../../../constants/routes';

import '../../dashboard.css';

class QuestionsToReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0
    }
  }

  componentDidMount = () => {
    this.numToReview()
  }

  componentWillUnmount = () => {
    this.setState({
      undefined
    })
  }

  numToReview = async () => {
    // let num;
    await db.getOneQuestion()
      .then(response => {
        if (response.val() === null) {
          return;
        } else {
          const theNum = Object.keys(response.val()).length;
            this.setState({
              num: theNum,
            })
        }
      })
  }

  render() {
    return (
      <Link to={REVIEW} style={{ textDecoration: 'none' }}>
        <div className="reviewWidget">
          <div className="counterDisplay">{this.state.num}</div>
          <h1>Questions to be reviewed</h1>
        </div>
      </Link>
    )
  }
}

export default QuestionsToReview;
