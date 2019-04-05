import moment from 'moment';
import { db } from '../firebase';

let scoreData;

const getMostRecentQuizId = async () => {
    if (localStorage.hasOwnProperty('authUser')) {
        const uid = JSON.parse(localStorage.authUser).uid
        const scoreReply = db.getScoresByUid(uid)
            .then(async response => {
                scoreData = response.val()
                const reply = await getMostRecentQuizIdForUser(scoreData)
                return reply;
            })
        return scoreReply;
    } else {
        const response = await getMostRecentQuizIdForUser()
        return response;
    }

}

const getMostRecentQuizIdForUser = async (scoreData) => {
    const quizId = await db.getQuizzes()
        .then(response => {
            const data = response.val();
            const allDates = Object.keys(data);
            const dateArray = allDates.filter(date => date < moment().format('YYYY-MM-DDTHH:mm') && date > moment().startOf('month').format('YYYY-MM-DDTHH:mm'))
            if (dateArray.length === 0) {
                const id = "No Available Quizzes";
                return id;
            }
            let counter = 1;
            let mostRecent = dateArray[dateArray.length-counter]
            // if the user has scores, loop through those scores to find the first quiz they do not have a score for
            if (scoreData) {
                while(scoreData[mostRecent] && counter < dateArray.length) {
                    counter++;
                    mostRecent = dateArray[dateArray.length-counter]
                    if (scoreData[mostRecent === undefined]) {
                        console.log('this is breaking')
                        break;
                    }
                }
                if (counter === dateArray.length && Object.keys(scoreData).indexOf(mostRecent) !== -1) {
                    const id = "No Available Quizzes";
                    return id;
                } else {
                    const id = "quiz/" + mostRecent;
                    return id;
                }
            } else {
                const id = "quiz/" + mostRecent;
                return id;
            }
        })

    return quizId;
}

export default getMostRecentQuizId;