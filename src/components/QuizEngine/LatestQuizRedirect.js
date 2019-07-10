import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import getMostRecentQuizId from '../../utils/mostRecentQuizId';

class LatestQuizRedirect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latest: ""
        }
    }

    componentDidMount() {
        this.getMostRecent()
    }
    
    getMostRecent = async () => {
        await getMostRecentQuizId()
            .then(response => {
                this.setState({
                    latest: response,
                })
            })
    }

    render () {
        return (
            <>
                {this.state.latest === "" 
                    ? <p>this is the redirect</p>
                    : <Redirect to={this.state.latest} />
                }
            </>
        )
    }
}

export default LatestQuizRedirect;