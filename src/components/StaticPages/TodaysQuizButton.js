import React, { Component } from 'react';
import { db } from '../../firebase';
import { withRouter } from 'react-router-dom'

import Button from '@material-ui/core/Button';

class TodaysQuizButton extends Component {
    state = {
        mostRecentQuizURL: '',
        noAvailableQuizzes: false,
    }

    componentDidMount() {
        if (this.props.signedInUser) {
            db.getScoresByUid(this.props.signedInUser)
            .then(response => {
              const scoreData = response.val()
              this.setState({
                signedInUser: this.props.signedInUser,
                scoreData,
              })
              this.getMostRecentQuizId()
            })
        } else {
            this.getMostRecentQuizId()
        }
    }

    componentWillUnmount = () => {
        this.setState({
            undefined
        })
    }

    getMostRecentQuizId = async () => {
        await db.getQuizzes()
          .then(response => {
            const data = response.val();
            const dateArray = Object.keys(data);
            let counter = 1;
            let mostRecent = dateArray[dateArray.length-counter]
            if (this.state.scoreData) {
                if (this.state.scoreData[mostRecent]) {
    
                    while (this.state.scoreData[mostRecent] && counter < dateArray.length) {
                      counter++
                      mostRecent = dateArray[dateArray.length-counter]
                      if (this.state.scoreData[mostRecent] === undefined) {
                        break;
                      }
                    }
      
                    if (counter === dateArray.length && Object.keys(this.state.scoreData).indexOf(mostRecent) !== -1) {
                      this.setState({
                        noAvailableQuizzes: true,
                      })
                      this.props.showErrorMessage()
                    }
                  }
            }

            this.setState({
              mostRecentQuizURL: "quiz/" + mostRecent
            })
          })
          
      }
    
      redirectToQuiz = () => {
        this.props.history.push(`/${this.state.mostRecentQuizURL}`)
      }

    render() {
        const { buttonText, id } = this.props;
        return (
            <Button color="primary" variant="outlined" size="large" id={id} disabled={this.state.noAvailableQuizzes} onClick={this.redirectToQuiz}>{buttonText}</Button>
        )
    }
}

export default withRouter(TodaysQuizButton);