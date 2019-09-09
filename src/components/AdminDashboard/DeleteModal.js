import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import './quizEngine.css';

class DeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  handleDelete = () => {
    if (this.props.users === 'true') {
      // user delete functions will go here
      this.props.handleDeleteUser();
      this.props.toggleDeleteModal();
    } else {
      this.props.deleteQuiz(this.props.selected);
      this.props.toggleDeleteModal();
      if (this.props.reset) {
        this.props.reset();
      }
      if (this.props.fromEditQuiz === 'true') {
        this.props.toggleDashboard();
      }
    }
  }

  render() {
    const List = this.props.selected.map((date, i) => (<p key={i}>{date}</p>));
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
              <h3 className="deleteText">{this.props.users === 'true' ? 'Are you sure you want to delete the selected users?' : 'Are you sure you want to delete the following quizzes?'}</h3>
              {this.props.users === 'true'
                ? null
                : <div className="dateList">
                    {List}
                  </div>
              }
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Button onClick={this.props.toggleDeleteModal} className="deleteButton">Cancel</Button>
                <Button onClick={this.handleDelete} className="deleteButton"><span style={{ color: 'red' }}>Delete</span></Button>
              </div>
            </div>
          : <div>
              <h3 className="deleteText">You have not selected any {this.props.users === 'true' ? 'users' : 'quizzes'} to delete.</h3>
              <Button onClick={this.props.toggleDeleteModal} style={{ width: '100%', padding: '2vh' }}>Close</Button>
            </div>
        }
      </Dialog>
    );
  }
}

DeleteModal.propTypes = {
  users: PropTypes.string.isRequired,
  handleDeleteUser: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
  deleteQuiz: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  reset: PropTypes.func,
  fromEditQuiz: PropTypes.string.isRequired,
  toggleDashboard: PropTypes.func.isRequired,
};

export default DeleteModal;
