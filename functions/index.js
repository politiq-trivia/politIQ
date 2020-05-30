const functions = require('firebase-functions');
const admin = require('firebase-admin')
const moment = require('moment')
admin.initializeApp();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.calculateLeaderboardStatsAndPolitiqs = functions.pubsub.schedule('every 30 minutes').onRun(async () => {
    var flattenObject = function (ob) {
        var toReturn = {};

        for (var i in ob) {
            if (!ob.hasOwnProperty(i)) continue;

            if ((typeof ob[i]) == 'object') {
                var flatObject = flattenObject(ob[i]);
                for (var x in flatObject) {
                    if (!flatObject.hasOwnProperty(x)) continue;

                    toReturn[x] = flatObject[x];
                }
            } else {
                toReturn[i] = ob[i];
            }
        }
        return toReturn;
    }
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

    console.log('function ran')

    // Read Scores
    const scores = await admin.database().ref(`/scores`).once('value').then(results => {
        return results.val()
    }).catch(err => {
        console.err(err)
    });

    const users = await admin.database().ref("users").once("value").then(results => {
        return results.val()
    }).catch(err => {
        console.err(err)
    });

    const getScoresAndWriteToDatabase = (users, scores) => {
        let userObjectArray = Object.keys(scores).map(key => {
            return ({ user: key, scores: scores[key] })
        })

        // add display name to allUserScoresArray

        userObjectArray = userObjectArray.map(userObject => {
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
        const allRecentScores = userObjectArray.map(userObject => {    // O(n)

            if (Object.keys(userObject.scores).length < 1) {  //User has no scores recorded
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
            if (Object.keys(userObject.scores).length >= 1) {

                // need to flatten object             

                const flatScores = flattenObject(userObject.scores)

                // For each quiz data
                var allQuizDatesScores = Object.keys(flatScores)  // THIS OMITS SUBMITTED OBJECT (MAY NEED TO CHANGE LATER)
                    .reduce((obj, key) => {
                        obj[key] = flatScores[key];
                        return obj;
                    }, {});

                var monthlyQuizDatesScores = Object.keys(flatScores)  // filter quizzes dates by this month
                    .filter(key => moment(key) > startOfMonth)
                    .reduce((obj, key) => {
                        obj[key] = flatScores[key];
                        return obj;
                    }, {});

                var weeklyQuizDatesScores = Object.keys(flatScores)  // filter quizzes dates by this week
                    .filter(key => moment(key) > startOfWeek)
                    .reduce((obj, key) => {
                        obj[key] = flatScores[key];
                        return obj;
                    }, {});

                var lastWeekQuizDatesScores = Object.keys(flatScores)  // filter quizzes dates by last week
                    .filter(key => moment(key) > startOfLastWeek && moment(key) < endOfLastWeek)
                    .reduce((obj, key) => {
                        obj[key] = flatScores[key];
                        return obj;
                    }, {});

                var lastMonthQuizDatesScores = Object.keys(flatScores)  // filter quizzes dates by last Month
                    .filter(key => moment(key) > startOfLastMonth && moment(key) < endOfLastMonth)
                    .reduce((obj, key) => {
                        obj[key] = flatScores[key];
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
        })


        // POLITIQ CALCULATION
        var politicalIntelligence = allRecentScores.map(userObj => {
            return (userObj.politicalIntelligence)
        })
        var numberOfQuizzesTakenByUser = allRecentScores.map(userObj => {
            return (userObj.numberOfQuizzesTaken)
        })
        const linReg = linearRegression(politicalIntelligence, numberOfQuizzesTakenByUser);


        //Linear regression for politiq
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

        //  grab user ranks for week and month
        var tempMonthlyScores = [...tempAllRecentScores].sort(({ monthlyScore: a }, { monthlyScore: b }) => b - a)
        var tempWeeklyScores = [...tempAllRecentScores].sort(({ weeklyScore: a }, { weeklyScore: b }) => b - a)


        // setUserRanks(authUser !== null ? {
        //     weekRank: tempWeeklyScores.map(function (x) { return x.uid; }).indexOf(authUser.uid) + 1,
        //     monthRank: tempMonthlyScores.map(function (x) { return x.uid; }).indexOf(authUser.uid) + 1
        // } : { weekRank: null, monthRank: null }
        // )
        var politIQs = tempAllRecentScores.map(userObject => { return { uid: userObject.uid, politIQ: userObject.politIQ } }).reduce((obj, item) => (obj[item.uid] = item.politIQ, obj), {});

        admin.database().ref(`/leaderboard/MonthlyScores`).set(tempMonthlyScores)
        admin.database().ref(`/leaderboard/WeeklyScores`).set(tempWeeklyScores)
        admin.database().ref(`/leaderboard/LastWeekScores`).set([...tempAllRecentScores].sort(({ lastWeekScore: a }, { lastWeekScore: b }) => b - a).slice(0, 3))
        admin.database().ref(`/leaderboard/LastMonthScores`).set([...tempAllRecentScores].sort(({ lastMonthScore: a }, { lastMonthScore: b }) => b - a).slice(0, 3))
        admin.database().ref(`/leaderboard/AffiliationScores`).set({ repPolitIQ, demPolitIQ, indPolitIQ })
        admin.database().ref(`/politIQ`).set(politIQs)
    }

    getScoresAndWriteToDatabase(users, scores)
}
)

