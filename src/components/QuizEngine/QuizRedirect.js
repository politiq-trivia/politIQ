import React from 'react';
import { Redirect } from 'react-router-dom';

const QuizRedirect = () => {
    const quizId = window.location.href.slice(26, window.location.href.length)
    return (
        <Redirect to={quizId} />
    )
}

export default QuizRedirect;
