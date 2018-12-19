import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { ADMIN_DASHBOARD } from '../../constants/routes';
import MediaQuery from 'react-responsive';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import './dashboard.css';

class ReviewContestedQuestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noQuestionsRemaining: false,
            quizzes: [],
            data: {},
            loaded: false,
            selectedQuizId: '',
            selectedQuiz: {},
            qNum: 0,
        }
    }

    componentDidMount = () => {
        this.getContest()
    }

    getContest = () => {
        db.getContestedQuiz()
            .then(response => {
                if (response.val() === null) {
                    this.setState({
                        noQuestionsRemaining: true,
                    })
                } else {
                    const data = response.val()
                    const quizzes = Object.keys(data)
                    this.setState({
                        quizzes,
                        data,
                        loaded: true,
                    })
                }
            })
    }

    selectQuiz = (event) => {
        this.setState({
            selectedQuizId: event.target.id
        })
        this.getQuiz(event.target.id)
    }

    getQuiz = (date) => {
        db.getQuiz(date)
            .then(response => {
                const data = response.val()
                this.setState({
                    selectedQuiz: data
                })
            })
    }

    skip = () => {
        // the original page renders the first key in the object
        // maybe I need to set that array of keys in state and then remove them and push them to the end
        // or just continue incrementing the index. 
        // once I get to the end of the array, it will go back to the page with all the quizzes with contests.
        // when the user deletes a question, it should still display the next one in the original data set. 

        // challenge: when there are multiple users contesting the same question, we'll need to iterate through all of those before increasing the question

        let qNum = this.state.qNum;
        qNum ++
    
        const contestedQsForThisQuiz = this.state.data[this.state.selectedQuizId] 
        console.log(contestedQsForThisQuiz, 'length')
        if (qNum > Object.keys(contestedQsForThisQuiz).length - 1){ 
            this.getContest()
            this.setState({
                selectedQuiz: {},
                selectedQuizId: "",
                qNum: 0,
            })
            return;
        }
        this.getContest()
        this.setState({
            qNum,
        })
    }

    reject = () => {
        const contestedQs = Object.values(this.state.data)[0]
        const selected = Object.keys(contestedQs)[0]

        db.deleteContest(this.state.selectedQuizId, selected)
        console.log(this.state.qNum)
        console.log(this.state.data[this.state.selectedQuizId])
        this.skip()
    }


    // 
    renderContest = () => {
        // this function will go through and pull up the current contested question for each quiz. 
        // the data is stored in an object with dates for each quiz as the keys. 
        // to get to this screen ,the date is already selected. 
        // we want the object now to be each question. 

        // get the first key from each contest object
        const contestedQsForThisQuiz = this.state.data[this.state.selectedQuizId]
        console.log(contestedQsForThisQuiz, 'contestedQsForThisQuiz')

        // gets the first contested question
        const questionNum = Object.keys(contestedQsForThisQuiz)[this.state.qNum]
        console.log(questionNum, 'this is questionNum')
        const question = this.state.selectedQuiz[questionNum]
        
        let contestedData;
        if (questionNum !== undefined) {
            contestedData = Object.values(contestedQsForThisQuiz[questionNum])[0];
        } else if (questionNum === undefined) {
            return;
        }

        if (question) {
        return (
            <div>
                <p style={{ fontWeight: 'bold' }}>{questionNum}. {question["q1"]}</p>
                <FormControlLabel 
                    label={question["a1text"]}
                    control={<Radio
                        checked={question["a1correct"]}
                    />}
                /><span style={{ color: 'green', marginRight: '1vw'}}>{question["a1correct"] ? "Correct Answer" : null }</span>
                <FormControlLabel 
                    label={question["a2text"]}
                    control={<Radio
                        checked={question["a2correct"]}
                    />}
                /><span style={{ color: 'green', marginRight: '1vw'}}>{question["a2correct"] ? "Correct Answer" : null }</span>
                <FormControlLabel 
                    label={question["a3text"]}
                    control={<Radio
                        checked={question["a3correct"]}
                    />}
                /><span style={{ color: 'green', marginRight: '1vw'}}>{question["a3correct"] ? "Correct Answer" : null }</span>
                <FormControlLabel 
                    label={question["a4text"]}
                    control={<Radio
                        checked={question["a4correct"]}
                    />}
                /><span style={{ color: 'green', marginRight: '1vw'}}>{question["a4correct"] ? "Correct Answer" : null }</span>
                <hr />
                <p style={{ fontWeight: 'bold' }}>From user:</p>
                <p><span style={{ fontWeight: 'bold' }}>Issue:</span> {contestedData.issue}</p>
                <p><span style={{ fontWeight: 'bold' }}>Source: </span>{contestedData.source}</p>
            </div>
        )
        }
    }

    render() {
        let quizzes, question;

        if (this.state.loaded) {
            quizzes = this.state.quizzes.map((quiz, i) => {
                return (
                    <h4 onClick={this.selectQuiz} key={i} id={quiz}>{quiz}</h4>
                )
            })
        }
        
        if (this.state.loaded && this.state.selectedQuiz !== {} && this.state.selectedQuizId !== "") {
            question = this.renderContest()
        }

        
        return (
            <Paper className="review">
                <MediaQuery minWidth={416}>
                    <Link to={ADMIN_DASHBOARD} id="reviewBackButton">
                        <Button variant="contained" color="primary">Back to Dashboard</Button>
                    </Link>
                </MediaQuery>
                {this.state.noQuestionsRemaining 
                    ? <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                        <h1>No Contested Questions to Review</h1>
                        <MediaQuery maxWidth={415}>
                            <Link to={ADMIN_DASHBOARD} id="reviewBackButton">
                                <Button variant="contained" color="primary">Back to Dashboard</Button>
                            </Link>
                        </MediaQuery>
                    </div>
                    : <div>{this.state.selectedQuizId === "" 
                        ? <div>
                            <h1 id="reviewHeading">Quizzes with Contested Questions</h1>
                            <div className="questionHolder">
                                {quizzes}
                            </div>
                          </div>
                        : <div>
                            <h1 id="reviewHeading">Contested Questions</h1>
                            <div className="questionHolder">
                                {question}
                                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                                    <Button color="primary"><span style={{ color: 'red' }} onClick={this.reject}>Reject Issue</span></Button>
                                    <Button color="primary" onClick={this.skip}>Skip</Button>
                                    <Button color="primary" disabled>Accept Issue</Button>
                                </div>
                            </div>
                         </div>
                    } </div>
                }

            </Paper>
        )
    }
}

export default ReviewContestedQuestions;