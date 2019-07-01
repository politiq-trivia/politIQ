import moment from 'moment';
import { db } from '../firebase'; 

// get the scores for all users for the last month
// save to local storage
// called on leaderboard load only
export const getThisMonthScores = async () => {
    let currentMonthScores = [];
    await db.getScores()
        .then(response => {
            const data = response.val()
            if (data === null) {
                return 'No scores available'
            }

            // want to filter first to make sure the scores come from the last
            // two months, in case there are inactive users
            // the leaderboard should only make db calls for the names of the 15 top users (between weekly and monthly)
            const usernames = Object.keys(data)
            usernames.forEach((user, i) => {
                const dates = Object.keys(data[usernames[i]])
                // TO DO: recactor this so it doesn't use two loops - not very performant
                // check if the date falls within the last month for current scores
                for (let j = 0; j < dates.length; j ++) {
                    if (dates[j] >= moment().startOf('month').format('YYYY-MM-DDTHH:mm') && dates[j] !== 'submitted') {
                        // once you find one score in the current month, push the whole user object into the current month object
                        // then return, since otherwise it will happen more than once
                        currentMonthScores.push({user, data: data[usernames[i]]})
                        return;
                    }
                }

            })
        }).then(() => {
            // store the data
            store({ currentMonthScores })
        })
    return currentMonthScores;
}

export const getLastMonthScores = async () => {
    let lastMonthScores = [];
    await db.getScores()
        .then(response => {
            const data = response.val()
            if (data === null) {
                return 'No scores available'
            }

            const usernames = Object.keys(data)
            usernames.forEach((user, i) => {
                const dates = Object.keys(data[usernames[i]])
                // check if the date falls within the last two months for last month's high scores
                for (let k = 0; k < dates.length; k++) {
                    if (dates[k] >= moment().startOf('month').subtract(1, 'month').format('YYYY-MM-DDTHH:mm') && dates[k] !== 'submitted') {
                        lastMonthScores.push({user, data: data[usernames[i]]})
                    return;
                    }
                }
            })
        }).then(() => {
            store({ lastMonthScores })
        })
}

// get all the scores for the current user (all time)
// store the data
// this should be called on app load and every time the user submits a score
export const getUserScores = (uid) => {
    db.getScoresByUid(uid)
        .then(response => {
            const userScoreData = response.val()
            if (userScoreData === null) {
                return "No scores available"
            }
            store({ userScoreData })
        })
}




// store data in the cache
const store = (data) => {
    const nameOfData = Object.keys(data)[0]
    const valueOfData = Object.values(data)[0]
    // valueOfData.lastUpdated = moment().format('YYYY-MM-DDTHH:mm')
    // console.log(valueOfData, 'this is the value of Data')
    const toStore = {
        data: valueOfData,
        lastUpdated: moment().format('YYYY-MM-DDTHH:mm')
    }
    localStorage.setItem(nameOfData, JSON.stringify(toStore))
}