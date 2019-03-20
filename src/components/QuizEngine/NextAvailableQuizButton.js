import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { db } from '../../firebase';

import Button from '@material-ui/core/Button';
import './quiz.css';

class NextAvailableQuizButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nextQuizDate: '',
            disabled: false,
        }
    }
    componentDidMount() {
        this.nextQuiz()
    }

    nextQuiz = async () => {
        // get the quizzes
        await db.getQuizzes()
            .then(response => {
                // console.log(response.val())
                const data = response.val()
                const quizDates = Object.keys(data);
                const url = window.location.pathname
                const currentQuizDate = url.slice(6,22)
                const currentDateIndex = quizDates.indexOf(currentQuizDate)
                // get the index of the previous quiz
                const nextQuizIndex = currentDateIndex - 1;
                const nextQuizDate  = quizDates[nextQuizIndex]

                // make sure that there is a quiz at that index (not -1)
                if (!quizDates[nextQuizIndex]) {
                    this.setState({
                        disabled: true,
                    })
                    return;
                }

                if (localStorage.hasOwnProperty('authUser')) {
                    const uid = this.props.uid
                    db.getScoresByUid(uid)
                        .then(response => {
                            const scoreData = response.val();
                            const hasScoresFor = Object.keys(scoreData);
                            const filteredDates = quizDates.filter((date) => {
                                if (hasScoresFor.includes(date)) {
                                    return false;
                                } else {
                                    return true;
                                }
                            })

                            const nextDateWithoutScore = filteredDates[filteredDates.length - 1]
                            if (quizDates.indexOf(nextDateWithoutScore) !== -1) {
                                this.setState({
                                    nextQuizDate: nextDateWithoutScore
                                })
                            } else {
                                this.setState({
                                    disabled: true,
                                })
                            }

                        })
                } else {
                    this.setState({
                        nextQuizUrl: nextQuizDate,
                        nextQuizDate,
                    })
                }
                
            })
    }

    handleClick = () => {
        this.props.getNextQuiz(this.state.nextQuizDate);
        this.props.history.push(this.state.nextQuizDate);
    }

    render() {
        return (
            <>  
                {this.state.disabled 
                    ? <Button variant="contained" disabled={true}>No More Quizzes Available</Button>
                    : <Button variant="contained" id={this.state.disabled ? "keep-playing disabled" : "keep-playing"} onClick={this.handleClick} disabled={this.state.disabled}>Keep Playing</Button>
                }
            </>
        )
    }
}

export default withRouter(NextAvailableQuizButton);