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
    let quizNum;
    await db.getQuizzes()
        .then(response => {
            const data = response.val()
            const quizDates = Object.keys(data);
            const fromSelectedRange = [];
            for (let i = 0; i < quizDates.length; i++) {
                // if (quizDates[i] > moment().startOf(timeframe).format('YYYY-MM-DD')) {
                    fromSelectedRange.push(quizDates[i])
                // }
            }
            quizNum = fromSelectedRange.length;
        })
    return quizNum;
}

const getScores = async (uid) => {
    const scoreCounter = await db.getScoresByUid(uid)
        .then(response => {
            let score = 0;
            const data = response.val();
            if (data === null) {
                return;
            } else {
                const scoreDates = Object.keys(data);
                for (let i = 0; i < scoreDates.length; i++) {
                    // if (scoreDates[i] > moment().startOf(timeframe).format('YYYY-MM-DD')) {
                        if(scoreDates[i] !== "submitted") {
                            score += data[scoreDates[i]]
                        }
                    // }
                }
            }
            return score;
        })
    return scoreCounter;
}

const calculatePolitIQ = (score, quizNum) => {
    const qNum = 5;
    const averageScore = score / qNum;
    const politIQ = Math.round((averageScore / quizNum) * 100);

    return politIQ;
}
