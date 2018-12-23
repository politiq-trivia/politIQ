import React, { Component } from 'react';
import { db } from '../../firebase';

import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { QUIZ_ARCHIVE, LEADERBOARD, HOME, SIGN_UP } from '../../constants/routes';

// change this back into stateless component 

class FinishQuiz extends Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps === this.props) {
            return false
        } else {
            return true;
        }
    }

    render() {
        const { uid, score, quizLength, toggleContest } = this.props;
        if (uid !== '') {
            return (
                <div className="finish-quiz">
                    <div style={{ marginTop: '2vh'}}>Your score: {score} out of {quizLength} points.</div>
                    <Link to={QUIZ_ARCHIVE} style={{textDecoration: "none"}}><Button color="primary" variant="contained">Take Another Quiz</Button></Link>
                    <Button color="primary" variant="contained" onClick={toggleContest}>Contest a Question</Button>
                    <Link to={LEADERBOARD} style={{textDecoration: "none"}}><Button color="primary" variant="contained">View Leaderboard</Button></Link>
                    <Link to={HOME} style={{textDecoration: "none"}}><Button color="primary" variant="contained">Back to Dashboard</Button></Link>
                </div>
            )
        } else {
            return (
                <div className="finish-quiz">
                    <div style={{ marginTop: '2vh' }}>Your score: {score} out of {quizLength} points.</div>
                    <Link to={SIGN_UP} style={{ textDecoration: 'none' }}><Button color="primary" variant="contained">Sign Up to Save Your Score</Button></Link>
                    <Link to={QUIZ_ARCHIVE} style={{textDecoration: "none"}}><Button color="primary" variant="contained">Take Another Quiz</Button></Link>
                </div>
            )
        }
    }
}

export default FinishQuiz;