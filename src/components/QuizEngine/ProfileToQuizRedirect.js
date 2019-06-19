import React from 'react';
import { Redirect } from 'react-router-dom';

const ProfileToQuizRedirect = () => {
    const quizId = window.location.href.slice(29, window.location.href.length)
    return (
        <Redirect to={quizId} />
    )
}

export default ProfileToQuizRedirect;