import React, { Component } from 'react';
import Helmet from 'react-helmet';

import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import { db } from '../../firebase';

import loadingGif from '../../loadingGif.gif';
import './quiz.css';

class ArchivedQuiz extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedQuiz: {},
            selectedQuizId: ""
        }
    }

    componentDidMount = () => {
        const url = window.location.href.split('/')
        const date = url[url.length - 1]
        this.getQuiz(date)
    }
    // get the quiz and display it on the page, admin show style
    getQuiz = (date) => {
        db.getQuiz(date) 
            .then(response => {
                const quiz = response.val()
                this.setState({
                    selectedQuiz: quiz,
                    selectedQuizId: date,
                })
            })
    }

   render() {
        let quizArray = [];
        if (this.state.selectedQuiz) {
            const quiz = this.state.selectedQuiz
            const result = Object.keys(quiz).map(function(key) {
                return [key, quiz[key]]
            });
            result.pop();
            quizArray = [...result]
            console.log(quizArray)
        } else return null;

        const renderQs = quizArray.map((q, i) => {
            return (
                <FormControl className="showQuestion" key={i} id={q[0]} style={{ display: 'block'}}>
                    <FormLabel>{i+1}. {q[1]["q1"]}</FormLabel>
                    <RadioGroup
                        aria-label={q[1]["q1"]}
                        inputref={null}
                    >
                        <div className="show" style={{ display: 'flex' }} inputref={null}>
                            <FormControlLabel value={q[1]["a1text"]} control={<Radio
                                checked={false}
                                icon={<RadioButtonUncheckedIcon />}
                            />} label={q[1]["a1text"]} />
                            {q[1]["a1correct"] ? <p style={{ color: 'green' }}>Correct Answer</p> : null}

                        </div>
                        <div className="show" style={{ display: 'flex' }} inputref={null}>
                            <FormControlLabel value={q[1]["a2text"]} control={<Radio
                                checked={false}
                                icon={<RadioButtonUncheckedIcon />}
                            />} label={q[1]["a2text"]} />
                            {q[1]["a2correct"] ? <p style={{ color: 'green' }}>Correct Answer</p> : null}
                        </div>
                        <div className="show" style={{ display: 'flex'}}>
                            <FormControlLabel value={q[1]["a3text"]} control={<Radio
                                checked={false}
                                icon={<RadioButtonUncheckedIcon />}
                            />} label={q[1]["a3text"]}/>
                            {q[1]["a3correct"] ? <p style={{ color: 'green' }}>Correct Answer</p> : null}
                        </div>
                    </RadioGroup>
                    <p><span style={{ color: 'green', fontWeight: 'bold' }}>Explanation: </span>{q[1]["answerExplanation"]}</p>
                    <hr />
                </FormControl>
            )
        })
       
        return (
            <Paper className="home archive-holder">
                <Helmet>
                    <title>Archived Quizzes | politIQ trivia</title>
                </Helmet>
                <div className="showQuizButtons">
                    <Button id="backButton" onClick={() => this.props.history.goBack()} variant="contained" color="primary">
                        Back
                    </Button>
                    {this.state.selectedQuiz ? <h1 id="quizTitle">{this.state.selectedQuiz['quiz-title']}</h1> : null}
                </div>
                {this.state.selectedQuiz === {} 
                    ? <div className="gifStyle">
                        <img src={loadingGif} alt="loading gif" />
                    </div>
                    : <div className="archive-questionHolder">
                        {renderQs}
                    </div>
                }
            </Paper>
        )
    } 
}


export default ArchivedQuiz;