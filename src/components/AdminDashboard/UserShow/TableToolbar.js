import React, { Component } from 'react';
import { db } from '../../../firebase';
import moment from 'moment';

import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import SendIcon from '@material-ui/icons/Send';
import MediaQuery from 'react-responsive';

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

class TableToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: ''
    }
  }
  resetScore = (time) => {
    const selected = this.props.selected

    db.getScores()
      .then(response => {
        const scoreData = response.val()
        selected.forEach((user, i) => {
          if (scoreData[selected[i]]) {
            const uid = selected[i]
            const userScores = scoreData[selected[i]]
            if (time === "alltime") {
              Object.keys(userScores).forEach((score, i) => {
                db.resetScores(uid, score)
                this.props.refreshTable()
              })
            } else if (time === "monthly") {
              Object.keys(userScores).forEach((score, i) => {
                if (score > moment().startOf('month').format('YYYY-MM-DD')) {
                  db.resetScores(uid, score)
                  this.props.refreshTable()
                }
              })
            }
          }
        })
      })
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  handleSubmit = () => {
    if (this.state.action === "Delete User") {
      this.props.toggleDeleteModal()
    } else if (this.state.action === "Reset Monthly Score") {
      this.resetScore("monthly")
    } else if (this.state.action === "Reset All Time Score") {
      this.resetScore('alltime')
    } else if (this.state.action === "View User") {
      if (this.props.selected.length > 1) {
        console.log('replace this with an alert or modal or message later, but tell the user they cant view more than one at a time')
      } else {
        this.props.handleViewUser(this.props.selected[0])
      }
    }
  }

  render() {
    const { numSelected } = this.props;
    return (
      <Toolbar style={{ padding: '0 0 0 1vw'}}>
        <div className={toolbarStyles.title} >
          {numSelected > 0 ? (
            <p>{numSelected} selected</p>
          ) : (
            <h3>All Users</h3>
          )}
        </div>
        <div className={toolbarStyles.spacer} />
        <div className={toolbarStyles.actions}>
          {numSelected > 0 ? (
            <div>
              <MediaQuery minWidth={416}>
                <Tooltip title="Delete">
                  <IconButton aria-label="Delete">
                    <DeleteIcon onClick={this.props.toggleDeleteModal}/>
                  </IconButton>
                </Tooltip>
                <Button color="primary" onClick={() => this.resetScore("monthly")}>Reset Monthly Score</Button>
                <Button color="primary" onClick={() => this.resetScore("alltime")}>Reset All Time Score</Button>
              </MediaQuery>
              <MediaQuery maxWidth={415}>
                <FormControl style={{ marginLeft: '3vw', marginBottom: '2vh'}}>
                  <InputLabel>Select Action </InputLabel>
                  <Select
                    native
                    value={this.state.action}
                    onChange={this.handleChange('action')}
                    inputProps={{
                      name: "action"
                    }}
                  >
                    <option value="" />
                    <option value="View User">View User</option>
                    <option value="Delete User">Delete User</option>
                    <option value="Reset Monthly Score">Reset Monthly Score</option>
                    <option value="Reset All Time Score">Reset All Time Score</option>
                  </Select>
                </FormControl>
                <IconButton
                  aria-label="Submit"
                  disabled={this.state.action === ""}
                  color="primary"
                  onClick={this.handleSubmit}
                >
                  <SendIcon style={{ marginTop: '1vh'}}/>
                </IconButton>
              </MediaQuery>

            </div>
          ) : null }
        </div>
      </Toolbar>
    )
  }
}

export default TableToolbar;
