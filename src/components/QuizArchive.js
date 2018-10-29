import React, { Component } from 'react';
import { db} from '../firebase';

import loadingGif from '../loadingGif.gif';

import Paper from '@material-ui/core/Paper';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

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

  render() {
    console.log(this.state, 'this is state')
    const List = this.state.dateArray.map((date, i) => {
      let id = date;
      let title = this.state.titleArray[i]
      return (
        <TableRow id={date} key={id}>
          <TableCell>
            {date}
          </TableCell>
          <TableCell>
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
        <h1>Quiz Archive</h1>
        {isLoading()}
      </Paper>
    )
  }
}


export default QuizArchive;
