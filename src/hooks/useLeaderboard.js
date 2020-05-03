
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';


const useLeaderboard = (uid) => {

    const [monthlyScores, setMonthlyScores] = useState(null)
    const [weeklyScores, setWeeklyScores] = useState(null)
    const [lastMonthScores, setLastMonthScores] = useState(null)
    const [lastWeekScores, setLastWeekScores] = useState(null)
    const [affiliationScores, setAffiliationScores] = useState(null)
    const [politIQs, setPolitIQs] = useState(null)

    useEffect(() => {
        const getLeaderboard = async () => {
            await db.getMonthlyScores().then(res => { return res.val() }).then(val => { setMonthlyScores(val) })
            await db.getWeeklyScores().then(res => { return res.val() }).then(val => { setWeeklyScores(val) })
            await db.getLastWeekScores().then(res => { return res.val() }).then(val => { setLastWeekScores(val) })
            await db.getLastMonthScores().then(res => { return res.val() }).then(val => { setLastMonthScores(val) })
            await db.getAffiliationScores().then(res => { return res.val() }).then(val => { setAffiliationScores(val) })
            await db.getPolitIqs().then(res => { return res.val() }).then(val => { setPolitIQs(val) })

        }
        getLeaderboard()

    }, [])




    return { politIQs, affiliationScores, monthlyScores, weeklyScores, lastWeekScores, lastMonthScores }
}

export default useLeaderboard