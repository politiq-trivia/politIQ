import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import getMostRecentQuizId from '../../utils/mostRecentQuizId';

import Button from '@material-ui/core/Button';

class TodaysQuizButton extends Component {
    state = {
        mostRecentQuizURL: '',
        noAvailableQuizzes: false,
    }

    componentDidMount() {
        this.getMostRecentQuizId()
    }

    shouldComponentUpdate (nextProps, nextState) {
        // see if there have been new scores added since the last time the component was rendered
        if (nextState.mostRecentQuizURL !== this.state.mostRecentQuizURL) {
            return true;
        } else return false;
    }

    componentWillUnmount = () => {
        this.setState({
            undefined
        })
    }

    getMostRecentQuizId = async () => {
        const quizId = await getMostRecentQuizId();
        if (quizId === 'No Available Quizzes') {
            this.setState({
                noAvailableQuizzes: true,
            })
            if (this.props.showErrorMessage) {
                this.props.showErrorMessage()
            }
        } else {
            this.setState({
                mostRecentQuizURL: quizId
            })
        } 
    }
    
    redirectToQuiz = () => {
        this.props.history.push(`/${this.state.mostRecentQuizURL}`)
    }

    render() {
        const { buttonText, id } = this.props;
        return (
            <Button color="primary" variant="outlined" size="large" id={id} disabled={this.state.mostRecentQuizURL === "" || this.state.noAvailableQuizzes} onClick={this.redirectToQuiz}>{buttonText}</Button>
        )
    }
}

export default withRouter(TodaysQuizButton);