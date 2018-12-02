import React, { Component } from 'react';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const rows = [
  { id: 'username', numeric: false, disablePadding: true, label: 'Username', className: "hidden" },
  { id: 'email', numeric: false, disablePadding: true, label: 'Email Address' },
  { id: 'affiliation', numeric: false, disablePadding: true, label: "Affiliation", className: 'hidden' },
  { id: 'monthlyscore', numeric: true, disablePadding: false, label: 'Monthly Score', style: 'true' },
  { id: 'alltimescore', numeric: true, disablePadding: false, label: 'All Time Score', className: 'toggleMargins' },
  { id: 'lastactive', numeric: true, disablePadding: false, label: 'Last Active', className: 'hidden' },
];

class TableHeader extends Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
                style={row.style ? { minWidth: '10px', padding: '4px 0 4px 10px'} : { minWidth: '20px'}}
                className={row.className ? row.className : null}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : "bottom-start"}
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
            );
          }, this)}
        </TableRow>
      </TableHead>
    )
  }
}

export default TableHeader;
