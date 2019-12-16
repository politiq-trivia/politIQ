import { db } from '../firebase';
// calculate a politIQ for a single user 

export const getPolitIQ = async (uid, timeframe, quizzes) => {


    // get all the quizzes
    const quizNum = await getQuizzes(quizzes)
    if (quizNum === 0) {
        return 0;
    } else {
        let allScores = [];
        if (!matchesLoggedInUser(uid)) {

            if (localStorage.hasOwnProperty('allScores')) {
                allScores = JSON.parse(localStorage.getItem('allScores')).data
            } else {
                let scores = []
                await db.getScores()
                    .then(response => {
                        const data = response.val()
                        const uids = Object.keys(data)
                        uids.forEach((user, i) => {
                            const dates = Object.keys(data[uids[i]])
                            for (let k = 0; k < dates.length; k++) {
                                if (dates[k] >= '2019-04-01T00:00') {
                                    scores.push({ user, data: data[uids[i]] })
                                    return;
                                }
                            }
                        })
                    }).then(() => {
                        allScores = {
                            data: scores
                        }
                    })
            }
        }
        const score = await getScores(uid, allScores)
        const politIQ = calculatePolitIQ(score, quizNum)

        return politIQ;
    }
}


const getQuizzes = async (data) => {
    let qNum;

    /*     const data = JSON.parse(localStorage.getItem('quizzes'))*/
    if (data === null || data === undefined) return;
    const quizDates = Object.keys(data);
    let questionCounter = 0;
    for (let i = 0; i < quizDates.length; i++) {
        if (quizDates[i] > '2019-04-01T00:00') {
            const quizLength = Object.keys(data[quizDates[i]]).length - 1
            questionCounter += quizLength
        }
    }
    qNum = questionCounter;
    return qNum;
}

const getScores = async (uid, allScores) => {
    let data;
    // check if the uid = logged in user. if it does, get the score data from userScoreData
    if (matchesLoggedInUser(uid)) {
        const userScoreData = JSON.parse(localStorage.getItem('userScoreData'));
        data = userScoreData.data
        // else, get the score data from allScores data
    } else {
        // find the data that matches up with the uid
        // find the index of that uid
        let uidArray = []
        for (let i = 0; i < allScores.length; i++) {
            uidArray.push(allScores[i].user)
        }
        const index = uidArray.indexOf(uid)
        if (index !== -1) {
            data = allScores[index].data
        }

    }

    let score = 0;

    if (data === null || data === undefined) {
        return score = 0;
    }
    const scoreDates = Object.keys(data);
    for (let i = 0; i < scoreDates.length; i++) {
        if (scoreDates[i] > '2019-04-01T00:00') {
            if (scoreDates[i] !== "submitted") {
                // this one adds up the total score
                score += data[scoreDates[i]]
            }
        }
    }
    return score;
}

const calculatePolitIQ = (score, quizNum) => {
    const politIQ = Math.round((score / quizNum) * 100);
    return politIQ;
}

const matchesLoggedInUser = (uid) => {
    if (localStorage.hasOwnProperty('authUser')) {
        const authUser = JSON.parse(localStorage.getItem('authUser')).uid
        if (uid === authUser) {
            return true;
        } else return false;
    }
}
