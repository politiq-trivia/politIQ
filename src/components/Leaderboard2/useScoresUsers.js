
import React, { useEffect, useState, useContext } from 'react';
import { db } from '../../firebase';
import moment from 'moment'
import AuthUserContext from '../Auth/AuthUserContext';

export const useScoresUsers = () => {
    const authUser = useContext(AuthUserContext)

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)
    const [allRecentScores, setAllRecentScores] = useState([])

    const [userRanks, setUserRanks] = useState({})
    const [users, setUsers] = useState({})

    const [politIQs, setPolitIQs] = useState({})
    const [monthlyScores, setMonthlyScores] = useState([])
    const [weeklyScores, setWeeklyScores] = useState([])
    const [lastWeekScores, setLastWeekScores] = useState([])
    const [lastMonthScores, setLastMonthScores] = useState([])



    function linearRegression(y, x) {  // linear regression function to find LLS fit of intelligence and #quizzestaken
        var lr = {};
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {

            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i] * y[i]);
            sum_xx += (x[i] * x[i]);
            sum_yy += (y[i] * y[i]);
        }

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
        lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

        return lr;
    }




    useEffect(() => {



        const runCalculationScoresUsers = async () => {
            try {

                const users = await db.onceGetUsers();  // can't store users in local Storage

                // Need to get new scores if haven't in the last 2 minutes
                let scores = JSON.parse(localStorage.getItem("allScores"))
                const lastLeaderboardUpdate = JSON.parse(localStorage.getItem("lastLeaderboardUpdate"))
                if (lastLeaderboardUpdate) {  // leaderboard has been populated before
                    if (moment(lastLeaderboardUpdate) < moment().subtract(2, 'minutes')) {  // Leaderboard data is old by 2 minutes or more, needs to update
                        var tempScores = await db.getScores();
                        scores = tempScores.val()
                        localStorage.setItem('lastLeaderboardUpdate', JSON.stringify(moment().format("YYYY-MM-DDTHH:mm")))
                        localStorage.setItem('allScores', JSON.stringify(scores))
                    }
                } else { //leaderboard has not been populated yet
                    var tempScores = await db.getScores();
                    scores = tempScores.val()
                    localStorage.setItem('lastLeaderboardUpdate', JSON.stringify(moment().format("YYYY-MM-DDTHH:mm")))
                    localStorage.setItem('allScores', JSON.stringify(scores))
                }
                findScores(users.val(), scores)  // Important function
            } catch (error) {
                setError(true);
            }
        };

        runCalculationScoresUsers();

    }, []);


    useEffect(() => { // 2nd step, POlitiq calculations,  get top users in each respectable category, get user rank
        if (allRecentScores.length === 0) { } else { // don't run first time page loads
            // POLITIQ CALCULATION

            var polInt = allRecentScores.map(userObj => {
                return (userObj.politicalIntelligence)
            })
            var numQuizzes = allRecentScores.map(userObj => {
                return (userObj.numberOfQuizzesTaken)
            })
            const linReg = linearRegression(polInt, numQuizzes);


            var tempAllRecentScores = allRecentScores.map(userObj => {
                userObj.politIQ = Math.round(20 * (userObj.politicalIntelligence / (userObj.numberOfQuizzesTaken * linReg.slope + linReg.intercept)))
                return userObj
            })

            // get average political IQ's of each party
            // this is the sum of all republican politiqIQ divided by the number of republican users
            var repPolitIQ = Math.round([...tempAllRecentScores].filter(userObj => userObj.affiliation === "Republican").map(userObj => {
                return (userObj.politIQ)
            }).reduce((a, b) => a + b, 0) / [...tempAllRecentScores].filter(userObj => userObj.affiliation === "Republican").length)

            // this is the sum of all Democrat politiqIQ divided by the number of Democrat users
            var demPolitIQ = Math.round([...tempAllRecentScores].filter(userObj => userObj.affiliation === "Democrat").map(userObj => {
                return (userObj.politIQ)
            }).reduce((a, b) => a + b, 0) / [...tempAllRecentScores].filter(userObj => userObj.affiliation === "Democrat").length)

            // this is the sum of all Independent politiqIQ divided by the number of Independent users
            var indPolitIQ = Math.round([...tempAllRecentScores].filter(userObj => userObj.affiliation === "Independent").map(userObj => {
                return (userObj.politIQ)
            }).reduce((a, b) => a + b, 0) / [...tempAllRecentScores].filter(userObj => userObj.affiliation === "Independent").length)


            setPolitIQs({ repPolitIQ, demPolitIQ, indPolitIQ })


            //  grab user ranks for week and month
            var tempMonthlyScores = [...tempAllRecentScores].sort(({ monthlyScore: a }, { monthlyScore: b }) => b - a)
            var tempWeeklyScores = [...tempAllRecentScores].sort(({ weeklyScore: a }, { weeklyScore: b }) => b - a)

            setUserRanks(authUser !== null ? {
                weekRank: tempWeeklyScores.map(function (x) { return x.uid; }).indexOf(authUser.uid) + 1,
                monthRank: tempMonthlyScores.map(function (x) { return x.uid; }).indexOf(authUser.uid) + 1
            } : { weekRank: null, monthRank: null }
            )


            setMonthlyScores(tempMonthlyScores.slice(0, 10))
            setWeeklyScores(tempWeeklyScores.slice(0, 10))
            setLastWeekScores([...tempAllRecentScores].sort(({ lastWeekScore: a }, { lastWeekScore: b }) => b - a).slice(0, 3))
            setLastMonthScores([...tempAllRecentScores].sort(({ lastMonthScore: a }, { lastMonthScore: b }) => b - a).slice(0, 3))
        }
    }, [allRecentScores])


    const findScores = (users, scores) => {

        // Get array with all user names and scores
        /*      let allUserScoreArray = JSON.parse(scores).data
      */


        let allUserScoreArray = Object.keys(scores).map(key => {
            return ({ user: key, data: scores[key] })
        })

        // add display name to allUserScoresArray

        allUserScoreArray = allUserScoreArray.map(userObject => {
            if (typeof users[userObject.user] === "undefined") {
                userObject.displayName = ""
                userObject.affiliation = ""
                return (userObject)

            } else {

                userObject.displayName = users[userObject.user].displayName
                userObject.affiliation = users[userObject.user].affiliation

                return (userObject)
            }
        });


        const startOfMonth = moment().startOf('month')
        const startOfWeek = moment().startOf('isoWeek')
        const endOfLastMonth = moment().subtract(1, 'months').endOf('month')
        const startOfLastMonth = moment().subtract(1, 'months').startOf('month')
        const endOfLastWeek = moment().subtract(1, 'weeks').endOf('isoWeek')
        const startOfLastWeek = moment().subtract(1, 'weeks').startOf('isoWeek')



        /*          get all recent scores     */
        setAllRecentScores(allUserScoreArray.map(userObject => {    // O(n)

            if (Object.keys(userObject.data).length < 1) {  //User has no scores recorded
                return ({
                    displayName: userObject.displayName,
                    uid: userObject.user,
                    monthlyScore: 0,
                    weeklyScore: 0,
                    lastMonthScore: 0,
                    lastWeekScore: 0,
                    politicalIntelligence: 0,
                    numberOfQuizzesTaken: 0,
                })
            }
            // if number of quiz scores is 2 or greater
            if (Object.keys(userObject.data).length >= 1) {
                // For each quiz date
                var allQuizDatesScores = Object.keys(userObject.data)
                    .filter(key => key !== "submitted")     // THIS OMITS SUBMITTED OBJECT (MAY NEED TO CHANGE LATER)
                    .reduce((obj, key) => {
                        obj[key] = userObject.data[key];
                        return obj;
                    }, {});

                var monthlyQuizDatesScores = Object.keys(userObject.data)  // filter quizzes dates by this month
                    .filter(key => moment(key) > startOfMonth)
                    .reduce((obj, key) => {
                        obj[key] = userObject.data[key];
                        return obj;
                    }, {});

                var weeklyQuizDatesScores = Object.keys(userObject.data)  // filter quizzes dates by this week
                    .filter(key => moment(key) > startOfWeek)
                    .reduce((obj, key) => {
                        obj[key] = userObject.data[key];
                        return obj;
                    }, {});

                var lastWeekQuizDatesScores = Object.keys(userObject.data)  // filter quizzes dates by last week
                    .filter(key => moment(key) > startOfLastWeek && moment(key) < endOfLastWeek)
                    .reduce((obj, key) => {
                        obj[key] = userObject.data[key];
                        return obj;
                    }, {});

                var lastMonthQuizDatesScores = Object.keys(userObject.data)  // filter quizzes dates by last Month
                    .filter(key => moment(key) > startOfLastMonth && moment(key) < endOfLastMonth)
                    .reduce((obj, key) => {
                        obj[key] = userObject.data[key];
                        return obj;
                    }, {});


                // if score objects are empty, make sure they fit the format of other score objects
                if (Object.keys(monthlyQuizDatesScores).length === 0) {
                    monthlyQuizDatesScores = { temp: 0 }
                } else if (Object.keys(weeklyQuizDatesScores).length === 0) {
                    weeklyQuizDatesScores = { temp: 0 }
                } else if (Object.keys(allQuizDatesScores).length === 0) {
                    allQuizDatesScores = { temp: 0 }
                } else if (Object.keys(lastMonthQuizDatesScores).length === 0) {
                    lastMonthQuizDatesScores = { temp: 0 }
                } else if (Object.keys(lastWeekQuizDatesScores).length === 0) {
                    lastWeekQuizDatesScores = { temp: 0 }
                }

                return ({
                    displayName: userObject.displayName,
                    affiliation: userObject.affiliation,
                    uid: userObject.user,
                    monthlyScore: Object.values(monthlyQuizDatesScores).reduce((a, b) => a + b, 0), // sum of this month
                    weeklyScore: Object.values(weeklyQuizDatesScores).reduce((a, b) => a + b, 0), // sum of this week
                    lastMonthScore: Object.values(lastMonthQuizDatesScores).reduce((a, b) => a + b, 0), // sum of last month
                    lastWeekScore: Object.values(lastWeekQuizDatesScores).reduce((a, b) => a + b, 0), // sum of last week
                    politicalIntelligence: Math.round((Object.values(allQuizDatesScores).reduce((a, b) => a + b, 0) * 100) / Object.keys(allQuizDatesScores).length),
                    numberOfQuizzesTaken: Object.keys(allQuizDatesScores).length,
                })


            }
        }))





        setLoading(false)

    }



    return [allRecentScores, politIQs, monthlyScores, weeklyScores, lastWeekScores, lastMonthScores, userRanks, loading]
}