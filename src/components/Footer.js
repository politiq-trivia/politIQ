import React, { Component } from "react";

import { Link } from "react-router-dom";
import * as routes from "../constants/routes";
import getMostRecentQuizId from "../utils/mostRecentQuizId";

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from "react-share";

import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
  EmailIcon,
} from "react-share";

const getHref = () => {
  return window.location.href.toString();
};

const isFixed = () => {
  const path = window.location.pathname;
  if (path === "/profile") {
    return {
      position: "fixed",
    };
  } else {
    return {
      position: "relative",
    };
  }
};

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mostRecentQuizURL: "",
      noQuizzes: false,
    };
  }

  componentDidMount() {
    this.getMostRecentQuizId();
  }

  getMostRecentQuizId = async () => {
    const quizId = await getMostRecentQuizId();
    if (quizId === "No Available Quizzes") {
      this.setState({
        noQuizzes: true,
      });
    } else {
      this.setState({
        mostRecentQuizURL: quizId,
      });
    }

    // await db.getQuizzes()
    //   .then(response => {
    //     if (response.val() !== null) {
    //       const data = response.val();
    //       const dateArray = Object.keys(data);
    //       const mostRecent = dateArray[dateArray.length-1]

    //       this.setState({
    //         mostRecentQuizURL: "quiz/" + mostRecent
    //       })

    //     }
    //   })
  };

  render() {
    return (
      <div className="footer" style={isFixed()}>
        {localStorage.hasOwnProperty("authUser") ? (
          <div className="description">
            <h3>Find some news we should include?</h3>
            <p>
              Increase your score by clicking the link below to submit your own
              question. We'll review it and, if accepted, we'll add it to the
              quiz. Make sure to include a reliable source for your information!
            </p>
            <Link to={routes.SUBMIT_QUESTION}>Submit a Question Now</Link>
          </div>
        ) : (
          <div className="description">
            <h3>About Us</h3>
            <p>
              In an effort to combat polarization and improve the dialogue
              around politics, I created this site as a platform for generating
              a common consensus of current events and political realities
              through a friendly competition. I mean, everyone loves a fun and
              informative game, right?
            </p>
            <Link to={routes.ABOUT}>Read More</Link>
          </div>
        )}

        <div className="links">
          <h3>Quick Links</h3>
          <Link
            to={routes.HOME}
            style={{
              color: "white",
              textDecoration: "none",
              marginTop: "1vh",
              display: "block",
            }}
          >
            Home
          </Link>
          <Link
            to={routes.FAQ}
            style={{
              color: "white",
              textDecoration: "none",
              marginTop: "1vh",
              display: "block",
            }}
          >
            FAQs
          </Link>
          {localStorage.hasOwnProperty("authUser") ? null : (
            <Link
              to={routes.ABOUT}
              style={{
                color: "white",
                textDecoration: "none",
                marginTop: "1vh",
                display: "block",
              }}
            >
              About
            </Link>
          )}
          {localStorage.hasOwnProperty("authUser") ? null : (
            <Link
              to={routes.SIGN_UP}
              style={{
                color: "white",
                textDecoration: "none",
                marginTop: "1vh",
                display: "block",
              }}
            >
              Sign Up
            </Link>
          )}
        </div>

        <div className="sharing">
          <h3>Share on Social Media</h3>

          <div
            className="socials"
            style={{ display: "flex", marginTop: "1vh" }}
          >
            <FacebookShareButton
              url={getHref()}
              className="shareable"
              quote="Check out my politIQ:"
            >
              <FacebookIcon round={true} size={32} />
            </FacebookShareButton>
            <LinkedinShareButton
              url={getHref()}
              className="shareable"
              title="Check out my politIQ"
              description="Are you smarter than a Republican? Democrat? Independent? Find out!"
            >
              <LinkedinIcon round={true} size={32} />
            </LinkedinShareButton>
            <TwitterShareButton
              url={getHref()}
              title="Check out my politIQ:"
              className="shareable"
            >
              <TwitterIcon round={true} size={32} />
            </TwitterShareButton>
            <WhatsappShareButton
              url={getHref()}
              className="shareable"
              title="Check out my politIQ:"
            >
              <WhatsappIcon round={true} size={32} />
            </WhatsappShareButton>
            <EmailShareButton
              url={getHref()}
              className="shareable"
              subject="Check out my politIQ:"
              body="Are you smarter than a Republican? Democrat? Independent? Find out!"
            >
              <EmailIcon round={true} size={32} />
            </EmailShareButton>
          </div>
        </div>
        <div className="bottom-nav">
          <Link
            to={this.state.mostRecentQuizURL || "404"}
            id="play"
            disabled={this.state.noQuizzes}
          >
            Play Now
          </Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/about">About PolitIQ</Link>
        </div>
      </div>
    );
  }
}

export default Footer;
