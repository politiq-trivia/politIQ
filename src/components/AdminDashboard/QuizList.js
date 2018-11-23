import React, { Component } from 'react';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableBody from '@material-ui/core/TableBody';
import Delete from '@material-ui/icons/Delete';

import DeleteModal from './DeleteModal';

class QuizList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numSelected: 0,
      rowCount: 0,
      page: 0,
      rowsPerPage: 10,
      selected: [],
      selectAll: false,
      showDeleteModal: false,
    }
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState({
        selected: [...this.props.quizDates],
        selectAll: true,
      })
      // return;
    } else {
      this.setState({
        selected: [],
        selectAll: false,
      })
    }
  };

  handleCheck = (event) => {
    const id = event.target.id;
    let selected = [...this.state.selected];
    if (selected.includes(id)) {
      const index = selected.indexOf(id)
      selected.splice(index, 1)
    } else {
      selected.push(id)
    }
    this.setState({
      selected: [...selected]
    })
  }

  toggleCheck = (id) => {
    if (this.state.selected.includes(id)) {
      return true;
    } else {
      return false;
    }
  }

  // open up the selected quiz in a new component
  handleClick = (event) => {
    const id = event.target.parentNode.id;
    this.props.toggleQuizShow(id)
  }



  render () {
    const List = this.props.quizDates.map((date, i) => {
      let id = date;
      let title = this.props.quizTitles[i]
      return (
        <TableRow id={date} key={id} className="tableItem">
          <TableCell padding="checkbox">
            <Checkbox
              id={date}
              onClick={this.handleCheck}
              checked={this.state.selected.indexOf(id) !== -1 ? true : false}
            />
          </TableCell>
          <TableCell onClick={this.handleClick} style={{ minWidth: '60px'}} padding="none">
            {date}
          </TableCell>
          <TableCell onClick={this.handleClick}>
            {title}
          </TableCell>
        </TableRow>
      )
    })
    return (
      <div>
        { this.props.showDeleteModal
          ? <DeleteModal selected={this.state.selected} deleteQuiz={this.props.deleteQuiz} toggleDeleteModal={this.props.toggleDeleteModal}/>
          :

          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    onClick={this.handleSelectAllClick}
                  />
                </TableCell>
                <TableCell style={{ minWidth: '60px' }} padding="none">
                  Quiz Date
                </TableCell>
                <TableCell style={{ minWidth: '60px'}} padding="default">
                  Quiz Title
                </TableCell>
                <Delete onClick={this.props.toggleDeleteModal} style={{ float: 'right', marginTop: '15px'}}/>
              </TableRow>
            </TableHead>
            <TableBody>
              {List}
            </TableBody>
          </Table>
        }
      </div>
    )
  }
}

export default QuizList;
