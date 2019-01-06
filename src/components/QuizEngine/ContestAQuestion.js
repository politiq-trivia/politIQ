import React, { Component } from 'react';
import { db } from '../../firebase';

import AuthUserContext from '../Auth/AuthUserContext';
import withAuthorization from '../Auth/withAuthorization';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class ContestAQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contestedQuestion: '',
            issue: '',
            source: '',
        }
    }

    componentDidMount = () => {
        if (this.props.currentQ <= this.props.quizLength) {
            this.setState({
                contestedQuestion: this.props.currentQ
            })
        } 
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value 
        })
    }

    handleSubmit = () => {
        db.contestQuestion(this.props.quizID, this.state.contestedQuestion, this.props.uid, this.state.issue, this.state.source)
        // if it's at the end of the quiz, 
        if (this.props.atEndOfQuiz === true) {
            this.props.back()
        } else {
            // const newState = this.props.state;
            // newState.contestQuestion = false;
            // const newStateJson = JSON.stringify(newState)
            // localStorage.setItem('state', newStateJson)
            localStorage.removeItem('state')
            window.close()
            this.props.toggleContest()
        }
        // else, if it's not, 
        // close the window
        // clear the local storage
        // maybe set the state back if necessary
    }

    renderQ = () => {
        if (this.state.contestedQuestion !== "") {
            return (
                <div>
                    <h3 style={{ marginTop: '3vh'}}>{this.props.quiz[this.state.contestedQuestion]["q1"]}</h3>
                    <p>{this.props.quiz[this.state.contestedQuestion]["a1text"]}{this.props.quiz[this.state.contestedQuestion]["a1correct"] === true ? <span style={{ color: 'green', fontWeight: 'bold' }}>Correct Answer</span> : null}</p>
                    <p>{this.props.quiz[this.state.contestedQuestion]["a2text"]} {this.props.quiz[this.state.contestedQuestion]["a2correct"] === true ? <span style={{ color: 'green', fontWeight: 'bold' }}>Correct Answer</span> : null}</p>
                    <p>{this.props.quiz[this.state.contestedQuestion]["a3text"]} {this.props.quiz[this.state.contestedQuestion]["a3correct"] === true ? <span style={{ color: 'green', fontWeight: 'bold' }}>Correct Answer</span> : null}</p>
                    <p>{this.props.quiz[this.state.contestedQuestion]["a4text"]} {this.props.quiz[this.state.contestedQuestion]["a4correct"] === true ? <span style={{ color: 'green', fontWeight: 'bold' }}>Correct Answer</span> : null}</p>
                </div>
            )
        }
    }

    render() {
        const quizQs = Object.keys(this.props.quiz)
        quizQs.pop()
        const showQs = quizQs.map((q, i) => {
            return (
                <option value={i + 1} key={i}>
                    {this.props.quiz[quizQs[i]]["q1"]}
                </option>
            )
        })

        return (
            <AuthUserContext.Consumer>
                <div style={{ paddingTop: '5vh'}}>
                    <h1>Contest a Question</h1>
                    <p>Think you found a mistake? Let us know below. You can contest each question once. Please provide a credible source to back up your explanation.</p>
                    

                        <div>
                            {this.state.contestedQuestion === "" 
                                ? <FormControl>
                                    <InputLabel htmlFor="question">{this.state.contestedQuestion !== "" ? this.props.quiz[this.state.contestedQuestion]["q1"] : "Select a Question to Contest"}</InputLabel>
                                    <NativeSelect 
                                        onChange={this.handleChange}
                                        name="contestedQuestion"
                                        fullWidth
                                    >
                                        <option value=""/>
                                        {showQs}
                                    </NativeSelect>
                                </FormControl>
                                : null
                            }

                            {this.renderQ()}
                        </div>


                    {this.props.atEndOfQuiz === false || this.state.contestedQuestion !== ""
                        ? <div>
                            <TextField 
                                id="standard-multiline-flexible"
                                label="Please explain the issue with this question"
                                multiline
                                onChange={this.handleChange}
                                margin="normal"
                                name="issue"
                                fullWidth
                            />
                            <TextField 
                                label="Provide a credible source"
                                fullWidth
                                onChange={this.handleChange}
                                margin="normal"
                                name="source"
                            />
                            <Button color="primary" variant="contained" style={{ marginTop: '3vh'}} onClick={this.props.back}>Back</Button>
                            <Button 
                                color="primary" 
                                variant="contained" 
                                onClick={this.handleSubmit} 
                                style={{ marginTop: '3vh', float: 'right'}} 
                                disabled={this.state.issue === "" || this.state.source === ""}
                            >
                                Submit
                            </Button>
                        </div>
                        : null
                    }
                    
                </div>
            </AuthUserContext.Consumer>
        )
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ContestAQuestion);