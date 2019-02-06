import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { QUIZ_ARCHIVE, LEADERBOARD, SIGN_UP, SUBMIT_QUESTION } from '../../constants/routes';
import NextAvailableQuizButton from './NextAvailableQuizButton';

// change this back into stateless component 

// continuous loading
// load the next quiz the user not taken (similar to the take today's quiz button)

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
                    <div style={{ marginTop: '2vh', marginBottom: '5vh'}}>Your score: {score} out of {quizLength} points.</div>
                    <div className="finish-quiz-buttons">
                        <NextAvailableQuizButton getNextQuiz={this.props.getNextQuiz} uid={uid}/>
                        <Link to={QUIZ_ARCHIVE} style={{textDecoration: "none" }}><Button color="primary" variant="contained" className="end-button">View Quiz Archive</Button></Link>
                        <Link to={LEADERBOARD} style={{textDecoration: "none" }}><Button color="primary" variant="contained" className="end-button">View Leaderboard</Button></Link>
                        <Button color="primary" variant="contained" onClick={toggleContest} className="end-button">Contest a Question</Button>
                        <Link to={SUBMIT_QUESTION} style={{ textDecoration: 'none' }}><Button color="primary" variant="contained" className="end-button">Submit Your Own Question</Button> </Link>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="finish-quiz">
                    <div style={{ marginTop: '2vh', marginBottom: '5vh' }}>Your score: {score} out of {quizLength} points.</div>
                    <div className="finish-quiz-buttons">
                        <NextAvailableQuizButton getNextQuiz={this.props.getNextQuiz}/>
                        <Link to={SIGN_UP} style={{ textDecoration: 'none' }}><Button color="primary" variant="contained" className="end-button">Sign Up to Save Your Score</Button></Link>
                        <Link to={QUIZ_ARCHIVE} style={{textDecoration: "none"}}><Button color="primary" variant="contained" className="end-button">View Quiz Archive</Button></Link>
                    </div>
                </div>
            )
        }
    }
}

export default FinishQuiz;