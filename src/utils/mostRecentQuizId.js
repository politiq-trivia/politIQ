import moment from "moment";
import { db } from "../firebase";

let scoreData;

const getMostRecentQuizId = async () => {
  // if there is score data
  if (
    localStorage.hasOwnProperty("authUser") &&
    localStorage.hasOwnProperty("userScoreData")
  ) {
    scoreData = JSON.parse(localStorage.getItem("userScoreData")).data;
    const reply = await getMostRecentQuizIdForUser(scoreData);
    return reply;
  } else {
    const response = await getMostRecentQuizIdForUser();
    return response;
  }
};

const getMostRecentQuizIdForUser = async (scoreData) => {
  // assume that data comes from local storage, but on first load this isn't true so need an edge case
  let allDates;
  if (localStorage.hasOwnProperty("quizzes")) {
    const data = await JSON.parse(localStorage.getItem("quizzes"));
    allDates = Object.keys(data);
  } else {
    await db.getQuizzes().then((response) => {
      const data = response.val();
      if (!data) return;
      allDates = Object.keys(data);
    });
  }

  if (!allDates) return;
  const dateArray = allDates.filter(
    (date) =>
      date < moment().format("YYYY-MM-DDTHH:mm") &&
      date >
        moment()
          .startOf("month")
          .format("YYYY-MM-DDTHH:mm")
  );
  if (dateArray.length === 0) {
    const id = "No Available Quizzes";
    return id;
  }
  let counter = 1;
  let mostRecent = dateArray[dateArray.length - counter];
  // if the user has scores, loop through those scores to find the first quiz they do not have a score for
  if (scoreData !== undefined && Object.keys(scoreData).length > 0) {
    while (scoreData[mostRecent] !== undefined && counter < dateArray.length) {
      counter++;
      mostRecent = dateArray[dateArray.length - counter];
      if (scoreData[mostRecent] === undefined) {
        break;
      }
    }
    if (
      counter === dateArray.length &&
      Object.keys(scoreData).indexOf(mostRecent) !== -1
    ) {
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
};

export default getMostRecentQuizId;
