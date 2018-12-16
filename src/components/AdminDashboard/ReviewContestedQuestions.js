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
                    console.log(data)
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

    // 
    renderContest = () => {
        // this function will go through and pull up the current contested question for each quiz. 
        // the data is stored in an object with dates for each quiz as the keys. 
        // to get to this screen ,the date is already selected. 
        // we want the object now to be each question. 

        // get the first key from each contest object
        const contestedQsForThisQuiz = this.state.data[this.state.selectedQuizId]

        // gets the first contested question
        const questionNum = Object.keys(contestedQsForThisQuiz)[0]
        const question = this.state.selectedQuiz[questionNum]

        const contestedData = Object.values(contestedQsForThisQuiz[questionNum])[0]

        if (question) {
        return (
            <div>
                <p style={{ fontWeight: 'bold' }}>{questionNum}. {question["q1"]}</p>
                <FormControlLabel 
                    label={question["a1text"]}
                    control={<Radio
                        checked={question["a1correct"]}
                    />}
                /><span style={{ color: 'green'}}>{question["a1correct"] ? "Correct Answer" : null }</span>
                <FormControlLabel 
                    label={question["a2text"]}
                    control={<Radio
                        checked={question["a2correct"]}
                    />}
                /><span style={{ color: 'green'}}>{question["a2correct"] ? "Correct Answer" : null }</span>
                <FormControlLabel 
                    label={question["a3text"]}
                    control={<Radio
                        checked={question["a3correct"]}
                    />}
                /><span style={{ color: 'green'}}>{question["a3correct"] ? "Correct Answer" : null }</span>
                <FormControlLabel 
                    label={question["a4text"]}
                    control={<Radio
                        checked={question["a4correct"]}
                    />}
                /><span style={{ color: 'green'}}>{question["a4correct"] ? "Correct Answer" : null }</span>
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
                console.log(quiz, 'this is quiz')
                return (
                    <h4 onClick={this.selectQuiz} key={i} id={quiz}>{quiz}</h4>
                )
            })
        }
        
        if (this.state.loaded && this.state.selectedQuiz !== {} && this.state.selectedQuizId !== "") {
            question = this.renderContest()
            // I want to go through all the contested questions for each quiz. 
            // console.log(this.state.data[this.state.selectedQuizId], Object.keys(this.state.data[this.state.selectedQuizId]))
            // const questions = Object.keys(this.state.data[this.state.selectedQuizId])
            // question = questions.map((contest, i) => {
            //     console.log(this.state.data, 'data')
            //     // console.log(Object.values(this.state.data[contest]))
            //     [""2018-12-08""][3].Wrl9XmpKHdh1xRQFrElTu6G3VbD2.issue
            //     if (this.state.selectedQuiz[contest]) {
            //         return (
            //             <div key={i}>
            //                 <p style={{ fontWeight: 'bold'}}>{this.state.selectedQuiz[contest]['q1']}</p>
            //                 <p>{this.state.selectedQuiz[contest]["a1text"]} <span style={{ color: 'green' }}>{this.state.selectedQuiz[contest]["a1correct"] ? "Correct Answer" : null}</span></p>
            //                 <p>{this.state.selectedQuiz[contest]["a2text"]} <span style={{ color: 'green' }}>{this.state.selectedQuiz[contest]["a2correct"] ? "Correct Answer" : null}</span></p>
            //                 <p>{this.state.selectedQuiz[contest]["a3text"]} <span style={{ color: 'green' }}>{this.state.selectedQuiz[contest]["a3correct"] ? "Correct Answer" : null}</span></p>
            //                 <p>{this.state.selectedQuiz[contest]["a4text"]} <span style={{ color: 'green' }}>{this.state.selectedQuiz[contest]["a4correct"] ? "Correct Answer" : null}</span></p>
            //                 {/* <p>{this.state.</p> */}
            //             </div>
            //         )
            //     }
            // })
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
                                    <Button color="primary"><span style={{ color: 'red' }}>Reject Issue</span></Button>
                                    <Button color="primary">Skip</Button>
                                    <Button color="primary">Accept Issue</Button>
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