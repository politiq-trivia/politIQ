import React, { Component } from 'react';

import { db } from '../../firebase';

import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import TabContainer from '@material-ui/core/TabContainer';

import AddQuiz from './AddQuiz';
import QuizList from './QuizList';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addingQuiz: false,
      showDash: true,
      dateArray: [],
      titleArray: [],
      value: 0,
    }
  }

  componentDidMount = () => {
    this.getQuizzesFromDb();
  }

  toggleAddQuiz = () => {
    this.setState({
      addingQuiz: !this.state.addingQuiz,
      showDash: false,
    })
  }

  getQuizzesFromDb = async () => {
    await db.getQuizzes()
      .then(response => {
        const data = response.val();
        const dateArray = Object.keys(data);
        let titleArray = [];
        for (let i = 0; i < dateArray.length; i++) {
          let date = dateArray[i]
          const title = data[date]["quiz-title"]
          titleArray.push(title)
        }
        this.setState({
          dateArray: dateArray,
          titleArray: titleArray,
        })
      })
  }

  toggleDashboard = () => {
    this.setState({
      addingQuiz: false,
      showDash: true,
    })
  }

  handleChange = (event, value) => {
   this.setState({ value });
  };

  render() {
    const { value } = this.state;
    // this.getQuizzesFromDb();
    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs fullWidth value={value} onChange={this.handleChange}>
            <Tab label="Dashboard" onClick={this.toggleDashboard} />
            <Tab label="Create New Quiz" onClick={this.toggleAddQuiz} />
            <Tab label="Manage Users" />
          </Tabs>
        </AppBar>
        { this.state.addingQuiz ? <AddQuiz toggleAddQuiz={this.toggleAddQuiz}/> :
          <div className="dashboard">
            <Paper className="dashContainer">
              <h3>Available Quizzes</h3>
              <QuizList quizDates={this.state.dateArray} quizTitles={this.state.titleArray}/>
            </Paper>
            <Paper className="dashContainer">
              <h3>Other Stuff</h3>
              Maybe we'll also have a counter or nav of user submitted questions or something
              idk some other stuff will go here
            </Paper>

          </div>
        }
      </div>
    )
  }
}



export default AdminDashboard;
