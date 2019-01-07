import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { db } from '../../firebase';
import * as routes from '../../constants/routes';
import { withEmailVerification, withAuthorization } from '../Auth/index';
import { compose } from 'recompose';

import loadingGif from '../../loadingGif.gif';

import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableFooter from '@material-ui/core/TableFooter';
import TablePaginationActions from './TablePaginationActions';
import Button from '@material-ui/core/Button';
import './quiz.css';

class QuizArchive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateArray: [],
      titleArray: [],
      scoreObject: {},
      rowsPerPage: 5,
      page: 0,
    }
  }

  componentDidMount = () => {
    this.setState({
      signedInUser: this.props.signedInUser
    })
    this.getQuizzesFromDb();
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
        this.getTheLoggedInUsersScores()
      })
  }

  getTheLoggedInUsersScores = () => {
    const uid = this.state.signedInUser
    if (uid === "") {
      return;
    }
    db.getScoresByUid(uid)
      .then(response => {
        if (response.val() === null) {
          return;
        }
        const data = response.val()

        this.setState({
          scoreObject: data
        })
      })
  }

  handleClick = (event) => {
    const id = event.target.parentNode.id;
    this.props.history.push('/quiz/' + id)
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: event.target.value
    })
  }

  render() {
    const {dateArray, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, dateArray.length - page * rowsPerPage)

    const List = dateArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((date, i) => {
      let id = date;
      let title = this.state.titleArray[i]
      let score;
      if (this.state.scoreObject[date]) {
        score = this.state.scoreObject[date]
      } else {
        score = "--"
      }
      
      return (
        <TableRow id={date} key={id} className={ score !== "--" ? "taken" : "tableItem" }>
          <TableCell onClick={score === "--" ? this.handleClick : null}>
            {date}
          </TableCell>
          <TableCell onClick={score === "--" ? this.handleClick : null} padding="none">
            {title}
          </TableCell>
          <TableCell onClick={score === "--" ? this.handleClick : null} style={{ paddingLeft: '8vw'}}>
            {score}
          </TableCell>
        </TableRow>
      )
    })



    const isLoading = () => {
      if (this.state.dateArray.length === 0) {
        return (
          <div className="gifStyle">
            <img src={loadingGif} alt="loading gif"/>
          </div>
        )
      } else {
        return (
          <div>
            <Table className="archive-table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ minWidth: '66px'}} padding="default">
                    Quiz Date
                  </TableCell>
                  <TableCell style={{ minWidth: '85px'}} padding="none">
                    Quiz Title
                  </TableCell>
                  <TableCell style={{ minWidth: '40px'}} padding="default">
                    Your Score
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {List}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePaginationActions
                    rowsPerPageOptions={[ 5, 10, 25]}
                    colSpan={3}
                    count={dateArray.length === undefined ?  0 : dateArray.length }
                    rowsPerPage={rowsPerPage}
                    page={page}
                    selectprops={{
                      native: true
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </TableRow>

              </TableFooter>

            </Table>
            { Object.keys(this.state.scoreObject).length !== this.state.dateArray.length ? null : <p className="archive-warning">You have taken all of the available quizzes. Check back tomorrow for the latest challenge!</p>}
          </div>
        )
      }
    }
    return (
      <Paper className="home archive-holder">
        <Helmet>
          <title>Quiz Archive | politIQ</title>
        </Helmet>
        <div className="archive-header">
          <Link to={routes.HOME} style={{ textDecoration: 'none' }}><Button variant="contained" color="primary">Home</Button></Link>
          <Link to={routes.LEADERBOARD} style={{ textDecoration: 'none' }}><Button variant="contained" color="primary">Leaderboard</Button></Link>
        </div>
        <div className="mobile-archive-header">
          <Link to={routes.HOME} style={{ textDecoration: 'none'}} className="mobile-back"><Button color="primary">Back</Button></Link>
          <h1 style={{ display: 'inline'}}>Past Quizzes</h1>
        </div>
        {isLoading()}
      </Paper>
    )
  }
}

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
  withRouter
)(QuizArchive);
