import React from 'react';

import Paper from '@material-ui/core/Paper';

const QuizRedirect = (props) => {
    let quizId = window.location.href.slice(26, window.location.href.length)

    // also need to check if the logged in user has already taken that quiz
    const loggedIn = localStorage.hasOwnProperty('authUser');
    if (loggedIn) {
        // check for a score on that date
        const userScores = JSON.parse(localStorage.getItem('userScoreData')).data
        if (Object.keys(userScores).includes(quizId)) {
            props.history.push('/No%20Available%20Quizzes')
        }
    } else {
        props.history.push(`/quiz/${quizId}`)
    }

    return (
        <Paper className="homeHolder">
            <h1>Fetching the latest quiz...</h1>
        </Paper>
    )
}

export default QuizRedirect;
