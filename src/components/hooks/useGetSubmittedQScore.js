

import React, { useEffect, useState, useContext } from 'react';
import { db } from '../../firebase';
import moment from 'moment'
import AuthUserContext from '../Auth/AuthUserContext';
import ScoreContext from '../context/scoreContext';

export const useGetSubmittedQScore = (userUid) => {
    const authUser = useContext(AuthUserContext)
    const [loadingSubmittedScore, setLoadingSubmittedScore] = useState(true)

    const [submittedScore, setSubmittedScore] = useState(0)



    useEffect(() => {
    const fetchedSubmittedQ = async () => {
            db.getSubmittedScoreByUid(userUid).then(res => {
                return (res.val()) //resolve promise
            }).then(result => {
                if (result === null) {
                    setSubmittedScore(0)
                } else {
                    setSubmittedScore(Object.values(result).reduce((a, b) => a + b, 0))
                }
            });

            setLoadingSubmittedScore(false)


        };
    fetchedSubmittedQ();
    }, [userUid])



    return [submittedScore, loadingSubmittedScore]
}

