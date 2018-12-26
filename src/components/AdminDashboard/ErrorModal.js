import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

class ErrorModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.props.handleSubmit(event)
        this.props.toggleErrorModal()
    }

    render() {
        return(
            <Dialog
                aria-labelledby="error-modal"
                aria-describedby="show error"
                open={this.state.open}
                onClose={this.handleClose}
            >
                <div style={{ padding: '2vh 3vw 4vh 3vw' }}>
                    <h3 className="deleteText">Uh oh!</h3>
                    <p>A quiz already exists for the date you have selected. If you add a new quiz for this date, the existing one will be overwritten.<br/><br/> Are you sure you want to proceed?</p>
                    <div className="error-button-holder">
                        <Button color="primary" onClick={this.props.toggleDashboard}>Cancel</Button>
                        <Button color="primary" onClick={this.props.toggleErrorModal}>Choose a Different Date</Button>
                        <Button color="primary" onClick={this.handleSubmit}>Yes, continue</Button>
                    </div>
                </div>
            </Dialog>
        )
    }
}

export default ErrorModal;