import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import './quizEngine.css';

class DeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    }
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleDelete = () => {
    // delete function from previous component
    this.setState({
      open: false
    })
  }


  render() {
    const List = this.props.selected.map((date, i) => {
      return (
        <p>{date}</p>
      )
    })
    return (
      <Dialog
        aria-labelledby="delete modal"
        aria-describedby="delete quiz"
        className="deleteModal"
        open={this.state.open}
        onClose={this.handleClose}
      >
        <h3 className="deleteText">Are you sure you want to delete the following quizzes?</h3>
        <div className="dateList">
          {List}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row'}}>
          <Button onClick={this.props.toggleDeleteModal} className="deleteButton">Cancel</Button>
          <Button onClick={this.props.toggleDeleteModal} className="deleteButton"><span style={{ color: 'red' }}>Delete</span></Button>
        </div>
      </Dialog>
    )
  }

}

export default DeleteModal;
