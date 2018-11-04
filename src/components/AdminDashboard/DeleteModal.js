import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import './quizEngine.css';

class DeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    }
  }
  handleDelete = () => {
    // delete function from previous component
    this.props.deleteQuiz(this.props.selected)
    this.props.toggleDeleteModal()
  }


  render() {
    const List = this.props.selected.map((date, i) => {
      return (
        <p key={i}>{date}</p>
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
        {this.props.selected.length !== 0
          ? <div>
            <h3 className="deleteText">Are you sure you want to delete the following quizzes?</h3>
            <div className="dateList">
              {List}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row'}}>
              <Button onClick={this.props.toggleDeleteModal} className="deleteButton">Cancel</Button>
              <Button onClick={this.handleDelete} className="deleteButton"><span style={{ color: 'red' }}>Delete</span></Button>
            </div>
          </div>
        : <div>
            <h3 className="deleteText">You have not selected any quizzes to delete.</h3>
            <Button onClick={this.props.toggleDeleteModal} style={{ width: '100%', padding: '2vh'}}>Close</Button>
          </div>
      }
      </Dialog>
    )
  }

}

export default DeleteModal;
