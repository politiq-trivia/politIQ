import React from 'react';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';

import { REVIEW } from '../../constants/routes';

import './dashboard.css';

const QuestionsToReview = () => {
  return (
    <Link to={REVIEW} style={{ textDecoration: 'none' }}>
      <div className="reviewWidget">
        <div className="counterDisplay">{0}</div>
        <h1>Questions to be reviewed</h1>
      </div>
    </Link>
  )
}

export default QuestionsToReview;
