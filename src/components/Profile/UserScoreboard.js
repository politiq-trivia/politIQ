import React, { useContext, useState, useEffect } from "react";
import { AuthUserContext } from "../Auth";
import MediaQuery from "react-responsive";
import { withFirebase } from "../../firebase";
import LoadingGif from '../../6.gif';
import { useGetMoneyEarned } from "../hooks/useGetMoneyEarned"
import { useGetContestedQScore } from "../hooks/useGetContestedQScore"
import { useGetSubmittedQScore } from "../hooks/useGetSubmittedQScore"
import useLeaderboard from "../../hooks/useLeaderboard";
import { db } from '../../firebase'
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
const UserScoreboard = (props) => {
  const { monthlyScores, weeklyScores, politIQs } = useLeaderboard()

  const loadingGif = <center style={{ height: "150px" }}><img src={LoadingGif} alt="loading" style={{ maxWidth: '100%' }} /></center>

  const [usersMoney, usersMoneyEarned, loadingMoneyWon] = useGetMoneyEarned(props.uid) // use a hook to get user scores and data into a data frame
  const [contestedScore, loadingContestedScore] = useGetContestedQScore(props.uid) // use a hook to get user scores and data into a data frame
  const [submittedScore, loadingSubmittedScore] = useGetSubmittedQScore(props.uid) // use a hook to get user scores and data into a data frame

  const authUser = useContext(AuthUserContext)





  let content = <div>{loadingGif}</div>

  if (!(loadingMoneyWon || loadingContestedScore || loadingSubmittedScore)) {

    content =
      <div>
        <MediaQuery minWidth={416}>
          <div
            className="small-scoreboardHolder user-scoreboard-public"
            style={{
              justifyContent: "center",
              height: "auto",
              padding: "20px 20px 20px 18px"
            }}
          >
            <h2>
              {authUser.uid === props.uid ? "My Scores"  /// if authuser then "my" else find  user page displayname
                :
                'Scores'}
            </h2>
            <div className="userScore politIQ">
              PolitIQ
            <span className="s reg-score politIQ-score">
                {politIQs && politIQs[props.uid]}
              </span>
            </div>
            <div className="small-scoreboard">
              <div className="userScore">
                Weekly Score
              <span className="s reg-score">
                  {weeklyScores && weeklyScores && weeklyScores.filter(scoreObject => {
                    return scoreObject.uid === props.uid
                  })[0].weeklyScore}
                </span>
              </div>
              <div className="userScore">
                Monthly Score
              <span className="s reg-score">
                  {monthlyScores && monthlyScores.filter(scoreObject => {
                    return (scoreObject.uid === props.uid)
                  })[0].monthlyScore}
                </span>
              </div>
              <div className="userScore" id="submittedQScore">
                Contested and Submitted Q Score
              <span className="s"> {contestedScore + submittedScore}                          {// zero for now
                } </span>
              </div>
            </div>
            <div
              className="small-scoreboard"
              style={{ justifyContent: "center" }}
            >
              <div className="userScore second-row">
                Money Won
              <span className="s reg-score">${usersMoney}</span>
              </div>
              <div className="userScore second-row">
                Earnings
              <span className="s reg-score">
                  ${usersMoneyEarned}            {// zero for now
                  }
                </span>
              </div>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={415}>
          <div
            className="small-scoreboardHolder user-scoreboard-public"
            style={{
              justifyContent: "center",
              height: "auto",
              padding: "20px 20px 20px 18px"
            }}
          >
            <h2>
              {authUser.uid === props.uid ? "My"
                :
                'Scores'}
            </h2>
            <div className="userScore politIQ">
              PolitIQ
            <span className="s reg-score politIQ-score">
                {politIQs && politIQs[authUser.uid]}
              </span>
            </div>
            <div className="small-scoreboard">
              <div className="userScore">
                Weekly Score
              <span className="s reg-score">
                  {weeklyScores && weeklyScores && weeklyScores.filter(scoreObject => {
                    return scoreObject.uid === props.uid
                  })[0].weeklyScore}
                </span>
              </div>
              <div className="userScore">
                Monthly Score
              <span className="s reg-score">
                  {monthlyScores && monthlyScores.filter(scoreObject => {
                    return (scoreObject.uid === props.uid)
                  })[0].monthlyScore}
                </span>
              </div>
            </div>
            <div className="small-scoreboard">
              <div className="userScore" id="submittedQScore">
                Contested and Submitted Q Score
              <span className="s reg-score">
                  {contestedScore + submittedScore}                        {// zero for now
                  }
                </span>
              </div>
              <div className="userScore">
                Money Won
        <span className="s reg-score">${usersMoney}</span>
              </div>
            </div>
            <div
              className="small-scoreboard"
              style={{ justifyContent: "center" }}
            >
              <div className="userScore">
                Earnings
              <span className="s reg-score">
                  <span className="s reg-score">${usersMoneyEarned}</span> {// zero for now
                  }              </span>
              </div>
            </div>
          </div>
        </MediaQuery>
      </div>
  }

  return (<div>{content}</div>)

}


export default withFirebase(UserScoreboard);
