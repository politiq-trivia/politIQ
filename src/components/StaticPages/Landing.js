import React, { useState, useEffect } from "react";

import Paper from "@material-ui/core/Paper";

import Button from "@material-ui/core/Button";
import bg from "./politiq-bg2.jpg";

import { NavLink } from "react-router-dom";
import "./Static.css";
import { storage } from "../../firebase/firebase";
import YouTubePlayer from "react-player/lib/players/YouTube";
import poster from "../didyouknow.png";
import { db } from "../../firebase";

const LandingPage = () => {
  const [quizDate, setQuizDate] = useState("");
  const [videoDownload, setVideoDownload] = useState(null);
  useEffect(() => {
    // get most recent quiz date not in future
    const fetchQuiz = async () => {
      db.getMostRecentQuizDate()
        .then((res) => {
          return res.val(); // resolve promise
        })
        .then((quizDate) => {
          if (!quizDate) return;
          setQuizDate(Object.keys(quizDate)[0]);
        });
    };
    const fetchVideo = async () => {
      storage
        .ref("videos/PolitIQ_Final.mp4")
        .getDownloadURL()
        .then(function(url) {
          setVideoDownload(url);
        })
        .catch(function(error) {
          // Handle any errors
          console.error(error);
        });
    };
    fetchQuiz();
    fetchVideo();
  }, []);

  const video = videoDownload ? (
    <video
      className="homepageVideo"
      style={{ width: "90%" }}
      controls
      poster={poster}
    >
      <source src={videoDownload} type="video/mp4" />
    </video>
  ) : null;

  return (
    <Paper className="home-holder">
      <div className="welcomeHolder">
        <div className="welcomeBlock">
          <h1 id="main">
            Welcome to polit<span id="iq">IQ</span>
          </h1>
          <h2 style={{ fontSize: "20px", marginBottom: "40px" }}>
            where you can answer the question...{" "}
          </h2>

          <img
            src={bg}
            id="bg-image"
            alt="democrats and republicans face off"
          />

          <h2 style={{ marginBottom: "40px" }}>Are you smarter than a: </h2>
          <div className="title anim-h1">
            <span>Republican?</span>
          </div>

          <div className="title anim-h2">
            <span>Democrat?</span>
          </div>
          <div className="title anim-h3">
            <span>Independent?</span>
          </div>
        </div>
        <div className="welcomeBlock">
          <div className="homepageVideoHolder">{video}</div>
        </div>
      </div>
      <div className="home-description">
        <h4> INTERESTED IN POLITICS AND CONSTANTLY CONSUMED BY THE NEWS?</h4>
        <p>
          Test your understanding of today’s political climate by answering as
          many questions as you can on a variety of topics related to national
          politics and global affairs. Then compare your score, or political IQ,
          with others to prove that you and your political party are the most
          informed.
        </p>
      </div>

      <div className="how-it-works">
        <h2>
          HOW <span id="it-works">IT WORKS</span>
        </h2>
        <div className="icon-holder">
          <NavLink
            to="/signup"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="icon-div">
              <i className="fas fa-user icon"></i>
              <h6>Create a Free Profile</h6>
              <p>Sign up and create your user profile, it’s very easy.</p>
            </div>
          </NavLink>
          <NavLink
            to={`/quiz/${quizDate}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="icon-div">
              <i className="fas fa-pen-square icon"></i>
              <h6>Start Playing</h6>
              <p>
                Answer on your own time. New questions added daily and expire at
                the end of each month.
              </p>
            </div>
          </NavLink>

          <div className="icon-div">
            <i className="fas fa-clipboard icon"></i>
            <h6>Increase Score</h6>
            <p>
              <span style={{ fontWeight: "bold" }}>1 point</span> for correct
              answers, <span style={{ fontWeight: "bold" }}>0 points</span> for
              incorrect answers.
            </p>
          </div>
          <div className="icon-div">
            <i className="fas fa-gift icon"></i>
            <h6>Get Awarded</h6>
            <p>
              Players with highest scores eligible to compete in monthly
              challenge for cash prize!
            </p>
          </div>
        </div>
      </div>

      <div className="home-description2">
        <h4>
          THINK <span style={{ color: "#a54ee8" }}>ITS BIASED?</span> CONTEST A
          QUESTION OR ADD ONE OF YOUR OWN AND{" "}
          <span style={{ color: "#a54ee8" }}>WIN POINTS</span>
        </h4>
        <p>
          If you believe the answer to a question is incorrect, then submit your
          argument (with a valid source) and you will receive an additional{" "}
          <span style={{ fontWeight: "bold" }}>2 points</span> and the question
          will be fixed. If you wish to submit your own question to be included
          on the site, you can receive an additional{" "}
          <span style={{ fontWeight: "bold" }}>3 points</span> (depending upon
          approval of its content and validity). All are welcome to contribute!
        </p>
        <NavLink
          style={{ textDecoration: "none", color: "inherit" }}
          to={`/quiz/${quizDate}`}
        >
          <Button color="primary" variant="contained" size="large">
            Click Here to Start Playing
          </Button>
        </NavLink>
      </div>
    </Paper>
  );
};

export default LandingPage;
