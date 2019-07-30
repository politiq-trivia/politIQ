import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import moment from 'moment';
import MediaQuery from 'react-responsive';
import Helmet from 'react-helmet';

import { db, withFirebase } from '../../firebase';
import { LEADERBOARD } from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { withAuthorization, withEmailVerification } from '../Auth/index';

import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddQuiz from './AddQuiz';
import QuizList from './QuizList';
import ShowQuiz from './ShowQuiz';
import EditQuiz from './EditQuiz';
import ManageQuizzes from './ManageQuizzes';
import QuestionsToReview from './QuestionsToReview';
import ContestedQuestions from './ContestedQuestions';
import Scoreboard from '../Leaderboard/Scoreboard';
import UserShow from './UserShow/UserShow';
import PartyLeaders from '../Leaderboard/PartyLeaders';
import CashOutRequest from './CashOutRequest';
import CashOutReview from './CashOutReview';


import loadingGif from '../../loadingGif.gif';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addingQuiz: false,
      editingQuiz: false,
      showDash: true,
      showQuiz: false,
      showUsers: false,
      showLeaders: false,
      managingQuizzes: false,
      manageCashOut: false,
      dateArray: [],
      titleArray: [],
      value: 0,
      selectedQuizId: '',
      selectedQuiz: {},
      showDeleteModal: false,
      cashoutData: {},
    }
  }

  componentDidMount = () => {
    this.getQuizzesFromDb();
    this.redirectComponents();
    this.getCashOutRequests();
  }

  componentDidUpdate (prevProps) {
    if (this.props.renderPage !== prevProps.renderPage) {
      this.redirectComponents()
    } else return false;
  }

  // the mobile nav changes the component using react router. 
  // this function tells the admin dashboard which component to load based
  // on the props it receives from react router.
  redirectComponents = () => {
    const renderPage = this.props.renderPage
    if (renderPage === "Create New Quiz") {
      this.toggleAddQuiz()
    } else if (renderPage === "Manage Quizzes") {
      this.toggleManageQuizzes()
    } else if (renderPage === "Manage Users") {
      this.toggleUserShow()
    } else if (renderPage === "Leaderboard") {
      this.toggleLeaderShow()
    } else if (renderPage === "") {
      this.toggleDashboard()
    }
  }

  toggleAddQuiz = () => {
    if (this.state.addingQuiz) {
      this.getQuizzesFromDb()
    }
    this.setState({
      addingQuiz: !this.state.addingQuiz,
      showDash: !this.state.showDash,
      editingQuiz: false,
      showQuiz: false,
      showLeaders: false,
      managingQuizzes: false,
      manageCashOut: false,
    })
  }

  // this one gets the list of quizzes to render in the quiz index component
  getQuizzesFromDb = async () => {
    const data = JSON.parse(localStorage.getItem('quizzes'))

    const allDates = Object.keys(data);
    const dateArray = allDates.filter(date => date > moment().startOf('month').format('YYYY-MM-DDTHH:mm'));
    let titleArray = [];
    for (let i = 0; i < dateArray.length; i++) {
      let date = dateArray[i]
      const title = data[date]["quiz-title"]
      titleArray.push(title)
    }

    this.setState({
      dateArray: dateArray.reverse(),
      titleArray: titleArray.reverse(),
    })
  }

  toggleDashboard = () => {
    this.setState({
      addingQuiz: false,
      showDash: true,
      showQuiz: false,
      showUsers: false,
      showLeaders: false,
      editingQuiz: false,
      managingQuizzes: false,
      manageCashOut: false,
    })
  }

  toggleUserShow = () => {
    this.setState({
      addingQuiz: false,
      showDash: false,
      showQuiz: false,
      showUsers: true,
      showLeaders: false,
      managingQuizzes: false,
      manageCashOut: false,
    })
  }

  toggleQuizShow = (id) => {
    if(this.state.editingQuiz) {
      this.getQuiz(id)
    }
    this.setState({
      addingQuiz: false,
      showDash: false,
      showQuiz: true,
      editingQuiz: false,
      showUsers: false,
      showLeaders: false,
      managingQuizzes: false,
      manageCashOut: false,
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
      showUsers: false,
      showLeaders: false,
      managingQuizzes: false,
      manageCashOut: false,
    })
  }

  toggleDeleteModal = () => {
    this.setState({
      showDeleteModal: !this.state.showDeleteModal,
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

  toggleLeaderShow = () => {
    this.setState({
      addingQuiz: false,
      editingQuiz: false,
      showDash: false,
      showQuiz: false,
      showUsers: false,
      showLeaders: true,
      managingQuizzes: false,
      manageCashOut: false,
    })
  }

  toggleManageQuizzes = () => {
    this.setState({
      managingQuizzes: true,
      addingQuiz: false,
      editingQuiz: false,
      showDash: false,
      showQuiz: false,
      showUsers: false,
      showLeaders: false,
      manageCashOut: false,
    })
  }

  toggleCashOut = () => {
    this.setState({
      managingQuizzes: false,
      addingQuiz: false,
      editingQuiz: false,
      showDash: false,
      showQuiz: false,
      showUsers: false,
      showLeaders: false,
      manageCashOut: true,
    })
  }

  getCashOutRequests = async () => {
    await db.getAllCashoutRequests()
        .then(response => {
            const data = response.val()
            this.setState({
              cashoutData: data
            })
        }) 
  }

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
          <QuizList 
            quizDates={this.state.dateArray} 
            quizTitles={this.state.titleArray} 
            toggleQuizShow={this.getQuiz} 
            removeQuizzes={this.removeQuizzes} 
            toggleDeleteModal={this.toggleDeleteModal} 
            deleteQuiz={this.deleteQuiz} 
            showDeleteModal={this.state.showDeleteModal}
          />
        )
      }
    }

    return (
      <div>
        <Helmet>
          <title>Admin Dashboard | politIQ trivia</title>
        </Helmet>
        <MediaQuery minWidth={415}>
          <AppBar position="static" color="default">
            <Tabs variant="fullWidth" value={value} onChange={this.handleChange} style={{ marginTop: '8.5vh'}}>
              <Tab label="Dashboard" onClick={this.toggleDashboard} />
              <Tab label="Create New Quiz" onClick={this.toggleAddQuiz} />
              <Tab label="Manage Quizzes" onClick={this.toggleManageQuizzes} />
              <Tab label="Manage Users" onClick={this.toggleUserShow}/>
              <Tab label="Leaders" onClick={this.toggleLeaderShow} />
            </Tabs>
          </AppBar>
        </MediaQuery>
        {this.state.manageCashOut ? <CashOutReview cashoutData={this.state.cashoutData}/> 
          : <div>
          { this.state.addingQuiz ? <AddQuiz toggleAddQuiz={this.toggleAddQuiz} toggleDashboard={this.toggleDashboard}/>
            : <div>
            { this.state.showQuiz ? <ShowQuiz toggleDashboard={this.toggleDashboard} quiz={this.state.selectedQuiz} quizId={this.state.selectedQuizId} toggleEditQuiz={this.toggleEditQuiz}/>
            : <div>
              {this.state.editingQuiz ? <EditQuiz toggleQuizShow={this.toggleQuizShow} quiz={this.state.selectedQuiz} quizId={this.state.selectedQuizId} toggleDeleteModal={this.toggleDeleteModal} deleteQuiz={this.deleteQuiz} showDeleteModal={this.state.showDeleteModal} toggleDashboard={this.toggleDashboard}/>
              : <div>
              { this.state.showUsers ? <UserShow />
                : <div>
                {this.state.showLeaders ? <PartyLeaders />
                  : <div>
                    { this.state.managingQuizzes 
                      ? <ManageQuizzes 
                          toggleQuizShow={this.toggleQuizShow} 
                          getQuiz={this.getQuiz}
                          toggleDeleteModal={this.toggleDeleteModal}
                          deleteQuiz={this.deleteQuiz}
                          showDeleteModal={this.state.showDeleteModal}
                        />
                      : <div className="dashboard">
                          <Paper className="dashContainer">
                            {isLoaded()}
                          </Paper>
                          <div className="dashContainer2">
                            <Link to={LEADERBOARD} style={{textDecoration: 'none'}}>
                              <Scoreboard />
                            </Link>
                            <QuestionsToReview />
                            <ContestedQuestions />
                            <CashOutRequest toggleCashOut={this.toggleCashOut} cashoutData={this.state.cashoutData}/>
                          </div>
                      </div>
                    }</div>
                  } </div>
                }</div>
              }</div>
            }</div>
          }</div> 
        }
      </div>
    )
  }
}

const condition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(
  // withEmailVerification,
  withAuthorization(condition),
  withFirebase,
)(AdminDashboard);
