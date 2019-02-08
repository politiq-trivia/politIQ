import React, { Component } from 'react';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import TableBody from '@material-ui/core/TableBody';

import DeleteModal from './DeleteModal';

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

class QuizList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numSelected: 0,
      rowCount: 0,
      page: 0,
      rowsPerPage: 5,
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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  reset = () => {
    this.setState({
      selected: [],
      numSelected: 0,
    })
  }

  render () {
    const { rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.props.quizDates.length - page * rowsPerPage);
    const newList = this.props.quizDates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const newTitles = this.props.quizTitles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    const List = newList.map((date, i) => {
      let id = date;
      let title = newTitles[i]
      let shortDate = date.slice(0, 10)
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
            {shortDate}
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
          ? <DeleteModal selected={this.state.selected} deleteQuiz={this.props.deleteQuiz} toggleDeleteModal={this.props.toggleDeleteModal} reset={this.reset}/>
          : <div>
              <Toolbar>
                <div className={toolbarStyles.title}>
                  {this.state.selected.length > 0 ? (
                    <p>{this.state.selected.length} selected </p>
                  ) : (
                    <h3 style={{ marginTop: '0', marginBottom: '0'}}>All Quizzes</h3>
                  )}
                </div>
                <div className={toolbarStyles.spacer} />
                <div className={toolbarStyles.actions}>
                  {this.state.selected.length > 0 ? (
                    <div>
                      <Tooltip title="Delete">
                        <IconButton aria-label="Delete">
                          <DeleteIcon onClick={this.props.toggleDeleteModal} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ) : null }
                </div>
              </Toolbar>
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {List}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={this.props.quizDates.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backbuttoniconprops={{
                  'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                  'aria-label': 'Next Page'
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </div>
        }
      </div>
    )
  }
}

export default QuizList;