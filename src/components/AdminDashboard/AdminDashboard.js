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
import EditQuiz from './EditQuiz';
import QuestionsToReview from './QuestionsToReview';
import TeamScoreboard from '../TeamScoreboard';

import loadingGif from '../../loadingGif.gif';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addingQuiz: false,
      editingQuiz: false,
      showDash: true,
      showQuiz: false,
      dateArray: [],
      titleArray: [],
      value: 0,
      selectedQuizId: '',
      selectedQuiz: {},
      showDeleteModal: false,
    }
  }

  componentDidMount = () => {
    this.getQuizzesFromDb();
  }

  toggleAddQuiz = () => {
    if (this.state.addingQuiz) {
      this.getQuizzesFromDb()
    }
    this.setState({
      addingQuiz: true,
      showDash: false,
      editingQuiz: false,
      showQuiz: false,
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
    if(this.state.editingQuiz) {
      this.getQuiz()
    }
    this.setState({
      addingQuiz: false,
      showDash: false,
      showQuiz: true,
      editingQuiz: false,
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

  toggleEditQuiz = () => {
    this.setState({
      addingQuiz: false,
      editingQuiz: true,
      showDash: false,
      showQuiz: false,
    })
  }

  toggleDeleteModal = () => {
    this.setState({
      showDeleteModal: !this.state.showDeleteModal
    })
  }

  deleteQuiz = (selected) => {
    for (let i = 0; i < selected.length; i++) {
      this.removeQuizzes(selected[i])
      db.deleteQuiz(selected[i])
    }
    this.setState({
      selected: [],
    })
  }

  removeQuizzes = (date) => {
    const index = this.state.dateArray.indexOf(date)
    const dates = this.state.dateArray
    dates.splice(index, 1)
    const titles = this.state.titleArray
    titles.splice(index, 1)
    this.setState({
      dateArray: [...dates],
      titleArray: [...titles]
    })
  }

  handleChange = (event, value) => {
   this.setState({ value });
  };

  render() {
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
          <QuizList quizDates={this.state.dateArray} quizTitles={this.state.titleArray} toggleQuizShow={this.getQuiz} removeQuizzes={this.removeQuizzes} toggleDeleteModal={this.toggleDeleteModal} deleteQuiz={this.deleteQuiz} showDeleteModal={this.state.showDeleteModal}/>
        )
      }
    }


    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs fullWidth value={value} onChange={this.handleChange} style={{ marginTop: '8.5vh'}}>
            <Tab label="Dashboard" onClick={this.toggleDashboard} />
            <Tab label="Create New Quiz" onClick={this.toggleAddQuiz} />
            <Tab label="Manage Users" />
          </Tabs>
        </AppBar>
        { this.state.addingQuiz ? <AddQuiz toggleAddQuiz={this.toggleAddQuiz}/>
          : <div>
          { this.state.showQuiz ? <ShowQuiz toggleDashboard={this.toggleDashboard} quiz={this.state.selectedQuiz} quizId={this.state.selectedQuizId} toggleEditQuiz={this.toggleEditQuiz}/>
          : <div>
            {this.state.editingQuiz ? <EditQuiz toggleQuizShow={this.toggleQuizShow} quiz={this.state.selectedQuiz} quizId={this.state.selectedQuizId}/>
            : <div className="dashboard">
                <Paper className="dashContainer">
                  <h3>Available Quizzes</h3>
                    {isLoaded()}
                </Paper>
                <div className="dashContainer2">
                  <TeamScoreboard />
                  <QuestionsToReview />
                  <h3>Other Stuff</h3>
                  Maybe we'll also have a counter or nav of user submitted questions or something
                  idk some other stuff will go here
                </div>
              </div>
            }</div>
          }</div>
        }
      </div>
    )
  }
}



export default AdminDashboard;
