import { db } from "../firebase";

export const storeQuizzes = async () => {
  await db.getQuizzes().then(response => {
    const data = response.val();
    if (data === null) {
      return "No quizzes available";
    }
    //localStorage.setItem('quizzes', JSON.stringify(data))
    //remove the quiz object from local storage
    localStorage.removeItem("quizzes");
  });
};
