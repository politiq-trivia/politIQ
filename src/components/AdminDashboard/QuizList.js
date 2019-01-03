import React, { Component } from 'react';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
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
      rowsPerPage: 4,
      selected: [],
      selectAll: false,
      showDeleteModal: false,
      order: 'asc',
      orderBy: 'quiz-date',
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

  createSortHandler = property => event => {
    this.handleRequestSort(event, property)
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy })
  }

  stableSort = () => {
    return this.props.quizDates.reverse()
  }


  render () {
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.props.quizDates.length - page * rowsPerPage);
    let titleArray;
    if (order === 'asc') {
      titleArray = this.props.quizTitles
    } else if (order === 'desc') {
      titleArray = this.props.quizTitles.reverse()
    }
    const List = <TableBody>
      {this.stableSort()
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

        .map((date, i) => {
          let id = date;
          let title = titleArray[i]
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
      }
      {emptyRows > 0 && (
        <TableRow style={{ height: 49 * emptyRows }}>
          <TableCell colSpan={6} />
        </TableRow>
      )}
    </TableBody>

    const rows = [
      { id: 'quiz-date', numeric: true, disablePadding: true, label: 'Quiz Date' },
      { id: 'quiz-title', numeric: false, disablePadding: false, label: 'Quiz Title' }
    ]
    return (
      <div>
        { this.props.showDeleteModal
          ? <DeleteModal selected={this.state.selected} deleteQuiz={this.props.deleteQuiz} toggleDeleteModal={this.props.toggleDeleteModal}/>
          : null 
        }
        <div>
          <Toolbar>
            <div className={toolbarStyles.title}>
              {this.state.selected.length > 0 
                ? (
                  <p>{this.state.selected.length} selected </p>
                ) : (
                  <h3 style={{ marginTop: '0', marginBottom: '0'}}>All Quizzes</h3>
                )
              }
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
                  {rows.map(row => {
                    return (
                      <TableCell 
                        key={row.id}
                        sortDirection={orderBy === row.id ? order : false}
                        padding={row.disablePadding ? 'none' : 'default'}
                      >
                        <Tooltip
                          title="Sort"
                          enterDelay={300}
                        >
                          <TableSortLabel
                            active={orderBy === row.id}
                            direction={order}
                            onClick={this.createSortHandler(row.id)}
                          >
                            {row.label}
                          </TableSortLabel>
                          
                        </Tooltip>
                      </TableCell>
                    )
                  })}
                </TableRow>
              </TableHead>
                
              {List}
  
            </Table>
            <TablePagination
              component="div"
              count={this.props.quizDates.length}
              rowsPerPage={10}
              page={this.state.page}
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
        
      </div>
    )
  }
}