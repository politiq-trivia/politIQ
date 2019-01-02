import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';

class DeleteCommentModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true
        }
    }

    handleClickDelete = () => {
        this.props.deleteComment(this.props.uid, this.props.date)
        this.props.getComments(this.props.uid)
        this.props.toggleDeleteModal()
    }
    render() {
        return (
            <Dialog
                aria-labelledby="delete comment"
                aria-describedby="delete comment"
                className="deleteCommentModal"
                open={this.state.open}
                onClose={this.handleClose}
            >
                <Close style={{ marginLeft: 'auto', padding: '2vh'}} onClick={this.props.toggleDeleteModal}/>
                <p style={{ padding: '3vh', paddingTop: '0'}}>Are you sure you want to delete your comment?</p>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Button color="primary" onClick={this.props.toggleDeleteModal} style={{ width: '48%'}}>Back</Button>
                    <Button onClick={this.handleClickDelete}style={{ width: '48%'}}><span style={{ color: 'red'}}>Delete</span></Button>
                </div>

            </Dialog>
        )
    }
}

export default DeleteCommentModal;