import React from 'react';
import { db } from '../../../firebase';
import moment from 'moment';

import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

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

const TableToolbar = props => {
  const { numSelected } = props;

  const resetScore = (event) => {
    const time = event.target.parentNode.id
    const selected = props.selected

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
                props.refreshTable()
              })
            } else if (time === "monthly") {
              Object.keys(userScores).forEach((score, i) => {
                if (score > moment().startOf('month').format('YYYY-MM-DD')) {
                  db.resetScores(uid, score)
                  props.refreshTable()
                }
              })
            }
          }
        })
      })
  }

  return (
    <Toolbar>
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
            <Tooltip title="Delete">
              <IconButton aria-label="Delete">
                <DeleteIcon onClick={props.handleDeleteUser}/>
              </IconButton>
            </Tooltip>
            <Button color="primary" onClick={resetScore} id="monthly">Reset Monthly Score</Button>
            <Button color="primary" onClick={resetScore} id="alltime">Reset All Time Score</Button>
          </div>
        ) : null }
      </div>

    </Toolbar>

  )
}

export default TableToolbar;
