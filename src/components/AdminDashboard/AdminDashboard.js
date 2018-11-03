import React, { Component } from 'react';

import { db } from '../../firebase';

import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import TabContainer from '@material-ui/core/TabContainer';

import AddQuiz from './AddQuiz';
import QuizList from './QuizList';
import ShowQuiz from './ShowQuiz';

import loadingGif from '../../loadingGif.gif';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addingQuiz: false,
      showDash: true,
      showQuiz: false,
      dateArray: [],
      titleArray: [],
      value: 0,
      selectedQuizId: '',
      selectedQuiz: {},
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

  // this one gets the list of quizzes to render in the quiz index component
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
      showQuiz: false,
    })
  }

  toggleQuizShow = () => {
    this.setState({
      addingQuiz: false,
      showDash: false,
      showQuiz: true,
    })
  }

  // this one gets an individual quiz so that the admin can view it.
  getQuiz = (date) => {
    db.getQuiz(date)
      .then(response => {
        const quiz = response.val()
        this.setState({
          selectedQuiz: quiz,
          selectedQuizId: date,
        })
        this.toggleQuizShow();
      })
  }

  handleChange = (event, value) => {
   this.setState({ value });
  };

  render() {
    console.log(this.state, 'this is state in admin dashboard')
    const { value } = this.state;

    const isLoaded = () => {
      if (this.state.dateArray.length === 0) {
        return (
          <div className="gifStyle">
            <img src={loadingGif} alt="loading gif"/>
          </div>

        )

      } else {
        return (
          <QuizList quizDates={this.state.dateArray} quizTitles={this.state.titleArray} toggleQuizShow={this.getQuiz}/>
        )
      }
    }


    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs fullWidth value={value} onChange={this.handleChange}>
            <Tab label="Dashboard" onClick={this.toggleDashboard} />
            <Tab label="Create New Quiz" onClick={this.toggleAddQuiz} />
            <Tab label="Manage Users" />
          </Tabs>
        </AppBar>
        { this.state.addingQuiz ? <AddQuiz toggleAddQuiz={this.toggleAddQuiz}/>
          : <div>
          { this.state.showQuiz ? <ShowQuiz toggleDashboard={this.toggleDashboard} quiz={this.state.selectedQuiz} quizId={this.state.selectedQuizId}/> :
            <div className="dashboard">
              <Paper className="dashContainer">
                <h3>Available Quizzes</h3>
                  {isLoaded()}
              </Paper>
              <Paper className="dashContainer">
                <h3>Other Stuff</h3>
                Maybe we'll also have a counter or nav of user submitted questions or something
                idk some other stuff will go here
              </Paper>

            </div>
          }</div>
        }

      </div>
    )
  }
}



export default AdminDashboard;
