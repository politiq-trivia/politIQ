
import React, { Component } from 'react';
import { Router, browserHistory, Route, Link } from 'react-router';
import logo from './logo.png';
import './App.css';

const Page = ({ title }) => (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>{title}</h2>
      </div>
      <p className="App-intro">
        This is the {title} page.
      </p>
      <p>
        <Link to="/">Home</Link>
      </p>
      <p>
        <Link to="/about">About</Link>
      </p>
      <p>
        <Link to="/profile">Profile</Link>
      </p>
      <p>
        <Link to="/play">Play Game</Link>
      </p>
      <p>
        <Link to="/quiz-archive">Quiz Archive</Link>
      </p>
      <p>
        <Link to="/submit-question">Submit Question</Link>
      </p>
      <p>
        <Link to="/leaderboard">Leaderboard</Link>
      </p>
    </div>
);


// components in this section will later become their own files
const Home = (props) => (
  <Page title="Home"/>
);

const About = (props) => (
  <Page title="About"/>
);

const Profile = (props) => (
  <Page title="Profile"/>
);

const SubmitQuestion = (props) => {
  return (
    <Page title="Submit Question" />
  )
}

const Leaderboard = (props) => {
  return (
    <Page title="Leaderboard" />
  )
}

const Play = (props) => {
  return (
    <Page title="Play Game" />
  )
}

const QuizArchive = (props) => {
  return (
    <Page title="Quiz Archive" />
  )
}

class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Home}/>
        <Route path="/about" component={About}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/submit-question" component={SubmitQuestion}/>
        <Route path="/leaderboard" component={Leaderboard}/>
        <Route path="/play" component={Play}/>
        <Route path="/quiz-archive" component={QuizArchive}/>
      </Router>
    );
  }
}

export default App;
