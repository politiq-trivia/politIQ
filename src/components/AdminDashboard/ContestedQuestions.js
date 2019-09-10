import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';

import { CONTEST } from '../../constants/routes';

import './dashboard.css';

class ContestedQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
    };
  }

  componentDidMount = () => {
    this.numToReview();
  }

  componentWillUnmount = () => {
    this.setState({ undefined });
  }

  numToReview = async () => {
    await db.getContestedQuiz()
      .then((response) => {
        if (response.val() === null) { return; }

        const data = response.val();
        const dates = Object.keys(data);
        let counter = 0;
        for (let i = 0; i < dates.length; i += 1) {
          counter += Object.keys(data[dates[i]]).length;
        }
        this.setState({
          num: counter,
        });
      });
  }

  render() {
    return (
      <Link to={CONTEST} style={{ textDecoration: 'none' }}>
        <div className="reviewWidget contestWidget">
          <div className="counterDisplay">{this.state.num}</div>
          <h1>Contested Questions</h1>
        </div>
      </Link>
    );
  }
}

export default ContestedQuestions;
