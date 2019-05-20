import React, { Component } from 'react';

import Paper  from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import Toolbar from '@material-ui/core/Toolbar';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Tooltip from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';

import { db } from '../../firebase';
import './dashboard.css';
import loadingGif from '../../loadingGif.gif';
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

class ManageQuizzes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            titleArray: [],
            dateArray: [],
            page: 0,
            rowsPerPage: 20,
            selected: [],
            searchCategory: 'date',
            search: '',
        }
    }

    componentDidMount () {
        this.getQuizzesFromDb()
    }

    getQuizzesFromDb = async () => {
        await db.getQuizzes()
            .then(response => {
                if (response.val() !== null) {
                    const data = response.val()
                    const dateArray = Object.keys(data)
                    let titleArray = [];
                    for (let i = 0; i < dateArray.length; i++) {
                        let date = dateArray[i]
                        const title = data[date]["quiz-title"]
                        titleArray.push(title)
                    }
                    this.setState({
                        dateArray: dateArray.reverse(),
                        titleArray: titleArray.reverse()
                    })
                }
            })
    }

    handleClick = (event) => {
        const id = event.target.parentNode.id;
        this.props.getQuiz(id)
    }

    handleCheck = (event) => {
        const id = event.target.id;
        let selected = [...this.state.selected];
        if(selected.includes(id)) {
            const index = selected.indexOf(id)
            selected.splice(index, 1)
        } else {
            selected.push(id)
        }
        this.setState({
            selected: [...selected]
        })
    }

    handleSelectAllClick = (event) => {
        if (event.target.checked) {
            this.setState({
                selected: [...this.state.dateArray],
                selectAll: true,
            })
        } else {
            this.setState({
                selected: [],
                selectAll: false,
            })
        }
    }

    handleChangePage = (event, page) => {
        this.setState({ page })
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: event.target.value });
    }

    reset = () => {
        this.getQuizzesFromDb()
        this.setState({
            selected: [],
            numSelected: 0,
        })
    }

    handleInput = event => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    render () {
        const { rowsPerPage, page, dateArray, titleArray } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, dateArray.length - page * rowsPerPage);

        let filteredQuizDates = []
        let filteredQuizTitles = []

        if (this.state.search === '') {
            filteredQuizDates = dateArray;
            filteredQuizTitles = titleArray;
        } else if (this.state.searchCategory === "title") {
            // loop through the quiz titles 
            titleArray.forEach((title, i) => {
                if (title.toLowerCase().includes(this.state.search.toLocaleLowerCase())) {
                    filteredQuizTitles.push(title)
                    filteredQuizDates.push(dateArray[i])
                }
            })
        } else if (this.state.searchCategory === "date") {
            dateArray.forEach((date, i) => {
                if (date.slice(0, 10).includes(this.state.search)) {
                    filteredQuizDates.push(date)
                    filteredQuizTitles.push(titleArray[i])
                }
            })
        }

        const newList = filteredQuizDates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        const newTitles = filteredQuizTitles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        const List = newList.map((date, i) => {
            let id = date;
            let title = newTitles[i];
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
            <Paper className="userShow">
                <h3>All Quizzes</h3>
                { this.props.showDeleteModal 
                    ? <DeleteModal 
                        selected={this.state.selected} 
                        deleteQuiz={this.props.deleteQuiz} 
                        toggleDeleteModal={this.props.toggleDeleteModal} 
                        reset={this.reset} 
                    /> 
                    : <div>
                        { dateArray.length === 0 ? <img src={loadingGif} alt="loading" /> : 
                            <div>
                                <TextField 
                                    id="search"
                                    label="Search"
                                    value={this.state.search}
                                    onChange={this.handleInput}
                                    margin="dense"
                                    variant="outlined"
                                    style={{ width: '72%', height: '6vh', marginTop: '0' }}
                                />
                                <Select 
                                    value={this.state.searchCategory}
                                    onChange={this.handleChange}
                                    style={{ float: 'right', height: '6vh' }}
                                    input={
                                        <OutlinedInput
                                            name="searchCategory"
                                            id="searchCategory"
                                            labelWidth={100}
                                        />
                                    }
                                >
                                    <MenuItem value={"title"}>Quiz Title</MenuItem>
                                    <MenuItem value={"date"}>Date</MenuItem>
                                </Select>
                                <Toolbar>
                                    <div className={toolbarStyles.title}>
                                        {this.state.selected.length > 0 ? (
                                            <p>{this.state.selected.length} selected</p>
                                        ) : null }
                                    </div>
                                    <div className={toolbarStyles.spacer} />
                                    <div className={toolbarStyles.actions}>
                                        {this.state.selected.length > 0 ? (
                                            <div>
                                                <Tooltip title="Delete">
                                                    <IconButton aria-label="Delete" onClick={this.props.toggleDeleteModal}>
                                                        <DeleteIcon />
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
                                            <TableCell style={{ minWidth: '60px'}} padding="none">
                                                Quiz Date
                                            </TableCell>
                                            <TableCell style={{ minWidth: '60px' }} padding="default">
                                                Quiz Title
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {List}
                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 49 * emptyRows}}>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <TablePagination 
                                    component="div"
                                    count={this.state.search !== '' ? filteredQuizDates.length : this.state.dateArray.length}
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
                }
            </Paper>
        )
    }
}

export default ManageQuizzes;