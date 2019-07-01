import moment from 'moment';

let scoreData;

const getMostRecentQuizId = async () => {
    if (localStorage.hasOwnProperty('authUser')) {
        scoreData = JSON.parse(localStorage.getItem('userScoreData'))
        const reply = await getMostRecentQuizIdForUser(scoreData)
        return reply;
    } else {
        const response = await getMostRecentQuizIdForUser()
        return response;
    }
}

const getMostRecentQuizIdForUser = async (scoreData) => {
    const data = JSON.parse(localStorage.getItem('quizzes'))
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
}

export default getMostRecentQuizId;