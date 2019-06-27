import React from 'react';
import { Redirect } from 'react-router-dom';

const QuizRedirect = () => {
    let quizId;
    if (window.location.href.includes('rssQuiz')) {
        quizId = '/quiz/' + window.location.href.slice(30, window.location.href.length)
    } else {
        quizId = window.location.href.slice(26, window.location.href.length)
    }
    // repurpose this to also work with the rss redirect
    // const quizId = 
    console.log(quizId, 'this is quizId in the redirect component')
    return (
        // <div>hi</div>
        <Redirect to={{
            pathname: quizId
        }} />
    )
}

export default QuizRedirect;
