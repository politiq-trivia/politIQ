import React, { Component } from 'react';

import { db } from '../../../firebase';
import moment from 'moment';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

import '../dashboard.css';
import TableHeader from './TableHeader';
import TableToolbar from './TableToolbar';

let counter = 0;

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class UserShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'username',
      selected: [],
      selectedIndex: [],
      data: [],
      page: 0,
      rowsPerPage: 5,
    }
  }

  componentDidMount = () => {
    this.getData()
  }
  // get data from db - need users, email addresses, scores, and last active dates
  getData = async () => {
    await db.onceGetUsers()
      .then(response => {
        const data = response.val()
        const uidList = Object.keys(response.val())
        const componentData = this.state.data
        db.getScores()
          .then(response => {
            const scoreData = response.val()
            uidList.forEach((user, i) => {
              let index = data[uidList[i]]

              // get the date last active
              let lastactive;
              if (index.lastActive) {
                lastactive = index.lastActive
              } else {
                lastactive = ''
              }

              // get the scores
              let monthlyscore, alltimescore;
              if (scoreData[uidList[i]]) {
                const scores = Object.values(scoreData[uidList[i]])
                alltimescore = scores.reduce((a,b) => a + b, 0)

                const quizDates = Object.keys(scoreData[uidList[i]])
                let scoreCounter = 0;
                for (let j = 0; j < quizDates.length; j++) {
                  if (quizDates[j] > moment().startOf('month').format('YYYY-MM-DD')) {
                    if (scoreData[uidList[i]][quizDates[j]]) {
                      scoreCounter += scoreData[uidList[i]][quizDates[j]]
                    }
                  }
                }
                monthlyscore = scoreCounter;
              } else {
                monthlyscore = 0;
                alltimescore = 0;
              }
              let userInfo = {
                id: counter,
                username: index["displayName"],
                email: index["email"],
                affiliation: index["affiliation"],
                monthlyscore: monthlyscore,
                alltimescore: alltimescore,
                lastactive: lastactive,
                uid: uidList[i]
              }
              counter += 1;
              componentData.push(userInfo)
            })
            this.setState({
              data: componentData
            })
          })
      })
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleClick = (event, uid, id) => {
    // const { selected } = this.state;
    // const selectedIndex = selected.indexOf(id);
    // let newSelected = [];
    //
    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, id);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1));
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1),
    //   );
    // }
    // console.log(newSelected, 'newSelected')
    // this.setState({ selected: newSelected });
    // if (this.state.selected.includes(uid)) {
    //   return true;
    // } else {
    //   return false;
    // }
    let selected = [...this.state.selected];
    if (selected.includes(uid)) {
      const index = selected.indexOf(uid)
      selected.splice(index, 1)
    } else {
      selected.push(uid)
    }

    let selectedIndex = [...this.state.selectedIndex];
    if (selectedIndex.includes(id)) {
      const index = selectedIndex.indexOf(id)
      selectedIndex.splice(index, 1)
      console.log(selectedIndex, 'selectedIndex in if')
    } else {
      console.log(id)
      selectedIndex.push(id)
      console.log(selectedIndex, 'selectedIndex in else')
    }

    this.setState({
      selected: [...selected],
      selectedIndex: [...selectedIndex]
    })
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleDeleteUser = (event) => {
    const selected = [...this.state.selected]
    const selectedIndex = this.state.selectedIndex
    selected.forEach((user, i) => {
      db.deleteUser(selected[i])
    })
    const data = this.state.data
    for (let i = 0; i < selectedIndex.length; i++) {
      const index = selectedIndex[i]
      delete data[index]
    }
    this.setState({
      data: data,
      selected: [],
      selectedIndex: [],
    })
  }

  isSelected = (uid) => {
    if (this.state.selected.includes(uid)) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = this.state.rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    return (
      <Paper className="userShow">
        <TableToolbar numSelected={selected.length} handleDeleteUser={this.handleDeleteUser}/>
        <Table>
          <TableHeader
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={this.handleSelectAllClick}
            onRequestSort={this.handleRequestSort}
            rowCount={data.length}
          />
          <TableBody>
            {stableSort(data, getSorting(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(n => {
                const isSelected = this.isSelected(n.uid);
                return (
                  <TableRow
                    id={n.id}
                    hover
                    onClick={event => this.handleClick(event, n.uid, n.id)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.uid}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isSelected} />
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {n.username}
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {n.email}
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {n.affiliation}
                    </TableCell>
                    <TableCell numeric>{n.monthlyscore}</TableCell>
                    <TableCell numeric>{n.alltimescore}</TableCell>
                    <TableCell numeric>{n.lastactive}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backbuttoniconprops={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': "Next Page",
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    )
  }
}

export default UserShow;