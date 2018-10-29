import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { db } from '../firebase';
import * as routes from '../constants/routes';

import loadingGif from '../loadingGif.gif';

import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import './quiz.css';

class QuizArchive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateArray: [],
      titleArray: []
    }
  }

  componentDidMount = () => {
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
      })
  }

  handleClick = (event) => {
    console.log(event.target.parentNode.id)
    const id = event.target.parentNode.id;
    this.props.history.push('/quiz/' + id)
  }

  render() {
    console.log(this.state, 'this is state')
    console.log(this.props, 'this props')
    const List = this.state.dateArray.map((date, i) => {
      let id = date;
      let title = this.state.titleArray[i]
      return (
        <TableRow id={date} key={id}>
          <TableCell onClick={this.handleClick}>
            {date}
          </TableCell>
          <TableCell onClick={this.handleClick}>
            {title}
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
        console.log(List, 'this is list')
        return (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Quiz Date
                </TableCell>
                <TableCell>
                  Quiz Title
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {List}
            </TableBody>
          </Table>
        )
      }
    }
    return (
      <Paper className="home" style={{ paddingLeft: '8vw', paddingRight: '8vw'}}>
        <div className="archive-header">
          <Link to={routes.HOME} style={{ textDecoration: 'none' }}><Button variant="contained" color="primary">Home</Button></Link>
          <h1 style={{ display: 'inline'}}>Quiz Archive</h1>
          <Link to={routes.LEADERBOARD} style={{ textDecoration: 'none' }}><Button variant="contained" color="primary">Leaderboard</Button></Link>
        </div>
        {isLoading()}
      </Paper>
    )
  }
}


export default withRouter(QuizArchive);
