import React, { Component } from 'react';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableBody from '@material-ui/core/TableBody';

class QuizList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numSelected: 0,
      rowCount: 0,
      page: 0,
      rowsPerPage: 10,
      selected: [],
    }
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      console.log('fix thie slsect all thing later')
      // this.setState(state => ({ selected: state.data.map(n => n.id ) }));
      return;
    }
    this.setState({
      selected: []
    });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === 1){
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected })
  }

  render () {
    const List = this.props.quizDates.map((date, i) => {
      let id = date;
      let title = this.props.quizTitles[i]
      return (
        <TableRow id={i} key={id}>
          <TableCell padding="checkbox">
            <Checkbox
              onClick={this.handleClick}
            />
          </TableCell>
          <TableCell>
            {date}
          </TableCell>
          <TableCell>
            {title}
          </TableCell>
        </TableRow>
      )
    })
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                onClick={this.handleSelectAllClick}
              />
            </TableCell>
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

export default QuizList;
