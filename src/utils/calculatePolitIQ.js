// calculate a politIQ for a single user 
import { db } from '../firebase';

export const getPolitIQ = async (uid) => {
    // get all the quizzes
    const quizNum = await getQuizzes()
    if (quizNum === 0) {
        return 0;
    } else {
        const score = await getScores(uid)
        const politIQ = calculatePolitIQ(score, quizNum)
        return politIQ;
    }
}

const getQuizzes = async () => {
    let qNum;
    await db.getQuizzes()
        .then(response => {
            const data = response.val()
            const quizDates = Object.keys(data);
            let questionCounter = 0;
            for (let i = 0; i < quizDates.length; i++) {
                if (quizDates[i] > '2019-04-01T00:00') {
                    const quizLength = Object.keys(data[quizDates[i]]).length - 1
                    questionCounter += quizLength
                }
            }
            qNum = questionCounter;
        })
    return qNum;
}

const getScores = async (uid) => {
    const userScoreData = JSON.parse(localStorage.getItem('userScoreData'));
    const data = userScoreData.data
    let score = 0;
    const scoreDates = Object.keys(data);
    for (let i = 0; i < scoreDates.length; i++) {
        if (scoreDates[i] > '2019-04-01T00:00') {
            if(scoreDates[i] !== "submitted") {
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
