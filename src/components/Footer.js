import React from 'react';

import { Link } from 'react-router-dom'
import * as routes from '../constants/routes';

import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from 'react-share';

import {
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  GooglePlusIcon,
  LinkedinIcon,
  EmailIcon,
} from 'react-share';

const getHref = () => {
  return (window.location.href).toString();
}

const isFixed = () => {
  const path = window.location.pathname;
  if (path === '/signin' || path === '/signup' || path === '/admin' || path === '/home' || path === '/profile' || path === '/review' || path.includes('quiz')) {
    return {
      position: 'fixed'
    }
  } else {
    return {
      position: 'relative'
    }
  }

}

// const style = {
//   footerStyle: {
//     position: isFixed()
//   }
// }


const Footer = ({ signedInUser }) =>
  <div className="footer" style={isFixed()}>
    { signedInUser === ""
      ? <div className="description">
          <h3>About Us</h3>
          <p>In an effort to combat polarization and improve the dialogue around politics, I created this site as a platform for generating a common consensus of current events and political realities through a friendly competition. I mean, everyone loves a fun and informative game, right?</p>
        <Link to={routes.ABOUT}>Read More</Link>
        </div>
      : <div className="description">
          <h3>Find some news we should include?</h3>
          <p>Increase your score by clicking the link below to submit your own question. We'll review it and, if accepted, we'll add it to the quiz. Make sure to include a reliable source for your information!</p>
          <Link to={routes.SUBMIT_QUESTION}>Submit a Question Now</Link>
        </div>
    }


    <div className="links">
      <h3>Quick Links</h3>
      <Link to={routes.HOME} style={{ color: 'white', textDecoration: 'none', marginTop: '1vh', display: 'block' }}>Home</Link>
      <Link to={routes.ABOUT} style={{ color: 'white', textDecoration: 'none', marginTop: '1vh', display: 'block' }}>About</Link>
      <Link to={routes.SIGN_UP} style={{ color: 'white', textDecoration: 'none', marginTop: '1vh', display: 'block' }}>Sign Up</Link>
    </div>

    <div className="sharing">
      <h3>Share on Social Media</h3>

      <div className="socials" style={{ display: 'flex', marginTop: '1vh' }}>

        <FacebookShareButton url={ getHref() } className="shareable">
          <FacebookIcon round={true} size={32} />
        </FacebookShareButton>
        <GooglePlusShareButton url={ getHref() } className="shareable">
          <GooglePlusIcon round={true} size={32} />
        </GooglePlusShareButton>
        <LinkedinShareButton url={ getHref() } className="shareable">
          <LinkedinIcon round={true} size={32}/>
        </LinkedinShareButton>
        <TwitterShareButton url={ getHref() } className="shareable">
          <TwitterIcon round={true} size={32} />
        </TwitterShareButton>
        <WhatsappShareButton url={ getHref() } className="shareable">
          <WhatsappIcon round={true} size={32} />
        </WhatsappShareButton>
        <EmailShareButton url={ getHref() } className="shareable">
          <EmailIcon round={true} size={32} />
        </EmailShareButton>

      </div>

    </div>
    <div className="bottom-nav">
      <Link to="/play-game" id="play">Play Now</Link>
      <Link to="/leaderboard">Leaderboard</Link>
      <Link to="/about">About PolitIQ</Link>
    </div>
  </div>

export default Footer;
